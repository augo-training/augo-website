import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { gsap } from 'gsap'
import { Check, MessageCircle, ClipboardList, Bot, ListChecks, BarChart2 } from 'lucide-react'
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
import LaunchOfferPill from './LaunchOfferPill'
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
    const pricingTier = getPricingTier(countryCode ?? '')
    const { openModal } = useEmailCapture()

    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
    const isYearly = billingPeriod === 'yearly'
    const YEARLY_DISCOUNT = 0.85

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

    const featureColumns = t('pricing.featureColumns', { returnObjects: true }) as Array<{ title: string; items: string[] }>
    const featureColumnIcons = [MessageCircle, ClipboardList, Bot, ListChecks, BarChart2]
    const freeFeatures = t('pricing.free.features', { returnObjects: true }) as string[]
    const unlimitedFeatures = t('pricing.unlimited.features', { returnObjects: true }) as string[]

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
            pricing_amount: pricingTier.price,
            ...getUtmParams(),
        })
    }, [loading]) // eslint-disable-line react-hooks/exhaustive-deps

    function formatPrice(price: number): string {
        return price % 1 === 0 ? price.toString() : price.toFixed(2)
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
                    <LaunchOfferPill />
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

            {/* ─── 2. Pricing Cards ────────────────────────────────────────────── */}
            <section className="relative z-10 w-full pt-8 sm:pt-10 pb-16 sm:pb-20 px-5 sm:px-8">
                <div className="max-w-[900px] mx-auto w-full flex flex-col gap-4">
                    {/* Billing period toggle — aligned above unlimited (right) card */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div />
                        <div className="flex items-center justify-center gap-3">
                        <span className={`font-mono text-[13px] tracking-[1px] uppercase transition-colors duration-150 ${!isYearly ? 'text-white' : 'text-[#555]'}`}>
                            {t('pricing.monthly')}
                        </span>
                        <button
                            onClick={() => {
                                const newPeriod = isYearly ? 'monthly' : 'yearly'
                                setBillingPeriod(newPeriod)
                                trackBillingToggle({ billing_period: newPeriod })
                            }}
                            className={`relative w-12 h-6 rounded-full focus:outline-none flex-shrink-0 ${isYearly ? 'btn-gradient' : 'bg-[#333]'}`}
                            aria-label="Toggle billing period"
                        >
                            <span
                                className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
                                style={{ transform: isYearly ? 'translateX(24px)' : 'translateX(0)' }}
                            />
                        </button>
                        <span className={`flex items-center gap-2 font-mono text-[13px] tracking-[1px] uppercase transition-colors duration-150 ${isYearly ? 'text-white' : 'text-[#555]'}`}>
                            {t('pricing.annual')}
                            <span
                                className="btn-gradient font-mono text-[10px] tracking-[1px] px-1.5 py-0.5 rounded text-white"
                            >
                                {t('pricing.annualBadge')}
                            </span>
                        </span>
                        </div>
                    </div>
                    {/* Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        {/* Free Plan */}
                        <div
                            className="rounded-2xl p-[1px] order-2 md:order-1"
                            style={{ background: 'linear-gradient(135deg, rgba(80,80,80,0.3), rgba(60,60,60,0.2), rgba(40,40,40,0.15))' }}
                        >
                        <div
                            className="rounded-[15px] px-7 sm:px-8 pt-7 sm:pt-8 pb-7 sm:pb-8 flex flex-col gap-6 h-full"
                            style={{ backgroundColor: '#151515' }}
                        >
                            <div className="flex flex-col gap-1">
                                <span className="font-['JetBrains_Mono'] text-[20px] tracking-[2px] uppercase text-[#FFFFFF]">
                                    {t('pricing.free.label')}
                                </span>
                                <p className="font-satoshi font-medium text-[16px] sm:text-[18px] leading-[160%] text-[#FFFFFF]">
                                    {t('pricing.freeTierTagline')}
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 min-h-[88px] justify-center">
                                <div>
                                    <span className="font-mono font-bold text-[40px] sm:text-[48px] leading-none text-[#FFFFFF]">
                                        {pricingTier.symbol}0
                                    </span>
                                    <span className="font-mono text-[14px] text-[#969EA7] ml-1">
                                        {t('pricing.free.period')}
                                    </span>
                                </div>
                            </div>
                            <div className="h-px bg-[#2D2D2D]" />
                            <ul className="flex flex-col gap-3 flex-1 pt-7">
                                {freeFeatures.map((f, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                                            style={{ background: 'transparent', border: '1.5px solid #555' }}>
                                            <Check size={11} color="#666" strokeWidth={3} />
                                        </span>
                                        <span className="font-satoshi font-medium text-[14px] sm:text-[15px] leading-[160%] text-[#FFFFFF]">{f}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex flex-col gap-1.5">
                                <button
                                    className="font-mono text-[12px] sm:text-[13px] font-extrabold tracking-[2px] uppercase rounded-lg text-center h-12 flex items-center justify-center px-6 transition-all duration-200 text-[#EEE] hover:text-[#FFF] cursor-pointer"
                                    style={{ background: '#1E1E1E', border: '1px solid #333' }}
                                    onClick={() => {
                                        void trackPricingCtaClicked({ cta_text: t('pricing.free.cta'), billing_period: billingPeriod })
                                        openModal(t('pricing.free.cta'))
                                    }}
                                >
                                    {t('pricing.free.cta')}
                                </button>
                            </div>
                        </div>
                        </div>

                        {/* Paid Plan — dynamic by arm */}
                        <div className="join-form-wrapper relative rounded-2xl order-1 md:order-2">
                            <div className="join-form-glow absolute -inset-6 rounded-[2rem] pointer-events-none" />
                            <div className="join-form-border relative rounded-[20px] p-[2px]">
                                <div
                                    className="join-form-inner rounded-[18px] overflow-hidden flex flex-col gap-6 h-full"
                                    style={{ backgroundColor: '#0A0A0A' }}
                                >
                                    <div className="px-7 sm:px-8 pt-7 pb-7 sm:pb-8 flex flex-col gap-6 flex-1">
                                    <div className="flex flex-col gap-1">
                                        <span
                                            className="font-['JetBrains_Mono'] text-[20px] tracking-[2px] uppercase font-bold"
                                            style={{
                                                background: 'linear-gradient(83.9deg, #C50017 0%, #FF5514 55%, #FFCA1E 100%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text',
                                            }}
                                        >
                                            {t('pricing.unlimited.label')}
                                        </span>
                                        <p className="font-satoshi font-medium text-[16px] sm:text-[18px] leading-[160%] text-[#FFFFFF]">
                                            {t('pricing.flat.tagline')}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-2 min-h-[88px] justify-center">
                                        <div>
                                            <span className="font-mono font-bold text-[40px] sm:text-[48px] leading-none text-white">
                                                {pricingTier.symbol}{formatPrice(isYearly ? Math.round(pricingTier.price * YEARLY_DISCOUNT) : pricingTier.price)}
                                            </span>
                                            <span className="font-mono text-[14px] text-[#969EA7] ml-1">
                                                {t(isYearly ? 'pricing.flat.periodAnnual' : 'pricing.flat.period')}
                                            </span>
                                        </div>
                                    </div>
                                    <ul className="flex flex-col gap-3 flex-1">
                                        <li className="font-mono text-[12px] tracking-[1px] uppercase text-[#969EA7] mb-1">
                                            {t('pricing.unlimited.everythingIn')}
                                        </li>
                                        {unlimitedFeatures.map((f, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                                                    style={{ background: 'transparent', border: '1.5px solid #969EA7' }}>
                                                    <Check size={11} color="#969EA7" strokeWidth={3} />
                                                </span>
                                                <span className="font-satoshi font-medium text-[14px] sm:text-[15px] leading-[160%] text-[#FFFFFF]">{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="flex flex-col gap-1.5">
                                        <button
                                            className="btn-gradient font-mono text-[12px] sm:text-[13px] font-extrabold tracking-[2px] uppercase text-white rounded-lg text-center h-12 flex items-center justify-center px-6 hover:brightness-110 transition-all duration-200 cursor-pointer"
                                            onClick={() => {
                                                const label = t('pricing.flat.cta')
                                                void trackPricingCtaClicked({ cta_text: label, billing_period: billingPeriod })
                                                openModal(label)
                                            }}
                                        >
                                            {t('pricing.flat.cta')}
                                        </button>
                                    </div>
                                    </div>{/* end inner padding div */}
                                </div>
                            </div>
                        </div>
                    </div>{/* end cards grid */}
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
                                t('pricing.alwaysFreeNote'),
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

            {/* ─── 3. With augo, you can ───────────────────────────────────────── */}
            <section className="w-full pt-12 sm:pt-16 pb-4 px-5 sm:px-8">
                <div className="max-w-[900px] mx-auto w-full flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-[3px] h-5 rounded-full flex-shrink-0"
                            style={{ background: 'linear-gradient(180deg, #C50017, #FF5514, #FFCA1E)' }} />
                        <span className="font-satoshi font-bold text-[22px] sm:text-[26px] leading-[120%] text-white">
                            {t('pricing.featuresLabel')}
                        </span>
                    </div>
                    <div
                        className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4"
                    >
                        {featureColumns.map((col, i) => (
                            <div
                                key={i}
                                className="flex flex-col gap-4 rounded-xl overflow-hidden"
                                style={{ backgroundColor: '#151515' }}
                            >
                                <div className="flex flex-col gap-3 px-4 pt-4 pb-4">
                                    {(() => { const Icon = featureColumnIcons[i]; return <Icon size={28} color="white" strokeWidth={1.5} /> })()}
                                    <span className="font-mono font-bold text-[14px] tracking-[1.5px] uppercase text-white mt-2">
                                        {col.title}
                                    </span>
                                    <hr className="border-t border-[#333]" />
                                    <ul className="flex flex-col gap-3">
                                        {col.items.map((item, j) => (
                                            <li key={j}>
                                                <span className="font-satoshi text-[17px] leading-[150%] text-white">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── 4. Bubble Anchor ────────────────────────────────────────────── */}
            <section className="w-full pt-4 pb-8 sm:pb-12 px-5 sm:px-8">
                <div className="max-w-[900px] mx-auto w-full">
                    <div className="relative">
                        {/* Breathing glow behind the banner */}
                        <div className="bubble-glow absolute -inset-6 rounded-2xl pointer-events-none" />
                        {/* Animated rotating border */}
                        <div className="bubble-border relative block w-full p-[1px] rounded-2xl">
                            <div
                                className="rounded-[20px] w-full px-6 sm:px-10 py-4 sm:py-5 text-center"
                                style={{ backgroundColor: '#111111' }}
                            >
                                <p className="font-satoshi font-medium text-[16px] sm:text-[18px] leading-[150%] text-[#969EA7]">
                                    {t('pricing.bubbleText')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── 6. FAQ ──────────────────────────────────────────────────────── */}
            <PricingFaq />

            {/* ─── 7. Closing CTA ──────────────────────────────────────────────── */}
            <section className="w-full py-20 sm:py-28 px-5 sm:px-8 relative overflow-hidden">
                {/* Outer glow */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: 'radial-gradient(ellipse 80% 55% at 50% 70%, rgba(197,0,23,0.18) 0%, rgba(255,85,20,0.08) 45%, transparent 70%)',
                    }}
                />
                {/* Inner glow */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: 'radial-gradient(ellipse 40% 30% at 50% 50%, rgba(255,85,20,0.1) 0%, transparent 60%)',
                    }}
                />
                <div className="relative z-10 max-w-[600px] mx-auto w-full flex flex-col gap-6 items-center text-center">
                    <h2 className="font-mono font-bold text-[28px] sm:text-[40px] lg:text-[48px] leading-[120%] text-white">
                        {t('pricing.closingHeadline')}
                    </h2>
                    <p className="font-satoshi font-medium text-[16px] sm:text-[18px] leading-[160%] text-[#969EA7]">
                        {t('pricing.closingBody')}
                    </p>
                    <button
                        className="btn-gradient font-mono text-sm font-extrabold tracking-[2px] uppercase text-white rounded-lg hover:brightness-110 transition-all duration-200 flex items-center justify-center mt-2 cursor-pointer"
                        data-cta="pricing"
                        style={{ width: '220px', height: '48px' }}
                        onClick={() => {
                            void trackPricingCtaClicked({ cta_text: t('pricing.closingCta'), billing_period: billingPeriod })
                            openModal(t('pricing.closingCta'))
                        }}
                    >
                        {t('pricing.closingCta')}
                    </button>
                </div>
            </section>
        </div>
    )
}
