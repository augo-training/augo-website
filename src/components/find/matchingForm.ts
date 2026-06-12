/**
 * The augo matching platform sign-up form (Typeform). One form serves both
 * athletes ("find a coach") and coaches ("get listed") — we just tag the CTA
 * source so the same flow can be attributed per entry point later.
 *
 * Opened as a plain new-tab link (no inline embed, no third-party script on our
 * page). Update the base URL here if the form ever moves.
 */
const MATCHING_FORM_BASE = 'https://augo.typeform.com/to/CdJ3pQgD'

export type MatchingFormSource =
    | 'athlete-hero'
    | 'coach-hero'
    | 'coach-band'

/** Build the form URL, tagging which CTA sent the visitor. */
export function matchingFormUrl(source: MatchingFormSource): string {
    return `${MATCHING_FORM_BASE}?source=${encodeURIComponent(source)}`
}

/**
 * Dedicated founding coach application form (separate Typeform from the
 * shared matching form above). Source-tagged the same way for attribution.
 */
const FOUNDING_FORM_BASE = 'https://augo.typeform.com/to/oykIVYQo'

export function foundingFormUrl(): string {
    return `${FOUNDING_FORM_BASE}?source=founding-band`
}
