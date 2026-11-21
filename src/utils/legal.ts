import { Marked } from 'marked'
import privacyRaw from '../content/legal/privacy.md?raw'
import termsRaw from '../content/legal/terms.md?raw'

/**
 * The legal documents (Privacy Policy, Terms & Conditions).
 *
 * The Markdown files in src/content/legal/ are the single source: this module
 * renders them for /en/privacy/ and /en/terms/, and the build also publishes
 * them unchanged as /privacy.md and /terms.md (see legalMarkdownPlugin in
 * vite.config.ts) so agents can read the text without running any JavaScript.
 *
 * The webapp and the mobile app link here; they used to host their own copy.
 */

export const LEGAL_SLUGS = ['privacy', 'terms'] as const
export type LegalSlug = (typeof LEGAL_SLUGS)[number]

export interface LegalDoc {
  slug: LegalSlug
  title: string
  description: string
  /** ISO date (YYYY-MM-DD) the legal text last changed. */
  lastUpdated: string
  /** The Markdown body, without the frontmatter. */
  markdown: string
  html: string
}

/**
 * Splits `---`-fenced frontmatter of flat `key: value` lines from the body.
 * Deliberately tiny: the legal files only carry three string fields, and a
 * YAML dependency for that would be the larger risk.
 */
export function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n/)
  if (!match) return { data: {}, body: raw }
  const data: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    data[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
  }
  return { data, body: raw.slice(match[0].length) }
}

/** "17.1 Garmin: what data we collect" → "17-1-garmin-what-data-we-collect" */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Every heading gets an id, so any section can be linked as /en/privacy/#<id>.
// Explicit anchors that existing links depend on (e.g. #garmin-data) are written
// as raw <a id="…"></a> in the Markdown and pass through untouched.
const marked = new Marked({
  gfm: true,
  renderer: {
    heading({ tokens, depth }) {
      const inner = this.parser.parseInline(tokens)
      return `<h${depth} id="${headingId(inner.replace(/<[^>]+>/g, ''))}">${inner}</h${depth}>\n`
    },
  },
})

function load(slug: LegalSlug, raw: string): LegalDoc {
  const { data, body } = parseFrontmatter(raw)
  for (const key of ['title', 'description', 'lastUpdated']) {
    if (!data[key]) throw new Error(`src/content/legal/${slug}.md is missing "${key}" in its frontmatter`)
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.lastUpdated)) {
    throw new Error(`src/content/legal/${slug}.md: lastUpdated must be YYYY-MM-DD`)
  }
  return {
    slug,
    title: data.title,
    description: data.description,
    lastUpdated: data.lastUpdated,
    markdown: body,
    // The source is our own repository, not user or Substack input, so it is
    // rendered without the blog sanitizer (which would also strip the anchors).
    html: marked.parse(body, { async: false }),
  }
}

export const legalDocs: Record<LegalSlug, LegalDoc> = {
  privacy: load('privacy', privacyRaw),
  terms: load('terms', termsRaw),
}

export function formatLegalDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
