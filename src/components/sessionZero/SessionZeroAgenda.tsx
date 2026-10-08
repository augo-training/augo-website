import { useTrackSectionView } from '../../hooks/useTrackSectionView'
import { AGENDA, COPY, SESSION_ZERO_PATH } from './constants'

const pad = (n: number) => String(n).padStart(2, '0')

/** Time | title and note | owner | duration. On a phone the last two fold under the time. */
const ROW_GRID = 'grid grid-cols-[76px_1fr] sm:grid-cols-[120px_1fr_120px_72px] items-baseline gap-x-4 sm:gap-x-8'
const META = 'font-mono text-[11px] sm:text-[12px] tracking-[1.5px] uppercase text-white/35 tabular-nums'

export default function SessionZeroAgenda() {
    const { agenda } = COPY
    const ref = useTrackSectionView('agenda', SESSION_ZERO_PATH)
    const count = pad(AGENDA.length)

    return (
        <section
            aria-labelledby="session-zero-agenda-title"
            className="w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark-800 border-t border-white/[0.06] texture-grain"
        >
            <div ref={ref} className="max-w-[1100px] mx-auto">
                <h2
                    id="session-zero-agenda-title"
                    className="font-mono font-bold text-[28px] sm:text-[36px] lg:text-[44px] leading-[120%] text-white"
                >
                    {agenda.title}
                </h2>
                <p className="mt-4 sm:mt-5 font-satoshi font-medium text-[20px] sm:text-[24px] leading-[130%] text-white max-w-[640px]">
                    {agenda.lead}
                </p>

                <div className="mt-12 sm:mt-16 flex flex-col gap-5">
                    {/* Column captions, on the same grid as the rows. */}
                    <div className={ROW_GRID}>
                        <p className="col-span-2 sm:col-span-2 font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/55">
                            {agenda.label}
                        </p>
                        <p className="hidden sm:block font-mono text-[12px] tracking-[3px] uppercase text-white/55">
                            {agenda.ownerLabel}
                        </p>
                        <p className="hidden sm:block font-mono text-[12px] tracking-[3px] uppercase text-white/30 tabular-nums text-right">
                            {count} / {count}
                        </p>
                    </div>

                    <ol className="flex flex-col">
                        {AGENDA.map((item) => {
                            const isBreak = item.kind === 'break'
                            return (
                                <li
                                    key={item.time}
                                    className={`group ${ROW_GRID} border-t border-white/[0.08] last:border-b last:border-white/[0.08] transition-colors duration-200 hover:bg-white/[0.015] ${
                                        isBreak ? 'py-4 sm:py-5' : 'py-5 sm:py-7'
                                    }`}
                                >
                                    <span className={`flex flex-col gap-1 ${META} group-hover:text-white/60 transition-colors duration-200`}>
                                        {item.time}
                                        {/* On a phone the owner and duration sit under the time, so the note keeps its width. */}
                                        {item.owner && <span className="sm:hidden text-white/55">{item.owner}</span>}
                                        {item.minutes && <span className="sm:hidden">{item.minutes} min</span>}
                                    </span>
                                    <div className="flex flex-col">
                                        {isBreak ? (
                                            <span className="font-mono text-[11px] sm:text-[12px] tracking-[2.5px] uppercase text-white/55">
                                                {item.title}
                                            </span>
                                        ) : (
                                            <span className="font-satoshi font-bold text-[20px] sm:text-[26px] md:text-[30px] leading-[110%] tracking-[-0.015em] uppercase text-white">
                                                {item.title}
                                            </span>
                                        )}
                                        {item.note && (
                                            <p className="mt-2 sm:mt-3 font-satoshi text-[15px] sm:text-[17px] leading-[150%] text-text-muted max-w-[640px]">
                                                {item.note}
                                            </p>
                                        )}
                                    </div>
                                    <span className="hidden sm:block font-mono text-[12px] tracking-[2.5px] uppercase text-white/55">
                                        {item.owner ?? ''}
                                    </span>
                                    <span className={`hidden sm:block text-right whitespace-nowrap ${META}`}>
                                        {item.minutes ? `${item.minutes} min` : ''}
                                    </span>
                                </li>
                            )
                        })}
                    </ol>
                </div>
            </div>
        </section>
    )
}
