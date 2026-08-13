/**
 * The augo matching platform sign-up form (Typeform). One form serves both
 * athletes ("find a coach") and coaches ("get listed") — we just tag the CTA
 * source so the same flow can be attributed per entry point later.
 *
 * Opened as a plain new-tab link (no inline embed, no third-party script on our
 * page). Update the base URL here if the form ever moves.
 *
 * Host note: this uses the per-account subdomain `augo.typeform.com` by
 * deliberate choice. Typeform has deprecated that subdomain, so visitors may hit
 * a "this typeform has moved" interstitial with a Continue button before the
 * form — and because that bounce is a fresh client-side navigation, the
 * `?source=` tag below is at risk of being dropped. Switch the host to
 * `form.typeform.com` (same form id) to serve the form directly.
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
 * Dedicated augo ambassador application form (separate Typeform from the
 * shared matching form above). Source-tagged the same way for attribution.
 * This is the form that used to serve the now-closed founding coach round.
 */
const AMBASSADOR_FORM_BASE = 'https://form.typeform.com/to/oykIVYQo'

export function ambassadorFormUrl(): string {
    return `${AMBASSADOR_FORM_BASE}?source=ambassador-band`
}
