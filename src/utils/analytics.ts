import { getConsentStatus } from '../components/cookieUtils'
import { normalizePage } from './page'

/**
 * Mixpanel wrapper for the website.
 *
 * Consent: nothing is sent until the visitor accepts the cookie banner. Events
 * fired before the banner is answered (the landing page_viewed in particular)
 * are held in a small in-memory queue and flushed the moment consent is given,
 * so a first-time visitor's landing and UTM parameters are not lost. A decline
 * empties the queue.
 *
 * Environment: in `vite dev` nothing is sent unless VITE_MIXPANEL_DEBUG=1, so
 * local work stops polluting the production project.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = Record<string, any>

interface QueuedEvent {
    event: string
    props?: Props
    queuedAt: number
}

interface PendingIdentity {
    distinctId: string
    set: Props
    setOnce: Props
}

const MAX_QUEUE = 20
const queue: QueuedEvent[] = []
let pendingIdentity: PendingIdentity | null = null
let initialized = false

function isEnabled(): boolean {
    if (!import.meta.env.VITE_MIXPANEL_TOKEN) return false
    if (import.meta.env.DEV && import.meta.env.VITE_MIXPANEL_DEBUG !== '1') return false
    return true
}

async function tryInit(): Promise<boolean> {
    if (initialized) return true
    if (!isEnabled() || getConsentStatus() !== 'accepted') return false
    try {
        const { default: mixpanel } = await import('mixpanel-browser')
        mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN, {
            persistence: 'localStorage',
            api_host: 'https://api-eu.mixpanel.com',
        })
        mixpanel.register({
            platform: 'website',
            environment: import.meta.env.DEV ? 'development' : 'production',
        })
        initialized = true
        return true
    } catch {
        // Ad blocker or network failure — silently ignore
        return false
    }
}

async function applyIdentity(identity: PendingIdentity): Promise<void> {
    const { default: mixpanel } = await import('mixpanel-browser')
    mixpanel.identify(identity.distinctId)
    mixpanel.people.set(identity.set)
    mixpanel.people.set_once(identity.setOnce)
}

/** Sends whatever was held while the banner was unanswered. Identity first, so
 *  the queued events land on the profile. */
async function flush(): Promise<void> {
    if (!(await tryInit())) return
    try {
        if (pendingIdentity) {
            const identity = pendingIdentity
            pendingIdentity = null
            await applyIdentity(identity)
        }
        const items = queue.splice(0)
        if (items.length === 0) return
        const { default: mixpanel } = await import('mixpanel-browser')
        const now = Date.now()
        for (const item of items) {
            mixpanel.track(item.event, {
                ...item.props,
                queued_for_consent: true,
                consent_delay_ms: now - item.queuedAt,
            })
        }
    } catch {
        // Silently ignore if blocked
    }
}

function discardQueue(): void {
    queue.length = 0
    pendingIdentity = null
}

async function track(event: string, props?: Props): Promise<void> {
    if (!isEnabled()) return
    const consent = getConsentStatus()
    if (consent === 'declined') return
    if (consent === 'pending') {
        queue.push({ event, props, queuedAt: Date.now() })
        if (queue.length > MAX_QUEUE) queue.shift()
        return
    }
    if (!(await tryInit())) return
    try {
        const { default: mixpanel } = await import('mixpanel-browser')
        mixpanel.track(event, props)
    } catch {
        // Silently ignore if blocked
    }
}

export function setupMixpanelConsentListener(): () => void {
    void flush()
    // Consent changes in the current tab (custom event from CookieConsent)
    const consentHandler = () => {
        const consent = getConsentStatus()
        if (consent === 'accepted') void flush()
        else if (consent === 'declined') discardQueue()
    }
    window.addEventListener('cookie-consent-changed', consentHandler)
    // Consent changes from other tabs (storage event)
    const storageHandler = (e: StorageEvent) => {
        if (e.key !== 'augo_cookie_consent') return
        if (e.newValue === 'accepted') void flush()
        else if (e.newValue === 'declined') discardQueue()
    }
    window.addEventListener('storage', storageHandler)
    return () => {
        window.removeEventListener('cookie-consent-changed', consentHandler)
        window.removeEventListener('storage', storageHandler)
    }
}

// ── Shared helpers ──

export { normalizePage }

function currentPage(): string {
    return normalizePage(window.location.pathname)
}

/**
 * UTM parameters present on the current URL. Only keys that are actually set
 * are returned: spreading explicit nulls into event properties would overwrite
 * the campaign super-properties the Mixpanel SDK registers on its own.
 */
export type UtmKey = 'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_content' | 'utm_term'
export type UtmParams = Partial<Record<UtmKey, string>>

export function getUtmParams(): UtmParams {
    const params = new URLSearchParams(window.location.search)
    const out: UtmParams = {}
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const) {
        const value = params.get(key)
        if (value) out[key] = value
    }
    return out
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
    pricing_bucket: string
    pricing_currency: string
    /** The promotional Pro price, per athlete per month. */
    pricing_amount: number
    /** The full list price the promo is discounted from. */
    pricing_list_amount: number
    // Optional: the sole caller spreads getUtmParams(), which returns a Partial.
    utm_source?: string | null
    utm_medium?: string | null
    utm_campaign?: string | null
}

export async function trackPricingPageViewed(props: PricingPageViewedProps): Promise<void> {
    if (!(await tryInit())) return
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
    /** Only set for CTAs that sit under a billing toggle; the plan CTAs are monthly-only. */
    billing_period?: 'monthly' | 'yearly'
    plan?: 'pro' | 'enterprise' | 'elite'
}

export async function trackPricingCtaClicked(props: PricingCtaClickedProps): Promise<void> {
    return track('pricing_page_cta_clicked', props)
}

export async function trackFloatingButtonClicked(props: { page: string }): Promise<void> {
    return track('floating_button_clicked', props)
}

// ── Email capture tracking ──

interface EmailCaptureSubmittedProps {
    email: string
    cta_text: string
    visitor_type?: string
    page?: string
    coaching_status?: string
}

/** Event name kept for continuity with existing reports; it covers every email
 *  capture on the site, not only pricing. */
export async function trackEmailCaptureSubmitted(props: EmailCaptureSubmittedProps): Promise<void> {
    return track('pricing_email_capture_submitted', { ...props, ...getUtmParams() })
}

export async function trackEmailCaptureFailed(props: { cta_text: string; status: number | 'network_error'; error?: string }): Promise<void> {
    return track('email_capture_failed', props)
}

/** A validation or submit error shown to the visitor on an email capture form. */
export async function trackEmailCaptureError(props: { page: string; cta_text: string; error: string }): Promise<void> {
    return track('email_capture_error', props)
}

/** The capture was accepted and the page unlocked (Nice landing page). */
export async function trackEmailCaptureUnlocked(props: { page: string; cta_text: string }): Promise<void> {
    return track('email_capture_unlocked', props)
}

export async function trackCoachingStatusSelected(props: { page: string; coaching_status: string }): Promise<void> {
    return track('coaching_status_selected', props)
}

interface IdentifyEmailCaptureProps {
    email: string
    first_name?: string
    coaching_status?: string
    /** Where the capture happened, e.g. the cta_text. */
    source: string
    page: string
}

/**
 * Ties the anonymous visitor to a Mixpanel profile keyed by email, so the
 * events before signup, later visits, and the MailerLite subscriber can be
 * joined. Held until consent if the banner is still unanswered.
 */
export async function identifyEmailCapture(props: IdentifyEmailCaptureProps): Promise<void> {
    if (!isEnabled()) return
    const distinctId = props.email.trim().toLowerCase()
    const identity: PendingIdentity = {
        distinctId,
        set: {
            $email: distinctId,
            ...(props.first_name ? { $first_name: props.first_name } : {}),
            ...(props.coaching_status ? { coaching_status: props.coaching_status } : {}),
            last_signup_source: props.source,
            last_signup_page: props.page,
            ...getUtmParams(),
        },
        setOnce: {
            first_signup_at: new Date().toISOString(),
            first_signup_source: props.source,
            first_signup_page: props.page,
        },
    }
    const consent = getConsentStatus()
    if (consent === 'declined') return
    if (consent === 'pending') {
        pendingIdentity = identity
        return
    }
    if (!(await tryInit())) return
    try {
        await applyIdentity(identity)
    } catch {
        // Silently ignore if blocked
    }
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

/** Declines cannot be tracked: Mixpanel never initialises without consent. The
 *  accept carries the page and UTMs so the landing is attributable on its own. */
export async function trackCookieConsentResponse(props: { response: 'accepted' | 'declined' }): Promise<void> {
    if (props.response !== 'accepted') return
    return track('cookie_consent_accepted', {
        page: currentPage(),
        referrer: document.referrer,
        ...getUtmParams(),
    })
}

// ── Language switch tracking ──

export async function trackLanguageSwitched(props: { from_language: string; to_language: string }): Promise<void> {
    return track('language_switched', props)
}

// ── Billing toggle tracking ──

export async function trackBillingToggle(props: { billing_period: 'monthly' | 'yearly'; plan?: 'elite' }): Promise<void> {
    return track('billing_toggle_switched', props)
}

// ── 404 and redirect tracking ──

export async function trackPageNotFound(props: { path: string; referrer: string }): Promise<void> {
    return track('page_not_found', { ...props, ...getUtmParams() })
}

export async function trackLegacyRedirect(props: { from: string; to: string; reason?: string }): Promise<void> {
    return track('legacy_redirect', { ...props, referrer: document.referrer })
}
