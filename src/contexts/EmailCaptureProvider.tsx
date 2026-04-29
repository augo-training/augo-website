import { useCallback, useMemo, useState, type ReactNode } from 'react'
import EmailCaptureModal from '../components/EmailCaptureModal'
import { EmailCaptureContext, type EmailCaptureContextValue } from './EmailCaptureContext'

interface EmailCaptureProviderProps {
    lang: string
    children: ReactNode
}

export function EmailCaptureProvider({ lang, children }: EmailCaptureProviderProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [ctaText, setCtaText] = useState('')

    const openModal = useCallback((label: string) => {
        setCtaText(label)
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
                key={String(isOpen)}
                isOpen={isOpen}
                onClose={closeModal}
                destinationUrl={`/${lang}/download`}
                ctaText={ctaText}
            />
        </EmailCaptureContext.Provider>
    )
}
