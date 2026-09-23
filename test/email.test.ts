import { describe, expect, it } from 'vitest'
import { isValidEmail } from '../src/utils/email'

/**
 * Loose on purpose: the check only has to catch a typo before the address is
 * stored, not decide what a valid address is. Stray spaces around it are fine.
 */
describe('isValidEmail', () => {
    it.each(['coach@example.com', ' coach@example.com ', 'first.last+tag@sub.example.co.uk'])(
        'accepts %j',
        (value) => {
            expect(isValidEmail(value)).toBe(true)
        },
    )

    it.each(['', '   ', 'coach@', '@example.com', 'coach example.com', 'coach@example', 'coach@@example.com'])(
        'rejects %j',
        (value) => {
            expect(isValidEmail(value)).toBe(false)
        },
    )
})
