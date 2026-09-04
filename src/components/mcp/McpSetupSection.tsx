import { useTranslation } from 'react-i18next'
import McpSteps, { type McpStep } from './McpSteps'
import McpCallout from './McpCallout'
import { MCP_URL } from './constants'

interface McpSetupSectionProps {
    id: string
    /** i18n root, e.g. 'mcp.claude'. Reads .eyebrow, .title, .lead, .steps. */
    i18nKey: string
    bg: 'bg-dark' | 'bg-dark-800'
    /** Index of the step that shows the server URL. */
    copyAtIndex: number
    /** Reads `${i18nKey}.callout` and `.calloutLabel` when true. */
    hasCallout?: boolean
}

/**
 * One connection flow. Rendered twice — Claude and ChatGPT — rather than split
 * into two near-identical components that would drift apart on the first edit.
 */
export default function McpSetupSection({
    id,
    i18nKey,
    bg,
    copyAtIndex,
    hasCallout = false,
}: McpSetupSectionProps) {
    const { t } = useTranslation()
    const steps = t(`${i18nKey}.steps`, { returnObjects: true }) as McpStep[]
    const titleId = `${id}-title`

    return (
        <section
            id={id}
            aria-labelledby={titleId}
            className={`w-full py-20 sm:py-24 px-5 sm:px-8 ${bg} border-t border-white/[0.06] texture-grain scroll-mt-24`}
        >
            <div className="max-w-[960px] mx-auto">
                <div className="inline-flex mb-5">
                    <span className="inline-flex items-center rounded-full border border-white/20 px-3 py-1.5 font-mono text-[11px] tracking-[2.5px] uppercase text-white/70">
                        {t(`${i18nKey}.eyebrow`)}
                    </span>
                </div>
                <h2
                    id={titleId}
                    className="font-satoshi font-bold text-[28px] sm:text-[40px] lg:text-[44px] leading-[110%] tracking-[-0.025em] text-white max-w-[860px]"
                >
                    {t(`${i18nKey}.title`)}
                </h2>
                <p className="mt-4 font-satoshi text-[16px] sm:text-[18px] leading-[160%] text-white/65 max-w-[680px]">
                    {t(`${i18nKey}.lead`)}
                </p>

                {hasCallout && (
                    <div className="mt-8 max-w-[720px]">
                        <McpCallout tone="note" label={t(`${i18nKey}.calloutLabel`)}>
                            {t(`${i18nKey}.callout`)}
                        </McpCallout>
                    </div>
                )}

                <McpSteps
                    steps={steps}
                    idPrefix={id}
                    copyValue={MCP_URL}
                    copyLabel={t('mcp.hero.urlLabel')}
                    copyAtIndex={copyAtIndex}
                />
            </div>
        </section>
    )
}
