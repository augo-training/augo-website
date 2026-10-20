import SpecList from './SpecList'
import { COPY } from './constants'

export default function RacingTeamWhatWeAsk() {
    const { whatWeAsk } = COPY

    return (
        <section
            id="what-we-ask"
            aria-labelledby="what-we-ask-title"
            className="w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark border-t border-white/[0.06] texture-grain"
        >
            <div className="max-w-[1100px] mx-auto">
                <h2
                    id="what-we-ask-title"
                    className="font-mono font-bold text-[28px] sm:text-[36px] lg:text-[44px] leading-[120%] text-white"
                >
                    {whatWeAsk.title}
                </h2>
                <p className="font-satoshi font-medium text-[20px] sm:text-[24px] leading-[130%] text-white mt-4 sm:mt-5 max-w-[760px]">
                    {whatWeAsk.lead}
                </p>

                <div className="mt-12 sm:mt-14">
                    <SpecList label={whatWeAsk.listLabel} items={whatWeAsk.items} />
                </div>

                <p className="mt-10 sm:mt-12 font-satoshi text-[17px] sm:text-[19px] leading-[150%] text-text-muted max-w-[700px]">
                    {whatWeAsk.note}
                </p>
            </div>
        </section>
    )
}
