// Plain-text helpers shared by the blog and support content pipelines.
//
// Pure and DOM-free by design: tests compile under tsconfig.node.json, which
// ships no DOM lib, so anything a test reaches has to work on strings rather than
// a parsed document.

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  // U+00A0, written as an escape so it's visible in review. blogPosts.ts carried a
  // literal non-breaking space here; keep the codepoint identical or descriptions
  // that round-trip through this change subtly.
  nbsp: '\u00A0',
}

/**
 * Decodes numeric and common named HTML entities.
 *
 * Substack-imported posts carry entities like &#8211; in fields that render as
 * plain text (card descriptions, meta tags), where they'd otherwise leak through
 * verbatim. Body HTML decodes naturally when parsed, so this is only needed on
 * the text-node paths.
 */
export function decodeHtmlEntities(input: string): string {
  return input.replace(/&(#x?[\da-fA-F]+|[a-zA-Z]+);/g, (match, body: string) => {
    if (body[0] === '#') {
      const isHex = body[1] === 'x' || body[1] === 'X'
      const code = parseInt(body.slice(isHex ? 2 : 1), isHex ? 16 : 10)
      if (Number.isFinite(code)) return String.fromCodePoint(code)
      return match
    }
    return NAMED_ENTITIES[body] ?? match
  })
}

/**
 * Strips tags and collapses whitespace, for indexing and for schema fields that
 * must be plain text. script/style bodies are dropped rather than left behind as
 * stray text.
 */
export function stripHtml(html: string): string {
  return decodeHtmlEntities(
    html
      .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim()
}

export interface ExtractedSection {
  /** The heading's id attribute, or '' for the lead text before the first heading. */
  anchor: string
  heading: string
  level: 2 | 3 | 0
  text: string
}

/**
 * Splits authored HTML into sections at h2/h3 boundaries.
 *
 * Works on the JSON source rather than the rendered DOM, so it stays
 * deterministic — the hub is prerendered by Puppeteer and must emit
 * byte-identical HTML across builds.
 */
export function extractSections(html: string): ExtractedSection[] {
  const pattern = /<h([23])\b([^>]*)>([\s\S]*?)<\/h\1>/gi
  const sections: ExtractedSection[] = []
  const matches = [...html.matchAll(pattern)]

  const leadEnd = matches.length > 0 ? matches[0].index : html.length
  const lead = stripHtml(html.slice(0, leadEnd))
  if (lead) sections.push({ anchor: '', heading: '', level: 0, text: lead })

  matches.forEach((match, i) => {
    const level = Number(match[1]) as 2 | 3
    const idMatch = /\bid\s*=\s*("([^"]*)"|'([^']*)')/i.exec(match[2])
    const anchor = idMatch?.[2] ?? idMatch?.[3] ?? ''
    const heading = stripHtml(match[3])
    const bodyStart = match.index + match[0].length
    const bodyEnd = i + 1 < matches.length ? matches[i + 1].index : html.length
    sections.push({ anchor, heading, level, text: stripHtml(html.slice(bodyStart, bodyEnd)) })
  })

  return sections
}

/** Heading text only, for the headings index field. */
export function extractHeadings(html: string): string[] {
  return extractSections(html)
    .map((s) => s.heading)
    .filter(Boolean)
}
