import { describe, expect, it } from 'vitest'
import { formatMoney, formatNumber } from '../src/utils/formatMoney'

describe('formatNumber', () => {
    it.each([
        [7380, 'en', '7,380'], [7380, 'de', '7.380'], [7380, 'pt', '7.380'],
        [9, 'en', '9'], [9.5, 'en', '9.50'], [9.5, 'de', '9,50'],
    ])('%d in %s is %s', (value, lang, expected) => {
        expect(formatNumber(value, lang)).toBe(expected)
    })
})

describe('formatMoney', () => {
    // The symbol stays a prefix in every language, as on the plan cards.
    it.each([
        [7380, '€', 'en', '€7,380'], [7380, '€', 'de', '€7.380'],
        [7380, 'R$ ', 'pt', 'R$ 7.380'], [1500, 'CHF ', 'en', 'CHF 1,500'],
    ])('%d with %j in %s is %s', (value, symbol, lang, expected) => {
        expect(formatMoney(value, symbol, lang)).toBe(expected)
    })

    it('puts the sign before the symbol', () => {
        expect(formatMoney(615, '€', 'en', { signed: true })).toBe('+€615')
        expect(formatMoney(-26, '€', 'en', { signed: true })).toBe('−€26')
        expect(formatMoney(-26, 'CHF ', 'en')).toBe('−CHF 26')
    })

    it('leaves zero and unsigned amounts bare', () => {
        expect(formatMoney(0, '€', 'en', { signed: true })).toBe('€0')
        expect(formatMoney(615, '€', 'en')).toBe('€615')
    })
})
