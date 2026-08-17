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
