import ApplyButton from './ApplyButton'
import { COPY } from './constants'

export default function RacingTeamFinalCta() {
    const { finalCta } = COPY

    return (
        <section className="w-full py-20 sm:py-28 px-5 sm:px-8 bg-dark border-t border-white/[0.06] texture-grain">
            <div className="max-w-[1100px] mx-auto">
                {/* Document header: status and deadline */}
                <div className="flex flex-col gap-2 pb-5 border-b border-white/[0.10]">
                    <div className="flex items-baseline justify-between gap-6">
                        <p className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/55">
                            {finalCta.statusLabel}
                        </p>
                        <p className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FFCA1E] mr-2 align-middle" aria-hidden="true" />
                            {finalCta.statusValue}
                        </p>
                    </div>
                    <div className="flex items-baseline justify-between gap-6">
                        <p className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/55">
                            {finalCta.deadlineLabel}
                        </p>
                        <p className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white">
                            {finalCta.deadlineValue}
                        </p>
                    </div>
                </div>

                <div className="mt-10 sm:mt-12 flex flex-col gap-2 max-w-[700px]">
                    {finalCta.note.map((line, i) => (
                        <p
                            key={line}
                            className={`font-satoshi text-[17px] sm:text-[19px] leading-[150%] ${
                                i === finalCta.note.length - 1 ? 'text-white' : 'text-text-muted'
                            }`}
                        >
                            {line}
                        </p>
                    ))}
                </div>

                <h2 className="mt-16 sm:mt-20 font-satoshi font-bold text-[56px] sm:text-[88px] md:text-[112px] lg:text-[140px] xl:text-[160px] leading-[90%] tracking-[-0.04em] text-white">
                    {finalCta.title.map((line) => (
                        <span key={line} className="block">{line}</span>
                    ))}
                </h2>

                <div className="mt-10 sm:mt-12 flex flex-col gap-1 max-w-[640px]">
                    <p className="font-satoshi font-medium text-[18px] sm:text-[22px] leading-[140%] text-white">
                        {finalCta.subtitle1}
                    </p>
                    <p className="font-satoshi text-[17px] sm:text-[20px] leading-[150%] text-text-muted">
                        {finalCta.subtitle2}
                    </p>
                </div>

                <div className="mt-10 sm:mt-12 flex flex-col gap-6">
                    <ApplyButton location="racing_team_final_cta" label={finalCta.cta} />
                </div>
            </div>
        </section>
    )
}
