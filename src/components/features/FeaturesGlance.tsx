import { useTranslation } from 'react-i18next'
import { SECTION_IDS, type FeatureItem } from './constants'

/**
 * Every feature in one table, under both views. A plain <table> on purpose:
 * it is the part of the page an answer engine is most likely to quote.
 */
export default function FeaturesGlance() {
    const { t } = useTranslation()
    const coach = t('features.coach.items', { returnObjects: true }) as FeatureItem[]
    const athlete = t('features.athlete.items', { returnObjects: true }) as FeatureItem[]

    const group = (heading: string, items: FeatureItem[]) => (
        <tbody>
            <tr>
                <th
                    colSpan={2}
                    scope="colgroup"
                    className="pt-8 pb-3 text-left font-mono text-[12px] tracking-[2.5px] uppercase text-white/50 font-normal"
                >
                    {heading}
                </th>
            </tr>
            {items.map((item) => (
                <tr key={item.id} className="border-t border-white/[0.08]">
                    <th scope="row" className="py-4 pr-4 sm:pr-8 align-top text-left font-normal w-[40%] sm:w-[34%]">
                        <a href={`#${item.id}`} className="font-satoshi font-medium text-[15px] sm:text-[16px] leading-[140%] text-white hover:underline underline-offset-4">
                            {item.title}
                        </a>
                    </th>
                    <td className="py-4 align-top font-satoshi text-[14px] sm:text-[16px] leading-[150%] text-white/65">
                        {item.summary}
                    </td>
                </tr>
            ))}
        </tbody>
    )

    return (
        <section
            id={SECTION_IDS.glance}
            aria-labelledby="features-glance-title"
            className="features-target w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark-800 border-t border-white/[0.06] texture-grain"
        >
            <div className="max-w-[1000px] mx-auto">
                <h2
                    id="features-glance-title"
                    className="font-satoshi font-bold text-[28px] sm:text-[40px] lg:text-[44px] leading-[110%] tracking-[-0.025em] text-white"
                >
                    {t('features.glance.title')}
                </h2>
                <p className="mt-3 font-satoshi text-[16px] sm:text-[18px] leading-[155%] text-white/65">
                    {t('features.glance.lead')}
                </p>
                <table className="mt-4 w-full border-collapse">
                    <thead className="sr-only">
                        <tr>
                            <th scope="col">{t('features.glance.feature')}</th>
                            <th scope="col">{t('features.glance.what')}</th>
                        </tr>
                    </thead>
                    {group(t('features.glance.coaches'), coach)}
                    {group(t('features.glance.athletes'), athlete)}
                </table>
            </div>
        </section>
    )
}
