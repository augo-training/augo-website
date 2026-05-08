import { useTranslation } from 'react-i18next'

export default function HumanEdgeWhoFor() {
    const { t } = useTranslation()
    const items = t('humanEdge.whoFor.items', { returnObjects: true }) as string[]

    return (
        <section className="w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark">
            <div className="max-w-[900px] mx-auto flex flex-col gap-6">
                <h2 className="font-mono font-bold text-[28px] sm:text-[36px] lg:text-[44px] leading-[120%] text-white">
                    {t('humanEdge.whoFor.title')}
                </h2>
                <p className="font-satoshi text-[16px] sm:text-[18px] leading-[160%] text-text-muted">
                    {t('humanEdge.whoFor.lead')}
                </p>
                <p className="font-mono text-[14px] tracking-[1px] uppercase text-yellow mt-4">
                    {t('humanEdge.whoFor.subtitle')}
                </p>
                <ul className="flex flex-col gap-3">
                    {items.map((item, i) => (
                        <li
                            key={i}
                            className="flex items-start gap-3 font-satoshi text-[16px] sm:text-[17px] leading-[150%] text-white p-4 rounded-lg"
                            style={{ backgroundColor: '#151515', border: '1px solid #222' }}
                        >
                            <span className="text-yellow font-mono font-bold flex-shrink-0 mt-[2px]">→</span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}
