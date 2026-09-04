import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SECTION_IDS } from './constants'

interface JumpItem {
    id: string
    label: string
}

/**
 * Floating section menu, parked in the left margin.
 *
 * Only rendered from min-[1320px] up: a fixed menu needs
 * `viewport >= content + 2 * (menu + gap)`, and with a 960px content column and
 * a 148px menu that lands just under a 1366px laptop. Narrower than that and
 * McpJumpList in the hero is the way through the page.
 *
 * The active row is marked with weight, opacity and a rule — never colour.
 */
export default function McpTableOfContents() {
    const { t } = useTranslation()
    const items = t('mcp.jumpList.items', { returnObjects: true }) as JumpItem[]
    const [activeId, setActiveId] = useState<string>(SECTION_IDS.claude)

    useEffect(() => {
        const sections = Object.values(SECTION_IDS)
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => el !== null)
        if (sections.length === 0) return

        // A band across the upper-middle of the viewport: the section crossing
        // it is the one being read. Bottom-heavy so the last section can still
        // win once the page runs out of scroll.
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
                if (visible[0]) setActiveId(visible[0].target.id)
            },
            { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
        )
        sections.forEach((section) => observer.observe(section))
        return () => observer.disconnect()
    }, [])

    return (
        <nav
            aria-label={t('mcp.jumpList.title')}
            className="hidden min-[1340px]:block fixed top-1/2 -translate-y-1/2 z-40 w-[148px] left-[max(1.25rem,calc(50%-660px))]"
        >
            <p className="font-mono text-[10px] tracking-[2.5px] uppercase text-white/30 pl-4 mb-3">
                {t('mcp.jumpList.title')}
            </p>
            <ul className="flex flex-col list-none p-0 border-l border-white/[0.12]">
                {items.map((item) => {
                    const isActive = item.id === activeId
                    return (
                        <li key={item.id} className="relative">
                            {isActive && (
                                <span
                                    aria-hidden="true"
                                    className="absolute left-[-1px] top-1 bottom-1 w-[2px] bg-white/70"
                                />
                            )}
                            <a
                                href={`#${item.id}`}
                                aria-current={isActive ? 'true' : undefined}
                                className={`block py-2 pl-4 font-satoshi text-[13px] leading-[135%] transition-colors duration-200 hover:text-white ${
                                    isActive ? 'font-medium text-white' : 'text-white/45'
                                }`}
                            >
                                {item.label}
                            </a>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}
