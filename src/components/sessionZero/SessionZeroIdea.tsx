import { COPY } from './constants'

export default function SessionZeroIdea() {
    const { idea } = COPY

    return (
        <section
            aria-labelledby="session-zero-idea-title"
            className="w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark-800 border-t border-white/[0.06] texture-grain"
        >
            <div className="max-w-[1100px] mx-auto">
                <h2
                    id="session-zero-idea-title"
                    className="font-mono font-bold text-[28px] sm:text-[36px] lg:text-[44px] leading-[120%] text-white"
                >
                    {idea.title}
                </h2>

                <div className="mt-4 sm:mt-5 flex flex-col gap-3">
                    <p className="font-satoshi font-medium text-[20px] sm:text-[24px] leading-[130%] text-white">
                        {idea.lead}
                    </p>
                    {idea.body.map((line) => (
                        <p
                            key={line}
                            className="font-satoshi text-[18px] sm:text-[21px] leading-[150%] text-white"
                        >
                            {line}
                        </p>
                    ))}
                </div>

                {/* Two full sentences, so they wrap on their own; one block each,
                    with a gap between, rather than one forced line per entry. */}
                <p className="mt-12 sm:mt-16 pt-12 sm:pt-16 border-t border-white/[0.10] flex flex-col gap-6 sm:gap-8 font-satoshi font-bold text-[36px] sm:text-[56px] md:text-[72px] lg:text-[88px] leading-[95%] tracking-[-0.03em] text-white">
                    {idea.statement.map((line) => (
                        <span key={line} className="block">
                            {line}
                        </span>
                    ))}
                </p>
            </div>
        </section>
    )
}
