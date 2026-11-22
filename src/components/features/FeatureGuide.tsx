import { useTranslation } from 'react-i18next'
import FeatureVisual from './FeatureVisual'
import {
    FEATURE_VISUALS,
    STAGE_FEATURES,
    STAGE_OF,
    SUPPORT_SLUGS,
    stageId,
    type FeatureItem,
    type WeekStage,
} from './constants'

function FeatureSection({ item, stages, flip }: { item: FeatureItem; stages: WeekStage[]; flip: boolean }) {
    const { t } = useTranslation()
    const stageIndex = STAGE_OF[item.id]
    const stage = stageIndex === undefined ? undefined : stages[stageIndex]
    const slug = SUPPORT_SLUGS[item.id]

    return (
        <article
            id={item.id}
            aria-labelledby={`${item.id}-title`}
            className="features-target py-14 sm:py-20 border-t border-white/[0.08] first:border-t-0 grid md:grid-cols-2 gap-8 md:gap-16 items-center"
        >
            <div className={flip ? 'md:order-2' : ''}>
                <p className="font-mono text-[12px] tracking-[2.5px] uppercase text-white/50">{item.category}</p>
                <h3
                    id={`${item.id}-title`}
                    className="mt-3 font-satoshi font-bold text-[28px] sm:text-[36px] leading-[112%] tracking-[-0.02em] text-white"
                >
                    {item.title}
                </h3>
                <p className="mt-4 font-satoshi font-medium text-[17px] sm:text-[19px] leading-[145%] text-white/85">
                    {item.summary}
                </p>
                <p className="mt-4 font-satoshi text-[15px] sm:text-[17px] leading-[160%] text-white/65">{item.lead}</p>

                {item.proof && (
                    <p className="mt-5 pl-4 border-l-2 border-[#C80F25] font-satoshi text-[15px] sm:text-[16px] leading-[150%] text-white/80">
                        {item.proof}
                    </p>
                )}

                <h4 className="mt-8 font-mono text-[12px] tracking-[2.5px] uppercase text-white/50">
                    {t('features.guide.howItWorks')}
                </h4>
                <ol className="mt-3 flex flex-col gap-2">
                    {item.steps.map((step, i) => (
                        <li key={i} className="flex gap-3 font-satoshi text-[15px] sm:text-[16px] leading-[150%] text-white/75">
                            <span className="font-mono text-[13px] leading-[24px] text-white/40 shrink-0">{i + 1}</span>
                            <span>{step}</span>
                        </li>
                    ))}
                </ol>

                <dl className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-px rounded-xl overflow-hidden border border-white/[0.08] bg-white/[0.08]">
                    {item.specs.map((spec) => (
                        <div key={spec.label} className="bg-[#0E0E0E] px-4 py-3">
                            <dt className="font-mono text-[11px] tracking-[2px] uppercase text-white/45">{spec.label}</dt>
                            <dd className="mt-1 font-satoshi text-[14px] leading-[140%] text-white/85">{spec.value}</dd>
                        </div>
                    ))}
                </dl>

                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-satoshi text-[14px] sm:text-[15px]">
                    {stage && (
                        <a href={`#${stageId(STAGE_FEATURES[stageIndex].key)}`} className="text-white/70 hover:text-white underline-offset-4 hover:underline">
                            {t('features.guide.whereItFits')}:{' '}
                            <span className="text-white">
                                {t('features.guide.stepLabel', { n: stageIndex + 1, stage: stage.name })} →
                            </span>
                        </a>
                    )}
                    {slug && (
                        <a href={`/en/support/${slug}/`} className="text-white/70 hover:text-white underline-offset-4 hover:underline">
                            {t('features.guide.learnMore')} →
                        </a>
                    )}
                </div>
            </div>

            <div className={flip ? 'md:order-1' : ''}>
                <FeatureVisual visual={FEATURE_VISUALS[item.id]} alt={item.title} />
            </div>
        </article>
    )
}

/**
 * View A: every feature in detail, coaches first, full width with the render
 * alternating sides. The index above the views is the way in, so there is no
 * contents sidebar.
 */
export default function FeatureGuide() {
    const { t } = useTranslation()
    const coach = t('features.coach.items', { returnObjects: true }) as FeatureItem[]
    const athlete = t('features.athlete.items', { returnObjects: true }) as FeatureItem[]
    const stages = t('features.week.stages', { returnObjects: true }) as WeekStage[]

    const audience = (id: string, heading: string, lead: string, items: FeatureItem[]) => (
        <section aria-labelledby={id} className="pt-12 sm:pt-16">
            <h2
                id={id}
                className="features-target font-satoshi font-bold text-[32px] sm:text-[48px] leading-[108%] tracking-[-0.025em] text-white"
            >
                {heading}
            </h2>
            <p className="mt-3 font-satoshi text-[16px] sm:text-[18px] leading-[155%] text-white/65 max-w-[680px]">{lead}</p>
            <div className="mt-4">
                {items.map((item, i) => (
                    <FeatureSection key={item.id} item={item} stages={stages} flip={i % 2 === 1} />
                ))}
            </div>
        </section>
    )

    return (
        <div className="px-5 sm:px-8">
            <div className="max-w-[1200px] mx-auto pb-16">
                {audience('for-coaches', t('features.guide.coachHeading'), t('features.guide.coachLead'), coach)}
                {audience('for-athletes', t('features.guide.athleteHeading'), t('features.guide.athleteLead'), athlete)}
            </div>
        </div>
    )
}
