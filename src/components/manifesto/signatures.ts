import { NAME_MAX, NAME_MIN, type Signature } from './constants'

/**
 * Pure helpers for the signature list: validating a typed name, merging the
 * founding names, the approved list and the visitor's own pending one, and
 * counting. Kept free of browser globals so they can be unit-tested under Node.
 */

/** Letters in any script, spaces, hyphens, apostrophes and full stops ("J. Smith"). */
const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}' .’-]*$/u

/** Collapses runs of spaces, so "Ana   Lima " is stored and shown as "Ana Lima". */
export function cleanName(value: string): string {
    return value.trim().replace(/\s+/g, ' ')
}

export function isValidName(value: string): boolean {
    const name = cleanName(value)
    return name.length >= NAME_MIN && name.length <= NAME_MAX && NAME_PATTERN.test(name)
}

/** Today in the visitor's time zone, as YYYY-MM-DD. */
export function todayIso(now: Date = new Date()): string {
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const d = String(now.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "2026-03-26" → "26 Mar 2026". Anything unparseable comes back as it was. */
export function formatSignedAt(iso: string): string {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
    if (!match) return iso
    const month = MONTHS[Number(match[2]) - 1]
    if (!month) return iso
    return `${Number(match[3])} ${month} ${match[1]}`
}

function sameSignature(a: Signature, b: Signature): boolean {
    return a.name.toLowerCase() === b.name.toLowerCase() && a.signedAt.slice(0, 10) === b.signedAt.slice(0, 10)
}

/**
 * Everything that goes on the sheet, oldest first: the founding names, then the
 * approved ones, then the visitor's own if it has not been approved yet. The
 * order matters to the layout, which places signatures in this order so that
 * an earlier one never moves when a later one arrives.
 */
export function mergeSignatures(
    founding: Signature[],
    approved: Signature[],
    own: Signature | null,
): Signature[] {
    const sorted = [...approved].sort((a, b) => a.signedAt.localeCompare(b.signedAt))
    const all = [...founding, ...sorted]
    if (own && !all.some((s) => sameSignature(s, own))) all.push({ ...own, pending: true })
    return all
}

/** True once the visitor's own signature is in the approved list, so the saved copy can go. */
export function isApproved(approved: Signature[], own: Signature): boolean {
    return approved.some((s) => sameSignature(s, own))
}

export interface SignatureCounts {
    total: number
    coaches: number
    athletes: number
}

export function countSignatures(signatures: Signature[]): SignatureCounts {
    let coaches = 0
    let athletes = 0
    for (const s of signatures) {
        if (s.role === 'coach') coaches += 1
        else if (s.role === 'athlete') athletes += 1
    }
    return { total: signatures.length, coaches, athletes }
}
