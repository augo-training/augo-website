import { describe, expect, it } from 'vitest'
import { isWellFormed, normalizeCode, parseSrc } from '../src/components/merci/code'

/**
 * The code is three letters printed on a postcard and typed on a phone, so the
 * field has to forgive case and stray spaces, and still reject anything that is
 * not exactly three letters.
 */

describe('normalizeCode', () => {
    it.each([
        ['NVE', 'NVE'],
        ['nve', 'NVE'],
        [' nve ', 'NVE'],
        ['n v e', 'NVE'],
        ['\tGuz\n', 'GUZ'],
    ])('%j becomes %s', (raw, expected) => {
        expect(normalizeCode(raw)).toBe(expected)
    })

    it('leaves an empty field empty, so the door can ask for the code', () => {
        expect(normalizeCode('   ')).toBe('')
    })
})

describe('isWellFormed', () => {
    it.each(['NVE', 'MLI', 'GUZ', 'ZZZ', 'AAA'])('accepts %s', (code) => {
        expect(isWellFormed(code)).toBe(true)
    })

    it.each(['AB', 'ABCD', 'A1C', '123', 'NICE-042', 'AB-', '', 'ÀBC'])(
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
