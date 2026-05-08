import { useTranslation } from 'react-i18next'

export default function HumanEdgeWhat() {
    const { t } = useTranslation()
    const negatives = t('humanEdge.what.negatives', { returnObjects: true }) as string[]
    const positives = t('humanEdge.what.positives', { returnObjects: true }) as string[]

    return (
        <section id="what-is-the-human-edge" aria-labelledby="what-is-the-human-edge-title" className="w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark-800">
            <div className="max-w-[900px] mx-auto flex flex-col gap-8 text-center">
                <h2 id="what-is-the-human-edge-title" className="font-mono font-bold text-[28px] sm:text-[36px] lg:text-[44px] leading-[120%] text-white">
                    {t('humanEdge.what.title')}
                </h2>
                <p className="font-satoshi text-[18px] sm:text-[20px] text-yellow font-medium">
                    {t('humanEdge.what.lead')}
                </p>
                <p className="font-satoshi text-[16px] sm:text-[18px] leading-[160%] text-text-muted max-w-[720px] mx-auto">
                    {t('humanEdge.what.body')}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 max-w-[600px] mx-auto w-full">
                    <div className="flex flex-col gap-2 items-center sm:items-end sm:pr-6 sm:border-r border-dark-600">
                        {negatives.map((line, i) => (
                            <p key={i} className="font-satoshi text-[16px] text-text-muted line-through">
                                {line}
                            </p>
                        ))}
                    </div>
                    <div className="flex flex-col gap-2 items-center sm:items-start sm:pl-6">
                        {positives.map((line, i) => (
                            <p key={i} className="font-satoshi font-bold text-[16px] text-white">
                                {line}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
