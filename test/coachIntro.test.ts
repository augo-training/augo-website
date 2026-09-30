import { afterEach, describe, expect, it, vi } from 'vitest'

/**
 * confirmIntro turns the Make webhook's answer into the page state. A wrong
 * mapping shows an athlete "done" when nothing was sent, or an error when the
 * coach already has their details, so each response shape is pinned here.
 */

let localHost = false
vi.mock('../src/utils/trackingEnv', () => ({ isLocalHost: () => localHost }))

const { confirmIntro } = await import('../src/utils/coachIntro')

const URL = 'https://hook.eu2.make.com/test'

function respond(status: number, body?: unknown) {
    const fetchMock = vi.fn().mockResolvedValue(
        new Response(body === undefined ? '' : JSON.stringify(body), { status }),
    )
    vi.stubGlobal('fetch', fetchMock)
    return fetchMock
}

afterEach(() => {
    vi.unstubAllGlobals()
    localHost = false
})

describe('confirmIntro', () => {
    it('posts the token form-encoded', async () => {
        const fetchMock = respond(200, { status: 'ok', coach_first_name: 'Marco' })
        await confirmIntro('abc-123', URL)
        const [url, init] = fetchMock.mock.calls[0]
        expect(url).toBe(URL)
        expect(init.headers['Content-Type']).toBe('application/x-www-form-urlencoded')
        expect(init.body).toBe('t=abc-123')
    })

    it('maps a first confirmation', async () => {
        respond(200, { status: 'ok', coach_first_name: 'Marco' })
        expect(await confirmIntro('t', URL)).toEqual({ status: 'ok', coachFirstName: 'Marco' })
    })

    it('maps a repeat click', async () => {
        respond(200, { status: 'already', coach_first_name: 'Marco' })
        expect(await confirmIntro('t', URL)).toEqual({ status: 'already', coachFirstName: 'Marco' })
    })

    it('maps an expired link with the coach to go back to', async () => {
        respond(410, { reason: 'expired', coach_slug: 'marco-altini' })
        expect(await confirmIntro('t', URL)).toEqual({ status: 'expired', coachSlug: 'marco-altini' })
    })

    it('maps an unknown token', async () => {
        respond(404, { reason: 'invalid' })
        expect(await confirmIntro('t', URL)).toEqual({ status: 'invalid' })
    })

    it('treats an unexpected 200 body as an error, never as sent', async () => {
        respond(200, 'Accepted')
        expect(await confirmIntro('t', URL)).toEqual({ status: 'error' })
    })

    it('treats a network failure as an error', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
        expect(await confirmIntro('t', URL)).toEqual({ status: 'error' })
    })

    it('rejects an empty token without calling out', async () => {
        const fetchMock = respond(200, { status: 'ok' })
        expect(await confirmIntro('', URL)).toEqual({ status: 'invalid' })
        expect(fetchMock).not.toHaveBeenCalled()
    })

    it('without a URL, errors in production and stubs on localhost', async () => {
        expect(await confirmIntro('t', '')).toEqual({ status: 'error' })
        localHost = true
        expect(await confirmIntro('expired', '')).toEqual({ status: 'expired', coachSlug: 'marco-altini' })
        expect(await confirmIntro('invalid', '')).toEqual({ status: 'invalid' })
        expect(await confirmIntro('anything', '')).toMatchObject({ status: 'ok' })
    })
})
