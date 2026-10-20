import heroVideo from '../../assets/videos/racing-team-hero.mp4'
import heroPoster from '../../assets/images/racing-team-hero-poster.jpg'
import ApplyButton from './ApplyButton'
import { COPY } from './constants'

export default function RacingTeamHero() {
    const { hero } = COPY

    return (
        // No texture-grain here: it forces every direct child to position: relative,
        // which would pull the video out of its absolute full-bleed layer.
        <section className="relative w-full min-h-[82svh] flex flex-col justify-end overflow-hidden bg-dark px-5 sm:px-8 pt-32 pb-16 sm:pt-40 sm:pb-20">
            {/* The team shoot clip, full bleed behind the copy. Hidden for
                reduced-motion, where the poster frame takes its place. */}
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
            />
            <img
                src={heroPoster}
                alt=""
                aria-hidden="true"
                className="hidden motion-reduce:block absolute inset-0 w-full h-full object-cover"
            />

            {/* Readability: an even dim, then a fade to the next section's
                background (bg-dark-800) at the bottom and a thin band behind
                the navbar at the top. */}
            <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{ backgroundColor: 'rgba(10,10,10,0.55)' }}
            />
            <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                    background:
                        'linear-gradient(to top, #111111 2%, rgba(17,17,17,0) 45%), linear-gradient(to bottom, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0) 22%)',
                }}
            />

            <div className="relative z-10 w-full max-w-[1100px] mx-auto flex flex-col gap-6 sm:gap-8">
                <span className="font-mono text-[12px] tracking-[3px] uppercase text-white">
                    {hero.eyebrow}
                </span>
                <h1 className="font-satoshi font-bold text-[40px] sm:text-[56px] md:text-[68px] lg:text-[80px] xl:text-[88px] leading-[100%] tracking-[-0.03em] text-white">
                    {hero.title.map((line) => (
                        <span key={line} className="block">{line}</span>
                    ))}
                </h1>
                {/* One line on desktop: the sentence is short enough to fit the
                    content width from lg up, so it is kept unbroken there. */}
                <p className="font-satoshi font-medium text-[20px] sm:text-[24px] md:text-[26px] leading-[140%] tracking-[-0.005em] text-white/85 lg:whitespace-nowrap">
                    {hero.body}
                </p>
                <div className="flex flex-col gap-3 mt-2 sm:mt-4">
                    <ApplyButton location="racing_team_hero" label={hero.cta} />
                    <p className="font-mono text-[11px] sm:text-[12px] tracking-[2.5px] uppercase text-white/55">
                        {hero.deadline}
                    </p>
                </div>
            </div>
        </section>
    )
}
