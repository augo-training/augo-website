import { useCallback, useMemo, useState, type ReactNode } from 'react'
import EmailCaptureModal from '../components/EmailCaptureModal'
import {
    EmailCaptureContext,
    type EmailCaptureContextValue,
    type EmailCaptureModalOptions,
} from './EmailCaptureContext'

interface EmailCaptureProviderProps {
    lang: string
    children: ReactNode
}

export function EmailCaptureProvider({ lang, children }: EmailCaptureProviderProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [ctaText, setCtaText] = useState('')
    const [options, setOptions] = useState<EmailCaptureModalOptions | null>(null)

    const openModal = useCallback((label: string, opts?: EmailCaptureModalOptions) => {
        setCtaText(label)
        setOptions(opts ?? null)
        setIsOpen(true)
    }, [])

    const closeModal = useCallback(() => {
        setIsOpen(false)
    }, [])

    const value = useMemo<EmailCaptureContextValue>(
        () => ({ openModal, closeModal }),
        [openModal, closeModal],
    )

    return (
        <EmailCaptureContext.Provider value={value}>
            {children}
            <EmailCaptureModal
                isOpen={isOpen}
                onClose={closeModal}
                destinationUrl={options?.onSuccess ? undefined : `/${lang}/download`}
                ctaText={ctaText}
                onSuccess={options?.onSuccess}
                subtitle={options?.subtitle}
                submitLabel={options?.submitLabel}
            />
        </EmailCaptureContext.Provider>
    )
}
