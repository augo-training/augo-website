import { useEffect, useState } from 'react'

/**
 * Height of the cookie banner while it is on screen, 0 otherwise.
 *
 * The banner is fixed to the bottom of every page. Most pages scroll, so it
 * simply overlaps content harmlessly — but the Ironman Nice landing page has to
 * keep its CTA on one screen, and on a phone the banner sits directly on top of
 * the button. Reserving the banner's measured height keeps the button clear
 * without hardcoding a number that a longer translation would break.
 *
 * The banner mounts ~800ms after load, so this watches for it rather than
 * measuring once, and listens for the same 'cookie-consent-changed' event
 * CookieConsent dispatches when it is dismissed.
 */
export function useCookieBannerHeight(): number {
    const [height, setHeight] = useState(0)

    useEffect(() => {
        let resizeObserver: ResizeObserver | null = null

        const measure = () => {
            const banner = document.querySelector('.cookie-banner')
            resizeObserver?.disconnect()
            resizeObserver = null

            if (!banner) {
                setHeight(0)
                return
            }
            setHeight(banner.getBoundingClientRect().height)
            resizeObserver = new ResizeObserver(() =>
                setHeight(banner.getBoundingClientRect().height),
            )
            resizeObserver.observe(banner)
        }

        measure()
        const mutationObserver = new MutationObserver(measure)
        mutationObserver.observe(document.body, { childList: true, subtree: true })
        window.addEventListener('cookie-consent-changed', measure)

        return () => {
            resizeObserver?.disconnect()
            mutationObserver.disconnect()
            window.removeEventListener('cookie-consent-changed', measure)
        }
    }, [])

    return height
}
