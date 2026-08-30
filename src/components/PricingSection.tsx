import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { gsap } from 'gsap'
import bgSection1 from '../assets/images/bg_section_1.webp'
import { useGeoCountry } from '../hooks/useGeoCountry'
import { getPricingTier } from '../config/pricingConfig'
import {
    getUtmParams,
    trackPricingPageViewed,
    trackPricingCtaClicked,
    trackBillingToggle,
    trackFaqExpanded,
} from '../utils/analytics'
import { useEmailCapture } from '../contexts/EmailCaptureContext'

// ─── FAQ Accordion ────────────────────────────────────────────────────────────

function PricingFaq() {
    const { t } = useTranslation()
    const faqItems = t('pricing.faqItems', { returnObjects: true }) as Array<{
        question: string
        answer: string
    }>

    const [openIndex, setOpenIndex] = useState<number | null>(null)
    const [isAnimating, setIsAnimating] = useState(false)

    const handleToggle = useCallback(
        (index: number) => {
            if (isAnimating) return
            if (openIndex === index) {
                setIsAnimating(true)
                setOpenIndex(null)
                setTimeout(() => setIsAnimating(false), 500)
            } else if (openIndex !== null) {
                setIsAnimating(true)
                setOpenIndex(null)
                setTimeout(() => {
                    setOpenIndex(index)
                    setTimeout(() => setIsAnimating(false), 500)
                }, 800)
                trackFaqExpanded({ question: faqItems[index].question, page: 'pricing' })
            } else {
                setIsAnimating(true)
                setOpenIndex(index)
                setTimeout(() => setIsAnimating(false), 500)
                trackFaqExpanded({ question: faqItems[index].question, page: 'pricing' })
            }
        },
        [openIndex, isAnimating, faqItems]
    )

    return (
        <section className="w-full py-16 sm:py-20 px-5 sm:px-8">
            <div className="max-w-[760px] mx-auto w-full flex flex-col gap-8">
                <h2 className="font-mono font-bold text-[28px] sm:text-[36px] leading-[120%] text-white text-center">
                    {t('pricing.faqTitle')}
                </h2>
                <div className="flex flex-col gap-[10px]">
                    {faqItems.map((faq, index) => {
                        const isOpen = openIndex === index
                        return (
                            <div
                                key={index}
                                className="rounded-lg transition-colors duration-150"
                                style={{ backgroundColor: '#151515' }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#1c1c1c'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#151515'
                                }}
                            >
                                <button
                                    onClick={() => handleToggle(index)}
                                    className="w-full flex items-center justify-between py-4 px-6 cursor-pointer text-left"
                                >
                                    <span className="font-satoshi font-medium text-[16px] leading-[130%] text-white">
                                        {faq.question}
                                    </span>
                                    <span
                                        className="flex-shrink-0 ml-4 text-white text-[24px] font-light leading-none transition-transform duration-300 ease-in-out select-none"
                                        style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                                    >
                                        +
                                    </span>
                                </button>
                                <div
                                    className="overflow-hidden transition-[max-height] duration-500 ease-in-out"
                                    style={{ maxHeight: isOpen ? '500px' : '0px' }}
                                >
                                    <div
                                        className="px-6 pb-4 font-satoshi font-normal text-[16px] leading-[160%] text-[#969EA7] transition-opacity duration-350 ease-in-out"
                                        style={{
                                            opacity: isOpen ? 1 : 0,
                                            transitionDelay: isOpen ? '150ms' : '0ms',
                                        }}
                                    >
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function PricingSection() {
    const { t } = useTranslation()
    const { lang } = useParams<{ lang: string }>()
    const { i18n: i18nObj } = useTranslation()
    const currentLang = lang || i18nObj.language || 'en'

    const { countryCode, loading } = useGeoCountry()
    const pricingTier = getPricingTier(countryCode ?? 'US')
    const { openModal } = useEmailCapture()

    // The only billing choice on the page: the Elite add-on. Plans are monthly-only.
    const [eliteBilling, setEliteBilling] = useState<'monthly' | 'yearly'>('monthly')
    const isEliteYearly = eliteBilling === 'yearly'
    const elitePrice = isEliteYearly ? pricingTier.eliteAnnual : pricingTier.eliteMonthly

    const localizedCountryName = useMemo(() => {
        if (!countryCode) return ''
        try {
            return new Intl.DisplayNames([currentLang], { type: 'region' }).of(countryCode.toUpperCase()) ?? countryCode
        } catch {
            return countryCode
        }
    }, [currentLang, countryCode])

    // Refs for hero fade-in
    const heroTagRef = useRef<HTMLDivElement>(null)
    const heroHeadlineRef = useRef<HTMLHeadingElement>(null)
    const heroBodyRef = useRef<HTMLParagraphElement>(null)

    // Refs for why-cards stagger

    const proFeatureGroups = t('pricing.pro.featureGroups', { returnObjects: true }) as Array<{ title: string; items: string[] }>
    const enterpriseFeatures = t('pricing.enterprise.features', { returnObjects: true }) as string[]

    // Hero fade-in on mount (IntersectionObserver + GSAP)
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const isMobile = window.innerWidth < 768
        const slideDistance = isMobile ? 15 : 20
        const ease = 'cubic-bezier(0.16, 1, 0.3, 1)'

        const elements = [heroTagRef.current, heroHeadlineRef.current, heroBodyRef.current]
        elements.forEach((el) => { if (el) gsap.set(el, { opacity: 0, y: slideDistance }) })

        if (prefersReducedMotion) {
            elements.forEach((el) => { if (el) gsap.set(el, { opacity: 1, y: 0 }) })
            return
        }

        const section = heroTagRef.current?.closest('section')
        if (!section) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    observer.disconnect()
                    if (heroTagRef.current) gsap.to(heroTagRef.current, { opacity: 1, y: 0, duration: 1.2, ease })
                    if (heroHeadlineRef.current) gsap.to(heroHeadlineRef.current, { opacity: 1, y: 0, duration: 1.6, delay: 0.1, ease })
                    if (heroBodyRef.current) gsap.to(heroBodyRef.current, { opacity: 1, y: 0, duration: 1.4, delay: 0.25, ease })

                }
            },
            { threshold: 0.15 }
        )
        observer.observe(section)
        return () => observer.disconnect()
    }, [])

    // Why-cards stagger on scroll

    // Fire page-view event once country resolves
    useEffect(() => {
        if (loading) return
        void trackPricingPageViewed({
            country: countryCode ?? 'unknown',
            pricing_bucket: pricingTier.bucket,
            pricing_currency: pricingTier.currency,
            pricing_amount: pricingTier.proPrice,
            pricing_list_amount: pricingTier.listPrice,
            ...getUtmParams(),
        })
    }, [loading]) // eslint-disable-line react-hooks/exhaustive-deps

    function formatPrice(price: number): string {
        // Grouped thousands: the Elite annual prepay is a four-digit figure, and the
        // separator is language-specific (€1,000 in en, €1.000 in de).
        const fractionDigits = price % 1 === 0 ? 0 : 2
        try {
            return new Intl.NumberFormat(currentLang, {
                minimumFractionDigits: fractionDigits,
                maximumFractionDigits: fractionDigits,
            }).format(price)
        } catch {
            return fractionDigits === 0 ? price.toString() : price.toFixed(2)
        }
    }

    return (
        <div
            className="relative"
            style={{ overflowX: 'hidden' }}
        >
            {/* ─── Hero + Pricing Cards wrapper (topo bg scoped here) ─────────── */}
            <div className="relative">
                {/* Topo background — spans hero + pricing tiers only */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: `url(${bgSection1})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />

            {/* ─── 1. Hero ─────────────────────────────────────────────────────── */}
            <section className="relative z-10 w-full pt-40 sm:pt-48 pb-8 sm:pb-10 px-5 sm:px-8">
                <div className="max-w-[900px] mx-auto w-full flex flex-col gap-6 items-start text-left">
                    <div
                        ref={heroTagRef}
                        className="font-mono text-[14px] tracking-[3px] uppercase text-[#969EA7]"
                    >
                        {t('pricing.tag')}
                    </div>
                    <h1
                        ref={heroHeadlineRef}
                        className="font-mono font-bold text-[32px] sm:text-[44px] lg:text-[52px] leading-[120%] text-white"
                    >
                        {t('pricing.heroHeadline')}
                    </h1>
                    <p
                        ref={heroBodyRef}
                        className="font-satoshi font-medium text-[16px] sm:text-[18px] leading-[160%] text-[#969EA7]"
                    >
                        {t('pricing.heroBody')}
                    </p>
                </div>
            </section>

            {/* ─── 2. Plans + Add-ons ──────────────────────────────────────────── */}
            <section className="relative z-10 w-full pt-8 sm:pt-10 pb-16 sm:pb-20 px-5 sm:px-8">
                <div className="max-w-[900px] mx-auto w-full flex flex-col gap-12">
                    {/* Plan cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-stretch">
                        {/* Pro — featured */}
                        <div className="join-form-wrapper relative rounded-2xl order-1">
                            <div className="join-form-glow absolute -inset-6 rounded-[2rem] pointer-events-none" />
                            <div className="join-form-border relative rounded-[20px] p-[2px] h-full">
                                <div
                                    className="join-form-inner rounded-[18px] overflow-hidden flex flex-col gap-6 h-full"
                                    style={{ backgroundColor: '#0A0A0A' }}
                                >
                                    <div className="px-7 sm:px-8 pt-7 pb-7 sm:pb-8 flex flex-col gap-6 flex-1">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-['JetBrains_Mono'] text-[20px] tracking-[2px] uppercase font-bold text-[#FFFFFF]">
                                                {t('pricing.pro.label')}
                                            </span>
                                            <p className="font-satoshi font-medium text-[16px] sm:text-[18px] leading-[160%] text-[#FFFFFF]">
                                                {t('pricing.pro.tagline')}
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-2 min-h-[88px] justify-center">
                                            {/* <s> rather than a line-through span: screen readers and
                                                crawlers get "former price" semantics for free. */}
                                            <s className="font-mono text-[14px] leading-none text-[#595959]">
                                                {pricingTier.symbol}{formatPrice(pricingTier.listPrice)}{t('pricing.pro.priceSuffix')}
                                            </s>
                                            <div>
                                                <span className="font-mono font-bold text-[40px] sm:text-[48px] leading-none text-white">
                                                    {pricingTier.symbol}{formatPrice(pricingTier.proPrice)}
                                                </span>
                                                <span className="font-mono text-[14px] text-[#969EA7] ml-1">
                                                    {t('pricing.pro.priceSuffix')}
                                                </span>
                                            </div>
                                        </div>
                                        {/* Grouped rather than one flat list: the categories do the
                                            chunking, so a coach can scan headings before bullets. */}
                                        {/* Multi-column, not a grid: the blocks have uneven heights
                                            (one line vs three) and a grid would align rows to the
                                            tallest and leave gaps. break-inside-avoid keeps each
                                            heading with its own text. */}
                                        <div className="flex-1 columns-1 sm:columns-2 gap-x-6">
                                            {proFeatureGroups.map((group, g) => (
                                                <div key={g} className="break-inside-avoid mb-5">
                                                    <span className="block font-mono text-[11px] tracking-[1.5px] uppercase text-[#969EA7] mb-1">
                                                        {group.title}
                                                    </span>
                                                    {/* Items flow as prose to save vertical space.
                                                        Inline <li> drops the list role in Safari, so
                                                        role="list" restores it; the separators are
                                                        decorative and stay unannounced. */}
                                                    <ul role="list" className="font-satoshi font-medium text-[14px] sm:text-[15px] leading-[160%] text-[#FFFFFF]">
                                                        {group.items.map((f, i) => (
                                                            <li key={i} className="inline">
                                                                {i > 0 && <span aria-hidden="true" className="text-[#595959]"> · </span>}
                                                                {f}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <button
                                                className="btn-gradient font-mono text-[12px] sm:text-[13px] font-extrabold tracking-[2px] uppercase text-white rounded-lg text-center h-12 flex items-center justify-center px-6 hover:brightness-110 transition-all duration-200 cursor-pointer"
                                                onClick={() => {
                                                    const label = t('pricing.pro.cta')
                                                    void trackPricingCtaClicked({ cta_text: label, plan: 'pro' })
                                                    openModal(label)
                                                }}
                                            >
                                                {t('pricing.pro.cta')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enterprise — quiet */}
                        <div
                            className="rounded-2xl p-[1px] order-2"
                            style={{ background: 'linear-gradient(135deg, rgba(80,80,80,0.3), rgba(60,60,60,0.2), rgba(40,40,40,0.15))' }}
                        >
                            <div
                                className="rounded-[15px] px-7 sm:px-8 pt-7 sm:pt-8 pb-7 sm:pb-8 flex flex-col gap-6 h-full"
                                style={{ backgroundColor: '#151515' }}
                            >
                                <div className="flex flex-col gap-1">
                                    <span className="font-['JetBrains_Mono'] text-[20px] tracking-[2px] uppercase text-[#FFFFFF]">
                                        {t('pricing.enterprise.label')}
                                    </span>
                                    <p className="font-satoshi font-medium text-[16px] sm:text-[18px] leading-[160%] text-[#FFFFFF]">
                                        {t('pricing.enterprise.tagline')}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 min-h-[88px] justify-center">
                                    <span className="font-mono text-[13px] tracking-[1px] text-[#969EA7]">
                                        {t('pricing.enterprise.planLabel')}
                                    </span>
                                    <span className="font-mono font-bold text-[40px] sm:text-[48px] leading-none text-white">
                                        {t('pricing.enterprise.price')}
                                    </span>
                                </div>
                                <ul className="flex flex-col gap-3 flex-1">
                                    <li className="font-mono text-[12px] tracking-[1px] uppercase text-[#969EA7] mb-1">
                                        {t('pricing.enterprise.everythingIn')}
                                    </li>
                                    {enterpriseFeatures.map((f, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <span className="flex-shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center font-mono text-[16px] leading-none text-[#969EA7]">
                                                +
                                            </span>
                                            <span className="font-satoshi font-medium text-[14px] sm:text-[15px] leading-[160%] text-[#FFFFFF]">{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex flex-col gap-1.5">
                                    <button
                                        className="font-mono text-[12px] sm:text-[13px] font-extrabold tracking-[2px] uppercase rounded-lg text-center h-12 flex items-center justify-center px-6 transition-all duration-200 bg-white text-[#0A0A0A] hover:bg-white/90 cursor-pointer"
                                        onClick={() => {
                                            const label = t('pricing.enterprise.cta')
                                            void trackPricingCtaClicked({ cta_text: label, plan: 'enterprise' })
                                            openModal(label)
                                        }}
                                    >
                                        {t('pricing.enterprise.cta')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>{/* end cards grid */}

                    {/* Add-ons */}
                    <div className="w-full flex flex-col gap-4">
                        {/* Section eyebrow, same idiom as the hero's "PRICING" */}
                        <span className="font-mono text-[14px] tracking-[3px] uppercase text-[#969EA7]">
                            {t('pricing.addOnsTitle')}
                        </span>
                        {/* Same shell as the Enterprise card, so the band reads as a peer of the
                            plans above rather than an unbordered slab beneath them. */}
                        <div
                            className="rounded-2xl p-[1px]"
                            style={{ background: 'linear-gradient(135deg, rgba(80,80,80,0.3), rgba(60,60,60,0.2), rgba(40,40,40,0.15))' }}
                        >
                        <div
                            className="rounded-[15px] px-7 sm:px-8 py-7 sm:py-8 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8"
                            style={{ backgroundColor: '#151515' }}
                        >
                            <div className="flex flex-col gap-1 flex-1 sm:max-w-[520px]">
                                <span className="font-['JetBrains_Mono'] text-[20px] tracking-[2px] uppercase text-white">
                                    {t('pricing.elite.label')}
                                </span>
                                <p className="font-satoshi font-bold text-[15px] sm:text-[16px] leading-[150%] text-white">
                                    {t('pricing.elite.tagline')}
                                </p>
                                <p className="font-satoshi font-medium text-[13px] sm:text-[14px] leading-[150%] text-[#969EA7]">
                                    {t('pricing.elite.description')}
                                </p>
                            </div>
                            <div className="flex flex-col items-start sm:items-end gap-3 flex-shrink-0">
                                <div
                                    className="inline-flex rounded-lg p-0.5"
                                    style={{ backgroundColor: '#1E1E1E', border: '1px solid #333' }}
                                >
                                    {(['monthly', 'yearly'] as const).map((period) => {
                                        const isActive = eliteBilling === period
                                        return (
                                            <button
                                                key={period}
                                                type="button"
                                                aria-pressed={isActive}
                                                onClick={() => {
                                                    setEliteBilling(period)
                                                    trackBillingToggle({ billing_period: period, plan: 'elite' })
                                                }}
                                                className={`font-mono text-[11px] font-bold tracking-[1px] uppercase px-3 py-1.5 rounded-md transition-colors duration-150 cursor-pointer ${
                                                    isActive ? 'bg-white text-[#0A0A0A]' : 'bg-transparent text-[#969EA7] hover:text-white'
                                                }`}
                                            >
                                                {t(period === 'monthly' ? 'pricing.monthly' : 'pricing.annual')}
                                            </button>
                                        )
                                    })}
                                </div>
                                <div className="flex flex-col items-start sm:items-end gap-1">
                                    <div>
                                        <span className="font-mono font-bold text-[28px] sm:text-[32px] leading-none text-white">
                                            +{pricingTier.symbol}{formatPrice(elitePrice)}
                                        </span>
                                        {/* The yearly figure is a prepaid annual total, not a
                                            monthly rate, so the period label switches with it. */}
                                        <span className="font-mono text-[13px] text-[#969EA7] ml-1">
                                            {t(isEliteYearly ? 'pricing.elite.annualSuffix' : 'pricing.elite.priceSuffix')}
                                        </span>
                                    </div>
                                    {isEliteYearly && (
                                        <span className="font-satoshi font-medium text-[12px] leading-none text-[#969EA7]">
                                            {t('pricing.elite.annualNote')}
                                        </span>
                                    )}
                                </div>
                                {/* Quiet secondary: Elite is the smallest of the three commitments,
                                    so it should not match Pro's gradient or Enterprise's white. */}
                                <button
                                    className="w-full sm:w-auto font-mono text-[12px] font-extrabold tracking-[2px] uppercase rounded-lg text-center h-11 flex items-center justify-center px-6 transition-all duration-200 text-[#EEE] hover:text-[#FFF] cursor-pointer"
                                    style={{ background: '#1E1E1E', border: '1px solid #333' }}
                                    onClick={() => {
                                        const label = t('pricing.elite.cta')
                                        void trackPricingCtaClicked({ cta_text: label, plan: 'elite' })
                                        openModal(label)
                                    }}
                                >
                                    {t('pricing.elite.cta')}
                                </button>
                            </div>
                        </div>
                        </div>
                    </div>{/* end add-ons */}
                </div>{/* end max-w container */}
            </section>
            </div>{/* end topo bg wrapper */}

            {/* ─── Supplementary pricing content ──────────────────────────────── */}
            <section className="relative z-10 w-full pt-16 sm:pt-20 pb-16 sm:pb-20 px-5 sm:px-8">
                <div className="max-w-[900px] mx-auto w-full flex flex-col gap-10 items-center">
                    {/* Simple pricing headline + trust row */}
                    <div className="w-full flex flex-col gap-5">
                        <h2 className="font-mono font-bold text-[32px] sm:text-[44px] lg:text-[52px] leading-[120%] text-white">
                            {t('pricing.pricingHeadline')}
                        </h2>
                        {/* Trust statements */}
                        <div className="flex flex-col gap-3">
                            {[
                                t('pricing.trustLine1'),
                                t('pricing.trustLine2'),
                                t('pricing.trustQuote'),
                                t('pricing.perAthleteNote'),
                            ].map((line, i) => (
                                <div key={i} className="group flex items-start gap-2 cursor-default">
                                    <span className="font-satoshi font-black italic text-[14px] leading-[150%] tracking-[4px] text-[#969EA7] group-hover:text-white flex-shrink-0 transition-all duration-200 ease-out">///////</span>
                                    <span className="font-satoshi font-medium text-[16px] sm:text-[18px] leading-[160%] text-[#969EA7] group-hover:text-white group-hover:font-bold group-hover:italic transition-all duration-200 ease-out">{line}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Location note */}
                    {!loading && countryCode && (
                        <p className="font-satoshi text-[12px] sm:text-[13px] leading-[150%] text-[#969EA7]">
                            <Trans
                                i18nKey="pricing.locationNote"
                                values={{ countryName: localizedCountryName }}
                                components={{
                                    1: (
                                        <a
                                            href={`/${currentLang}#contact`}
                                            className="underline hover:text-white transition-colors duration-150"
                                        />
                                    ),
                                }}
                            />
                        </p>
                    )}
                </div>
            </section>

            {/* ─── 6. FAQ ──────────────────────────────────────────────────────── */}
            <PricingFaq />
        </div>
    )
}
