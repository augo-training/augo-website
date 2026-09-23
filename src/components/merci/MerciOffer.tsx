import { useEffect, useState, type ReactNode } from 'react'
import { Headline, Rise } from './MerciBeat'
import MerciQuote from './MerciQuote'
import { COPY, TIMING } from './constants'
import { redeemOffer } from './api'
import type { MerciSrc } from './code'
import {
    trackMerciLinkClicked,
    trackMerciOfferClicked,
    trackMerciOfferError,
    trackMerciOfferRedeemed,
    type MerciOfferPlacement,
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

/** What every opt-in on the page shares: the one submit, and its state. */
interface OptInState {
    code: string
    sending: boolean
    /** Which button's tap failed, so the error shows under that one. */
    errorAt: MerciOfferPlacement | null
    redeemed: boolean
    submit: (placement: MerciOfferPlacement) => void
}

/**
 * Beat 4: the ticket, which is the course's opt-in page.
 *
 * It opens with the invitation pass, echoing the postcard the coach is holding:
 * their own code across the top, a tear line, the course and the one button
 * below. The page then makes the case for the course (what you get, a
 * day-by-day peek, who it is for) and asks again after each section with a
 * bare button, and ends on who wrote it, with Marco's words. The pass is the only framed thing on
 * the page and the one place the brand gradient appears, as a hairline border
 * (never as text): a page of boxed cards read as busy.
 *
 * The email was given at the door, so there is nothing to type here: every
 * button is the same one-tap yes. `placement` on the click event says which
 * one converted.
 *
 * A code that was already redeemed still opens the page (the coach may come
 * back to reread it), but the buttons give way to a note. The same note appears
 * if the redeem webhook answers 409, e.g. the code was redeemed on another
 * device after this one opened the door.
 */
export default function MerciOffer({ code, src, email, alreadyRedeemed, onRedeemed }: MerciOfferProps) {
    const [sending, setSending] = useState(false)
    const [errorAt, setErrorAt] = useState<MerciOfferPlacement | null>(null)
    const [redeemed, setRedeemed] = useState(alreadyRedeemed)

    // The note that replaces the buttons, whether the door already knew or
    // the redeem call has just answered 409.
    useEffect(() => {
        if (redeemed) void trackMerciOfferError({ code, error: 'already_redeemed' })
    }, [redeemed, code])

    async function submit(placement: MerciOfferPlacement) {
        if (sending) return

        void trackMerciOfferClicked({ code, src, placement })
        setErrorAt(null)
        setSending(true)
        const result = await redeemOffer({ code, email, src })
        setSending(false)

        if (result === 'redeemed') return setRedeemed(true)
        if (result === 'error') {
            setErrorAt(placement)
            void trackMerciOfferError({ code, error: 'submit' })
            return
        }

        void trackMerciOfferRedeemed({ code, email, src })
        onRedeemed()
    }

    const state: OptInState = { code, sending, errorAt, redeemed, submit: (p) => void submit(p) }
    const step = TIMING.lineStaggerMs

    return (
        <div className="merci-offer mx-auto w-full max-w-[560px] pb-4">
            <Rise delayMs={0}>
                <Pass code={code} state={state}>
                    {/* The only h1 on this screen, so it is what the beat is labelled by. */}
                    <h1
                        id="merci-offer-title"
                        className="m-0 font-sans text-[27px] font-extrabold leading-[1.1] tracking-[-0.03em] text-white sm:text-[30px]"
                    >
                        {OFFER.headline}
                    </h1>
                    <p className="merci-body mt-4 font-bold italic text-white">{OFFER.qualifier}</p>
                    {OFFER.intro.map((para) => (
                        <p key={para} className="merci-body mt-5">
                            {para}
                        </p>
                    ))}
                </Pass>
            </Rise>

            <Rise delayMs={step} className="mt-10">
                <Section title={OFFER.get.title}>
                    <ul className="m-0 mt-4 list-none space-y-3 p-0">
                        {OFFER.get.items.map((item) => (
                            <li key={item.text} className={`merci-body flex gap-3 ${item.bold ? 'font-bold text-white' : ''}`}>
                                <span aria-hidden="true" className="shrink-0 font-mono text-white">
                                    ✓
                                </span>
                                <span>{item.text}</span>
                            </li>
                        ))}
                    </ul>
                </Section>
                <Repeat state={state} placement="get" />
            </Rise>

            <Rise delayMs={step * 2} className="mt-10">
                <Section title={OFFER.peek.title}>
                    <p className="merci-body mt-3">{OFFER.peek.intro}</p>
                    <ol className="m-0 mt-5 list-none space-y-5 p-0">
                        {[...OFFER.peek.days, { label: OFFER.peek.bonus.label, fix: OFFER.peek.bonus.text }].map(
                            (day) => (
                                <li key={day.label}>
                                    <h3 className="m-0 font-sans text-[18px] font-extrabold leading-[1.2] tracking-[-0.02em] text-white">
                                        {day.label}
                                    </h3>
                                    <p className="merci-body mt-1.5">{day.fix}</p>
                                </li>
                            ),
                        )}
                    </ol>
                </Section>
                <Repeat state={state} placement="peek" />
            </Rise>

            <Rise delayMs={step * 2.5} className="mt-10">
                <Section title={OFFER.fit.title}>
                    <ul className="m-0 mt-4 list-none space-y-2.5 p-0">
                        {OFFER.fit.items.map((item) => (
                            <li key={item} className="merci-body flex gap-3">
                                <span aria-hidden="true" className="shrink-0 text-text-muted">
                                    –
                                </span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="merci-body mt-5 text-white">
                        {OFFER.fit.outro.before}
                        <strong>{OFFER.fit.outro.name}</strong>
                        {OFFER.fit.outro.after}
                    </p>
                </Section>
            </Rise>

            <Rise delayMs={step * 3} className="mt-8">
                <h2 className="m-0 font-sans text-[24px] font-extrabold leading-[1.12] tracking-[-0.03em] text-white">
                    {OFFER.closing.heading}
                </h2>
                <Repeat state={state} placement="closing" />
            </Rise>

            {/* Last on purpose: the ask has been made; this is who is behind it. */}
            <Rise delayMs={step * 3.5} className="mt-12">
                <Section title={OFFER.team.title}>
                    <p className="merci-body mt-3">{OFFER.team.body}</p>
                    <MerciQuote />
                    <p className="merci-body mt-4 font-bold text-white">{OFFER.team.after}</p>
                </Section>
                <Repeat state={state} placement="team" />
            </Rise>
        </div>
    )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section>
            <h2 className="m-0 font-sans text-[22px] font-extrabold leading-[1.15] tracking-[-0.03em] text-white">
                {title}
            </h2>
            {children}
        </section>
    )
}

/**
 * The invitation pass at the top of the page: the code strip, the tear line,
 * then the hero copy above the first button. The one framed thing on the page.
 */
function Pass({ code, state, children }: { code: string; state: OptInState; children: ReactNode }) {
    return (
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

            <div className="px-5 pt-5 pb-4">
                {children}
                <div className="mt-5">
                    <OptIn state={state} placement="hero" />
                </div>
            </div>
        </div>
    )
}

/**
 * The button again, bare, after a section. No frame around it. Gone once the
 * coach is on the list.
 */
function Repeat({ state, placement }: { state: OptInState; placement: MerciOfferPlacement }) {
    if (state.redeemed) return null
    return (
        <div className="mt-6">
            <OptIn state={state} placement={placement} />
        </div>
    )
}

/**
 * The one button, or the already-on-the-list note in its place. Still a
 * form with nothing in it but the button: Enter submits and the button reads
 * as a submit to assistive tech.
 */
function OptIn({ state, placement }: { state: OptInState; placement: MerciOfferPlacement }) {
    const { code, sending, errorAt, redeemed, submit } = state
    const errorId = `merci-offer-error-${placement}`

    if (redeemed) {
        return (
            <p role="status" className="font-satoshi text-[15px] leading-[1.5] text-white/85">
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
        )
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                submit(placement)
            }}
            noValidate
            className="flex flex-col gap-2"
        >
            {errorAt === placement && (
                <p id={errorId} role="alert" className="font-satoshi text-[14px] leading-[1.4] text-white/80">
                    {FORM.submitError}
                </p>
            )}
            <button
                type="submit"
                disabled={sending}
                aria-describedby={errorAt === placement ? errorId : undefined}
                className="merci-btn w-full"
            >
                {sending ? FORM.sending : OFFER.button}
            </button>
        </form>
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
