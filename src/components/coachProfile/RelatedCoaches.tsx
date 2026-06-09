import { getRelatedCoaches } from '../../data/coaches'
import CoachCard from '../coachDirectory/CoachCard'

interface Props {
    currentSlug: string
}

export default function RelatedCoaches({ currentSlug }: Props) {
    const related = getRelatedCoaches(currentSlug, 3)
    if (related.length === 0) return null

    return (
        <section
            aria-labelledby="related-coaches-title"
            className="w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark-800 border-t border-white/[0.06]"
        >
            <div className="max-w-[1200px] mx-auto">
                <div className="flex items-baseline justify-between gap-6 mb-8 sm:mb-10 flex-wrap">
                    <div className="flex flex-col gap-2">
                        <span className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/55">
                            Also on the roster
                        </span>
                        <h2
                            id="related-coaches-title"
                            className="font-satoshi font-bold text-[28px] sm:text-[36px] lg:text-[44px] leading-[110%] tracking-[-0.02em] text-white"
                        >
                            Other coaches you might fit.
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    {related.map((coach) => (
                        <CoachCard key={coach.slug} coach={coach} />
                    ))}
                </div>
            </div>
        </section>
    )
}
