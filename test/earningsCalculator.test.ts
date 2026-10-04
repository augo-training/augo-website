import { describe, expect, it } from 'vitest'
import {
    ATHLETES_MAX_DIGITS,
    CALCULATOR_RANGES,
    PRICE_MAX_DIGITS,
    athletesWithAugo,
    barShares,
    calculateEarnings,
    clampToRange,
    minProfitablePrice,
    parseWholeNumber,
    sanitizeDigits,
    type SliderRange,
} from '../src/config/earningsCalculator'
import { getPricingTier, type PricingBucket } from '../src/config/pricingConfig'

const COUNTRY_FOR: Record<PricingBucket, string> = { ch: 'CH', eu: 'DE', br: 'BR', global: 'US' }
const BUCKETS = Object.keys(CALCULATOR_RANGES) as PricingBucket[]

function positions(range: SliderRange): number[] {
    const out: number[] = []
    for (let v = range.min; v <= range.max; v += range.step) out.push(v)
    return out
}

describe('calculateEarnings', () => {
    it('works the example on the page: 10 athletes at 150, augo at 9', () => {
        expect(calculateEarnings({ athletes: 10, price: 150, proPrice: 9 })).toEqual({
            athletes: 10,
            athletesWithAugo: 15,
            extraAthletes: 5,
            currentToolCost: 0,
            today: 1500,
            augoCost: 135,
            withAugo: 2115,
            monthlyGain: 615,
            minProfitablePrice: 28,
        })
    })

    // "Up to 50%": rounding down never promises more than half again.
    it.each([
        [1, 1], [2, 3], [3, 4], [5, 7], [7, 10], [10, 15], [11, 16],
    ])('%i athletes become %i', (athletes, expected) => {
        expect(athletesWithAugo(athletes)).toBe(expected)
        expect(athletesWithAugo(athletes)).toBeLessThanOrEqual(athletes * 1.5)
    })

    it('shows a single athlete the plain cost: there is no extra athlete to add', () => {
        const result = calculateEarnings({ athletes: 1, price: 150, proPrice: 9 })
        expect(result.extraAthletes).toBe(0)
        expect(result.monthlyGain).toBe(-9)
        expect(result.minProfitablePrice).toBeNull()
    })

    // An odd roster pays for one more seat than the even roster below it, without
    // gaining an athlete. The dip is real, so it is pinned rather than smoothed.
    it.each([2, 10, 48])('dips by one augo seat going from %i athletes to the next odd roster', (even) => {
        const gain = (athletes: number) => calculateEarnings({ athletes, price: 150, proPrice: 9 }).monthlyGain
        expect(gain(even + 1)).toBe(gain(even) - 9)
    })

    it('keeps the largest typeable values exact', () => {
        const athletes = 10 ** ATHLETES_MAX_DIGITS - 1
        const price = 10 ** PRICE_MAX_DIGITS - 1
        const result = calculateEarnings({ athletes, price, proPrice: 49 })
        expect(Number.isSafeInteger(result.monthlyGain)).toBe(true)
        expect(result.monthlyGain).toBe(499 * 9999 - 1498 * 49)
    })
})

// augo replaces the tool the coach pays for today, so that cost stops and
// counts in augo's favour.
describe('current tool cost', () => {
    it('comes off today and adds to the return, leaving the augo side alone', () => {
        const without = calculateEarnings({ athletes: 10, price: 150, proPrice: 9 })
        const result = calculateEarnings({ athletes: 10, price: 150, proPrice: 9, currentToolCost: 49 })
        expect(result.today).toBe(1451)
        expect(result.withAugo).toBe(without.withAugo)
        expect(result.augoCost).toBe(135)
        expect(result.monthlyGain).toBe(664)
    })

    it('counts the whole saving when the current tool costs more than augo', () => {
        const result = calculateEarnings({ athletes: 10, price: 150, proPrice: 9, currentToolCost: 200 })
        expect(result.monthlyGain).toBe(815)
    })

    it('can put a single athlete ahead on the saving alone', () => {
        const result = calculateEarnings({ athletes: 1, price: 150, proPrice: 9, currentToolCost: 49 })
        expect(result.extraAthletes).toBe(0)
        expect(result.monthlyGain).toBe(40)
    })

    it('lowers the price at which augo pays for itself, never below 1', () => {
        expect(minProfitablePrice(10, 9, 49)).toBe(18)
        expect(calculateEarnings({ athletes: 10, price: 18, proPrice: 9, currentToolCost: 49 }).monthlyGain).toBeGreaterThan(0)
        expect(calculateEarnings({ athletes: 10, price: 17, proPrice: 9, currentToolCost: 49 }).monthlyGain).toBeLessThanOrEqual(0)
        expect(minProfitablePrice(10, 9, 500)).toBe(1)
    })

    it('can leave today in the red without breaking the bars', () => {
        const shares = barShares(calculateEarnings({ athletes: 2, price: 40, proPrice: 9, currentToolCost: 500 }))
        expect(shares).toEqual({ today: 0, withAugo: 1 })
    })
})

// What the calculator opens on: 15 athletes, where half an athlete rounds down.
describe('the default roster', () => {
    it.each(BUCKETS)('%s starts at 15 athletes, which become 22', (bucket) => {
        const { initial } = CALCULATOR_RANGES[bucket].athletes
        expect(initial).toBe(15)
        expect(athletesWithAugo(initial)).toBe(22)
    })

    it('shows 2,250 against 3,102 at 150 with augo at 9', () => {
        const result = calculateEarnings({ athletes: 15, price: 150, proPrice: 9 })
        expect([result.today, result.augoCost, result.withAugo, result.monthlyGain]).toEqual([2250, 198, 3102, 852])
    })
})

describe('minProfitablePrice', () => {
    it.each([
        [2, 9, 28], [10, 9, 28], [3, 9, 37], [5, 9, 32],
        [10, 49, 148], [3, 49, 197], [10, 12, 37], [3, 12, 49],
    ])('%i athletes with augo at %i gain from %i', (athletes, proPrice, expected) => {
        expect(minProfitablePrice(athletes, proPrice)).toBe(expected)
    })

    it('is the exact boundary: a gain at that price, none one below', () => {
        for (const proPrice of [9, 12, 49]) {
            for (let athletes = 2; athletes <= 200; athletes++) {
                const price = minProfitablePrice(athletes, proPrice)!
                expect(calculateEarnings({ athletes, price, proPrice }).monthlyGain).toBeGreaterThan(0)
                expect(calculateEarnings({ athletes, price: price - 1, proPrice }).monthlyGain).toBeLessThanOrEqual(0)
            }
        }
    })
})

describe('slider ranges', () => {
    // The promise of the section: wherever the sliders sit, the coach comes out
    // ahead. A change to proPrice that breaks this must be decided, not shipped.
    it.each(BUCKETS)('%s: every slider position shows a gain', (bucket) => {
        const { proPrice } = getPricingTier(COUNTRY_FOR[bucket])
        const { price, athletes } = CALCULATOR_RANGES[bucket]
        for (const a of positions(athletes)) {
            for (const p of positions(price)) {
                expect(
                    calculateEarnings({ athletes: a, price: p, proPrice }).monthlyGain,
                    `${a} athletes at ${p}`
                ).toBeGreaterThan(0)
            }
        }
    })

    it.each(BUCKETS)('%s: ranges are well-formed', (bucket) => {
        for (const range of Object.values(CALCULATOR_RANGES[bucket])) {
            expect(range.min).toBeLessThan(range.initial)
            expect(range.initial).toBeLessThan(range.max)
            expect((range.max - range.min) % range.step).toBe(0)
            expect((range.initial - range.min) % range.step).toBe(0)
        }
        expect(CALCULATOR_RANGES[bucket].athletes.min).toBeGreaterThanOrEqual(2)
    })

    it('snaps a typed value to the nearest slider position, inside the range', () => {
        const range = CALCULATOR_RANGES.eu.price
        expect(clampToRange(20, range)).toBe(40)
        expect(clampToRange(9999, range)).toBe(400)
        expect(clampToRange(152, range)).toBe(150)
        expect(clampToRange(153, range)).toBe(155)
    })
})

describe('typed input', () => {
    it.each([
        ['150', 4, '150'], ['1 500', 4, '1500'], ['abc', 4, ''], ['12a3', 4, '123'],
        ['123456', 4, '1234'], ['-20', 4, '20'], ['9.5', 3, '95'], ['', 4, ''],
    ])('sanitizes %j to at most %i digits', (raw, maxDigits, expected) => {
        expect(sanitizeDigits(raw, maxDigits)).toBe(expected)
    })

    it.each([
        ['150', 150], ['0150', 150], ['1', 1],
        ['', null], ['0', null], ['000', null], ['abc', null],
    ])('parses %j', (text, expected) => {
        expect(parseWholeNumber(text)).toBe(expected)
    })
})

describe('barShares', () => {
    it('scales both bars to the larger amount', () => {
        const shares = barShares(calculateEarnings({ athletes: 10, price: 150, proPrice: 9 }))
        expect(shares.withAugo).toBe(1)
        expect(shares.today).toBeCloseTo(1500 / 2115)
    })

    it('lets "today" lead when augo costs more than it brings', () => {
        const shares = barShares(calculateEarnings({ athletes: 10, price: 20, proPrice: 9 }))
        expect(shares.today).toBe(1)
        expect(shares.withAugo).toBeCloseTo(165 / 200)
    })

    it('never goes below zero', () => {
        const shares = barShares(calculateEarnings({ athletes: 10, price: 5, proPrice: 9 }))
        expect(shares).toEqual({ today: 1, withAugo: 0 })
    })
})
