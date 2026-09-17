/**
 * Postcard codes: three letters, printed on the card next to the QR, one per
 * coach. The real list lives in the "Nice 70.3 Worlds" tab of the
 * nice_703_thank_you_cards_contacts sheet, which is what the Make webhooks
 * check against. The codes identify the card, not the person, which is why the
 * form still asks for a first name and an email.
 *
 * Kept free of browser globals and env so it can be unit-tested under Node.
 */

export type MerciSrc = 'postcard' | 'email'

const CODE_PATTERN = /^[A-Z]{3}$/

/**
 * Trim, uppercase and drop every space, so " nve " and "n v e" both become
 * "NVE". Anything else is returned compacted but otherwise untouched, for
 * isWellFormed() to reject.
 */
export function normalizeCode(raw: string): string {
    return raw.trim().toUpperCase().replace(/\s+/g, '')
}

export function isWellFormed(code: string): boolean {
    return CODE_PATTERN.test(code)
}

/** Email links carry `&src=email`; everything else came off a postcard. */
export function parseSrc(value: string | null): MerciSrc {
    return value === 'email' ? 'email' : 'postcard'
}
