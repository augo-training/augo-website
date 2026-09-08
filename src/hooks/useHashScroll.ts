import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Scrolls to the element named by the URL hash, and keeps it there.
 *
 * A single scroll on mount is not enough on a long page: the sections above the
 * target gain height as images, fonts and web video land, so the target slides
 * further down after the scroll has already happened. On the home page this was
 * measured landing roughly 6,500px short of the intended section.
 *
 * So we re-align while the target keeps moving, give up after a few seconds,
 * and stop the moment the reader scrolls for themselves — a late correction
 * that yanks the page out from under someone is worse than landing short.
 */
export default function useHashScroll() {
    const { hash } = useLocation()

    useEffect(() => {
        if (!hash) return

        let timer = 0
        let tries = 0
        let lastTop = Number.NaN
        let firstAlign = true
        let stopped = false

        const stop = () => {
            stopped = true
            window.clearTimeout(timer)
        }

        const align = () => {
            if (stopped) return
            let target: Element | null = null
            try {
                target = document.querySelector(hash)
            } catch {
                return // a hash that isn't a valid selector
            }
            if (target) {
                const top = Math.round(target.getBoundingClientRect().top + window.scrollY)
                if (top !== lastTop) {
                    // Smooth for the first move, so in-page nav still glides;
                    // instant for corrections, which would otherwise fight it.
                    target.scrollIntoView({ behavior: firstAlign ? 'smooth' : 'auto' })
                    lastTop = top
                    firstAlign = false
                }
            }
            tries += 1
            if (tries < 60) timer = window.setTimeout(align, 50)
        }

        window.addEventListener('wheel', stop, { passive: true })
        window.addEventListener('touchstart', stop, { passive: true })
        window.addEventListener('keydown', stop)
        align()

        return () => {
            stop()
            window.removeEventListener('wheel', stop)
            window.removeEventListener('touchstart', stop)
            window.removeEventListener('keydown', stop)
        }
    }, [hash])
}
