import type { Coach } from '../../data/coaches/types'

interface Props {
    coach: Coach
}

export default function CoachCredentialsAndStats({ coach }: Props) {
    const stats: { label: string; value: string }[] = []
    if (coach.yearsCoaching !== undefined) {
        stats.push({ label: 'Years coaching', value: `${coach.yearsCoaching}` })
    }
    if (coach.athletesCoached) {
        stats.push({ label: 'Athletes coached', value: `${coach.athletesCoached}+` })
    }
    stats.push({ label: 'Credentials', value: `${coach.credentials.length}` })
    stats.push({ label: 'Languages', value: `${coach.languages.length}` })

    return (
        <section
            aria-labelledby="credentials-title"
            className="w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark-800 border-t border-white/[0.06]"
        >
            <div className="max-w-[1200px] mx-auto">
                <div className="flex flex-col gap-3">
                    <span className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/55">
                        Credentials & track record
                    </span>
                    <h2
                        id="credentials-title"
                        className="font-satoshi font-bold text-[28px] sm:text-[36px] lg:text-[44px] leading-[110%] tracking-[-0.02em] text-white"
                    >
                        The receipts.
                    </h2>
                </div>

                {/* Stat ribbon */}
                <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden ring-1 ring-white/[0.06]">
                    {stats.map((s) => (
                        <div key={s.label} className="bg-dark-800 p-6 sm:p-8 flex flex-col gap-2">
                            <span className="font-mono text-[10px] sm:text-[11px] tracking-[2.5px] uppercase text-white/45">
                                {s.label}
                            </span>
                            <span className="font-satoshi font-bold text-[40px] sm:text-[56px] leading-[100%] tracking-[-0.02em] text-white">
                                {s.value}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Credentials list */}
                <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-3">
                    <div className="flex flex-col gap-3">
                        <span className="font-mono text-[10px] sm:text-[11px] tracking-[2.5px] uppercase text-white/45">
                            Certifications
                        </span>
                        <ul className="flex flex-col">
                            {coach.credentials.map((c, i) => (
                                <li
                                    key={c}
                                    className="grid grid-cols-[28px_1fr] sm:grid-cols-[36px_1fr] items-baseline gap-3 sm:gap-6 py-4 border-t border-white/[0.08] last:border-b last:border-white/[0.08]"
                                >
                                    <span className="font-mono text-[11px] tracking-[1.5px] text-white/35 tabular-nums">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <span className="font-satoshi font-medium text-[15px] sm:text-[17px] text-white">
                                        {c}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {coach.notableResults && coach.notableResults.length > 0 && (
                        <div className="flex flex-col gap-3">
                            <span className="font-mono text-[10px] sm:text-[11px] tracking-[2.5px] uppercase text-white/45">
                                Notable results
                            </span>
                            <ul className="flex flex-col">
                                {coach.notableResults.map((r, i) => (
                                    <li
                                        key={r}
                                        className="grid grid-cols-[28px_1fr] sm:grid-cols-[36px_1fr] items-baseline gap-3 sm:gap-6 py-4 border-t border-white/[0.08] last:border-b last:border-white/[0.08]"
                                    >
                                        <span className="font-mono text-[11px] tracking-[1.5px] text-white/35 tabular-nums">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <span className="font-satoshi font-medium text-[15px] sm:text-[17px] text-white">
                                            {r}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
