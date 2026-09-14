import { afterEach, describe, expect, it, vi } from 'vitest'

/**
 * This guard is the only thing keeping the build out of the production ad
 * account and analytics project: the prerender pass drives 177 routes against
 * a preview server on 127.0.0.1 on every deploy and every PR build, and an
 * unanswered cookie banner now counts as permission to track.
 */

function stubHost(hostname: string): void {
    vi.stubGlobal('window', { location: { hostname } })
}

async function load() {
    vi.resetModules()
    return import('../src/utils/trackingEnv')
}

afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
})

describe('isLocalHost', () => {
    it.each(['localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]', ''])('treats %s as local', async (host) => {
        stubHost(host)
        expect((await load()).isLocalHost()).toBe(true)
    })

    it.each(['macbook.local', 'augo.localhost'])('treats %s as local', async (host) => {
        stubHost(host)
        expect((await load()).isLocalHost()).toBe(true)
    })

    it.each(['192.168.1.9', '10.0.0.4', '172.16.0.1', '172.31.255.254'])(
        'treats the LAN address %s as local', async (host) => {
            stubHost(host)
            expect((await load()).isLocalHost()).toBe(true)
        })

    it.each(['augotraining.com', 'www.augotraining.com', 'augo-website.vercel.app', '172.15.0.1', '8.8.8.8'])(
        'treats %s as production', async (host) => {
            stubHost(host)
            expect((await load()).isLocalHost()).toBe(false)
        })
})

describe('isTrackingEnabled', () => {
    it('is off on the host the prerenderer and CI use', async () => {
        stubHost('127.0.0.1')
        expect((await load()).isTrackingEnabled()).toBe(false)
    })

    it('is on for the live site', async () => {
        stubHost('augotraining.com')
        expect((await load()).isTrackingEnabled()).toBe(true)
    })

    it('VITE_TRACKING_DEBUG=1 overrides the local-host block', async () => {
        stubHost('localhost')
        vi.stubEnv('VITE_TRACKING_DEBUG', '1')
        expect((await load()).isTrackingEnabled()).toBe(true)
    })

    it('is off with no window at all', async () => {
        vi.stubGlobal('window', undefined)
        expect((await load()).isTrackingEnabled()).toBe(false)
    })
})
