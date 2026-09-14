import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import en from '../src/i18n/locales/en.json'
import de from '../src/i18n/locales/de.json'
import pt from '../src/i18n/locales/pt.json'

const LOCALES = { en, de, pt }
type Lang = keyof typeof LOCALES

/**
 * Both home page carousels pair two things by index: a `panels` array in i18n,
 * and a `panelImages` array in the component. Both failure modes are silent — a
 * locale short one panel desyncs the track width from the images and scrolls to
 * a blank frame in that language only, and a missing panelImages entry
 * optional-chains away into an empty image well. Neither throws.
 */
const SECTIONS = [
    { key: 'coaches' as const, file: 'CoachesSection.tsx', fields: ['headline', 'body', 'tagline'] },
    { key: 'athletes' as const, file: 'AthletesSection.tsx', fields: ['headline', 'body'] },
]

function source(file: string): string {
    return readFileSync(new URL(`../src/components/${file}`, import.meta.url), 'utf8')
}

describe.each(SECTIONS)('$key carousel panels', ({ key, file, fields }) => {
    const expected = en[key].panels.length

    it.each(Object.keys(LOCALES))('%s has the same number of panels as en', (lang) => {
        expect(LOCALES[lang as Lang][key].panels).toHaveLength(expected)
    })

    it(`gives every panel ${fields.join(', ')}`, () => {
        for (const [lang, locale] of Object.entries(LOCALES)) {
            locale[key].panels.forEach((panel: Record<string, string>, i: number) => {
                for (const field of fields) {
                    expect(panel[field]?.trim(), `${lang} panel ${i} ${field}`).toBeTruthy()
                }
            })
        }
    })

    it('has one panelImages entry per panel', () => {
        const block = source(file).slice(
            source(file).indexOf('const panelImages'),
            source(file).indexOf('export default function'),
        )
        expect(block.match(/^ {4}\[$/gm) ?? []).toHaveLength(expected)
    })
})

describe('coaches panel links', () => {
    it('has one panelLinks entry per panel', () => {
        const line = source('CoachesSection.tsx').match(/const panelLinks: \(string \| null\)\[\] = \[(.*?)\]/s)?.[1] ?? ''
        expect(line.split(',').filter((s) => s.trim())).toHaveLength(en.coaches.panels.length)
    })
})
