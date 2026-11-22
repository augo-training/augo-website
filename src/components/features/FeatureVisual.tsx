import type { FeatureVisual as Visual } from './constants'

const GLOW = 'radial-gradient(ellipse at center, rgba(200, 15, 37, 0.45) 0%, rgba(254, 95, 33, 0.15) 45%, transparent 72%)'

const FRAME: Record<Visual['shape'], string> = {
    square: 'aspect-square',
    tall: 'aspect-[4/5]',
    wide: 'aspect-[3/2]',
    phone: 'aspect-[3/2]',
}

const IMAGE: Record<Visual['shape'], string> = {
    square: 'w-[92%] h-[92%] object-contain',
    tall: 'h-[88%] w-auto max-w-[80%] object-contain rounded-[22px]',
    wide: 'w-[94%] h-auto object-contain rounded-xl border border-white/[0.08]',
    phone: 'h-[90%] w-auto object-contain rounded-[18px]',
}

/**
 * A product render on the same glow the homepage carousels use. Static on
 * purpose: this page is prerendered, so nothing here animates in.
 */
export default function FeatureVisual({ visual, alt }: { visual: Visual; alt: string }) {
    return (
        <div
            className={`relative w-full ${FRAME[visual.shape]} rounded-2xl overflow-hidden flex items-center justify-center`}
            style={{ background: 'linear-gradient(14.48deg, #151515 -17.53%, #090909 79.83%)' }}
        >
            <div className="absolute inset-0 pointer-events-none" style={{ background: GLOW }} />
            <img
                src={visual.src}
                alt={alt}
                loading="lazy"
                decoding="async"
                className={`relative ${IMAGE[visual.shape]}`}
            />
        </div>
    )
}
