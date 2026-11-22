import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import en from '../src/i18n/locales/en.json'
import de from '../src/i18n/locales/de.json'
import pt from '../src/i18n/locales/pt.json'
import { FEATURE_VISUALS, SUPPORT_SLUGS } from '../src/components/features/constants'

const locales = { en, de, pt } as const

/** Same structural fingerprint as mcpContent.test.ts: keys, array lengths, leaf types. */
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

const ids = (locale: (typeof locales)[keyof typeof locales]) => [
    ...locale.features.coach.items.map((item) => item.id),
    ...locale.features.athlete.items.map((item) => item.id),
    locale.features.migration.item.id,
]

describe('features content', () => {
    it.each([['de', de], ['pt', pt]] as const)('%s mirrors the en key tree exactly', (_lang, locale) => {
        expect(shape(locale.features)).toEqual(shape(en.features))
    })

    it('uses the same feature ids, in the same order, in every language', () => {
        for (const locale of Object.values(locales)) expect(ids(locale)).toEqual(ids(en))
    })

    it('has a render for every feature, and no render without a feature', () => {
        expect(new Set(Object.keys(FEATURE_VISUALS))).toEqual(new Set(ids(en)))
        for (const visual of Object.values(FEATURE_VISUALS)) expect(Boolean(visual.src || visual.drawing)).toBe(true)
    })

    it('links only to support articles that exist', () => {
        for (const [id, slug] of Object.entries(SUPPORT_SLUGS)) {
            expect(ids(en)).toContain(id)
            expect(existsSync(join(__dirname, '../src/content/support', `${slug}.json`))).toBe(true)
        }
    })

    it('carries no i18next interpolation in FAQ items', () => {
        // FAQJsonLd re-runs every answer through t(), so a stray {{token}} would
        // render empty in the structured data.
        for (const locale of Object.values(locales)) {
            for (const item of locale.features.faq.items) {
                expect(item.answer).not.toMatch(/\{\{/)
                expect(item.question).not.toMatch(/\{\{/)
            }
        }
    })

    it('writes augo in lowercase', () => {
        for (const locale of Object.values(locales)) {
            expect(JSON.stringify(locale.features)).not.toMatch(/\bAugo\b/)
        }
    })
})
