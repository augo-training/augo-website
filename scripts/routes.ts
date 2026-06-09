// Single source of truth for all routes the site exposes.
// Used by prerender.ts and generate-sitemap.ts.

import { readdir, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
export const ROOT = dirname(here)
export const BASE_URL = 'https://augotraining.com'

export const LANGS = ['en', 'de', 'pt'] as const
export const DEFAULT_LANG = 'en'

// Paths under /:lang. Keep in sync with src/App.tsx routes.
// Empty string = lang root (e.g. /en).
export const STATIC_PATHS = ['', '/download', '/join', '/find', '/pricing', '/humanedge']

// Sitemap priority per path
export const PATH_PRIORITY = {
  '': 1.0,
  '/download': 0.8,
  '/join': 0.8,
  '/find': 0.7,
  '/pricing': 0.9,
  '/humanedge': 0.9,
} as const

export interface SitemapAlternate {
  lang: (typeof LANGS)[number]
  url: string
}

export interface SitemapEntry {
  url: string
  priority: number
  alternates: SitemapAlternate[] | null
  xDefault: string
  changefreq: 'weekly' | 'monthly'
}

export async function discoverCoachSlugs(): Promise<string[]> {
  const rosterPath = join(ROOT, 'src/data/coaches/roster.ts')
  try {
    const text = await readFile(rosterPath, 'utf8')
    const slugs = [...text.matchAll(/^\s*slug:\s*'([^']+)'/gm)].map((m) => m[1])
    return [...new Set(slugs)].sort()
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      err.code === 'ENOENT'
    ) {
      return []
    }
    throw err
  }
}

export async function discoverBlogSlugs(): Promise<string[]> {
  const blogDir = join(ROOT, 'src/content/blog')
  try {
    const entries = await readdir(blogDir)
    return entries
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace(/\.json$/, ''))
      .sort()
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      err.code === 'ENOENT'
    ) {
      return []
    }
    throw err
  }
}

/**
 * Returns the list of routes to prerender, e.g.
 *   ['/en', '/de', '/pt', '/en/download', ..., '/en/blog/<slug>']
 */
export async function getAllPrerenderRoutes(): Promise<string[]> {
  const routes: string[] = []
  for (const lang of LANGS) {
    for (const path of STATIC_PATHS) {
      routes.push(`/${lang}${path}`)
    }
  }
  // Coach profiles — multilingual, mirroring the find directory.
  const coachSlugs = await discoverCoachSlugs()
  for (const lang of LANGS) {
    for (const slug of coachSlugs) {
      routes.push(`/${lang}/coaches/${slug}`)
    }
  }
  // Blog posts are English-only at launch (Substack posts are in English).
  routes.push(`/${DEFAULT_LANG}/blog`)
  const slugs = await discoverBlogSlugs()
  for (const slug of slugs) {
    routes.push(`/${DEFAULT_LANG}/blog/${slug}`)
  }
  return routes
}

/**
 * Builds a canonical URL with a trailing slash. The slash matches what GitHub
 * Pages serves with a 200; without it the host 301-redirects /en → /en/, which
 * is what made every sitemap <loc> show up as "Page with redirect" in GSC.
 * Must stay byte-identical to getCanonicalUrl() in src/seo/seoConfig.ts.
 */
function langUrl(lang: string, path: string): string {
  return `${BASE_URL}/${lang}${path}/`
}

/**
 * Returns sitemap entries with multilingual alternates.
 * Each entry: { path, priority, alternates: [{lang, url}] }
 */
export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = []
  for (const path of STATIC_PATHS) {
    for (const lang of LANGS) {
      entries.push({
        url: langUrl(lang, path),
        priority: PATH_PRIORITY[path as keyof typeof PATH_PRIORITY] ?? 0.5,
        alternates: LANGS.map((l) => ({ lang: l, url: langUrl(l, path) })),
        xDefault: langUrl(DEFAULT_LANG, path),
        changefreq: 'weekly',
      })
    }
  }
  // Coach profiles — multilingual with hreflang alternates.
  const coachSlugs = await discoverCoachSlugs()
  for (const slug of coachSlugs) {
    const path = `/coaches/${slug}`
    for (const lang of LANGS) {
      entries.push({
        url: langUrl(lang, path),
        priority: 0.8,
        alternates: LANGS.map((l) => ({ lang: l, url: langUrl(l, path) })),
        xDefault: langUrl(DEFAULT_LANG, path),
        changefreq: 'monthly',
      })
    }
  }
  const blogIndexUrl = langUrl(DEFAULT_LANG, '/blog')
  entries.push({
    url: blogIndexUrl,
    priority: 0.8,
    alternates: null,
    xDefault: blogIndexUrl,
    changefreq: 'weekly',
  })
  const slugs = await discoverBlogSlugs()
  for (const slug of slugs) {
    const url = langUrl(DEFAULT_LANG, `/blog/${slug}`)
    entries.push({
      url,
      priority: 0.6,
      // English-only blog posts: no hreflang alternates.
      alternates: null,
      xDefault: url,
      changefreq: 'monthly',
    })
  }
  return entries
}
