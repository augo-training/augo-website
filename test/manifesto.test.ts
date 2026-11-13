import { describe, expect, it } from 'vitest'
import { layoutSignatures, NARROW_GRID, WIDE_GRID, type SheetGrid } from '../src/components/manifesto/layout'
import {
    cleanName,
    countSignatures,
    formatSignedAt,
    isValidName,
    mergeSignatures,
} from '../src/components/manifesto/signatures'
import type { Signature } from '../src/components/manifesto/constants'

function make(count: number): Signature[] {
    return Array.from({ length: count }, (_, i) => ({
        name: `Signer ${i}`,
        signedAt: `2026-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
    }))
}

function baseCapacity(grid: SheetGrid): number {
    const cells = (z: { cols: number; rows: number }) => z.cols * z.rows
    return cells(grid.top) + cells(grid.left) + cells(grid.right) + cells(grid.bottom)
}

describe('layoutSignatures', () => {
    it('places a signature in the same spot every time', () => {
        const a = layoutSignatures(make(12), WIDE_GRID)
        const b = layoutSignatures(make(12), WIDE_GRID)
        expect(a).toEqual(b)
    })

    it('never moves an earlier signature when a later one arrives', () => {
        for (const grid of [WIDE_GRID, NARROW_GRID]) {
            const before = layoutSignatures(make(40), grid)
            const after = layoutSignatures(make(41), grid)
            for (let i = 0; i < 40; i++) {
                const { zone, x, rotate, scale, font } = before.placements[i]
                expect(after.placements[i]).toMatchObject({ zone, x, rotate, scale, font })
            }
        }
    })

    it('gives every signature a cell of its own', () => {
        const signatures = make(300)
        const { placements, bottomRows } = layoutSignatures(signatures, WIDE_GRID)
        const cells = placements.map((p) => {
            const cols = p.zone === 'bottom' ? WIDE_GRID.bottom.cols : WIDE_GRID[p.zone].cols
            const rows = p.zone === 'bottom' ? bottomRows : WIDE_GRID[p.zone].rows
            return `${p.zone}:${Math.floor((p.x / 100) * cols)}:${Math.floor((p.y / 100) * rows)}`
        })
        expect(new Set(cells).size).toBe(signatures.length)
    })

    it('grows the bottom band only once the base cells are full', () => {
        const capacity = baseCapacity(WIDE_GRID)
        expect(layoutSignatures(make(capacity), WIDE_GRID).bottomRows).toBe(WIDE_GRID.bottom.rows)
        expect(layoutSignatures(make(capacity + 1), WIDE_GRID).bottomRows).toBe(
            WIDE_GRID.bottom.rows + WIDE_GRID.growRows,
        )
    })

    it('puts everything below the text on narrow screens', () => {
        const { placements } = layoutSignatures(make(30), NARROW_GRID)
        expect(placements.every((p) => p.zone === 'bottom')).toBe(true)
    })

    it('keeps every signature inside its zone', () => {
        const { placements } = layoutSignatures(make(200), WIDE_GRID)
        for (const p of placements) {
            expect(p.x).toBeGreaterThan(0)
            expect(p.x).toBeLessThan(100)
            expect(p.y).toBeGreaterThan(0)
            expect(p.y).toBeLessThan(100)
        }
    })
})

describe('isValidName', () => {
    it.each(['Ana Lima', 'José Álvarez', "D'Arcy O'Neil", 'Jean-Luc', 'J. Smith', 'Zoë', '  Bo  '])('accepts %j', (v) => {
        expect(isValidName(v)).toBe(true)
    })

    it.each(['', 'A', ' ', '<script>', 'http://spam.com', '1234', 'a'.repeat(41), '-Ana'])('rejects %j', (v) => {
        expect(isValidName(v)).toBe(false)
    })

    it('collapses spaces', () => {
        expect(cleanName('  Ana    Lima ')).toBe('Ana Lima')
    })
})

describe('mergeSignatures', () => {
    const founding: Signature[] = [{ name: 'Andreas', signedAt: '2026-03-26' }]
    const approved: Signature[] = [
        { name: 'Laura', role: 'coach', signedAt: '2026-11-02' },
        { name: 'Joel', role: 'athlete', signedAt: '2026-10-01' },
    ]

    it('keeps the founding names first and sorts the rest oldest first', () => {
        expect(mergeSignatures(founding, approved, null).map((s) => s.name)).toEqual(['Andreas', 'Joel', 'Laura'])
    })

    it('adds the visitor’s own signature until the list has it, and never twice', () => {
        const own: Signature = { name: 'Bruna', role: 'coach', signedAt: '2026-11-13' }
        expect(mergeSignatures(founding, approved, own).at(-1)).toBe(own)

        const later = mergeSignatures(founding, [...approved, { ...own, name: 'bruna' }], own)
        expect(later).toHaveLength(4)
        expect(later).not.toContain(own)
    })

    it('counts coaches and athletes', () => {
        expect(countSignatures(mergeSignatures(founding, approved, null))).toEqual({
            total: 3,
            coaches: 1,
            athletes: 1,
        })
    })
})

describe('formatSignedAt', () => {
    it('writes the date out', () => {
        expect(formatSignedAt('2026-03-26')).toBe('26 Mar 2026')
        expect(formatSignedAt('2026-11-03T10:00:00Z')).toBe('3 Nov 2026')
        expect(formatSignedAt('soon')).toBe('soon')
    })
})
