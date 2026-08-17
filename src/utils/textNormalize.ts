// Text normalisation for support search. Applied IDENTICALLY to indexed content
// and to the user's query — any divergence between the two silently breaks
// matching, so there is one pipeline and both callers use it.
//
// Pure and DOM-free: test/supportSearch.test.ts imports this, and tests compile
// under tsconfig.node.json which ships no DOM lib.

import { decodeHtmlEntities } from './htmlText'

/**
 * Function words with no intent content. Deliberately small.
 *
 * Three categories are POINTEDLY absent:
 *
 * - Negation and blockers (not, no, never, cannot, stop, missing). "my workout
 *   isn't showing up" and "which devices does augo sync with" share `workout`
 *   and `sync`; `not` is the only thing separating them. Dropping it collapses
 *   the entire troubleshooting category into the reference articles.
 * - Question words (how, what, why, which...). They carry intent shape —
 *   procedural vs definitional — and IDF already prices them near zero, so
 *   stoplisting them duplicates work the ranking does better.
 * - `augo`. At df = N its IDF is ~0.03, i.e. already free. Stoplisting it would
 *   break a future "what is augo" article that legitimately owns the term.
 */
export const SUPPORT_STOPWORDS: ReadonlySet<string> = new Set([
  'a', 'an', 'the', 'of', 'to', 'in', 'on', 'at', 'for', 'with', 'from', 'by',
  'as', 'and', 'or', 'but', 'if', 'that', 'this', 'these', 'those', 'it', 'its',
  'my', 'me', 'mine', 'your', 'yours', 'our', 'their', 'his', 'her', 'am', 'is',
  'are', 'was', 'were', 'be', 'been', 'being', 'do', 'does', 'did', 'have',
  'has', 'had', 'will', 'would', 'please', 'thanks', 'thank',
])

/** Words that survive lightStem unchanged — mostly product nouns and -s/-is words. */
const STEM_EXCEPTIONS: ReadonlySet<string> = new Set([
  'ios', 'analysis', 'data', 'settings', 'status', 'address', 'this', 'has',
  'was', 'as', 'is', 'gps', 'rpe', 'ftp', 'lthr', 'css', 'less', 'series',
  'strava', 'coros', 'polar', 'wahoo', 'zwift', 'garmin', 'suunto', 'oura',
])

export function foldDiacritics(input: string): string {
  return input.normalize('NFD').replace(/\p{M}/gu, '')
}

/**
 * Expands contractions before apostrophes are stripped.
 *
 * Load-bearing, not cosmetic: "won't" naively becomes the token `wont`, which
 * matches nothing in the corpus. Expanded it becomes `will not`, and `not` is
 * precisely the high-value negation signal the troubleshooting articles rely on.
 *
 * Runs after apostrophe normalisation, so it only has to handle U+0027.
 */
export function expandContractions(input: string): string {
  return input
    .replace(/\bwon't\b/g, 'will not')
    .replace(/\bcan't\b/g, 'can not')
    .replace(/\bshan't\b/g, 'shall not')
    .replace(/\b(\w+)n't\b/g, '$1 not')
    .replace(/\bi'm\b/g, 'i am')
    .replace(/\bi've\b/g, 'i have')
    .replace(/\bi'd\b/g, 'i would')
    .replace(/\bi'll\b/g, 'i will')
    .replace(/\b(\w+)'re\b/g, '$1 are')
    .replace(/\b(\w+)'ve\b/g, '$1 have')
    .replace(/\b(\w+)'ll\b/g, '$1 will')
    .replace(/\bit's\b/g, 'it is')
    .replace(/\blet's\b/g, 'let us')
    // Possessive 's — drop it. "athlete's" and "athlete" are the same concept.
    .replace(/\b(\w+)'s\b/g, '$1')
}

/** Normalises curly and typographic apostrophes to U+0027. */
function normalizeApostrophes(input: string): string {
  return input.replace(/[‘’ʼ´`]/g, "'")
}

/**
 * Light suffix stripping. Deliberately not Porter.
 *
 * At this corpus size Porter buys nothing the explicit synonym layer doesn't
 * already cover, while costing ~200 lines of opaque rules with real failure
 * modes on product nouns. Determinism and reviewability win here.
 *
 * The critical property is that callers compare WHOLE STEMS for equality, never
 * substrings. src/utils/coachSearch.ts matches with String.includes, so "run"
 * matches "overrun" in both directions; that bug class cannot occur here.
 */
export function lightStem(token: string): string {
  if (token.length < 4) return token
  if (STEM_EXCEPTIONS.has(token)) return token

  if (token.length >= 5 && token.endsWith('ies')) return `${token.slice(0, -3)}y`
  if (token.endsWith('sses')) return token.slice(0, -2)
  // Guard nouns whose singular already ends in these; stripping would maul them.
  if (token.endsWith('ss') || token.endsWith('us') || token.endsWith('is')) return token
  if (/(xes|ches|shes|ses)$/.test(token)) return token.slice(0, -2)
  if (token.endsWith('s')) return token.slice(0, -1)
  if (token.length >= 6 && token.endsWith('ing')) return collapseDouble(token.slice(0, -3))
  if (token.length >= 5 && token.endsWith('ed')) return collapseDouble(token.slice(0, -2))
  if (token.length >= 5 && token.endsWith('ly')) return token.slice(0, -2)
  return token
}

/** running -> runn -> run. Only for the doubled-consonant case. */
function collapseDouble(stem: string): string {
  if (stem.length >= 3 && /([bdfglmnprt])\1$/.test(stem)) return stem.slice(0, -1)
  return stem
}

/**
 * Splits into raw tokens with no stopword removal and no stemming.
 *
 * Hyphenated and dotted words emit their parts AND the joined form, so
 * "post-workout", "post workout" and "postworkout" all unify. Digits are kept —
 * "zone 2" and "vo2" would otherwise lose their most specific component.
 */
export function rawTokens(input: string): string[] {
  const prepared = expandContractions(
    normalizeApostrophes(foldDiacritics(decodeHtmlEntities(input))).toLowerCase(),
  )

  const out: string[] = []
  for (const chunk of prepared.split(/[^\p{L}\p{N}'.-]+/u)) {
    if (!chunk) continue
    const cleaned = chunk.replace(/^['.-]+|['.-]+$/g, '').replace(/'/g, '')
    if (!cleaned) continue

    const parts = cleaned.split(/[.-]+/).filter(Boolean)
    if (parts.length > 1) {
      for (const part of parts) if (isKeepable(part)) out.push(part)
      const joined = parts.join('')
      if (isKeepable(joined)) out.push(joined)
    } else if (isKeepable(cleaned)) {
      out.push(cleaned)
    }
  }
  return out
}

/** Single letters carry no signal; single digits do ("zone 2"). */
function isKeepable(token: string): boolean {
  return token.length > 1 || /\d/.test(token)
}

/**
 * The full pipeline: raw tokens, minus stopwords, stemmed.
 *
 * If stopword removal would empty the query, the unfiltered tokens are stemmed
 * and returned instead — "how do i" must not normalise to nothing while the user
 * is mid-sentence.
 */
export function normalizeTokens(input: string): string[] {
  return normalizeTerms(input).map((t) => t.stem)
}

export interface NormalizedTerm {
  /** What the user actually typed, for "Matched on:" and unknown-term reporting. */
  surface: string
  stem: string
}

/**
 * Tokens paired with the surface form they came from.
 *
 * Callers need both and MUST NOT try to zip rawTokens() against
 * normalizeTokens() by index — stopword removal makes the two arrays different
 * lengths, so the pairing silently skews and every reported term is wrong.
 */
export function normalizeTerms(input: string): NormalizedTerm[] {
  const raw = rawTokens(input)
  const kept = raw.filter((t) => !SUPPORT_STOPWORDS.has(t))
  const source = kept.length > 0 ? kept : raw
  return source.map((surface) => ({ surface, stem: lightStem(surface) }))
}
