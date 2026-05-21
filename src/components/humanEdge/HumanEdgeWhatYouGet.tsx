import { useTranslation } from 'react-i18next'
import brianProfile from '../../assets/images/brian-profile.webp'

interface CoachStat {
    value: string
    label: string
}

interface ProgramItem {
    label: string
    value: string
}

interface CoachData {
    role: string
    name: string
    url: string
    stats: CoachStat[]
}

export default function HumanEdgeWhatYouGet() {
    const { t } = useTranslation()
    const coach = t('humanEdge.whatYouGet.coach', { returnObjects: true }) as CoachData
    const program = t('humanEdge.whatYouGet.program', { returnObjects: true }) as ProgramItem[]

    return (
        <section
            id="what-you-get"
            aria-labelledby="what-you-get-title"
            className="w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark border-t border-white/[0.06] texture-grain"
        >
            <div className="max-w-[1100px] mx-auto">
                <h2
                    id="what-you-get-title"
                    className="font-mono font-bold text-[28px] sm:text-[36px] lg:text-[44px] leading-[120%] text-white"
                >
                    {t('humanEdge.whatYouGet.title')}
                </h2>
                <p className="font-satoshi text-[16px] sm:text-[18px] text-text-muted mt-3 max-w-[640px]">
                    {t('humanEdge.whatYouGet.lead')}
                </p>

                {/* Coach card */}
                <div className="mt-12 sm:mt-14 grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[340px_1fr] gap-8 lg:gap-12 items-start">
                    <div
                        className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-dark-700 ring-1 ring-white/[0.10]"
                        style={{ filter: 'drop-shadow(0 0 32px rgba(255,255,255,0.06))' }}
                    >
                        <img
                            src={brianProfile}
                            alt="Portrait of running coach Brian Boisvert, RRCA Level II Coach and 2:44 marathoner"
                            width={340}
                            height={425}
                            loading="lazy"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="flex flex-col gap-6 sm:gap-8">
                        <p className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/55">
                            {coach.role}
                        </p>
                        <h3 className="font-satoshi font-bold text-[44px] sm:text-[60px] md:text-[72px] lg:text-[84px] leading-[92%] tracking-[-0.03em] text-white">
                            <a
                                href={coach.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline underline-offset-[6px] decoration-white/30 transition-all duration-200"
                            >
                                {coach.name}
                            </a>
                        </h3>

                        <dl className="grid grid-cols-2 gap-x-6 sm:gap-x-10 gap-y-7 sm:gap-y-9 mt-2 pt-7 sm:pt-9 border-t border-white/[0.10]">
                            {coach.stats.map((stat, i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <dt className="font-satoshi font-bold text-[34px] sm:text-[44px] lg:text-[52px] leading-[100%] tracking-[-0.025em] text-white">
                                        {stat.value}
                                    </dt>
                                    <dd className="font-mono text-[10px] sm:text-[11px] tracking-[2.5px] uppercase text-white/55">
                                        {stat.label}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>

                {/* Program spec sheet */}
                <div className="mt-16 sm:mt-20 flex flex-col gap-5">
                    <div className="flex items-baseline justify-between gap-6">
                        <p className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/55">
                            {t('humanEdge.whatYouGet.programLabel')}
                        </p>
                        <p className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/30 tabular-nums">
                            {String(program.length).padStart(2, '0')} / {String(program.length).padStart(2, '0')}
                        </p>
                    </div>

                    <dl className="flex flex-col">
                        {program.map((item, i) => (
                            <div
                                key={i}
                                className="group grid grid-cols-[36px_minmax(110px,180px)_1fr] items-baseline gap-x-4 sm:gap-x-8 py-5 sm:py-6 border-t border-white/[0.08] last:border-b last:border-white/[0.08] transition-colors duration-200 hover:bg-white/[0.015]"
                            >
                                <span className="font-mono text-[11px] sm:text-[12px] tracking-[1.5px] text-white/35 tabular-nums">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <dt className="font-mono text-[11px] sm:text-[12px] tracking-[2.5px] uppercase text-white/55 group-hover:text-white/80 transition-colors duration-200">
                                    {item.label}
                                </dt>
                                <dd className="font-satoshi font-medium text-[17px] sm:text-[20px] leading-[140%] text-white">
                                    {item.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>

                {/* Value reveal */}
                <div className="mt-16 sm:mt-20 pt-12 sm:pt-16 border-t border-white/[0.10] flex flex-col gap-5">
                    <p className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/55">
                        {t('humanEdge.whatYouGet.valueLabel')}
                    </p>
                    <div className="flex items-baseline gap-4 sm:gap-8 flex-wrap">
                        <span className="font-satoshi font-bold text-[36px] sm:text-[52px] md:text-[64px] lg:text-[76px] leading-[100%] tracking-[-0.03em] line-through decoration-white/30 decoration-[2px] sm:decoration-[3px] text-white/35">
                            {t('humanEdge.whatYouGet.valueOriginal')}
                        </span>
                        <span className="font-mono text-[20px] sm:text-[28px] text-white/40">→</span>
                        <span className="font-satoshi font-bold text-[44px] sm:text-[64px] md:text-[80px] lg:text-[96px] leading-[100%] tracking-[-0.035em] text-white">
                            {t('humanEdge.whatYouGet.valueOffer')}
                        </span>
                    </div>
                    <p className="font-mono text-[11px] sm:text-[12px] tracking-[2.5px] uppercase text-white/40 mt-1">
                        {t('humanEdge.whatYouGet.valueNote')}
                    </p>
                </div>
            </div>
        </section>
    )
}
