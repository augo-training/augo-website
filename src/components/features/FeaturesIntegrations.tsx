import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { LogoMarquee } from '../ConnectsSection'
import { INTEGRATION_LOGOS } from '../../data/deviceLogos'
import {
    HISTORY_IMPORTS,
    RECOVERY_INTEGRATIONS,
    SECTION_IDS,
    TRAINING_INTEGRATIONS,
    type IntegrationCell,
    type IntegrationRow,
} from './constants'

interface TitledBody {
    title: string
    body: string
}

interface MoreItem extends TitledBody {
    id: 'ai' | 'trainingpeaks' | 'indoor'
    link: string
}

const COLUMNS = ['planned', 'completed', 'historyAuto', 'historyRequest', 'recovery'] as const

/**
 * What augo connects to: the logo strip, how each kind of integration works,
 * and every integration in one table. Content for the side panel, opened from
 * the Integrations tile.
 */
export default function FeaturesIntegrations() {
    const { t } = useTranslation()
    const { lang } = useParams<{ lang: string }>()
    const currentLang = lang ?? 'en'

    const how = t('features.integrations.how.items', { returnObjects: true }) as TitledBody[]
    const points = t('features.integrations.connect.points', { returnObjects: true }) as string[]
    const more = t('features.integrations.more.items', { returnObjects: true }) as MoreItem[]

    const moreHref: Record<MoreItem['id'], string> = {
        ai: `/${currentLang}/mcp`,
        trainingpeaks: '#switching',
        indoor: '/en/support/ride-augo-workouts-indoors/',
    }

    const cell = (value: IntegrationCell, href?: string) => {
        if (value === 'no') {
            return (
                <span className="text-white/30">
                    —<span className="sr-only">{t('features.integrations.table.values.no')}</span>
                </span>
            )
        }
        const label = t(`features.integrations.table.values.${value}`)
        // Unlimited history needs an export: link to the guide for requesting it.
        return href ? (
            <a href={href} className="text-white underline underline-offset-4 decoration-white/30 hover:decoration-white">
                {label} →
            </a>
        ) : (
            <span className="text-white/85">{label}</span>
        )
    }

    const rows = (heading: string, items: IntegrationRow[]) => (
        <tbody>
            <tr>
                <th
                    colSpan={6}
                    scope="colgroup"
                    className="pt-6 pb-2 text-left font-mono text-[11px] tracking-[2px] uppercase text-white/45 font-normal"
                >
                    {heading}
                </th>
            </tr>
            {items.map((row) => (
                <tr key={row.name} className="border-t border-white/[0.08]">
                    <th scope="row" className="py-3 pr-3 text-left align-top font-satoshi font-medium text-[14px] sm:text-[15px] text-white whitespace-nowrap">
                        {row.name}
                    </th>
                    {COLUMNS.map((col) => (
                        <td key={col} className="py-3 px-2 font-satoshi text-[13px] sm:text-[14px] leading-[135%] align-top">
                            {cell(row[col], col === 'historyRequest' ? row.requestHref : undefined)}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    )

    return (
        <>
            {/* Bleeds to the panel's edges, like the strip on the homepage. */}
            <div className="-mx-5 sm:-mx-8 mb-10">
                <LogoMarquee logos={INTEGRATION_LOGOS} className="py-3" />
            </div>

            <p className="font-mono text-[12px] tracking-[2.5px] uppercase text-white/50">
                {t('features.integrations.eyebrow')}
            </p>
            <h2
                id={`${SECTION_IDS.integrations}-title`}
                className="mt-3 font-satoshi font-bold text-[28px] sm:text-[34px] leading-[112%] tracking-[-0.02em] text-white"
            >
                {t('features.integrations.title')}
            </h2>
            <p className="mt-4 font-satoshi text-[16px] sm:text-[18px] leading-[155%] text-white/65 max-w-[720px]">
                {t('features.integrations.lead')}
            </p>

            <h3 className="mt-12 font-satoshi font-bold text-[22px] sm:text-[24px] leading-[120%] text-white">
                {t('features.integrations.how.title')}
            </h3>
            <div className="mt-5 grid sm:grid-cols-2 gap-4">
                {how.map((item) => (
                    <div key={item.title} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                        <h4 className="font-satoshi font-bold text-[17px] text-white">{item.title}</h4>
                        <p className="mt-2 font-satoshi text-[14px] sm:text-[15px] leading-[155%] text-white/65">{item.body}</p>
                    </div>
                ))}
            </div>

            <h3 className="mt-12 font-satoshi font-bold text-[22px] sm:text-[24px] leading-[120%] text-white">
                {t('features.integrations.table.title')}
            </h3>
            {/* relative: the sr-only labels are absolutely positioned and would otherwise widen the page */}
            <div className="relative mt-4 overflow-x-auto -mx-5 px-5 sm:-mx-8 sm:px-8">
                <table className="w-full min-w-[520px] border-collapse">
                    <thead>
                        <tr className="text-left">
                            <th scope="col" className="pb-2 pr-3 align-bottom font-mono text-[10px] tracking-[1px] leading-[140%] uppercase text-white/50 font-normal">
                                {t('features.integrations.table.name')}
                            </th>
                            {COLUMNS.map((col) => (
                                <th
                                    key={col}
                                    scope="col"
                                    className="pb-2 px-2 align-bottom font-mono text-[10px] tracking-[1px] leading-[140%] uppercase text-white/50 font-normal"
                                >
                                    {t(`features.integrations.table.${col}`)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    {rows(t('features.integrations.table.groups.training'), TRAINING_INTEGRATIONS)}
                    {rows(t('features.integrations.table.groups.imports'), HISTORY_IMPORTS)}
                    {rows(t('features.integrations.table.groups.recovery'), RECOVERY_INTEGRATIONS)}
                </table>
            </div>
            <p className="mt-4 max-w-[760px] font-satoshi text-[14px] sm:text-[15px] leading-[155%] text-white/60">
                {t('features.integrations.table.historyNote')}{' '}
                <a
                    href="/en/support/import-training-history/"
                    className="text-white/80 hover:text-white underline underline-offset-4 decoration-white/30"
                >
                    {t('features.integrations.table.historyLink')} →
                </a>
            </p>
            <a
                href="/en/support/connect-devices-and-apps/"
                className="inline-block mt-5 font-satoshi text-[14px] sm:text-[15px] text-white/70 hover:text-white underline-offset-4 hover:underline"
            >
                {t('features.integrations.table.supportLink')} →
            </a>

            <div className="mt-14 flex flex-col gap-10">
                <div>
                    <h3 className="font-satoshi font-bold text-[22px] sm:text-[24px] leading-[120%] text-white">
                        {t('features.integrations.connect.title')}
                    </h3>
                    <ul className="mt-5 flex flex-col gap-3">
                        {points.map((point, i) => (
                            <li key={i} className="flex gap-3 font-satoshi text-[15px] sm:text-[16px] leading-[150%] text-white/75">
                                <span aria-hidden className="mt-[9px] w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="font-satoshi font-bold text-[22px] sm:text-[24px] leading-[120%] text-white">
                        {t('features.integrations.more.title')}
                    </h3>
                    <div className="mt-5 flex flex-col">
                        {more.map((item) => (
                            <div key={item.id} className="py-4 border-t border-white/[0.08] first:border-t-0 first:pt-0">
                                <h4 className="font-satoshi font-bold text-[17px] text-white">{item.title}</h4>
                                <p className="mt-1 font-satoshi text-[15px] leading-[150%] text-white/65">{item.body}</p>
                                <a
                                    href={moreHref[item.id]}
                                    className="inline-block mt-2 font-satoshi text-[14px] text-white/70 hover:text-white underline-offset-4 hover:underline"
                                >
                                    {item.link} →
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
