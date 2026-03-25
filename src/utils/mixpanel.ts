import mixpanel from 'mixpanel-browser'
import { getConsentStatus } from '../components/cookieUtils'

let initialized = false

function tryInit(): void {
    const token = import.meta.env.VITE_MIXPANEL_TOKEN
    if (!token || initialized || getConsentStatus() !== 'accepted') return
    mixpanel.init(token, { persistence: 'localStorage' })
    initialized = true
}

export function setupMixpanelConsentListener(): () => void {
    tryInit()
    const handler = (e: StorageEvent) => {
        if (e.key === 'augo_cookie_consent' && e.newValue === 'accepted') {
            tryInit()
        }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
}

export function getUtmParams(): {
    utm_source: string | null
    utm_medium: string | null
    utm_campaign: string | null
} {
    const params = new URLSearchParams(window.location.search)
    return {
        utm_source: params.get('utm_source'),
        utm_medium: params.get('utm_medium'),
        utm_campaign: params.get('utm_campaign'),
    }
}

interface PricingPageViewedProps {
    country: string
    cluster: string
    experiment_arm: string
    pricing_currency: string
    pricing_amount: number
    utm_source: string | null
    utm_medium: string | null
    utm_campaign: string | null
}

export function trackPricingPageViewed(props: PricingPageViewedProps): void {
    tryInit()
    if (!initialized) return
    mixpanel.track('pricing_page_viewed', props)
}

interface PricingCtaClickedProps {
    country: string
    cluster: string
    experiment_arm: string
    pricing_currency: string
    pricing_amount: number
    cta_text: string
    utm_source: string | null
}

export function trackPricingCtaClicked(props: PricingCtaClickedProps): void {
    tryInit()
    if (!initialized) return
    mixpanel.track('pricing_page_cta_clicked', props)
}
