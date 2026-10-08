import gordon from '../../assets/images/advisor-gordon.png'
import reto from '../../assets/images/advisor-reto.png'
import david from '../../assets/images/session-zero-david.jpg'
import { COPY } from './constants'

const pad = (n: number) => String(n).padStart(2, '0')

/** Same order as COPY.confirmed.coaches. Gordon and Reto reuse the advisor portraits. */
const PHOTOS = [gordon, reto, david]

export default function SessionZeroConfirmed() {
    const { confirmed } = COPY

    return (
        <section
            aria-labelledby="session-zero-confirmed-title"
            className="w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark-800 border-t border-white/[0.06] texture-grain"
        >
            <div className="max-w-[1100px] mx-auto">
                <h2
                    id="session-zero-confirmed-title"
                    className="font-mono font-bold text-[28px] sm:text-[36px] lg:text-[44px] leading-[120%] text-white"
                >
                    {confirmed.title}
                </h2>

                <div className="mt-12 sm:mt-14 flex flex-col gap-5">
                    <div className="flex items-baseline justify-between gap-6 pb-5 border-b border-white/[0.10]">
                        <p className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/55">
                            {confirmed.label}
                        </p>
                        <p className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/30 tabular-nums">
                            {pad(confirmed.coaches.length)} / {pad(confirmed.seats)}
                        </p>
                    </div>

                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 lg:gap-8">
                        {confirmed.coaches.map(({ name, facts }, i) => (
                            <li key={name} className="group flex flex-col gap-4">
                                {/* Portraits sit in the page's black-and-white world, like the hero clip. */}
                                <div
                                    className="relative aspect-square w-full overflow-hidden rounded-2xl bg-dark-700 ring-1 ring-white/[0.10]"
                                    style={{ filter: 'drop-shadow(0 0 32px rgba(255,255,255,0.04))' }}
                                >
                                    <img
                                        src={PHOTOS[i]}
                                        alt={name}
                                        loading="lazy"
                                        className="w-full h-full object-cover grayscale contrast-[1.05] transition-[filter] duration-500 group-hover:grayscale-0"
                                    />
                                </div>
                                <div className="flex items-baseline gap-3 sm:gap-4">
                                    <span className="font-mono text-[11px] sm:text-[12px] tracking-[1.5px] text-white/35 tabular-nums">
                                        {pad(i + 1)}
                                    </span>
                                    <span className="font-satoshi font-bold text-[20px] sm:text-[22px] md:text-[24px] leading-[110%] tracking-[-0.015em] text-white">
                                        {name}
                                    </span>
                                </div>
                                <ul className="flex flex-col gap-2.5 pl-[23px] sm:pl-[27px]">
                                    {facts.map((fact) => (
                                        <li key={fact} className="flex gap-3 font-satoshi text-[15px] sm:text-[16px] leading-[150%] text-text-muted">
                                            {/* A short rule as the bullet, so the list stays in the spec-sheet idiom. */}
                                            <span aria-hidden="true" className="mt-[0.7em] h-px w-3 flex-none bg-white/30" />
                                            <span>{fact}</span>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}
