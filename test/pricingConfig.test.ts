import { describe, expect, it } from 'vitest'
import { getPricingTier, type PricingBucket } from '../src/config/pricingConfig'

/** Annual prepay buys twelve months for the price of ten. */
const ELITE_ANNUAL_MONTHS = 10

const EXPECTED = {
    ch: { currency: 'CHF', symbol: 'CHF ', listPrice: 19, proPrice: 9, eliteMonthly: 100, eliteAnnual: 1000 },
    eu: { currency: 'EUR', symbol: '€', listPrice: 19, proPrice: 9, eliteMonthly: 100, eliteAnnual: 1000 },
    br: { currency: 'BRL', symbol: 'R$ ', listPrice: 99, proPrice: 49, eliteMonthly: 549, eliteAnnual: 5490 },
    global: { currency: 'USD', symbol: '$', listPrice: 19, proPrice: 9, eliteMonthly: 100, eliteAnnual: 1000 },
} as const

const BUCKETS = Object.keys(EXPECTED) as PricingBucket[]

describe('getPricingTier — country to bucket', () => {
    it.each([
        ['CH', 'ch'],
        ['BR', 'br'],
        ['DE', 'eu'], ['FR', 'eu'], ['PT', 'eu'], ['ES', 'eu'], ['IT', 'eu'], ['NL', 'eu'],
        ['GB', 'eu'], ['TR', 'eu'], ['RU', 'eu'], ['UA', 'eu'], ['NO', 'eu'], ['LI', 'eu'],
        ['RS', 'eu'], ['XK', 'eu'], ['BY', 'eu'],
        ['US', 'global'], ['CA', 'global'], ['AU', 'global'], ['JP', 'global'],
        ['MX', 'global'], ['AE', 'global'], ['ZA', 'global'],
    ])('maps %s to the %s bucket', (code, bucket) => {
        expect(getPricingTier(code).bucket).toBe(bucket)
    })

    it('routes Iceland to USD — deliberately excluded from EU_COUNTRIES', () => {
        expect(getPricingTier('IS').bucket).toBe('global')
    })

    it.each(['', 'zz', 'XX', '123'])('falls back to the global tier for %o', (code) => {
        const tier = getPricingTier(code)
        expect(tier.bucket).toBe('global')
        expect(tier.currency).toBe('USD')
    })

    it.each(['ch', 'Ch', 'cH'])('is case-insensitive for %o', (code) => {
        expect(getPricingTier(code)).toEqual(getPricingTier('CH'))
    })
})

describe('pricing amounts', () => {
    const sample: Record<PricingBucket, string> = { ch: 'CH', eu: 'DE', br: 'BR', global: 'US' }

    it.each(BUCKETS)('%s tier carries the agreed amounts', (bucket) => {
        expect(getPricingTier(sample[bucket])).toMatchObject({ bucket, ...EXPECTED[bucket] })
    })

    it.each(BUCKETS)('%s promo price is below the struck-through list price', (bucket) => {
        const tier = getPricingTier(sample[bucket])
        expect(tier.proPrice).toBeLessThan(tier.listPrice)
    })

    it.each(BUCKETS)('%s Elite annual prepay is ten months for twelve', (bucket) => {
        const tier = getPricingTier(sample[bucket])
        expect(tier.eliteAnnual).toBe(tier.eliteMonthly * ELITE_ANNUAL_MONTHS)
    })

    it('gives every bucket a distinct currency', () => {
        const currencies = BUCKETS.map((b) => EXPECTED[b].currency)
        expect(new Set(currencies).size).toBe(BUCKETS.length)
    })
})

describe('early-bird countdown', () => {
    it('stays removed — the launch offer is a static badge, not a deadline', async () => {
        const mod = await import('../src/config/pricingConfig')
        expect(mod).not.toHaveProperty('getEarlyBirdDaysLeft')
        expect(mod).not.toHaveProperty('EARLY_BIRD_END_DATE')
    })
})
