import { createContext, useContext } from 'react'

export interface EmailCaptureModalOptions {
    /** Called after a successful submit instead of redirecting to the download page. */
    onSuccess?: () => void
    /** Where to send them after a successful submit. Defaults to the sign-up page. */
    destinationUrl?: string
    subtitle?: string
    submitLabel?: string
}

export interface EmailCaptureContextValue {
    openModal: (ctaText: string, options?: EmailCaptureModalOptions) => void
    closeModal: () => void
}

export const EmailCaptureContext = createContext<EmailCaptureContextValue | null>(null)

export function useEmailCapture(): EmailCaptureContextValue {
    const ctx = useContext(EmailCaptureContext)
    if (!ctx) {
        throw new Error('useEmailCapture must be used inside <EmailCaptureProvider>')
    }
    return ctx
}
