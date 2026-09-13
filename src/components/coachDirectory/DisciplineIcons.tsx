import type { Discipline } from '../../data/coaches/types'

interface Props {
    disciplines: Discipline[]
    size?: number
    className?: string
}

const LABEL: Record<Discipline, string> = {
    running: 'Run',
    cycling: 'Bike',
    triathlon: 'Tri',
    rowing: 'Row',
    'mental-coaching': 'Mind',
}

function Icon({ d, size }: { d: Discipline; size: number }) {
    const s = { width: size, height: size }
    if (d === 'running') {
        return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={s} aria-hidden="true">
                <circle cx="13" cy="4" r="1.3" />
                <path d="M4 17l5 1l.75 -1.5" />
                <path d="M15 21l0 -4l-4 -3l1 -6" />
                <path d="M7 12l0 -3l5 -1l3 3l3 1" />
            </svg>
        )
    }
    if (d === 'cycling') {
        return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={s} aria-hidden="true">
                <circle cx="5.5" cy="17.5" r="3.5" />
                <circle cx="18.5" cy="17.5" r="3.5" />
                <path d="M15 6h3l-3 8H8l3-6 4 1z" />
                <circle cx="15" cy="4" r="1.5" />
            </svg>
        )
    }
    if (d === 'rowing') {
        return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={s} aria-hidden="true">
                <path d="M3 16h18l-3 4H6z" />
                <path d="M12 16V7" />
                <path d="M12 7l7-3" />
                <circle cx="7" cy="6" r="1.3" />
            </svg>
        )
    }
    if (d === 'mental-coaching') {
        return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={s} aria-hidden="true">
                <path d="M9 21v-3H6l-1-3 2-1V9a6 6 0 0 1 12 0v2l1 3-2 1v3h-3v3" />
                <path d="M11 9a2 2 0 1 1 3 1.7V13" />
            </svg>
        )
    }
    // Triathlon: swim wave over a bike wheel and a running stride.
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={s} aria-hidden="true">
            <path d="M3 5c1.5-1.2 3-1.2 4.5 0s3 1.2 4.5 0 3-1.2 4.5 0 3 1.2 4.5 0" />
            <circle cx="7" cy="17" r="4" />
            <circle cx="16.3" cy="9.3" r="1.3" />
            <path d="M14 21l3-5 4 1" />
            <path d="M17 16l-1-4 3 1" />
        </svg>
    )
}

export default function DisciplineIcons({ disciplines, size = 18, className = '' }: Props) {
    return (
        <div className={`inline-flex items-center gap-2 ${className}`} aria-label={`Disciplines: ${disciplines.map((d) => LABEL[d]).join(', ')}`}>
            {disciplines.map((d) => (
                <span key={d} className="inline-flex items-center gap-1 text-white">
                    <Icon d={d} size={size} />
                </span>
            ))}
        </div>
    )
}

export { LABEL as DISCIPLINE_LABEL }
