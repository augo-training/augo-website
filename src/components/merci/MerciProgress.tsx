import { COPY, LAST_BEAT } from './constants'

const BEATS = Array.from({ length: LAST_BEAT }, (_, i) => i + 1)

/**
 * One thin bar per beat: current white, passed white at 70%, upcoming
 * dark. White rather than a brand colour, because these sit over the red glow
 * and knowing where you are is the bar's whole job.
 *
 * No background of their own: the offer's scroll area fades its text out
 * before it reaches them (.merci-beat-scroll).
 */
export function MerciProgress({ beat }: { beat: number }) {
    return (
        <div
            aria-hidden="true"
            className="merci-progress pointer-events-none absolute inset-x-0 top-0 z-30 flex gap-1.5 px-6"
        >
            {BEATS.map((n) => (
                <span
                    key={n}
                    className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${
                        n === beat ? 'bg-white' : n < beat ? 'bg-white/70' : 'bg-dark-600'
                    }`}
                />
            ))}
        </div>
    )
}

/** Bottom-left nudge on the beats before the ticket. Keyed by beat by the caller so it fades in again each time. */
export function MerciHint() {
    return (
        <p
            aria-hidden="true"
            className="merci-hint merci-label merci-line pointer-events-none absolute left-6 z-30 text-text-muted"
            style={{ animationDelay: '1200ms' }}
        >
            {COPY.hint} <span className="merci-nudge">→</span>
        </p>
    )
}
