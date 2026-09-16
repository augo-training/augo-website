import { useState, type FormEvent } from 'react'
import { Headline, Rise } from './MerciBeat'
import { ADVISORS, COPY, MERCI_PATH, MERCI_SOURCE, TIMING } from './constants'
import { redeemOffer } from './api'
import type { MerciSrc } from './code'
import { identifyEmailCapture, trackMerciOfferRedeemed } from '../../utils/analytics'

const OFFER = COPY.offer
const FORM = OFFER.form
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const ERROR_TEXT = {
    name: FORM.nameError,
    email: FORM.emailError,
    submit: FORM.submitError,
} as const

type FormError = keyof typeof ERROR_TEXT

interface MerciOfferProps {
    code: string
    src: MerciSrc
    /** The code check already said this code was redeemed. */
    alreadyRedeemed: boolean
    onRedeemed: (firstName: string) => void
}

/**
 * Beat 4: the offer and the one form on the page.
 *
 * The offer is an invitation pass, echoing the postcard the coach is holding:
 * their own code across the top, a tear line, the course and the form below. It
 * is the one place the brand gradient appears, as a hairline border (never as
 * text). Everything fits a 360px phone without scrolling, which is why the
 * fields use placeholders as their labels and the advisors are one sentence.
 *
 * What is on offer is the email course, not a trial: the free month and the
 * Elite months are made at the end of the course instead, so this page asks for
 * an email and nothing else.
 *
 * A code that was already redeemed still opens the page (the coach may come
 * back to reread it), but the form gives way to a note. The same note appears
 * if the redeem webhook answers 409, e.g. the code was redeemed on another
 * device after this one opened the door.
 */
export default function MerciOffer({ code, src, alreadyRedeemed, onRedeemed }: MerciOfferProps) {
    const [firstName, setFirstName] = useState('')
    const [email, setEmail] = useState('')
    const [sending, setSending] = useState(false)
    const [error, setError] = useState<FormError | null>(null)
    const [redeemed, setRedeemed] = useState(alreadyRedeemed)

    // No headline above the card any more, so it leads rather than waits.
    const cardAt = 0

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        if (sending) return
        const name = firstName.trim()
        const address = email.trim()
        if (!name) return setError('name')
        if (!EMAIL_PATTERN.test(address)) return setError('email')

        setError(null)
        setSending(true)
        const result = await redeemOffer({ code, firstName: name, email: address, src })
        setSending(false)

        if (result === 'redeemed') return setRedeemed(true)
        if (result === 'error') return setError('submit')

        void identifyEmailCapture({
            email: address,
            first_name: name,
            source: MERCI_SOURCE,
            page: MERCI_PATH,
        })
        void trackMerciOfferRedeemed({ code, email: address })
        onRedeemed(name)
    }

    function clearError() {
        if (error) setError(null)
    }

    return (
        <div className="merci-offer my-auto w-full max-w-[520px]">
            <Rise delayMs={cardAt}>
                <div className="merci-pass rounded-[24px]">
                    <div className="px-5 pt-4 pb-3.5">
                        <p className="merci-label merci-label-sm text-text-muted">{OFFER.codeLabel}</p>
                        <p className="mt-1.5 font-mono text-[22px] font-bold leading-none tracking-[0.06em] text-white">
                            {code}
                        </p>
                    </div>

                    {/* The tear line, with a notch punched out of each edge. */}
                    <div aria-hidden="true" className="relative mx-5 border-t border-dashed border-dark-600">
                        <span className="merci-notch merci-notch-left" />
                        <span className="merci-notch merci-notch-right" />
                    </div>

                    <div className="px-5 pt-3.5 pb-4">
                        {/* The only heading on this screen, so it is the h1 the
                            beat is labelled by. */}
                        <h1
                            id="merci-offer-title"
                            className="m-0 font-sans text-[20px] font-extrabold leading-[1.2] tracking-[-0.02em] text-white"
                        >
                            {OFFER.courseTitle}
                        </h1>
                        <p className="merci-blurb mt-1.5 font-satoshi text-[13px] leading-[1.45] text-white">
                            {OFFER.blurb}
                        </p>

                        {redeemed ? (
                            <p role="status" className="mt-4 font-satoshi text-[15px] leading-[1.5] text-white/85">
                                {OFFER.redeemed.before}
                                <a
                                    href={OFFER.redeemed.href}
                                    className="merci-focus text-white underline decoration-yellow decoration-2 underline-offset-4"
                                >
                                    {OFFER.redeemed.link}
                                </a>
                                {OFFER.redeemed.after}
                            </p>
                        ) : (
                            <>
                                <form onSubmit={handleSubmit} noValidate className="mt-4 flex flex-col gap-2">
                                    <input
                                        id="merci-first-name"
                                        type="text"
                                        autoComplete="given-name"
                                        required
                                        placeholder={FORM.firstName}
                                        aria-label={FORM.firstName}
                                        value={firstName}
                                        onChange={(e) => {
                                            setFirstName(e.target.value)
                                            clearError()
                                        }}
                                        aria-invalid={error === 'name'}
                                        aria-describedby={error ? 'merci-offer-error' : undefined}
                                        readOnly={sending}
                                        className="merci-field w-full font-satoshi text-[16px]"
                                    />
                                    <input
                                        id="merci-email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        placeholder={FORM.email}
                                        aria-label={FORM.email}
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                            clearError()
                                        }}
                                        aria-invalid={error === 'email'}
                                        aria-describedby={error ? 'merci-offer-error' : undefined}
                                        readOnly={sending}
                                        className="merci-field w-full font-satoshi text-[16px]"
                                    />
                                    {error && (
                                        <p
                                            id="merci-offer-error"
                                            role="alert"
                                            className="font-satoshi text-[14px] leading-[1.4] text-white/80"
                                        >
                                            {ERROR_TEXT[error]}
                                        </p>
                                    )}
                                    <button type="submit" disabled={sending} className="merci-btn mt-1 w-full">
                                        {sending ? FORM.sending : OFFER.button}
                                    </button>
                                </form>
                                <p className="mt-2.5 text-center font-satoshi text-[13px] text-text-muted">
                                    {OFFER.note}
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </Rise>

            <Rise delayMs={cardAt + 200} className="mt-5">
                <p className="font-satoshi text-[14px] leading-[1.45] text-text-muted">
                    {OFFER.company.before}
                    {ADVISORS.map((advisor, i) => (
                        <span key={advisor.name}>
                            {i > 0 && (i === ADVISORS.length - 1 ? ' and ' : ', ')}
                            <a
                                href={advisor.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="merci-focus text-white underline decoration-dark-400 underline-offset-2 transition-colors duration-150 hover:decoration-white"
                            >
                                {advisor.name}
                            </a>
                        </span>
                    ))}
                    {OFFER.company.after}
                </p>
            </Rise>
        </div>
    )
}

/** Replaces the offer once the signup is accepted. No further navigation. */
export function MerciDone({ firstName }: { firstName: string }) {
    const name = firstName.length > 30 ? `${firstName.slice(0, 30)}…` : firstName
    const lines = [{ text: `Done, ${name}.` }, ...COPY.done.tail]
    const after = lines.length * TIMING.lineStaggerMs

    return (
        <>
            <Headline id="merci-done-title" lines={lines} />
            <Rise delayMs={after} className="merci-sub mt-6 text-white/75 sm:mt-8">
                {COPY.done.subline}
            </Rise>
            <Rise delayMs={after + TIMING.lineStaggerMs} className="merci-label mt-12 text-text-muted">
                {COPY.done.footer}
            </Rise>
        </>
    )
}
