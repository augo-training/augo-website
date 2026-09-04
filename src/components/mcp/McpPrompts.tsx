import { useTranslation } from 'react-i18next'
import CopyableValue from './CopyableValue'
import { SECTION_IDS } from './constants'

interface PromptGroup {
    label: string
    items: string[]
}

/**
 * Example prompts. Copyable because the first thing anyone does after
 * connecting is look for something to type, and because these are the phrases
 * coaches actually search for — outcomes, not "MCP".
 */
export default function McpPrompts() {
    const { t } = useTranslation()
    const groups = t('mcp.prompts.groups', { returnObjects: true }) as PromptGroup[]

    return (
        <section
            id={SECTION_IDS.prompts}
            aria-labelledby="mcp-prompts-title"
            className="w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark-800 border-t border-white/[0.06] texture-grain scroll-mt-24"
        >
            <div className="max-w-[960px] mx-auto">
                <h2
                    id="mcp-prompts-title"
                    className="font-satoshi font-bold text-[28px] sm:text-[40px] lg:text-[44px] leading-[110%] tracking-[-0.025em] text-white max-w-[860px]"
                >
                    {t('mcp.prompts.title')}
                </h2>
                <p className="mt-4 font-satoshi text-[16px] sm:text-[18px] leading-[160%] text-white/65 max-w-[680px]">
                    {t('mcp.prompts.lead')}
                </p>

                <div className="mt-10 sm:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10">
                    {groups.map((group, i) => (
                        <div key={i}>
                            <h3 className="font-mono text-[11px] sm:text-[12px] tracking-[2.5px] uppercase text-white/55 border-t border-white/[0.08] pt-4">
                                {group.label}
                            </h3>
                            <div className="mt-4 flex flex-col gap-2.5">
                                {group.items.map((prompt, j) => (
                                    <CopyableValue
                                        key={j}
                                        value={prompt}
                                        trackingLocation="prompt"
                                        variant="inline"
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
