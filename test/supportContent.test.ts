// CI gate for support article JSON.
//
// Support content is meant to be authored by non-engineers, which means the
// review step is a person reading prose, not a person reading a schema. These
// assertions are what make that safe: everything a malformed article could break
// (prerender, sitemap, related links, the sanitizer's blind spots) fails here
// instead of in production.
//
// Reads the directory with node:fs rather than import.meta.glob on purpose —
// tsconfig.node.json covers test/** and ships no vite/client types, so a glob
// here would fail `tsc -b` and take the whole build with it.

import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  SUPPORT_AUDIENCES,
  SUPPORT_CATEGORY_IDS,
  SUPPORT_PLATFORMS,
  SUPPORT_VIDEO_PROVIDERS,
} from '../src/utils/supportTypes.ts'
import type { SupportArticleData, SupportBlock } from '../src/utils/supportTypes.ts'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const SUPPORT_DIR = join(ROOT, 'src/content/support')

function readArticles(): { file: string; article: SupportArticleData }[] {
  let files: string[]
  try {
    files = readdirSync(SUPPORT_DIR)
  } catch {
    return []
  }
  return files
    .filter((f) => f.endsWith('.json') && !f.startsWith('_'))
    .map((file) => ({
      file,
      article: JSON.parse(readFileSync(join(SUPPORT_DIR, file), 'utf8')) as SupportArticleData,
    }))
}

const articles = readArticles()
const publishedSlugs = new Set(
  articles.filter(({ article }) => article.draft !== true).map(({ article }) => article.slug),
)

/** Markup the prose sanitizer strips in the browser but its server-side regex
 *  fallback handles unreliably — it only strips *paired* tags, so a self-closing
 *  <embed /> would survive into prerendered HTML. Rejecting the substrings
 *  outright closes that gap by construction. */
const FORBIDDEN_MARKUP = /<\s*(iframe|script|embed|object|form)\b|\son\w+\s*=/i

function htmlStringsOf(block: SupportBlock): string[] {
  if (block.type === 'html') return [block.html]
  if (block.type === 'steps') return block.steps.map((s) => s.html)
  return []
}

describe('support content', () => {
  it('finds at least one article', () => {
    expect(articles.length).toBeGreaterThan(0)
  })

  it.each(articles)('$file is well-formed', ({ file, article }) => {
    const expectedSlug = file.replace(/\.json$/, '')

    // The slug is the URL. If it drifts from the filename, discoverSupportSlugs()
    // prerenders one path while the app routes another, and the sitemap advertises
    // a page that renders NotFound.
    expect(article.slug).toBe(expectedSlug)
    expect(article.slug).toMatch(/^[a-z0-9][a-z0-9-]*$/)
    // 'index' would collide with the directory index prerender.ts writes.
    expect(article.slug).not.toBe('index')

    expect(article.title?.length).toBeGreaterThan(0)
    expect(article.description?.length).toBeGreaterThan(0)
    expect(article.summary?.length).toBeGreaterThan(0)
    // The summary is a search snippet and an AEO short answer, not a paragraph.
    expect(article.summary.length).toBeLessThanOrEqual(400)
    expect(article.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}$/)

    expect(SUPPORT_AUDIENCES).toContain(article.audience)
    expect(SUPPORT_CATEGORY_IDS).toContain(article.category)
    for (const platform of article.platforms ?? []) {
      expect(SUPPORT_PLATFORMS).toContain(platform)
    }

    expect(Array.isArray(article.body)).toBe(true)
    expect(article.body.length).toBeGreaterThan(0)
  })

  it.each(articles)('$file carries no unsafe markup', ({ article }) => {
    for (const block of article.body) {
      for (const html of htmlStringsOf(block)) {
        expect(html).not.toMatch(FORBIDDEN_MARKUP)
      }
    }
  })

  it.each(articles)('$file declares valid media', ({ article }) => {
    for (const block of article.body) {
      const media =
        block.type === 'media'
          ? [block.media]
          : block.type === 'steps'
            ? block.steps.flatMap((s) => (s.media ? [s.media] : []))
            : []

      for (const item of media) {
        expect(item.alt?.length).toBeGreaterThan(0)
        if (item.type === 'image') {
          expect(item.src).toMatch(/^\/support\//)
        } else {
          expect(SUPPORT_VIDEO_PROVIDERS).toContain(item.provider)
          // A poster is required: it is the only thing the prerender pass can
          // capture, since the iframe does not exist until someone clicks.
          expect(item.poster).toMatch(/^\/support\//)
          // An id, never a URL — the component builds the embed src itself.
          expect(item.id).not.toMatch(/^https?:/)
        }
      }
    }
  })

  it.each(articles)('$file links only to published articles', ({ article }) => {
    for (const slug of article.related ?? []) {
      expect(publishedSlugs.has(slug)).toBe(true)
      expect(slug).not.toBe(article.slug)
    }
  })

  // In-body cross-links matter more than `related`: a dead one is a 404 the reader
  // hits mid-answer. Authors write these by hand while drafting a set of articles,
  // so forward references to not-yet-written pages are the expected failure mode.
  it.each(articles)('$file has no dead in-body support links', ({ article }) => {
    const html = article.body
      .flatMap((block) => htmlStringsOf(block))
      .join(' ')

    for (const match of html.matchAll(/href="\/en\/support\/([a-z0-9-]+)\/?"/g)) {
      expect(publishedSlugs.has(match[1])).toBe(true)
    }
  })

  it('has no duplicate slugs', () => {
    const slugs = articles.map(({ article }) => article.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })
})
