import { getConsentStatus } from '../components/cookieUtils'
import { normalizePage } from './page'
import { isLocalHost, isTrackingEnabled } from './trackingEnv'
import {
    trackMetaPageView,
    trackMetaLead,
    trackMetaViewContent,
    trackMetaAppStoreClick,
} from './metaPixel'

/**
 * Mixpanel wrapper for the website.
 *
 * Consent: an unanswered cookie banner counts as permission to track, an
 * explicit Decline stops it. Most visitors never answer a banner, and treating
 * that silence as "no" was losing the landing event and its UTMs for the bulk
 * of paid-ad traffic. A decline stops further sending; it does not delete what
 * was already collected.
 *
 * Environment: `./trackingEnv` allows tracking only from a non-local hostname,
 * which is what keeps `vite dev`, `vite preview`, CI and the 177-route
 * prerender pass out of the production project. Set VITE_TRACKING_DEBUG=1 to
 * track from localhost while testing.
 *
 * Meta Pixel: a few of the wrappers below also fan out to `./metaPixel`, which
 * keeps its own consent gate. Only those four events go to Meta —
 * the fan-out is deliberately in the named wrappers rather than in `track()`,
 * so adding a Mixpanel event never silently starts sending it to Meta too.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = Record<string, any>

interface Identity {
    distinctId: string
    set: Props
    setOnce: Props
}

let initialized = false

function isEnabled(): boolean {
    if (!import.meta.env.VITE_MIXPANEL_TOKEN) return false
    return isTrackingEnabled()
}

async function tryInit(): Promise<boolean> {
    if (initialized) return true
    if (!isEnabled() || getConsentStatus() === 'declined') return false
    try {
        const { default: mixpanel } = await import('mixpanel-browser')
        mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN, {
            persistence: 'localStorage',
            api_host: 'https://api-eu.mixpanel.com',
        })
        mixpanel.register({
            platform: 'website',
            environment: isLocalHost() ? 'development' : 'production',
        })
        initialized = true
        return true
    } catch {
        // Ad blocker or network failure — silently ignore
        return false
    }
}

async function applyIdentity(identity: Identity): Promise<void> {
    const { default: mixpanel } = await import('mixpanel-browser')
    mixpanel.identify(identity.distinctId)
    mixpanel.people.set(identity.set)
    mixpanel.people.set_once(identity.setOnce)
}

/**
 * `beacon` is for a click that leaves the page in the same tab: the SDK's
 * normal batched XHR would be cancelled by the navigation, a beacon is not.
 */
async function track(event: string, props?: Props, options?: { beacon?: boolean }): Promise<void> {
    if (!isEnabled()) return
    if (getConsentStatus() === 'declined') return
    if (!(await tryInit())) return
    try {
        const { default: mixpanel } = await import('mixpanel-browser')
        if (options?.beacon) mixpanel.track(event, props, { transport: 'sendBeacon' })
        else mixpanel.track(event, props)
    } catch {
        // Silently ignore if blocked
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
    trackMetaPageView()
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
    /** Only set for CTAs under a billing toggle; the plan CTAs are monthly-only. */
    billing_period?: 'monthly' | 'yearly'
    /** Stable id for the button, since cta_text is localized: 'pro' | 'enterprise' | 'elite'. */
    plan: string
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
    /** Which form on the page was used, when a page repeats its opt-in. */
    placement?: string
}

/** Event name kept for continuity with existing reports; it covers every email
 *  capture on the site, not only pricing. */
export async function trackEmailCaptureSubmitted(props: EmailCaptureSubmittedProps): Promise<void> {
    // Meta gets the CTA label only — never the email address.
    trackMetaLead({ content_name: props.cta_text })
    return track('pricing_email_capture_submitted', { ...props, ...getUtmParams() })
}

export async function trackEmailCaptureFailed(props: { cta_text: string; status: number | 'network_error'; error?: string }): Promise<void> {
    return track('email_capture_failed', props)
}

/** A validation or submit error shown to the visitor on an email capture form. */
export async function trackEmailCaptureError(props: { page: string; cta_text: string; error: string; placement?: string }): Promise<void> {
    return track('email_capture_error', props)
}

/** The capture was accepted and the page unlocked (Nice landing page). */
export async function trackEmailCaptureUnlocked(props: { page: string; cta_text: string; placement?: string }): Promise<void> {
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
    /** The /merci invitation code the signup came in on. */
    merci_code?: string
}

/**
 * Ties the anonymous visitor to a Mixpanel profile keyed by email, so the
 * events before signup, later visits, and the MailerLite subscriber can be
 * joined.
 */
export async function identifyEmailCapture(props: IdentifyEmailCaptureProps): Promise<void> {
    if (!isEnabled()) return
    const distinctId = props.email.trim().toLowerCase()
    const identity: Identity = {
        distinctId,
        set: {
            $email: distinctId,
            ...(props.first_name ? { $first_name: props.first_name } : {}),
            ...(props.coaching_status ? { coaching_status: props.coaching_status } : {}),
            ...(props.merci_code ? { merci_code: props.merci_code } : {}),
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
    if (getConsentStatus() === 'declined') return
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
    trackMetaViewContent({ content_name: 'download' })
    return track('download_page_viewed', { ...getUtmParams() })
}

/** `visitor_type` says which of the two /download cards the badge was clicked in;
 *  it reuses the values the email capture already sends. */
export async function trackAppStoreClicked(props: {
    store: 'app_store' | 'google_play'
    visitor_type: 'coach' | 'athlete'
}): Promise<void> {
    trackMetaAppStoreClick({ store: props.store })
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

/** Declines are deliberately not recorded — sending an event about someone at
 *  the moment they opt out is the wrong instinct, and the decline rate is still
 *  derivable from page_viewed against cookie_consent_accepted. The accept
 *  carries the page and UTMs so the landing is attributable on its own. */
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

export async function trackSupportArticleViewed(props: {
    slug: string
    category: string
    audience: string
}): Promise<void> {
    return track('support_article_viewed', props)
}

export async function trackSupportVideoPlayed(props: {
    slug: string
    provider: string
    id: string
}): Promise<void> {
    return track('support_video_played', props)
}

export async function trackSupportSearch(props: {
    query: string
    result_count: number
    confidence: number
    tier: string
    top_slug: string
}): Promise<void> {
    return track('support_search', props)
}

// The queries we can't answer are the content roadmap: unknown_terms is
// literally the list of words the corpus has never seen.
export async function trackSupportSearchNoResults(props: {
    query: string
    unknown_terms: string
}): Promise<void> {
    return track('support_search_no_results', props)
}

// ── Worlds postcard page (/merci) ──
//
// Read per code, as a funnel: door_viewed is everyone who landed, door_started
// who typed anything, gate_opened who got in (and, since the door also takes
// the email, who is now reachable), beat_viewed how far they got through the
// sequence, offer_clicked who tapped the button and offer_redeemed who was
// accepted. code_failed, code_check_error and no_code_clicked explain losses
// at the door; offer_error explains the gap between clicked and redeemed. None
// of these go to Meta.
//
// The merci events call the property `code`. Once the door opens the same
// value is also registered as the super property `merci_code`, so whatever
// that browser does on the rest of the site afterwards carries it too.

type MerciSrc = 'postcard' | 'email'
/** How the code reached the field: a `?c=` link, the code saved on this device, or typed. */
export type MerciCodeMethod = 'link' | 'saved' | 'typed'
/** What the door opened with: a `?c=` code, the code saved on this device, or nothing. */
export type MerciDoorEntry = 'link' | 'saved' | 'blank'

/**
 * The door became visible. `code` is only what the URL or this device
 * suggested, not yet checked, so it is absent for a cold postcard scan.
 */
export async function trackMerciDoorViewed(props: {
    src: MerciSrc
    entry: MerciDoorEntry
    code?: string
}): Promise<void> {
    return track('merci_door_viewed', { ...props, ...getUtmParams() })
}

/** First keystroke in either door field: separates "landed and left" from "tried". */
export async function trackMerciDoorStarted(props: { src: MerciSrc; entry: MerciDoorEntry }): Promise<void> {
    return track('merci_door_started', props)
}

/** The door refused a submission. `code` is as typed, before normalising. */
export async function trackMerciCodeFailed(props: {
    code: string
    /**
     * 'malformed' and 'email' never reached the server: the code was not three
     * letters, or the email did not look like one. 'unknown' was not on the list.
     */
    reason: 'malformed' | 'unknown' | 'email'
    method: MerciCodeMethod
}): Promise<void> {
    return track('merci_code_failed', props)
}

/** The code check itself failed (webhook down or unreachable), so a real coach may be stuck. */
export async function trackMerciCodeCheckError(props: { code: string; method: MerciCodeMethod }): Promise<void> {
    return track('merci_code_check_error', props)
}

/** "No invitation code?" leaves for the Typeform in the same tab, hence the beacon. */
export async function trackMerciNoCodeClicked(props: { code?: string }): Promise<void> {
    return track('merci_no_code_clicked', props, { beacon: true })
}

/** A valid code opened the door, typed or from a `?c=` email link. */
export async function trackMerciGateOpened(props: {
    code: string
    src: MerciSrc
    method: MerciCodeMethod
    already_redeemed: boolean
}): Promise<void> {
    if (!isEnabled() || getConsentStatus() === 'declined') return
    if (!(await tryInit())) return
    try {
        const { default: mixpanel } = await import('mixpanel-browser')
        mixpanel.register({ merci_code: props.code, merci_src: props.src })
        mixpanel.track('merci_gate_opened', props)
    } catch {
        // Silently ignore if blocked
    }
}

/**
 * A beat became visible, including on the way back: `first_view` separates
 * the two. `seconds_on_previous` is how long the beat before it was up.
 */
export async function trackMerciBeatViewed(props: {
    code: string
    src: MerciSrc
    beat: number
    beat_name: string
    first_view: boolean
    seconds_on_previous?: number
}): Promise<void> {
    return track('merci_beat_viewed', props)
}

/** An error shown on the offer; 'already_redeemed' is the note that replaces the button. */
export async function trackMerciOfferError(props: {
    code: string
    error: 'submit' | 'already_redeemed'
}): Promise<void> {
    return track('merci_offer_error', props)
}

/** Where on the ticket page the button was: the pass at the top, one of the strips after a section, or the pass at the end. */
export type MerciOfferPlacement = 'hero' | 'get' | 'team' | 'peek' | 'closing'

/** The tap on the ticket's button, before the redeem call answers. */
export async function trackMerciOfferClicked(props: {
    code: string
    src: MerciSrc
    placement: MerciOfferPlacement
}): Promise<void> {
    return track('merci_offer_clicked', props)
}

/** The redeem call accepted the tap: the coach is on the list. */
export async function trackMerciOfferRedeemed(props: { code: string; email: string; src: MerciSrc }): Promise<void> {
    return track('merci_offer_redeemed', props)
}

/**
 * An advisor's name under the card, 'redeemed_contact' in the already-redeemed
 * note, or 'instagram' for the follow link on the done screen.
 */
export async function trackMerciLinkClicked(props: { code: string; link: string }): Promise<void> {
    // The contact link leaves in the same tab; a beacon costs the others nothing.
    return track('merci_link_clicked', props, { beacon: true })
}
