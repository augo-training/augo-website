import { useEffect, useState, useSyncExternalStore } from 'react'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(onChange: () => void): () => void {
    const query = window.matchMedia(REDUCED_MOTION_QUERY)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
}

/**
 * The CSS half of reduced motion lives in index.css (`.merci-*` animations off).
 * This is the JS half: it switches off the typing, which CSS cannot reach.
 */
export function useReducedMotion(): boolean {
    return useSyncExternalStore(
        subscribe,
        () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
        () => false,
    )
}

/** Types `text` in one character every `charMs`. Disabled, it returns the whole text at once. */
export function useTypewriter(text: string, charMs: number, enabled: boolean): string {
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!enabled) return
        let typed = 0
        let timer: number
        const tick = () => {
            typed += 1
            setCount(typed)
            if (typed < text.length) timer = window.setTimeout(tick, charMs)
        }
        timer = window.setTimeout(tick, charMs)
        return () => window.clearTimeout(timer)
    }, [text, charMs, enabled])

    return enabled ? text.slice(0, count) : text
}

export const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))
