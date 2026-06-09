import { ArrowRight } from 'lucide-react'
import { trackCtaClicked } from '../../utils/analytics'
import { matchingFormUrl } from '../find/matchingForm'

export default function CoachApplyBand() {
    function handleClick() {
        trackCtaClicked({
            cta_text: 'Apply to be listed',
            cta_location: 'coach-band',
            destination: matchingFormUrl('coach-band'),
        })
    }

    return (
        <section
            aria-labelledby="coach-apply-title"
            className="w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark-800 border-t border-white/[0.06]"
        >
            <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-end">
                <div className="flex flex-col gap-4">
                    <span className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/55">
                        For coaches
                    </span>
                    <h2
                        id="coach-apply-title"
                        className="font-satoshi font-bold text-[28px] sm:text-[36px] lg:text-[44px] leading-[110%] tracking-[-0.02em] text-white"
                    >
                        Stop doing marketing. Start getting found.
                    </h2>
                    <p className="font-satoshi text-[16px] sm:text-[18px] leading-[155%] text-text-muted max-w-[640px]">
                        We send athletes who actually fit how you coach — not anyone with a credit card. Join the augo roster and let inbound do its job.
                    </p>
                </div>
                <a
                    href={matchingFormUrl('coach-band')}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleClick}
                    className="self-start lg:self-end inline-flex items-center gap-2.5 font-mono text-sm font-extrabold tracking-[2px] uppercase text-white rounded-lg px-6 py-3.5 ring-1 ring-white/20 hover:bg-white hover:text-dark hover:ring-white transition-all cursor-pointer bg-transparent"
                >
                    Apply to be listed <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </a>
            </div>
        </section>
    )
}
