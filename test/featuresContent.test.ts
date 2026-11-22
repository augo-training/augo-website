import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import en from '../src/i18n/locales/en.json'
import de from '../src/i18n/locales/de.json'
import pt from '../src/i18n/locales/pt.json'
import { FEATURE_VISUALS, STAGE_FEATURES, SUPPORT_SLUGS, viewForHash } from '../src/components/features/constants'

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
    })

    it('only puts real features in the coaching week, coach and athlete on their own side', () => {
        const coach = new Set(en.features.coach.items.map((item) => item.id))
        const athlete = new Set(en.features.athlete.items.map((item) => item.id))
        expect(STAGE_FEATURES.map((s) => s.key)).toEqual(en.features.week.stages.map((s) => s.key))
        for (const stage of STAGE_FEATURES) {
            expect(stage.coach.length).toBeGreaterThan(0)
            expect(stage.athlete.length).toBeGreaterThan(0)
            for (const id of stage.coach) expect(coach.has(id)).toBe(true)
            for (const id of stage.athlete) expect(athlete.has(id)).toBe(true)
        }
    })

    it('links only to support articles that exist', () => {
        for (const [id, slug] of Object.entries(SUPPORT_SLUGS)) {
            expect(ids(en)).toContain(id)
            expect(existsSync(join(__dirname, '../src/content/support', `${slug}.json`))).toBe(true)
        }
    })

    it('opens the week view for week and stage hashes, and the guide for features', () => {
        expect(viewForHash('#by-week')).toBe('week')
        expect(viewForHash('#week-listen')).toBe('week')
        expect(viewForHash('#by-feature')).toBe('guide')
        expect(viewForHash('#assistant')).toBe('guide')
        expect(viewForHash('#a-recovery')).toBe('guide')
    })

    it('leaves the view alone for sections under both views', () => {
        expect(viewForHash('#all-features')).toBeNull()
        expect(viewForHash('#integrations')).toBeNull()
        expect(viewForHash('#at-a-glance')).toBeNull()
        expect(viewForHash('#faqs')).toBeNull()
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
