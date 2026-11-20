import { describe, expect, it } from 'vitest'
import { LEGAL_SLUGS as ROUTE_LEGAL_SLUGS, getAllPrerenderRoutes, getSitemapEntries } from '../scripts/routes.ts'
import { LEGAL_SLUGS, headingId, legalDocs, parseFrontmatter } from '../src/utils/legal'

describe('legal content', () => {
  it('keeps the slug lists in scripts/routes.ts and src/utils/legal.ts in sync', () => {
    expect([...ROUTE_LEGAL_SLUGS]).toEqual([...LEGAL_SLUGS])
  })

  it.each(LEGAL_SLUGS)('%s.md has frontmatter and a rendered body', (slug) => {
    const doc = legalDocs[slug]
    expect(doc.title).toBeTruthy()
    expect(doc.description).toBeTruthy()
    expect(doc.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(doc.markdown.startsWith('---')).toBe(false)
    expect(doc.html).toContain('<h2 id="1-')
  })

  it.each(LEGAL_SLUGS)('%s.md has unique heading ids', (slug) => {
    const ids = [...legalDocs[slug].html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1])
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('keeps the #garmin-data anchor that Garmin consent links point at', () => {
    expect(legalDocs.privacy.html).toContain('<a id="garmin-data"></a>')
  })

  it('parses frontmatter and slugs headings', () => {
    expect(parseFrontmatter('---\ntitle: A: B\n---\n\nbody')).toEqual({ data: { title: 'A: B' }, body: '\nbody' })
    expect(headingId('17.1 Garmin: what data we collect &amp; how')).toBe('17-1-garmin-what-data-we-collect-how')
  })

  it('prerenders and lists the english legal pages only', async () => {
    const routes = await getAllPrerenderRoutes()
    const urls = (await getSitemapEntries()).map((e) => e.url)
    for (const slug of LEGAL_SLUGS) {
      expect(routes).toContain(`/en/${slug}`)
      expect(routes).not.toContain(`/de/${slug}`)
      expect(urls).toContain(`https://www.augotraining.com/en/${slug}/`)
    }
  })
})
