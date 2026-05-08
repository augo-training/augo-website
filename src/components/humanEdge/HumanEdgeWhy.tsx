import { useTranslation } from 'react-i18next'

export default function HumanEdgeWhy() {
    const { t } = useTranslation()
    const items = t('humanEdge.why.items', { returnObjects: true }) as string[]

    return (
        <section className="w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark-800">
            <div className="max-w-[900px] mx-auto flex flex-col gap-6">
                <h2 className="font-mono font-bold text-[28px] sm:text-[36px] lg:text-[44px] leading-[120%] text-white">
                    {t('humanEdge.why.title')}
                </h2>
                <p className="font-satoshi font-medium text-[18px] sm:text-[22px] leading-[150%] text-white">
                    {t('humanEdge.why.lead')}
                </p>
                <p className="font-satoshi text-[16px] sm:text-[18px] leading-[170%] text-text-muted">
                    {t('humanEdge.why.body1')}
                </p>
                <p className="font-satoshi text-[16px] sm:text-[18px] leading-[170%] text-text-muted">
                    {t('humanEdge.why.body2')}
                </p>
                <p className="font-mono text-[14px] tracking-[1px] uppercase text-yellow mt-4">
                    {t('humanEdge.why.subtitle')}
                </p>
                <ul className="flex flex-col gap-3 mt-2">
                    {items.map((item, i) => (
                        <li
                            key={i}
                            className="flex items-start gap-3 font-satoshi text-[16px] sm:text-[17px] leading-[150%] text-white"
                        >
                            <span className="text-yellow font-mono font-bold flex-shrink-0 mt-[2px]">✓</span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
                <div className="flex flex-col gap-2 mt-8 pt-8 border-t border-dark-600">
                    <p className="font-satoshi text-[18px] sm:text-[20px] leading-[150%] text-white">
                        {t('humanEdge.why.closing1')}
                    </p>
                    <p className="font-mono font-bold text-[18px] sm:text-[22px] text-yellow">
                        {t('humanEdge.why.closing2')}
                    </p>
                </div>
            </div>
        </section>
    )
}
