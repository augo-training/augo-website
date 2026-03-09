const COOKIE_CONSENT_KEY = 'augo_cookie_consent'

export type ConsentStatus = 'pending' | 'accepted' | 'declined'

export function getConsentStatus(): ConsentStatus {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (stored === 'accepted' || stored === 'declined') return stored
    return 'pending'
}
