import { afterEach, describe, expect, it, vi } from 'vitest'

/**
 * The vitest environment is `node`, so these tests hand the module the small
 * slice of the DOM it actually touches rather than pulling in jsdom. Assertions
 * read `window.fbq.queue`: Meta's stub parks every call there until the real
 * fbevents.js replaces `callMethod`, which never happens here.
 */

const CONSENT_KEY = 'augo_cookie_consent'
const PIXEL_ID = '1875178980121622'

let appendedScripts: Record<string, unknown>[]
let listeners: Map<string, Set<(e: unknown) => void>>
let consentStore: Map<string, string>

function installGlobals(consent?: 'accepted' | 'declined'): void {
    appendedScripts = []
    listeners = new Map()
    consentStore = new Map()
    if (consent) consentStore.set(CONSENT_KEY, consent)

    vi.stubGlobal('window', {
        addEventListener(type: string, handler: (e: unknown) => void) {
            if (!listeners.has(type)) listeners.set(type, new Set())
            listeners.get(type)!.add(handler)
        },
        removeEventListener(type: string, handler: (e: unknown) => void) {
            listeners.get(type)?.delete(handler)
        },
    })
    vi.stubGlobal('document', {
        createElement: () => ({}) as Record<string, unknown>,
        head: {
            appendChild: (el: Record<string, unknown>) => {
                appendedScripts.push(el)
            },
        },
    })
    vi.stubGlobal('localStorage', {
        getItem: (key: string) => consentStore.get(key) ?? null,
    })
}

function setConsent(value: 'accepted' | 'declined'): void {
    consentStore.set(CONSENT_KEY, value)
}

/** What CookieConsent.tsx dispatches after writing localStorage. */
function fireConsentChanged(): void {
    listeners.get('cookie-consent-changed')?.forEach((h) => h({ type: 'cookie-consent-changed' }))
}

/** What another tab's accept looks like to this one. */
function fireStorage(newValue: string | null, key = CONSENT_KEY): void {
    listeners.get('storage')?.forEach((h) => h({ type: 'storage', key, newValue }))
}

function fbqCalls(): unknown[][] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fbq = (globalThis as any).window?.fbq
    return fbq ? (fbq.queue as unknown[][]) : []
}

async function loadModule(debug = true) {
    vi.resetModules()
    if (debug) vi.stubEnv('VITE_META_PIXEL_DEBUG', '1')
    return import('../src/utils/metaPixel')
}

afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
})

describe('meta pixel consent gate', () => {
    it('stays off in dev unless VITE_META_PIXEL_DEBUG=1', async () => {
        installGlobals('accepted')
        const { trackMetaPageView } = await loadModule(false)

        trackMetaPageView()

        expect(appendedScripts).toHaveLength(0)
        expect(fbqCalls()).toEqual([])
    })

    it('sends nothing and loads nothing when consent is declined', async () => {
        installGlobals('declined')
        const { trackMetaPageView, trackMetaLead, setupMetaPixelConsentListener } = await loadModule()

        setupMetaPixelConsentListener()
        trackMetaPageView()
        trackMetaLead({ content_name: 'Nice Athletes' })

        expect(appendedScripts).toHaveLength(0)
        expect(fbqCalls()).toEqual([])
    })

    it('loads nothing while the banner is unanswered', async () => {
        installGlobals()
        const { trackMetaPageView, setupMetaPixelConsentListener } = await loadModule()

        setupMetaPixelConsentListener()
        trackMetaPageView()

        expect(appendedScripts).toHaveLength(0)
        expect(fbqCalls()).toEqual([])
    })

    it('replays the queue in order once consent is accepted', async () => {
        installGlobals()
        const { trackMetaPageView, trackMetaLead, setupMetaPixelConsentListener } = await loadModule()

        setupMetaPixelConsentListener()
        trackMetaPageView()
        trackMetaLead({ content_name: 'Nice Athletes' })

        setConsent('accepted')
        fireConsentChanged()

        expect(appendedScripts).toHaveLength(1)
        expect(appendedScripts[0].src).toBe('https://connect.facebook.net/en_US/fbevents.js')
        expect(fbqCalls()).toEqual([
            ['init', PIXEL_ID],
            ['track', 'PageView'],
            ['track', 'Lead', { content_name: 'Nice Athletes' }],
        ])
    })

    it('drops the queue on decline and never replays it', async () => {
        installGlobals()
        const { trackMetaPageView, setupMetaPixelConsentListener } = await loadModule()

        setupMetaPixelConsentListener()
        trackMetaPageView()

        setConsent('declined')
        fireConsentChanged()
        setConsent('accepted')
        fireConsentChanged()

        expect(fbqCalls()).toEqual([['init', PIXEL_ID]])
    })

    it('caps the pre-consent queue, keeping the most recent events', async () => {
        installGlobals()
        const { trackMetaLead, setupMetaPixelConsentListener } = await loadModule()

        setupMetaPixelConsentListener()
        for (let i = 0; i < 25; i++) trackMetaLead({ content_name: `cta-${i}` })

        setConsent('accepted')
        fireConsentChanged()

        const events = fbqCalls().slice(1)
        expect(events).toHaveLength(20)
        expect(events[0][2]).toEqual({ content_name: 'cta-5' })
        expect(events[19][2]).toEqual({ content_name: 'cta-24' })
    })

    it('loads the script once across many events', async () => {
        installGlobals('accepted')
        const { trackMetaPageView, trackMetaViewContent, trackMetaAppStoreClick } = await loadModule()

        trackMetaPageView()
        trackMetaViewContent({ content_name: 'download' })
        trackMetaAppStoreClick({ store: 'app_store' })
        trackMetaPageView()

        expect(appendedScripts).toHaveLength(1)
        expect(fbqCalls()).toEqual([
            ['init', PIXEL_ID],
            ['track', 'PageView'],
            ['track', 'ViewContent', { content_name: 'download' }],
            ['trackCustom', 'AppStoreClick', { store: 'app_store' }],
            ['track', 'PageView'],
        ])
    })

    it('flushes when another tab accepts, and ignores unrelated storage keys', async () => {
        installGlobals()
        const { trackMetaPageView, setupMetaPixelConsentListener } = await loadModule()

        setupMetaPixelConsentListener()
        trackMetaPageView()

        fireStorage('accepted', 'some_other_key')
        expect(appendedScripts).toHaveLength(0)

        setConsent('accepted')
        fireStorage('accepted')
        expect(fbqCalls()).toEqual([
            ['init', PIXEL_ID],
            ['track', 'PageView'],
        ])
    })

    it('stops listening after teardown', async () => {
        installGlobals()
        const { trackMetaPageView, setupMetaPixelConsentListener } = await loadModule()

        const teardown = setupMetaPixelConsentListener()
        trackMetaPageView()
        teardown()

        setConsent('accepted')
        fireConsentChanged()

        expect(appendedScripts).toHaveLength(0)
        expect(fbqCalls()).toEqual([])
    })
})
