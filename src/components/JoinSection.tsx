import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import bgImage from '../assets/images/bg_section_1.webp'

const IOS_URL = 'https://apps.apple.com/ph/app/augo-training/id6754562173'
const ANDROID_URL = 'https://play.google.com/store/apps/details?id=com.augotraining'

export default function JoinSection() {
    const { t } = useTranslation()
    const headlineRef = useRef<HTMLHeadingElement>(null)
    const bodyRef = useRef<HTMLParagraphElement>(null)
    const buttonsRef = useRef<HTMLDivElement>(null)
    const bgOverlayRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const isMobile = window.innerWidth < 768
        const slideDistance = isMobile ? 15 : 20

        if (headlineRef.current) gsap.set(headlineRef.current, { opacity: 0, y: slideDistance })
        if (bodyRef.current) gsap.set(bodyRef.current, { opacity: 0 })
        if (buttonsRef.current) gsap.set(buttonsRef.current, { opacity: 0, y: slideDistance })
        if (bgOverlayRef.current) gsap.set(bgOverlayRef.current, { opacity: 0 })

        if (prefersReducedMotion) {
            if (headlineRef.current) gsap.set(headlineRef.current, { opacity: 1, y: 0 })
            if (bodyRef.current) gsap.set(bodyRef.current, { opacity: 1 })
            if (buttonsRef.current) gsap.set(buttonsRef.current, { opacity: 1, y: 0 })
            if (bgOverlayRef.current) gsap.set(bgOverlayRef.current, { opacity: 0.3 })
            return
        }

        const ease = 'cubic-bezier(0.16, 1, 0.3, 1)'
        if (bgOverlayRef.current) gsap.to(bgOverlayRef.current, { opacity: 0.3, duration: 1.2, ease: 'power2.out' })
        if (headlineRef.current) gsap.to(headlineRef.current, { opacity: 1, y: 0, duration: 1.6, ease })
        if (bodyRef.current) gsap.to(bodyRef.current, { opacity: 1, duration: 1, delay: 0.3, ease })
        if (buttonsRef.current) gsap.to(buttonsRef.current, { opacity: 1, y: 0, duration: 0.8, delay: 0.4, ease })
    }, [])

    return (
        <section
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
            style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <div ref={bgOverlayRef} className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(0,0,0,0.3)' }} />

            <div className="relative z-10 w-full max-w-[600px] mx-auto px-5 sm:px-8 py-20 sm:py-32 flex flex-col items-center text-center gap-8">
                <h1
                    ref={headlineRef}
                    className="font-mono font-bold text-[32px] sm:text-[44px] lg:text-[48px] leading-[130%] text-white"
                >
                    {t('join.headline')}
                </h1>
                <p
                    ref={bodyRef}
                    className="font-satoshi font-medium text-[16px] sm:text-[18px] leading-[150%] text-[#969EA7] max-w-[480px]"
                >
                    {t('join.body')}
                </p>

                <div ref={buttonsRef} className="flex flex-row items-center justify-center gap-4 mt-2">
                    <a
                        href={IOS_URL}
                        aria-label={t('join.downloadOnAppStore')}
                        className="transition-opacity hover:opacity-80"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {/* Apple badge has built-in padding — add box to match Google's visual height */}
                        <img
                            src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&releaseDate=1734307200"
                            alt={t('join.downloadOnAppStore')}
                            className="p-[2px] sm:p-[10px]"
                            style={{ width: 220, height: 73, objectFit: 'contain' }}
                        />
                    </a>
                    <a
                        href={ANDROID_URL}
                        aria-label={t('join.getItOnGooglePlay')}
                        className="transition-opacity hover:opacity-80"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                            alt={t('join.getItOnGooglePlay')}
                            style={{ width: 270, height: 73, objectFit: 'contain' }}
                        />
                    </a>
                </div>
            </div>
        </section>
    )
}
