// Builds the inverted index support search scores against.
//
// Takes articles as an ARGUMENT rather than importing them, so tests can build
// an index from node:fs-read JSON without pulling in supportArticles.ts and its
// import.meta.glob (which does not typecheck under tsconfig.node.json).

import { extractSections, stripHtml } from './htmlText'
import { lightStem, normalizeTerms, normalizeTokens, rawTokens } from './textNormalize'
import type {
  SupportArticleData,
  SupportAudience,
  SupportCategoryId,
} from './supportTypes'

export const SUPPORT_FIELDS = [
  'questionForms',
  'title',
  'keywords',
  'faqQuestions',
  'summary',
  'headings',
  'body',
] as const
export type SupportField = (typeof SUPPORT_FIELDS)[number]

/** Longest n-gram indexed. Beyond 5, entries are effectively whole-form matches. */
const MAX_NGRAM = 5

export interface IndexedSection {
  anchor: string
  heading: string
  stems: Set<string>
  phrases: Set<string>
}

export interface IndexedDoc {
  slug: string
  title: string
  weight: number
  audience: SupportAudience
  category: SupportCategoryId
  /** stem -> per-field raw term frequency */
  terms: Map<string, Partial<Record<SupportField, number>>>
  /** joined stem n-gram -> fields it appears in */
  phrases: Map<string, SupportField[]>
  /** a complete indexed entry, joined -> the field it came from */
  wholeForms: Map<string, SupportField>
  fieldLengths: Record<SupportField, number>
  sections: IndexedSection[]
}

export interface SupportSearchIndex {
  docs: IndexedDoc[]
  bySlug: Map<string, IndexedDoc>
  /** stem -> number of docs containing it in ANY field */
  df: Map<string, number>
  n: number
  avgFieldLength: Record<SupportField, number>
  /** `${firstChar}:${len}` -> stems, for bounded typo candidate lookup */
  vocabBuckets: Map<string, string[]>
}

function emptyFieldRecord(): Record<SupportField, number> {
  return {
    questionForms: 0,
    title: 0,
    keywords: 0,
    faqQuestions: 0,
    summary: 0,
    headings: 0,
    body: 0,
  }
}

/**
 * Text belonging to a field, as discrete entries.
 *
 * Entries matter: n-grams are generated per entry and never across entries, so
 * keywords ["link account", "watch"] cannot manufacture the bigram
 * "account watch". Same for question forms, FAQ questions and headings.
 */
function fieldEntries(article: SupportArticleData): Record<SupportField, string[]> {
  const htmlBlocks: string[] = []
  const headings: string[] = []

  for (const block of article.body) {
    if (block.type === 'html') {
      htmlBlocks.push(block.html)
      for (const section of extractSections(block.html)) {
        if (section.heading) headings.push(section.heading)
      }
    } else if (block.type === 'steps') {
      if (block.heading) headings.push(block.heading)
      for (const step of block.steps) {
        headings.push(step.title)
        htmlBlocks.push(step.html)
      }
    } else if (block.media.type === 'image' || block.media.type === 'video') {
      // Alt text and captions are real content — this is how "the screenshot of
      // the sync screen" becomes findable.
      htmlBlocks.push(block.media.alt)
      if (block.media.caption) htmlBlocks.push(block.media.caption)
    }
  }

  return {
    questionForms: article.questionForms ?? [],
    title: [article.title],
    keywords: article.keywords ?? [],
    faqQuestions: (article.faqs ?? []).map((f) => f.question),
    summary: [article.summary],
    headings,
    body: [
      article.description,
      ...htmlBlocks.map(stripHtml),
      ...(article.faqs ?? []).map((f) => f.answer),
    ],
  }
}

function indexDoc(article: SupportArticleData): IndexedDoc {
  const entries = fieldEntries(article)
  const terms = new Map<string, Partial<Record<SupportField, number>>>()
  const phrases = new Map<string, SupportField[]>()
  const wholeForms = new Map<string, SupportField>()
  const fieldLengths = emptyFieldRecord()

  for (const field of SUPPORT_FIELDS) {
    for (const entry of entries[field]) {
      if (!entry) continue
      // Stopwords are kept for phrase indexing so contiguity survives, but the
      // token channel uses the filtered form. rawTokens + stem mirrors what the
      // query side produces before stopword removal.
      const stems = rawTokens(entry).map(lightStem)
      if (stems.length === 0) continue

      fieldLengths[field] += stems.length

      for (const stem of stems) {
        const perField = terms.get(stem) ?? {}
        perField[field] = (perField[field] ?? 0) + 1
        terms.set(stem, perField)
      }

      for (let n = 2; n <= Math.min(MAX_NGRAM, stems.length); n++) {
        for (let i = 0; i + n <= stems.length; i++) {
          const gram = stems.slice(i, i + n).join(' ')
          const fields = phrases.get(gram)
          if (fields) {
            if (!fields.includes(field)) fields.push(field)
          } else {
            phrases.set(gram, [field])
          }
        }
      }

      // The entry in full. Only meaningful for the homogeneous fields — a body
      // paragraph is not something a user types verbatim.
      if (
        field === 'questionForms' ||
        field === 'title' ||
        field === 'keywords' ||
        field === 'faqQuestions'
      ) {
        // Keyed the way the query side keys it — stopwords stripped — or a
        // form like "does augo work with chatgpt" can never match itself.
        const joined = normalizeTerms(entry)
          .map((t) => t.stem)
          .join(' ')
        if (!wholeForms.has(joined)) wholeForms.set(joined, field)
      }
    }
  }

  const sections: IndexedSection[] = []
  for (const block of article.body) {
    if (block.type !== 'html') continue
    for (const section of extractSections(block.html)) {
      if (!section.anchor || !section.heading) continue
      const sectionStems = normalizeTokens(`${section.heading} ${section.text}`)
      const headingStems = rawTokens(section.heading).map(lightStem)
      const sectionPhrases = new Set<string>()
      for (let n = 2; n <= Math.min(MAX_NGRAM, headingStems.length); n++) {
        for (let i = 0; i + n <= headingStems.length; i++) {
          sectionPhrases.add(headingStems.slice(i, i + n).join(' '))
        }
      }
      sections.push({
        anchor: section.anchor,
        heading: section.heading,
        stems: new Set(sectionStems),
        phrases: sectionPhrases,
      })
    }
  }

  return {
    slug: article.slug,
    title: article.title,
    weight: article.weight ?? 0,
    audience: article.audience,
    category: article.category,
    terms,
    phrases,
    wholeForms,
    fieldLengths,
    sections,
  }
}

export function buildSupportSearchIndex(
  articles: SupportArticleData[],
): SupportSearchIndex {
  const published = articles.filter((a) => a.draft !== true)
  // Sort by slug so the index is byte-identical regardless of directory read
  // order — the hub is prerendered and must not diff between builds.
  const docs = published
    .slice()
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map(indexDoc)

  const df = new Map<string, number>()
  for (const doc of docs) {
    for (const stem of doc.terms.keys()) {
      df.set(stem, (df.get(stem) ?? 0) + 1)
    }
  }

  // Averaged only over docs where the field is non-empty. Otherwise adding
  // questionForms to 3 of 14 articles would length-penalise those 3 against 11
  // zeros, which is exactly backwards.
  const avgFieldLength = emptyFieldRecord()
  for (const field of SUPPORT_FIELDS) {
    const lengths = docs.map((d) => d.fieldLengths[field]).filter((l) => l > 0)
    avgFieldLength[field] =
      lengths.length > 0 ? lengths.reduce((a, b) => a + b, 0) / lengths.length : 1
  }

  const vocabBuckets = new Map<string, string[]>()
  for (const stem of df.keys()) {
    const key = `${stem[0]}:${stem.length}`
    const bucket = vocabBuckets.get(key)
    if (bucket) bucket.push(stem)
    else vocabBuckets.set(key, [stem])
  }
  for (const bucket of vocabBuckets.values()) bucket.sort()

  return {
    docs,
    bySlug: new Map(docs.map((d) => [d.slug, d])),
    df,
    n: docs.length,
    avgFieldLength,
    vocabBuckets,
  }
}

/**
 * Smoothed IDF. Strictly positive for all df — this is not the textbook BM25
 * form, and the difference matters enormously at this corpus size.
 *
 * Textbook BM25 uses ln((N - df + 0.5) / (df + 0.5)), which goes NEGATIVE once
 * df > N/2. At N=14 that is df >= 8 — i.e. exactly `augo`, `athlete`, `workout`,
 * `coach`, `how`. A negative IDF means a document containing the term ranks
 * BELOW one that doesn't, silently poisoning the most common queries.
 *
 * The +1 inside the log keeps it positive everywhere while preserving the
 * ordering: df=1 -> 2.68, df=4 -> 1.55, df=14 -> 0.03.
 */
export function idf(index: SupportSearchIndex, stem: string): number {
  const df = index.df.get(stem) ?? 0
  return Math.log(1 + (index.n - df + 0.5) / (df + 0.5))
}

