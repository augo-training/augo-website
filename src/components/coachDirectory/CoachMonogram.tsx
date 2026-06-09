import type { Coach } from '../../data/coaches/types'

type Size = 'sm' | 'md' | 'lg'

const TEXT_SIZE: Record<Size, string> = {
    sm: 'text-xl sm:text-2xl',
    md: 'text-5xl sm:text-6xl',
    lg: 'text-7xl sm:text-8xl',
}

/** First + last initial, e.g. "Anderson de Oliveira Silva" -> "AS". */
function initials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (parts.length === 0) return '?'
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * Neutral stand-in shown wherever a coach has no real photo (currently every
 * non-founding coach). Fills its parent, so the parent controls the shape/size.
 */
export default function CoachMonogram({
    coach,
    size = 'md',
    className = '',
}: {
    coach: Coach
    size?: Size
    className?: string
}) {
    return (
        <div
            aria-hidden="true"
            className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-dark-700 to-dark-800 ${className}`}
        >
            <span
                className={`font-satoshi font-bold tracking-[-0.02em] text-white/20 select-none ${TEXT_SIZE[size]}`}
            >
                {initials(coach.name)}
            </span>
        </div>
    )
}
