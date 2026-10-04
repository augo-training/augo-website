import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import type { PricingTier } from '../../config/pricingConfig'
import {
    ATHLETES_MAX_DIGITS,
    CALCULATOR_RANGES,
    PRICE_MAX_DIGITS,
    barShares,
    calculateEarnings,
    clampToRange,
    earningsSnapshot,
    parseWholeNumber,
    sanitizeDigits,
    type SliderRange,
} from '../../config/earningsCalculator'
import { formatMoney } from '../../utils/formatMoney'
import {
    trackEarningsCalculatorStarted,
    trackEarningsCalculatorUpdated,
    trackPricingCtaClicked,
} from '../../utils/analytics'
import { useTrackSectionView } from '../../hooks/useTrackSectionView'
import { useEmailCapture } from '../../contexts/EmailCaptureContext'

const BRAND_GRADIENT = 'linear-gradient(90deg, #C50017, #FF5514, #FFCA1E)'
/** Long enough that typing "150" does not flash the results for 1 and 15. */
const TYPING_COMMIT_MS = 400
/** A live region that follows a drag tick by tick is unusable with a screen reader. */
const ANNOUNCE_DELAY_MS = 800
/** How long the values must sit still before they are reported to analytics. */
const ANALYTICS_SETTLE_MS = 2000

type InputMethod = 'slider' | 'typed'
type CalculatorInput = 'price' | 'athletes' | 'tool_cost'

// ─── Inputs ──────────────────────────────────────────────────────────────────

/**
 * The typed half of an input. Holds the text while the coach is typing and
 * commits it once they pause, leave the field or press Enter.
 */
function useTypedDraft(maxDigits: number, commit: (text: string) => void) {
    // Non-null only while the coach is typing; otherwise the field shows the value.
    const [draft, setDraft] = useState<string | null>(null)
    const commitTimer = useRef<number | undefined>(undefined)

    useEffect(() => () => window.clearTimeout(commitTimer.current), [])

    function type(raw: string) {
        const text = sanitizeDigits(raw, maxDigits)
        setDraft(text)
        window.clearTimeout(commitTimer.current)
        commitTimer.current = window.setTimeout(() => commit(text), TYPING_COMMIT_MS)
    }

    function finish() {
        window.clearTimeout(commitTimer.current)
        if (draft !== null) commit(draft)
        setDraft(null)
    }

    function cancel() {
        window.clearTimeout(commitTimer.current)
        setDraft(null)
    }

    return { draft, type, finish, cancel }
}

interface NumberFieldProps {
    id: string
    /** Currency symbol shown inside the field, before the number. */
    prefix?: string
    text: string
    placeholder?: string
    onType: (raw: string) => void
    onFinish: () => void
}

function NumberField({ id, prefix, text, placeholder, onType, onFinish }: NumberFieldProps) {
    return (
        <div
            className="flex items-center gap-1.5 h-12 px-4 rounded-lg focus-within:ring-1 focus-within:ring-[#FF5514]"
            style={{ backgroundColor: '#1E1E1E', border: '1px solid #333' }}
        >
            {prefix && (
                <span aria-hidden="true" className="font-mono font-bold text-[22px] leading-none text-[#969EA7] whitespace-nowrap">
                    {prefix.trim()}
                </span>
            )}
            {/* text + inputMode rather than type="number": no spinners, digits only,
                and the numeric keypad on phones. 22px also keeps iOS from zooming in. */}
            <input
                id={id}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                enterKeyHint="done"
                autoComplete="off"
                value={text}
                placeholder={placeholder}
                onChange={(e) => onType(e.target.value)}
                onFocus={(e) => e.currentTarget.select()}
                onBlur={onFinish}
                onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
                className="w-full min-w-0 bg-transparent outline-none font-mono font-bold text-[22px] leading-none text-white placeholder-[#555] tabular-nums"
            />
        </div>
    )
}

const LABEL_CLASS = 'font-mono text-[11px] tracking-[1.5px] uppercase text-[#969EA7]'

interface CalculatorControlProps {
    label: string
    prefix?: string
    value: number
    range: SliderRange
    maxDigits: number
    /** The value as a screen reader should hear it on the slider, e.g. "€150". */
    valueText: string
    onChange: (value: number, method: InputMethod) => void
}

/** A typed value and a slider for the same number. */
function CalculatorControl({ label, prefix, value, range, maxDigits, valueText, onChange }: CalculatorControlProps) {
    const id = useId()
    // An empty or zero field falls back to the last valid value.
    const typed = useTypedDraft(maxDigits, (text) => {
        const parsed = parseWholeNumber(text)
        if (parsed !== null) onChange(parsed, 'typed')
    })

    // A typed value can sit outside the slider's range; the thumb rests at the nearest end.
    const sliderValue = clampToRange(value, range)
    const fill = (sliderValue - range.min) / (range.max - range.min)

    return (
        <div className="flex flex-col gap-2 min-w-0">
            <label id={`${id}-label`} htmlFor={`${id}-field`} className={LABEL_CLASS}>
                {label}
            </label>
            <NumberField
                id={`${id}-field`}
                prefix={prefix}
                text={typed.draft ?? String(value)}
                onType={typed.type}
                onFinish={typed.finish}
            />
            <input
                type="range"
                className="calc-range"
                min={range.min}
                max={range.max}
                step={range.step}
                value={sliderValue}
                onChange={(e) => {
                    typed.cancel()
                    onChange(Number(e.target.value), 'slider')
                }}
                aria-labelledby={`${id}-label`}
                aria-valuetext={valueText}
                style={{ '--pct': fill } as CSSProperties}
            />
        </div>
    )
}

interface OptionalAmountFieldProps {
    label: string
    optionalLabel: string
    prefix: string
    /** null while the field is empty. */
    value: number | null
    maxDigits: number
    onChange: (value: number | null) => void
}

/** A typed amount with no slider. Empty, or zero, means "not given". */
function OptionalAmountField({ label, optionalLabel, prefix, value, maxDigits, onChange }: OptionalAmountFieldProps) {
    const id = useId()
    const typed = useTypedDraft(maxDigits, (text) => onChange(parseWholeNumber(text)))

    return (
        <div className="flex flex-col gap-2 min-w-0">
            <label htmlFor={`${id}-field`} className={LABEL_CLASS}>
                {label} ({optionalLabel})
            </label>
            <NumberField
                id={`${id}-field`}
                prefix={prefix}
                text={typed.draft ?? (value === null ? '' : String(value))}
                placeholder="0"
                onType={typed.type}
                onFinish={typed.finish}
            />
        </div>
    )
}

// ─── One comparison bar ──────────────────────────────────────────────────────

interface ComparisonBarProps {
    label: string
    caption: string
    amount: string
    /** Signed difference to the other bar, shown in brackets after the amount. */
    difference?: string
    /** 0 to 1. */
    share: number
    background: string
}

/**
 * Renders four cells, not a box: label, amount, bar, caption. The parent grid
 * places them in rows shared by both bars, so the bars stay level even when one
 * amount wraps onto a second line.
 */
function ComparisonBar({ label, caption, amount, difference, share, background }: ComparisonBarProps) {
    return (
        <>
            <span className="min-w-0 font-mono text-[11px] tracking-[1.5px] uppercase text-white">{label}</span>
            {/* The bracket wraps under the amount when the column is narrow. */}
            <span className="min-w-0 flex flex-wrap content-start items-baseline gap-x-2 gap-y-1 font-mono font-bold text-[20px] sm:text-[28px] leading-none text-white tabular-nums">
                <span>{amount}</span>
                {difference && <span>({difference})</span>}
            </span>
            <div aria-hidden="true" className="min-w-0 h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                    className="h-full rounded-full transition-[width] duration-150 ease-out"
                    style={{ width: `${share * 100}%`, background }}
                />
            </div>
            <span className="min-w-0 font-satoshi font-medium text-[13px] leading-[150%] text-[#969EA7]">{caption}</span>
        </>
    )
}

// ─── Section ─────────────────────────────────────────────────────────────────

interface EarningsCalculatorProps {
    tier: PricingTier
    lang: string
}

export default function EarningsCalculator({ tier, lang }: EarningsCalculatorProps) {
    const { t } = useTranslation()
    const { openModal } = useEmailCapture()
    const headingId = useId()
    const contentRef = useTrackSectionView('earnings-calculator', 'pricing')
    const started = useRef(false)
    // Analytics for the entered values: which input changed last, how many
    // settled updates were sent, and the send that is still waiting to settle.
    const lastChange = useRef<{ input: CalculatorInput; method: InputMethod } | null>(null)
    const updateCount = useRef(0)
    const pendingUpdate = useRef<((beacon: boolean) => void) | null>(null)

    // null until the coach enters a value. An untouched field follows the tier,
    // which changes once the geo lookup resolves; an entered value is kept.
    const [priceOverride, setPriceOverride] = useState<number | null>(null)
    const [athletesOverride, setAthletesOverride] = useState<number | null>(null)
    // Optional: what the coach pays for their current tool. augo replaces it, so it counts as a saving.
    const [toolCost, setToolCost] = useState<number | null>(null)
    const [announcement, setAnnouncement] = useState('')

    const ranges = CALCULATOR_RANGES[tier.bucket]
    const price = priceOverride ?? ranges.price.initial
    const athletes = athletesOverride ?? ranges.athletes.initial
    const result = calculateEarnings({ athletes, price, proPrice: tier.proPrice, currentToolCost: toolCost ?? 0 })
    const shares = barShares(result)

    const money = (value: number) => formatMoney(value, tier.symbol, lang)
    const monthlyGain = formatMoney(result.monthlyGain, tier.symbol, lang, { signed: true })
    const athleteCount = (count: number) => t('pricing.calculator.athleteCount', { count })

    // With the optional field empty the caption still names the tool cost, as zero,
    // and points back up to the field: the figure is only net once it is filled in.
    const afterTool = t('pricing.calculator.todayAfterTool', {
        athletes: athleteCount(result.athletes),
        toolCost: money(toolCost ?? 0),
    })
    const withoutAugoCaption = toolCost === null ? `${afterTool} (${t('pricing.calculator.toolCostHint')})` : afterTool
    const withAugoCaption = `${athleteCount(result.athletesWithAugo)}, ${t('pricing.calculator.afterAugo', { augoCost: money(result.augoCost) })}`

    const touched = priceOverride !== null || athletesOverride !== null || toolCost !== null
    const summary = t('pricing.calculator.summary', {
        without: money(result.today),
        withAugo: money(result.withAugo),
        gain: monthlyGain,
    })

    useEffect(() => {
        if (!touched) return
        const timer = window.setTimeout(() => setAnnouncement(summary), ANNOUNCE_DELAY_MS)
        return () => window.clearTimeout(timer)
    }, [touched, summary])

    // Fade in on scroll, as the hero does.
    useEffect(() => {
        const el = contentRef.current
        if (!el) return
        // The build-time snapshot must not capture a hidden or half-faded card.
        if (window.__PRERENDER__) return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        gsap.set(el, { opacity: 0, y: window.innerWidth < 768 ? 15 : 20 })
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    observer.disconnect()
                    gsap.to(el, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' })
                }
            },
            { threshold: 0.15 }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [contentRef])

    // Report the values once they stop changing, not per slider tick. Untouched
    // defaults are never reported.
    useEffect(() => {
        const change = lastChange.current
        if (!change) return
        const send = (beacon: boolean) => {
            pendingUpdate.current = null
            updateCount.current += 1
            const settled = calculateEarnings({ athletes, price, proPrice: tier.proPrice, currentToolCost: toolCost ?? 0 })
            void trackEarningsCalculatorUpdated(
                {
                    ...earningsSnapshot(settled, { price, currency: tier.currency, toolCost }),
                    last_input: change.input,
                    last_method: change.method,
                    update_number: updateCount.current,
                },
                { beacon },
            )
        }
        pendingUpdate.current = send
        const timer = window.setTimeout(() => {
            // Already flushed by the page being hidden: do not send it twice.
            if (pendingUpdate.current === send) send(false)
        }, ANALYTICS_SETTLE_MS)
        return () => window.clearTimeout(timer)
    }, [athletes, price, toolCost, tier.proPrice, tier.currency])

    // A coach who changes a value and leaves straight away still gets counted.
    useEffect(() => {
        const flushWhenHidden = () => {
            if (document.visibilityState === 'hidden') pendingUpdate.current?.(true)
        }
        document.addEventListener('visibilitychange', flushWhenHidden)
        return () => {
            document.removeEventListener('visibilitychange', flushWhenHidden)
            pendingUpdate.current?.(false)
        }
    }, [])

    function markChanged(input: CalculatorInput, method: InputMethod) {
        lastChange.current = { input, method }
        if (started.current) return
        started.current = true
        void trackEarningsCalculatorStarted({ input, method })
    }

    function handleInput(input: 'price' | 'athletes', value: number, method: InputMethod) {
        if (input === 'price') setPriceOverride(value)
        else setAthletesOverride(value)
        markChanged(input, method)
    }

    return (
        <section aria-labelledby={headingId} className="relative z-10 w-full px-5 sm:px-8">
            <div ref={contentRef} className="max-w-[900px] mx-auto w-full flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                    <span className="font-mono text-[14px] tracking-[3px] uppercase text-[#969EA7]">
                        {t('pricing.calculator.tag')}
                    </span>
                    <h2
                        id={headingId}
                        className="font-mono font-bold text-[28px] sm:text-[36px] lg:text-[44px] leading-[120%] text-white"
                    >
                        {t('pricing.calculator.headline')}
                    </h2>
                    <p className="font-satoshi font-medium text-[16px] sm:text-[18px] leading-[160%] text-[#969EA7]">
                        {t('pricing.calculator.body')}
                    </p>
                </div>

                {/* Same quiet shell as the Enterprise card: the Pro card above keeps the only glow. */}
                <div
                    className="rounded-2xl p-[1px]"
                    style={{ background: 'linear-gradient(135deg, rgba(80,80,80,0.3), rgba(60,60,60,0.2), rgba(40,40,40,0.15))' }}
                >
                    <div
                        className="rounded-[15px] px-5 sm:px-8 py-6 sm:py-8 flex flex-col gap-6 sm:gap-8"
                        style={{ backgroundColor: '#151515' }}
                    >
                        {/* The sliders' own touch area already separates the rows, so the
                            row gap stays small. */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-8">
                            <CalculatorControl
                                label={t('pricing.calculator.priceLabel')}
                                prefix={tier.symbol}
                                value={price}
                                range={ranges.price}
                                maxDigits={PRICE_MAX_DIGITS}
                                valueText={money(price)}
                                onChange={(value, method) => handleInput('price', value, method)}
                            />
                            <CalculatorControl
                                label={t('pricing.calculator.athletesLabel')}
                                value={athletes}
                                range={ranges.athletes}
                                maxDigits={ATHLETES_MAX_DIGITS}
                                valueText={athleteCount(athletes)}
                                onChange={(value, method) => handleInput('athletes', value, method)}
                            />
                            <OptionalAmountField
                                label={t('pricing.calculator.toolCostLabel')}
                                optionalLabel={t('pricing.calculator.optional')}
                                prefix={tier.symbol}
                                value={toolCost}
                                maxDigits={PRICE_MAX_DIGITS}
                                onChange={(value) => {
                                    setToolCost(value)
                                    // Leaving the empty field empty is not an interaction.
                                    if (value !== null || toolCost !== null) markChanged('tool_cost', 'typed')
                                }}
                            />
                        </div>

                        {/* The whole result: net income without and with augo, side by side on
                            every width. Both bars are scaled to the larger amount and the columns
                            are equal, so the lengths still compare. */}
                        <div className="flex flex-col gap-4">
                            {/* Sized like the plan names on the cards above, so it reads as the
                                title of the result rather than one more field label. */}
                            <span className="font-mono font-bold text-[16px] sm:text-[20px] tracking-[2px] uppercase text-white">
                                {t('pricing.calculator.netIncomeHeading')}
                            </span>
                            {/* Column flow over four rows: each bar fills one column, and the
                                rows (label, amount, bar, caption) line up across the two. */}
                            <div className="grid grid-cols-2 grid-rows-[repeat(4,auto)] grid-flow-col gap-x-4 md:gap-x-8 gap-y-2">
                                <ComparisonBar
                                    label={t('pricing.calculator.withoutAugoLabel')}
                                    caption={withoutAugoCaption}
                                    amount={money(result.today)}
                                    share={shares.today}
                                    background="rgba(255,255,255,0.28)"
                                />
                                <ComparisonBar
                                    label={t('pricing.calculator.withAugoLabel')}
                                    caption={withAugoCaption}
                                    amount={money(result.withAugo)}
                                    difference={monthlyGain}
                                    share={shares.withAugo}
                                    background={BRAND_GRADIENT}
                                />
                            </div>
                            {/* Only reachable by typing below the slider range: the true figure
                                stays, with the point at which augo pays for itself. */}
                            {result.monthlyGain <= 0 && (
                                <p className="font-satoshi font-medium text-[13px] sm:text-[14px] leading-[150%] text-white">
                                    {result.minProfitablePrice === null
                                        ? t('pricing.calculator.breakEvenAthletes')
                                        : t('pricing.calculator.breakEvenPrice', {
                                            athletes: result.athletes,
                                            price: money(result.minProfitablePrice),
                                        })}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                type="button"
                                className="btn-gradient font-mono text-[12px] sm:text-[13px] font-extrabold tracking-[2px] uppercase text-white rounded-lg text-center h-12 flex items-center justify-center px-6 w-full sm:w-auto sm:self-start hover:brightness-110 transition-all duration-200 cursor-pointer"
                                onClick={() => {
                                    const label = t('pricing.pro.cta')
                                    void trackPricingCtaClicked({
                                        cta_text: label,
                                        plan: 'pro',
                                        placement: 'earnings_calculator',
                                        ...earningsSnapshot(result, { price, currency: tier.currency, toolCost }),
                                    })
                                    openModal(label, { placement: 'earnings_calculator' })
                                }}
                            >
                                {t('pricing.pro.cta')}
                            </button>
                            <p className="font-satoshi text-[12px] sm:text-[13px] leading-[150%] text-[#969EA7]">
                                {t('pricing.calculator.footnote', { proPrice: money(tier.proPrice) })}
                            </p>
                        </div>

                        <p className="sr-only" aria-live="polite">{announcement}</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
