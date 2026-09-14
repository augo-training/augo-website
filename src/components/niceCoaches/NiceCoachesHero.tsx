import { COPY } from './constants'

/**
 * Eyebrow, hook, offer. No section wrapper or padding of its own — the page owns
 * the layout, because the whole thing has to fit inside one screen.
 *
 * Three lines, not the athletes page's four: this title is long enough that a
 * mono line under the subtitle costs an iPhone SE its one-screen fit. The h1's
 * max-w keeps it in a left column, clear of the bright side of the photo — do
 * not widen it.
 */
export default function NiceCoachesHero() {
    return (
        <div className="flex flex-col gap-2 sm:gap-5">
            <span className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/55">
                {COPY.eyebrow}
            </span>
            <h1 className="font-satoshi font-bold text-[32px] sm:text-[48px] md:text-[60px] leading-[105%] tracking-[-0.03em] text-white max-w-[20ch] sm:max-w-[22ch]">
                {COPY.title}
            </h1>
            <p className="font-satoshi font-medium text-[17px] sm:text-[21px] md:text-[23px] leading-[140%] tracking-[-0.005em] text-white/85 max-w-[600px]">
                {COPY.subtitle}
            </p>
        </div>
    )
}
