import { COPY } from './constants'

export default function SessionZeroAuthors() {
    const { authors } = COPY

    return (
        <section
            aria-labelledby="session-zero-authors-title"
            className="w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark border-t border-white/[0.06] texture-grain"
        >
            <div className="max-w-[1100px] mx-auto">
                <h2
                    id="session-zero-authors-title"
                    className="font-mono font-bold text-[28px] sm:text-[36px] lg:text-[44px] leading-[120%] text-white"
                >
                    {authors.title}
                </h2>
                <p className="mt-4 sm:mt-5 font-satoshi font-medium text-[20px] sm:text-[24px] leading-[130%] text-white">
                    {authors.lead}
                </p>
            </div>
        </section>
    )
}
