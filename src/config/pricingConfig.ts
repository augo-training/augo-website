export type PricingBucket = 'ch' | 'eu' | 'br' | 'global'

export interface PricingTier {
    bucket: PricingBucket
    currency: string
    symbol: string
    price: number
}

const CH_TIER: PricingTier = {
    bucket: 'ch',
    currency: 'CHF',
    symbol: 'CHF ',
    price: 19,
}

const EU_TIER: PricingTier = {
    bucket: 'eu',
    currency: 'EUR',
    symbol: '€',
    price: 19,
}

const BR_TIER: PricingTier = {
    bucket: 'br',
    currency: 'BRL',
    symbol: 'R$ ',
    price: 99,
}

const GLOBAL_TIER: PricingTier = {
    bucket: 'global',
    currency: 'USD',
    symbol: '$',
    price: 24,
}

const EU_COUNTRIES: readonly string[] = [
    // EU-27
    'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
    'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
    'SI', 'ES', 'SE',
    // EEA non-EU (Iceland intentionally excluded → USD)
    'NO', 'LI',
    // UK
    'GB',
    // Eastern Europe / non-EU
    'TR', 'RU', 'UA',
    // Western Balkans + neighbors (EUR is the de-facto reference currency)
    'AL', 'BA', 'ME', 'MK', 'RS', 'XK', 'MD', 'BY',
]

export function getPricingTier(countryCode: string): PricingTier {
    const code = countryCode.toUpperCase()
    if (code === 'CH') return CH_TIER
    if (code === 'BR') return BR_TIER
    if (EU_COUNTRIES.includes(code)) return EU_TIER
    return GLOBAL_TIER
}

// End of the early-bird window. Pricing changes Aug 15, 2026.
export const EARLY_BIRD_END_DATE = new Date('2026-08-15T22:00:00Z') // ~midnight CEST

export function getEarlyBirdDaysLeft(now: Date = new Date()): number {
    const ms = EARLY_BIRD_END_DATE.getTime() - now.getTime()
    if (ms <= 0) return 0
    return Math.ceil(ms / (1000 * 60 * 60 * 24)) // ceil → shows "1 day left" on the final day
}
