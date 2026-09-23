import { useEffect, useState, type FormEvent } from 'react'
import { Headline, Rise } from './MerciBeat'
import { ADVISORS, COPY, TIMING } from './constants'
import { redeemOffer } from './api'
import type { MerciSrc } from './code'
import {
    trackMerciLinkClicked,
    trackMerciOfferClicked,
    trackMerciOfferError,
    trackMerciOfferRedeemed,
} from '../../utils/analytics'

const OFFER = COPY.offer
const FORM = OFFER.form

interface MerciOfferProps {
    code: string
    src: MerciSrc
    /** The email given at the door; it is what the course goes to. */
    email: string
    /** The code check already said this code was redeemed. */
    alreadyRedeemed: boolean
    onRedeemed: () => void
}

/**
 * Beat 5: the offer and the one button on the page.
 *
 * The offer is an invitation pass, echoing the postcard the coach is holding:
 * their own code across the top, a tear line, the course and the button below.
 * It is the one place the brand gradient appears, as a hairline border (never
 * as text). Everything fits a 360px phone without scrolling, which is why the
 * advisors are one sentence.
 *
 * What is on offer is the email course, not a trial: the free month and the
 * Elite months are made at the end of the course instead. The email was given
 * at the door, so there is nothing left to type here: one tap says yes.
 *
 * A code that was already redeemed still opens the page (the coach may come
 * back to reread it), but the button gives way to a note. The same note appears
 * if the redeem webhook answers 409, e.g. the code was redeemed on another
 * device after this one opened the door.
 */
export default function MerciOffer({ code, src, email, alreadyRedeemed, onRedeemed }: MerciOfferProps) {
    const [sending, setSending] = useState(false)
    const [error, setError] = useState(false)
    const [redeemed, setRedeemed] = useState(alreadyRedeemed)

    // The note that replaces the form, whether the door already knew or the
    // redeem call has just answered 409.
    useEffect(() => {
        if (redeemed) void trackMerciOfferError({ code, error: 'already_redeemed' })
    }, [redeemed, code])

    // No headline above the card any more, so it leads rather than waits.
    const cardAt = 0

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        if (sending) return

        void trackMerciOfferClicked({ code, src })
        setError(false)
        setSending(true)
        const result = await redeemOffer({ code, email, src })
        setSending(false)

        if (result === 'redeemed') return setRedeemed(true)
        if (result === 'error') {
            setError(true)
            void trackMerciOfferError({ code, error: 'submit' })
            return
        }

        void trackMerciOfferRedeemed({ code, email, src })
        onRedeemed()
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
                            className="m-0 font-sans text-[26px] font-extrabold leading-[1.12] tracking-[-0.03em] text-white"
                        >
                            {OFFER.heading}
                        </h1>
                        <p className="merci-blurb-offer mt-1.5 font-satoshi text-[13px] leading-[1.45] text-white">
                            {OFFER.blurb}
                        </p>

                        {redeemed ? (
                            <p role="status" className="mt-4 font-satoshi text-[15px] leading-[1.5] text-white/85">
                                {OFFER.redeemed.before}
                                <a
                                    href={OFFER.redeemed.href}
                                    onClick={() => void trackMerciLinkClicked({ code, link: 'redeemed_contact' })}
                                    className="merci-focus text-white underline decoration-orange decoration-2 underline-offset-4"
                                >
                                    {OFFER.redeemed.link}
                                </a>
                                {OFFER.redeemed.after}
                            </p>
                        ) : (
                            <>
                                {/* Still a form, with nothing in it but the
                                    button: Enter submits and the button reads
                                    as a submit to assistive tech. */}
                                <form onSubmit={handleSubmit} noValidate className="mt-4 flex flex-col gap-2">
                                    {error && (
                                        <p
                                            id="merci-offer-error"
                                            role="alert"
                                            className="font-satoshi text-[14px] leading-[1.4] text-white/80"
                                        >
                                            {FORM.submitError}
                                        </p>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={sending}
                                        aria-describedby={error ? 'merci-offer-error' : undefined}
                                        className="merci-btn mt-1 w-full"
                                    >
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
                <p className="merci-company font-satoshi text-[14px] leading-[1.45] text-text-muted">
                    {OFFER.company.before}
                    {ADVISORS.map((advisor, i) => (
                        <span key={advisor.name}>
                            {i > 0 && (i === ADVISORS.length - 1 ? ' and ' : ', ')}
                            <a
                                href={advisor.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => void trackMerciLinkClicked({ code, link: advisor.name })}
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

/**
 * Replaces the offer once the signup is accepted. The only way off the page is
 * the follow link, which opens in a new tab: there is no navigation back into
 * the sequence, so the done screen should survive the coach going to look.
 */
export function MerciDone({ code }: { code: string }) {
    const lines = [{ text: COPY.done.title }, ...COPY.done.tail]
    const after = lines.length * TIMING.lineStaggerMs
    const step = TIMING.lineStaggerMs

    return (
        <>
            <Headline id="merci-done-title" lines={lines} />
            <Rise delayMs={after} className="merci-sub mt-6 text-white/75 sm:mt-8">
                {COPY.done.subline}
            </Rise>
            {/* After the subline, not before it: checking the inbox is what
                matters here and the follow is the optional extra. */}
            <Rise delayMs={after + step} className="mt-8">
                <a
                    href={COPY.done.instagramHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => void trackMerciLinkClicked({ code, link: 'instagram' })}
                    className="merci-btn-ghost"
                >
                    {COPY.done.instagram}
                    <span aria-hidden="true">↗</span>
                </a>
            </Rise>
            <Rise delayMs={after + 2 * step} className="merci-label mt-10 text-text-muted">
                {COPY.done.footer}
            </Rise>
        </>
    )
}
