import { getPricingTier, type PricingBucket, type PricingTier } from '../config/pricingConfig'

/**
 * Backend-sourced plan pricing (INV-7: prices come from the backend, which
 * caches them from Stripe — never hardcoded here).
 *
 * The client never chooses a currency and never maps countries to
 * currencies: it forwards the IP-estimated country as a `?country=` hint and
 * renders whatever currency the backend resolves. The charge currency is
 * ultimately determined at checkout (credit card / Stripe).
 *
 * Until billing is enabled in production the endpoint does not exist, so the
 * legacy hardcoded tiers in pricingConfig.ts remain as a fallback. Remove the
 * fallback (and pricingConfig's amounts) once billing is GA.
 */

export interface PlanOffer {
    code: string
    label: string
    description: string | null
    amount: number // integer minor units (cents/centavos)
    currency: string
    interval: string
}

export interface PublicPlansResponse {
    currency: string
    plans: PlanOffer[]
}

export interface ResolvedPricing {
    tier: PricingTier
    source: 'api' | 'fallback'
}

// Typed loosely so this module also compiles under the node tsconfig used by
// tests/scripts, which has no vite/client types.
const API_BASE_URL: string =
    (import.meta as { env?: Record<string, string | undefined> }).env?.VITE_API_BASE_URL ??
    'https://api.augotraining.com'

// Presentation only — how to render a backend-resolved currency. Formatting
// is the client's job; amounts always come from the backend.
const CURRENCY_PRESENTATION: Record<string, { symbol: string; bucket: PricingBucket }> = {
    CHF: { symbol: 'CHF ', bucket: 'ch' },
    EUR: { symbol: '€', bucket: 'eu' },
    BRL: { symbol: 'R$ ', bucket: 'br' },
    USD: { symbol: '$', bucket: 'global' },
}

export function tierFromPlan(plan: PlanOffer): PricingTier | null {
    const presentation = CURRENCY_PRESENTATION[plan.currency]
    if (!presentation) return null
    return {
        bucket: presentation.bucket,
        currency: plan.currency,
        symbol: presentation.symbol,
        price: plan.amount / 100,
    }
}

export function pickMonthlyPlan(plans: PlanOffer[]): PlanOffer | null {
    return (
        plans.find((p) => p.code === 'pro_flat' && p.interval === 'month') ??
        plans.find((p) => p.interval === 'month') ??
        plans[0] ??
        null
    )
}

export async function fetchApiPricingTier(
    countryCode: string | null,
    fetchImpl: typeof fetch = fetch,
    timeoutMs = 4000
): Promise<PricingTier> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
    try {
        const query = countryCode ? `?country=${encodeURIComponent(countryCode)}` : ''
        const res = await fetchImpl(`${API_BASE_URL}/api/v1/billing/plans${query}`, {
            signal: controller.signal,
        })
        if (!res.ok) throw new Error(`plans request failed: ${res.status}`)
        const data = (await res.json()) as PublicPlansResponse
        const plan = pickMonthlyPlan(data.plans)
        const tier = plan ? tierFromPlan(plan) : null
        if (!tier) throw new Error('no displayable plan in response')
        return tier
    } finally {
        clearTimeout(timeoutId)
    }
}

// Deduplicates concurrent callers (pill + pricing cards) per country.
const pricingCache = new Map<string, Promise<ResolvedPricing>>()

export function resolvePricing(
    countryCode: string | null,
    fetchImpl: typeof fetch = fetch
): Promise<ResolvedPricing> {
    const key = countryCode ?? ''
    let pending = pricingCache.get(key)
    if (!pending) {
        pending = fetchApiPricingTier(countryCode, fetchImpl)
            .then((tier): ResolvedPricing => ({ tier, source: 'api' }))
            .catch((): ResolvedPricing => {
                // Don't memoise failures — a later mount retries the API.
                pricingCache.delete(key)
                return { tier: getPricingTier(countryCode ?? ''), source: 'fallback' }
            })
        pricingCache.set(key, pending)
    }
    return pending
}

export function clearPricingCache(): void {
    pricingCache.clear()
}
