import { COPY } from './constants'

export default function RacingTeamWhat() {
    const { what } = COPY

    return (
        <section
            id="what-it-is"
            aria-labelledby="what-it-is-title"
            className="w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark-800 border-t border-white/[0.06] texture-grain"
        >
            <div className="max-w-[1100px] mx-auto">
                <h2
                    id="what-it-is-title"
                    className="font-mono font-bold text-[28px] sm:text-[36px] lg:text-[44px] leading-[120%] text-white"
                >
                    {what.title}
                </h2>

                <div className="mt-4 sm:mt-5 flex flex-col gap-3">
                    {/* One line on desktop, like the hero subtitle. */}
                    <p className="font-satoshi font-medium text-[20px] sm:text-[24px] leading-[130%] text-white lg:whitespace-nowrap">
                        {what.lead}
                    </p>
                    {/* Each sentence on its own line, unbroken on desktop. */}
                    <div className="flex flex-col gap-2 font-satoshi text-[16px] sm:text-[18px] leading-[160%] text-text-muted">
                        {what.body.map((line) => <p key={line} className="lg:whitespace-nowrap">{line}</p>)}
                    </div>
                </div>

                <div className="mt-12 sm:mt-16 pt-12 sm:pt-16 border-t border-white/[0.10]">
                    <ul className="flex flex-col">
                        {what.callout.map((line, i) => (
                            <li
                                key={line}
                                className={`font-satoshi font-bold text-[28px] sm:text-[44px] md:text-[56px] lg:text-[64px] leading-[100%] tracking-[-0.025em] text-white py-5 sm:py-7 ${i > 0 ? 'border-t border-white/[0.08]' : ''}`}
                            >
                                {line}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}
