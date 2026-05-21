import { useTranslation } from 'react-i18next'

export default function HumanEdgeDocumenting() {
    const { t } = useTranslation()
    const items = t('humanEdge.documenting.items', { returnObjects: true }) as string[]

    return (
        <section className="w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark-800 border-t border-white/[0.06] texture-grain">
            <div className="max-w-[1100px] mx-auto">
                <h2 className="font-mono font-bold text-[28px] sm:text-[36px] lg:text-[44px] leading-[120%] text-white">
                    {t('humanEdge.documenting.title')}
                </h2>

                <div className="mt-4 sm:mt-5 flex flex-col gap-1 max-w-[640px]">
                    <p className="font-satoshi font-medium text-[20px] sm:text-[24px] leading-[130%] text-white">
                        {t('humanEdge.documenting.lead1')}
                    </p>
                    <p className="font-satoshi text-[18px] sm:text-[20px] leading-[140%] text-text-muted">
                        {t('humanEdge.documenting.lead2')}
                    </p>
                </div>

                {/* Shot list */}
                <div className="mt-12 sm:mt-16 flex flex-col gap-5">
                    <div className="flex items-baseline justify-between gap-6">
                        <p className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/55">
                            {t('humanEdge.documenting.shotListLabel')}
                        </p>
                        <p className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/30 tabular-nums">
                            {String(items.length).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                        </p>
                    </div>

                    <ol className="flex flex-col">
                        {items.map((item, i) => (
                            <li
                                key={i}
                                className="group grid grid-cols-[80px_1fr] sm:grid-cols-[120px_1fr] items-baseline gap-x-4 sm:gap-x-8 py-5 sm:py-7 border-t border-white/[0.08] last:border-b last:border-white/[0.08] transition-colors duration-200 hover:bg-white/[0.015]"
                            >
                                <span className="font-mono text-[11px] sm:text-[12px] tracking-[1.5px] text-white/35 tabular-nums group-hover:text-white/60 transition-colors duration-200">
                                    T+00:{String(i + 1).padStart(2, '0')}
                                </span>
                                <span className="font-satoshi font-bold text-[20px] sm:text-[26px] md:text-[30px] leading-[110%] tracking-[-0.015em] uppercase text-white">
                                    {item}
                                </span>
                            </li>
                        ))}
                    </ol>
                </div>

            </div>
        </section>
    )
}
