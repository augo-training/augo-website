// Single source of truth for all routes the site exposes.
// Used by prerender.mjs and generate-sitemap.mjs.

import { readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
export const ROOT = dirname(here)
export const BASE_URL = 'https://augotraining.com'

export const LANGS = ['en', 'de', 'pt']
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
}

export async function discoverBlogSlugs() {
  const blogDir = join(ROOT, 'src/content/blog')
  try {
    const entries = await readdir(blogDir)
    return entries
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace(/\.json$/, ''))
      .sort()
  } catch (err) {
    if (err.code === 'ENOENT') return []
    throw err
  }
}

/**
 * Returns the list of routes to prerender, e.g.
 *   ['/en', '/de', '/pt', '/en/download', ..., '/en/blog/<slug>']
 */
export async function getAllPrerenderRoutes() {
  const routes = []
  for (const lang of LANGS) {
    for (const path of STATIC_PATHS) {
      routes.push(`/${lang}${path}`)
    }
  }
  // Blog posts are English-only at launch (Substack posts are in English).
  const slugs = await discoverBlogSlugs()
  for (const slug of slugs) {
    routes.push(`/${DEFAULT_LANG}/blog/${slug}`)
  }
  return routes
}

/**
 * Returns sitemap entries with multilingual alternates.
 * Each entry: { path, priority, alternates: [{lang, url}] }
 */
export async function getSitemapEntries() {
  const entries = []
  for (const path of STATIC_PATHS) {
    for (const lang of LANGS) {
      entries.push({
        url: `${BASE_URL}/${lang}${path}`,
        priority: PATH_PRIORITY[path] ?? 0.5,
        alternates: LANGS.map((l) => ({ lang: l, url: `${BASE_URL}/${l}${path}` })),
        xDefault: `${BASE_URL}/${DEFAULT_LANG}${path}`,
        changefreq: 'weekly',
      })
    }
  }
  const slugs = await discoverBlogSlugs()
  for (const slug of slugs) {
    const url = `${BASE_URL}/${DEFAULT_LANG}/blog/${slug}`
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
