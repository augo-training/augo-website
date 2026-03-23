import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { gsap } from 'gsap'
import { Check } from 'lucide-react'

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
            } else {
                setIsAnimating(true)
                setOpenIndex(index)
                setTimeout(() => setIsAnimating(false), 500)
            }
        },
        [openIndex, isAnimating]
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

    const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')

    // Refs for hero fade-in
    const heroTagRef = useRef<HTMLDivElement>(null)
    const heroHeadlineRef = useRef<HTMLHeadingElement>(null)
    const heroBodyRef = useRef<HTMLParagraphElement>(null)
    const heroFeaturesRef = useRef<HTMLUListElement>(null)

    // Refs for why-cards stagger
    const whyCardsRef = useRef<(HTMLDivElement | null)[]>([])

    const features = t('pricing.features', { returnObjects: true }) as string[]
    const freeFeatures = t('pricing.free.features', { returnObjects: true }) as string[]
    const unlimitedFeatures = t('pricing.unlimited.features', { returnObjects: true }) as string[]
    const whyCards = t('pricing.whyCards', { returnObjects: true }) as Array<{ title: string; body: string }>

    // Hero fade-in on mount (IntersectionObserver + GSAP)
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const isMobile = window.innerWidth < 768
        const slideDistance = isMobile ? 15 : 20
        const ease = 'cubic-bezier(0.16, 1, 0.3, 1)'

        const elements = [heroTagRef.current, heroHeadlineRef.current, heroBodyRef.current, heroFeaturesRef.current]
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
                    if (heroFeaturesRef.current) gsap.to(heroFeaturesRef.current, { opacity: 1, y: 0, duration: 1.2, delay: 0.4, ease })
                }
            },
            { threshold: 0.15 }
        )
        observer.observe(section)
        return () => observer.disconnect()
    }, [])

    // Why-cards stagger on scroll
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const ease = 'cubic-bezier(0.16, 1, 0.3, 1)'

        const cards = whyCardsRef.current.filter(Boolean) as HTMLElement[]
        cards.forEach((c) => gsap.set(c, { opacity: 0, y: 20 }))

        if (prefersReducedMotion) {
            cards.forEach((c) => gsap.set(c, { opacity: 1, y: 0 }))
            return
        }

        const container = cards[0]?.parentElement
        if (!container) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    observer.disconnect()
                    cards.forEach((card, i) => {
                        gsap.to(card, { opacity: 1, y: 0, duration: 0.8, delay: i * 0.12, ease })
                    })
                }
            },
            { threshold: 0.1 }
        )
        observer.observe(container)
        return () => observer.disconnect()
    }, [])

    return (
        <>
            {/* ─── 1. Hero ─────────────────────────────────────────────────────── */}
            <section className="w-full pt-28 sm:pt-36 pb-16 sm:pb-20 px-5 sm:px-8">
                <div className="max-w-[760px] mx-auto w-full flex flex-col gap-6 items-center text-center">
                    <div
                        ref={heroTagRef}
                        className="font-mono text-[11px] tracking-[3px] uppercase text-[#969EA7]"
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
                        className="font-satoshi font-medium text-[16px] sm:text-[18px] leading-[160%] text-[#969EA7] max-w-[540px]"
                    >
                        {t('pricing.heroBody')}
                    </p>
                    <ul ref={heroFeaturesRef} className="flex flex-col gap-3 mt-2 w-full max-w-[480px] text-left">
                        {features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg, #C50017, #FF5514, #FFCA1E)' }}>
                                    <Check size={11} color="#fff" strokeWidth={3} />
                                </span>
                                <span className="font-satoshi text-[15px] leading-[150%] text-[#969EA7]">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ─── 2. Pricing Cards ────────────────────────────────────────────── */}
            <section className="w-full py-16 sm:py-20 px-5 sm:px-8">
                <div className="max-w-[900px] mx-auto w-full flex flex-col gap-10 items-center">
                    {/* Above-card copy */}
                    <div className="flex flex-col gap-4 items-center text-center">
                        <h2 className="font-mono font-bold text-[24px] sm:text-[32px] leading-[120%] text-white max-w-[600px]">
                            {t('pricing.pricingHeadline')}
                        </h2>
                        <p className="font-satoshi text-[14px] sm:text-[15px] leading-[150%] text-[#969EA7]">
                            {t('pricing.trustLine1')}
                        </p>
                        <p className="font-satoshi text-[14px] sm:text-[15px] leading-[150%] text-[#969EA7]">
                            {t('pricing.trustLine2')}
                        </p>
                        <p className="font-satoshi text-[13px] sm:text-[14px] leading-[150%] text-[#969EA7] italic max-w-[480px]">
                            "{t('pricing.trustQuote')}"
                        </p>
                    </div>

                    {/* Toggle */}
                    <div className="flex items-center gap-1 p-1 rounded-full border border-[#2D2D2D] bg-[#0f0f0f]">
                        <button
                            onClick={() => setBilling('monthly')}
                            className={`font-mono text-[12px] tracking-[1.5px] uppercase px-5 py-2 rounded-full transition-all duration-200 cursor-pointer ${
                                billing === 'monthly'
                                    ? 'bg-[#222] text-white font-bold'
                                    : 'text-[#969EA7] hover:text-white'
                            }`}
                        >
                            {t('pricing.monthly')}
                        </button>
                        <button
                            onClick={() => setBilling('annual')}
                            className={`font-mono text-[12px] tracking-[1.5px] uppercase px-5 py-2 rounded-full transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                                billing === 'annual'
                                    ? 'bg-[#222] text-white font-bold'
                                    : 'text-[#969EA7] hover:text-white'
                            }`}
                        >
                            {t('pricing.annual')}
                            <span
                                className="font-mono text-[10px] tracking-[1px] px-1.5 py-0.5 rounded-sm font-bold"
                                style={{
                                    background: 'linear-gradient(83.9deg, #C50017 0%, #FF5514 55%, #FFCA1E 100%)',
                                    color: '#fff',
                                }}
                            >
                                {t('pricing.annualBadge')}
                            </span>
                        </button>
                    </div>

                    {/* Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        {/* Free Plan */}
                        <div
                            className="rounded-2xl border border-[#2D2D2D] p-7 sm:p-8 flex flex-col gap-6"
                            style={{ backgroundColor: '#151515' }}
                        >
                            <div className="flex flex-col gap-1">
                                <span className="font-mono text-[11px] tracking-[2px] uppercase text-[#969EA7]">
                                    {t('pricing.free.label')}
                                </span>
                                <p className="font-satoshi text-[14px] text-[#969EA7]">
                                    {t('pricing.free.tagline')}
                                </p>
                            </div>
                            <div>
                                <span className="font-mono font-bold text-[40px] sm:text-[48px] leading-none text-white">
                                    {t('pricing.free.price')}
                                </span>
                                <span className="font-mono text-[14px] text-[#969EA7] ml-1">
                                    {t('pricing.free.period')}
                                </span>
                            </div>
                            <div className="h-px bg-[#2D2D2D]" />
                            <ul className="flex flex-col gap-3 flex-1">
                                {freeFeatures.map((f, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                                            style={{ background: 'linear-gradient(135deg, #C50017, #FF5514, #FFCA1E)' }}>
                                            <Check size={11} color="#fff" strokeWidth={3} />
                                        </span>
                                        <span className="font-satoshi text-[15px] leading-[150%] text-[#969EA7]">{f}</span>
                                    </li>
                                ))}
                            </ul>
                            <a
                                href={`/${currentLang}/join`}
                                className="btn-gradient font-mono text-[12px] sm:text-[13px] font-extrabold tracking-[2px] uppercase text-white rounded-lg text-center py-3.5 px-6 hover:brightness-110 transition-all duration-200"
                            >
                                {t('pricing.free.cta')}
                            </a>
                        </div>

                        {/* Unlimited Plan */}
                        <div className="join-form-wrapper relative rounded-2xl">
                            <div className="join-form-glow absolute -inset-6 rounded-[2rem] pointer-events-none" />
                            <div className="join-form-border relative rounded-[20px] p-[2px]">
                                <div
                                    className="join-form-inner rounded-[18px] p-7 sm:p-8 flex flex-col gap-6"
                                    style={{ backgroundColor: '#0A0A0A' }}
                                >
                                    <div className="flex flex-col gap-1">
                                        <span
                                            className="font-mono text-[11px] tracking-[2px] uppercase font-bold"
                                            style={{
                                                background: 'linear-gradient(83.9deg, #C50017 0%, #FF5514 55%, #FFCA1E 100%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text',
                                            }}
                                        >
                                            {t('pricing.unlimited.label')}
                                        </span>
                                        <p className="font-satoshi text-[14px] text-[#969EA7]">
                                            {t('pricing.unlimited.tagline')}
                                        </p>
                                    </div>
                                    <div className="relative h-[60px]">
                                        <div
                                            className="absolute inset-0 flex items-end transition-opacity duration-300"
                                            style={{ opacity: billing === 'monthly' ? 1 : 0, pointerEvents: billing === 'monthly' ? 'auto' : 'none' }}
                                        >
                                            <span className="font-mono font-bold text-[40px] sm:text-[48px] leading-none text-white">
                                                {t('pricing.unlimited.priceMonthly')}
                                            </span>
                                            <span className="font-mono text-[14px] text-[#969EA7] ml-1 mb-1">
                                                {t('pricing.unlimited.periodMonthly')}
                                            </span>
                                        </div>
                                        <div
                                            className="absolute inset-0 flex items-end transition-opacity duration-300"
                                            style={{ opacity: billing === 'annual' ? 1 : 0, pointerEvents: billing === 'annual' ? 'auto' : 'none' }}
                                        >
                                            <span className="font-mono font-bold text-[40px] sm:text-[48px] leading-none text-white">
                                                {t('pricing.unlimited.priceAnnual')}
                                            </span>
                                            <span className="font-mono text-[14px] text-[#969EA7] ml-1 mb-1">
                                                {t('pricing.unlimited.periodAnnual')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-px bg-[#2D2D2D]" />
                                    <ul className="flex flex-col gap-3 flex-1">
                                        <li className="font-mono text-[12px] tracking-[1px] uppercase text-[#969EA7] mb-1">
                                            {t('pricing.unlimited.everythingIn')}
                                        </li>
                                        {unlimitedFeatures.map((f, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                                                    style={{ background: 'linear-gradient(135deg, #C50017, #FF5514, #FFCA1E)' }}>
                                                    <Check size={11} color="#fff" strokeWidth={3} />
                                                </span>
                                                <span className="font-satoshi text-[15px] leading-[150%] text-[#969EA7]">{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <a
                                        href={`/${currentLang}/join`}
                                        className="btn-gradient font-mono text-[12px] sm:text-[13px] font-extrabold tracking-[2px] uppercase text-white rounded-lg text-center py-3.5 px-6 hover:brightness-110 transition-all duration-200"
                                    >
                                        {t('pricing.unlimited.cta')}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── 3. Bubble Anchor ────────────────────────────────────────────── */}
            <section className="w-full py-8 sm:py-12 px-5 sm:px-8">
                <div className="max-w-[900px] mx-auto w-full flex justify-center">
                    <div className="inline-block border border-[#2D2D2D] rounded-full px-6 sm:px-10 py-3 sm:py-4 text-center">
                        <p className="font-satoshi text-[14px] sm:text-[16px] leading-[150%] text-[#969EA7]">
                            {t('pricing.bubbleText')}
                        </p>
                    </div>
                </div>
            </section>

            {/* ─── 4. Why Coaches Choose augo ──────────────────────────────────── */}
            <section className="w-full py-16 sm:py-20 px-5 sm:px-8">
                <div className="max-w-[900px] mx-auto w-full flex flex-col gap-10">
                    <h2 className="font-mono font-bold text-[28px] sm:text-[36px] leading-[120%] text-white text-center">
                        {t('pricing.whyHeadline')}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {whyCards.map((card, i) => (
                            <div
                                key={i}
                                ref={(el) => { whyCardsRef.current[i] = el }}
                                className="rounded-xl border border-[#1A1A1A] p-6 sm:p-7 flex flex-col gap-3 transition-colors duration-150"
                                style={{ backgroundColor: '#151515' }}
                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1c1c1c' }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#151515' }}
                            >
                                <h3 className="font-mono font-bold text-[16px] sm:text-[17px] leading-[130%] text-white">
                                    {card.title}
                                </h3>
                                <p className="font-satoshi text-[15px] leading-[160%] text-[#969EA7]">
                                    {card.body}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── 5. FAQ ──────────────────────────────────────────────────────── */}
            <PricingFaq />

            {/* ─── 6. Closing CTA ──────────────────────────────────────────────── */}
            <section className="w-full py-20 sm:py-28 px-5 sm:px-8 relative overflow-hidden">
                {/* Subtle blob */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(197,0,23,0.07) 0%, transparent 70%)',
                    }}
                />
                <div className="relative z-10 max-w-[600px] mx-auto w-full flex flex-col gap-6 items-center text-center">
                    <h2 className="font-mono font-bold text-[28px] sm:text-[40px] lg:text-[48px] leading-[120%] text-white">
                        {t('pricing.closingHeadline')}
                    </h2>
                    <p className="font-satoshi font-medium text-[16px] sm:text-[18px] leading-[160%] text-[#969EA7]">
                        {t('pricing.closingBody')}
                    </p>
                    <a
                        href={`/${currentLang}/join`}
                        className="btn-gradient font-mono text-sm font-extrabold tracking-[2px] uppercase text-white rounded-lg hover:brightness-110 transition-all duration-200 flex items-center justify-center mt-2"
                        data-cta="pricing"
                        style={{ width: '220px', height: '48px' }}
                    >
                        {t('pricing.closingCta')}
                    </a>
                </div>
            </section>
        </>
    )
}
