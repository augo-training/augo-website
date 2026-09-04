import type { McpSpecRow } from './constants'

interface McpSpecListProps {
    rows: McpSpecRow[]
    /** Tighter type for the hero, where the list sits under the lead. */
    size?: 'default' | 'compact'
}

/**
 * The site's spec-sheet rhythm — numbered mono label, satoshi statement.
 * Same idiom as AugoStandard and CoachSpecSheet; used three times on this page,
 * which is what makes it worth a component here rather than another copy-paste.
 */
export default function McpSpecList({ rows, size = 'default' }: McpSpecListProps) {
    const compact = size === 'compact'
    return (
        <dl className={`flex flex-col ${compact ? 'mt-8' : 'mt-10 sm:mt-12'}`}>
            {rows.map((row, i) => (
                <div
                    key={i}
                    className={`group grid grid-cols-[24px_minmax(96px,150px)_1fr] sm:grid-cols-[32px_minmax(130px,190px)_1fr] items-baseline gap-x-3 sm:gap-x-6 border-t border-white/[0.08] last:border-b last:border-white/[0.08] transition-colors duration-200 hover:bg-white/[0.015] ${
                        compact ? 'py-4 sm:py-5' : 'py-5 sm:py-6'
                    }`}
                >
                    <span className="font-mono text-[11px] sm:text-[12px] tracking-[1.5px] text-white/35 tabular-nums">
                        {String(i + 1).padStart(2, '0')}
                    </span>
                    <dt className="font-mono text-[11px] sm:text-[12px] tracking-[2.5px] uppercase text-white/55 group-hover:text-white/85 transition-colors duration-200">
                        {row.label}
                    </dt>
                    <dd
                        className={`font-satoshi font-medium leading-[140%] text-white ${
                            compact ? 'text-[14px] sm:text-[16px]' : 'text-[15px] sm:text-[18px]'
                        }`}
                    >
                        {row.statement}
                    </dd>
                </div>
            ))}
        </dl>
    )
}
