import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { trackEmailCaptureSubmitted } from '../utils/analytics'
import { subscribeToMailerLite } from '../utils/mailerlite'

interface EmailCaptureModalProps {
    isOpen: boolean
    onClose: () => void
    destinationUrl?: string
    ctaText: string
    groupId?: string
    /** Extra MailerLite custom fields to store with the subscriber (keyed by field key). */
    fields?: Record<string, string | number | null>
    onSuccess?: () => void
    title?: string
    subtitle?: string
    submitLabel?: string
}

export default function EmailCaptureModal({
    isOpen,
    onClose,
    destinationUrl,
    ctaText,
    groupId,
    fields,
    onSuccess,
    title,
    subtitle,
    submitLabel,
}: EmailCaptureModalProps) {
    const { t } = useTranslation()
    const [visitorType, setVisitorType] = useState<'coach' | 'athlete' | 'other' | null>(null)
    const [firstName, setFirstName] = useState('')
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [errorKey, setErrorKey] = useState<'typeError' | 'nameError' | 'error'>('error')
    const inputRef = useRef<HTMLInputElement>(null)
    const firstFocusableRef = useRef<HTMLButtonElement>(null)

    function dismiss() {
        onClose()
        if (destinationUrl) {
            window.location.href = destinationUrl
        }
    }

    useEffect(() => {
        if (!isOpen) return

        const timer = setTimeout(() => inputRef.current?.focus(), 50)

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                dismiss()
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            clearTimeout(timer)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!visitorType) {
            setErrorKey('typeError')
            setStatus('error')
            return
        }

        const name = firstName.trim()
        if (!name) {
            setErrorKey('nameError')
            setStatus('error')
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            setErrorKey('error')
            setStatus('error')
            return
        }

        setStatus('loading')

        await subscribeToMailerLite({
            email,
            name,
            groupId,
            fields: { ...fields, visitor_type: visitorType },
            ctaText,
        })
        void trackEmailCaptureSubmitted({ email, cta_text: ctaText, visitor_type: visitorType })

        if (onSuccess) {
            onClose()
            onSuccess()
        } else {
            dismiss()
        }
    }

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-5"
            style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) dismiss() }}
        >
            <div
                className="w-full max-w-[420px] rounded-2xl p-8 flex flex-col gap-6"
                style={{ backgroundColor: '#0A0A0A', border: '1px solid #222' }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="email-modal-title"
            >
                <div className="flex flex-col gap-2">
                    <h2
                        id="email-modal-title"
                        className="font-mono font-bold text-[22px] leading-[120%] text-white"
                    >
                        {title ?? t('emailCapture.title')}
                    </h2>
                    <p className="font-satoshi text-[15px] leading-[160%] text-[#969EA7]">
                        {subtitle ?? t('emailCapture.subtitle')}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <span className="font-satoshi text-[13px] text-[#969EA7]">
                            {t('emailCapture.typeLabel')}
                        </span>
                        <div className="flex gap-2" role="group" aria-label={t('emailCapture.typeLabel')}>
                            {(['coach', 'athlete', 'other'] as const).map((type) => {
                                const selected = visitorType === type
                                return (
                                    <button
                                        key={type}
                                        type="button"
                                        aria-pressed={selected}
                                        onClick={() => { setVisitorType(type); setStatus('idle') }}
                                        disabled={status === 'loading'}
                                        className="flex-1 h-10 rounded-lg font-satoshi text-[14px] cursor-pointer transition-colors duration-150"
                                        style={{
                                            backgroundColor: selected ? 'rgba(255, 85, 20, 0.15)' : '#151515',
                                            border: selected ? '1px solid #FF5514' : '1px solid #333',
                                            color: selected ? '#FFFFFF' : '#969EA7',
                                        }}
                                    >
                                        {t(`emailCapture.type${type.charAt(0).toUpperCase()}${type.slice(1)}`)}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        value={firstName}
                        onChange={(e) => { setFirstName(e.target.value); setStatus('idle') }}
                        placeholder={t('emailCapture.namePlaceholder')}
                        className="w-full h-12 rounded-lg px-4 font-satoshi text-[15px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-[#FF5514]"
                        style={{ backgroundColor: '#151515', border: '1px solid #333' }}
                        disabled={status === 'loading'}
                        autoComplete="given-name"
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setStatus('idle') }}
                        placeholder={t('emailCapture.placeholder')}
                        className="w-full h-12 rounded-lg px-4 font-satoshi text-[15px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-[#FF5514]"
                        style={{ backgroundColor: '#151515', border: '1px solid #333' }}
                        disabled={status === 'loading'}
                        autoComplete="email"
                    />
                    {status === 'error' && (
                        <p className="font-satoshi text-[13px] text-red-400">
                            {t(`emailCapture.${errorKey}`)}
                        </p>
                    )}
                    <button
                        ref={firstFocusableRef}
                        type="submit"
                        disabled={status === 'loading'}
                        className="btn-gradient font-mono text-[12px] font-extrabold tracking-[2px] uppercase text-white rounded-lg h-12 flex items-center justify-center hover:brightness-110 transition-all duration-200 disabled:opacity-60"
                    >
                        {status === 'loading' ? '...' : (submitLabel ?? t('emailCapture.cta'))}
                    </button>
                </form>

            </div>
        </div>
    )
}
