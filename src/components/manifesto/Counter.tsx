import { useEffect, useRef, useState } from 'react'
import { COPY } from './constants'
import type { SignatureCounts } from './signatures'

/** Counts from where it was to `to` over ~0.9s. Jumps straight there under reduced motion. */
function useCountUp(to: number, reducedMotion: boolean): number {
    const [value, setValue] = useState(to)
    const from = useRef(to)

    useEffect(() => {
        const start = from.current
        from.current = to
        if (reducedMotion || start === to) return
        const began = performance.now()
        let frame = 0
        const step = (now: number) => {
            const t = Math.min(1, (now - began) / 900)
            const eased = 1 - Math.pow(1 - t, 3)
            setValue(Math.round(start + (to - start) * eased))
            if (t < 1) frame = requestAnimationFrame(step)
        }
        frame = requestAnimationFrame(step)
        return () => cancelAnimationFrame(frame)
    }, [to, reducedMotion])

    return reducedMotion ? to : value
}

/** The total above the sheet, with the coach and athlete split under it once there is one. */
export default function Counter({ counts, reducedMotion }: { counts: SignatureCounts; reducedMotion: boolean }) {
    const total = useCountUp(counts.total, reducedMotion)
    const split = counts.coaches + counts.athletes > 0

    return (
        <div className="text-center" aria-live="polite">
            <p className="font-satoshi font-bold text-white text-[56px] sm:text-[72px] leading-none tracking-[-0.03em] tabular-nums">
                {total.toLocaleString('en-US')}
            </p>
            <p className="mt-2 text-text-muted text-[16px] sm:text-[18px]">
                {counts.total === 1 ? COPY.counterOne : COPY.counterMany}
            </p>
            {split && (
                <p className="mt-1 font-mono text-[12px] tracking-[1px] uppercase text-dark-200">
                    {counts.coaches.toLocaleString('en-US')} coaches · {counts.athletes.toLocaleString('en-US')} athletes
                </p>
            )}
        </div>
    )
}
