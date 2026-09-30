import { isLocalHost } from './trackingEnv'

/**
 * The second half of the "Work with {coach}" flow.
 *
 * Asking for an intro on a coach profile sends only the athlete's name and
 * email to the signup webhook. Make stores the request under a random token
 * and emails the athlete a link to /:lang/confirm-intro?t=<token>. Nothing
 * reaches the coach, and nothing is written to MailerLite, until that link is
 * confirmed here. That way nobody can make augo email a coach from an
 * address they don't own, and the athlete never sees the coach's address:
 * the coach gets the athlete's details and replies to them.
 *
 *   POST { t }  -> 200 { status: 'ok' | 'already', coach_first_name }
 *              | 410 { reason: 'expired', coach_slug }
 *              | 404 { reason: 'invalid' }
 *
 * Form-encoded for the same reason as the /merci calls (see
 * src/components/merci/api.ts): the page reads the response, and a JSON
 * content type would trigger a preflight Make can't answer.
 *
 * Stub: with the URL unset, and only on localhost, any token confirms, except
 * `expired` and `invalid`, which reach those states. Anywhere else an unset
 * URL is an error.
 */

export type ConfirmResult =
    | { status: 'ok' | 'already'; coachFirstName: string }
    | { status: 'expired'; coachSlug: string }
    | { status: 'invalid' | 'error' }

const WEBHOOK_URL = import.meta.env.VITE_COACH_INTRO_CONFIRM_WEBHOOK_URL as string | undefined

const pause = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

async function stub(token: string): Promise<ConfirmResult> {
    await pause(500)
    if (token === 'expired') return { status: 'expired', coachSlug: 'marco-altini' }
    if (token === 'invalid') return { status: 'invalid' }
    return { status: 'ok', coachFirstName: 'Marco' }
}

export async function confirmIntro(token: string, url = WEBHOOK_URL): Promise<ConfirmResult> {
    if (!token) return { status: 'invalid' }
    if (!url) return isLocalHost() ? stub(token) : { status: 'error' }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ t: token }).toString(),
        })
        if (response.status === 404) return { status: 'invalid' }
        const data = (await response.json().catch(() => ({}))) as Record<string, unknown>
        if (response.status === 410) {
            return { status: 'expired', coachSlug: typeof data.coach_slug === 'string' ? data.coach_slug : '' }
        }
        if (!response.ok) return { status: 'error' }
        const status = data.status === 'already' ? 'already' : data.status === 'ok' ? 'ok' : null
        if (!status) return { status: 'error' }
        return {
            status,
            coachFirstName: typeof data.coach_first_name === 'string' ? data.coach_first_name : '',
        }
    } catch {
        return { status: 'error' }
    }
}
