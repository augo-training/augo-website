import { getConsentStatus } from '../components/cookieUtils'

/**
 * Meta Pixel for the website.
 *
 * Consent: the pixel script is not requested at all until the visitor accepts
 * the cookie banner — not even with `fbq('consent', 'revoke')`, which is what
 * Meta documents but which still hands Meta an IP and user agent on every page
 * load. Events fired before the banner is answered (the landing PageView in
 * particular) are held in a small in-memory queue and replayed on accept; a
 * decline empties it. Same shape as the Mixpanel wrapper in `analytics.ts`.
 *
 * Deliberately NOT in `index.html`: the build prerenders every route through
 * Puppeteer (`scripts/prerender.ts`), and CI builds on every PR, so a base
 * snippet in the shared <head> would fire a few hundred PageViews from the
 * build machine each time. Loading it from here means the consent gate keeps
 * the prerenderer out — Puppeteer starts with empty localStorage, so consent
 * reads as 'pending' and nothing is ever appended to the document.
 *
 * The pixel id is public by design (it ships in the page source of every site
 * that uses one), so it lives here rather than in an env var, like the
 * Typeform ids and store URLs elsewhere in the codebase.
 */

const PIXEL_ID = '1875178980121622'
const MAX_QUEUE = 20

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Fbq = (...args: any[]) => void

declare global {
    interface Window {
        fbq?: Fbq
        _fbq?: Fbq
    }
}

type Props = Record<string, string | number>

interface QueuedEvent {
    kind: 'track' | 'trackCustom'
    event: string
    props?: Props
}

const queue: QueuedEvent[] = []
let loaded = false

function isEnabled(): boolean {
    if (typeof window === 'undefined') return false
    // In `vite dev` nothing is sent unless VITE_META_PIXEL_DEBUG=1, so local
    // work does not pollute the ad account.
    if (import.meta.env.DEV && import.meta.env.VITE_META_PIXEL_DEBUG !== '1') return false
    return true
}

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
    if (!isEnabled() || getConsentStatus() !== 'accepted') return false
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

function send(item: QueuedEvent): void {
    try {
        // Two args when there are no properties, the way Meta's own snippet
        // calls it — fbq treats a trailing undefined as an empty parameter bag.
        if (item.props) window.fbq?.(item.kind, item.event, item.props)
        else window.fbq?.(item.kind, item.event)
    } catch {
        // Silently ignore if blocked
    }
}

function metaTrack(kind: QueuedEvent['kind'], event: string, props?: Props): void {
    if (!isEnabled()) return
    const consent = getConsentStatus()
    if (consent === 'declined') return
    if (consent === 'pending') {
        queue.push({ kind, event, props })
        if (queue.length > MAX_QUEUE) queue.shift()
        return
    }
    if (!loadPixel()) return
    send({ kind, event, props })
}

/** Sends whatever was held while the banner was unanswered. */
function flush(): void {
    if (!loadPixel()) return
    for (const item of queue.splice(0)) send(item)
}

function discardQueue(): void {
    queue.length = 0
}

export function setupMetaPixelConsentListener(): () => void {
    flush()
    // Consent changes in the current tab (custom event from CookieConsent)
    const consentHandler = () => {
        const consent = getConsentStatus()
        if (consent === 'accepted') flush()
        else if (consent === 'declined') discardQueue()
    }
    window.addEventListener('cookie-consent-changed', consentHandler)
    // Consent changes from other tabs (storage event)
    const storageHandler = (e: StorageEvent) => {
        if (e.key !== 'augo_cookie_consent') return
        if (e.newValue === 'accepted') flush()
        else if (e.newValue === 'declined') discardQueue()
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
