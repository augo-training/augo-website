// Ranking tests for support search.
//
// Reads the real corpus with node:fs rather than import.meta.glob, so this
// compiles under tsconfig.node.json (no DOM lib, no vite/client types).

import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { buildSupportSearchIndex, idf } from '../src/utils/supportSearchIndex.ts'
import { supportSearch } from '../src/utils/supportSearch.ts'
import type { SupportArticleData } from '../src/utils/supportTypes.ts'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const SUPPORT_DIR = join(ROOT, 'src/content/support')

function loadArticles(): SupportArticleData[] {
  return readdirSync(SUPPORT_DIR)
    .filter((f) => f.endsWith('.json') && !f.startsWith('_'))
    .map((f) => JSON.parse(readFileSync(join(SUPPORT_DIR, f), 'utf8')) as SupportArticleData)
}

const articles = loadArticles()
const index = buildSupportSearchIndex(articles)

/**
 * The eval set IS the definition of "types anything and gets the right link".
 * Adding an article means adding rows here.
 *
 * The hard cases are the near-neighbour pairs — articles separated only by a
 * negation, a synonym group, or a single high-IDF term.
 */
const EVAL: { query: string; expect: string; why: string }[] = [
  { query: "my watch won't sync", expect: 'connect-devices-and-apps', why: 'contraction -> not; watch -> device hypernym' },
  { query: "my garmin ride didn't show up in augo", expect: 'workout-not-showing-up', why: 'must beat devices despite shared garmin/sync' },
  { query: 'how do i stop paying', expect: 'whats-free-and-when-do-i-pay', why: 'phrase alias, no literal overlap' },
  { query: 'is augo free', expect: 'whats-free-and-when-do-i-pay', why: 'augo near-zero idf must not decide it' },
  { query: 'can i coach myself with augo', expect: 'can-i-use-augo-if-i-coach-myself', why: 'phrase alias; must beat getting-started' },
  { query: 'how do i invite an athlete', expect: 'add-an-athlete', why: 'invite <-> add synonym group' },
  { query: 'new athlete has no workouts', expect: 'workout-not-showing-up', why: 'no survives stoplisting; must beat add-an-athlete' },
  { query: 'what is rpe', expect: 'session-feedback-explained', why: 'rare keyword, max idf' },
  { query: 'how did it feel question', expect: 'session-feedback-explained', why: 'multi-word keyword as a phrase' },
  { query: 'which questions do my athletes get asked', expect: 'choose-feedback-questions', why: 'must beat session-feedback-explained' },
  { query: 'do i need to leave trainingpeaks', expect: 'do-i-have-to-stop-using-trainingpeaks', why: 'leave <-> cancel group' },
  { query: "set my athlete's threshold pace", expect: 'training-zones-and-zone-models', why: "possessive 's; threshold/pace group" },
  { query: 'whats an ftp anchor', expect: 'performance-anchors', why: 'ftp is in both vocabularies; anchor decides' },
  { query: 'reuse the same workout every week', expect: 'workout-templates', why: 'synonym only, zero literal title overlap' },
  { query: 'who needs my attention today', expect: 'daily-priority-list', why: 'phrase alias, zero literal title overlap' },
  { query: 'apple health', expect: 'connect-devices-and-apps', why: 'unsupported integration — "no" is the right answer' },
  { query: 'trainigpeeks', expect: 'do-i-have-to-stop-using-trainingpeaks', why: '2-edit typo, prefix guard' },
  { query: 'how much does augo cost', expect: 'whats-free-and-when-do-i-pay', why: 'cost/price group' },
  { query: 'where do i download the app', expect: 'getting-started-as-an-athlete', why: 'athlete onboarding' },
  { query: 'my priority list is empty', expect: 'daily-priority-list', why: 'empty -> missing group must not pull troubleshooting' },
]

describe('support search — eval set', () => {
  it.each(EVAL)('"$query" -> $expect ($why)', ({ query, expect: slug }) => {
    const { results } = supportSearch(query, index)
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].slug).toBe(slug)
  })
})

describe('confidence tiers', () => {
  it('never claims confidence about something augo does not answer', () => {
    // Unmatched terms carry max IDF in the coverage denominator and never in
    // the numerator, so confidence falls out low by construction. Offering a
    // hedged guess plus the contact route is the right behaviour here — what
    // must not happen is presenting it as a confident answer.
    const res = supportSearch('how do i make my athletes faster', index)
    expect(res.tier).not.toBe('confident')
    expect(res.confidence).toBeLessThan(0.4)
  })

  it('is unsure about gibberish', () => {
    const res = supportSearch('sdfjkl asdfgh qwerty', index)
    expect(res.tier).toBe('unsure')
    expect(res.results).toEqual([])
  })

  it('is confident about a declared question form', () => {
    const res = supportSearch("my watch won't sync", index)
    expect(res.tier).toBe('confident')
    expect(res.confidence).toBeGreaterThan(0.6)
  })

  it('reports unknown terms — this is the content roadmap', () => {
    const res = supportSearch('how do i export to golden cheetah', index)
    expect(res.unknownTerms).toContain('cheetah')
  })

  it('returns nothing for an empty query', () => {
    expect(supportSearch('', index).results).toEqual([])
    expect(supportSearch('   ', index).hasDiscriminatingTerm).toBe(false)
  })
})

describe('thrash gate', () => {
  it.each(['how', 'how do', 'how do i', 'what'])(
    '"%s" is not discriminating enough to replace the browse list',
    (query) => {
      expect(supportSearch(query, index).hasDiscriminatingTerm).toBe(false)
    },
  )

  it('flips to discriminating once a real term arrives', () => {
    expect(supportSearch('how do i connect garmin', index).hasDiscriminatingTerm).toBe(true)
  })
})

describe('ranking invariants', () => {
  it('keeps every idf strictly positive', () => {
    // Textbook BM25 idf goes negative at df > N/2 — at N=14 that is df >= 8,
    // i.e. augo/athlete/workout/coach. A negative idf ranks a doc containing
    // the term BELOW one that doesn't.
    for (const stem of index.df.keys()) {
      expect(idf(index, stem)).toBeGreaterThan(0)
    }
  })

  it('prices a corpus-wide term far below a rare one', () => {
    const common = idf(index, 'augo')
    const rare = idf(index, 'rpe')
    expect(common).toBeLessThan(0.5)
    expect(rare).toBeGreaterThan(common * 3)
  })

  it('matches whole stems, never substrings', () => {
    // src/utils/coachSearch.ts matches with String.includes, so "run" hits
    // "overrun" in both directions. That bug class must not exist here.
    const res = supportSearch('overrun', index)
    const viaRun = supportSearch('run', index)
    expect(res.results.map((r) => r.slug)).not.toEqual(viaRun.results.map((r) => r.slug))
  })

  it('ranks a literal hit above a synonym-only hit', () => {
    const literal = supportSearch('sync', index).results[0]
    expect(literal.slug).toBe('connect-devices-and-apps')
  })

  it('is deterministic across repeated calls', () => {
    for (const { query } of EVAL) {
      const a = supportSearch(query, index).results.map((r) => r.slug)
      const b = supportSearch(query, index).results.map((r) => r.slug)
      expect(a).toEqual(b)
    }
  })

  it('is deterministic across rebuilds', () => {
    const rebuilt = buildSupportSearchIndex(loadArticles())
    expect([...rebuilt.df.entries()].sort()).toEqual([...index.df.entries()].sort())
    expect(rebuilt.docs.map((d) => d.slug)).toEqual(index.docs.map((d) => d.slug))
  })

  it('caps the result list', () => {
    expect(supportSearch('augo', index, { limit: 3 }).results.length).toBeLessThanOrEqual(3)
  })
})

describe('typo tolerance bounds', () => {
  it.each(['garmn', 'garmni'])('corrects %s', (typo) => {
    expect(supportSearch(typo, index).results[0]?.slug).toBe('connect-devices-and-apps')
  })

  it('does not fuzz a token that already matches', () => {
    // `sync` is in the corpus, so it must never be corrected to `link`.
    const res = supportSearch('sync', index)
    expect(res.unknownTerms).toEqual([])
  })

  it('does not fuzz short tokens', () => {
    const res = supportSearch('xyz', index)
    expect(res.results).toEqual([])
  })
})

describe('live as you type', () => {
  // Deliberately NOT "the answer enters the top 3 and never leaves". A partial
  // word is a genuinely different query — "new athlete has" really is the
  // add-an-athlete question until "no workouts" arrives, and "train" really is
  // a different query from "trainingpeaks". Demanding otherwise would be
  // demanding clairvoyance.
  //
  // What must hold is that the list never collapses to nothing mid-sentence,
  // and that the tail converges rather than still churning at the last keystroke.

  it.each(EVAL)('"$query" never flashes an empty list', ({ query }) => {
    for (let i = 1; i <= query.length; i++) {
      const res = supportSearch(query.slice(0, i), index)
      if (!res.hasDiscriminatingTerm) continue
      // Once we claim to understand enough to show a list, there must be a list.
      expect(res.results.length).toBeGreaterThan(0)
    }
  })

  it.each(EVAL)('"$query" has converged by the final keystrokes', ({ query, expect: slug }) => {
    // Full query and one keystroke short of it. Wider than that stops being a
    // convergence claim and starts truncating the decisive word on short
    // queries ("is augo fr" has not yet said "free").
    for (let back = 0; back < 2 && query.length - back > 0; back++) {
      const prefix = query.slice(0, query.length - back)
      const top3 = supportSearch(prefix, index)
        .results.slice(0, 3)
        .map((r) => r.slug)
      expect(top3, `at "${prefix}"`).toContain(slug)
    }
  })
})
