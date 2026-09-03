import { describe, it, expect } from 'vitest'
import { normalizePage } from '../src/utils/page'

describe('normalizePage', () => {
    it('strips the language prefix and trailing slash', () => {
        expect(normalizePage('/en/nice-athletes/', 'en')).toBe('/nice-athletes')
        expect(normalizePage('/en/nice-athletes', 'en')).toBe('/nice-athletes')
        expect(normalizePage('/de/book-a-demo/', 'de')).toBe('/book-a-demo')
    })

    it('reports the home page as "/"', () => {
        expect(normalizePage('/en', 'en')).toBe('/')
        expect(normalizePage('/en/', 'en')).toBe('/')
        expect(normalizePage('/', undefined)).toBe('/')
    })

    it('detects the language prefix itself when none is given', () => {
        expect(normalizePage('/en/nice-athletes/')).toBe('/nice-athletes')
        expect(normalizePage('/pt/')).toBe('/')
        expect(normalizePage('/english-things/')).toBe('/english-things')
    })
})
