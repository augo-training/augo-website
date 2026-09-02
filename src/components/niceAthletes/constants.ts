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

/** MailerLite group for this campaign's signups (written server-side by Make). */
export const NICE_ATHLETES_GROUP_ID = import.meta.env
    .VITE_MAILERLITE_NICE_ATHLETES_GROUP_ID as string | undefined

/** Identifies the signup source in MailerLite and in Mixpanel. */
export const NICE_ATHLETES_CTA_TEXT = 'Nice Athletes'

export const COPY = {
    eyebrow: 'IRONMAN NICE',
    title: 'Nice has one of the hardest bike courses in the IM circuit.',
    subtitle:
        '5 things to know about the bike course before race day, so nothing catches you by surprise.',
    note: 'From riders who have raced it.',
    /** Unsplash asks for credit as a courtesy. Plain text, never a link — the
     *  page is a dead end until the email is captured. */
    photoCredit: 'Photo by Constantin on Unsplash',
    form: {
        submitLabel: 'Send me the 5 things',
        successTitle: "They're on the way.",
        successBody: 'Check your inbox — the five things are landing there now.',
    },
} as const
