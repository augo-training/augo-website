import { COPY } from './constants'

/** The last line on the page: who, where, when. */
export default function SessionZeroClosing() {
    const { closing } = COPY

    return (
        <section className="w-full py-10 sm:py-12 px-5 sm:px-8 bg-dark border-t border-white/[0.06] texture-grain">
            <div className="max-w-[1100px] mx-auto">
                <p className="font-mono text-[11px] tracking-[2.5px] uppercase text-white/40">
                    {closing.footer}
                </p>
            </div>
        </section>
    )
}
