import { useTranslation } from 'react-i18next'
import whoForVideo from '../../assets/videos/human-edge-whofor.mp4'
import whoForPoster from '../../assets/images/human-edge-whofor-poster.jpg'

interface Criterion {
    label: string
    statement: string
}

export default function HumanEdgeWhoFor() {
    const { t } = useTranslation()
    const items = t('humanEdge.whoFor.items', { returnObjects: true }) as Criterion[]

    return (
        <section
            id="who-is-this-for"
            aria-labelledby="who-is-this-for-title"
            className="w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark border-t border-white/[0.06] texture-grain"
        >
            <div className="max-w-[1200px] mx-auto">
                <h2
                    id="who-is-this-for-title"
                    className="font-mono font-bold text-[28px] sm:text-[36px] lg:text-[44px] leading-[120%] text-white"
                >
                    {t('humanEdge.whoFor.title')}
                </h2>
                <p className="font-satoshi text-[16px] sm:text-[18px] leading-[160%] text-text-muted mt-3 max-w-[680px]">
                    {t('humanEdge.whoFor.lead')}
                </p>

                <div className="mt-12 sm:mt-14 grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-10 lg:gap-14 items-start">
                    {/* Left column — spec sheet */}
                    <div className="flex flex-col gap-5 order-2 lg:order-1">
                        <div className="flex items-baseline justify-between gap-6">
                            <p className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/55">
                                {t('humanEdge.whoFor.subtitle')}
                            </p>
                            <p className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/30 tabular-nums">
                                {String(items.length).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                            </p>
                        </div>

                        <dl className="flex flex-col">
                            {items.map((item, i) => (
                                <div
                                    key={i}
                                    className="group grid grid-cols-[28px_minmax(80px,120px)_1fr] sm:grid-cols-[36px_minmax(100px,150px)_1fr] items-baseline gap-x-3 sm:gap-x-6 py-5 sm:py-6 border-t border-white/[0.08] last:border-b last:border-white/[0.08] transition-colors duration-200 hover:bg-white/[0.015]"
                                >
                                    <span className="font-mono text-[11px] sm:text-[12px] tracking-[1.5px] text-white/35 tabular-nums">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <dt className="font-mono text-[11px] sm:text-[12px] tracking-[2.5px] uppercase text-white/55 group-hover:text-white/80 transition-colors duration-200">
                                        {item.label}
                                    </dt>
                                    <dd className="font-satoshi font-medium text-[15px] sm:text-[18px] leading-[140%] text-white">
                                        {item.statement}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    {/* Right column — video, sticky on desktop */}
                    <div className="order-1 lg:order-2 lg:sticky lg:top-24">
                        <div
                            className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-dark-700 ring-1 ring-white/[0.10]"
                            style={{ filter: 'drop-shadow(0 0 32px rgba(255,255,255,0.04))' }}
                        >
                            <video
                                src={whoForVideo}
                                poster={whoForPoster}
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                aria-hidden="true"
                                className="w-full h-full object-cover motion-reduce:hidden"
                            />
                            <img
                                src={whoForPoster}
                                alt=""
                                aria-hidden="true"
                                className="hidden motion-reduce:block w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
