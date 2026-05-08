import { useTranslation } from 'react-i18next'

export default function HumanEdgeBonus() {
    const { t } = useTranslation()
    const items = t('humanEdge.bonus.items', { returnObjects: true }) as string[]

    return (
        <section className="w-full py-16 sm:py-20 px-5 sm:px-8 bg-dark-800">
            <div className="max-w-[800px] mx-auto flex flex-col gap-5">
                <span className="font-mono text-[12px] tracking-[3px] uppercase text-yellow">
                    Bonus
                </span>
                <h2 className="font-mono font-bold text-[24px] sm:text-[32px] leading-[120%] text-white">
                    {t('humanEdge.bonus.title')}
                </h2>
                <p className="font-satoshi text-[16px] sm:text-[17px] leading-[160%] text-text-muted">
                    {t('humanEdge.bonus.body')}
                </p>
                <ul className="flex flex-col gap-2">
                    {items.map((item, i) => (
                        <li
                            key={i}
                            className="flex items-start gap-3 font-satoshi text-[15px] sm:text-[16px] leading-[150%] text-white"
                        >
                            <span className="text-yellow flex-shrink-0 mt-[2px]">✦</span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}
