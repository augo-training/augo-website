/**
 * /merci: the page behind the QR code on the "Merci, coach." postcards mailed
 * to coaches after the 2026 IRONMAN 70.3 World Championship in Nice.
 *
 * Deliberately invisible. Nothing on the site links here, the route is not in
 * the sitemap, and the page carries noindex. The only ways in are the QR code
 * on the card and the email links (`/merci?c=NICE-042&src=email`).
 *
 * A code gate, then four beats a coach taps through: the memory, the Assistant,
 * the reassurance, and the ticket. The ticket is a full opt-in page for the
 * course, "The AI-Augmented Coach": what you get, who wrote it (with Marco
 * Altini vouching for augo), a day-by-day peek, and who it is for, with the
 * same one-tap opt-in repeated down the page. What is on offer is a five part
 * email course, not a trial. The free month and the Elite months are made at
 * the end of the course. The email is asked at the door, with the code, so it
 * is stored the moment a coach gets in; the ticket then asks for nothing but a
 * tap.
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
    4: 'offer',
}

/** The ticket. Everything after the door counts up to it. */
export const LAST_BEAT = 4

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
     * Marco Altini's words, trimmed, shown on the ticket under "Written by the
     * augo team". His full quote runs on past this into "Thanks to augo, I can
     * be more efficient at many tasks that eventually allow me to be a better
     * coach for my athletes, which should be the whole point." That sentence is
     * cut only for length.
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
    /**
     * The ticket, now a full opt-in page for the course. The opt-in is one
     * button, "Send me Day 1", repeated five times down the page: in the pass
     * at the top, after each of the first three sections, and in a second pass
     * at the end. The email came in at the door, so there is nothing to type.
     *
     * The copy is the course's own landing copy. The course is named here and
     * nowhere else on the page, so the welcome email can assume it.
     */
    offer: {
        codeLabel: 'YOUR INVITATION CODE',
        // No eyebrow above the headline: the pass already opens with the code
        // strip, and a second mono line made the top of the card busy.
        headline: 'Become an AI-augmented coach in five days.',
        // The aside under the headline, for the coach who is already using AI
        // and would otherwise scroll past: the course is for them too.
        qualifier: '(Even if you think you already have AI figured out)',
        // One sentence between the headline and the button, so the first tap is
        // on the first screen: more athletes, same standard, still personal.
        // Digits, not words, to match "SEND ME DAY 1".
        intro: [
            'A free 5-day email course with 5 AI workflows that let you coach more athletes at the same high standard, without losing the personal touch.',
        ],
        button: 'SEND ME DAY 1',
        get: {
            title: "What you'll get",
            // `bold` lifts the one line that answers "what do I have to set up":
            // nothing.
            items: [
                { text: 'How to stop losing athlete details across WhatsApp, email, your training platform and your own memory, and find any of them in ten seconds' },
                { text: 'A morning prompt that ranks your roster by who needs you most, so the athlete with new pain hears from you Monday, not Thursday' },
                { text: "The post-session questions that get athletes to tell you what the watch can't see" },
                { text: 'A one-page race brief built from the whole season, ready before race week starts' },
                { text: 'A monthly progress report, drafted in minutes, that shows athletes what your coaching did for them' },
                { text: 'Prompts you can copy into Claude or ChatGPT today. Nothing to install.', bold: true },
            ],
        },
        team: {
            title: 'Written by the augo team',
            body: 'We build augo, the coaching platform Marco Altini moved his athletes to. Before we built it, we ran every workflow in this course by hand.',
            after: 'Now you can learn all five workflows for free.',
        },
        peek: {
            title: "A sneak peek of what's inside",
            intro: 'Five AI workflows, one a day.',
            // One line per day: the workflow itself. The limit it fixes used to
            // sit above it and read as clutter.
            days: [
                {
                    label: 'Day 1',
                    fix: 'Never make an athlete repeat themselves again. Ask AI when the calf niggle started and get the date, the session and the score.',
                },
                {
                    label: 'Day 2',
                    fix: 'Let AI rank your roster every morning by who needs you most, before you open a single calendar.',
                },
                {
                    label: 'Day 3',
                    fix: "Feed your AI what the watch can't see: effort, pain, fueling and life outside training, so you can catch the niggle while it's still a niggle.",
                },
                {
                    label: 'Day 4',
                    fix: 'Use AI to write a one-page race brief from the whole season: tapers, fueling, niggles and what came before their best race.',
                },
                {
                    label: 'Day 5',
                    fix: 'Turn four weekly insights into a monthly progress report with AI, drafted in minutes and edited into your voice.',
                },
            ],
            bonus: {
                label: 'Bonus Day 6',
                text: 'The final hack. How to run all five workflows without any manual work.',
            },
        },
        fit: {
            title: 'Is this for me?',
            items: [
                'You coached an athlete to a World Championship and want to do it for more of them',
                "You can't keep every detail about every athlete in your head anymore",
                'You check WhatsApp, email, calls and a training platform just to stay on top of one athlete',
                'You want to grow your roster without your coaching starting to feel like templates',
                "You're curious about AI, but you don't want it coaching your athletes",
            ],
            outro: { before: '...then join ', name: 'The AI-Augmented Coach', after: '.' },
        },
        // The second pass, at the end of the page. The line the "Is this for
        // me?" list leads into, so the two read as one sentence.
        closing: {
            heading: "It's free, and Day 1 arrives tomorrow.",
        },
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
