/**
 * Ironman Nice coaches landing page — configuration and copy.
 *
 * The coach-facing sibling of niceAthletes/constants.ts. Same deliberate dead
 * end: no Navbar, no Footer, and a logo that stays inert until the visitor
 * hands over their email. Everything a copy edit could touch lives here.
 *
 * The whole page has to fit one screen on a phone, so keep the copy tight —
 * a long line here is what pushes the button below the fold. This title already
 * runs to six lines on a 375px screen, which is why there is no `note` line
 * under the subtitle: with one, an iPhone SE overflows by 37px once the cookie
 * banner is up. Measure before adding anything back.
 *
 * Coaches are never asked the self-coached / works-with-a-coach question, so
 * there is no `coaching` block here and no `coaching_status` on the signup.
 */

/** Path under /:lang. Kept in sync with src/App.tsx and scripts/routes.ts. */
export const NICE_COACHES_PATH = '/nice-coaches'

/**
 * MailerLite group "[Nice] Coaches Hooked" (written server-side by Make).
 *
 * Hardcoded with an env override, the same shape as NICE_ATHLETES_GROUP_ID. A
 * group id is not a credential — it cannot read or write anything on its own —
 * and relying on a build-time secret here fails silently: an unset var makes
 * subscribeToMailerLite fall back to the general website-signups group while
 * the visitor still sees success.
 */
export const NICE_COACHES_GROUP_ID =
    (import.meta.env.VITE_MAILERLITE_NICE_COACHES_GROUP_ID as string | undefined) ??
    '197682549290435626'

/** Identifies the signup source in MailerLite and in Mixpanel. */
export const NICE_COACHES_CTA_TEXT = 'Nice Coaches'

/** localStorage key behind useCaptureUnlock. Separate from the athletes key on
 *  purpose: the two funnels unlock independently. */
export const NICE_COACHES_UNLOCK_KEY = 'augo_nice_coaches_capture_done'

export const COPY = {
    eyebrow: '2026 IRONMAN 70.3 WORLDS NICE',
    title: '10 things to lock in before your athlete’s gun goes off in Nice, so nothing you could have caught slips through on race day',
    subtitle: 'The elite coach’s checklist for Ironman 70.3 Worlds Nice',
    /** Unsplash asks for credit as a courtesy. Plain text, never a link — the
     *  page is a dead end until the email is captured. Same photo, and so the
     *  same credit, as the athletes page. */
    photoCredit: 'Photo by Constantin on Unsplash',
    form: {
        submitLabel: 'Send me the 10 things',
        successTitle: "They’re on the way.",
        successBody: 'Check your inbox — the ten things are landing there now.',
    },
} as const
