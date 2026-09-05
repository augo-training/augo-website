import { getConsentStatus } from '../components/cookieUtils'
import { isTrackingEnabled } from './trackingEnv'

/**
 * Meta Pixel for the website.
 *
 * Consent: an unanswered cookie banner counts as permission to track, an
 * explicit Decline stops it. The ad landing pages are single-screen dead ends
 * where the banner only appears 800ms in, so most ad visitors never answer it;
 * treating that silence as "no" meant Meta saw almost nothing. This is the old
 * implied-consent model, chosen knowingly — see the banner copy, which says
 * the cookies are already on and that Decline turns them off.
 *
 * A Decline stops further sending, ours and Meta's own: `metaTrack` returns
 * early, and `fbq('consent', 'revoke')` covers the already-loaded fbevents.js
 * in case Automatic Events is ever switched on in Events Manager. It does not
 * try to undo tracking that already happened — `_fbp` and `_fbc` are left in
 * place, and no profile is deleted.
 *
 * Deliberately NOT in `index.html`: the build prerenders every route through
 * Puppeteer, so a base snippet in the shared <head> would fire a few hundred
 * PageViews from the build machine each time. The prerenderer is kept out by
 * the hostname guard in `./trackingEnv` — it used to be kept out by the consent
 * gate, which stopped being true when silence started counting as yes.
 *
 * The pixel id is public by design (it ships in the page source of every site
 * that uses one), so it lives here rather than in an env var, like the
 * Typeform ids and store URLs elsewhere in the codebase.
 */

const PIXEL_ID = '1875178980121622'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Fbq = (...args: any[]) => void

declare global {
    interface Window {
        fbq?: Fbq
        _fbq?: Fbq
    }
}

type Props = Record<string, string | number>
type Kind = 'track' | 'trackCustom'

let loaded = false
let revoked = false

/** Meta's base snippet, transcribed. The stub queues calls made before
 *  fbevents.js finishes loading and replays them once it does. */
function installStub(): void {
    if (window.fbq) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const n: any = function (...args: any[]) {
        if (n.callMethod) n.callMethod(...args)
        else n.queue.push(args)
    }
    n.push = n
    n.loaded = true
    n.version = '2.0'
    n.queue = []
    window.fbq = n
    window._fbq = n
}

function loadPixel(): boolean {
    if (loaded) return true
    if (!isTrackingEnabled() || getConsentStatus() === 'declined') return false
    try {
        installStub()
        const script = document.createElement('script')
        script.async = true
        script.src = 'https://connect.facebook.net/en_US/fbevents.js'
        document.head.appendChild(script)
        window.fbq?.('init', PIXEL_ID)
        loaded = true
        return true
    } catch {
        // Ad blocker or network failure — silently ignore
        return false
    }
}

function metaTrack(kind: Kind, event: string, props?: Props): void {
    if (!isTrackingEnabled()) return
    if (getConsentStatus() === 'declined') return
    if (!loadPixel()) return
    try {
        // Two args when there are no properties, the way Meta's own snippet
        // calls it — fbq treats a trailing undefined as an empty parameter bag.
        if (props) window.fbq?.(kind, event, props)
        else window.fbq?.(kind, event)
    } catch {
        // Silently ignore if blocked
    }
}

/** Only meaningful once fbevents.js is on the page; before that there is
 *  nothing loaded to tell anything to. */
function setConsent(state: 'revoke' | 'grant'): void {
    if (!loaded) return
    if ((state === 'revoke') === revoked) return
    revoked = state === 'revoke'
    try {
        window.fbq?.('consent', state)
    } catch {
        // Silently ignore if blocked
    }
}

export function setupMetaPixelConsentListener(): () => void {
    const apply = (consent = getConsentStatus()) => {
        if (consent === 'declined') setConsent('revoke')
        else if (consent === 'accepted') setConsent('grant')
    }
    // Consent changes in the current tab (custom event from CookieConsent)
    const consentHandler = () => apply()
    window.addEventListener('cookie-consent-changed', consentHandler)
    // Consent changes from other tabs (storage event)
    const storageHandler = (e: StorageEvent) => {
        if (e.key !== 'augo_cookie_consent') return
        if (e.newValue === 'declined') setConsent('revoke')
        else if (e.newValue === 'accepted') setConsent('grant')
    }
    window.addEventListener('storage', storageHandler)
    return () => {
        window.removeEventListener('cookie-consent-changed', consentHandler)
        window.removeEventListener('storage', storageHandler)
    }
}

// ── Events ──
//
// Only the handful of standard events Meta can optimise ad delivery against,
// each carrying just the properties Meta actually reads. Never forward the
// full Mixpanel property bag, and never forward an email address.

export function trackMetaPageView(): void {
    metaTrack('track', 'PageView')
}

/** An email capture anywhere on the site — the site's real conversion. */
export function trackMetaLead(props: { content_name: string }): void {
    metaTrack('track', 'Lead', props)
}

export function trackMetaViewContent(props: { content_name: string }): void {
    metaTrack('track', 'ViewContent', props)
}

export function trackMetaAppStoreClick(props: { store: string }): void {
    metaTrack('trackCustom', 'AppStoreClick', props)
}
