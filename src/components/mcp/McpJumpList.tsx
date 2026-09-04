import { useTranslation } from 'react-i18next'

interface JumpItem {
    id: string
    label: string
}

/**
 * The in-hero jump row, for viewports too narrow for the floating
 * McpTableOfContents. Plain hash anchors, not <Link>. The browser handles them natively, honours
 * scroll-margin, and puts a copyable deep link in the address bar — all of
 * which a router navigation would take away.
 */
export default function McpJumpList() {
    const { t } = useTranslation()
    const items = t('mcp.jumpList.items', { returnObjects: true }) as JumpItem[]

    return (
        <nav
            aria-labelledby="mcp-jump-title"
            className="mt-10 sm:mt-12 border-t border-white/[0.08] pt-6 min-[1340px]:hidden"
        >
            <p
                id="mcp-jump-title"
                className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/55"
            >
                {t('mcp.jumpList.title')}
            </p>
            <ol className="mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-2 list-none p-0">
                {items.map((item, i) => (
                    <li key={item.id} className="flex items-baseline gap-2">
                        <span
                            aria-hidden="true"
                            className="font-mono text-[11px] text-white/30 tabular-nums"
                        >
                            {String(i + 1).padStart(2, '0')}
                        </span>
                        <a
                            href={`#${item.id}`}
                            className="footer-link font-satoshi font-medium text-[15px] sm:text-[16px] text-white/70 hover:text-white transition-colors duration-200"
                        >
                            {item.label}
                        </a>
                    </li>
                ))}
            </ol>
        </nav>
    )
}
