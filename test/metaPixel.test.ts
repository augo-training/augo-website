import { afterEach, describe, expect, it, vi } from 'vitest'

/**
 * The vitest environment is `node`, so these tests hand the module the small
 * slice of the DOM it actually touches rather than pulling in jsdom. Assertions
 * read `window.fbq.queue`: Meta's stub parks every call there until the real
 * fbevents.js replaces `callMethod`, which never happens here.
 */

const CONSENT_KEY = 'augo_cookie_consent'
const PIXEL_ID = '1875178980121622'
const PROD_HOST = 'augotraining.com'

let appendedScripts: Record<string, unknown>[]
let listeners: Map<string, Set<(e: unknown) => void>>
let consentStore: Map<string, string>

function installGlobals(consent?: 'accepted' | 'declined', hostname = PROD_HOST): void {
    appendedScripts = []
    listeners = new Map()
    consentStore = new Map()
    if (consent) consentStore.set(CONSENT_KEY, consent)

    vi.stubGlobal('window', {
        location: { hostname },
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
        head: { appendChild: (el: Record<string, unknown>) => { appendedScripts.push(el) } },
    })
    vi.stubGlobal('localStorage', { getItem: (key: string) => consentStore.get(key) ?? null })
}

const setConsent = (v: 'accepted' | 'declined') => consentStore.set(CONSENT_KEY, v)

/** What CookieConsent.tsx dispatches after writing localStorage. */
const fireConsentChanged = () =>
    listeners.get('cookie-consent-changed')?.forEach((h) => h({ type: 'cookie-consent-changed' }))

/** What another tab's answer looks like to this one. */
const fireStorage = (newValue: string | null, key = CONSENT_KEY) =>
    listeners.get('storage')?.forEach((h) => h({ type: 'storage', key, newValue }))

function fbqCalls(): unknown[][] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fbq = (globalThis as any).window?.fbq
    return fbq ? (fbq.queue as unknown[][]) : []
}

async function loadModule() {
    vi.resetModules()
    return import('../src/utils/metaPixel')
}

afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
})

describe('meta pixel consent gate', () => {
    it('tracks while the banner is still unanswered', async () => {
        installGlobals()
        const { trackMetaPageView, trackMetaLead } = await loadModule()

        trackMetaPageView()
        trackMetaLead({ content_name: 'Nice Athletes' })

        expect(appendedScripts).toHaveLength(1)
        expect(appendedScripts[0].src).toBe('https://connect.facebook.net/en_US/fbevents.js')
        expect(fbqCalls()).toEqual([
            ['init', PIXEL_ID],
            ['track', 'PageView'],
            ['track', 'Lead', { content_name: 'Nice Athletes' }],
        ])
    })

    it('tracks when consent is accepted', async () => {
        installGlobals('accepted')
        const { trackMetaViewContent, trackMetaAppStoreClick } = await loadModule()

        trackMetaViewContent({ content_name: 'download' })
        trackMetaAppStoreClick({ store: 'app_store' })

        expect(appendedScripts).toHaveLength(1)
        expect(fbqCalls()).toEqual([
            ['init', PIXEL_ID],
            ['track', 'ViewContent', { content_name: 'download' }],
            ['trackCustom', 'AppStoreClick', { store: 'app_store' }],
        ])
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

    it('stops on a mid-session decline, and revokes so the loaded script stops too', async () => {
        installGlobals()
        const { trackMetaPageView, setupMetaPixelConsentListener } = await loadModule()

        setupMetaPixelConsentListener()
        trackMetaPageView()
        setConsent('declined')
        fireConsentChanged()
        trackMetaPageView()

        expect(fbqCalls()).toEqual([
            ['init', PIXEL_ID],
            ['track', 'PageView'],
            ['consent', 'revoke'],
        ])
    })

    it('grants again if a decline is followed by an accept', async () => {
        installGlobals()
        const { trackMetaPageView, setupMetaPixelConsentListener } = await loadModule()

        setupMetaPixelConsentListener()
        trackMetaPageView()
        setConsent('declined')
        fireConsentChanged()
        setConsent('accepted')
        fireConsentChanged()
        trackMetaPageView()

        expect(fbqCalls()).toEqual([
            ['init', PIXEL_ID],
            ['track', 'PageView'],
            ['consent', 'revoke'],
            ['consent', 'grant'],
            ['track', 'PageView'],
        ])
    })

    it('does not repeat a revoke that is already in force', async () => {
        installGlobals()
        const { trackMetaPageView, setupMetaPixelConsentListener } = await loadModule()

        setupMetaPixelConsentListener()
        trackMetaPageView()
        setConsent('declined')
        fireConsentChanged()
        fireConsentChanged()

        expect(fbqCalls().filter((c) => c[0] === 'consent')).toEqual([['consent', 'revoke']])
    })

    it('revokes when another tab declines, and ignores unrelated storage keys', async () => {
        installGlobals()
        const { trackMetaPageView, setupMetaPixelConsentListener } = await loadModule()

        setupMetaPixelConsentListener()
        trackMetaPageView()
        fireStorage('declined', 'some_other_key')
        expect(fbqCalls().some((c) => c[0] === 'consent')).toBe(false)

        setConsent('declined')
        fireStorage('declined')
        expect(fbqCalls().at(-1)).toEqual(['consent', 'revoke'])
    })

    it('stops listening after teardown', async () => {
        installGlobals()
        const { trackMetaPageView, setupMetaPixelConsentListener } = await loadModule()

        const teardown = setupMetaPixelConsentListener()
        trackMetaPageView()
        teardown()
        setConsent('declined')
        fireConsentChanged()

        expect(fbqCalls().some((c) => c[0] === 'consent')).toBe(false)
    })

    it('never loads from the host the prerenderer and CI use', async () => {
        installGlobals(undefined, '127.0.0.1')
        const { trackMetaPageView, trackMetaLead } = await loadModule()

        trackMetaPageView()
        trackMetaLead({ content_name: 'Nice Athletes' })

        expect(appendedScripts).toHaveLength(0)
        expect(fbqCalls()).toEqual([])
    })

    it('never loads from a LAN address', async () => {
        installGlobals(undefined, '192.168.1.9')
        const { trackMetaPageView } = await loadModule()

        trackMetaPageView()

        expect(appendedScripts).toHaveLength(0)
    })
})
