import { isLocalHost } from '../../utils/trackingEnv'
import {
    MANIFESTO_LIST_WEBHOOK_URL,
    MANIFESTO_SIGN_WEBHOOK_URL,
    type Signature,
    type SignerRole,
} from './constants'

/**
 * The page's two server calls, both Make custom webhooks on one data store
 * ("Manifesto signatures": name, email, role, signed_at, approved).
 *
 *   list:  GET                          -> 200 { signatures: [{ name, role, signed_at }] }
 *   sign:  POST { name, email, role, signed_at, marketing }   -> 200 { ok: true }
 *
 * The list scenario returns approved records only, and never the email. A new
 * signature is stored with approved = false and posted to Slack; someone flips
 * it to true in the data store, and from then on everyone sees it. Until then
 * only the signer does, from localStorage (see MANIFESTO_SIGNATURE_STORAGE_KEY).
 * `signed_at` is the signer's own date, sent rather than stamped by Make, so the
 * approved copy matches the saved one even when Make's UTC day is different.
 * `marketing` is 'yes' or 'no', from the opt-in box, unticked by default. The
 * sign scenario adds the email to MailerLite only on 'yes'; on 'no' the email
 * stays in the data store and nowhere else.
 *
 * The page reads both responses, so both Webhook response modules must send
 * Access-Control-Allow-Origin for augotraining.com, and the sign call posts
 * form-encoded rather than JSON to avoid a preflight Make cannot answer. The
 * same setup as components/merci/api.ts, which explains it in full.
 *
 * Stub: with a URL unset, and only on localhost, the list returns a few made
 * up names (or `?fake=300` of them, to see a crowded sheet) and signing always
 * works. Anywhere else an unset URL is an error.
 */

export interface SignArgs {
    name: string
    email: string
    role: SignerRole
    signedAt: string
    /** Ticked the marketing emails box. */
    marketing: boolean
}

const STUB_NAMES = [
    'Laura Meier',
    'Tony Fischer',
    'Alex Brunner',
    'Thomas Keller',
    'Anja Weber',
    'Mathias Huber',
    'Monika Schmid',
    'Joel Graf',
    'Andrin Frei',
    'Julian Moser',
]

function stubbed(url: string | undefined): boolean {
    return !url && isLocalHost()
}

const pause = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

function stubSignatures(): Signature[] {
    const fake = Number(new URLSearchParams(window.location.search).get('fake'))
    const count = Number.isFinite(fake) && fake > 0 ? Math.min(fake, 2000) : STUB_NAMES.length
    const start = Date.UTC(2026, 3, 1)
    return Array.from({ length: count }, (_, i) => ({
        name: i < STUB_NAMES.length ? STUB_NAMES[i] : `${STUB_NAMES[i % STUB_NAMES.length].split(' ')[0]} ${i}`,
        role: i % 3 === 0 ? 'athlete' : 'coach',
        signedAt: new Date(start + i * 86_400_000 * 0.6).toISOString().slice(0, 10),
    }))
}

function parseSignature(value: unknown): Signature | null {
    if (!value || typeof value !== 'object') return null
    const record = value as Record<string, unknown>
    const name = typeof record.name === 'string' ? record.name.trim() : ''
    const signedAt = typeof record.signed_at === 'string' ? record.signed_at : ''
    if (!name || !signedAt) return null
    const role = record.role === 'coach' || record.role === 'athlete' ? record.role : undefined
    return { name, role, signedAt: signedAt.slice(0, 10) }
}

/** The approved signatures, or 'error'. The page still shows the founding names on an error. */
export async function fetchSignatures(): Promise<Signature[] | 'error'> {
    if (stubbed(MANIFESTO_LIST_WEBHOOK_URL)) {
        await pause(300)
        return stubSignatures()
    }
    if (!MANIFESTO_LIST_WEBHOOK_URL) return 'error'

    try {
        const response = await fetch(MANIFESTO_LIST_WEBHOOK_URL)
        if (!response.ok) return 'error'
        const data = (await response.json()) as { signatures?: unknown }
        if (!Array.isArray(data.signatures)) return 'error'
        return data.signatures.map(parseSignature).filter((s): s is Signature => s !== null)
    } catch {
        return 'error'
    }
}

export async function signManifesto(args: SignArgs): Promise<'ok' | 'error'> {
    if (stubbed(MANIFESTO_SIGN_WEBHOOK_URL)) {
        await pause(700)
        return 'ok'
    }
    if (!MANIFESTO_SIGN_WEBHOOK_URL) return 'error'

    try {
        const response = await fetch(MANIFESTO_SIGN_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                name: args.name,
                email: args.email.trim(),
                role: args.role,
                signed_at: args.signedAt,
                marketing: args.marketing ? 'yes' : 'no',
            }).toString(),
        })
        return response.ok ? 'ok' : 'error'
    } catch {
        return 'error'
    }
}
