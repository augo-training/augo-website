import type { CSSProperties, MouseEvent, ReactNode } from 'react'
import { TIMING, type HeadlineLine } from './constants'

interface BeatProps {
    /** Accessible name when there is no heading to point at. */
    label?: string
    labelledBy?: string
    role?: 'dialog'
    /** 'top' for the offer, which is taller than a phone and scrolls. */
    align?: 'center' | 'top'
    /**
     * Beats without controls let taps fall through to the Back/Next zones
     * underneath. Beats with controls (the door, the offer) catch them.
     */
    interactive?: boolean
    scroll?: boolean
    /** Less bottom padding, for a beat without the tap hint (the offer). */
    tight?: boolean
    leaving?: boolean
    onClick?: (event: MouseEvent<HTMLElement>) => void
    children: ReactNode
}

/**
 * One full-screen beat. It fades in and rises 14px each time it mounts, so
 * callers key it by beat to replay the entrance.
 */
export function Beat({
    label,
    labelledBy,
    role,
    align = 'center',
    interactive = false,
    scroll = false,
    tight = false,
    leaving = false,
    onClick,
    children,
}: BeatProps) {
    const className = [
        'merci-beat',
        align === 'top' ? 'justify-start' : 'justify-center',
        interactive ? 'pointer-events-auto' : 'pointer-events-none',
        scroll ? 'overflow-y-auto overscroll-contain' : '',
        tight ? 'merci-beat-tight' : '',
        leaving ? 'merci-beat-out' : '',
    ].join(' ')

    return (
        <section
            role={role}
            aria-modal={role === 'dialog' ? true : undefined}
            aria-label={labelledBy ? undefined : label}
            aria-labelledby={labelledBy}
            onClick={onClick}
            className={className}
        >
            {children}
        </section>
    )
}

interface HeadlineProps {
    id?: string
    lines: HeadlineLine[]
    /** When the first line starts rising, from the moment the beat mounts. */
    startMs?: number
}

/**
 * The big type on the door and the done state. Lines rise in one after another,
 * TIMING.lineStaggerMs apart. The card has no headline of its own: its title is
 * the heading there.
 */
export function Headline({ id, lines, startMs = 0 }: HeadlineProps) {
    return (
        <h1 id={id} className="merci-headline merci-headline-xl">
            {lines.map((line, i) => {
                const delay = startMs + i * TIMING.lineStaggerMs
                return (
                    <span
                        key={i}
                        className={`merci-line ${line.dim ? 'text-dark-400' : 'text-white'}`}
                        style={{ animationDelay: `${delay}ms` }}
                    >
                        {line.mark ? (
                            <span
                                className="merci-mark"
                                style={{ '--mark-delay': `${delay + 450}ms` } as CSSProperties}
                            >
                                {line.text}
                            </span>
                        ) : (
                            line.text
                        )}
                        {/* Lines are blocks; the space keeps screen readers from running words together. */}{' '}
                    </span>
                )
            })}
        </h1>
    )
}

interface RiseProps {
    delayMs: number
    className?: string
    children: ReactNode
}

/** Anything after a headline: the same rise, `delayMs` after the beat mounts. */
export function Rise({ delayMs, className = '', children }: RiseProps) {
    return (
        <div className={`merci-line ${className}`} style={{ animationDelay: `${delayMs}ms` }}>
            {children}
        </div>
    )
}
