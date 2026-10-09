/**
 * /session-zero: the invitation to "Future of Coaching: Session Zero", a
 * working day for no more than ten elite triathlon coaches in Zurich on
 * Friday 4 December 2026.
 *
 * Deliberately invisible. Nothing on the site links here, the route is not in
 * the sitemap, robots.txt and llms.txt stay silent about it, and the page
 * carries noindex. Beyond that, the page body renders only in the browser:
 * scripts/prerender.ts snapshots the route so the host answers with a 200 and
 * a clean share card, but under the __PRERENDER__ flag the page emits its head
 * tags and nothing else. The static HTML never contains the invitation text,
 * so a crawler that does not run JavaScript gets a title and a date and no
 * more. The only way in is the personal message a coach is sent.
 *
 * English only, so the copy lives here rather than in i18n, as /merci does.
 *
 * Copy rules: no em dashes, plain words, sentence case except the mono
 * eyebrows. And, as everywhere on the site, text is white or grey only. The
 * brand colours are for shapes, never for letters.
 */

export const SESSION_ZERO_PATH = '/session-zero'
export const SESSION_ZERO_CANONICAL = 'https://www.augotraining.com/session-zero/'

/**
 * The share card, lives at public/session-zero-og-v2.jpg and is regenerated with
 * `npm run og-image:session-zero` from scripts/og/session-zero-card.html. The
 * card says only what the head tags say: the name, the city and the date.
 *
 * Absolute, and on the same host as SESSION_ZERO_CANONICAL. Social crawlers do
 * not resolve relative URLs and several do not follow redirects for images.
 */
export const SESSION_ZERO_OG_IMAGE = 'https://www.augotraining.com/session-zero-og-v2.jpg'
export const SESSION_ZERO_OG_IMAGE_ALT =
    'Future of Coaching: Session Zero. Zurich, Friday 4 December 2026.'

/**
 * Two robots tags. The first is the standard set every search engine reads.
 * The second is the de facto opt-out some AI crawlers honour; harmless to the
 * rest. No Disallow in robots.txt: that would publish the path, and would stop
 * Googlebot from ever reading the noindex.
 */
export const SESSION_ZERO_ROBOTS = 'noindex, nofollow, noarchive, nosnippet, noimageindex'
export const SESSION_ZERO_ROBOTS_AI = 'noai, noimageai'

export const EVENT = {
    date: 'Friday 4 December 2026',
    city: 'Zurich',
    /** The venue is not settled yet. Swap the placeholder once it is. */
    location: 'TBD',
    hours: '09:00 to 17:30',
    seats: '10, by invitation',
} as const

export interface AgendaItem {
    /** Clock time, HH:MM. */
    time: string
    title: string
    /** One or two sentences under the title. Breaks carry none. */
    note?: string
    /** Shown on the right as "NN MIN" where the agenda names one. */
    minutes?: number
    /** Who carries the slot: everyone in the room, augo, or the coach. */
    owner?: 'Everyone' | 'augo' | 'You'
    /** Arrival, breaks, lunch and the wrap render quieter, as a mono label. */
    kind?: 'break'
}

/** The agenda, written for the coach reading it. 09:00 to 17:30. */
export const AGENDA: AgendaItem[] = [
    { time: '09:00', title: 'Arrival. Coffee.', kind: 'break' },
    {
        time: '09:20',
        title: 'Opening round',
        owner: 'Everyone',
        minutes: 25,
        note: 'Introductions. What makes a great coach. How much you already use AI, and for what. What you want it to bring to coaching, and what you are afraid of.',
    },
    {
        time: '09:45',
        title: 'Where coaching is going',
        owner: 'augo',
        minutes: 30,
        note: 'Our vision of the future: how coaching is changing, what changes, and what stays.',
    },
    {
        time: '10:15',
        title: 'A week in augo',
        owner: 'augo',
        minutes: 30,
        note: 'A coach walks through their week in augo: how they use the in-app assistant and augo with Claude to save time and gain depth.',
    },
    { time: '10:45', title: 'Break', kind: 'break' },
    {
        time: '11:00',
        title: 'Build 1: your personalised dashboard',
        owner: 'You',
        minutes: 75,
        note: 'Hands-on. Build your own dashboard with augo’s connector and Claude or ChatGPT. Whatever you have always wanted to see.',
    },
    { time: '12:15', title: 'Lunch', kind: 'break' },
    {
        time: '13:30',
        title: 'Build 2: your hard problem',
        owner: 'You',
        minutes: 90,
        note: 'Pick a challenge from your own coaching and build a repeatable workflow for it: race debrief, injury pattern review, fuelling check, season review. Pairs are fine. augo’s team supports. You build.',
    },
    { time: '15:00', title: 'Break', kind: 'break' },
    {
        time: '15:15',
        title: 'Show and tell',
        owner: 'You',
        minutes: 60,
        note: 'What you built, what surprised you, what you would change. The block you will remember.',
    },
    {
        time: '16:15',
        title: 'The line',
        owner: 'Everyone',
        minutes: 45,
        note: 'Roundtable. Where is the line between the human coach and AI? Where should it be used, and where not? Where sometimes, and where never? What principles do we put forward as the new standard for endurance coaching with AI?',
    },
    {
        time: '17:00',
        title: 'Closing round',
        owner: 'You',
        minutes: 30,
        note: 'One thing you will remember. One thing you will change.',
    },
    { time: '17:30', title: 'Wrap. Community run, optional.', kind: 'break' },
]

export const COPY = {
    pageTitle: 'Session Zero | augo',
    pageDescription: 'An invitation. Zurich, 4 December 2026.',
    ogTitle: 'Future of Coaching: Session Zero',

    hero: {
        mark: 'Private · by invitation',
        eyebrow: 'Future of Coaching · Session Zero',
        title: ['Ten coaches.', 'One day.'],
        lead: 'Setting the standard the next generation of coaches will follow.',
        labels: { date: 'Date', city: 'City', location: 'Location', hours: 'Hours', seats: 'Seats' },
    },

    idea: {
        title: 'The big idea',
        lead: 'Future of Coaching, Session Zero is a working day for no more than ten elite triathlon coaches. It is not a course and not a lecture.',
        body: [
            'You bring your own athletes and your own data. You leave with an AI-supported coaching routine you built yourself during the day, with augo’s team beside you.',
            'Together we draw the line between the human coach and AI, and write the first draft of AI principles for endurance coaching.',
        ],
        statement: [
            'You’re not invited to watch where coaching is going.',
            // Non-breaking space: "it." never sits alone on the last line.
            'You’re invited to build\u00A0it.',
        ],
    },

    leaveWith: {
        title: 'What you leave with',
        label: 'What you leave with',
        items: [
            {
                label: 'Skills',
                statement: 'Hands-on skills you keep. How to use AI to work faster, and how to use it to go deeper: more effective coaching in less time.',
            },
            {
                label: 'Inspiration',
                statement: 'New workflows from the room. Nine other high-level coaches showing what they built and how it changes their coaching.',
            },
            {
                label: 'A mark',
                statement: 'Your contribution to the principles of AI in coaching, as a founding author.',
            },
        ],
    },

    agenda: {
        title: 'The day',
        lead: '09:00 to 17:30.',
        label: 'Running order',
        ownerLabel: 'Owner',
    },

    authors: {
        title: 'Founding authors',
        lead: 'The principles drafted in the room will become the foundation of augo’s principles for AI in coaching, and you will be the founding authors.',
    },

    confirmed: {
        title: 'Already confirmed',
        label: 'Confirmed',
        /** Of the ten seats. The counter reads "04 / 10". */
        seats: 10,
        /** In the order the photos are listed in SessionZeroConfirmed.tsx. */
        coaches: [
            {
                name: 'Gordon Crawford',
                facts: [
                    'Performance Director at Triathlon Ireland. Before that, Swiss Triathlon’s national elite and U23 coach.',
                    '35 years of coaching, from steeplechase and rugby strength and conditioning to Olympic distance, 70.3, T100 and Ironman.',
                    'Four principles: engage, enable, educate, empower.',
                ],
            },
            {
                name: 'Reto Braendli',
                facts: [
                    'Swiss triathlon and cycling coach to professional athletes.',
                    'Athletes he coaches have placed top ten at Kona and the T100, and won Ironman titles back to back.',
                    'A performance-lab background: lactate, gas exchange and body composition testing inform his coaching.',
                ],
            },
            {
                name: 'David Tilbury-Davis',
                facts: [
                    'Over 30 years of coaching athletes at the very tip of world class performance of Triathlon, Cycling, Mountain Biking and UFC.',
                    'Has coached notably Ashleigh Gentle, Skye Moench, Lotte Wilms, Lionel Sanders, Bart Aernouts, Cody Beals and Matt Hanson.',
                    'Has an evidence-led style grounded in empowering and embedding the right behaviours for athletes to achieve the highest level of success they are capable of.',
                ],
            },
            {
                name: 'Nico Montavon',
                facts: [
                    'Founder and Head Coach of Ris3 Sport. Former Swiss Triathlon National Junior Coach and Head Coach of the National Training Centre.',
                    'Coach of Olympians, developing athletes from junior to elite level, from short course to Ironman distance.',
                    'Human-first coaching built on trust, authenticity and sense of responsibility: progression over comparison, where sustainable performance grows from a healthy, balanced athlete.',
                ],
            },
        ],
    },

    closing: {
        footer: 'augo · Zurich · Friday 4 December 2026',
    },
} as const
