/**
 * /merci: the page behind the QR code on the "Merci, coach." postcards mailed
 * to coaches after the 2026 IRONMAN 70.3 World Championship in Nice.
 *
 * Deliberately invisible. Nothing on the site links here, the route is not in
 * the sitemap, and the page carries noindex. The only ways in are the QR code
 * on the card and the email links (`/merci?c=NICE-042&src=email`).
 *
 * Two screens, and no navigation between them: the door, then the signup card.
 * What is on offer is a five part email course, not a trial. The free month and
 * the Elite months are made at the end of the course, so the page asks for an
 * email and nothing else, and nothing stands between the scan and the form.
 *
 * Copy rules: no em dashes, plain words, sentence case except the mono
 * eyebrows. And, as everywhere on the site, text is white or grey only. The
 * yellow accent is for shapes (the button, the cursor, the mark under "only."),
 * never for letters.
 */

export const MERCI_PATH = '/merci'
export const MERCI_CANONICAL = 'https://augotraining.com/merci/'

/**
 * The two Make webhooks behind the page (see api.ts for the contract). Like the
 * signup webhook these are write-mostly endpoints, not credentials: one says
 * whether a code is on the list, the other records a signup. Left unset on
 * localhost, api.ts falls back to a stub so every state can be walked locally.
 */
export const MERCI_CODE_WEBHOOK_URL = import.meta.env.VITE_MERCI_CODE_WEBHOOK_URL as
    | string
    | undefined
export const MERCI_REDEEM_WEBHOOK_URL = import.meta.env.VITE_MERCI_REDEEM_WEBHOOK_URL as
    | string
    | undefined

/** Last code that opened the door, so a coach coming back finds it prefilled. */
export const MERCI_CODE_STORAGE_KEY = 'augo_merci_code'

/** Signup source on the Mixpanel profile. */
export const MERCI_SOURCE = 'Merci Worlds 2026'

export const TIMING = {
    eyebrowCharMs: 38,
    lineStaggerMs: 400,
    welcomeHoldMs: 450,
    doorFadeMs: 450,
} as const

export interface HeadlineLine {
    text: string
    /** De-emphasised line (#595959). Decorative only, never the line that carries the point. */
    dim?: boolean
    /** Underlined with a yellow bar. */
    mark?: boolean
}

const DOOR_HEADLINE: HeadlineLine[] = [
    { text: 'For World' },
    { text: 'Championship' },
    { text: 'level coaches' },
    { text: 'only.', mark: true },
]

const DONE_TAIL: HeadlineLine[] = [
    { text: 'The first email', dim: true },
    { text: 'is on its way.', dim: true },
]

export const COPY = {
    pageTitle: 'Merci, coach. | augo',
    pageDescription: 'For World Championship level coaches only.',
    door: {
        eyebrow: '/////// BY INVITATION ONLY',
        eyebrowSpoken: 'By invitation only',
        headline: DOOR_HEADLINE,
        fieldLabel: "Enter your invitation code. It's either on your postcard or sent via email.",
        placeholder: 'NICE-000',
        button: 'OPEN',
        checking: 'CHECKING',
        welcome: 'Welcome.',
        invalid: 'That code is not on our list. It sits next to the QR, like NICE-042.',
        empty: 'Type the code from your card.',
        error: 'Something went wrong on our side. Try again in a moment.',
    },
    offer: {
        codeLabel: 'YOUR INVITATION CODE',
        /**
         * The card title, and the only heading on this screen. The course
         * material still calls this "The Irreplaceable Endurance Coach's
         * System"; the two names have to be made the same before launch.
         */
        courseTitle: "The Elite Coach's Success System",
        // The promise is growth without dilution, not AI. AI is how some of the
        // third line happens, which the emails explain; leading with it here
        // sold the tool instead of the outcome. The five mistakes stay in the
        // emails too: this card is what the coach gains, not what they risk.
        //
        // One flowing block, not two: the three levers read as how the promise
        // before them gets kept, and a paragraph break made that a non sequitur.
        blurb: "Take on as many athletes as you want and coach each one of them at the high standard you're known for. Learn how to coach deeper, prioritise better, and do all the manual work in less time.",
        button: 'START THE COURSE',
        note: '5 emails. Free. Opt out at any time.',
        // The names are read into this line: "Written in collaboration with
        // coaches to World & Olympic Champions: X, Y and Z."
        company: {
            before: 'Written in collaboration with coaches to World & Olympic Champions: ',
            after: '.',
        },
        form: {
            firstName: 'First name',
            email: 'Email',
            sending: 'SENDING',
            nameError: 'Your first name, so we know who to write to.',
            emailError: 'That email does not look right.',
            submitError: 'Something went wrong on our side. Try again in a moment.',
        },
        redeemed: {
            before: 'You are already on the list. Check your inbox, or ',
            link: 'write to us',
            href: '/en/contact',
            after: '.',
        },
    },
    done: {
        tail: DONE_TAIL,
        subline: 'Check your inbox. Enjoy the card. You earned it.',
        footer: 'AUGO · AUGOTRAINING.COM',
    },
}

/**
 * Read into COPY.offer.company as "Written in collaboration with coaches to
 * World & Olympic Champions: X, Y and Z."
 *
 * That is the strongest claim on the page and it covers all three names at
 * once, so before this ships: each of them has to agree to it, each has to have
 * actually contributed to the course, and each has to actually have coached a
 * World or Olympic champion. Marco Altini is a scientist and founder rather
 * than a coach, so the line as written does not fit him.
 *
 * Each name links to where that person publishes. They open in a new tab: the
 * page is a two-screen funnel with no way back, so navigating away in the same
 * tab would lose a coach who has not signed up yet.
 */
export const ADVISORS = [
    { name: 'Marco Altini', href: 'https://marcoaltini.substack.com/' },
    { name: 'Reto Brändli', href: 'https://www.instagram.com/reto_braendli/' },
    { name: 'Gordon Crawford', href: 'https://www.linkedin.com/in/gordon-crawford-6149a868/' },
]
