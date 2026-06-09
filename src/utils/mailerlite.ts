import { trackEmailCaptureFailed } from './analytics'

interface SubscribeArgs {
    email: string
    groupId?: string
    fields?: Record<string, string | number | null>
    /** Used only for analytics if the call fails. */
    ctaText?: string
}

/**
 * Forward a signup to MailerLite via the Make webhook proxy. Best-effort:
 * - swallows network errors and reports them to analytics
 * - no-ops if VITE_SIGNUP_WEBHOOK_URL is not set (useful for local dev)
 *
 * The webhook is a Make custom webhook that writes the subscriber to MailerLite
 * server-side, so no MailerLite API key is ever shipped to the browser. The
 * endpoint is write-only — it can create/update a subscriber but cannot read or
 * list anyone — so it is safe to expose in client code.
 *
 * Payload contract (see the "Website signup → MailerLite" Make scenario):
 *   { email: string, groupId?: string, fields?: Record<string, ...> }
 *
 * Returns true if the webhook accepted the request (2xx), false otherwise. The
 * caller usually doesn't need the result — analytics + console capture failures.
 */
export async function subscribeToMailerLite({
    email,
    groupId,
    fields,
    ctaText = 'unknown',
}: SubscribeArgs): Promise<boolean> {
    const webhookUrl = import.meta.env.VITE_SIGNUP_WEBHOOK_URL
    const effectiveGroupId = groupId ?? import.meta.env.VITE_MAILERLITE_GROUP_ID
    if (!webhookUrl) return false

    const body: Record<string, unknown> = { email }
    if (effectiveGroupId) body.groupId = effectiveGroupId
    if (fields && Object.keys(fields).length > 0) body.fields = fields

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(body),
        })
        if (!response.ok) {
            const responseText = await response.text().catch(() => '')
            console.warn('[signup] non-OK response', {
                status: response.status,
                body: responseText,
                groupId: effectiveGroupId,
            })
            void trackEmailCaptureFailed({
                cta_text: ctaText,
                status: response.status,
                error: responseText.slice(0, 200),
            })
            return false
        }
        return true
    } catch (err) {
        console.warn('[signup] network error', err)
        void trackEmailCaptureFailed({
            cta_text: ctaText,
            status: 'network_error',
            error: err instanceof Error ? err.message : String(err),
        })
        return false
    }
}
