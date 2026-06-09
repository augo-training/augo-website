import type { Coach } from '../../data/coaches/types'

interface Props {
    coach: Coach
}

export default function CoachBio({ coach }: Props) {
    return (
        <section
            aria-labelledby="bio-title"
            className="w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark border-t border-white/[0.06]"
        >
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_0.6fr] gap-12 lg:gap-16 items-start">
                <div className="flex flex-col gap-6">
                    <span className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/55">
                        About
                    </span>
                    <h2
                        id="bio-title"
                        className="font-satoshi font-bold text-[32px] sm:text-[44px] lg:text-[52px] leading-[110%] tracking-[-0.02em] text-white"
                    >
                        {coach.bio.short}
                    </h2>
                    <div className="flex flex-col gap-4 mt-4">
                        {coach.bio.long.map((para, i) => (
                            <p
                                key={i}
                                className="font-satoshi text-[17px] sm:text-[19px] leading-[160%] text-white/80 max-w-[640px]"
                            >
                                {para}
                            </p>
                        ))}
                    </div>
                </div>

                <aside className="lg:sticky lg:top-24 flex flex-col gap-4 p-6 sm:p-8 rounded-2xl bg-dark-800 ring-1 ring-white/[0.08]">
                    <span className="font-mono text-[10px] sm:text-[11px] tracking-[2.5px] uppercase text-white/45">
                        Coaching philosophy
                    </span>
                    <p className="font-satoshi font-medium text-[20px] sm:text-[22px] leading-[135%] tracking-[-0.01em] text-white">
                        "{coach.bio.philosophy}"
                    </p>
                    <span className="font-mono text-[10px] tracking-[2px] uppercase text-white/35 mt-2">
                        — {coach.firstName}
                    </span>
                </aside>
            </div>
        </section>
    )
}
