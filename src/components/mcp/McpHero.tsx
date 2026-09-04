import { useTranslation } from 'react-i18next'
import CopyableValue from './CopyableValue'
import McpSpecList from './McpSpecList'
import McpJumpList from './McpJumpList'
import { MCP_URL, type McpSpecRow } from './constants'

/**
 * Hero. The server URL sits above the fold on purpose: it is the string every
 * reader came for, and the first thing an answer engine lifts off the page.
 */
export default function McpHero() {
    const { t } = useTranslation()
    const glance = t('mcp.atAGlance.items', { returnObjects: true }) as McpSpecRow[]

    return (
        <section
            aria-labelledby="mcp-hero-title"
            className="w-full pt-32 sm:pt-40 pb-16 sm:pb-20 px-5 sm:px-8 bg-dark texture-grain"
        >
            <div className="max-w-[960px] mx-auto">
                <div className="inline-flex mb-5">
                    <span className="inline-flex items-center rounded-full border border-white/20 px-3 py-1.5 font-mono text-[11px] tracking-[2.5px] uppercase text-white/70">
                        {t('mcp.hero.eyebrow')}
                    </span>
                </div>
                <h1
                    id="mcp-hero-title"
                    className="font-satoshi font-bold text-[36px] sm:text-[52px] lg:text-[64px] leading-[105%] tracking-[-0.03em] text-white max-w-[860px]"
                >
                    {t('mcp.hero.title')}
                </h1>
                <p className="mt-6 font-satoshi text-[17px] sm:text-[20px] leading-[155%] text-white/75 max-w-[720px]">
                    {t('mcp.hero.lead')}
                </p>

                <div className="max-w-[720px]">
                    <CopyableValue
                        value={MCP_URL}
                        label={t('mcp.hero.urlLabel')}
                        trackingLocation="hero"
                    />
                </div>

                <p className="mt-4 font-mono text-[11px] sm:text-[12px] tracking-[1.5px] text-white/35">
                    {t('mcp.hero.lastVerified')}
                </p>

                <McpSpecList rows={glance} size="compact" />
                <McpJumpList />
            </div>
        </section>
    )
}
