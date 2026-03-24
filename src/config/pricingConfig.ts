export type PricingArm = 'per_seat' | 'flat_unlock'

export interface PricingTier {
    cluster: string
    arm: PricingArm
    currency: string
    symbol: string
    perSeat: number
    flat: number
    fxRate: number | null
    discountPct: number
    countryName: string
}

export const PRICING_CONFIG: Record<string, Omit<PricingTier, 'countryName'>> = {
    // ── Arm A — Per-Seat ──────────────────────────────────────────────────────
    US: { cluster: 'us_canada',       arm: 'per_seat',   currency: 'USD', symbol: '$',       perSeat: 3.90,  flat: 25.90,  fxRate: 1.28,  discountPct: 0 },
    CA: { cluster: 'us_canada',       arm: 'per_seat',   currency: 'USD', symbol: '$',       perSeat: 4.90,  flat: 25.90,  fxRate: 1.28,  discountPct: 0 },
    AU: { cluster: 'australia',       arm: 'per_seat',   currency: 'AUD', symbol: 'A$',      perSeat: 5.90,  flat: 30.90,  fxRate: 1.83,  discountPct: -0.15 },
    NZ: { cluster: 'new_zealand',     arm: 'per_seat',   currency: 'NZD', symbol: 'NZ$',     perSeat: 6.90,  flat: 34.90,  fxRate: 2.17,  discountPct: -0.20 },
    DK: { cluster: 'scandinavia_dk',  arm: 'per_seat',   currency: 'DKK', symbol: 'kr\u00a0', perSeat: 21.90, flat: 113.90, fxRate: 8.19,  discountPct: -0.30 },
    SE: { cluster: 'scandinavia_se',  arm: 'per_seat',   currency: 'SEK', symbol: 'kr\u00a0', perSeat: 32.90, flat: 165.90, fxRate: 11.89, discountPct: -0.30 },
    NO: { cluster: 'scandinavia_no',  arm: 'per_seat',   currency: 'NOK', symbol: 'kr\u00a0', perSeat: 32.90, flat: 167.90, fxRate: 12.05, discountPct: -0.30 },
    BR: { cluster: 'brazil',          arm: 'per_seat',   currency: 'BRL', symbol: 'R$\u00a0', perSeat: 12.90, flat: 66.90,  fxRate: 6.74,  discountPct: -0.50 },
    FR: { cluster: 'romance_europe',  arm: 'per_seat',   currency: 'EUR', symbol: '€',       perSeat: 2.90,  flat: 15.90,  fxRate: 1.11,  discountPct: -0.30 },
    IT: { cluster: 'romance_europe',  arm: 'per_seat',   currency: 'EUR', symbol: '€',       perSeat: 2.90,  flat: 15.90,  fxRate: 1.11,  discountPct: -0.30 },
    ES: { cluster: 'romance_europe',  arm: 'per_seat',   currency: 'EUR', symbol: '€',       perSeat: 2.90,  flat: 15.90,  fxRate: 1.11,  discountPct: -0.30 },
    PT: { cluster: 'romance_europe',  arm: 'per_seat',   currency: 'EUR', symbol: '€',       perSeat: 2.90,  flat: 15.90,  fxRate: 1.11,  discountPct: -0.30 },
    PL: { cluster: 'eastern_europe',  arm: 'per_seat',   currency: 'EUR', symbol: '€',       perSeat: 2.90,  flat: 15.90,  fxRate: 1.11,  discountPct: -0.30 },
    CZ: { cluster: 'eastern_europe',  arm: 'per_seat',   currency: 'EUR', symbol: '€',       perSeat: 2.90,  flat: 15.90,  fxRate: 1.11,  discountPct: -0.30 },
    RO: { cluster: 'eastern_europe',  arm: 'per_seat',   currency: 'EUR', symbol: '€',       perSeat: 2.90,  flat: 15.90,  fxRate: 1.11,  discountPct: -0.30 },
    HU: { cluster: 'eastern_europe',  arm: 'per_seat',   currency: 'EUR', symbol: '€',       perSeat: 2.90,  flat: 15.90,  fxRate: 1.11,  discountPct: -0.30 },
    BG: { cluster: 'eastern_europe',  arm: 'per_seat',   currency: 'EUR', symbol: '€',       perSeat: 2.90,  flat: 15.90,  fxRate: 1.11,  discountPct: -0.30 },
    HR: { cluster: 'eastern_europe',  arm: 'per_seat',   currency: 'EUR', symbol: '€',       perSeat: 2.90,  flat: 15.90,  fxRate: 1.11,  discountPct: -0.30 },
    SK: { cluster: 'eastern_europe',  arm: 'per_seat',   currency: 'EUR', symbol: '€',       perSeat: 2.90,  flat: 15.90,  fxRate: 1.11,  discountPct: -0.30 },
    SI: { cluster: 'eastern_europe',  arm: 'per_seat',   currency: 'EUR', symbol: '€',       perSeat: 2.90,  flat: 15.90,  fxRate: 1.11,  discountPct: -0.30 },
    RS: { cluster: 'eastern_europe',  arm: 'per_seat',   currency: 'EUR', symbol: '€',       perSeat: 2.90,  flat: 15.90,  fxRate: 1.11,  discountPct: -0.30 },
    GR: { cluster: 'eastern_europe',  arm: 'per_seat',   currency: 'EUR', symbol: '€',       perSeat: 2.90,  flat: 15.90,  fxRate: 1.11,  discountPct: -0.30 },
    LV: { cluster: 'eastern_europe',  arm: 'per_seat',   currency: 'EUR', symbol: '€',       perSeat: 2.90,  flat: 15.90,  fxRate: 1.11,  discountPct: -0.30 },
    LT: { cluster: 'eastern_europe',  arm: 'per_seat',   currency: 'EUR', symbol: '€',       perSeat: 2.90,  flat: 15.90,  fxRate: 1.11,  discountPct: -0.30 },
    EE: { cluster: 'eastern_europe',  arm: 'per_seat',   currency: 'EUR', symbol: '€',       perSeat: 2.90,  flat: 15.90,  fxRate: 1.11,  discountPct: -0.30 },
    AE: { cluster: 'uae',             arm: 'per_seat',   currency: 'USD', symbol: '$',       perSeat: 4.90,  flat: 25.90,  fxRate: 1.28,  discountPct: 0 },

    // ── Arm B — Flat Unlock ───────────────────────────────────────────────────
    NL: { cluster: 'benelux',         arm: 'flat_unlock', currency: 'EUR', symbol: '€',       perSeat: 2.90, flat: 15.90, fxRate: 1.11, discountPct: -0.30 },
    BE: { cluster: 'benelux',         arm: 'flat_unlock', currency: 'EUR', symbol: '€',       perSeat: 2.90, flat: 15.90, fxRate: 1.11, discountPct: -0.30 },
    LU: { cluster: 'benelux',         arm: 'flat_unlock', currency: 'EUR', symbol: '€',       perSeat: 2.90, flat: 15.90, fxRate: 1.11, discountPct: -0.30 },
    FI: { cluster: 'benelux',         arm: 'flat_unlock', currency: 'EUR', symbol: '€',       perSeat: 2.90, flat: 15.90, fxRate: 1.11, discountPct: -0.30 },
    DE: { cluster: 'dach_eur',        arm: 'flat_unlock', currency: 'EUR', symbol: '€',       perSeat: 2.90, flat: 15.90, fxRate: 1.11, discountPct: -0.30 },
    AT: { cluster: 'dach_eur',        arm: 'flat_unlock', currency: 'EUR', symbol: '€',       perSeat: 2.90, flat: 15.90, fxRate: 1.11, discountPct: -0.30 },
    CH: { cluster: 'dach_chf',        arm: 'flat_unlock', currency: 'CHF', symbol: 'CHF\u00a0', perSeat: 3.90, flat: 19.90, fxRate: null, discountPct: 0 },
    GB: { cluster: 'uk_ireland',      arm: 'flat_unlock', currency: 'GBP', symbol: '£',       perSeat: 2.90, flat: 16.90, fxRate: 0.96, discountPct: -0.10 },
    IE: { cluster: 'uk_ireland',      arm: 'flat_unlock', currency: 'GBP', symbol: '£',       perSeat: 2.90, flat: 16.90, fxRate: 0.96, discountPct: -0.10 },
    MX: { cluster: 'mexico',          arm: 'flat_unlock', currency: 'USD', symbol: '$',       perSeat: 2.90, flat: 12.90, fxRate: 1.28, discountPct: -0.50 },
    CO: { cluster: 'latam_es',        arm: 'flat_unlock', currency: 'USD', symbol: '$',       perSeat: 2.90, flat: 12.90, fxRate: 1.28, discountPct: -0.50 },
    CL: { cluster: 'latam_es',        arm: 'flat_unlock', currency: 'USD', symbol: '$',       perSeat: 2.90, flat: 12.90, fxRate: 1.28, discountPct: -0.50 },
    AR: { cluster: 'latam_es',        arm: 'flat_unlock', currency: 'USD', symbol: '$',       perSeat: 2.90, flat: 12.90, fxRate: 1.28, discountPct: -0.50 },
    PE: { cluster: 'latam_es',        arm: 'flat_unlock', currency: 'USD', symbol: '$',       perSeat: 2.90, flat: 12.90, fxRate: 1.28, discountPct: -0.50 },
    ZA: { cluster: 'south_africa',    arm: 'flat_unlock', currency: 'USD', symbol: '$',       perSeat: 3.90, flat: 17.90, fxRate: 1.28, discountPct: -0.30 },
    SG: { cluster: 'east_asia',       arm: 'flat_unlock', currency: 'USD', symbol: '$',       perSeat: 4.90, flat: 25.90, fxRate: 1.28, discountPct: 0 },
    KR: { cluster: 'east_asia',       arm: 'flat_unlock', currency: 'USD', symbol: '$',       perSeat: 4.90, flat: 25.90, fxRate: 1.28, discountPct: 0 },
    JP: { cluster: 'east_asia',       arm: 'flat_unlock', currency: 'USD', symbol: '$',       perSeat: 4.90, flat: 25.90, fxRate: 1.28, discountPct: 0 },
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
    SI: 'Slovenia',
    RS: 'Serbia',
    LV: 'Latvia',
    LT: 'Lithuania',
    EE: 'Estonia',
    CO: 'Colombia',
    CL: 'Chile',
    AR: 'Argentina',
    PE: 'Peru',
}

const GLOBAL_DEFAULT: Omit<PricingTier, 'countryName'> = {
    cluster: 'global_default',
    arm: 'per_seat',
    currency: 'USD',
    symbol: '$',
    perSeat: 4.90,
    flat: 25.90,
    fxRate: 1.28,
    discountPct: 0,
}

export function getPricingTier(countryCode: string): PricingTier {
    const code = countryCode.toUpperCase()
    const config = PRICING_CONFIG[code] ?? GLOBAL_DEFAULT
    return {
        ...config,
        countryName: COUNTRY_NAMES[code] ?? code,
    }
}
