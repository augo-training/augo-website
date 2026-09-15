import { decodeHtmlEntities } from './htmlText'

export interface BlogPostData {
  slug: string
  title: string
  /**
   * Optional <title>/og:title override. The on-page H1 is often longer than
   * what fits a SERP listing, so SEO-targeted posts can ship a shorter,
   * keyword-front-loaded title here. Used verbatim — add "| augo" yourself if
   * you want it. Falls back to `${title} | augo`.
   */
  seoTitle?: string
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

// decodeHtmlEntities is shared with the support content pipeline.
// See src/utils/htmlText.ts for why descriptions need decoding but bodies do not.

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
