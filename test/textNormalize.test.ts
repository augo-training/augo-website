import { describe, expect, it } from 'vitest'
import {
  SUPPORT_STOPWORDS,
  expandContractions,
  lightStem,
  normalizeTokens,
  rawTokens,
} from '../src/utils/textNormalize.ts'
import { extractSections, stripHtml } from '../src/utils/htmlText.ts'

describe('contraction expansion', () => {
  // The whole troubleshooting category depends on `not` surviving. Naive
  // apostrophe-stripping yields `wont`, which matches nothing.
  it.each([
    ["my watch won't sync", 'not'],
    ["my workout isn't showing up", 'not'],
    ["the athlete didn't get it", 'not'],
    ["I can't log in", 'not'],
    ["they haven't synced", 'not'],
  ])('%s yields a negation token', (input, expected) => {
    expect(rawTokens(input)).toContain(expected)
  })

  it('drops possessive s rather than making a distinct token', () => {
    expect(rawTokens("my athlete's watch")).toContain('athlete')
    expect(rawTokens("my athlete's watch")).not.toContain('athletes')
  })

  it('expands first-person contractions', () => {
    expect(expandContractions("i'm new here")).toBe('i am new here')
  })
})

describe('normalisation', () => {
  it('treats a curly apostrophe as a straight one', () => {
    // The authored JSON uses U+2019; users type U+0027. Same token or nothing matches.
    expect(normalizeTokens('doesn’t work')).toEqual(normalizeTokens("doesn't work"))
  })

  it('folds diacritics', () => {
    expect(rawTokens('café')).toContain('cafe')
  })

  it('emits both parts and the joined form of a hyphenated word', () => {
    const tokens = rawTokens('post-workout')
    expect(tokens).toEqual(expect.arrayContaining(['post', 'workout', 'postworkout']))
  })

  it('keeps digits, which carry the specificity', () => {
    expect(rawTokens('zone 2')).toContain('2')
    expect(rawTokens('vo2 max')).toContain('vo2')
  })

  it('drops single letters but not single digits', () => {
    expect(rawTokens('a b 2')).toEqual(['2'])
  })

  it('falls back to unfiltered tokens rather than emptying the query', () => {
    // Mid-sentence, "how do i" is entirely stopwords. Returning [] would blank
    // the results list while the user is still typing.
    expect(normalizeTokens('how do i').length).toBeGreaterThan(0)
  })
})

describe('stopwords', () => {
  it.each(['not', 'no', 'never', 'stop', 'missing', 'cannot'])(
    'keeps the negation/blocker %s',
    (word) => {
      expect(SUPPORT_STOPWORDS.has(word)).toBe(false)
    },
  )

  it.each(['how', 'what', 'why', 'which', 'can', 'should'])(
    'keeps the question word %s',
    (word) => {
      expect(SUPPORT_STOPWORDS.has(word)).toBe(false)
    },
  )

  it('keeps augo — IDF prices it at ~0 already', () => {
    expect(SUPPORT_STOPWORDS.has('augo')).toBe(false)
  })
})

describe('lightStem', () => {
  it.each([
    ['running', 'run'],
    ['syncing', 'sync'],
    ['synced', 'sync'],
    ['watches', 'watch'],
    ['priorities', 'priority'],
    ['athletes', 'athlete'],
    ['workouts', 'workout'],
  ])('%s -> %s', (input, expected) => {
    expect(lightStem(input)).toBe(expected)
  })

  it.each(['ios', 'analysis', 'status', 'address', 'data', 'garmin', 'strava'])(
    'leaves %s alone',
    (word) => {
      expect(lightStem(word)).toBe(word)
    },
  )

  it('never conflates distinct product words', () => {
    expect(lightStem('run')).not.toBe(lightStem('rung'))
  })
})

describe('html helpers', () => {
  it('strips tags and collapses whitespace', () => {
    expect(stripHtml('<p>Hello   <strong>there</strong></p>')).toBe('Hello there')
  })

  it('drops script bodies rather than leaking them as text', () => {
    expect(stripHtml('<p>a</p><script>var x = 1</script><p>b</p>')).toBe('a b')
  })

  it('splits into sections at headings, keeping anchors', () => {
    const html =
      '<p>Lead in.</p><h2 id="one">First</h2><p>Body one.</p><h3 id="two">Second</h3><p>Body two.</p>'
    const sections = extractSections(html)

    expect(sections.map((s) => s.anchor)).toEqual(['', 'one', 'two'])
    expect(sections[0].text).toBe('Lead in.')
    expect(sections[1].heading).toBe('First')
    expect(sections[1].text).toBe('Body one.')
    expect(sections[2].level).toBe(3)
  })
})
