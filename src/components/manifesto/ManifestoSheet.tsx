import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import augoLogo from '../../assets/images/augo_footer_1.svg'
import { COPY, type ManifestoBlock, type Signature as SignatureData } from './constants'
import { layoutSignatures, NARROW_GRID, WIDE_GRID, type Placement, type Zone } from './layout'
import Signature from './Signature'
import type { Look } from './ink'

/** Matches Tailwind's `lg`, where the gutters beside the text appear. */
const WIDE_QUERY = '(min-width: 1024px)'

/** Height of one bottom-band row, in px. */
const ROW_PX = { wide: 76, narrow: 64 }

/** Base font size and the characters that fit a cell at that size, per zone. */
const ZONE_INK: Record<Zone, { size: number; fits: number }> = {
    top: { size: 34, fits: 12 },
    left: { size: 28, fits: 8 },
    right: { size: 28, fits: 8 },
    bottom: { size: 34, fits: 12 },
}
const NARROW_INK = { size: 24, fits: 9 }

function useIsWide(): boolean {
    // Prerender runs at 1280 wide, so starting wide matches the snapshot.
    const [wide, setWide] = useState(true)
    useEffect(() => {
        const query = window.matchMedia(WIDE_QUERY)
        const update = () => setWide(query.matches)
        update()
        query.addEventListener('change', update)
        return () => query.removeEventListener('change', update)
    }, [])
    return wide
}

function Block({ block, look }: { block: ManifestoBlock; look: Look }) {
    return (
        <p
            className={
                block.kind === 'statement'
                    ? `font-semibold ${look.statement} text-[17px] leading-snug`
                    : `${look.body} text-[16px] leading-relaxed`
            }
        >
            {block.lines.map((line, i) => (
                <span key={i} className="block">
                    {line}
                </span>
            ))}
        </p>
    )
}

interface ZoneLayerProps {
    zone: Zone
    items: { signature: SignatureData; placement: Placement; index: number }[]
    wide: boolean
    freshIndex: number | null
    freshRef: RefObject<HTMLDivElement | null>
    look: Look
}

function ZoneLayer({ zone, items, wide, freshIndex, freshRef, look }: ZoneLayerProps) {
    const ink = wide ? ZONE_INK[zone] : NARROW_INK
    return (
        <>
            {items
                .filter((item) => item.placement.zone === zone)
                .map(({ signature, placement, index }) => (
                    <Signature
                        key={`${signature.name}|${signature.signedAt}|${index}`}
                        ref={index === freshIndex ? freshRef : undefined}
                        signature={signature}
                        placement={placement}
                        sizePx={ink.size}
                        fits={ink.fits}
                        fresh={index === freshIndex}
                        stacked={!wide || zone === 'left' || zone === 'right'}
                        look={look}
                    />
                ))}
        </>
    )
}

interface ManifestoSheetProps {
    signatures: SignatureData[]
    /** Index of a signature that was just added, to write it on and scroll to it. */
    freshIndex: number | null
    look: Look
}

/**
 * The paper: the manifesto in two columns as on the poster, with the
 * signatures in the margins around it. The sheet is a picture of the real
 * poster, so its text is near-black on off-white and the ink is red; see the
 * note in constants.ts.
 */
export default function ManifestoSheet({ signatures, freshIndex, look }: ManifestoSheetProps) {
    const wide = useIsWide()
    const freshRef = useRef<HTMLDivElement>(null)

    const layout = useMemo(() => layoutSignatures(signatures, wide ? WIDE_GRID : NARROW_GRID), [signatures, wide])
    const items = signatures.map((signature, index) => ({ signature, placement: layout.placements[index], index }))
    const rowPx = wide ? ROW_PX.wide : ROW_PX.narrow

    useEffect(() => {
        if (freshIndex === null) return
        freshRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, [freshIndex])

    const layer = (zone: Zone) => (
        <ZoneLayer zone={zone} items={items} wide={wide} freshIndex={freshIndex} freshRef={freshRef} look={look} />
    )

    return (
        <div className={`relative w-full max-w-[1240px] mx-auto overflow-hidden ${look.sheet}`}>
            {/* A faint paper grain, so the sheet does not read as a flat UI card. */}
            {look.grain && (
                <div
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none opacity-[0.35] mix-blend-multiply"
                    style={{
                        backgroundImage:
                            'radial-gradient(rgba(0,0,0,0.035) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.025) 1px, transparent 1px)',
                        backgroundSize: '3px 3px, 7px 7px',
                        backgroundPosition: '0 0, 1px 2px',
                    }}
                />
            )}

            {wide && <div className="relative h-[150px]">{layer('top')}</div>}

            <div className="relative grid lg:grid-cols-[200px_1fr_200px]">
                {wide && <div className="relative">{layer('left')}</div>}

                <div className="px-6 pt-10 sm:px-10 lg:px-4 lg:pt-0">
                    <p className={`font-mono font-bold text-[18px] sm:text-[20px] mb-8 ${look.eyebrow}`}>{COPY.eyebrow}</p>
                    <div className="grid gap-y-5 md:grid-cols-2 md:gap-x-14">
                        {COPY.columns.map((column, c) => (
                            <div key={c} className="flex flex-col gap-5">
                                {column.map((block, b) => (
                                    <Block key={b} block={block} look={look} />
                                ))}
                            </div>
                        ))}
                    </div>
                    <p className={`font-mono text-[12px] mt-8 ${look.place}`}>{COPY.place}</p>
                </div>

                {wide && <div className="relative">{layer('right')}</div>}
            </div>

            <div className="relative" style={{ height: `${layout.bottomRows * rowPx + 70}px` }}>
                <div className="absolute inset-x-0 top-6 px-3 sm:px-6 lg:px-16" style={{ height: `${layout.bottomRows * rowPx}px` }}>
                    <div className="relative h-full">{layer('bottom')}</div>
                </div>
                <img
                    src={augoLogo}
                    alt="augo"
                    width={80}
                    height={28}
                    className={`absolute right-6 bottom-5 sm:right-10 sm:bottom-7 w-[72px] sm:w-[88px] h-auto ${look.logo}`}
                />
            </div>
        </div>
    )
}
