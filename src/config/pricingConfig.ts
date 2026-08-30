export type PricingBucket = 'ch' | 'eu' | 'br' | 'global'

export interface PricingTier {
    bucket: PricingBucket
    currency: string
    symbol: string
    /** Full list price, rendered struck through above the promo price. */
    listPrice: number
    /** Promotional Pro price, per athlete per month. */
    proPrice: number
    /** Elite add-on, per month on monthly billing. */
    eliteMonthly: number
    /** Elite add-on, per month when billed yearly (20% off the monthly rate). */
    eliteYearly: number
}

const CH_TIER: PricingTier = {
    bucket: 'ch',
    currency: 'CHF',
    symbol: 'CHF ',
    listPrice: 19,
    proPrice: 9,
    eliteMonthly: 100,
    eliteYearly: 80,
}

const EU_TIER: PricingTier = {
    bucket: 'eu',
    currency: 'EUR',
    symbol: '€',
    listPrice: 19,
    proPrice: 9,
    eliteMonthly: 100,
    eliteYearly: 80,
}

const BR_TIER: PricingTier = {
    bucket: 'br',
    currency: 'BRL',
    symbol: 'R$ ',
    listPrice: 99,
    proPrice: 49,
    eliteMonthly: 549,
    eliteYearly: 439,
}

const GLOBAL_TIER: PricingTier = {
    bucket: 'global',
    currency: 'USD',
    symbol: '$',
    listPrice: 19,
    proPrice: 9,
    eliteMonthly: 100,
    eliteYearly: 80,
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
