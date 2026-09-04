import type { ReactNode } from 'react'

interface McpCalloutProps {
    /** 'note' = plain white rule. 'warning' = brand gradient rule. */
    tone?: 'note' | 'warning'
    /** Mono uppercase label, e.g. "Browser only". */
    label?: string
    children: ReactNode
}

/**
 * An aside inside a setup flow. The accent is the left rule, never the text —
 * body copy on this site stays white or grey, and the brand gradient is a
 * background, not a colour for words.
 */
export default function McpCallout({ tone = 'note', label, children }: McpCalloutProps) {
    return (
        <div className="relative pl-5 py-4">
            <span
                aria-hidden="true"
                className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-full ${
                    tone === 'warning'
                        ? 'bg-[linear-gradient(180deg,var(--color-red)_0%,var(--color-orange)_50%,var(--color-yellow)_100%)]'
                        : 'bg-white/20'
                }`}
            />
            {label && (
                <p className="font-mono text-[11px] tracking-[2.5px] uppercase text-white/55 mb-1.5">
                    {label}
                </p>
            )}
            <div className="font-satoshi text-[15px] sm:text-[17px] leading-[160%] text-white/75">
                {children}
            </div>
        </div>
    )
}
