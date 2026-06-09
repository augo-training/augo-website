import { useTranslation } from 'react-i18next'

interface Pillar {
    label: string
    statement: string
}

/** Why an augo coach — the standard every coach on the roster is held to. */
export default function AugoStandard() {
    const { t } = useTranslation()
    const pillars = t('find.standard.pillars', { returnObjects: true }) as Pillar[]
    return (
        <section
            aria-labelledby="augo-standard-title"
            className="w-full pt-16 pb-12 sm:pt-20 sm:pb-16 px-5 sm:px-8 bg-dark texture-grain"
        >
            <div className="max-w-[1000px] mx-auto">
                <div className="inline-flex mb-5">
                    <span className="inline-flex items-center rounded-full border border-white/20 px-3 py-1.5 font-mono text-[11px] tracking-[2.5px] uppercase text-white/70">
                        {t('find.standard.badge')}
                    </span>
                </div>
                <h2
                    id="augo-standard-title"
                    className="font-satoshi font-bold text-[28px] sm:text-[40px] lg:text-[48px] leading-[105%] tracking-[-0.025em] text-white max-w-[640px]"
                >
                    {t('find.standard.title')}
                </h2>

                {/* Pillars — spec-sheet rhythm */}
                <dl className="flex flex-col mt-10 sm:mt-12">
                    {pillars.map((p, i) => (
                        <div
                            key={i}
                            className="group grid grid-cols-[24px_minmax(96px,150px)_1fr] sm:grid-cols-[32px_minmax(130px,190px)_1fr] items-baseline gap-x-3 sm:gap-x-6 py-5 sm:py-6 border-t border-white/[0.08] last:border-b last:border-white/[0.08] transition-colors duration-200 hover:bg-white/[0.015]"
                        >
                            <span className="font-mono text-[11px] sm:text-[12px] tracking-[1.5px] text-white/35 tabular-nums">
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <dt className="font-mono text-[11px] sm:text-[12px] tracking-[2.5px] uppercase text-white/55 group-hover:text-white/85 transition-colors duration-200">
                                {p.label}
                            </dt>
                            <dd className="font-satoshi font-medium text-[15px] sm:text-[18px] leading-[140%] text-white">
                                {p.statement}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    )
}
