import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * The signup webhook's payload shape. Make maps it key by key, so a field in
 * the wrong place is silently dropped (that is how first names were lost for
 * two weeks in August 2026). The athlete's note to a coach must stay at the
 * top level: anything inside `fields` is written to MailerLite.
 */

vi.mock('../src/utils/analytics', () => ({ trackEmailCaptureFailed: vi.fn() }))

const { subscribeToMailerLite } = await import('../src/utils/mailerlite')

let fetchMock: ReturnType<typeof vi.fn>

beforeEach(() => {
    vi.stubEnv('VITE_SIGNUP_WEBHOOK_URL', 'https://hook.eu2.make.com/test')
    fetchMock = vi.fn().mockResolvedValue(new Response('Accepted', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
})

function sentBody(): Record<string, unknown> {
    return JSON.parse(fetchMock.mock.calls[0][1].body as string)
}

describe('subscribeToMailerLite payload', () => {
    it('sends the note at the top level, never inside fields', async () => {
        await subscribeToMailerLite({
            email: 'a@b.co',
            name: 'Ana',
            note: 'Training for my first marathon.',
            groupId: '185983036539537333',
            fields: { coach_name: 'Marco Altini', coach_slug: 'marco-altini' },
        })
        const body = sentBody()
        expect(body).toMatchObject({ email: 'a@b.co', name: 'Ana', note: 'Training for my first marathon.' })
        expect(body.fields).toEqual({ coach_name: 'Marco Altini', coach_slug: 'marco-altini' })
    })

    it('leaves note out when there is none', async () => {
        await subscribeToMailerLite({ email: 'a@b.co', name: 'Ana', groupId: '1' })
        expect(sentBody()).not.toHaveProperty('note')
    })

    it('does nothing without a webhook URL', async () => {
        vi.stubEnv('VITE_SIGNUP_WEBHOOK_URL', '')
        expect(await subscribeToMailerLite({ email: 'a@b.co' })).toBe(false)
        expect(fetchMock).not.toHaveBeenCalled()
    })
})
