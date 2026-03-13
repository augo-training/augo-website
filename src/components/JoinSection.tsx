import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import { getConsentStatus } from './cookieUtils'
import bgImage from '../assets/images/bg_section_1.webp'

export default function JoinSection() {
    const { t } = useTranslation()
    const sectionRef = useRef<HTMLElement>(null)
    const bgOverlayRef = useRef<HTMLDivElement>(null)
    const headlineRef = useRef<HTMLHeadingElement>(null)
    const boldTextRef = useRef<HTMLParagraphElement>(null)
    const bodyRef = useRef<HTMLParagraphElement>(null)
    const formRef = useRef<HTMLDivElement>(null)
    const [consent, setConsent] = useState(getConsentStatus)

    useEffect(() => {
        const handler = () => setConsent(getConsentStatus())
        window.addEventListener('cookie-consent-changed', handler)
        return () => window.removeEventListener('cookie-consent-changed', handler)
    }, [])

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const isMobile = window.innerWidth < 768
        const slideDistance = isMobile ? 15 : 20

        if (headlineRef.current) gsap.set(headlineRef.current, { opacity: 0, y: slideDistance })
        if (boldTextRef.current) gsap.set(boldTextRef.current, { opacity: 0, y: slideDistance })
        if (bodyRef.current) gsap.set(bodyRef.current, { opacity: 0 })
        if (formRef.current) gsap.set(formRef.current, { opacity: 0, y: slideDistance })
        if (bgOverlayRef.current) gsap.set(bgOverlayRef.current, { opacity: 0 })

        if (prefersReducedMotion) {
            if (headlineRef.current) gsap.set(headlineRef.current, { opacity: 1, y: 0 })
            if (boldTextRef.current) gsap.set(boldTextRef.current, { opacity: 1, y: 0 })
            if (bodyRef.current) gsap.set(bodyRef.current, { opacity: 1 })
            if (formRef.current) gsap.set(formRef.current, { opacity: 1, y: 0 })
            if (bgOverlayRef.current) gsap.set(bgOverlayRef.current, { opacity: 0.3 })
            return
        }

        const ease = 'cubic-bezier(0.16, 1, 0.3, 1)'
        if (bgOverlayRef.current) gsap.to(bgOverlayRef.current, { opacity: 0.3, duration: 1.2, ease: 'power2.out' })
        if (headlineRef.current) gsap.to(headlineRef.current, { opacity: 1, y: 0, duration: 1.6, ease })
        if (boldTextRef.current) gsap.to(boldTextRef.current, { opacity: 1, y: 0, duration: 1.6, delay: 0.15, ease })
        if (bodyRef.current) gsap.to(bodyRef.current, { opacity: 1, duration: 1, delay: 0.3, ease })
        if (formRef.current) gsap.to(formRef.current, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease })
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
            ref={sectionRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
            style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <div className="relative z-10 w-full max-w-[1200px] mx-auto px-5 sm:px-8 py-20 sm:py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className="flex flex-col gap-6 lg:gap-8 items-center lg:items-start text-center lg:text-left pt-10">
                    <h1 ref={headlineRef} className="font-mono font-bold text-[32px] sm:text-[44px] lg:text-[40px] xl:text-[48px] leading-[130%] text-white">
                        {t('join.headline')}
                    </h1>
                    <p ref={bodyRef} className="font-satoshi font-medium text-[16px] sm:text-[18px] leading-[130%] text-[#969EA7] max-w-[420px] sm:max-w-[500px] lg:max-w-[420px]">
                        {t('join.body')}
                    </p>
                </div>

                <div ref={formRef} className="flex justify-center lg:justify-end w-full mt-4 lg:mt-0">
                    <div className="join-form-wrapper relative w-full max-w-[360px] sm:max-w-[420px]">
                        <div className="join-form-glow absolute -inset-10 sm:-inset-16 rounded-[2rem] pointer-events-none" />
                        <div className="join-form-border relative rounded-[20px] sm:rounded-[24px] p-[2px] sm:p-[3px]">
                            <div className="join-form-inner min-h-[500px] rounded-[18px] sm:rounded-[21px] bg-[#0A0A0A] w-full flex flex-col gap-6 overflow-hidden">
                                {consent === 'accepted' ? (
                                    <div data-tf-live="01K9FM9BX0ES43PVK4GR1KFKQT"></div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-center px-6 sm:px-10 py-12 flex-1">
                                        <h3 className="font-mono font-bold text-[18px] sm:text-[20px] text-white leading-[130%] mb-3">{t('join.cookiesRequired')}</h3>
                                        <p className="font-satoshi text-[14px] sm:text-[15px] leading-[160%] text-white mb-8" style={{ opacity: 0.7 }}>{t('join.cookiesMessage')}</p>
                                        <button onClick={handleAcceptCookies} className="join-augo-btn font-mono text-[13px] sm:text-[14px] font-extrabold tracking-[2px] uppercase px-8 py-3.5 rounded-lg cursor-pointer transition-all duration-200">{t('join.acceptCookies')}</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
