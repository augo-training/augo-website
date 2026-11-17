import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import augoLogo from '../../assets/images/augo_footer_1.svg'
import { COPY, type ManifestoBlock, type Signature as SignatureData } from './constants'
import { layoutSignatures, NARROW_GRID, WIDE_GRID, type Placement, type Zone } from './layout'
import Signature from './Signature'

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

function Block({ block }: { block: ManifestoBlock }) {
    return (
        <p
            className={
                block.kind === 'statement'
                    ? 'font-semibold text-white text-[17px] leading-snug'
                    : 'text-white text-[16px] leading-relaxed'
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
}

function ZoneLayer({ zone, items, wide, freshIndex, freshRef }: ZoneLayerProps) {
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
                    />
                ))}
        </>
    )
}

interface ManifestoSheetProps {
    signatures: SignatureData[]
    /** Index of a signature that was just added, to write it on and scroll to it. */
    freshIndex: number | null
}

/**
 * The manifesto in two columns as on the Zürich poster, with the signatures
 * in the margins around it. Black on the black page, so the sheet is the page:
 * white text and yellow ink (see the note in constants.ts).
 */
export default function ManifestoSheet({ signatures, freshIndex }: ManifestoSheetProps) {
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
        <ZoneLayer zone={zone} items={items} wide={wide} freshIndex={freshIndex} freshRef={freshRef} />
    )

    return (
        <div className="relative w-full max-w-[1240px] mx-auto overflow-hidden bg-dark">
            {wide && (
                <div className="relative h-[150px] px-16">
                    <div className="relative h-full">{layer('top')}</div>
                </div>
            )}

            <div className="relative grid lg:grid-cols-[200px_1fr_200px]">
                {wide && <div className="relative">{layer('left')}</div>}

                <div className="px-6 pt-10 sm:px-10 lg:px-4 lg:pt-0">
                    <div className="grid gap-y-5 md:grid-cols-2 md:gap-x-14">
                        {COPY.columns.map((column, c) => (
                            <div key={c} className="flex flex-col gap-5">
                                {column.map((block, b) => (
                                    <Block key={b} block={block} />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {wide && <div className="relative">{layer('right')}</div>}
            </div>

            <div className="relative" style={{ height: `${layout.bottomRows * rowPx + (wide ? 70 : 96)}px` }}>
                <div className="absolute inset-x-0 top-6 px-3 sm:px-6 lg:px-16" style={{ height: `${layout.bottomRows * rowPx}px` }}>
                    <div className="relative h-full">{layer('bottom')}</div>
                </div>
                {/* Signed off at the bottom right, where a reader going left to right ends. */}
                <div className="absolute right-6 bottom-5 sm:right-10 sm:bottom-7 flex items-center gap-4 sm:gap-6">
                    <p className="font-mono text-[12px] text-text-muted">{COPY.place}</p>
                    <img src={augoLogo} alt="augo" width={80} height={28} className="w-[72px] sm:w-[88px] h-auto" />
                </div>
            </div>
        </div>
    )
}
