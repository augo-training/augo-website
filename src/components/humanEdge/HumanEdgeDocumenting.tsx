import { useTranslation } from 'react-i18next'

export default function HumanEdgeDocumenting() {
    const { t } = useTranslation()
    const items = t('humanEdge.documenting.items', { returnObjects: true }) as string[]
    const sides = t('humanEdge.documenting.sides', { returnObjects: true }) as string[]

    return (
        <section className="w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark-800">
            <div className="max-w-[900px] mx-auto flex flex-col gap-6">
                <h2 className="font-mono font-bold text-[28px] sm:text-[36px] lg:text-[44px] leading-[120%] text-white">
                    {t('humanEdge.documenting.title')}
                </h2>
                <p className="font-satoshi text-[18px] sm:text-[20px] text-text-muted italic">
                    {t('humanEdge.documenting.lead1')}
                </p>
                <p className="font-satoshi text-[16px] sm:text-[18px] leading-[160%] text-white">
                    {t('humanEdge.documenting.lead2')}
                </p>
                <ul className="flex flex-col gap-3 mt-2">
                    {items.map((item, i) => (
                        <li
                            key={i}
                            className="flex items-start gap-3 font-satoshi text-[16px] sm:text-[17px] leading-[150%] text-white"
                        >
                            <span className="text-yellow font-mono font-bold flex-shrink-0 mt-[2px]">{String(i + 1).padStart(2, '0')}</span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
                <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-dark-600">
                    <p className="font-mono text-[14px] tracking-[1px] uppercase text-yellow">
                        {t('humanEdge.documenting.closing')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
                        {sides.map((side, i) => (
                            <p key={i} className="font-mono font-bold text-[16px] sm:text-[18px] text-white">
                                {side}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
