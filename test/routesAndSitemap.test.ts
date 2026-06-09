import { describe, expect, it } from 'vitest'
import {
  discoverBlogSlugs,
  discoverCoachSlugs,
  getAllPrerenderRoutes,
  getSitemapEntries,
  LANGS,
  STATIC_PATHS,
} from '../scripts/routes.ts'
import { renderSitemapXml } from '../scripts/generate-sitemap.ts'

describe('routes and sitemap', () => {
  it('includes all localized static routes and english-only blog routes', async () => {
    const routes = await getAllPrerenderRoutes()
    const slugs = await discoverBlogSlugs()
    const coachSlugs = await discoverCoachSlugs()

    // localized static + localized coach profiles + english-only blog posts
    // + 1 for the /en/blog index route.
    expect(routes).toHaveLength(
      LANGS.length * STATIC_PATHS.length +
        LANGS.length * coachSlugs.length +
        slugs.length +
        1,
    )

    for (const lang of LANGS) {
      for (const path of STATIC_PATHS) {
        expect(routes).toContain(`/${lang}${path}`)
      }
      for (const slug of coachSlugs) {
        expect(routes).toContain(`/${lang}/coaches/${slug}`)
      }
    }

    expect(routes).toContain('/en/blog')

    for (const slug of slugs) {
      expect(routes).toContain(`/en/blog/${slug}`)
      expect(routes.filter((route) => route.endsWith(`/blog/${slug}`))).toHaveLength(1)
    }
  })

  it('includes alternates for static pages but not for blog pages', async () => {
    const entries = await getSitemapEntries()
    const xml = renderSitemapXml(entries)
    const blogEntry = entries.find((entry) => entry.url.includes('/en/blog/'))
    const staticEntry = entries.find((entry) => entry.url === 'https://augotraining.com/en/')

    expect(blogEntry).toBeTruthy()
    expect(blogEntry?.alternates).toBeNull()
    expect(staticEntry).toBeTruthy()
    expect(staticEntry?.alternates).toHaveLength(LANGS.length)
    expect(xml).toMatch(/hreflang="x-default"/)
    expect(xml).toMatch(/https:\/\/augotraining\.com\/en\/blog\//)
  })
})
