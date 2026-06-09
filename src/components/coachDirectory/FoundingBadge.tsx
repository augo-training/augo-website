import { Award } from 'lucide-react'

type Size = 'sm' | 'md'

interface Props {
    size?: Size
    className?: string
}

/**
 * Premium pill used everywhere a founding coach is rendered. Solid white on
 * dark for maximum contrast — reads instantly as a curated mark.
 */
export default function FoundingBadge({ size = 'sm', className = '' }: Props) {
    const isMd = size === 'md'
    const padX = isMd ? 'px-3' : 'px-2.5'
    const padY = isMd ? 'py-1.5' : 'py-1'
    const iconSize = isMd ? 14 : 12
    const textSize = isMd ? 'text-[11px]' : 'text-[9.5px] sm:text-[10px]'
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full bg-white ${padX} ${padY} shadow-[0_4px_20px_-4px_rgba(255,255,255,0.18)] ${className}`}
            aria-label="Founding coach"
        >
            <Award
                className="text-dark flex-shrink-0"
                style={{ width: iconSize, height: iconSize }}
                strokeWidth={2.25}
                aria-hidden="true"
            />
            <span
                className={`font-mono ${textSize} tracking-[1.5px] uppercase text-dark font-bold whitespace-nowrap`}
            >
                Founding Coach
            </span>
        </span>
    )
}
