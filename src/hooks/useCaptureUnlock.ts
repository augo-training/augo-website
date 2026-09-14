import { useCallback, useState } from 'react'

function hasCaptured(key: string): boolean {
    try {
        return localStorage.getItem(key) === '1'
    } catch {
        return false
    }
}

function markCaptured(key: string) {
    try {
        localStorage.setItem(key, '1')
    } catch {
        // Storage unavailable (e.g. private mode) — the unlock just won't survive
        // a reload. It still holds for the rest of the session.
    }
}

/**
 * Gates a capture landing page's way out. The Nice pages have no navbar and no
 * footer, and their logo is inert until the visitor has given us their email —
 * at which point the logo becomes a link home. Remembered in localStorage so a
 * reload doesn't lock a subscriber back out.
 *
 * Each page passes its own key, from its own constants file: capturing on
 * /nice-athletes must not unlock /nice-coaches, since they are separate funnels
 * with separate offers.
 *
 * Mirrors the storage handling in useFilmGate.
 */
export function useCaptureUnlock(storageKey: string): { unlocked: boolean; unlock: () => void } {
    // Lazy initialiser, not `useState(hasCaptured)`: the bare form would hand
    // React's own initial-state argument in as the storage key.
    const [unlocked, setUnlocked] = useState(() => hasCaptured(storageKey))

    const unlock = useCallback(() => {
        markCaptured(storageKey)
        setUnlocked(true)
    }, [storageKey])

    return { unlocked, unlock }
}
