import { describe, expect, it } from 'vitest'
import en from '../src/i18n/locales/en.json'
import de from '../src/i18n/locales/de.json'
import pt from '../src/i18n/locales/pt.json'

type Json = Record<string, unknown>

const LOCALES: Record<string, Json> = { en, de, pt }
const TRANSLATIONS = ['de', 'pt'] as const

function get(obj: Json, path: string): unknown {
    return path.split('.').reduce<unknown>(
        (cur, part) => (cur && typeof cur === 'object' ? (cur as Json)[part] : undefined),
        obj
    )
}

/** Every leaf path under `node`, so a key added to en but missed in de/pt is caught. */
function leafPaths(node: unknown, prefix = ''): string[] {
    if (Array.isArray(node)) return node.flatMap((v, i) => leafPaths(v, `${prefix}[${i}]`))
    if (node && typeof node === 'object') {
        return Object.entries(node as Json).flatMap(([k, v]) =>
            leafPaths(v, prefix ? `${prefix}.${k}` : k)
        )
    }
    return [prefix]
}

describe('pricing copy parity across locales', () => {
    it.each(TRANSLATIONS)('%s defines every leaf key that en defines under `pricing`', (lang) => {
        const expected = leafPaths(get(en, 'pricing'))
        const actual = new Set(leafPaths(get(LOCALES[lang], 'pricing')))
        expect(expected.filter((p) => !actual.has(p))).toEqual([])
    })

    it.each(TRANSLATIONS)('%s defines every leaf key that en defines under `launchOffer`', (lang) => {
        const expected = leafPaths(get(en, 'launchOffer'))
        const actual = new Set(leafPaths(get(LOCALES[lang], 'launchOffer')))
        expect(expected.filter((p) => !actual.has(p))).toEqual([])
    })

    it.each(Object.keys(LOCALES))('%s has the right number of plan features', (lang) => {
        expect(get(LOCALES[lang], 'pricing.pro.features')).toHaveLength(15)
        expect(get(LOCALES[lang], 'pricing.enterprise.features')).toHaveLength(3)
    })
})

describe('interpolation contracts the components depend on', () => {
    it.each(Object.keys(LOCALES))('%s keeps {{price}} in the home FAQ cost answer', (lang) => {
        const items = get(LOCALES[lang], 'faq.items') as Array<{ answer: string }>
        expect(items[0].answer).toContain('{{price}}')
    })

    it.each(Object.keys(LOCALES))('%s keeps {{price}} and the <1> tag in launchOffer.text', (lang) => {
        const text = get(LOCALES[lang], 'launchOffer.text') as string
        expect(text).toContain('{{price}}')
        expect(text).toMatch(/<1>.*<\/1>/)
    })
})

describe('retired pricing keys', () => {
    const RETIRED = [
        'pricing.free', 'pricing.unlimited', 'pricing.flat', 'pricing.trust',
        'pricing.whyCards', 'pricing.whyHeadline', 'pricing.annualBadge',
        'pricing.alwaysFreeNote', 'pricing.freeTierTagline',
        'pricing.earlyBirdDaysLeft_one', 'pricing.earlyAccessBanner',
        'pricing.earlyAccessRibbon', 'launchOffer.daysLeft_one',
        'pricing.featureColumns', 'pricing.featuresLabel',
    ]

    it.each(Object.keys(LOCALES))('%s no longer carries the old flat-plan keys', (lang) => {
        const present = RETIRED.filter((path) => get(LOCALES[lang], path) !== undefined)
        expect(present).toEqual([])
    })
})
