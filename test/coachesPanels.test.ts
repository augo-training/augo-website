import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import en from '../src/i18n/locales/en.json'
import de from '../src/i18n/locales/de.json'
import pt from '../src/i18n/locales/pt.json'

const LOCALES = { en, de, pt }

/**
 * The coaches carousel pairs two things by index: `coaches.panels` from i18n,
 * and the `panelImages` array in CoachesSection.tsx. Both failure modes are
 * silent — a locale short one panel desyncs the track width from the images and
 * scrolls to a blank frame in that language only, and a missing panelImages
 * entry optional-chains away into an empty image well. Neither throws.
 */
describe('coaches carousel panels', () => {
    const expected = en.coaches.panels.length

    it.each(Object.keys(LOCALES))('%s has the same number of panels as en', (lang) => {
        expect(LOCALES[lang as keyof typeof LOCALES].coaches.panels).toHaveLength(expected)
    })

    it('gives every panel a headline, body and tagline', () => {
        for (const [lang, locale] of Object.entries(LOCALES)) {
            locale.coaches.panels.forEach((panel, i) => {
                for (const field of ['headline', 'body', 'tagline'] as const) {
                    expect(panel[field]?.trim(), `${lang} panel ${i} ${field}`).toBeTruthy()
                }
            })
        }
    })

    it('has one panelLinks entry per panel', () => {
        const source = readFileSync(new URL('../src/components/CoachesSection.tsx', import.meta.url), 'utf8')
        const line = source.match(/const panelLinks: \(string \| null\)\[\] = \[(.*?)\]/s)?.[1] ?? ''
        expect(line.split(',').filter((s) => s.trim())).toHaveLength(expected)
    })

    it('has one panelImages entry per panel', () => {
        const source = readFileSync(new URL('../src/components/CoachesSection.tsx', import.meta.url), 'utf8')
        const block = source.slice(
            source.indexOf('const panelImages'),
            source.indexOf('export default function'),
        )
        // Each panel is one `[ ... ]` group at a fixed four-space indent.
        const groups = block.match(/^ {4}\[$/gm) ?? []
        expect(groups).toHaveLength(expected)
    })
})
