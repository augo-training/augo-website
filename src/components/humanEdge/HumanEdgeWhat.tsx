import { useTranslation } from 'react-i18next'

export default function HumanEdgeWhat() {
    const { t } = useTranslation()
    const callout = t('humanEdge.what.callout', { returnObjects: true }) as string[]

    return (
        <section
            id="what-is-the-human-edge"
            aria-labelledby="what-is-the-human-edge-title"
            className="w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark-800 border-t border-white/[0.06] texture-grain"
        >
            <div className="max-w-[1100px] mx-auto">
                <h2
                    id="what-is-the-human-edge-title"
                    className="font-mono font-bold text-[28px] sm:text-[36px] lg:text-[44px] leading-[120%] text-white"
                >
                    {t('humanEdge.what.title')}
                </h2>

                <div className="mt-4 sm:mt-5 flex flex-col gap-2 max-w-[760px]">
                    <p className="font-satoshi font-medium text-[20px] sm:text-[24px] leading-[130%] text-white">
                        {t('humanEdge.what.lead')}
                    </p>
                    <p className="font-satoshi text-[16px] sm:text-[18px] leading-[160%] text-text-muted">
                        {t('humanEdge.what.body')}
                    </p>
                </div>

                <div className="mt-12 sm:mt-16 pt-12 sm:pt-16 border-t border-white/[0.10]">
                    <ul className="flex flex-col">
                        {callout.map((line, i) => (
                            <li
                                key={i}
                                className={`font-satoshi font-bold text-[28px] sm:text-[44px] md:text-[56px] lg:text-[64px] leading-[100%] tracking-[-0.025em] text-white py-5 sm:py-7 ${i > 0 ? 'border-t border-white/[0.08]' : ''}`}
                            >
                                {line}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}
