import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { COPY } from './constants'

const WORDS = COPY.titleParts.words
/** Seconds before the first swap, so "Endurance" is what a visitor reads first. */
const FIRST_DELAY = 2.5
/** Seconds each word holds between swaps. */
const HOLD = 2
const FADE = 0.35

/**
 * The sport in the course headline: "Endurance", then Running, Cycling,
 * Triathlon and back. Same fade-and-slide as the rotating word in Hero.tsx, but
 * the slot also resizes to each word, so "Coach" always sits right after it.
 *
 * The markup only ever contains "Endurance": the other words are written into
 * the span by the timeline, and widths are measured with a throwaway element
 * that is removed straight after. So the prerendered h1, which is what search
 * and answer engines read, is the plain "Endurance" headline. The prerenderer
 * sets __PRERENDER__, and there the rotation never starts, so the snapshot
 * cannot catch a different word. Nor does it run under reduced motion.
 *
 * The page puts the full headline in the h1's aria-label, so screen readers
 * hear it once rather than a word that keeps changing.
 */
export default function RotatingSport() {
    const slotRef = useRef<HTMLSpanElement>(null)
    const wordRef = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        const slot = slotRef.current
        const word = wordRef.current
        if (!slot || !word) return
        const heading = slot.closest('h1')
        if (window.__PRERENDER__) return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        let index = 0
        let widths: number[] = []

        // Each word's width in the h1's current font, from an invisible copy
        // that lives in the slot only for the length of the measurement.
        const measure = () => {
            const probe = document.createElement('span')
            probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;left:0;top:0'
            slot.appendChild(probe)
            widths = WORDS.map((w) => {
                probe.textContent = w
                return probe.getBoundingClientRect().width
            })
            probe.remove()

            // A shorter word can pull the headline up a line, which would make
            // the whole page jump on every swap. Lay the h1 out with each word
            // in turn (synchronously, so nothing paints) and hold it at the
            // tallest. The text is restored before the browser draws.
            if (heading) {
                heading.style.minHeight = ''
                const shown = word.textContent
                let tallest = 0
                WORDS.forEach((w, i) => {
                    word.textContent = w
                    slot.style.width = `${widths[i]}px`
                    tallest = Math.max(tallest, heading.getBoundingClientRect().height)
                })
                word.textContent = shown
                heading.style.minHeight = `${tallest}px`
            }
            gsap.set(slot, { width: widths[index] })
        }

        let timeline: gsap.core.Timeline | null = null
        let pending: gsap.core.Tween | null = null

        const swap = () => {
            const next = (index + 1) % WORDS.length
            timeline = gsap
                .timeline({
                    onComplete: () => {
                        pending = gsap.delayedCall(HOLD, swap)
                    },
                })
                .to(word, { opacity: 0, y: -10, duration: FADE, ease: 'power2.inOut' })
                .add(() => {
                    index = next
                    word.textContent = WORDS[next]
                })
                .set(word, { y: 10 })
                .to(slot, { width: () => widths[next], duration: FADE, ease: 'power2.inOut' })
                .to(word, { opacity: 1, y: 0, duration: FADE, ease: 'power2.inOut' }, '-=0.15')
        }

        measure()
        // The web font may still be loading at mount, which would measure the
        // fallback font; the h1 also changes size at breakpoints.
        void document.fonts?.ready.then(measure)
        window.addEventListener('resize', measure)
        pending = gsap.delayedCall(FIRST_DELAY, swap)

        return () => {
            window.removeEventListener('resize', measure)
            pending?.kill()
            timeline?.kill()
            gsap.set(slot, { clearProps: 'width' })
            if (heading) heading.style.minHeight = ''
            gsap.set(word, { clearProps: 'opacity,transform' })
            word.textContent = WORDS[0]
        }
    }, [])

    return (
        <span ref={slotRef} className="relative inline-block whitespace-nowrap">
            <span ref={wordRef} className="inline-block">
                {WORDS[0]}
            </span>
        </span>
    )
}
