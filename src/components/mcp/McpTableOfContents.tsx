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
    const [activeId, setActiveId] = useState<string>(Object.values(SECTION_IDS)[0])

    useEffect(() => {
        // Sorted by document position, not by the order of the SECTION_IDS
        // object: "the last section you have scrolled past" is only meaningful
        // against the real order on the page.
        const sections = Object.values(SECTION_IDS)
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => el !== null)
            .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)
        if (sections.length === 0) return

        // The observer is only the trigger — it fires as sections cross a band
        // across the upper-middle of the viewport. What gets highlighted is then
        // recomputed from every section, not just the ones that fired: reading
        // the entries alone leaves the menu stuck on whatever was last seen once
        // you scroll above the first section or below the last.
        const band = () => window.innerHeight * 0.3

        const recompute = () => {
            const passed = sections.filter((section) => section.getBoundingClientRect().top <= band())
            setActiveId((passed[passed.length - 1] ?? sections[0]).id)
        }

        const observer = new IntersectionObserver(recompute, {
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0,
        })
        sections.forEach((section) => observer.observe(section))

        // A jump — Home, a hash link, a restored scroll position — can land
        // with no section crossing the band at either end, so the observer
        // never fires and the menu keeps the row it had. Coalesced into a
        // frame so this stays cheap over five elements.
        let frame = 0
        const onScroll = () => {
            if (frame) return
            frame = requestAnimationFrame(() => {
                frame = 0
                recompute()
            })
        }
        window.addEventListener('scroll', onScroll, { passive: true })

        recompute()

        return () => {
            observer.disconnect()
            window.removeEventListener('scroll', onScroll)
            if (frame) cancelAnimationFrame(frame)
        }
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
