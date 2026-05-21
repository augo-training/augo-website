import { useTranslation } from 'react-i18next'

interface ContextBlock {
    label: string
    text: string
}

interface Capability {
    label: string
    statement: string
}

export default function HumanEdgeWhy() {
    const { t } = useTranslation()
    const context = t('humanEdge.why.context', { returnObjects: true }) as ContextBlock[]
    const items = t('humanEdge.why.items', { returnObjects: true }) as Capability[]

    return (
        <section
            id="why-this-exists"
            aria-labelledby="why-this-exists-title"
            className="w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark-800 border-t border-white/[0.06] texture-grain"
        >
            <div className="max-w-[1100px] mx-auto">
                <h2
                    id="why-this-exists-title"
                    className="font-mono font-bold text-[28px] sm:text-[36px] lg:text-[44px] leading-[120%] text-white"
                >
                    {t('humanEdge.why.title')}
                </h2>

                <div className="mt-10 sm:mt-12 grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-10 lg:gap-14 items-start">
                    {/* Left column — pull-quote, sticky on desktop */}
                    <div className="lg:sticky lg:top-24">
                        <p className="font-satoshi font-bold text-[34px] sm:text-[48px] md:text-[56px] lg:text-[58px] xl:text-[64px] leading-[95%] tracking-[-0.025em] uppercase text-white">
                            {t('humanEdge.why.pullQuote')}
                        </p>
                    </div>

                    {/* Right column — context blocks + spec sheet */}
                    <div className="flex flex-col gap-10 sm:gap-12">
                        <div className="flex flex-col gap-7 sm:gap-8">
                            {context.map((block, i) => (
                                <div
                                    key={i}
                                    className="grid grid-cols-[28px_minmax(90px,140px)_1fr] gap-x-3 sm:gap-x-5 items-baseline"
                                >
                                    <span className="font-mono text-[11px] sm:text-[12px] tracking-[1.5px] text-white/35 tabular-nums">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <span className="font-mono text-[11px] sm:text-[12px] tracking-[2.5px] uppercase text-white/55">
                                        {block.label}
                                    </span>
                                    <p className="font-satoshi text-[15px] sm:text-[17px] leading-[160%] text-white">
                                        {block.text}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-5">
                            <div className="flex items-baseline justify-between gap-6">
                                <p className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/55">
                                    {t('humanEdge.why.subtitle')}
                                </p>
                                <p className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/30 tabular-nums">
                                    {String(items.length).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                                </p>
                            </div>

                            <dl className="flex flex-col">
                                {items.map((item, i) => (
                                    <div
                                        key={i}
                                        className="group grid grid-cols-[28px_minmax(90px,140px)_1fr] items-baseline gap-x-3 sm:gap-x-5 py-4 sm:py-5 border-t border-white/[0.08] last:border-b last:border-white/[0.08] transition-colors duration-200 hover:bg-white/[0.015]"
                                    >
                                        <span className="font-mono text-[11px] sm:text-[12px] tracking-[1.5px] text-white/35 tabular-nums">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <dt className="font-mono text-[11px] sm:text-[12px] tracking-[2.5px] uppercase text-white/55 group-hover:text-white/80 transition-colors duration-200">
                                            {item.label}
                                        </dt>
                                        <dd className="font-satoshi font-medium text-[15px] sm:text-[17px] leading-[140%] text-white">
                                            {item.statement}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="mt-16 sm:mt-20 pt-12 sm:pt-16 border-t border-white/[0.10]">
                    <p className="font-satoshi font-bold text-[40px] sm:text-[56px] md:text-[68px] lg:text-[80px] leading-[100%] tracking-[-0.03em] text-white">
                        {t('humanEdge.why.closing')}
                    </p>
                </div>
            </div>
        </section>
    )
}
