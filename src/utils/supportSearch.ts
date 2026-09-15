// BM25F scoring with phrase, synonym and typo channels.
//
// Pure and deterministic: same (query, index) always yields the same order.
// That is what makes the ranking assertions in test/supportSearch.test.ts
// meaningful, and it protects the byte-identical prerender guarantee. Any
// stateful UI polish (rank hysteresis) belongs in the hook, never here.
//
// Returns SLUGS, not article objects, so this module never needs to import
// supportArticles.ts and its import.meta.glob.

import { QUESTION_WORD_STEMS, normalizeTerms } from './textNormalize'
import { HYPERNYM_LOOKUP, PHRASE_ALIAS_STEMS, SYNONYM_LOOKUP } from './supportSynonyms'
import { SUPPORT_FIELDS, idf } from './supportSearchIndex'
import type { IndexedDoc, SupportField, SupportSearchIndex } from './supportSearchIndex'
import type { SupportAudienceFilter } from './supportTypes'

export const SUPPORT_SEARCH_TUNING = {
  k1: 1.2,
  fieldWeights: {
    questionForms: 5.0,
    title: 4.0,
    keywords: 3.5,
    faqQuestions: 3.0,
    summary: 2.0,
    headings: 1.5,
    body: 1.0,
  } as Record<SupportField, number>,
  fieldB: {
    questionForms: 0.2,
    title: 0.3,
    keywords: 0.2,
    faqQuestions: 0.2,
    summary: 0.5,
    headings: 0.5,
    body: 0.75,
  } as Record<SupportField, number>,
  phraseWeights: {
    questionForms: 1.2,
    keywords: 1.0,
    title: 0.9,
    faqQuestions: 0.8,
    headings: 0.5,
    summary: 0.35,
    body: 0.25,
  } as Record<SupportField, number>,
  wholeFieldBonus: {
    questionForms: 6.0,
    title: 5.0,
    faqQuestions: 4.0,
    keywords: 3.0,
  } as Partial<Record<SupportField, number>>,
  // Evidence strength. A literal hit beats a synonym hit 2.2x at equal IDF, so
  // the user's actual word always wins — but a synonym-only doc matching more of
  // the query can still win, which is correct.
  literalWeight: 1.0,
  prefixWeight: 0.7,
  typoWeight1: 0.6,
  synonymWeight: 0.45,
  typoWeight2: 0.4,
  hypernymWeight: 0.35,
  editorialWeight: 0.15,
  audienceBoost: 1.15,
  confidenceCoverage: 0.55,
  confidenceMargin: 0.2,
  confidenceEvidence: 0.25,
  evidenceScale: 8.0,
  tierConfident: 0.55,
  tierClosest: 0.25,
  relativeCutoff: 0.3,
  discriminatingIdf: 1.0,
  defaultLimit: 6,
}

const T = SUPPORT_SEARCH_TUNING

export interface SupportSearchResult {
  slug: string
  score: number
  /** Surface forms that matched, for the "Matched on: ..." line. */
  matchedTerms: string[]
  section?: { anchor: string; heading: string }
}

export interface SupportSearchResponse {
  results: SupportSearchResult[]
  confidence: number
  tier: 'confident' | 'closest' | 'unsure'
  /** Query terms the corpus has never seen. This is the content roadmap. */
  unknownTerms: string[]
  tokens: string[]
  /** False while the query is still all low-signal words — gates list rendering. */
  hasDiscriminatingTerm: boolean
}

export interface SupportSearchOptions {
  limit?: number
  audienceBoost?: SupportAudienceFilter
  /** Expand the trailing token by prefix. On while typing, off once a space follows. */
  expandTrailingPrefix?: boolean
}

interface ExpandedTerm {
  stem: string
  weight: number
}

interface TermGroup {
  /** What the user actually typed, for the matched-terms line. */
  surface: string
  terms: ExpandedTerm[]
}

/** Damerau-Levenshtein with an early exit once the best row exceeds maxEdits. */
function editDistance(a: string, b: string, maxEdits: number): number {
  if (Math.abs(a.length - b.length) > maxEdits) return maxEdits + 1
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  let prevPrev: number[] = []

  for (let i = 1; i <= a.length; i++) {
    const row = [i]
    let best = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      let v = Math.min(row[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        v = Math.min(v, prevPrev[j - 2] + 1)
      }
      row.push(v)
      if (v < best) best = v
    }
    if (best > maxEdits) return maxEdits + 1
    prevPrev = prev
    prev = row
  }
  return prev[b.length]
}

/**
 * One correction for a stem the corpus has never seen.
 *
 * Only ever called when df === 0. Fuzzing a token that already matches is the
 * classic way fuzzy search turns to mush, and it is also where the cost is.
 * The shared-prefix requirement is what stops sync -> link.
 */
function findCorrection(index: SupportSearchIndex, stem: string): ExpandedTerm | null {
  if (stem.length < 4) return null
  const maxEdits = stem.length >= 7 ? 2 : 1
  const prefixLen = maxEdits === 2 ? 2 : 1
  const prefix = stem.slice(0, prefixLen)

  let best: { stem: string; distance: number; df: number } | null = null
  for (let len = stem.length - 2; len <= stem.length + 2; len++) {
    if (len < 3) continue
    for (const candidate of index.vocabBuckets.get(`${stem[0]}:${len}`) ?? []) {
      if (!candidate.startsWith(prefix)) continue
      const distance = editDistance(stem, candidate, maxEdits)
      if (distance > maxEdits) continue
      const df = index.df.get(candidate) ?? 0
      // distance asc -> df desc -> lexicographic. Fully deterministic.
      if (
        !best ||
        distance < best.distance ||
        (distance === best.distance &&
          (df > best.df || (df === best.df && candidate < best.stem)))
      ) {
        best = { stem: candidate, distance, df }
      }
    }
  }
  if (!best) return null
  return {
    stem: best.stem,
    weight: best.distance === 1 ? T.typoWeight1 : T.typoWeight2,
  }
}

function prefixCandidates(index: SupportSearchIndex, stem: string): ExpandedTerm[] {
  if (stem.length < 3) return []
  const matches: { stem: string; df: number }[] = []
  for (const [candidate, df] of index.df) {
    if (candidate !== stem && candidate.startsWith(stem)) matches.push({ stem: candidate, df })
  }
  matches.sort((a, b) => b.df - a.df || a.stem.localeCompare(b.stem))
  return matches.slice(0, 6).map((m) => ({ stem: m.stem, weight: T.prefixWeight }))
}

/**
 * Builds the query's term groups.
 *
 * Within a group the score is max, across groups it is sum (DisjunctionMax).
 * That is the structural piece that makes expansion safe: without it, expanding
 * `sync` into eight members means a doc containing six of them scores 6x on one
 * concept.
 */
function buildGroups(
  index: SupportSearchIndex,
  query: string,
  options: SupportSearchOptions,
): { groups: TermGroup[]; unknownTerms: string[]; tokens: string[] } {
  const terms = normalizeTerms(query)
  const tokens = terms.map((t) => t.stem)
  const unknownTerms: string[] = []
  const groups: TermGroup[] = []
  const seen = new Set<string>()

  const endsWithSpace = /\s$/.test(query)

  terms.forEach(({ surface, stem }, i) => {
    if (seen.has(stem)) return
    seen.add(stem)
    const byStem = new Map<string, number>()
    const add = (s: string, w: number) => {
      // Dedupe by MAX, never sum — a stem reachable via three routes must not
      // count three times.
      byStem.set(s, Math.max(byStem.get(s) ?? 0, w))
    }

    const known = (index.df.get(stem) ?? 0) > 0
    add(stem, T.literalWeight)

    if (!known) {
      unknownTerms.push(surface)
      const correction = findCorrection(index, stem)
      if (correction) add(correction.stem, correction.weight)

      const isTrailing = i === tokens.length - 1
      if (isTrailing && options.expandTrailingPrefix !== false && !endsWithSpace) {
        for (const candidate of prefixCandidates(index, stem)) {
          add(candidate.stem, candidate.weight)
        }
      }
    }

    for (const syn of SYNONYM_LOOKUP.get(stem) ?? []) add(syn, T.synonymWeight)
    for (const hyp of HYPERNYM_LOOKUP.get(stem) ?? []) add(hyp, T.hypernymWeight)

    groups.push({
      surface,
      terms: [...byStem].map(([s, w]) => ({ stem: s, weight: w })),
    })
  })

  // Phrase aliases inject concepts the individual tokens don't imply.
  for (const alias of PHRASE_ALIAS_STEMS) {
    if (!containsSequence(tokens, alias.stems)) continue
    for (const expansion of alias.expandsTo) {
      groups.push({ surface: alias.stems.join(' '), terms: [{ stem: expansion, weight: T.synonymWeight }] })
    }
  }

  return { groups, unknownTerms, tokens }
}

function containsSequence(haystack: string[], needle: string[]): boolean {
  if (needle.length === 0 || needle.length > haystack.length) return false
  for (let i = 0; i + needle.length <= haystack.length; i++) {
    let ok = true
    for (let j = 0; j < needle.length; j++) {
      if (haystack[i + j] !== needle[j]) {
        ok = false
        break
      }
    }
    if (ok) return true
  }
  return false
}

/**
 * BM25F: pool the per-field frequencies, then saturate ONCE.
 *
 * Summing per-field BM25 instead would saturate seven times and let a term
 * appearing weakly in every field outrank one appearing strongly in the title.
 */
function tokenScore(index: SupportSearchIndex, doc: IndexedDoc, stem: string): number {
  const perField = doc.terms.get(stem)
  if (!perField) return 0

  let pooled = 0
  for (const field of SUPPORT_FIELDS) {
    const tf = perField[field]
    if (!tf) continue
    const len = doc.fieldLengths[field]
    const avg = index.avgFieldLength[field] || 1
    const b = T.fieldB[field]
    pooled += (T.fieldWeights[field] * tf) / (1 - b + (b * len) / avg)
  }
  if (pooled === 0) return 0
  return idf(index, stem) * (pooled / (T.k1 + pooled))
}

function phraseScore(index: SupportSearchIndex, doc: IndexedDoc, tokens: string[]): number {
  let total = 0
  let i = 0
  // Longest n-gram per start position only. Otherwise a 4-gram match also fires
  // its sub-trigrams and sub-bigrams and the same evidence is counted five times.
  while (i < tokens.length) {
    let matched = 0
    for (let n = Math.min(5, tokens.length - i); n >= 2; n--) {
      const gram = tokens.slice(i, i + n).join(' ')
      const fields = doc.phrases.get(gram)
      if (!fields) continue
      const idfSum = tokens.slice(i, i + n).reduce((sum, t) => sum + idf(index, t), 0)
      let bestField = 0
      for (const field of fields) {
        // Body bigrams ("training zones") are everywhere; trigrams are meaningful.
        if (field === 'body' && n < 3) continue
        bestField = Math.max(bestField, T.phraseWeights[field])
      }
      if (bestField === 0) continue
      total += bestField * (n - 1) * idfSum
      matched = n
      break
    }
    i += matched > 0 ? matched : 1
  }
  return total
}

function wholeFormScore(doc: IndexedDoc, tokens: string[]): number {
  const joined = tokens.join(' ')
  const field = doc.wholeForms.get(joined)
  if (!field) return 0
  return T.wholeFieldBonus[field] ?? 0
}

function pickSection(
  doc: IndexedDoc,
  index: SupportSearchIndex,
  tokens: string[],
): { anchor: string; heading: string } | undefined {
  let best: { anchor: string; heading: string; score: number } | undefined
  for (const section of doc.sections) {
    let score = 0
    for (let i = 0; i + 2 <= tokens.length; i++) {
      if (section.phrases.has(tokens.slice(i, i + 2).join(' '))) score += 3
    }
    const hits = tokens.filter((t) => section.stems.has(t))
    const strong = hits.filter((t) => idf(index, t) >= 1.5)
    if (hits.length >= 2 && strong.length >= 1) score += 2
    if (score > 0 && (!best || score > best.score)) {
      best = { anchor: section.anchor, heading: section.heading, score }
    }
  }
  return best ? { anchor: best.anchor, heading: best.heading } : undefined
}

export function supportSearch(
  query: string,
  index: SupportSearchIndex,
  options: SupportSearchOptions = {},
): SupportSearchResponse {
  const limit = options.limit ?? T.defaultLimit
  const empty: SupportSearchResponse = {
    results: [],
    confidence: 0,
    tier: 'unsure',
    unknownTerms: [],
    tokens: [],
    hasDiscriminatingTerm: false,
  }
  if (!query.trim() || index.n === 0) return empty

  const { groups, unknownTerms, tokens } = buildGroups(index, query, options)
  if (groups.length === 0) return empty

  // A group is only discriminating if it actually matches something — an unknown
  // term carries max IDF but zero evidence.
  //
  // The absolute threshold was tuned on a 14-article corpus, where df <= 4
  // clears it. A corpus of three can't reach it for any term (df = 1 gives
  // 0.98), so when even the rarest possible term falls short, every matched
  // term counts and the question-word list does the gating instead.
  const rarestIdf = Math.log(1 + (index.n - 1 + 0.5) / 1.5)
  const threshold = rarestIdf >= T.discriminatingIdf ? T.discriminatingIdf : 0
  const hasDiscriminatingTerm = groups.some((g) =>
    g.terms.some(
      (t) =>
        (index.df.get(t.stem) ?? 0) > 0 &&
        !QUESTION_WORD_STEMS.has(t.stem) &&
        idf(index, t.stem) >= threshold,
    ),
  )

  const scored = index.docs.map((doc) => {
    let score = 0
    const matchedTerms: string[] = []
    let matchedIdfWeight = 0

    for (const group of groups) {
      let bestTerm = 0
      for (const term of group.terms) {
        bestTerm = Math.max(bestTerm, term.weight * tokenScore(index, doc, term.stem))
      }
      if (bestTerm > 0) {
        score += bestTerm
        matchedIdfWeight += Math.max(...group.terms.map((t) => idf(index, t.stem)))
        if (!matchedTerms.includes(group.surface)) matchedTerms.push(group.surface)
      }
    }

    const phrase = phraseScore(index, doc, tokens)
    const whole = wholeFormScore(doc, tokens)
    score += phrase + whole

    // Editorial weight and the audience boost only apply to documents that
    // actually matched something. Adding them unconditionally gives every
    // weighted article a non-zero score, so `score > 0` stops filtering and a
    // query matching nothing still returns the whole corpus.
    if (score === 0) {
      return { doc, score: 0, matchedTerms, matchedIdfWeight: 0, evidence: 0 }
    }

    score += T.editorialWeight * doc.weight

    if (
      options.audienceBoost &&
      options.audienceBoost !== 'all' &&
      (doc.audience === options.audienceBoost || doc.audience === 'both')
    ) {
      score *= T.audienceBoost
    }

    return { doc, score, matchedTerms, matchedIdfWeight, evidence: phrase + whole }
  })

  const matched = scored
    .filter((s) => s.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.doc.weight - a.doc.weight ||
        a.doc.title.localeCompare(b.doc.title) ||
        a.doc.slug.localeCompare(b.doc.slug),
    )

  if (matched.length === 0) {
    return { ...empty, unknownTerms, tokens, hasDiscriminatingTerm }
  }

  // Unknown terms sit in the denominator at maximum IDF and never in the
  // numerator. That is what makes a query full of words the corpus has never
  // seen score low confidence by construction rather than by tuning.
  const totalIdfWeight = groups.reduce(
    (sum, g) => sum + Math.max(...g.terms.map((t) => idf(index, t.stem))),
    0,
  )
  const top = matched[0]
  const coverage = totalIdfWeight > 0 ? top.matchedIdfWeight / totalIdfWeight : 0
  const margin =
    matched.length > 1 && top.score > 0 ? (top.score - matched[1].score) / top.score : 1
  const evidence = Math.min(1, top.evidence / T.evidenceScale)
  // Margin is scaled by coverage: a clear winner is only meaningful if we
  // understood the query in the first place. Without this, "how do i make my
  // athletes faster" — where only `athlete` matches — scores a big margin off
  // one common word and reads as moderately confident.
  //
  // Evidence is NOT scaled, because a phrase or whole-form hit is itself proof
  // of understanding.
  const confidence = Math.max(
    0,
    Math.min(
      1,
      T.confidenceCoverage * coverage +
        T.confidenceMargin * margin * coverage +
        T.confidenceEvidence * evidence,
    ),
  )

  const tier =
    confidence >= T.tierConfident
      ? 'confident'
      : confidence >= T.tierClosest
        ? 'closest'
        : 'unsure'

  // Relative cutoff, never absolute — an absolute floor breaks across query lengths.
  const results = matched
    .filter((m) => m.score >= T.relativeCutoff * top.score)
    .slice(0, limit)
    .map((m) => ({
      slug: m.doc.slug,
      score: m.score,
      matchedTerms: m.matchedTerms,
      section: pickSection(m.doc, index, tokens),
    }))

  return { results, confidence, tier, unknownTerms, tokens, hasDiscriminatingTerm }
}
