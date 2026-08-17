export const BASE_URL = 'https://augotraining.com'

/**
 * Canonical URL for the support hub, or for one article when given a slug.
 *
 * The trailing slash is load-bearing: the host serves /en/support/ with a 200 and
 * 301-redirects the slash-less form, so a canonical without it points at a
 * redirect. That rule already exists in getCanonicalUrl() (src/seo/seoConfig.ts)
 * and langUrl() (scripts/routes.ts); this is the third place it would otherwise be
 * hand-written, once per schema builder. Route every support URL through here so
 * the canonical, breadcrumbs, ItemList and mainEntityOfPage cannot drift apart.
 */
export function supportUrl(slug?: string): string {
  return `${BASE_URL}/en/support/${slug ? `${slug}/` : ''}`
}
