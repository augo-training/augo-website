import SpecList from './SpecList'
import { COPY } from './constants'

export default function RacingTeamWhatYouGet() {
    const { whatYouGet } = COPY

    return (
        <section
            id="what-the-duo-gets"
            aria-labelledby="what-the-duo-gets-title"
            className="w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark-800 border-t border-white/[0.06] texture-grain"
        >
            <div className="max-w-[1100px] mx-auto">
                <h2
                    id="what-the-duo-gets-title"
                    className="font-mono font-bold text-[28px] sm:text-[36px] lg:text-[44px] leading-[120%] text-white"
                >
                    {whatYouGet.title}
                </h2>
                <p className="font-satoshi text-[16px] sm:text-[18px] leading-[160%] text-text-muted mt-3 max-w-[640px]">
                    {whatYouGet.lead}
                </p>

                <div className="mt-12 sm:mt-14 flex flex-col gap-14 sm:gap-16">
                    {whatYouGet.groups.map((group, i) => (
                        <div key={group.label} className="flex flex-col gap-5">
                            <h3 className="font-satoshi font-bold text-[28px] sm:text-[40px] md:text-[48px] leading-[100%] tracking-[-0.025em] text-white">
                                <span className="font-mono text-[12px] sm:text-[14px] tracking-[2px] text-white/35 tabular-nums align-middle mr-4">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                {group.label}
                            </h3>
                            {'lead' in group && group.lead && (
                                <p className="font-satoshi text-[16px] sm:text-[18px] leading-[160%] text-text-muted max-w-[640px] -mt-1 mb-1">
                                    {group.lead}
                                </p>
                            )}
                            <SpecList label="What's included" items={group.items} />
                            {'note' in group && group.note && (
                                <p className="font-mono text-[11px] sm:text-[12px] tracking-[2.5px] uppercase text-white/40">
                                    {group.note}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
