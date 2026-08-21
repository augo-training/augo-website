import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useEmailCapture } from '../contexts/EmailCaptureContext'

const FILM_CAPTURE_KEY = 'augo_film_capture_done'

function hasCaptured(): boolean {
    try {
        return localStorage.getItem(FILM_CAPTURE_KEY) === '1'
    } catch {
        return false
    }
}

function markCaptured() {
    try {
        localStorage.setItem(FILM_CAPTURE_KEY, '1')
    } catch {
        // Storage unavailable (e.g. private mode) — they'll just be asked again.
    }
}

/**
 * Gates the film behind the first-name + email capture modal, but only once:
 * after a successful capture (remembered in localStorage), later film clicks
 * play immediately.
 */
export function useFilmGate(): (play: () => void) => void {
    const { t } = useTranslation()
    const { openModal } = useEmailCapture()

    return useCallback(
        (play: () => void) => {
            if (hasCaptured()) {
                play()
                return
            }
            openModal(t('floatingButton.label'), {
                onSuccess: () => {
                    markCaptured()
                    play()
                },
                subtitle: t('emailCapture.filmSubtitle'),
                submitLabel: t('floatingButton.label'),
            })
        },
        [openModal, t],
    )
}
