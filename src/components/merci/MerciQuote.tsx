import marcoPhoto from '../../assets/images/Marco.webp?w=160&h=160&format=webp'
import { COPY } from './constants'

const QUOTE = COPY.quote

/**
 * Marco Altini vouching for augo, on the ticket under "Written by the augo
 * team". It used to be a beat of its own before the ask; now it sits inside
 * the page that makes the ask, so it no longer animates in on a stagger.
 *
 * Portrait-led, so the face and the name land before the claim does: who is
 * speaking is what makes the words worth reading. The photo is the same asset
 * and crop the home page testimonials use.
 *
 * It is a real person's words, so it is marked up as a <blockquote> with a
 * <cite>, not as decorative text.
 */
export default function MerciQuote() {
    return (
        <figure className="merci-quote m-0 mt-5 rounded-[20px] p-5">
            <div className="flex items-center gap-3.5">
                <img
                    src={marcoPhoto}
                    alt=""
                    width={56}
                    height={56}
                    className="h-14 w-14 shrink-0 rounded-full object-cover"
                />
                <div>
                    <p className="font-sans text-[16px] font-extrabold leading-[1.2] tracking-[-0.02em] text-white">
                        {QUOTE.name}
                    </p>
                    <p className="mt-0.5 font-satoshi text-[13px] leading-[1.35] text-text-muted">{QUOTE.role}</p>
                </div>
            </div>

            {/* Quotation marks, so it reads as his words rather than ours. The
                ellipsis before the sign-off is not decoration: a sentence of
                his is cut between the two, and quoting across an omission
                without marking it would present the two halves as adjacent. */}
            <blockquote className="m-0 mt-4">
                <p className="font-satoshi text-[15px] leading-[1.5] text-white">{`\u201c${QUOTE.text}`}</p>
                <p className="mt-2.5 font-satoshi text-[15px] font-bold leading-[1.5] text-white">{`\u2026 ${QUOTE.signoff}\u201d`}</p>
            </blockquote>

            <figcaption className="sr-only">
                <cite>
                    {QUOTE.name}, {QUOTE.role}
                </cite>
            </figcaption>
        </figure>
    )
}
