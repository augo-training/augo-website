import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
    clearPricingCache,
    fetchApiPricingTier,
    pickMonthlyPlan,
    resolvePricing,
    tierFromPlan,
    type PlanOffer,
} from '../src/utils/planPricing'

function offer(overrides: Partial<PlanOffer> = {}): PlanOffer {
    return {
        code: 'pro_flat',
        label: 'Pro',
        description: null,
        amount: 1900,
        currency: 'CHF',
        interval: 'month',
        ...overrides,
    }
}

function okResponse(body: unknown): typeof fetch {
    return vi.fn(async () => ({
        ok: true,
        json: async () => body,
    })) as unknown as typeof fetch
}

beforeEach(() => {
    clearPricingCache()
})

describe('tierFromPlan', () => {
    it('converts minor units to display price', () => {
        const tier = tierFromPlan(offer({ amount: 1900, currency: 'CHF' }))
        expect(tier).toEqual({ bucket: 'ch', currency: 'CHF', symbol: 'CHF ', price: 19 })
    })

    it.each([
        ['CHF', 'ch', 'CHF '],
        ['EUR', 'eu', '€'],
        ['BRL', 'br', 'R$ '],
        ['USD', 'global', '$'],
    ])('presents %s with bucket %s', (currency, bucket, symbol) => {
        const tier = tierFromPlan(offer({ currency }))
        expect(tier?.bucket).toBe(bucket)
        expect(tier?.symbol).toBe(symbol)
    })

    it('keeps fractional amounts', () => {
        expect(tierFromPlan(offer({ amount: 1950 }))?.price).toBe(19.5)
    })

    it('returns null for a currency it cannot present', () => {
        expect(tierFromPlan(offer({ currency: 'GBP' }))).toBeNull()
    })
})

describe('pickMonthlyPlan', () => {
    it('prefers the monthly pro_flat plan', () => {
        const plans = [
            offer({ code: 'other', amount: 900 }),
            offer({ code: 'pro_flat', amount: 1900 }),
        ]
        expect(pickMonthlyPlan(plans)?.code).toBe('pro_flat')
    })

    it('falls back to any monthly plan, then any plan', () => {
        expect(pickMonthlyPlan([offer({ code: 'other' })])?.code).toBe('other')
        expect(pickMonthlyPlan([offer({ interval: 'year' })])?.interval).toBe('year')
        expect(pickMonthlyPlan([])).toBeNull()
    })
})

describe('fetchApiPricingTier', () => {
    it('passes the country hint and maps the response', async () => {
        const fetchImpl = okResponse({
            currency: 'BRL',
            plans: [offer({ currency: 'BRL', amount: 9900 })],
        })

        const tier = await fetchApiPricingTier('BR', fetchImpl)

        expect(tier.currency).toBe('BRL')
        expect(tier.price).toBe(99)
        const url = (fetchImpl as ReturnType<typeof vi.fn>).mock.calls[0][0] as string
        expect(url).toContain('/api/v1/billing/plans?country=BR')
    })

    it('omits the country param when unknown', async () => {
        const fetchImpl = okResponse({ currency: 'USD', plans: [offer({ currency: 'USD' })] })

        await fetchApiPricingTier(null, fetchImpl)

        const url = (fetchImpl as ReturnType<typeof vi.fn>).mock.calls[0][0] as string
        expect(url.endsWith('/api/v1/billing/plans')).toBe(true)
    })

    it('rejects on HTTP errors', async () => {
        const fetchImpl = vi.fn(async () => ({ ok: false, status: 404 })) as unknown as typeof fetch
        await expect(fetchApiPricingTier('CH', fetchImpl)).rejects.toThrow('404')
    })

    it('rejects when no plan is displayable', async () => {
        const fetchImpl = okResponse({ currency: 'USD', plans: [] })
        await expect(fetchApiPricingTier('CH', fetchImpl)).rejects.toThrow('no displayable plan')
    })
})

describe('resolvePricing', () => {
    it('returns api-sourced pricing when the endpoint responds', async () => {
        const fetchImpl = okResponse({ currency: 'CHF', plans: [offer()] })

        const result = await resolvePricing('CH', fetchImpl)

        expect(result.source).toBe('api')
        expect(result.tier.price).toBe(19)
    })

    it('falls back to the legacy tiers when the API is unavailable', async () => {
        const fetchImpl = vi.fn(async () => {
            throw new Error('network down')
        }) as unknown as typeof fetch

        const result = await resolvePricing('CH', fetchImpl)

        expect(result.source).toBe('fallback')
        expect(result.tier.currency).toBe('CHF')
        expect(result.tier.price).toBe(19)
    })

    it('deduplicates concurrent requests per country', async () => {
        const fetchImpl = okResponse({ currency: 'CHF', plans: [offer()] })

        await Promise.all([resolvePricing('CH', fetchImpl), resolvePricing('CH', fetchImpl)])

        expect((fetchImpl as ReturnType<typeof vi.fn>).mock.calls).toHaveLength(1)
    })

    it('retries after a failure instead of memoising it', async () => {
        const failing = vi.fn(async () => {
            throw new Error('down')
        }) as unknown as typeof fetch
        await resolvePricing('CH', failing)

        const fetchImpl = okResponse({ currency: 'CHF', plans: [offer()] })
        const result = await resolvePricing('CH', fetchImpl)

        expect(result.source).toBe('api')
    })
})
