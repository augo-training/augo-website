import { forwardRef } from 'react'
import { COPY, type Signature as SignatureData } from './constants'
import { inkStyle, type Look } from './ink'
import type { Placement } from './layout'
import { formatSignedAt } from './signatures'

/** Long names are written smaller so they stay inside their cell. */
function lengthFactor(name: string, fits: number): number {
    return name.length > fits ? Math.max(0.55, fits / name.length) : 1
}

interface SignatureProps {
    signature: SignatureData
    placement: Placement
    /** Base font size for the zone, before the length and per-font adjustments. */
    sizePx: number
    /** Characters that fit the zone's cell at full size. */
    fits: number
    /** Just signed: write it on with the reveal animation. */
    fresh?: boolean
    /** Date under the name rather than beside it, for the narrow gutters. */
    stacked?: boolean
    look: Look
}

/**
 * One name on the sheet: the signature in red ink and, beside it, the date in
 * small grey mono. Positioned by its centre within its zone.
 */
const Signature = forwardRef<HTMLDivElement, SignatureProps>(function Signature(
    { signature, placement, sizePx, fits, fresh = false, stacked = false, look },
    ref,
) {
    const size = sizePx * placement.scale * lengthFactor(signature.name, fits)

    return (
        <div
            ref={ref}
            className={`absolute flex whitespace-nowrap pointer-events-none select-none ${
                stacked ? 'flex-col items-end' : 'items-baseline gap-1.5'
            }`}
            style={{
                left: `${placement.x}%`,
                top: `${placement.y}%`,
                transform: `translate(-50%, -50%) rotate(${placement.rotate}deg)`,
            }}
        >
            <span
                className={fresh ? 'manifesto-ink-fresh' : undefined}
                style={{ ...inkStyle(placement.font, size, look), lineHeight: 1.1 }}
            >
                {signature.name}
            </span>
            <span className={`font-mono text-[10px] leading-none ${look.note} ${stacked ? '' : 'translate-y-[-2px]'}`}>
                {formatSignedAt(signature.signedAt)}
            </span>
            {signature.pending && (
                <span className={`absolute left-1/2 top-full mt-1 w-[150px] -translate-x-1/2 whitespace-normal text-center font-mono text-[10px] leading-tight ${look.note}`}>
                    {COPY.pendingNote}
                </span>
            )}
        </div>
    )
})

export default Signature
