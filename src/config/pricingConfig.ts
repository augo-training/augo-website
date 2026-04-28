export type PricingBucket = 'ch' | 'eu' | 'br' | 'global'

export interface PricingTier {
    bucket: PricingBucket
    currency: string
    symbol: string
    price: number
    countryName: string
}

type PricingConfig = Omit<PricingTier, 'countryName'>

const CH_TIER: PricingConfig = {
    bucket: 'ch',
    currency: 'CHF',
    symbol: 'CHF ',
    price: 20,
}

const EU_TIER: PricingConfig = {
    bucket: 'eu',
    currency: 'EUR',
    symbol: '€',
    price: 21,
}

const BR_TIER: PricingConfig = {
    bucket: 'br',
    currency: 'BRL',
    symbol: 'R$ ',
    price: 100,
}

const GLOBAL_TIER: PricingConfig = {
    bucket: 'global',
    currency: 'USD',
    symbol: '$',
    price: 25,
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

export const COUNTRY_NAMES: Record<string, string> = {
    US: 'the United States',
    CA: 'Canada',
    GB: 'the United Kingdom',
    AU: 'Australia',
    NZ: 'New Zealand',
    DE: 'Germany',
    FR: 'France',
    ES: 'Spain',
    IT: 'Italy',
    NL: 'the Netherlands',
    BE: 'Belgium',
    AT: 'Austria',
    PT: 'Portugal',
    FI: 'Finland',
    IE: 'Ireland',
    GR: 'Greece',
    LU: 'Luxembourg',
    SE: 'Sweden',
    NO: 'Norway',
    DK: 'Denmark',
    CH: 'Switzerland',
    IS: 'Iceland',
    BR: 'Brazil',
    MX: 'Mexico',
    JP: 'Japan',
    KR: 'South Korea',
    SG: 'Singapore',
    IL: 'Israel',
    AE: 'the UAE',
    SA: 'Saudi Arabia',
    QA: 'Qatar',
    KW: 'Kuwait',
    BH: 'Bahrain',
    TR: 'Turkey',
    RU: 'Russia',
    UA: 'Ukraine',
    ZA: 'South Africa',
    TH: 'Thailand',
    PL: 'Poland',
    CZ: 'the Czech Republic',
    RO: 'Romania',
    HU: 'Hungary',
    SK: 'Slovakia',
    HR: 'Croatia',
    BG: 'Bulgaria',
    SI: 'Slovenia',
    RS: 'Serbia',
    LV: 'Latvia',
    LT: 'Lithuania',
    EE: 'Estonia',
    CO: 'Colombia',
    CL: 'Chile',
    AR: 'Argentina',
    PE: 'Peru',
    CY: 'Cyprus',
    MT: 'Malta',
    LI: 'Liechtenstein',
    AL: 'Albania',
    BA: 'Bosnia and Herzegovina',
    ME: 'Montenegro',
    MK: 'North Macedonia',
    XK: 'Kosovo',
    MD: 'Moldova',
    BY: 'Belarus',
}

function resolveTier(code: string): PricingConfig {
    if (code === 'CH') return CH_TIER
    if (code === 'BR') return BR_TIER
    if (EU_COUNTRIES.includes(code)) return EU_TIER
    return GLOBAL_TIER
}

export function getPricingTier(countryCode: string): PricingTier {
    const code = countryCode.toUpperCase()
    return {
        ...resolveTier(code),
        countryName: COUNTRY_NAMES[code] ?? code,
    }
}
