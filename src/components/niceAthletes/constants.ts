/**
 * Ironman Nice landing page — configuration and copy.
 *
 * This page is deliberately a dead end: it renders no Navbar and no Footer, so
 * the only way off it is the augo logo, which stays inert until the visitor
 * hands over their email. Everything a copy edit could touch lives here.
 *
 * The whole page has to fit one screen on a phone, so keep the copy tight —
 * a long line here is what pushes the button below the fold.
 */

/** Path under /:lang. Kept in sync with src/App.tsx and scripts/routes.ts. */
export const NICE_ATHLETES_PATH = '/nice-athletes'

/**
 * MailerLite group "[Nice] Athletes Hooked" (written server-side by Make).
 *
 * Hardcoded with an env override, the same shape as CoachProfile's group id. A
 * group id is not a credential — it cannot read or write anything on its own —
 * and relying on a build-time secret here fails silently: an unset var makes
 * subscribeToMailerLite fall back to the general website-signups group while
 * the visitor still sees success.
 */
export const NICE_ATHLETES_GROUP_ID =
    (import.meta.env.VITE_MAILERLITE_NICE_ATHLETES_GROUP_ID as string | undefined) ??
    '197524147230738191'

/** Identifies the signup source in MailerLite and in Mixpanel. */
export const NICE_ATHLETES_CTA_TEXT = 'Nice Athletes'

export const COPY = {
    eyebrow: '2026 IRONMAN 70.3 WORLDS NICE',
    title: 'Nice has one of the hardest bike courses in the IM circuit.',
    subtitle:
        '5 things to know about the bike course before race day, so nothing catches you by surprise.',
    note: 'From riders who have raced it.',
    /** Required choice. The value is stored on the MailerLite subscriber as the
     *  `coaching_status` custom field, which is what the two segments filter on. */
    coaching: {
        label: 'Right now I am…',
        options: [
            { value: 'self_coached', label: 'Self-coached' },
            { value: 'human_coach', label: 'Working with a coach' },
        ],
    },
    /** Unsplash asks for credit as a courtesy. Plain text, never a link — the
     *  page is a dead end until the email is captured. */
    photoCredit: 'Photo by Constantin on Unsplash',
    form: {
        submitLabel: 'Send me the 5 things',
        successTitle: "They're on the way.",
        successBody: 'Check your inbox — the five things are landing there now.',
    },
} as const
