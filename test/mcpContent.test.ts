import { describe, it, expect } from 'vitest'
import en from '../src/i18n/locales/en.json'
import de from '../src/i18n/locales/de.json'
import pt from '../src/i18n/locales/pt.json'
import { MCP_URL, SECTION_IDS } from '../src/components/mcp/constants'

const locales = { en, de, pt } as const
type Locale = (typeof locales)[keyof typeof locales]

/**
 * Structural fingerprint: key names, array lengths and leaf types, but not the
 * translated strings. The real failure mode of an array-driven docs page is a
 * translator dropping a step — German then renders a shorter guide, and its
 * HowTo schema quietly describes a different procedure, with no error anywhere.
 */
function shape(value: unknown): unknown {
    if (Array.isArray(value)) return { array: value.length, of: value.map(shape) }
    if (value && typeof value === 'object') {
        return Object.fromEntries(
            Object.entries(value as Record<string, unknown>)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([k, v]) => [k, shape(v)]),
        )
    }
    return typeof value
}

describe('mcp content', () => {
    it.each([['de', de], ['pt', pt]] as const)('%s mirrors the en key tree exactly', (_lang, locale) => {
        expect(shape((locale as Locale).mcp)).toEqual(shape(en.mcp))
    })

    it('has a non-empty title and body on every step', () => {
        for (const locale of Object.values(locales)) {
            for (const platform of ['claude', 'chatgpt'] as const) {
                const steps = locale.mcp[platform].steps
                expect(steps.length).toBeGreaterThan(0)
                for (const step of steps) {
                    expect(step.title.trim()).not.toBe('')
                    expect(step.body.trim()).not.toBe('')
                }
            }
        }
    })

    it('never embeds a stale augo URL in the copy', () => {
        for (const locale of Object.values(locales)) {
            const urls = JSON.stringify(locale.mcp).match(/https?:\/\/[^"\s]*augotraining[^"\s]*/g) ?? []
            for (const url of urls) {
                expect(url === MCP_URL || url.startsWith('https://augotraining.com')).toBe(true)
            }
        }
    })

    it('keeps the jump list in step with the rendered section ids', () => {
        for (const locale of Object.values(locales)) {
            const ids = locale.mcp.jumpList.items.map((item) => item.id)
            expect(new Set(ids)).toEqual(new Set(Object.values(SECTION_IDS)))
        }
    })

    it('carries no i18next interpolation in FAQ answers', () => {
        // FAQJsonLd re-runs every answer through t() with { price }, so a stray
        // {{token}} would render empty in the structured data.
        for (const locale of Object.values(locales)) {
            for (const item of locale.mcp.faq.items) {
                expect(item.answer).not.toMatch(/\{\{/)
                expect(item.question).not.toMatch(/\{\{/)
            }
        }
    })
})
