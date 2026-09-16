/**
 * Postcard codes: `NICE-` plus three digits, handwritten next to the QR. Codes
 * are not mapped to names (most cards were prepared before we had names), which
 * is why the offer form asks for a first name.
 *
 * Kept free of browser globals and env so it can be unit-tested under Node.
 */

export type MerciSrc = 'postcard' | 'email'

const CODE_PATTERN = /^NICE-\d{3}$/

/**
 * Trim, uppercase, drop every space, and accept a missing hyphen, so that
 * " nice 042 " and "NICE042" both become "NICE-042". Anything else is returned
 * compacted but otherwise untouched, for isWellFormed() to reject.
 */
export function normalizeCode(raw: string): string {
    const compact = raw.trim().toUpperCase().replace(/\s+/g, '')
    const bare = /^NICE(\d{3})$/.exec(compact)
    return bare ? `NICE-${bare[1]}` : compact
}

export function isWellFormed(code: string): boolean {
    return CODE_PATTERN.test(code)
}

/** Email links carry `&src=email`; everything else came off a postcard. */
export function parseSrc(value: string | null): MerciSrc {
    return value === 'email' ? 'email' : 'postcard'
}
