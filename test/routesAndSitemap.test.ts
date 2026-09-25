import { describe, expect, it } from 'vitest'
import {
  discoverBlogSlugs,
  discoverCoachSlugs,
  discoverSupportSlugs,
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
    const supportSlugs = await discoverSupportSlugs()

    // localized static + localized coach profiles + english-only blog posts
    // + 1 for the /en/blog index route + 3 for the /en/nice-athletes,
    // /en/nice-coaches and /en/irreplaceable-endurance-coach landing pages
    // + english-only support articles
    // + 1 for the /en/support hub route + 1 for the unprefixed /merci page.
    expect(routes).toHaveLength(
      LANGS.length * STATIC_PATHS.length +
        LANGS.length * coachSlugs.length +
        slugs.length +
        1 +
        3 +
        supportSlugs.length +
        1 +
        1,
    )

    // /merci sits outside /:lang (the postcard QR points at augotraining.com/merci)
    // and exists once, with no language copies.
    expect(routes).toContain('/merci')
    expect(routes.filter((route) => route.endsWith('/merci'))).toHaveLength(1)

    expect(routes).toContain('/en/nice-athletes')
    expect(routes.filter((route) => route.endsWith('/nice-athletes'))).toHaveLength(1)
    expect(routes).toContain('/en/nice-coaches')
    expect(routes.filter((route) => route.endsWith('/nice-coaches'))).toHaveLength(1)
    expect(routes).toContain('/en/irreplaceable-endurance-coach')
    expect(routes.filter((route) => route.endsWith('/irreplaceable-endurance-coach'))).toHaveLength(1)

    // /mcp is a localized static path, so the counts above already cover it.
    // These two assertions stop a refactor from silently dropping the page or
    // demoting it to English-only.
    for (const lang of LANGS) expect(routes).toContain(`/${lang}/mcp`)

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

    expect(routes).toContain('/en/support')

    for (const slug of supportSlugs) {
      expect(routes).toContain(`/en/support/${slug}`)
      expect(routes.filter((route) => route.endsWith(`/support/${slug}`))).toHaveLength(1)
    }

    // Support is English-only. Prerendering /de/support would publish an English
    // page under a German URL and emit hreflang alternates that don't exist.
    for (const lang of LANGS.filter((l) => l !== 'en')) {
      expect(routes).not.toContain(`/${lang}/support`)
    }
  })

  it('excludes draft and underscore-prefixed support files', async () => {
    const { readdirSync, readFileSync } = await import('node:fs')
    const slugs = await discoverSupportSlugs()
    const dir = new URL('../src/content/support/', import.meta.url)

    let files: string[] = []
    try {
      files = readdirSync(dir)
    } catch {
      return
    }

    for (const file of files) {
      if (!file.endsWith('.json')) continue
      const slug = file.replace(/\.json$/, '')
      if (file.startsWith('_')) {
        expect(slugs).not.toContain(slug)
        continue
      }
      const parsed = JSON.parse(readFileSync(new URL(file, dir), 'utf8')) as {
        draft?: boolean
      }
      if (parsed.draft === true) expect(slugs).not.toContain(slug)
      else expect(slugs).toContain(slug)
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

  it('lists support pages english-only with trailing slashes', async () => {
    const entries = await getSitemapEntries()
    const supportSlugs = await discoverSupportSlugs()

    const hub = entries.find(
      (entry) => entry.url === 'https://augotraining.com/en/support/',
    )
    expect(hub).toBeTruthy()
    expect(hub?.alternates).toBeNull()

    for (const slug of supportSlugs) {
      const entry = entries.find(
        (e) => e.url === `https://augotraining.com/en/support/${slug}/`,
      )
      // The trailing slash matters: without it the host 301s and every sitemap
      // URL lands in GSC as "Page with redirect".
      expect(entry).toBeTruthy()
      expect(entry?.alternates).toBeNull()
    }

    expect(entries.some((e) => e.url.includes('/de/support'))).toBe(false)
    expect(entries.some((e) => e.url.includes('/pt/support'))).toBe(false)
  })

  // The Nice landing pages are unlinked from the site but deliberately indexable,
  // and English-only — so they must be in the sitemap, and must not carry
  // hreflang alternates pointing at /de or /pt URLs that are never prerendered.
  it('lists both Nice landing pages as english-only sitemap entries', async () => {
    const entries = await getSitemapEntries()

    for (const path of ['/en/nice-athletes/', '/en/nice-coaches/']) {
      const entry = entries.find((e) => e.url === `https://augotraining.com${path}`)
      expect(entry).toBeTruthy()
      expect(entry?.alternates).toBeNull()
      expect(entry?.priority).toBe(0.9)
    }
  })

  // The course page is linked from the footer and meant to be found by search,
  // but it is English-only, so no hreflang alternates.
  it('lists the coach course page as an english-only sitemap entry', async () => {
    const entries = await getSitemapEntries()
    const entry = entries.find((e) => e.url === 'https://augotraining.com/en/irreplaceable-endurance-coach/')

    expect(entry).toBeTruthy()
    expect(entry?.alternates).toBeNull()
    expect(entry?.priority).toBe(0.9)
  })

  // The postcard page is prerendered (so GitHub Pages serves it with a 200) but
  // must never be advertised: it is for the coaches holding a card, nobody else.
  it('keeps /merci out of the sitemap', async () => {
    const entries = await getSitemapEntries()
    const xml = renderSitemapXml(entries)

    expect(entries.some((e) => e.url.includes('merci'))).toBe(false)
    expect(xml).not.toContain('merci')
  })
})
