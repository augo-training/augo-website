import type { Discipline } from '../../data/coaches/types'

export type SportFilterValue = 'all' | Discipline

interface Props {
    value: SportFilterValue
    onChange: (next: SportFilterValue) => void
    counts: Record<SportFilterValue, number>
}

const OPTIONS: { value: SportFilterValue; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'running', label: 'Running' },
    { value: 'cycling', label: 'Cycling' },
    { value: 'triathlon', label: 'Triathlon' },
]

export default function SportFilter({ value, onChange, counts }: Props) {
    return (
        <div
            role="tablist"
            aria-label="Filter by sport"
            className="flex flex-wrap items-center gap-2 sm:gap-3"
        >
            {OPTIONS.map((opt) => {
                const active = opt.value === value
                return (
                    <button
                        key={opt.value}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => onChange(opt.value)}
                        className={`group inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[11px] sm:text-[12px] tracking-[2px] uppercase cursor-pointer transition-all duration-200 ${
                            active
                                ? 'bg-white text-dark font-bold'
                                : 'bg-transparent text-white/65 hover:text-white ring-1 ring-white/[0.10] hover:ring-white/25'
                        }`}
                    >
                        <span>{opt.label}</span>
                        <span
                            className={`tabular-nums text-[10px] ${
                                active ? 'text-dark/55' : 'text-white/35 group-hover:text-white/55'
                            }`}
                        >
                            {counts[opt.value]}
                        </span>
                    </button>
                )
            })}
        </div>
    )
}
