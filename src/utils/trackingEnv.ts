/**
 * Where tracking is allowed to run.
 *
 * Both trackers ask this before sending anything, so the rule lives in exactly
 * one place — and it is the guard that keeps the build out of the data.
 *
 * Hostname, not `import.meta.env.DEV`. DEV is true only under `vite dev`; it is
 * false for `vite preview`, for the prerender pass in scripts/prerender.ts, and
 * for CI builds, all of which would otherwise look like production. The
 * prerenderer walks 177 routes against a preview server on 127.0.0.1 on every
 * deploy and every PR build, and since an unanswered cookie banner now counts
 * as permission to track, the hostname check is the only thing stopping a few
 * hundred fake page views per build from reaching Meta and Mixpanel.
 */

const LOCAL_HOSTNAMES = new Set(['', 'localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]'])

/** 10.x, 172.16–31.x and 192.168.x — the ranges `vite dev` prints as its
 *  Network URL, so a phone testing over the LAN does not count as production. */
const PRIVATE_IPV4 =
    /^(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3})$/

export function isLocalHost(): boolean {
    if (typeof window === 'undefined') return true
    const host = window.location.hostname
    if (LOCAL_HOSTNAMES.has(host)) return true
    if (host.endsWith('.local') || host.endsWith('.localhost')) return true
    return PRIVATE_IPV4.test(host)
}

/** VITE_TRACKING_DEBUG=1 forces tracking on from a local host, for testing. */
export function isTrackingEnabled(): boolean {
    if (typeof window === 'undefined') return false
    if (import.meta.env.VITE_TRACKING_DEBUG === '1') return true
    return !isLocalHost()
}
