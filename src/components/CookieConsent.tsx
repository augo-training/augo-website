import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getConsentStatus } from './cookieUtils'

const COOKIE_CONSENT_KEY = 'augo_cookie_consent'

export default function CookieConsent() {
    const { t } = useTranslation()
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (getConsentStatus() === 'pending') {
            // Small delay so the banner doesn't flash on load
            const timer = setTimeout(() => setVisible(true), 800)
            return () => clearTimeout(timer)
        }
    }, [])

    // Hide banner when consent is given from elsewhere (e.g. placeholder button)
    useEffect(() => {
        const handler = () => {
            if (getConsentStatus() !== 'pending') setVisible(false)
        }
        window.addEventListener('cookie-consent-changed', handler)
        return () => window.removeEventListener('cookie-consent-changed', handler)
    }, [])

    const handleAccept = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted')
        setVisible(false)
        window.dispatchEvent(new Event('cookie-consent-changed'))
    }

    const handleDecline = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'declined')
        setVisible(false)
        window.dispatchEvent(new Event('cookie-consent-changed'))
    }

    if (!visible) return null

    return (
        <div
            className="cookie-banner fixed bottom-0 left-0 right-0 z-[100]"
            role="dialog"
            aria-label="Cookie consent"
        >
            {/* Gradient fade at top */}
            <div
                className="absolute inset-x-0 top-0 pointer-events-none"
                style={{
                    height: '30px',
                    background: 'linear-gradient(to top, #090909, transparent)',
                    transform: 'translateY(-100%)',
                }}
            />

            <div
                className="w-full px-5 sm:px-8 py-5 sm:py-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-between max-w-[1200px] mx-auto"
            >
                {/* Text */}
                <p className="font-satoshi text-[14px] sm:text-[15px] leading-[150%] text-white text-center sm:text-left"
                    style={{ opacity: 0.85 }}
                >
                    {t('cookies.message')}
                </p>

                {/* Buttons */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                        onClick={handleDecline}
                        className="font-mono text-[12px] sm:text-[13px] font-semibold tracking-[1.5px] uppercase px-5 py-2.5 rounded-lg text-white border border-white/20 bg-transparent cursor-pointer transition-all duration-200 hover:border-white/50 hover:bg-white/5"
                    >
                        {t('cookies.decline')}
                    </button>
                    <button
                        onClick={handleAccept}
                        className="join-augo-btn font-mono text-[12px] sm:text-[13px] font-extrabold tracking-[1.5px] uppercase px-5 py-2.5 rounded-lg cursor-pointer"
                    >
                        {t('cookies.accept')}
                    </button>
                </div>
            </div>
        </div>
    )
}
