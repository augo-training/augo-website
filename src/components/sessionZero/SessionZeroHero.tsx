import type { CSSProperties } from 'react'
import augoLogo from '../../assets/images/augo_footer_1.svg'
import heroVideo from '../../assets/videos/session-zero-hero.mp4'
import heroPoster from '../../assets/images/session-zero-hero-poster.jpg'
import { COPY, EVENT } from './constants'

const LABEL = 'font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/55'
const VALUE = 'font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white text-right'

/**
 * The clip is black and white on bright concrete, so it is pulled down before
 * any overlay touches it. The swimmer sits a little above centre.
 */
const MEDIA_STYLE: CSSProperties = {
    objectPosition: '50% 40%',
    filter: 'brightness(0.7) contrast(1.05)',
}

export default function SessionZeroHero() {
    const { hero } = COPY
    const rows: Array<[string, string]> = [
        [hero.labels.date, EVENT.date],
        [hero.labels.city, EVENT.city],
        [hero.labels.location, EVENT.location],
        [hero.labels.hours, EVENT.hours],
        [hero.labels.seats, EVENT.seats],
    ]

    return (
        // No texture-grain here: it forces every direct child to position: relative,
        // which would pull the video out of its absolute full-bleed layer.
        <section className="relative w-full min-h-[100svh] flex flex-col overflow-hidden bg-dark px-5 sm:px-8 pt-10 sm:pt-14 pb-16 sm:pb-20">
            {/* The swimmer on the block, the dive, and a dip to black at both ends
                so the loop passes through the page's own background. */}
            <video
                src={heroVideo}
                poster={heroPoster}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover motion-reduce:hidden"
                style={MEDIA_STYLE}
            />
            <img
                src={heroPoster}
                alt=""
                aria-hidden="true"
                className="hidden motion-reduce:block absolute inset-0 w-full h-full object-cover"
                style={MEDIA_STYLE}
            />

            {/* Readability: an even dim, then black pulled in from the left behind
                the headline, from the bottom behind the facts table and into the
                next section, and a thin band behind the masthead. */}
            <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{ backgroundColor: 'rgba(10,10,10,0.45)' }}
            />
            <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                    background: [
                        'linear-gradient(to right, #0A0A0A 0%, rgba(10,10,10,0.85) 30%, rgba(10,10,10,0) 70%)',
                        'linear-gradient(to top, #0A0A0A 0%, rgba(10,10,10,0.9) 22%, rgba(10,10,10,0) 55%)',
                        'linear-gradient(to bottom, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0) 18%)',
                    ].join(', '),
                }}
            />

            <div className="relative z-10 w-full max-w-[1100px] mx-auto flex flex-col flex-1">
                {/* Masthead: the mark on the left, the nature of the page on the right. */}
                <div className="flex items-center justify-between gap-6 pb-6 border-b border-white/[0.10]">
                    <img src={augoLogo} alt="augo" className="h-5 w-auto" />
                    <p className={LABEL}>{hero.mark}</p>
                </div>

                {/* Anchored to the bottom of the first screen. */}
                <div className="mt-auto pt-24 sm:pt-32 flex flex-col gap-6 sm:gap-8">
                    <span className="font-mono text-[12px] tracking-[3px] uppercase text-white">
                        {hero.eyebrow}
                    </span>
                    <h1 className="font-satoshi font-bold text-[40px] sm:text-[56px] md:text-[68px] lg:text-[80px] xl:text-[88px] leading-[100%] tracking-[-0.03em] text-white">
                        {hero.title.map((line) => (
                            <span key={line} className="block">
                                {line}
                            </span>
                        ))}
                    </h1>
                    <p className="font-satoshi font-medium text-[20px] sm:text-[24px] md:text-[26px] leading-[140%] tracking-[-0.005em] text-white/85 max-w-[760px]">
                        {hero.lead}
                    </p>

                    {/* Document header: the facts of the day. */}
                    <dl className="mt-6 sm:mt-10 flex flex-col gap-3 py-5 border-y border-white/[0.10]">
                        {rows.map(([label, value]) => (
                            <div key={label} className="flex items-baseline justify-between gap-6">
                                <dt className={LABEL}>{label}</dt>
                                <dd className={VALUE}>{value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    )
}
