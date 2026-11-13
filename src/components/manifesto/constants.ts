/**
 * The community manifesto, "What we stand for": configuration and copy.
 *
 * The page at /en/manifesto recreates the poster the team signed in Zürich on
 * 26 March 2026: an off-white sheet with the manifesto in two columns, and the
 * signatures in red marker around it. Visitors sign by typing their name.
 *
 * The one exception to the site's text rule. Everywhere else text is white or
 * grey only and the brand colours are for shapes. Here the sheet is a picture
 * of a real poster, so the manifesto is set in near-black on paper and the
 * signatures are red ink. The rule still holds off the sheet: the counter, the
 * sign panel and the button are white and grey on dark like the rest of the
 * site.
 *
 * English-only, so every string lives here instead of the locale files. Copy
 * rules: no em dashes, the manifesto text exactly as written.
 */

/** Path under /:lang. Kept in sync with src/App.tsx and scripts/routes.ts. */
export const MANIFESTO_PATH = '/manifesto'

export const MANIFESTO_URL = `https://www.augotraining.com/en${MANIFESTO_PATH}/`

/**
 * The two Make webhooks behind the page (see api.ts). Unset locally, which
 * switches api.ts to its stub.
 */
export const MANIFESTO_SIGN_WEBHOOK_URL = import.meta.env.VITE_MANIFESTO_SIGN_WEBHOOK_URL as string | undefined
export const MANIFESTO_LIST_WEBHOOK_URL = import.meta.env.VITE_MANIFESTO_LIST_WEBHOOK_URL as string | undefined

/**
 * The visitor's own signature, kept until it shows up in the approved list.
 * Approval is by hand, so without this a signer would see nothing happen.
 */
export const MANIFESTO_SIGNATURE_STORAGE_KEY = 'augo_manifesto_signature'

export type SignerRole = 'coach' | 'athlete'

export interface Signature {
    name: string
    /** Unknown for the founding signatures until someone fills it in. */
    role?: SignerRole
    /** YYYY-MM-DD. */
    signedAt: string
    /** The visitor's own signature, not yet approved. Only ever set in their browser. */
    pending?: boolean
}

/**
 * The people who signed the paper poster in Zürich. Rendered into the
 * prerendered HTML, so the sheet is never empty, and counted in the total.
 * Spellings come from the team, not from reading the photo.
 */
export const FOUNDING_DATE = '2026-03-26'
export const FOUNDING_SIGNATURES: Signature[] = []

/** A paragraph on the sheet: a bold statement, or plain lines under it. */
export interface ManifestoBlock {
    kind: 'statement' | 'body'
    lines: string[]
}

export const COPY = {
    eyebrow: '/// What we stand for',
    pageEyebrow: 'Community manifesto',
    place: 'Zürich, March 26th, 2026.',
    columns: [
        [
            {
                kind: 'statement',
                lines: ['We believe coaching is human first', "& performance isn't just numbers on a screen."],
            },
            {
                kind: 'body',
                lines: ["It's trust.", "It's effort.", "It's the quiet signals that don't show up in a dashboard."],
            },
            {
                kind: 'statement',
                lines: [
                    'We reject systems that bury meaning under data and force coaches to choose between growth and care.',
                ],
            },
            {
                kind: 'body',
                lines: ['Coaches caring should never be a constraint. It should be a strength.'],
            },
            {
                kind: 'statement',
                lines: ['We believe the best coaches combine empathy with intelligence.'],
            },
            {
                kind: 'body',
                lines: [
                    'They use technology for clarity, not shortcuts.',
                    'They spend less time managing tools and more time developing people.',
                ],
            },
        ],
        [
            {
                kind: 'statement',
                lines: ['We believe athletes deserve to be heard, not just tracked.'],
            },
            {
                kind: 'body',
                lines: [
                    'Understood, not just analysed.',
                    'Training happens in the real world.',
                    'Coaching happens between people.',
                ],
            },
            { kind: 'statement', lines: ['We are the maximisers.'] },
            {
                kind: 'body',
                lines: [
                    'The ones who raise standards.',
                    'The ones who refuse complacency.',
                    'We choose clarity over chaos.',
                    'Connection over automation.',
                    'Progress over noise.',
                ],
            },
            { kind: 'statement', lines: ['This is the Augo Standard.'] },
            { kind: 'statement', lines: ['Come join us.'] },
        ],
    ] satisfies ManifestoBlock[][],
    counterOne: 'person has signed',
    counterMany: 'people have signed',
    signCta: 'Sign the manifesto',
    signedCta: 'You signed',
    panelTitle: 'Add your name',
    panelLead: "Your signature goes on the sheet with today's date.",
    nameLabel: 'Your name',
    namePlaceholder: 'First and last name',
    emailLabel: 'Email',
    emailPlaceholder: 'you@example.com',
    roleLabel: 'I am a',
    roles: { coach: 'Coach', athlete: 'Athlete' } satisfies Record<SignerRole, string>,
    privacy: 'Only your name is shown. Your email stays private.',
    marketing: 'Send me emails from augo about the community and what we build. Unsubscribe anytime.',
    submit: 'Sign',
    submitting: 'Signing',
    previewEmpty: 'Your signature',
    errorName: 'Add your name, 2 to 40 letters.',
    errorEmail: 'That email looks off.',
    errorRole: 'Pick coach or athlete.',
    errorSubmit: 'That did not go through. Try again in a moment.',
    pendingNote: 'Yours. Everyone sees it after a quick check.',
    thanks: 'Thank you for signing.',
    close: 'Close',
}

export const NAME_MIN = 2
export const NAME_MAX = 40
