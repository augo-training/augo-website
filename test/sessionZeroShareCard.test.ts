import { describe, expect, it } from 'vitest'
import { existsSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import {
    SESSION_ZERO_CANONICAL,
    SESSION_ZERO_OG_IMAGE,
} from '../src/components/sessionZero/constants'

/**
 * Same guard as test/merciShareCard.test.ts: the share card is the one thing a
 * coach sees before opening the invitation, and a missing file fails silently.
 * The URL in the meta tag and a real file in public/ have to meet.
 */

const publicUrl = (url: string) => new URL(url)
const repoFile = (path: string) => fileURLToPath(new URL(`../${path}`, import.meta.url))

describe('session zero share card', () => {
    it('points at an absolute https URL', () => {
        expect(SESSION_ZERO_OG_IMAGE).toMatch(/^https:\/\//)
    })

    it('is served from the same host as the canonical URL', () => {
        expect(publicUrl(SESSION_ZERO_OG_IMAGE).host).toBe(publicUrl(SESSION_ZERO_CANONICAL).host)
    })

    it('resolves to a file that exists in public/', () => {
        const path = publicUrl(SESSION_ZERO_OG_IMAGE).pathname.replace(/^\//, '')
        const onDisk = repoFile(`public/${path}`)
        expect(existsSync(onDisk), `${path} is missing from public/`).toBe(true)
        expect(statSync(onDisk).size).toBeGreaterThan(10_000)
    })
})
