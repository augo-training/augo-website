import { getConsentStatus } from '../components/cookieUtils'

let initialized = false

async function tryInit(): Promise<void> {
    const token = import.meta.env.VITE_MIXPANEL_TOKEN
    if (!token || initialized || getConsentStatus() !== 'accepted') return
    try {
        const { default: mixpanel } = await import('mixpanel-browser')
        mixpanel.init(token, { persistence: 'localStorage' })
        initialized = true
    } catch {
        // Ad blocker or network failure — silently ignore
    }
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

export async function trackPricingPageViewed(props: PricingPageViewedProps): Promise<void> {
    await tryInit()
    if (!initialized) return
    try {
        const { default: mixpanel } = await import('mixpanel-browser')
        mixpanel.track('pricing_page_viewed', props)
    } catch {
        // Silently ignore if blocked
    }
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

export async function trackPricingCtaClicked(props: PricingCtaClickedProps): Promise<void> {
    await tryInit()
    if (!initialized) return
    try {
        const { default: mixpanel } = await import('mixpanel-browser')
        mixpanel.track('pricing_page_cta_clicked', props)
    } catch {
        // Silently ignore if blocked
    }
}
