import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import { QRCodeSVG } from 'qrcode.react'
import bgImage from '../assets/images/bg_section_1.webp'
import { trackDownloadPageViewed, trackAppStoreClicked } from '../utils/analytics'

const WEBAPP_URL = 'https://webapp.augotraining.com'
const IOS_URL = 'https://apps.apple.com/ph/app/augo-training/id6754562173'
const ANDROID_URL = 'https://play.google.com/store/apps/details?id=com.augotraining'

/**
 * Measured from the assets: the Google Play PNG is 646x250 with its button occupying
 * only 564x168 — it bakes in 41px of clear space on every side. Apple's SVG button
 * fills its 119.66x40 viewBox and has none. Sized naively the two never agree: equal
 * heights make Apple's button look bigger, equal left edges push Google's ~11px right.
 *
 * Fixed sizes also could not sit side by side — at their matched sizes the pair needs
 * ~330px, and the narrowest card (a 360px phone, or the md breakpoint where the cards
 * first split into two columns) offers only ~260px, so they wrapped.
 *
 * So the row is sized proportionally instead. These percentages are solved so the two
 * *visible* buttons come out the same height at any container width, and so the pair
 * always fits on one line:
 *
 *   apple box 45.5% + gap 3% + play box 51% = 99.5%
 *   apple padding 2.9% reproduces Google's baked-in clear space
 *
 * That holds the buttons within 0.1% of each other, from ~34px on a 360px phone to
 * ~45px where MAX_ROW caps the row.
 */
const APPLE_BASIS = 'basis-[45.5%]'
const APPLE_PAD = 'p-[2.9%]'
const PLAY_BASIS = 'basis-[51%]'

/** Same shell as the Enterprise card on the pricing page. */
const CARD_BORDER = 'linear-gradient(135deg, rgba(80,80,80,0.3), rgba(60,60,60,0.2), rgba(40,40,40,0.15))'

/**
 * Store badges plus the desktop QR handoff. Both cards carry their own copy so each
 * audience can act without reading across to the other column.
 */
function AppLinks({ qrValue }: { qrValue: string }) {
    const { t } = useTranslation()

    return (
        // mt-auto pins this to the card's bottom edge: the coaches card has a button
        // the athletes card lacks, and without it the two groups sit at different heights.
        <div className="mt-auto flex flex-col gap-3">
            <span className="font-mono text-[12px] tracking-[2px] uppercase text-[#969EA7]">
                {t('download.getTheApp')}
            </span>
            {/* Native badge sizes do not fit side by side in a half-width card, so they wrap. */}
            {/* No flex-wrap: the two stay side by side at every width so their sizes
                stay directly comparable. */}
            <div className="flex items-center gap-[3%] w-full max-w-[340px]">
                <a
                    href={IOS_URL}
                    aria-label={t('download.downloadOnAppStore')}
                    className={`${APPLE_BASIS} ${APPLE_PAD} transition-opacity hover:opacity-80`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackAppStoreClicked({ store: 'app_store' })}
                >
                    <img
                        src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&releaseDate=1734307200"
                        alt={t('download.downloadOnAppStore')}
                        className="w-full h-auto"
                    />
                </a>
                <a
                    href={ANDROID_URL}
                    aria-label={t('download.getItOnGooglePlay')}
                    className={`${PLAY_BASIS} transition-opacity hover:opacity-80`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackAppStoreClicked({ store: 'google_play' })}
                >
                    <img
                        src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                        alt={t('download.getItOnGooglePlay')}
                        className="w-full h-auto"
                    />
                </a>
            </div>
            {/* Desktop only: a QR has no job on the phone you would scan it with. */}
            <div className="hidden md:flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg flex-shrink-0">
                    <QRCodeSVG value={qrValue} size={120} />
                </div>
                <p className="font-satoshi text-[13px] leading-[150%] text-[#969EA7]">
                    {t('download.scanToDownload')}
                </p>
            </div>
        </div>
    )
}

export default function DownloadSection() {
    const { t } = useTranslation()
    const [currentUrl] = useState(() => window.location.href)
    const eyebrowRef = useRef<HTMLDivElement>(null)
    const headlineRef = useRef<HTMLHeadingElement>(null)
    const cardsRef = useRef<HTMLDivElement>(null)
    const bgOverlayRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        trackDownloadPageViewed()
    }, [])

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const isMobile = window.innerWidth < 768
        const slideDistance = isMobile ? 15 : 20

        if (eyebrowRef.current) gsap.set(eyebrowRef.current, { opacity: 0, y: slideDistance })
        if (headlineRef.current) gsap.set(headlineRef.current, { opacity: 0, y: slideDistance })
        if (cardsRef.current) gsap.set(cardsRef.current, { opacity: 0, y: slideDistance })
        if (bgOverlayRef.current) gsap.set(bgOverlayRef.current, { opacity: 0 })

        if (prefersReducedMotion) {
            if (eyebrowRef.current) gsap.set(eyebrowRef.current, { opacity: 1, y: 0 })
            if (headlineRef.current) gsap.set(headlineRef.current, { opacity: 1, y: 0 })
            if (cardsRef.current) gsap.set(cardsRef.current, { opacity: 1, y: 0 })
            if (bgOverlayRef.current) gsap.set(bgOverlayRef.current, { opacity: 0.3 })
            return
        }

        const ease = 'cubic-bezier(0.16, 1, 0.3, 1)'
        if (bgOverlayRef.current) gsap.to(bgOverlayRef.current, { opacity: 0.3, duration: 1.2, ease: 'power2.out' })
        if (eyebrowRef.current) gsap.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 1.2, ease })
        if (headlineRef.current) gsap.to(headlineRef.current, { opacity: 1, y: 0, duration: 1.6, delay: 0.1, ease })
        if (cardsRef.current) gsap.to(cardsRef.current, { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease })
    }, [])

    return (
        // Topo background scoped to the page, not the viewport — the pricing page does the same.
        <div className="relative" style={{ overflowX: 'hidden' }}>
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
            <div ref={bgOverlayRef} className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(0,0,0,0.3)' }} />

            {/* ─── Hero ────────────────────────────────────────────────────────── */}
            <section className="relative z-10 w-full pt-40 sm:pt-48 pb-8 sm:pb-10 px-5 sm:px-8">
                <div className="max-w-[900px] mx-auto w-full flex flex-col gap-6 items-start text-left">
                    <div ref={eyebrowRef} className="font-mono text-[14px] tracking-[3px] uppercase text-[#969EA7]">
                        {t('download.tag')}
                    </div>
                    <h1
                        ref={headlineRef}
                        className="font-mono font-bold text-[32px] sm:text-[44px] lg:text-[52px] leading-[120%] text-white"
                    >
                        {t('download.headline')}
                    </h1>
                </div>
            </section>

            {/* ─── Audience cards ──────────────────────────────────────────────── */}
            <section className="relative z-10 w-full pt-8 sm:pt-10 pb-16 sm:pb-20 px-5 sm:px-8">
                <div ref={cardsRef} className="max-w-[900px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    {/* For coaches */}
                    <div className="rounded-2xl p-[1px]" style={{ background: CARD_BORDER }}>
                        <div
                            className="rounded-[15px] px-7 sm:px-8 py-7 sm:py-8 flex flex-col gap-6 h-full"
                            style={{ backgroundColor: '#151515' }}
                        >
                            <div className="flex flex-col gap-2">
                                <span className="font-mono text-[12px] tracking-[2px] uppercase text-[#969EA7]">
                                    {t('download.forCoaches')}
                                </span>
                                <p className="font-satoshi font-medium text-[16px] sm:text-[18px] leading-[160%] text-white">
                                    {t('download.coachesNote')}
                                </p>
                            </div>
                            <a
                                href={WEBAPP_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-gradient font-mono text-[12px] sm:text-[13px] font-extrabold tracking-[2px] uppercase text-white rounded-lg h-12 px-6 flex items-center justify-center hover:brightness-110 transition-all duration-200"
                            >
                                {t('download.signUp')}
                            </a>
                            <AppLinks qrValue={currentUrl} />
                        </div>
                    </div>

                    {/* For athletes */}
                    <div className="rounded-2xl p-[1px]" style={{ background: CARD_BORDER }}>
                        <div
                            className="rounded-[15px] px-7 sm:px-8 py-7 sm:py-8 flex flex-col gap-6 h-full"
                            style={{ backgroundColor: '#151515' }}
                        >
                            <div className="flex flex-col gap-2">
                                <span className="font-mono text-[12px] tracking-[2px] uppercase text-[#969EA7]">
                                    {t('download.forAthletes')}
                                </span>
                                <p className="font-satoshi font-medium text-[16px] sm:text-[18px] leading-[160%] text-white">
                                    {t('download.athletesNote')}
                                </p>
                            </div>
                            <AppLinks qrValue={currentUrl} />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
