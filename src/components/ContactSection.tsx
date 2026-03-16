import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getConsentStatus } from './cookieUtils'
import { gsap } from 'gsap'

export default function ContactSection() {
    const { t } = useTranslation()
    const blob1Ref = useRef<HTMLDivElement>(null)
    const blob2Ref = useRef<HTMLDivElement>(null)
    const blob3Ref = useRef<HTMLDivElement>(null)
    const blob4Ref = useRef<HTMLDivElement>(null)
    const blob5Ref = useRef<HTMLDivElement>(null)
    const formCardRef = useRef<HTMLDivElement>(null)
    const [consent, setConsent] = useState(getConsentStatus)

    useEffect(() => {
        const handler = () => setConsent(getConsentStatus())
        window.addEventListener('cookie-consent-changed', handler)
        return () => window.removeEventListener('cookie-consent-changed', handler)
    }, [])

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (prefersReducedMotion) return

        const blobs = [
            { ref: blob1Ref, duration: 8, x: 40, y: 25, r: 15 },
            { ref: blob2Ref, duration: 10, x: -30, y: 35, r: -20 },
            { ref: blob3Ref, duration: 7, x: 25, y: -30, r: 10 },
            { ref: blob4Ref, duration: 9, x: -35, y: 25, r: -15 },
            { ref: blob5Ref, duration: 11, x: 20, y: -25, r: 12 },
        ]

        const tweens = blobs.map(({ ref, duration, x, y, r }) => {
            const el = ref.current
            if (!el) return null
            return gsap.to(el, {
                x, y, rotation: r, scale: 1.08,
                duration, ease: 'sine.inOut', yoyo: true, repeat: -1,
            })
        })

        const card = formCardRef.current
        if (card) {
            gsap.set(card, { opacity: 0, y: 20 })
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            gsap.to(card, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
                            observer.disconnect()
                        }
                    })
                },
                { threshold: 0.1 }
            )
            observer.observe(card)
        }

        return () => { tweens.forEach((t) => t?.kill()) }
    }, [])

    useEffect(() => {
        if (consent !== 'accepted') return
        const script = document.createElement('script')
        script.src = '//embed.typeform.com/next/embed.js'
        script.async = true
        document.head.appendChild(script)
        return () => { document.head.removeChild(script) }
    }, [consent])

    const handleAcceptCookies = () => {
        localStorage.setItem('augo_cookie_consent', 'accepted')
        setConsent('accepted')
        window.dispatchEvent(new Event('cookie-consent-changed'))
    }

    return (
        <section
            id="contact"
            className="w-full flex items-center relative overflow-hidden bg-[#090909]"
            style={{ minHeight: '100vh' }}
        >
            {/* Mesh gradient */}
            <div className="absolute inset-0" aria-hidden="true" style={{ filter: 'blur(60px)', opacity: 0.9 }}>
                <div ref={blob1Ref} className="absolute" style={{ width: '80%', height: '80%', top: '-20%', right: '-10%', background: 'radial-gradient(ellipse 80% 50% at 70% 30%, #FFCA1E 0%, transparent 65%)' }} />
                <div ref={blob2Ref} className="absolute" style={{ width: '75%', height: '75%', top: '0%', right: '0%', background: 'radial-gradient(ellipse 60% 40% at 55% 50%, #FF5514 0%, transparent 65%)' }} />
                <div ref={blob3Ref} className="absolute" style={{ width: '85%', height: '85%', top: '10%', left: '10%', background: 'radial-gradient(ellipse 50% 50% at 50% 50%, #C50017 0%, transparent 60%)' }} />
                <div ref={blob4Ref} className="absolute" style={{ width: '70%', height: '70%', bottom: '-20%', right: '5%', background: 'radial-gradient(ellipse 40% 35% at 50% 60%, #FF5514 0%, transparent 65%)' }} />
                <div ref={blob5Ref} className="absolute" style={{ width: '60%', height: '60%', top: '20%', left: '-5%', background: 'radial-gradient(ellipse 70% 60% at 40% 40%, #FFCA1E 0%, transparent 60%)' }} />
            </div>

            {/* Edge fades */}
            <div className="absolute inset-x-0 top-0 z-10 pointer-events-none" style={{ height: '150px', background: 'linear-gradient(to bottom, #090909 0%, transparent 100%)' }} />
            <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: '150px', background: 'linear-gradient(to top, #090909 0%, transparent 100%)' }} />

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 max-w-[1200px] mx-auto w-full items-center lg:items-center relative z-20 px-5 sm:px-8 py-16 lg:py-24">
                <div ref={formCardRef} className="order-2 lg:order-1 mx-auto lg:mx-0 w-full" style={{ maxWidth: '486px' }}>
                    <div className="join-form-wrapper relative w-full">
                        <div className="join-form-glow absolute -inset-10 sm:-inset-16 rounded-[2rem] pointer-events-none" />
                        <div className="join-form-border relative rounded-[20px] sm:rounded-[24px] p-[2px] sm:p-[3px]">
                            <div className="join-form-inner min-h-[500px] rounded-[18px] sm:rounded-[21px] bg-white w-full overflow-hidden">
                                {consent === 'accepted' ? (
                                    <div data-tf-live="01KJGKY5FEG41JEKDRFTM4F4D6"></div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-center px-6 sm:px-10 py-12" style={{ minHeight: '500px' }}>
                                        <h3 className="font-mono font-bold text-[18px] sm:text-[20px] text-white leading-[130%] mb-3">{t('contact.cookiesRequired')}</h3>
                                        <p className="font-satoshi text-[14px] sm:text-[15px] leading-[160%] text-white mb-8" style={{ opacity: 0.7 }}>{t('contact.cookiesMessage')}</p>
                                        <button onClick={handleAcceptCookies} className="join-augo-btn font-mono text-[13px] sm:text-[14px] font-extrabold tracking-[2px] uppercase px-8 py-3.5 rounded-lg cursor-pointer transition-all duration-200">{t('contact.acceptCookies')}</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="order-1 lg:order-2 flex flex-col gap-4 sm:gap-6 pt-4 text-center lg:text-left items-center lg:items-start max-w-[500px] lg:max-w-none mx-auto lg:mx-0 w-full mb-8 lg:mb-0">
                    <h2 className="font-mono font-bold text-[32px] sm:text-[48px] lg:text-[56px] leading-[110%] text-white">
                        {t('contact.headline')}
                    </h2>
                    <p className="font-satoshi font-medium text-[16px] sm:text-[18px] leading-[150%] text-white" style={{ opacity: 0.8 }}>
                        {t('contact.body')}
                    </p>
                </div>
            </div>
        </section>
    )
}
