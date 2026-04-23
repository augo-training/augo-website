import { getConsentStatus } from '../components/cookieUtils'

let initialized = false

async function tryInit(): Promise<void> {
    const token = import.meta.env.VITE_MIXPANEL_TOKEN
    if (!token || initialized || getConsentStatus() !== 'accepted') return
    try {
        const { default: mixpanel } = await import('mixpanel-browser')
        mixpanel.init(token, { persistence: 'localStorage', api_host: 'https://api-eu.mixpanel.com' })
        initialized = true
    } catch {
        // Ad blocker or network failure — silently ignore
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function track(event: string, props?: Record<string, any>): Promise<void> {
    await tryInit()
    if (!initialized) return
    try {
        const { default: mixpanel } = await import('mixpanel-browser')
        mixpanel.track(event, props)
    } catch {
        // Silently ignore if blocked
    }
}

export function setupMixpanelConsentListener(): () => void {
    tryInit()
    // Listen for consent changes in the current tab (custom event from CookieConsent)
    const consentHandler = () => {
        if (getConsentStatus() === 'accepted') tryInit()
    }
    window.addEventListener('cookie-consent-changed', consentHandler)
    // Listen for consent changes from other tabs (storage event)
    const storageHandler = (e: StorageEvent) => {
        if (e.key === 'augo_cookie_consent' && e.newValue === 'accepted') {
            tryInit()
        }
    }
    window.addEventListener('storage', storageHandler)
    return () => {
        window.removeEventListener('cookie-consent-changed', consentHandler)
        window.removeEventListener('storage', storageHandler)
    }
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

// ── Page view tracking ──

export async function trackPageViewed(props: { page: string; referrer: string; language: string }): Promise<void> {
    return track('page_viewed', { ...props, ...getUtmParams() })
}

// ── Section visibility tracking (home page) ──

export async function trackSectionViewed(props: { section: string; page: string }): Promise<void> {
    return track('section_viewed', props)
}

// ── CTA / button click tracking ──

export async function trackCtaClicked(props: { cta_text: string; cta_location: string; destination: string }): Promise<void> {
    return track('cta_clicked', props)
}

// ── Navigation tracking ──

export async function trackNavLinkClicked(props: { link_text: string; destination: string; is_mobile: boolean }): Promise<void> {
    return track('nav_link_clicked', props)
}

// ── Pricing-specific tracking (preserving existing events) ──

interface PricingPageViewedProps {
    country: string
    cluster: string
    experiment_arm: string
    pricing_currency: string
    pricing_amount: number
    fx_rate: number | null
    discount_pct: number
    utm_source: string | null
    utm_medium: string | null
    utm_campaign: string | null
}

export async function trackPricingPageViewed(props: PricingPageViewedProps): Promise<void> {
    await tryInit()
    if (!initialized) return
    try {
        const { default: mixpanel } = await import('mixpanel-browser')
        mixpanel.register(props)
        mixpanel.track('pricing_page_viewed', props)
    } catch {
        // Silently ignore if blocked
    }
}

interface PricingCtaClickedProps {
    cta_text: string
    billing_period: 'monthly' | 'yearly'
}

export async function trackPricingCtaClicked(props: PricingCtaClickedProps): Promise<void> {
    return track('pricing_page_cta_clicked', props)
}

export async function trackFloatingButtonClicked(props: { page: string }): Promise<void> {
    return track('floating_button_clicked', props)
}

export async function trackEmailCaptureSubmitted(props: { email: string; cta_text: string }): Promise<void> {
    return track('pricing_email_capture_submitted', props)
}

// ── Video tracking ──

export async function trackVideoOpened(props: { trigger: string; page: string }): Promise<void> {
    return track('video_opened', props)
}

export async function trackVideoClosed(props: { page: string; watch_duration_seconds: number }): Promise<void> {
    return track('video_closed', props)
}

// ── Find / matching page tracking ──

export async function trackFindPageViewed(): Promise<void> {
    return track('find_page_viewed', getUtmParams())
}

// ── Download page tracking ──

export async function trackDownloadPageViewed(): Promise<void> {
    return track('download_page_viewed', { ...getUtmParams() })
}

export async function trackAppStoreClicked(props: { store: 'app_store' | 'google_play' }): Promise<void> {
    return track('app_store_clicked', props)
}

// ── FAQ tracking ──

export async function trackFaqExpanded(props: { question: string; page: string }): Promise<void> {
    return track('faq_expanded', props)
}

// ── Contact form tracking ──

export async function trackContactFormOpened(): Promise<void> {
    return track('contact_form_opened')
}

// ── Cookie consent tracking ──

export async function trackCookieConsentResponse(props: { response: 'accepted' | 'declined' }): Promise<void> {
    if (props.response !== 'accepted') return // can't track declined since Mixpanel won't init
    return track('cookie_consent_accepted')
}

// ── Language switch tracking ──

export async function trackLanguageSwitched(props: { from_language: string; to_language: string }): Promise<void> {
    return track('language_switched', props)
}

// ── Billing toggle tracking ──

export async function trackBillingToggle(props: { billing_period: 'monthly' | 'yearly' }): Promise<void> {
    return track('billing_toggle_switched', props)
}
