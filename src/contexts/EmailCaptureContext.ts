import { createContext, useContext } from 'react'

export interface EmailCaptureContextValue {
    openModal: (ctaText: string) => void
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
