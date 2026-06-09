import { ArrowRight } from 'lucide-react'
import type { Coach } from '../../data/coaches/types'

interface Props {
    coach: Coach
    onContact: () => void
}

export default function CoachFinalCta({ coach, onContact }: Props) {
    return (
        <section
            aria-labelledby="final-cta-title"
            className="w-full py-24 sm:py-32 px-5 sm:px-8 bg-dark border-t border-white/[0.06] texture-grain"
        >
            <div className="max-w-[1100px] mx-auto flex flex-col gap-8">
                <span className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/55">
                    Ready when you are
                </span>
                <h2
                    id="final-cta-title"
                    className="font-satoshi font-bold text-[40px] sm:text-[64px] md:text-[80px] lg:text-[96px] leading-[100%] tracking-[-0.03em] text-white"
                >
                    Train with
                    <br />
                    {coach.firstName}.
                </h2>
                <p className="font-satoshi font-medium text-[20px] sm:text-[24px] leading-[140%] tracking-[-0.01em] text-white/80 max-w-[680px]">
                    Tell {coach.firstName} a bit about you. We'll forward your interest and follow up within 48 hours.
                </p>
                <button
                    type="button"
                    onClick={onContact}
                    className="btn-gradient self-start inline-flex items-center gap-2.5 font-mono text-sm font-extrabold tracking-[2px] uppercase text-white rounded-lg cursor-pointer hover:brightness-110 transition-all duration-200"
                    style={{ minWidth: '260px', height: '52px', paddingLeft: '24px', paddingRight: '24px' }}
                >
                    Work with {coach.firstName}
                    <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </button>
            </div>
        </section>
    )
}
