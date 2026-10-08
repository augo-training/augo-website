import { COPY } from './constants'

const pad = (n: number) => String(n).padStart(2, '0')

export default function SessionZeroLeaveWith() {
    const { leaveWith } = COPY
    const count = pad(leaveWith.items.length)

    return (
        <section
            aria-labelledby="session-zero-leave-with-title"
            className="w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark border-t border-white/[0.06] texture-grain"
        >
            <div className="max-w-[1100px] mx-auto">
                <h2
                    id="session-zero-leave-with-title"
                    className="font-mono font-bold text-[28px] sm:text-[36px] lg:text-[44px] leading-[120%] text-white"
                >
                    {leaveWith.title}
                </h2>

                <div className="mt-12 sm:mt-14 flex flex-col gap-5">
                    <div className="flex items-baseline justify-between gap-6">
                        <p className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/55">
                            {leaveWith.label}
                        </p>
                        <p className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/30 tabular-nums">
                            {count} / {count}
                        </p>
                    </div>

                    <dl className="flex flex-col">
                        {leaveWith.items.map((item, i) => (
                            <div
                                key={item.label}
                                className="group grid grid-cols-[28px_minmax(80px,120px)_1fr] sm:grid-cols-[36px_minmax(100px,150px)_1fr] items-baseline gap-x-3 sm:gap-x-6 py-5 sm:py-6 border-t border-white/[0.08] last:border-b last:border-white/[0.08] transition-colors duration-200 hover:bg-white/[0.015]"
                            >
                                <span className="font-mono text-[11px] sm:text-[12px] tracking-[1.5px] text-white/35 tabular-nums">
                                    {pad(i + 1)}
                                </span>
                                <dt className="font-mono text-[11px] sm:text-[12px] tracking-[2.5px] uppercase text-white/55 group-hover:text-white/80 transition-colors duration-200">
                                    {item.label}
                                </dt>
                                <dd className="font-satoshi font-medium text-[15px] sm:text-[18px] leading-[140%] text-white">
                                    {item.statement}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    )
}
