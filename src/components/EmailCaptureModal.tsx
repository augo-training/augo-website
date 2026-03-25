import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { trackEmailCaptureSubmitted } from '../utils/analytics'

interface EmailCaptureModalProps {
    isOpen: boolean
    onClose: () => void
    destinationUrl: string
    ctaText: string
}

export default function EmailCaptureModal({ isOpen, onClose, destinationUrl, ctaText }: EmailCaptureModalProps) {
    const { t } = useTranslation()
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const inputRef = useRef<HTMLInputElement>(null)
    const firstFocusableRef = useRef<HTMLButtonElement>(null)

    function redirect() {
        onClose()
        window.location.href = destinationUrl
    }

    useEffect(() => {
        if (!isOpen) return

        const timer = setTimeout(() => inputRef.current?.focus(), 50)

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                redirect()
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

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            setStatus('error')
            return
        }

        setStatus('loading')

        const apiKey = import.meta.env.VITE_MAILERLITE_API_KEY
        const groupId = import.meta.env.VITE_MAILERLITE_GROUP_ID
        if (apiKey) {
            try {
                const body: Record<string, unknown> = { email }
                if (groupId) body.groups = [groupId]
                await fetch('https://connect.mailerlite.com/api/subscribers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify(body),
                })
            } catch {
                // Never block the user on API failure
            }
        }

        void trackEmailCaptureSubmitted({ email, cta_text: ctaText })
        redirect()
    }

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-5"
            style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) redirect() }}
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
                        {t('emailCapture.title')}
                    </h2>
                    <p className="font-satoshi text-[15px] leading-[160%] text-[#969EA7]">
                        {t('emailCapture.subtitle')}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        ref={inputRef}
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
                            {t('emailCapture.error')}
                        </p>
                    )}
                    <button
                        ref={firstFocusableRef}
                        type="submit"
                        disabled={status === 'loading'}
                        className="btn-gradient font-mono text-[12px] font-extrabold tracking-[2px] uppercase text-white rounded-lg h-12 flex items-center justify-center hover:brightness-110 transition-all duration-200 disabled:opacity-60"
                    >
                        {status === 'loading' ? '...' : t('emailCapture.cta')}
                    </button>
                </form>

            </div>
        </div>
    )
}
