import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import {
    AGENDA,
    COPY,
    SESSION_ZERO_CANONICAL,
    SESSION_ZERO_PATH,
    SESSION_ZERO_ROBOTS,
} from '../src/components/sessionZero/constants'

/**
 * The invitation has no runtime to speak of, so what can go wrong is in the
 * data and in what the rest of the site says about it. These pin both down:
 * the agenda reads in order, the head keeps the page out of search, the
 * components obey the house rule on colour, and nothing public names the path.
 */

const repoFile = (path: string) => fileURLToPath(new URL(`../${path}`, import.meta.url))
const read = (path: string) => readFileSync(repoFile(path), 'utf8')
const toMinutes = (hhmm: string) => {
    const [h, m] = hhmm.split(':').map(Number)
    return h * 60 + m
}

describe('session zero agenda', () => {
    it('runs from 09:00 to 17:30 in strictly increasing order', () => {
        expect(AGENDA[0].time).toBe('09:00')
        expect(AGENDA[AGENDA.length - 1].time).toBe('17:30')
        for (let i = 1; i < AGENDA.length; i++) {
            expect(toMinutes(AGENDA[i].time)).toBeGreaterThan(toMinutes(AGENDA[i - 1].time))
        }
    })

    it('states a duration that fits before the next slot', () => {
        AGENDA.forEach((item, i) => {
            if (!item.minutes) return
            const next = AGENDA[i + 1]
            expect(next, `${item.time} is the last slot but names a duration`).toBeTruthy()
            expect(toMinutes(item.time) + item.minutes).toBeLessThanOrEqual(toMinutes(next.time))
        })
    })

    it('leaves breaks without a note or duration', () => {
        for (const item of AGENDA.filter((i) => i.kind === 'break')) {
            expect(item.note).toBeUndefined()
            expect(item.minutes).toBeUndefined()
        }
    })
})

describe('session zero head', () => {
    it('keeps the page out of search', () => {
        const directives = SESSION_ZERO_ROBOTS.split(/,\s*/)
        expect(directives).toEqual(expect.arrayContaining(['noindex', 'nofollow']))
    })

    it('uses the trailing-slash canonical the host serves with a 200', () => {
        expect(SESSION_ZERO_CANONICAL).toBe(`https://www.augotraining.com${SESSION_ZERO_PATH}/`)
    })

    it('says no more in the description than the share card does', () => {
        // A crawler that does not run JavaScript sees the description and nothing
        // else. It must not carry the agenda, the seat count or who it is for.
        expect(COPY.pageDescription).not.toMatch(/coach|agenda|ten|10|AI/i)
    })
})

describe('session zero copy rules', () => {
    const componentDir = repoFile('src/components/sessionZero')
    const sources = [
        ...readdirSync(componentDir)
            .filter((f) => f.endsWith('.tsx'))
            .map((f) => `src/components/sessionZero/${f}`),
        'src/pages/SessionZero.tsx',
    ]

    it('never colours text', () => {
        // Text is white or grey only. The brand gradient belongs to shapes, and
        // the amber status colour on the Human Edge page is not to be copied.
        const forbidden = /text-\[#|text-(red|orange|yellow)\b|bg-clip-text|text-transparent|#FBBF24|brand-gradient-text/
        for (const file of sources) {
            expect(read(file), file).not.toMatch(forbidden)
        }
    })

    it('has no links or buttons', () => {
        // A reading page. No way onward, and no way back into the site either.
        for (const file of sources) {
            expect(read(file), file).not.toMatch(/<a\s|<button|<Link/)
        }
    })

    it('uses no em dashes', () => {
        expect(JSON.stringify(COPY)).not.toContain('—')
        expect(JSON.stringify(AGENDA)).not.toContain('—')
    })
})

describe('session zero stays unadvertised', () => {
    it('is named nowhere a crawler is told to look', () => {
        for (const file of ['public/robots.txt', 'public/llms.txt']) {
            expect(read(file), file).not.toContain('session-zero')
        }
    })

    it('is linked from neither the navbar nor the footer', () => {
        for (const file of ['src/components/Navbar.tsx', 'src/components/Footer.tsx']) {
            expect(read(file), file).not.toContain('session-zero')
        }
    })
})
