import { useState } from 'react'
import { subscribeToMailerLite } from '../../utils/mailerlite'
import {
    trackEmailCaptureSubmitted,
    trackEmailCaptureError,
    trackEmailCaptureUnlocked,
    identifyEmailCapture,
    getUtmParams,
} from '../../utils/analytics'
import { COPY, NICE_COACHES_CTA_TEXT, NICE_COACHES_GROUP_ID, NICE_COACHES_PATH } from './constants'

interface NiceCoachesEmailFormProps {
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
    'w-full h-11 sm:h-12 rounded-lg px-4 font-satoshi text-[15px] text-white placeholder-[#555] bg-[#151515] border border-[#333] outline-none transition-colors duration-150 focus:border-white/40 focus:ring-1 focus:ring-white/40'

/**
 * First name, email, button. Same validation order and the same field styling as
 * NiceAthletesEmailForm, inline rather than in a modal since this is the one
 * action the page exists for.
 *
 * Deliberately shorter than the athletes form: a coach is neither self-coached
 * nor working with a coach, so the coaching pills and the `coaching_status`
 * custom field are gone. Note that the field is *omitted*, not sent as null —
 * subscribeToMailerLite forwards `fields` verbatim, and a null would blank the
 * answer of someone who had already signed up through the athletes page.
 *
 * `visitor_type: 'coach'` rides on the Mixpanel event only. MailerLite has no
 * such custom field, and the group is coach-specific anyway.
 *
 * Like the athletes form, this checks what subscribeToMailerLite returns: the
 * logo only unlocks on a signup the webhook actually accepted.
 */
export default function NiceCoachesEmailForm({
    onCaptured,
    unlocked,
}: NiceCoachesEmailFormProps) {
    const [firstName, setFirstName] = useState('')
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
    const [errorKey, setErrorKey] = useState<keyof typeof ERRORS>('submitError')

    function fail(key: keyof typeof ERRORS) {
        setErrorKey(key)
        setStatus('error')
        void trackEmailCaptureError({ page: NICE_COACHES_PATH, cta_text: NICE_COACHES_CTA_TEXT, error: key })
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
            groupId: NICE_COACHES_GROUP_ID,
            // UTMs and landing page ride along to MailerLite so a signup is
            // attributable to its ad campaign even when cookies were declined.
            // The page is a single-screen dead end, so the landing URL (and its
            // UTMs) is still the current URL at submit time.
            fields: { ...getUtmParams(), landing_page: NICE_COACHES_PATH },
            ctaText: NICE_COACHES_CTA_TEXT,
        })

        if (!accepted) return fail('submitError')

        void identifyEmailCapture({
            email,
            first_name: name,
            source: NICE_COACHES_CTA_TEXT,
            page: NICE_COACHES_PATH,
        })
        void trackEmailCaptureSubmitted({
            email,
            cta_text: NICE_COACHES_CTA_TEXT,
            visitor_type: 'coach',
            page: NICE_COACHES_PATH,
        })
        void trackEmailCaptureUnlocked({ page: NICE_COACHES_PATH, cta_text: NICE_COACHES_CTA_TEXT })
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:gap-2.5 max-w-[560px]">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5">
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
