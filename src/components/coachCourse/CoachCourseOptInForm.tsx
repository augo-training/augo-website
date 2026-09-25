import { useId, useState } from 'react'
import { subscribeToMailerLite } from '../../utils/mailerlite'
import {
    trackEmailCaptureSubmitted,
    trackEmailCaptureError,
    trackEmailCaptureUnlocked,
    identifyEmailCapture,
    getUtmParams,
} from '../../utils/analytics'
import {
    COPY,
    COACH_COURSE_CTA_TEXT,
    COACH_COURSE_GROUP_ID,
    COACH_COURSE_PATH,
    type CoachCoursePlacement,
} from './constants'

interface CoachCourseOptInFormProps {
    /** Which of the page's forms this is. Rides on every Mixpanel event. */
    placement: CoachCoursePlacement
    /** Called once the signup has actually been accepted. Unlocks the page. */
    onCaptured: () => void
    /** True once any form on the page has captured. Every form then shows the note. */
    unlocked: boolean
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const ERRORS = {
    nameError: 'We need a first name.',
    emailError: 'That email address does not look right.',
    submitError: 'Something went wrong on our side. Try again in a moment.',
} as const

const INPUT_CLASS =
    'w-full h-14 rounded-lg px-4 font-satoshi text-[17px] text-white placeholder-[#7a7a7a] bg-[#151515] border border-[#333] outline-none transition-colors duration-150 focus:border-white/40 focus:ring-1 focus:ring-white/40'

/**
 * First name, email, button. The same validation order, field styling and
 * signup calls as NiceCoachesEmailForm, but repeated down the page, once per
 * section. Each copy keeps its own fields and its own error; the unlock is
 * shared, so once any of them is accepted every form gives way to the note.
 *
 * Like the Nice forms, this checks what subscribeToMailerLite returns: the page
 * only unlocks on a signup the webhook actually accepted.
 */
export default function CoachCourseOptInForm({ placement, onCaptured, unlocked }: CoachCourseOptInFormProps) {
    const id = useId()
    const [firstName, setFirstName] = useState('')
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
    const [errorKey, setErrorKey] = useState<keyof typeof ERRORS>('submitError')
    const errorId = `${id}-error`

    function fail(key: keyof typeof ERRORS) {
        setErrorKey(key)
        setStatus('error')
        void trackEmailCaptureError({ page: COACH_COURSE_PATH, cta_text: COACH_COURSE_CTA_TEXT, error: key, placement })
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
            groupId: COACH_COURSE_GROUP_ID,
            // UTMs and landing page ride along to MailerLite so a signup is
            // attributable to its campaign even when cookies were declined.
            fields: { ...getUtmParams(), landing_page: COACH_COURSE_PATH },
            ctaText: COACH_COURSE_CTA_TEXT,
        })

        if (!accepted) return fail('submitError')

        void identifyEmailCapture({
            email,
            first_name: name,
            source: COACH_COURSE_CTA_TEXT,
            page: COACH_COURSE_PATH,
        })
        void trackEmailCaptureSubmitted({
            email,
            cta_text: COACH_COURSE_CTA_TEXT,
            visitor_type: 'coach',
            page: COACH_COURSE_PATH,
            placement,
        })
        void trackEmailCaptureUnlocked({ page: COACH_COURSE_PATH, cta_text: COACH_COURSE_CTA_TEXT, placement })
        setStatus('idle')
        onCaptured()
    }

    if (unlocked) {
        return (
            <div role="status" className="flex flex-col gap-1.5">
                <p className="font-satoshi font-bold text-[24px] leading-[125%] tracking-[-0.02em] text-white">
                    {COPY.form.successTitle}
                </p>
                <p className="font-satoshi text-[17px] sm:text-[18px] leading-[150%] text-white/75">{COPY.form.successBody}</p>
            </div>
        )
    }

    const loading = status === 'loading'

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2.5">
            <div className="flex flex-col sm:flex-row gap-2.5">
                <label htmlFor={`${id}-name`} className="sr-only">
                    First name
                </label>
                <input
                    id={`${id}-name`}
                    type="text"
                    value={firstName}
                    onChange={(e) => {
                        setFirstName(e.target.value)
                        setStatus('idle')
                    }}
                    placeholder="First name"
                    className={INPUT_CLASS}
                    disabled={loading}
                    autoComplete="given-name"
                    aria-describedby={status === 'error' ? errorId : undefined}
                />
                <label htmlFor={`${id}-email`} className="sr-only">
                    Email address
                </label>
                <input
                    id={`${id}-email`}
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value)
                        setStatus('idle')
                    }}
                    placeholder="you@example.com"
                    className={INPUT_CLASS}
                    disabled={loading}
                    autoComplete="email"
                    aria-describedby={status === 'error' ? errorId : undefined}
                />
            </div>
            {status === 'error' && (
                <p id={errorId} role="alert" className="font-satoshi text-[15px] text-red-400">
                    {ERRORS[errorKey]}
                </p>
            )}
            <button
                type="submit"
                disabled={loading}
                className="btn-gradient w-full font-mono text-[14px] font-extrabold tracking-[2px] uppercase text-white rounded-lg h-14 flex items-center justify-center hover:brightness-110 transition-all duration-200 disabled:opacity-60 border-0 cursor-pointer"
            >
                {loading ? COPY.form.sending : COPY.form.submitLabel}
            </button>
        </form>
    )
}
