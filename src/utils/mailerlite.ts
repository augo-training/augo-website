import { trackEmailCaptureFailed } from './analytics'

interface SubscribeArgs {
    email: string
    groupId?: string
    fields?: Record<string, string | number | null>
    /** Used only for analytics if the call fails. */
    ctaText?: string
}

/**
 * POST a subscriber to MailerLite. Best-effort:
 * - swallows network errors and reports them to analytics
 * - no-ops if VITE_MAILERLITE_API_KEY is not set (useful for local dev)
 *
 * Returns true if MailerLite returned 2xx, false otherwise. The caller usually
 * doesn't need the result — analytics + console capture the failure mode.
 */
export async function subscribeToMailerLite({
    email,
    groupId,
    fields,
    ctaText = 'unknown',
}: SubscribeArgs): Promise<boolean> {
    const apiKey = import.meta.env.VITE_MAILERLITE_API_KEY
    const effectiveGroupId = groupId ?? import.meta.env.VITE_MAILERLITE_GROUP_ID
    if (!apiKey) return false

    const body: Record<string, unknown> = { email }
    if (effectiveGroupId) body.groups = [effectiveGroupId]
    if (fields && Object.keys(fields).length > 0) body.fields = fields

    try {
        const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify(body),
        })
        if (!response.ok) {
            const responseText = await response.text().catch(() => '')
            console.warn('[mailerlite] non-OK response', {
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
        console.warn('[mailerlite] network error', err)
        void trackEmailCaptureFailed({
            cta_text: ctaText,
            status: 'network_error',
            error: err instanceof Error ? err.message : String(err),
        })
        return false
    }
}
