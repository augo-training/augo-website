import { useTranslation } from 'react-i18next'
import McpSpecList from './McpSpecList'
import type { McpSpecRow } from './constants'

interface McpSpecSectionProps {
    id: string
    /** i18n root, e.g. 'mcp.before'. Reads .title, .lead and .items. */
    i18nKey: string
    bg: 'bg-dark' | 'bg-dark-800'
}

/** A titled section whose body is a spec sheet. Used by "Before you start" and "What augo can see". */
export default function McpSpecSection({ id, i18nKey, bg }: McpSpecSectionProps) {
    const { t } = useTranslation()
    const rows = t(`${i18nKey}.items`, { returnObjects: true }) as McpSpecRow[]
    const titleId = `${id}-title`

    return (
        <section
            id={id}
            aria-labelledby={titleId}
            className={`w-full py-20 sm:py-24 px-5 sm:px-8 ${bg} border-t border-white/[0.06] texture-grain scroll-mt-24`}
        >
            <div className="max-w-[960px] mx-auto">
                <h2
                    id={titleId}
                    className="font-satoshi font-bold text-[28px] sm:text-[40px] lg:text-[44px] leading-[110%] tracking-[-0.025em] text-white max-w-[860px]"
                >
                    {t(`${i18nKey}.title`)}
                </h2>
                <p className="mt-4 font-satoshi text-[16px] sm:text-[18px] leading-[160%] text-white/65 max-w-[680px]">
                    {t(`${i18nKey}.lead`)}
                </p>
                <McpSpecList rows={rows} />
            </div>
        </section>
    )
}
