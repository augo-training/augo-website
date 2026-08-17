// Loads support articles from src/content/support/*.json.
//
// This is the ONLY support module that touches import.meta.glob. Everything
// testable (types, taxonomy, search scoring, html helpers) lives in pure modules
// so test files can import them without tripping tsconfig.node.json, which ships
// no vite/client types. Keep it that way.

import { SUPPORT_CATEGORY_IDS } from './supportTypes'
import { buildSupportSearchIndex } from './supportSearchIndex'
import type { SupportSearchIndex } from './supportSearchIndex'
import type {
  SupportArticleData,
  SupportAudienceFilter,
  SupportCategoryId,
} from './supportTypes'

const modules = import.meta.glob<{ default: SupportArticleData }>(
  '../content/support/*.json',
  { eager: true },
)

// Drafts are filtered out here, at the single entry point, so no UI path can leak
// one. scripts/routes.ts applies the same rule independently for prerender and the
// sitemap — the two must agree or we ship an advertised URL that renders nothing.
const published: SupportArticleData[] = Object.entries(modules)
  .map(([path, mod]) => {
    const slug = path.split('/').pop()!.replace(/\.json$/, '')
    return { ...mod.default, slug }
  })
  .filter((article) => article.draft !== true)

/**
 * Newest-first is wrong for a help centre — an article's usefulness has nothing to
 * do with when it was written. Sort by editorial weight, then title, which is also
 * fully deterministic: the prerender pass must emit byte-identical HTML per build.
 */
export const allArticles: SupportArticleData[] = [...published].sort(
  (a, b) => (b.weight ?? 0) - (a.weight ?? 0) || a.title.localeCompare(b.title),
)

export const articlesBySlug: Record<string, SupportArticleData> = Object.fromEntries(
  allArticles.map((article) => [article.slug, article]),
)

export const articlesByCategory: Record<SupportCategoryId, SupportArticleData[]> =
  SUPPORT_CATEGORY_IDS.reduce(
    (acc, id) => {
      acc[id] = allArticles.filter((article) => article.category === id)
      return acc
    },
    {} as Record<SupportCategoryId, SupportArticleData[]>,
  )

/** Articles visible for an audience view. 'both' articles always show. */
export function articlesForAudience(
  audience: SupportAudienceFilter,
  articles: SupportArticleData[] = allArticles,
): SupportArticleData[] {
  if (audience === 'all') return articles
  return articles.filter((a) => a.audience === audience || a.audience === 'both')
}

export function countsByCategory(
  audience: SupportAudienceFilter,
): Record<SupportCategoryId | 'all', number> {
  const visible = articlesForAudience(audience)
  const counts = { all: visible.length } as Record<SupportCategoryId | 'all', number>
  for (const id of SUPPORT_CATEGORY_IDS) {
    counts[id] = visible.filter((a) => a.category === id).length
  }
  return counts
}

export function countsByAudience(
  category: SupportCategoryId | 'all',
): Record<SupportAudienceFilter, number> {
  const scoped =
    category === 'all'
      ? allArticles
      : allArticles.filter((a) => a.category === category)
  return {
    all: scoped.length,
    coach: articlesForAudience('coach', scoped).length,
    athlete: articlesForAudience('athlete', scoped).length,
    both: scoped.filter((a) => a.audience === 'both').length,
  }
}

/**
 * Explicit `related` slugs first, then same-category articles to fill the gap, so
 * an article is never a dead end. Unresolvable slugs are dropped rather than
 * rendered as broken links — the content test catches them at CI, this keeps the
 * page sane if one slips through.
 */
export function getRelated(slug: string, limit = 3): SupportArticleData[] {
  const article = articlesBySlug[slug]
  if (!article) return []

  const picked: SupportArticleData[] = []
  const seen = new Set([slug])

  for (const relatedSlug of article.related ?? []) {
    const found = articlesBySlug[relatedSlug]
    if (found && !seen.has(found.slug)) {
      picked.push(found)
      seen.add(found.slug)
    }
    if (picked.length >= limit) return picked
  }

  for (const candidate of articlesByCategory[article.category] ?? []) {
    if (picked.length >= limit) break
    if (!seen.has(candidate.slug)) {
      picked.push(candidate)
      seen.add(candidate.slug)
    }
  }

  return picked
}

export function getArticlesBySlugs(slugs: string[]): SupportArticleData[] {
  return slugs.map((s) => articlesBySlug[s]).filter((a): a is SupportArticleData => !!a)
}

/**
 * The search index, built on first use and reused thereafter.
 *
 * Lazy so SupportArticle.tsx — which only needs articlesBySlug — doesn't pay to
 * tokenise the whole corpus. Kept here rather than in a module-level const so
 * the single-glob invariant holds: supportSearchIndex.ts stays pure and takes
 * articles as an argument, which is what lets tests import it.
 */
let cachedIndex: SupportSearchIndex | null = null

export function getSupportSearchIndex(): SupportSearchIndex {
  cachedIndex ??= buildSupportSearchIndex(allArticles)
  return cachedIndex
}

export function formatSupportDate(iso: string): string {
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
