import type { PricingBucket } from './pricingConfig'

export interface SliderRange {
    min: number
    max: number
    step: number
    /** Where the slider sits before the coach touches it. */
    initial: number
}

export interface CalculatorRanges {
    price: SliderRange
    athletes: SliderRange
}

const ATHLETES_RANGE: SliderRange = { min: 2, max: 50, step: 1, initial: 15 }

/**
 * Hard-coded rather than derived from `proPrice`: every slider position has to
 * show a gain, and a price change should fail the invariant test and force a
 * decision here instead of silently moving the slider.
 */
export const CALCULATOR_RANGES: Record<PricingBucket, CalculatorRanges> = {
    ch: { price: { min: 40, max: 400, step: 5, initial: 150 }, athletes: ATHLETES_RANGE },
    eu: { price: { min: 40, max: 400, step: 5, initial: 150 }, athletes: ATHLETES_RANGE },
    br: { price: { min: 200, max: 1500, step: 25, initial: 350 }, athletes: ATHLETES_RANGE },
    global: { price: { min: 50, max: 500, step: 5, initial: 150 }, athletes: ATHLETES_RANGE },
}

/** Typed values may leave the slider range, but not grow without bound. */
export const PRICE_MAX_DIGITS = 4
export const ATHLETES_MAX_DIGITS = 3

export interface EarningsResult {
    athletes: number
    athletesWithAugo: number
    extraAthletes: number
    /** What the coach pays for their current tool per month; 0 when not given. */
    currentToolCost: number
    /** Monthly take-home today: revenue, less the current tool when one was given. */
    today: number
    /** augo is paid on every athlete, not only the extra ones. */
    augoCost: number
    /** Monthly take-home with augo, after augo's cost. augo replaces the current tool. */
    withAugo: number
    /** With augo, less today: the figure shown in brackets. */
    monthlyGain: number
    /** Lowest whole price at which this roster gains; null when there is no extra athlete. */
    minProfitablePrice: number | null
}

/**
 * Up to 50% more athletes, rounded down so the promise is never overstated:
 * 3 athletes become 4, not 5.
 */
export function athletesWithAugo(athletes: number): number {
    return athletes + Math.floor(athletes / 2)
}

export function minProfitablePrice(athletes: number, proPrice: number, currentToolCost = 0): number | null {
    const withAugo = athletesWithAugo(athletes)
    const extra = withAugo - athletes
    if (extra <= 0) return null
    // The current tool's cost stops, so only augo's cost beyond it has to be earned back.
    return Math.max(1, Math.floor((withAugo * proPrice - currentToolCost) / extra) + 1)
}

export function calculateEarnings(input: {
    athletes: number
    price: number
    proPrice: number
    currentToolCost?: number
}): EarningsResult {
    const { athletes, price, proPrice, currentToolCost = 0 } = input
    const withAugoCount = athletesWithAugo(athletes)
    const today = athletes * price - currentToolCost
    const augoCost = withAugoCount * proPrice
    const withAugo = withAugoCount * price - augoCost
    const monthlyGain = withAugo - today
    return {
        athletes,
        athletesWithAugo: withAugoCount,
        extraAthletes: withAugoCount - athletes,
        currentToolCost,
        today,
        augoCost,
        withAugo,
        monthlyGain,
        minProfitablePrice: minProfitablePrice(athletes, proPrice, currentToolCost),
    }
}

/** What the calculator showed for a set of inputs, as analytics properties. */
export interface EarningsSnapshot {
    price_per_athlete: number
    athletes: number
    athletes_with_augo: number
    net_income_without_augo: number
    net_income_with_augo: number
    monthly_gain: number
    pricing_currency: string
    /** Only present when the coach filled in the optional field. */
    current_tool_cost?: number
}

/**
 * One builder for both the "values settled" event and the trial button's click,
 * so the two cannot drift apart.
 */
export function earningsSnapshot(
    result: EarningsResult,
    input: { price: number; currency: string; toolCost: number | null },
): EarningsSnapshot {
    return {
        price_per_athlete: input.price,
        athletes: result.athletes,
        athletes_with_augo: result.athletesWithAugo,
        net_income_without_augo: result.today,
        net_income_with_augo: result.withAugo,
        monthly_gain: result.monthlyGain,
        pricing_currency: input.currency,
        ...(input.toolCost !== null ? { current_tool_cost: input.toolCost } : {}),
    }
}

/** Keeps only digits, up to `maxDigits` of them. */
export function sanitizeDigits(raw: string, maxDigits: number): string {
    return raw.replace(/\D/g, '').slice(0, maxDigits)
}

/** A positive whole number, or null for an empty or zero field. */
export function parseWholeNumber(text: string): number | null {
    if (!/^\d+$/.test(text)) return null
    const value = Number(text)
    return value > 0 ? value : null
}

/** Nearest slider position for a value that may have been typed outside the range. */
export function clampToRange(value: number, range: SliderRange): number {
    const clamped = Math.min(Math.max(value, range.min), range.max)
    const snapped = range.min + Math.round((clamped - range.min) / range.step) * range.step
    return Math.min(snapped, range.max)
}

/** Each bar's width as a share (0 to 1) of the larger of the two amounts. */
export function barShares(result: EarningsResult): { today: number; withAugo: number } {
    const largest = Math.max(result.today, result.withAugo)
    if (largest <= 0) return { today: 0, withAugo: 0 }
    return {
        today: Math.max(result.today, 0) / largest,
        withAugo: Math.max(result.withAugo, 0) / largest,
    }
}
