import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import { QRCodeSVG } from 'qrcode.react'
import bgImage from '../assets/images/bg_section_1.webp'

// const WEBAPP_URL = 'https://webapp.augotraining.com'
const IOS_URL = 'https://apps.apple.com/ph/app/augo-training/id6754562173'
const ANDROID_URL = 'https://play.google.com/store/apps/details?id=com.augotraining'

export default function DownloadSection() {
    const { t } = useTranslation()
    const [currentUrl] = useState(() => window.location.href)
    const headlineRef = useRef<HTMLHeadingElement>(null)
    const bodyRef = useRef<HTMLParagraphElement>(null)
    const buttonsRef = useRef<HTMLDivElement>(null)
    const bgOverlayRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const ua = navigator.userAgent
        if (/android/i.test(ua)) {
            window.location.replace(ANDROID_URL)
            return
        }
        if (/iphone|ipad|ipod/i.test(ua)) {
            window.location.replace(IOS_URL)
            return
        }
    }, [])

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
                    {t('download.headline')}
                </h1>
                <p
                    ref={bodyRef}
                    className="font-satoshi font-medium text-[16px] sm:text-[18px] leading-[150%] text-[#969EA7] max-w-[480px]"
                >
                    {t('download.body')}
                </p>

                <div ref={buttonsRef} className="flex flex-col items-center gap-6 mt-2 w-full">
                    {/*
                    <a
                        href={WEBAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-gradient font-mono text-sm font-extrabold tracking-[2px] uppercase text-white px-10 py-4 rounded-lg hover:brightness-110 transition-all duration-200"
                    >
                        {t('download.launchWebApp')}
                    </a>
                    */}
                    <div className="flex flex-row items-center justify-center gap-4">
                        <a
                            href={IOS_URL}
                            aria-label={t('download.downloadOnAppStore')}
                            className="transition-opacity hover:opacity-80"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&releaseDate=1734307200"
                                alt={t('download.downloadOnAppStore')}
                                className="p-[2px] sm:p-[10px]"
                                style={{ width: 220, height: 73, objectFit: 'contain' }}
                            />
                        </a>
                        <a
                            href={ANDROID_URL}
                            aria-label={t('download.getItOnGooglePlay')}
                            className="transition-opacity hover:opacity-80"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                                alt={t('download.getItOnGooglePlay')}
                                style={{ width: 270, height: 73, objectFit: 'contain' }}
                            />
                        </a>
                    </div>
                </div>

                <div className="hidden md:flex flex-col items-center gap-3 mt-2">
                    <div className="p-3 bg-white rounded-xl">
                        <QRCodeSVG value={currentUrl} size={240} />
                    </div>
                    <p className="font-satoshi text-[13px] text-[#969EA7]">Scan to download</p>
                </div>
            </div>
        </section>
    )
}
