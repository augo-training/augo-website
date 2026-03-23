export type PricingArm = 'per_seat' | 'flat_unlock'

export interface PricingTier {
    cluster: string
    arm: PricingArm
    currency: string
    symbol: string
    perSeat?: number
    flat?: number
    countryName: string
}

export const PRICING_CONFIG: Record<string, Omit<PricingTier, 'countryName'>> = {
    // Tier 1 — per-seat (English-speaking high-income)
    US: { cluster: 'tier1_en', arm: 'per_seat', currency: 'USD', symbol: '$', perSeat: 1.99 },
    CA: { cluster: 'tier1_en', arm: 'per_seat', currency: 'CAD', symbol: 'CA$', perSeat: 2.49 },
    GB: { cluster: 'tier1_en', arm: 'per_seat', currency: 'GBP', symbol: '£', perSeat: 1.59 },
    AU: { cluster: 'tier1_en', arm: 'per_seat', currency: 'AUD', symbol: 'A$', perSeat: 2.99 },
    NZ: { cluster: 'tier2_en', arm: 'flat_unlock', currency: 'NZD', symbol: 'NZ$', flat: 14.90 },

    // Eurozone — flat unlock
    DE: { cluster: 'eu', arm: 'flat_unlock', currency: 'EUR', symbol: '€', flat: 14.90 },
    FR: { cluster: 'eu', arm: 'flat_unlock', currency: 'EUR', symbol: '€', flat: 14.90 },
    ES: { cluster: 'eu', arm: 'flat_unlock', currency: 'EUR', symbol: '€', flat: 14.90 },
    IT: { cluster: 'eu', arm: 'flat_unlock', currency: 'EUR', symbol: '€', flat: 14.90 },
    NL: { cluster: 'eu', arm: 'flat_unlock', currency: 'EUR', symbol: '€', flat: 14.90 },
    BE: { cluster: 'eu', arm: 'flat_unlock', currency: 'EUR', symbol: '€', flat: 14.90 },
    AT: { cluster: 'eu', arm: 'flat_unlock', currency: 'EUR', symbol: '€', flat: 14.90 },
    PT: { cluster: 'eu', arm: 'flat_unlock', currency: 'EUR', symbol: '€', flat: 14.90 },
    FI: { cluster: 'eu', arm: 'flat_unlock', currency: 'EUR', symbol: '€', flat: 14.90 },
    IE: { cluster: 'eu', arm: 'flat_unlock', currency: 'EUR', symbol: '€', flat: 14.90 },
    GR: { cluster: 'eu', arm: 'flat_unlock', currency: 'EUR', symbol: '€', flat: 14.90 },
    LU: { cluster: 'eu', arm: 'flat_unlock', currency: 'EUR', symbol: '€', flat: 14.90 },

    // Non-euro Europe
    SE: { cluster: 'nordic', arm: 'flat_unlock', currency: 'SEK', symbol: 'kr\u00a0', flat: 169 },
    NO: { cluster: 'nordic', arm: 'flat_unlock', currency: 'NOK', symbol: 'kr\u00a0', flat: 179 },
    DK: { cluster: 'nordic', arm: 'flat_unlock', currency: 'DKK', symbol: 'kr\u00a0', flat: 109 },
    CH: { cluster: 'dach', arm: 'flat_unlock', currency: 'CHF', symbol: 'CHF\u00a0', flat: 19.90 },

    // LATAM
    BR: { cluster: 'latam_br', arm: 'flat_unlock', currency: 'BRL', symbol: 'R$\u00a0', flat: 49.90 },
    MX: { cluster: 'latam_mx', arm: 'flat_unlock', currency: 'MXN', symbol: 'MX$', flat: 179 },
}

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
    ZA: 'South Africa',
    TH: 'Thailand',
    PL: 'Poland',
    CZ: 'the Czech Republic',
    RO: 'Romania',
    HU: 'Hungary',
    SK: 'Slovakia',
    HR: 'Croatia',
    BG: 'Bulgaria',
}

export const DEFAULT_HIGH: Omit<PricingTier, 'countryName'> = {
    cluster: 'high_income_default',
    arm: 'flat_unlock',
    currency: 'USD',
    symbol: '$',
    flat: 19.90,
}

export const DEFAULT_MID: Omit<PricingTier, 'countryName'> = {
    cluster: 'upper_mid_default',
    arm: 'flat_unlock',
    currency: 'USD',
    symbol: '$',
    flat: 13.90,
}

export const DEFAULT_LOW: Omit<PricingTier, 'countryName'> = {
    cluster: 'global_default',
    arm: 'flat_unlock',
    currency: 'USD',
    symbol: '$',
    flat: 9.90,
}

const HIGH_INCOME_DEFAULTS = new Set(['JP', 'KR', 'SG', 'IL', 'AE', 'SA', 'QA', 'KW', 'BH', 'OM'])
const UPPER_MID_DEFAULTS = new Set(['TR', 'ZA', 'TH', 'PL', 'CZ', 'RO', 'HU', 'SK', 'HR', 'BG', 'LT', 'LV', 'EE', 'RS', 'UA', 'AR', 'CO', 'CL', 'PE'])

export function getPricingTier(countryCode: string): PricingTier {
    const code = countryCode.toUpperCase()

    if (PRICING_CONFIG[code]) {
        return {
            ...PRICING_CONFIG[code],
            countryName: COUNTRY_NAMES[code] ?? code,
        }
    }

    if (HIGH_INCOME_DEFAULTS.has(code)) {
        return {
            ...DEFAULT_HIGH,
            countryName: COUNTRY_NAMES[code] ?? code,
        }
    }

    if (UPPER_MID_DEFAULTS.has(code)) {
        return {
            ...DEFAULT_MID,
            countryName: COUNTRY_NAMES[code] ?? code,
        }
    }

    return {
        ...DEFAULT_LOW,
        countryName: COUNTRY_NAMES[code] ?? code,
    }
}
