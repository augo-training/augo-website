import { describe, expect, it } from 'vitest'
import { existsSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { MERCI_CANONICAL, MERCI_OG_IMAGE } from '../src/components/merci/constants'

/**
 * The /merci share card fails silently in the worst possible way: if the file is
 * renamed or dropped from public/, the tags still parse, the page still works,
 * and the only symptom is that every link a coach is sent previews as whatever
 * the crawler falls back to. Nobody sees that from inside the app.
 *
 * So this asserts the two halves actually meet: the URL in the meta tag and a
 * real file on disk at the path it names.
 */

const publicUrl = (url: string) => new URL(url)
const repoFile = (path: string) => fileURLToPath(new URL(`../${path}`, import.meta.url))

describe('merci share card', () => {
    it('points at an absolute https URL', () => {
        expect(MERCI_OG_IMAGE).toMatch(/^https:\/\//)
    })

    it('is served from the same host as the canonical URL', () => {
        // A crawler that will not follow a redirect for the image gets nothing,
        // so the card must not sit on a host the page itself does not use.
        expect(publicUrl(MERCI_OG_IMAGE).host).toBe(publicUrl(MERCI_CANONICAL).host)
    })

    it('resolves to a file that exists in public/', () => {
        const path = publicUrl(MERCI_OG_IMAGE).pathname.replace(/^\//, '')
        const onDisk = repoFile(`public/${path}`)
        expect(existsSync(onDisk), `${path} is missing from public/`).toBe(true)
        // Crawlers skip images they consider empty or broken; a truncated write
        // would still satisfy existsSync.
        expect(statSync(onDisk).size).toBeGreaterThan(10_000)
    })
})
