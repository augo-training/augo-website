export interface BlogPostData {
  slug: string
  title: string
  description: string
  author: { name: string; url?: string }
  datePublished: string
  dateModified?: string
  coverImage?: string
  coverImageAlt?: string
  bodyHtml: string
  substackUrl?: string
  tags?: string[]
  faqs?: { question: string; answer: string }[]
}

const postModules = import.meta.glob<{ default: BlogPostData }>(
  '../content/blog/*.json',
  { eager: true }
)

// Substack-imported posts sometimes carry HTML numeric entities (e.g. &#8211;)
// in the description field. The body is sanitized + parsed as HTML so it
// decodes naturally, but the description is rendered as plain text in cards
// and meta tags — decode it here so it doesn't leak through.
const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
}

function decodeHtmlEntities(input: string): string {
  return input.replace(/&(#x?[\da-fA-F]+|[a-zA-Z]+);/g, (match, body) => {
    if (body[0] === '#') {
      const isHex = body[1] === 'x' || body[1] === 'X'
      const code = parseInt(body.slice(isHex ? 2 : 1), isHex ? 16 : 10)
      if (Number.isFinite(code)) return String.fromCodePoint(code)
      return match
    }
    return NAMED_ENTITIES[body] ?? match
  })
}

export const postsBySlug: Record<string, BlogPostData> = Object.fromEntries(
  Object.entries(postModules).map(([path, mod]) => {
    const slug = path.split('/').pop()!.replace(/\.json$/, '')
    const post = mod.default
    return [slug, { ...post, description: decodeHtmlEntities(post.description) }]
  })
)

// Newest first.
export const allPostsSorted: BlogPostData[] = Object.values(postsBySlug).sort(
  (a, b) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime()
)

// In a newest-first list, "newer" is the item before the current index
// and "older" is the item after it.
export function getAdjacentPosts(slug: string): {
  newer?: BlogPostData
  older?: BlogPostData
} {
  const idx = allPostsSorted.findIndex((p) => p.slug === slug)
  if (idx === -1) return {}
  return {
    newer: idx > 0 ? allPostsSorted[idx - 1] : undefined,
    older: idx < allPostsSorted.length - 1 ? allPostsSorted[idx + 1] : undefined,
  }
}

export function formatPostDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return iso
  }
}
