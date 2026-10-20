import { COPY } from './constants'

export default function RacingTeamTimeline() {
    const { timeline } = COPY

    return (
        <section
            id="how-the-year-runs"
            aria-labelledby="how-the-year-runs-title"
            className="w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark-800 border-t border-white/[0.06] texture-grain"
        >
            <div className="max-w-[1100px] mx-auto">
                <h2
                    id="how-the-year-runs-title"
                    className="font-mono font-bold text-[28px] sm:text-[36px] lg:text-[44px] leading-[120%] text-white"
                >
                    {timeline.title}
                </h2>
                <p className="font-satoshi font-medium text-[20px] sm:text-[24px] leading-[130%] text-white mt-4 sm:mt-5 max-w-[640px]">
                    {timeline.lead}
                </p>

                <div className="mt-12 sm:mt-16 flex flex-col gap-5">
                    <div className="flex items-baseline justify-between gap-6">
                        <p className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/55">
                            {timeline.listLabel}
                        </p>
                        <p className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/30 tabular-nums">
                            {String(timeline.items.length).padStart(2, '0')} / {String(timeline.items.length).padStart(2, '0')}
                        </p>
                    </div>

                    <ol className="flex flex-col">
                        {timeline.items.map((item) => (
                            <li
                                key={item.title}
                                className="group grid grid-cols-1 sm:grid-cols-[180px_1fr] items-baseline gap-y-2 gap-x-4 sm:gap-x-8 py-5 sm:py-7 border-t border-white/[0.08] last:border-b last:border-white/[0.08] transition-colors duration-200 hover:bg-white/[0.015]"
                            >
                                <span className="font-mono text-[11px] sm:text-[12px] tracking-[1.5px] uppercase text-white/35 tabular-nums group-hover:text-white/60 transition-colors duration-200">
                                    {item.when}
                                </span>
                                <div className="flex flex-col gap-2">
                                    <span className="font-satoshi font-bold text-[20px] sm:text-[26px] md:text-[30px] leading-[110%] tracking-[-0.015em] uppercase text-white">
                                        {item.title}
                                    </span>
                                    <span className="font-satoshi text-[15px] sm:text-[17px] leading-[150%] text-text-muted">
                                        {item.detail}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </section>
    )
}
