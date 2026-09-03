import { COPY } from './constants'

/**
 * Hook, the offer, and who it comes from. No section wrapper or padding of its
 * own — the page owns the layout, because the whole thing has to fit inside one
 * screen.
 */
export default function NiceAthletesHero() {
    return (
        <div className="flex flex-col gap-2 sm:gap-5">
            <span className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/55">
                {COPY.eyebrow}
            </span>
            <h1 className="font-satoshi font-bold text-[32px] sm:text-[48px] md:text-[60px] leading-[105%] tracking-[-0.03em] text-white max-w-[15ch] sm:max-w-[18ch]">
                {COPY.title}
            </h1>
            <p className="font-satoshi font-medium text-[17px] sm:text-[21px] md:text-[23px] leading-[140%] tracking-[-0.005em] text-white/85 max-w-[600px]">
                {COPY.subtitle}
            </p>
            <p className="font-mono text-[11px] sm:text-[12px] tracking-[2.5px] uppercase text-white/55">
                {COPY.note}
            </p>
        </div>
    )
}
