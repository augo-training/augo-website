import { beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * These cover the properties a dashboard filters on, which are the ones a
 * refactor can drop silently: the event still fires, the tile just reads zero.
 *
 * `mixpanel-browser` and the two gate modules are mocked so the wrappers run
 * under the `node` environment without a DOM or a real token.
 */

const track = vi.fn()

vi.mock('mixpanel-browser', () => ({
    default: {
        init: vi.fn(),
        register: vi.fn(),
        identify: vi.fn(),
        people: { set: vi.fn(), set_once: vi.fn() },
        track,
    },
}))
vi.mock('../src/utils/trackingEnv', () => ({
    isLocalHost: () => false,
    isTrackingEnabled: () => true,
}))
vi.mock('../src/components/cookieUtils', () => ({
    getConsentStatus: () => 'accepted' as const,
}))
// The Meta fan-out has its own consent gate and its own test file.
vi.mock('../src/utils/metaPixel', () => ({
    trackMetaPageView: vi.fn(),
    trackMetaLead: vi.fn(),
    trackMetaViewContent: vi.fn(),
    trackMetaAppStoreClick: vi.fn(),
}))

/** Properties of the single call to `event`. */
function propsFor(event: string): Record<string, unknown> {
    const call = track.mock.calls.find(([name]) => name === event)
    expect(call, `no ${event} event was tracked`).toBeDefined()
    return call![1] as Record<string, unknown>
}

async function loadModule() {
    vi.resetModules()
    return import('../src/utils/analytics')
}

beforeEach(() => {
    track.mockClear()
    vi.stubEnv('VITE_MIXPANEL_TOKEN', 'a'.repeat(32))
})

describe('app_store_clicked', () => {
    it('says which /download card the badge was clicked in', async () => {
        const { trackAppStoreClicked } = await loadModule()
        await trackAppStoreClicked({ store: 'app_store', visitor_type: 'coach' })
        expect(propsFor('app_store_clicked')).toEqual({ store: 'app_store', visitor_type: 'coach' })
    })

    it('carries the athlete card through too', async () => {
        const { trackAppStoreClicked } = await loadModule()
        await trackAppStoreClicked({ store: 'google_play', visitor_type: 'athlete' })
        expect(propsFor('app_store_clicked')).toEqual({ store: 'google_play', visitor_type: 'athlete' })
    })
})

describe('pricing_page_cta_clicked', () => {
    // cta_text is localized, so `plan` is the only value that identifies the
    // button the same way on /en, /de and /pt.
    it('carries a language-stable plan id alongside the localized label', async () => {
        const { trackPricingCtaClicked } = await loadModule()
        await trackPricingCtaClicked({ cta_text: 'Loslegen', billing_period: 'monthly', plan: 'unlimited' })
        expect(propsFor('pricing_page_cta_clicked')).toEqual({
            cta_text: 'Loslegen',
            billing_period: 'monthly',
            plan: 'unlimited',
        })
    })
})

describe('cta_clicked', () => {
    it('records the /download sign-up handoff to the web app', async () => {
        const { trackCtaClicked } = await loadModule()
        await trackCtaClicked({
            cta_text: 'Sign up',
            cta_location: 'download_coach_card',
            destination: 'https://webapp.augotraining.com',
        })
        expect(propsFor('cta_clicked')).toEqual({
            cta_text: 'Sign up',
            cta_location: 'download_coach_card',
            destination: 'https://webapp.augotraining.com',
        })
    })
})
