import { useCallback, useState } from 'react'

const NICE_UNLOCK_KEY = 'augo_nice_athletes_capture_done'

function hasCaptured(): boolean {
    try {
        return localStorage.getItem(NICE_UNLOCK_KEY) === '1'
    } catch {
        return false
    }
}

function markCaptured() {
    try {
        localStorage.setItem(NICE_UNLOCK_KEY, '1')
    } catch {
        // Storage unavailable (e.g. private mode) — the unlock just won't survive
        // a reload. It still holds for the rest of the session.
    }
}

/**
 * Gates the Ironman Nice page's way out. The landing page has no navbar and no
 * footer, and its logo is inert until the visitor has given us their email —
 * at which point the logo becomes a link home. Remembered in localStorage so a
 * reload doesn't lock a subscriber back out.
 *
 * Mirrors the storage handling in useFilmGate.
 */
export function useNiceAthletesUnlock(): { unlocked: boolean; unlock: () => void } {
    const [unlocked, setUnlocked] = useState(hasCaptured)

    const unlock = useCallback(() => {
        markCaptured()
        setUnlocked(true)
    }, [])

    return { unlocked, unlock }
}
