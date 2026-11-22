import { useTranslation } from 'react-i18next'
import { FeatureSection } from './FeatureGuide'
import { SECTION_IDS, type FeatureItem } from './constants'

/** Moving from TrainingPeaks or Final Surge. A topic, not a coach feature, so it sits with Devices and Integrations. */
export default function FeaturesMigration() {
    const { t } = useTranslation()
    const item = t('features.migration.item', { returnObjects: true }) as FeatureItem

    return (
        <section
            id={SECTION_IDS.migration}
            aria-labelledby={`${item.id}-title`}
            className="features-target w-full px-5 sm:px-8 py-6 sm:py-8 bg-dark border-t border-white/[0.06]"
        >
            <div className="max-w-[1200px] mx-auto">
                <FeatureSection item={item} flip={false} heading="h2" />
            </div>
        </section>
    )
}
