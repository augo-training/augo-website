import { useTranslation } from 'react-i18next'
import FeatureVisual from './FeatureVisual'
import { FEATURE_VISUALS, STAGE_FEATURES, stageId, type FeatureItem, type WeekStage } from './constants'

function Side({
    heading,
    points,
    featureIds,
    byId,
}: {
    heading: string
    points: string[]
    featureIds: string[]
    byId: Record<string, FeatureItem>
}) {
    const { t } = useTranslation()
    const lead = byId[featureIds[0]]

    return (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6 flex flex-col gap-5">
            <h4 className="font-mono text-[12px] tracking-[2.5px] uppercase text-white/50">{heading}</h4>
            <div className="max-w-[420px] w-full mx-auto">
                <FeatureVisual visual={FEATURE_VISUALS[lead.id]} alt={lead.title} />
            </div>
            <ul className="flex flex-col gap-2.5">
                {points.map((point, i) => (
                    <li key={i} className="flex gap-3 font-satoshi text-[15px] sm:text-[16px] leading-[150%] text-white/75">
                        <span aria-hidden className="mt-[9px] w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                        <span>{point}</span>
                    </li>
                ))}
            </ul>
            <div className="flex flex-wrap gap-2 mt-auto">
                {featureIds.map((id) => (
                    <a
                        key={id}
                        href={`#${id}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.14] px-3 py-1.5 font-satoshi text-[13px] leading-[130%] text-white/80 hover:text-white hover:border-white/35 transition-colors"
                    >
                        <span>{byId[id].title}</span>
                        <span className="text-white/50">· {t('features.week.details')} →</span>
                    </a>
                ))}
            </div>
        </div>
    )
}

/** View C: the same features, told as one coaching week from plan to adjust. */
export default function WeekStory() {
    const { t } = useTranslation()
    const stages = t('features.week.stages', { returnObjects: true }) as WeekStage[]
    const items = [
        ...(t('features.coach.items', { returnObjects: true }) as FeatureItem[]),
        ...(t('features.athlete.items', { returnObjects: true }) as FeatureItem[]),
    ]
    const byId = Object.fromEntries(items.map((item) => [item.id, item]))

    return (
        <div className="px-5 sm:px-8">
            <div className="max-w-[1200px] mx-auto pt-10 sm:pt-14 pb-16">
                <h2 className="font-satoshi font-bold text-[30px] sm:text-[44px] leading-[110%] tracking-[-0.025em] text-white">
                    {t('features.week.title')}
                </h2>
                <p className="mt-3 font-satoshi text-[16px] sm:text-[18px] leading-[155%] text-white/65 max-w-[720px]">
                    {t('features.week.lead')}
                </p>

                <ol className="mt-8 grid grid-cols-5 gap-1.5 sm:gap-2">
                    {stages.map((stage, i) => (
                        <li key={stage.key}>
                            <a
                                href={`#${stageId(stage.key)}`}
                                className="block rounded-lg border border-white/[0.1] bg-white/[0.03] hover:border-white/30 px-2 sm:px-4 py-2.5 sm:py-3 transition-colors"
                            >
                                <span className="block font-mono text-[10px] sm:text-[11px] tracking-[1.5px] uppercase text-white/45">
                                    {i + 1}
                                </span>
                                <span className="block font-satoshi font-bold text-[12px] sm:text-[16px] leading-[125%] text-white truncate">
                                    {stage.name}
                                </span>
                            </a>
                        </li>
                    ))}
                </ol>

                {stages.map((stage, i) => {
                    const features = STAGE_FEATURES[i]
                    return (
                        <section
                            key={stage.key}
                            id={stageId(stage.key)}
                            aria-labelledby={`${stageId(stage.key)}-title`}
                            className="features-target mt-14 sm:mt-20"
                        >
                            <p className="font-mono text-[12px] tracking-[2.5px] uppercase text-white/50">
                                {t('features.week.stepLabel', { n: i + 1 })} · {stage.name}
                            </p>
                            <h3
                                id={`${stageId(stage.key)}-title`}
                                className="mt-3 font-satoshi font-bold text-[26px] sm:text-[36px] leading-[115%] tracking-[-0.02em] text-white"
                            >
                                {stage.title}
                            </h3>
                            <p className="mt-3 font-satoshi text-[16px] sm:text-[18px] leading-[155%] text-white/65 max-w-[680px]">
                                {stage.intro}
                            </p>
                            <div className="mt-8 grid md:grid-cols-2 gap-5 sm:gap-6">
                                <Side
                                    heading={t('features.week.coachSide')}
                                    points={stage.coach.points}
                                    featureIds={features.coach}
                                    byId={byId}
                                />
                                <Side
                                    heading={t('features.week.athleteSide')}
                                    points={stage.athlete.points}
                                    featureIds={features.athlete}
                                    byId={byId}
                                />
                            </div>
                        </section>
                    )
                })}
            </div>
        </div>
    )
}
