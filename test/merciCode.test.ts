import { describe, expect, it } from 'vitest'
import { isWellFormed, normalizeCode, parseSrc } from '../src/components/merci/code'

/**
 * The code is handwritten on a postcard and typed on a phone, so the field has
 * to forgive case, stray spaces and a missing hyphen, and still reject
 * anything that is not NICE plus exactly three digits.
 */

describe('normalizeCode', () => {
    it.each([
        ['NICE-042', 'NICE-042'],
        ['nice-042', 'NICE-042'],
        [' nice 042 ', 'NICE-042'],
        ['NICE042', 'NICE-042'],
        ['nice 0 4 2', 'NICE-042'],
        ['\tNICE-042\n', 'NICE-042'],
    ])('%j becomes %s', (raw, expected) => {
        expect(normalizeCode(raw)).toBe(expected)
    })

    it('leaves an empty field empty, so the door can ask for the code', () => {
        expect(normalizeCode('   ')).toBe('')
    })
})

describe('isWellFormed', () => {
    it.each(['NICE-001', 'NICE-042', 'NICE-150', 'NICE-999'])('accepts %s', (code) => {
        expect(isWellFormed(code)).toBe(true)
    })

    it.each(['nice-42', 'NICE-0042', 'NICE-04A', 'NIC-042', 'NICE--042', '042', 'NICE', ''])(
        'rejects %j once normalised',
        (raw) => {
            expect(isWellFormed(normalizeCode(raw))).toBe(false)
        },
    )
})

describe('parseSrc', () => {
    it('reads the email arm from &src=email', () => {
        expect(parseSrc('email')).toBe('email')
    })

    it.each([null, '', 'postcard', 'EMAIL', 'qr'])('treats %j as a postcard scan', (value) => {
        expect(parseSrc(value)).toBe('postcard')
    })
})
