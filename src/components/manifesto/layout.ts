import type { Signature } from './constants'

/**
 * Where each signature goes on the sheet.
 *
 * The sheet has margin zones around the text, the way people signed the
 * poster: a band along the top, a gutter down each side, and a band along the
 * bottom. Each zone is a grid of cells and every signature gets a cell of its
 * own, so names never pile on top of each other.
 *
 * Placement is seeded from the signature itself (name and date), so a name
 * sits in the same spot on every visit and for every visitor. Signatures are
 * placed oldest first and a cell, once taken, is never given up, so a new
 * signature never moves an older one.
 *
 * The first `base` cells (the top band, both gutters and the first rows of the
 * bottom band) are shared out by hash. After that the bottom band grows in
 * blocks of rows, and each block is shared out the same way among the
 * signatures that land in it. The sheet gets taller as people sign rather
 * than more crowded.
 *
 * Pure and free of browser globals so it can be unit-tested under Node.
 */

export type Zone = 'top' | 'left' | 'right' | 'bottom'

export interface ZoneGrid {
    cols: number
    rows: number
}

export interface SheetGrid {
    top: ZoneGrid
    left: ZoneGrid
    right: ZoneGrid
    /** Columns of the bottom band, and the rows it starts with. */
    bottom: ZoneGrid
    /** Rows added to the bottom band each time it fills. */
    growRows: number
    /** How far a name may drift sideways in its cell, as a share of the cell's width. */
    jitterX: number
}

/** Desktop: the poster's shape, names on all four sides. */
export const WIDE_GRID: SheetGrid = {
    top: { cols: 4, rows: 2 },
    left: { cols: 1, rows: 6 },
    right: { cols: 1, rows: 6 },
    bottom: { cols: 4, rows: 2 },
    growRows: 2,
    jitterX: 0.3,
}

/** Phones: no room beside the text, so everything signs below it. */
export const NARROW_GRID: SheetGrid = {
    top: { cols: 0, rows: 0 },
    left: { cols: 0, rows: 0 },
    right: { cols: 0, rows: 0 },
    bottom: { cols: 2, rows: 3 },
    growRows: 2,
    jitterX: 0.15,
}

/** The handwriting fonts, in the order Signature.tsx lists them. */
export const FONT_COUNT = 4

export interface Placement {
    zone: Zone
    /** Centre of the signature, in percent of its zone's width and height. */
    x: number
    y: number
    /** Degrees. */
    rotate: number
    /** 0.85 to 1.15, so not every name is the same size. */
    scale: number
    font: number
}

export interface SheetLayout {
    placements: Placement[]
    /** Rows in the bottom band, after growing. Sets its height. */
    bottomRows: number
}

interface Cell {
    zone: Zone
    col: number
    row: number
}

/** FNV-1a, 32 bit. */
function hash(text: string): number {
    let h = 0x811c9dc5
    for (let i = 0; i < text.length; i++) {
        h ^= text.charCodeAt(i)
        h = Math.imul(h, 0x01000193)
    }
    return h >>> 0
}

/** mulberry32: a small seeded generator, so one hash gives several independent numbers. */
function random(seed: number): () => number {
    let a = seed
    return () => {
        a = (a + 0x6d2b79f5) | 0
        let t = Math.imul(a ^ (a >>> 15), 1 | a)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

function zoneCells(zone: Zone, grid: ZoneGrid, rowOffset = 0): Cell[] {
    const cells: Cell[] = []
    for (let row = 0; row < grid.rows; row++) {
        for (let col = 0; col < grid.cols; col++) cells.push({ zone, col, row: row + rowOffset })
    }
    return cells
}

function baseCells(grid: SheetGrid): Cell[] {
    return [
        ...zoneCells('top', grid.top),
        ...zoneCells('left', grid.left),
        ...zoneCells('right', grid.right),
        ...zoneCells('bottom', grid.bottom),
    ]
}

/** Takes the cell the seed points at, or the next free one after it. */
function claim(pool: Cell[], taken: boolean[], seed: number): Cell {
    const start = seed % pool.length
    for (let i = 0; i < pool.length; i++) {
        const index = (start + i) % pool.length
        if (!taken[index]) {
            taken[index] = true
            return pool[index]
        }
    }
    // Unreachable: callers never put more signatures in a pool than it has cells.
    return pool[start]
}

export function layoutSignatures(signatures: Signature[], grid: SheetGrid): SheetLayout {
    const base = baseCells(grid)
    const blockSize = grid.bottom.cols * grid.growRows
    const placements: Placement[] = []

    let pool = base
    let taken = new Array<boolean>(base.length).fill(false)
    let blockStart = base.length
    let bottomRows = grid.bottom.rows

    signatures.forEach((signature, index) => {
        if (index >= blockStart) {
            // The pool is full: open the next block of rows in the bottom band.
            pool = zoneCells('bottom', { cols: grid.bottom.cols, rows: grid.growRows }, bottomRows)
            taken = new Array<boolean>(pool.length).fill(false)
            blockStart += blockSize
            bottomRows += grid.growRows
        }

        const seed = hash(`${signature.name.toLowerCase()}|${signature.signedAt.slice(0, 10)}`)
        const cell = claim(pool, taken, seed)
        const next = random(seed)
        const zoneGrid = cell.zone === 'bottom' ? { cols: grid.bottom.cols, rows: 1 } : grid[cell.zone]

        // Jitter inside the cell: sideways by grid.jitterX, up to a fifth of its height.
        // None sideways in the gutters, which are one name wide: it would push a
        // name off the sheet or into the text. The draw still happens so the
        // numbers after it stay the same.
        const drawX = next()
        const gutter = cell.zone === 'left' || cell.zone === 'right'
        const jitterX = gutter ? 0 : (drawX - 0.5) * grid.jitterX
        const jitterY = (next() - 0.5) * 0.4
        const x = ((cell.col + 0.5 + jitterX) / zoneGrid.cols) * 100
        // Bottom rows are placed by row index here and turned into percent of the
        // band at render time, because the band's row count is only known at the end.
        const y = cell.zone === 'bottom' ? cell.row + 0.5 + jitterY : ((cell.row + 0.5 + jitterY) / zoneGrid.rows) * 100

        placements.push({
            zone: cell.zone,
            x,
            y,
            rotate: Math.round((next() * 16 - 10) * 10) / 10,
            scale: Math.round((0.85 + next() * 0.3) * 100) / 100,
            font: Math.floor(next() * FONT_COUNT),
        })
    })

    for (const placement of placements) {
        if (placement.zone === 'bottom') placement.y = (placement.y / bottomRows) * 100
    }

    return { placements, bottomRows }
}
