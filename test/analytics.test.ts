import { beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * These cover the properties a dashboard filters on, which are the ones a
 * refactor can drop silently: the event still fires, the tile just reads zero.
 *
 * `mixpanel-browser` and the two gate modules are mocked so the wrappers run
 * under the `node` environment without a DOM or a real token.
 */

const track = vi.fn()
const register = vi.fn()
const peopleSet = vi.fn()

vi.mock('mixpanel-browser', () => ({
    default: {
        init: vi.fn(),
        register,
        identify: vi.fn(),
        people: { set: peopleSet, set_once: vi.fn() },
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
    register.mockClear()
    peopleSet.mockClear()
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

describe('earnings calculator', () => {
    it('records which input was touched first, and how', async () => {
        const { trackEarningsCalculatorStarted } = await loadModule()
        await trackEarningsCalculatorStarted({ input: 'athletes', method: 'slider' })
        expect(propsFor('earnings_calculator_started')).toEqual({ input: 'athletes', method: 'slider' })
    })

    // Same event and plan as the Pro card's button, so funnel tiles still count
    // it; `placement` is what tells the two buttons apart.
    it('sends its CTA as a Pro click, with the numbers the coach had entered', async () => {
        const { trackPricingCtaClicked } = await loadModule()
        await trackPricingCtaClicked({
            cta_text: 'Start 14-day free trial',
            plan: 'pro',
            placement: 'earnings_calculator',
            price_per_athlete: 150,
            athletes: 10,
            monthly_gain: 615,
            pricing_currency: 'EUR',
            current_tool_cost: 49,
            athletes_with_augo: 15,
            net_income_without_augo: 1451,
            net_income_with_augo: 2115,
        })
        expect(propsFor('pricing_page_cta_clicked')).toEqual({
            cta_text: 'Start 14-day free trial',
            plan: 'pro',
            placement: 'earnings_calculator',
            price_per_athlete: 150,
            athletes: 10,
            monthly_gain: 615,
            pricing_currency: 'EUR',
            current_tool_cost: 49,
            athletes_with_augo: 15,
            net_income_without_augo: 1451,
            net_income_with_augo: 2115,
        })
    })
})

// What coaches enter is the one thing the calculator can teach us that a click
// count cannot, so the properties a report would read are pinned here.
describe('earnings_calculator_updated', () => {
    const SETTLED = {
        price_per_athlete: 150,
        athletes: 15,
        athletes_with_augo: 22,
        net_income_without_augo: 2201,
        net_income_with_augo: 3102,
        monthly_gain: 901,
        pricing_currency: 'CHF',
        current_tool_cost: 49,
        last_input: 'tool_cost' as const,
        last_method: 'typed' as const,
        update_number: 2,
    }

    it('carries the settled values and which input moved last', async () => {
        const { trackEarningsCalculatorUpdated } = await loadModule()
        await trackEarningsCalculatorUpdated(SETTLED)
        expect(propsFor('earnings_calculator_updated')).toEqual(SETTLED)
        const call = track.mock.calls.find(([name]) => name === 'earnings_calculator_updated')
        expect(call?.[2]).toBeUndefined()
    })

    it('goes as a beacon when the page is being left', async () => {
        const { trackEarningsCalculatorUpdated } = await loadModule()
        await trackEarningsCalculatorUpdated(SETTLED, { beacon: true })
        const call = track.mock.calls.find(([name]) => name === 'earnings_calculator_updated')
        expect(call?.[2]).toEqual({ transport: 'sendBeacon' })
    })
})

describe('faq_expanded', () => {
    // `question` is translated, so the same question arrives as three strings;
    // the index is what lets a report add them up.
    it('carries a language-stable index alongside the translated question', async () => {
        const { trackFaqExpanded } = await loadModule()
        await trackFaqExpanded({ question: 'Müssen meine Athlet:innen bezahlen?', page: 'pricing', question_index: 3 })
        expect(propsFor('faq_expanded')).toEqual({
            question: 'Müssen meine Athlet:innen bezahlen?',
            page: 'pricing',
            question_index: 3,
        })
    })
})

describe('page_viewed', () => {
    it('registers the site language so later clicks carry it too', async () => {
        vi.stubGlobal('window', { location: { search: '' } })
        const { trackPageViewed } = await loadModule()
        await trackPageViewed({ page: '/pricing', referrer: '', language: 'de' })
        expect(register).toHaveBeenCalledWith({ language: 'de' })
        expect(propsFor('page_viewed')).toEqual({ page: '/pricing', referrer: '', language: 'de' })
        vi.unstubAllGlobals()
    })
})

describe('cta_clicked', () => {
    it('can go as a beacon for a link that leaves the page in the same tab', async () => {
        const { trackCtaClicked } = await loadModule()
        await trackCtaClicked(
            { cta_text: 'Contact us', cta_location: 'pricing_location_note', destination: '/contact' },
            { beacon: true },
        )
        expect(propsFor('cta_clicked')).toEqual({
            cta_text: 'Contact us',
            cta_location: 'pricing_location_note',
            destination: '/contact',
        })
        const call = track.mock.calls.find(([name]) => name === 'cta_clicked')
        expect(call?.[2]).toEqual({ transport: 'sendBeacon' })
    })

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

// The /merci funnel is read per code: who landed, who got in, how far they
// read, and who then signed up.
describe('merci funnel', () => {
    it('counts a landing before any code is checked', async () => {
        vi.stubGlobal('window', { location: { search: '?utm_source=postcard' } })
        const { trackMerciDoorViewed } = await loadModule()
        await trackMerciDoorViewed({ src: 'email', entry: 'link', code: 'NVE' })
        expect(propsFor('merci_door_viewed')).toEqual({
            src: 'email',
            entry: 'link',
            code: 'NVE',
            utm_source: 'postcard',
        })
        vi.unstubAllGlobals()
    })

    it('keeps the code exactly as typed on a failed attempt, and why it failed', async () => {
        const { trackMerciCodeFailed } = await loadModule()
        await trackMerciCodeFailed({ code: 'nice 42', reason: 'malformed', method: 'typed' })
        expect(propsFor('merci_code_failed')).toEqual({ code: 'nice 42', reason: 'malformed', method: 'typed' })
    })

    it('marks the first keystroke at the door, with how the door was reached', async () => {
        const { trackMerciDoorStarted } = await loadModule()
        await trackMerciDoorStarted({ src: 'postcard', entry: 'blank' })
        expect(propsFor('merci_door_started')).toEqual({ src: 'postcard', entry: 'blank' })
    })

    it('counts a door refused for its email, which never reaches the server', async () => {
        const { trackMerciCodeFailed } = await loadModule()
        await trackMerciCodeFailed({ code: 'NVE', reason: 'email', method: 'link' })
        expect(propsFor('merci_code_failed')).toEqual({ code: 'NVE', reason: 'email', method: 'link' })
    })

    it('records a code check that could not be made', async () => {
        const { trackMerciCodeCheckError } = await loadModule()
        await trackMerciCodeCheckError({ code: 'NVE', method: 'link' })
        expect(propsFor('merci_code_check_error')).toEqual({ code: 'NVE', method: 'link' })
    })

    it('sends the no-code exit as a beacon, since the click leaves the page', async () => {
        const { trackMerciNoCodeClicked } = await loadModule()
        await trackMerciNoCodeClicked({})
        const call = track.mock.calls.find(([name]) => name === 'merci_no_code_clicked')
        expect(call?.[2]).toEqual({ transport: 'sendBeacon' })
    })

    it('says how the gate was opened, and registers the code for the rest of the site', async () => {
        const { trackMerciGateOpened } = await loadModule()
        await trackMerciGateOpened({ code: 'NVE', src: 'email', method: 'link', already_redeemed: false })
        expect(propsFor('merci_gate_opened')).toEqual({
            code: 'NVE',
            src: 'email',
            method: 'link',
            already_redeemed: false,
        })
        expect(register).toHaveBeenCalledWith({ merci_code: 'NVE', merci_src: 'email' })
    })

    it('carries the beat, its name and whether it is a first view', async () => {
        const { trackMerciBeatViewed } = await loadModule()
        const props = {
            code: 'NVE',
            src: 'postcard' as const,
            beat: 4,
            beat_name: 'offer',
            first_view: true,
            seconds_on_previous: 12,
        }
        await trackMerciBeatViewed(props)
        expect(propsFor('merci_beat_viewed')).toEqual(props)
    })

    it('marks the errors shown on the ticket', async () => {
        const { trackMerciOfferError } = await loadModule()
        await trackMerciOfferError({ code: 'NVE', error: 'submit' })
        expect(propsFor('merci_offer_error')).toEqual({ code: 'NVE', error: 'submit' })
    })

    it('beacons an outbound link click, since the tab may be left behind', async () => {
        const { trackMerciLinkClicked } = await loadModule()
        await trackMerciLinkClicked({ code: 'NVE', link: 'instagram' })
        expect(propsFor('merci_link_clicked')).toEqual({ code: 'NVE', link: 'instagram' })
        const call = track.mock.calls.find(([name]) => name === 'merci_link_clicked')
        expect(call?.[2]).toEqual({ transport: 'sendBeacon' })
    })

    it('records the tap on the ticket before the redeem call answers', async () => {
        const { trackMerciOfferClicked } = await loadModule()
        await trackMerciOfferClicked({ code: 'NVE', src: 'email', placement: 'closing' })
        expect(propsFor('merci_offer_clicked')).toEqual({ code: 'NVE', src: 'email', placement: 'closing' })
    })

    it('ties the signup to the code and the email', async () => {
        const { trackMerciOfferRedeemed } = await loadModule()
        await trackMerciOfferRedeemed({ code: 'NVE', email: 'coach@example.com', src: 'postcard' })
        expect(propsFor('merci_offer_redeemed')).toEqual({
            code: 'NVE',
            email: 'coach@example.com',
            src: 'postcard',
        })
    })

    it('puts the code on the profile of the coach who signed up', async () => {
        vi.stubGlobal('window', { location: { search: '' } })
        const { identifyEmailCapture } = await loadModule()
        await identifyEmailCapture({
            email: 'Coach@Example.com',
            source: 'Merci Worlds 2026',
            page: '/merci',
            merci_code: 'NVE',
        })
        expect(peopleSet).toHaveBeenCalledWith(expect.objectContaining({ merci_code: 'NVE' }))
        vi.unstubAllGlobals()
    })
})
