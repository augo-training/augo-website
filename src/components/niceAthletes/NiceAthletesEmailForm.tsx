import { useState } from 'react'
import { subscribeToMailerLite } from '../../utils/mailerlite'
import {
    trackEmailCaptureSubmitted,
    trackEmailCaptureError,
    trackEmailCaptureUnlocked,
    trackCoachingStatusSelected,
    identifyEmailCapture,
} from '../../utils/analytics'
import { COPY, NICE_ATHLETES_CTA_TEXT, NICE_ATHLETES_GROUP_ID, NICE_ATHLETES_PATH } from './constants'

interface NiceAthletesEmailFormProps {
    /** Called once the signup has actually been accepted. Unlocks the logo. */
    onCaptured: () => void
    unlocked: boolean
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const ERRORS = {
    statusError: 'Pick one so we know what to send you.',
    nameError: 'We need a first name.',
    emailError: 'That email address does not look right.',
    submitError: 'Something went wrong on our side. Try again in a moment.',
} as const

const INPUT_CLASS =
    'w-full h-11 sm:h-12 rounded-lg px-4 font-satoshi text-[15px] text-white placeholder-[#555] bg-[#151515] border border-[#333] outline-none transition-colors duration-150 focus:border-white/40 focus:ring-1 focus:ring-white/40'

/**
 * Selected pills go white, not brand orange: a soft white fill and a near-white
 * border, matching the white rings used for "selected" on CoachCard. The
 * gradient submit button is the one place the brand colours appear in the form.
 */
const PILL_CLASS =
    'flex-1 h-11 sm:h-12 rounded-lg font-satoshi text-[14px] cursor-pointer border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40'
const PILL_SELECTED = 'bg-white/10 border-white/85 text-white font-medium'
const PILL_IDLE = 'bg-[#151515] border-[#333] text-[#969EA7] hover:border-white/30'

type CoachingStatus = (typeof COPY.coaching.options)[number]['value']

/**
 * Coaching status, first name, email, button. Same validation order as
 * EmailCaptureModal, inline rather than in a modal since this is the one action
 * the page exists for. The pills deliberately use the white selected state
 * (PILL_SELECTED) rather than the modal's orange one.
 *
 * The coaching answer rides along as the `coaching_status` custom field. It is
 * what the two MailerLite segments filter on — segments cannot be assigned to,
 * only derived — so a submission missing it lands in neither.
 *
 * Unlike the modal, this checks what subscribeToMailerLite returns: the logo
 * only unlocks on a signup the webhook actually accepted.
 */
export default function NiceAthletesEmailForm({
    onCaptured,
    unlocked,
}: NiceAthletesEmailFormProps) {
    const [coachingStatus, setCoachingStatus] = useState<CoachingStatus | null>(null)
    const [firstName, setFirstName] = useState('')
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
    const [errorKey, setErrorKey] = useState<keyof typeof ERRORS>('submitError')

    function fail(key: keyof typeof ERRORS) {
        setErrorKey(key)
        setStatus('error')
        void trackEmailCaptureError({ page: NICE_ATHLETES_PATH, cta_text: NICE_ATHLETES_CTA_TEXT, error: key })
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!coachingStatus) return fail('statusError')

        const name = firstName.trim()
        if (!name) return fail('nameError')
        if (!EMAIL_REGEX.test(email)) return fail('emailError')

        setStatus('loading')

        const accepted = await subscribeToMailerLite({
            email,
            name,
            groupId: NICE_ATHLETES_GROUP_ID,
            fields: { coaching_status: coachingStatus },
            ctaText: NICE_ATHLETES_CTA_TEXT,
        })

        if (!accepted) return fail('submitError')

        void identifyEmailCapture({
            email,
            first_name: name,
            coaching_status: coachingStatus,
            source: NICE_ATHLETES_CTA_TEXT,
            page: NICE_ATHLETES_PATH,
        })
        void trackEmailCaptureSubmitted({
            email,
            cta_text: NICE_ATHLETES_CTA_TEXT,
            visitor_type: 'athlete',
            page: NICE_ATHLETES_PATH,
            coaching_status: coachingStatus,
        })
        void trackEmailCaptureUnlocked({ page: NICE_ATHLETES_PATH, cta_text: NICE_ATHLETES_CTA_TEXT })
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
            <div
                className="flex gap-2 sm:gap-2.5"
                role="group"
                aria-label={COPY.coaching.label}
            >
                {COPY.coaching.options.map((option) => {
                    const selected = coachingStatus === option.value
                    return (
                        <button
                            key={option.value}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => {
                                setCoachingStatus(option.value)
                                setStatus('idle')
                                void trackCoachingStatusSelected({
                                    page: NICE_ATHLETES_PATH,
                                    coaching_status: option.value,
                                })
                            }}
                            disabled={status === 'loading'}
                            className={`${PILL_CLASS} ${selected ? PILL_SELECTED : PILL_IDLE}`}
                        >
                            {option.label}
                        </button>
                    )
                })}
            </div>
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
