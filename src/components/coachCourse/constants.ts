/**
 * "The Irreplaceable Endurance Coach" course landing page — configuration and copy.
 *
 * The opt-in page for a free 5-day email course for coaches. It is built like
 * the Nice landing pages (no Navbar, no Footer, and a logo that stays inert until
 * the visitor hands over their email), but it is a long page rather than a
 * single screen: the ask is repeated after every section, in the shape of the
 * /merci ticket. Unlike the Nice pages it is linked from the site footer, so
 * search engines find it, and it carries Course structured data.
 *
 * Everything a copy edit could touch lives here. The page is written for search
 * as much as for ads, so keep the h1 and the section headings as plain,
 * quotable sentences.
 */

/** Path under /:lang. Kept in sync with src/App.tsx and scripts/routes.ts. */
export const COACH_COURSE_PATH = '/irreplaceable-endurance-coach'

/**
 * MailerLite group "[Course] Irreplaceable Endurance Coach" (written server-side
 * by Make).
 *
 * Hardcoded with an env override, the same shape as NICE_COACHES_GROUP_ID. A
 * group id is not a credential, and relying on a build-time secret here fails
 * silently: an unset var makes subscribeToMailerLite fall back to the general
 * website-signups group while the visitor still sees success.
 */
export const COACH_COURSE_GROUP_ID =
    (import.meta.env.VITE_MAILERLITE_COACH_COURSE_GROUP_ID as string | undefined) ??
    'TODO_GROUP_ID'

/** Identifies the signup source in MailerLite and in Mixpanel. */
export const COACH_COURSE_CTA_TEXT = 'Irreplaceable Coach Course'

/** localStorage key behind useCaptureUnlock. Its own key: signing up here must
 *  not unlock the Nice pages, and the other way round. */
export const COACH_COURSE_UNLOCK_KEY = 'augo_coach_course_capture_done'

/** Which of the page's opt-in forms was used. Rides on the Mixpanel events. */
export type CoachCoursePlacement = 'hero' | 'get' | 'team' | 'peek' | 'fit'

export const COURSE_NAME = 'The Irreplaceable Endurance Coach'

export const COPY = {
    title: 'Become an Irreplaceable Endurance Coach in 5 Days',
    /** The same headline, split around the sport that rotates in it (see
     *  RotatingSport). `title` above stays the plain string: it is what the h1's
     *  aria-label, seoConfig and the Course schema use. The first word must stay
     *  "Endurance", since that is what the prerendered page shows. */
    titleParts: {
        before: 'Become an Irreplaceable',
        words: ['Endurance', 'Running', 'Cycling', 'Triathlon'],
        coach: 'Coach',
        after: 'in 5 Days',
    },
    /** Shown as two lines: the sentence, then the aside in bold italic on its
     *  own line. `subtitle` joins them back up for the Course schema. */
    subtitleLead:
        'A free 5-day email course on the 5 most common mistakes among endurance coaches that cap how many athletes they can coach well',
    subtitleAside: '(and how to fix each one, even using AI)',
    get subtitle() {
        return `${this.subtitleLead} ${this.subtitleAside}.`
    },
    get: {
        title: "What You'll Get:",
        items: [
            'How to stop losing athlete details across WhatsApp, your training platform, and your own memory',
            'The 3-step system to review your whole roster in minutes, not hours — so you catch what matters instead of working through the list in order',
            'Why "contact" isn’t "communication" — and the 3 things that actually build athlete trust',
            'How to know if you’re ready to hire, before a broken process just gets more expensive',
            'How to show athletes their progress, so they never have to wonder "why do I even pay for a coach?"',
        ],
    },
    /**
     * The first sentence of the /merci team line, followed by Marco Altini's quote
     * (MerciQuote). That quote is a trimmed version of his words and still
     * needs his approval, the same as on /merci.
     */
    team: {
        title: 'Written by the augo team',
        body: 'We build augo, the coaching platform Marco Altini moved his athletes to.',
        after: 'And now, you can learn how to avoid these 5 mistakes for free.',
    },
    peek: {
        title: "A sneak peek of what's inside…",
        intro: 'Avoid the 5 mistakes that keep endurance coaches capped, overworked, and cause them to be replaced:',
        days: [
            {
                label: 'Day #1.',
                text: 'Treating every piece of athlete information as a separate task, so you end every week thinking "wait, what was that thing they mentioned?"',
            },
            {
                label: 'Day #2.',
                text: 'Letting scale turn individualized coaching into templated coaching (the fastest way to lose the value that justifies your price over an $18 app)',
            },
            {
                label: 'Day #3.',
                text: 'Mistaking contact for communication. Your athletes will feel like a name on a list, even when you’re “checking in” every week',
            },
            {
                label: 'Day #4.',
                text: 'Hiring an assistant coach to manually re-check the same scattered mess. A broken process erodes your margins even with a talented team',
            },
            {
                label: 'Day #5.',
                text: 'Training athletes without showing them the progress, and leaving them with nothing to say when a friend asks "why do you have a coach?"',
            },
        ],
    },
    fit: {
        title: 'Is this for me?',
        items: [
            'You coach enough athletes that you can’t hold every detail in your head anymore',
            'You’re piecing together WhatsApp, email, phone calls, and a training platform just to stay on top of one athlete',
            'You’ve thought about hiring an assistant coach just to keep up',
            'You want to grow your roster without your coaching starting to feel templated',
            'You want to deliver the highest possible quality of coaching (at scale)',
        ],
        outro: {
            before: '...then you should take a look at ',
            name: 'The Irreplaceable Endurance Coach’s System',
            after: '.',
        },
    },
    form: {
        submitLabel: 'Send me Day 1',
        sending: 'Sending',
        successTitle: 'You’re in.',
        successBody: 'Check your inbox. Day 1 is on its way.',
    },
} as const
