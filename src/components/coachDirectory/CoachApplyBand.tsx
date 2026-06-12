import { ArrowRight, Award, Check } from 'lucide-react'
import { trackCtaClicked } from '../../utils/analytics'
import { foundingFormUrl, matchingFormUrl } from '../find/matchingForm'

const FOUNDING_BENEFITS = [
    'Shape the future of augo with your input',
    'Early access to new features',
    'Preferential matching — more athletes sent your way',
    'augo free for life*',
    'Limited spots',
]

export default function CoachApplyBand() {
    function handleListingClick() {
        trackCtaClicked({
            cta_text: 'Apply to be listed',
            cta_location: 'coach-band',
            destination: matchingFormUrl('coach-band'),
        })
    }

    function handleFoundingClick() {
        trackCtaClicked({
            cta_text: 'Apply as founding coach',
            cta_location: 'founding-band',
            destination: foundingFormUrl(),
        })
    }

    return (
        <section
            aria-labelledby="coach-apply-title"
            className="w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark-800 border-t border-white/[0.06]"
        >
            <div className="max-w-[1100px] mx-auto flex flex-col gap-10 sm:gap-12">
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
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5 sm:gap-6 items-stretch">
                    {/* Roster listing — featured */}
                    <div className="flex flex-col gap-5 rounded-2xl bg-dark ring-2 ring-white/30 shadow-[0_8px_40px_-12px_rgba(255,255,255,0.18)] p-6 sm:p-8">
                        <span className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/55">
                            Roster listing
                        </span>
                        <p className="font-satoshi font-bold text-[20px] sm:text-[24px] leading-[120%] tracking-[-0.015em] text-white">
                            Get found by athletes who actually fit your coaching style.
                        </p>
                        <p className="font-satoshi text-[15px] sm:text-[16px] leading-[155%] text-text-muted">
                            We connect you with athletes who actually fit your personality, communication preferences and style. Join the augo roster and let inbound do its job.
                        </p>
                        <a
                            href={matchingFormUrl('coach-band')}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleListingClick}
                            className="mt-auto self-start inline-flex items-center gap-2.5 font-mono text-sm font-extrabold tracking-[2px] uppercase text-dark rounded-lg px-6 py-3.5 bg-white hover:brightness-90 transition-all cursor-pointer"
                        >
                            Apply to be listed <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                        </a>
                    </div>

                    {/* Founding coach — deliberately quiet; for coaches who read the details */}
                    <div className="flex flex-col gap-4 rounded-2xl ring-1 ring-white/[0.08] p-6 sm:p-8">
                        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/45">
                            <Award className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
                            Founding coach
                        </span>
                        <p className="font-satoshi text-[14px] sm:text-[15px] leading-[150%] text-white/60">
                            An exclusive group co-creating augo.
                        </p>
                        <ul className="flex flex-col gap-2">
                            {FOUNDING_BENEFITS.map((benefit) => (
                                <li
                                    key={benefit}
                                    className="flex items-start gap-2.5 font-satoshi text-[13px] sm:text-[14px] leading-[145%] text-white/45"
                                >
                                    <Check
                                        className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-white/35"
                                        strokeWidth={2.5}
                                        aria-hidden="true"
                                    />
                                    {benefit}
                                </li>
                            ))}
                        </ul>
                        <p className="font-satoshi text-[11px] leading-[145%] text-white/30">
                            *Terms and conditions apply.
                        </p>
                        <a
                            href={foundingFormUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleFoundingClick}
                            className="mt-auto self-start inline-flex items-center gap-2 font-mono text-[12px] font-extrabold tracking-[2px] uppercase text-white/60 rounded-lg px-5 py-3 ring-1 ring-white/15 hover:text-white hover:ring-white/40 transition-all cursor-pointer bg-transparent"
                        >
                            Apply as founding coach <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
