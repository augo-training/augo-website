import marcoPhoto from '../../assets/images/Marco.webp?w=160&h=160&format=webp'
import { Rise } from './MerciBeat'
import { COPY, TIMING } from './constants'

const QUOTE = COPY.quote

/**
 * Beat 4: someone the coach may already know vouching for augo, right before
 * the ask.
 *
 * Portrait-led, so the face and the name land before the claim does: on a
 * screen read in seconds, who is speaking is what makes the words worth
 * reading. The photo is the same asset and crop the home page testimonials use.
 *
 * The quote fades and rises on the page's usual stagger rather than typing
 * itself in: 200 characters at the terminal's speed would stall the sequence
 * for six seconds.
 *
 * It is a real person's words, so it is marked up as a <blockquote> with a
 * <cite>, not as decorative text.
 */
export default function MerciQuote() {
    const step = TIMING.lineStaggerMs

    return (
        <figure className="my-auto flex w-full max-w-[560px] flex-col">
            <Rise delayMs={0}>
                <img
                    src={marcoPhoto}
                    alt=""
                    width={80}
                    height={80}
                    className="merci-quote-photo rounded-full object-cover"
                />
            </Rise>

            <Rise delayMs={step * 0.5} className="mt-3.5">
                <p
                    id="merci-beat-title"
                    className="font-sans text-[18px] font-extrabold leading-[1.2] tracking-[-0.02em] text-white sm:text-[20px]"
                >
                    {QUOTE.name}
                </p>
                <p className="mt-0.5 font-satoshi text-[13px] leading-[1.35] text-text-muted sm:text-[14px]">
                    {QUOTE.role}
                </p>
            </Rise>

            {/* Quotation marks, so it reads as his words rather than ours. The
                ellipsis before the sign-off is not decoration: a sentence of
                his is cut between the two, and quoting across an omission
                without marking it would present the two halves as adjacent. */}
            <blockquote className="mt-5 sm:mt-6">
                <Rise delayMs={step} className="merci-quote-text text-white">
                    {`“${QUOTE.text}`}
                </Rise>
                <Rise
                    delayMs={step * 2}
                    className="merci-quote-text mt-3 font-bold text-white sm:mt-4"
                >
                    {`… ${QUOTE.signoff}”`}
                </Rise>
            </blockquote>

            {/* The name above is the visible attribution; this keeps the
                citation on the quote itself for anything reading the markup. */}
            <figcaption className="sr-only">
                <cite>
                    {QUOTE.name}, {QUOTE.role}
                </cite>
            </figcaption>
        </figure>
    )
}
