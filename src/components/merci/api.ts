import { isLocalHost } from '../../utils/trackingEnv'
import { isWellFormed, type MerciSrc } from './code'
import { MERCI_CODE_WEBHOOK_URL, MERCI_REDEEM_WEBHOOK_URL } from './constants'

export interface CodeStatus {
    valid: boolean
    redeemed: boolean
}

export type RedeemResult = 'ok' | 'redeemed' | 'error'

interface RedeemArgs {
    code: string
    firstName: string
    email: string
    src: MerciSrc
}

/**
 * The page's two server calls. The site is static on GitHub Pages, so both are
 * Make custom webhooks rather than /api routes.
 *
 *   code check:  POST { code }                         -> 200 { valid, redeemed }
 *   redeem:      POST { code, firstName, email, src }  -> 200 { ok: true }
 *                                                       | 409 { reason: 'redeemed' }
 *
 * Unlike the signup webhook, the page reads these responses, so both Make
 * webhook responses must send Access-Control-Allow-Origin for augotraining.com.
 * Without it the fetch succeeds in Make and fails here.
 *
 * Stub: with a URL unset, and only on localhost, a handful of real codes from
 * the sheet are on the list and ZZZ counts as already redeemed. Anywhere else
 * an unset URL is an error, never a pass: a door that opened for anyone would
 * give the offer away.
 */

const STUB_CODES = new Set(['NVE', 'MLI', 'GUZ', 'UJB', 'QNK', 'ZZZ'])
const stubRedeemed = new Set(['ZZZ'])

function stubbed(url: string | undefined): boolean {
    return !url && isLocalHost()
}

const pause = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

/**
 * Form-encoded, not JSON, and deliberately so.
 *
 * The page reads these responses, so they are cross-origin reads, not the
 * fire-and-forget POST the signup webhook does. A JSON content type would make
 * the browser send an OPTIONS preflight first, and Make's webhooks answer
 * OPTIONS with the scenario, not with CORS headers, so the request would fail
 * before the scenario ever ran. A form content type is one the browser sends
 * without asking, and Make parses form bodies into fields natively.
 *
 * The response still has to carry Access-Control-Allow-Origin for the page to
 * read it. That is set on the Webhook response module in each scenario.
 */
function post(url: string, body: Record<string, string>): Promise<Response> {
    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(body).toString(),
    })
}

export async function checkCode(code: string): Promise<CodeStatus | 'error'> {
    if (!isWellFormed(code)) return { valid: false, redeemed: false }

    if (stubbed(MERCI_CODE_WEBHOOK_URL)) {
        await pause(400)
        return { valid: STUB_CODES.has(code), redeemed: stubRedeemed.has(code) }
    }
    if (!MERCI_CODE_WEBHOOK_URL) return 'error'

    try {
        const response = await post(MERCI_CODE_WEBHOOK_URL, { code })
        if (!response.ok) return 'error'
        const data = (await response.json()) as Partial<CodeStatus>
        return { valid: data.valid === true, redeemed: data.redeemed === true }
    } catch {
        return 'error'
    }
}

export async function redeemOffer(args: RedeemArgs): Promise<RedeemResult> {
    if (stubbed(MERCI_REDEEM_WEBHOOK_URL)) {
        await pause(600)
        if (stubRedeemed.has(args.code)) return 'redeemed'
        stubRedeemed.add(args.code)
        return 'ok'
    }
    if (!MERCI_REDEEM_WEBHOOK_URL) return 'error'

    try {
        const response = await post(MERCI_REDEEM_WEBHOOK_URL, {
            code: args.code,
            firstName: args.firstName,
            email: args.email,
            src: args.src,
        })
        if (response.status === 409) return 'redeemed'
        return response.ok ? 'ok' : 'error'
    } catch {
        return 'error'
    }
}
