import { useState } from 'react'
import { subscribeToMailerLite } from '../../utils/mailerlite'
import { trackEmailCaptureSubmitted } from '../../utils/analytics'
import { COPY, NICE_ATHLETES_CTA_TEXT, NICE_ATHLETES_GROUP_ID } from './constants'

interface NiceAthletesEmailFormProps {
    /** Called once the signup has actually been accepted. Unlocks the logo. */
    onCaptured: () => void
    unlocked: boolean
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const ERRORS = {
    nameError: 'We need a first name.',
    emailError: 'That email address does not look right.',
    submitError: 'Something went wrong on our side. Try again in a moment.',
} as const

const INPUT_CLASS =
    'w-full h-11 sm:h-12 rounded-lg px-4 font-satoshi text-[15px] text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-[#FF5514]'
const INPUT_STYLE = { backgroundColor: '#151515', border: '1px solid #333' } as const

/**
 * First name, email, button. Same validation order as EmailCaptureModal, minus
 * the visitor-type pills — we already know who lands here — and inline rather
 * than in a modal, since it is the one action this page exists for.
 *
 * Unlike the modal, this checks what subscribeToMailerLite returns: the logo
 * only unlocks on a signup the webhook actually accepted.
 */
export default function NiceAthletesEmailForm({
    onCaptured,
    unlocked,
}: NiceAthletesEmailFormProps) {
    const [firstName, setFirstName] = useState('')
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
    const [errorKey, setErrorKey] = useState<keyof typeof ERRORS>('submitError')

    function fail(key: keyof typeof ERRORS) {
        setErrorKey(key)
        setStatus('error')
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        const name = firstName.trim()
        if (!name) return fail('nameError')
        if (!EMAIL_REGEX.test(email)) return fail('emailError')

        setStatus('loading')

        const accepted = await subscribeToMailerLite({
            email,
            name,
            groupId: NICE_ATHLETES_GROUP_ID,
            ctaText: NICE_ATHLETES_CTA_TEXT,
        })

        if (!accepted) return fail('submitError')

        void trackEmailCaptureSubmitted({
            email,
            cta_text: NICE_ATHLETES_CTA_TEXT,
            visitor_type: 'athlete',
        })
        setStatus('idle')
        onCaptured()
    }

    if (unlocked) {
        return (
            <div className="flex flex-col gap-2 max-w-[560px]">
                <p className="font-satoshi font-bold text-[22px] sm:text-[26px] leading-[120%] tracking-[-0.02em] text-white">
                    {COPY.form.successTitle}
                </p>
                <p className="font-satoshi text-[15px] leading-[150%] text-white/70">
                    {COPY.form.successBody}
                </p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 max-w-[560px]">
            <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => {
                        setFirstName(e.target.value)
                        setStatus('idle')
                    }}
                    placeholder="First name"
                    aria-label="First name"
                    className={INPUT_CLASS}
                    style={INPUT_STYLE}
                    disabled={status === 'loading'}
                    autoComplete="given-name"
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value)
                        setStatus('idle')
                    }}
                    placeholder="you@example.com"
                    aria-label="Email address"
                    className={INPUT_CLASS}
                    style={INPUT_STYLE}
                    disabled={status === 'loading'}
                    autoComplete="email"
                />
            </div>
            {status === 'error' && (
                <p role="alert" className="font-satoshi text-[13px] text-red-400">
                    {ERRORS[errorKey]}
                </p>
            )}
            <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-gradient self-start w-full sm:w-auto sm:px-8 font-mono text-[12px] font-extrabold tracking-[2px] uppercase text-white rounded-lg h-11 sm:h-12 flex items-center justify-center hover:brightness-110 transition-all duration-200 disabled:opacity-60 border-0 cursor-pointer"
            >
                {status === 'loading' ? '...' : COPY.form.submitLabel}
            </button>
        </form>
    )
}
