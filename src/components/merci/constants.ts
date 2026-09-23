/**
 * /merci: the page behind the QR code on the "Merci, coach." postcards mailed
 * to coaches after the 2026 IRONMAN 70.3 World Championship in Nice.
 *
 * Deliberately invisible. Nothing on the site links here, the route is not in
 * the sitemap, and the page carries noindex. The only ways in are the QR code
 * on the card and the email links (`/merci?c=NICE-042&src=email`).
 *
 * A code gate, then five beats a coach taps through: the memory, the Assistant,
 * the reassurance, a quote from a coach they may know, and the ticket. What is
 * on offer is a five part email course, not a trial. The free month and the
 * Elite months are made at the end of the course, so the page asks for an email
 * and nothing else. The email is asked at the door, with the code, so it is
 * stored the moment a coach gets in; the ticket then asks for nothing but a tap.
 *
 * Copy rules: no em dashes, plain words, sentence case except the mono
 * eyebrows. And, as everywhere on the site, text is white or grey only. The
 * brand colours are for shapes (the button, the cursor, the mark under
 * "only.", the progress bar), never for letters.
 */

export const MERCI_PATH = '/merci'
export const MERCI_CANONICAL = 'https://augotraining.com/merci/'

/**
 * The share card, lives at public/merci-og.jpg and is regenerated with
 * `npm run og-image:merci`. The postcard itself, not the site-wide card: the
 * link is sent to coaches one at a time, so the preview should be the thing
 * that is coming in the post rather than a screenshot of the home page.
 *
 * Absolute, and on the same host as MERCI_CANONICAL. Social crawlers do not
 * resolve relative URLs and several do not follow redirects for images.
 */
export const MERCI_OG_IMAGE = 'https://augotraining.com/merci-og.jpg'
export const MERCI_OG_IMAGE_ALT =
    'A postcard reading "Merci, coach.", from the 2026 IRONMAN 70.3 World Championship in Nice.'

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
/** The email that went with it. With both saved, a `?c=` link opens by itself again. */
export const MERCI_EMAIL_STORAGE_KEY = 'augo_merci_email'

/** Signup source on the Mixpanel profile. */
export const MERCI_SOURCE = 'Merci Worlds 2026'

/** Beat names as Mixpanel sees them, so a report reads "quote" rather than "4". */
export const BEAT_NAMES: Record<number, string> = {
    1: 'memory',
    2: 'prompt',
    3: 'decide',
    4: 'quote',
    5: 'offer',
}

export const TIMING = {
    eyebrowCharMs: 38,
    lineStaggerMs: 400,
    welcomeHoldMs: 450,
    doorFadeMs: 450,
    questionCharMs: 32,
    answerPauseMs: 450,
    answerCharMs: 9,
    answerHoldMs: 4200,
} as const

export interface HeadlineLine {
    text: string
    /** De-emphasised line (#595959). Decorative only, never the line that carries the point. */
    dim?: boolean
    /** Underlined with a bar of the brand gradient. */
    mark?: boolean
}

export interface TerminalPair {
    question: string
    answer: string
    /**
     * The answer is a column-aligned table and must keep its spacing, so it is
     * set in mono. Everything else is prose and wraps normally, even when it
     * has line breaks in it: a numbered list is not a table, and setting one in
     * non-wrapping mono ran it off the edge of the bubble.
     */
    table?: boolean
}

const DOOR_HEADLINE: HeadlineLine[] = [
    { text: 'For World' },
    { text: 'Championship' },
    { text: 'level coaches' },
    { text: 'only.', mark: true },
]

const MEMORY_HEADLINE: HeadlineLine[] = [
    { text: 'Every message your athlete ever sent you.' },
    { text: 'Every workout.', dim: true },
    { text: 'Every session feedback.', dim: true },
]

const PROMPT_HEADLINE: HeadlineLine[] = [{ text: 'One prompt' }, { text: 'away.' }]

// The spec had the last two lines in yellow. Text is never coloured, so the
// emphasis flips instead: the setup is dim and the payoff is white.
const DECIDE_HEADLINE: HeadlineLine[] = [
    { text: 'You still decide', dim: true },
    { text: 'everything.', dim: true },
    { text: 'You just stop' },
    { text: 'searching.' },
]

const DONE_TAIL: HeadlineLine[] = [
    { text: 'The first email', dim: true },
    { text: 'is on its way.', dim: true },
]

export const COPY = {
    pageTitle: 'Merci, coach. | augo',
    pageDescription: 'For World Championship level coaches only.',
    hint: 'TAP TO CONTINUE',
    door: {
        eyebrow: '/////// BY INVITATION ONLY',
        eyebrowSpoken: 'By invitation only',
        headline: DOOR_HEADLINE,
        // "three letter" is load bearing: it tells a coach how much to type
        // before they start, which the placeholder can only confirm afterwards.
        fieldLabel:
            "Enter your three letter invitation code. It's either on your postcard or sent via email.",
        // Shown in the field itself, so the shape of the code is visible without
        // adding another line of copy under it.
        placeholder: 'ABC',
        /**
         * The email is asked here rather than on the ticket, so a coach who
         * opens the door and stops reading has still left a way to reach them.
         * The ticket then asks for nothing but a tap.
         */
        emailLabel: 'And the email we should write to.',
        emailPlaceholder: 'Email',
        button: 'OPEN',
        checking: 'CHECKING',
        welcome: 'Welcome.',
        invalid: 'That code is not on our list. Check the three letters on your card.',
        empty: 'Type the code from your card.',
        emailInvalid: 'That email does not look right.',
        error: 'Something went wrong on our side. Try again in a moment.',
        /**
         * A way out for someone who was forwarded the link or found a card,
         * not a way in: it leaves for a Typeform rather than opening the
         * door. There is still no "continue without a code" path.
         */
        noCode: 'No invitation code?',
        noCodeHref: 'https://augo.typeform.com/to/CIGaXR1y',
    },
    memory: {
        headline: MEMORY_HEADLINE,
        // Two lines on purpose: the break falls after the comma, so "and being
        // able to analyse it." always reads as one piece.
        subline: ['Now imagine remembering all of it,', 'and being able to analyse it.'],
    },
    prompt: {
        headline: PROMPT_HEADLINE,
        footer: 'AUGO ASSISTANT · EXAMPLE ANSWERS',
        /**
         * The Assistant mock carries no chrome: no title, no menu, no window
         * buttons, no athlete chip. Just the composer, so the exchange reads as
         * a conversation rather than as floating text. Deliberately no model
         * name anywhere: nothing here should imply a choice of AI model.
         */
        assistant: {
            placeholder: 'Ask anything...',
        },
    },
    decide: {
        headline: DECIDE_HEADLINE,
        subline: 'Higher quality coaching, in less time.',
    },
    /**
     * Marco Altini's words, trimmed. His full quote runs on past this into
     * "Thanks to augo, I can be more efficient at many tasks that eventually
     * allow me to be a better coach for my athletes, which should be the whole
     * point." That sentence is cut only for length on a screen read in seconds.
     *
     * Trimming a real person's published words needs his agreement: he has to
     * approve this shortened version before it ships.
     *
     * The role is the site's own wording for him, the same line the home page
     * testimonials use, rather than a title invented here.
     */
    quote: {
        text: "augo enables me to do literally everything I always wanted to do with athletes' data but either could not do or would take me forever to do because we are stuck using coaching platforms designed decades ago.",
        signoff: 'Hurra.',
        name: 'Marco Altini',
        role: 'Running Coach & Founder of HRV4Training',
    },
    offer: {
        codeLabel: 'YOUR INVITATION CODE',
        /**
         * The only heading on this screen. Deliberately the promise rather than
         * the course's name: after five screens of story, naming the product
         * here read as a spec sheet.
         *
         * It also closes the loop the door opens, which used to carry the line
         * "Be the first to know the future."
         *
         * Note this leaves the course unnamed anywhere on the page, so the
         * welcome email has to introduce it rather than assume it.
         */
        heading: 'Be one of the first to see the future of coaching.',
        // The theme, not the mechanics. With both this and the heading kept
        // open-ended, the note under the button is now the only place that says
        // five emails are coming, so that note is load bearing: do not cut it.
        blurb: 'Learn how to leverage AI in your coaching to remain ahead in the industry.',
        button: 'SHOW ME THE FUTURE',
        note: '5 emails. Free. Opt out at any time.',
        // The names are read into this line: "Written in collaboration with
        // coaches to world champions and olympians: X, Y and Z."
        company: {
            before: 'Written in collaboration with coaches to world champions and olympians: ',
            after: '.',
        },
        // No fields: the email came in at the door, so the ticket is one tap.
        form: {
            sending: 'SENDING',
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
        // No first name is collected anywhere, so this answers the postcard's
        // "Merci, coach." rather than greeting the coach by name.
        title: 'Done, coach.',
        tail: DONE_TAIL,
        subline: 'Check your inbox. Enjoy the card. You earned it.',
        /**
         * The only thing to do once the email is in. Deliberately quieter than
         * the ticket's button: checking the inbox is what matters here, and the
         * follow is the optional extra. Uppercase to match every other button on
         * the page, which is also how the footer line below it sets the name.
         *
         * Not the URL as pasted from a browser, which carries `?hl=en`. That is
         * a language override Instagram appends while you browse, and it would
         * force English on a coach reading in French or German.
         */
        instagram: 'FOLLOW AUGO',
        instagramHref: 'https://www.instagram.com/augo.training/',
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

/**
 * Beat 2's example exchanges, shown as if typed into the assistant.
 *
 * Illustrative, and not yet checked: before launch, confirm the assistant can
 * actually answer each of these today from the data augo holds (messages,
 * workouts, session feedback). augo has no sleep data, which is why no prompt
 * mentions sleep.
 *
 * The third answer is a mono table and its whitespace is rendered as-is, so do
 * not reflow or re-indent it.
 */
export const TERMINAL_PAIRS: TerminalPair[] = [
    {
        question: "When did Sarah's calf niggle first show up?",
        answer: '22 July, after the 90 min ride into run. She rated it 3 out of 10 in the session feedback and said it was gone after two days. Mentioned once more on 4 Aug, then never again. You dropped the second plyo session that week.',
    },
    {
        question: 'Prepare me for my post-race call with Sarah.',
        answer: [
            'Three things to bring up.',
            '1. Her bike pacing matched what she told you she wanted in the Sanremo build.',
            '2. She flagged stomach trouble in two long runs in August. Worth asking about race-day fuelling.',
            '3. She wrote "I don\'t want to lose this fitness" twice this month. Ask what she wants next before you propose it.',
        ].join('\n'),
    },
    {
        question: "Analyse Sarah's race pace and effort over the last 12 weeks.",
        answer: [
            'Race-pace run sessions, 12 weeks:',
            '',
            'Wk   Pace   RPE  Feedback',
            '01   4:52   7    "legs heavy"',
            '03   4:48   7    "ok"',
            '05   4:45   8    "hot, faded late"',
            '07   4:44   6    "best one yet"',
            '09   4:46   8    "work week"',
            '11   4:41   6    "easy, held back"',
            '',
            'Pace improved 11 s/km. RPE at that pace dropped from 7 to 6. The two hardest-rated weeks were the two she called stressful in chat.',
        ].join('\n'),
        table: true,
    },
    {
        question:
            'How has Sarah fuelled her high intensity sessions over the last 6 months? Any patterns?',
        answer: 'She logged fuelling on 38 of 41 hard sessions. Pattern: 60 to 70 g carbs per hour on the bike, but under 30 g on hard runs longer than 75 min. The four runs she rated "empty at the end" were all in that group. Gels on the bike, mostly nothing on the run. Worth a conversation before the next build.',
    },
]
