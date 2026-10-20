/**
 * augo Racing Team 2027 — configuration and copy.
 *
 * The sponsorship program page at /en/racing-team: five coach-and-athlete
 * duos, one season (March to October 2027), applications open until
 * 15 December 2026. Built in the shape of /humanedge (dark, editorial,
 * spec-sheet lists) with one difference: Apply opens a Typeform in a new tab
 * rather than an email modal, since an application needs results, socials
 * and the coach's name, not an address.
 *
 * English-only, like the coach course page, so every string lives here
 * instead of the locale files. Everything a copy edit could touch is in COPY.
 */

/** Path under /:lang. Kept in sync with src/App.tsx and scripts/routes.ts. */
export const RACING_TEAM_PATH = '/racing-team'

export const RACING_TEAM_URL = `https://www.augotraining.com/en${RACING_TEAM_PATH}/`

/**
 * The application form. The `source` hidden field tells the form where the
 * applicant came from. On the form.typeform.com host rather than the branded
 * augo.typeform.com one: the branded host shows a "this typeform has moved"
 * interstitial first, and its redirect can drop the query string.
 */
export const RACING_TEAM_APPLY_URL = 'https://form.typeform.com/to/fAP0wscv?source=racing-team'

/** Shared by both Apply buttons, so Mixpanel sees one CTA with two placements. */
export const RACING_TEAM_CTA_TEXT = 'Apply now'

export type RacingTeamCtaLocation = 'racing_team_hero' | 'racing_team_who_can_apply' | 'racing_team_final_cta'

export const DEADLINE_LABEL = 'December 15, 2026'

/** The Elite add-on block on the pricing page, linked from the "Elite" row. */
export const PRICING_ELITE_PATH = '/en/pricing#add-ons'

/** augo's podcast, linked from the "Podcast" row of what the duo gets. */
export const PODCAST_URL = 'https://open.spotify.com/show/4JR5cvFpYmuvaQxbx2D9nb?si=d1c0745b225d45ef'

export interface SpecItem {
    label: string
    statement: string
    /**
     * Turns `text`, a phrase that appears in `statement`, into a link. A path
     * (starting with "/") navigates in-app; anything else opens in a new tab.
     */
    link?: { text: string; href: string }
}

export const COPY = {
    hero: {
        eyebrow: 'augo Racing Team 2027',
        // Two block lines so the headline breaks where it reads best.
        title: ['5 high-performing', 'coach & athlete duos'],
        body: 'augo is going to sponsor five coach and athlete duos for the 2027 season.',
        cta: RACING_TEAM_CTA_TEXT,
        deadline: `Applications open until ${DEADLINE_LABEL}`,
    },

    what: {
        title: 'What it is',
        lead: 'A high-performing team of athletes and coaches.',
        body: [
            'The duo is the unit: we sponsor the coach and the athlete together, for one season.',
            'We recruit a new team every year, and every member stays in the augo Racing Team community after their season ends.',
        ],
        callout: ['The duo is the unit.', 'We sponsor both.', 'A new team every year.'],
    },

    whoCanApply: {
        title: 'Who can apply',
        lead: [
            'Athletes who race at a high level, and the coaches who coach them.',
            'Both halves of the duo have to qualify.',
        ],
        athlete: {
            label: 'The athlete',
            summary: 'One result from the list in the last 12 months, an audience to share the season with, and at least two races in 2027.',
            resultsLabel: 'Last 12 months · one of',
            results: [
                {
                    label: 'Triathlon',
                    statement:
                        'Top 3 in age group or top 5 overall at an Ironman, Ironman 70.3, T100, Challenge Family or World Triathlon event in the last 12 months',
                },
                {
                    label: 'Trail',
                    statement:
                        'Top 3 in age group or top 5 overall at a UTMB World Series event in the last 12 months, or a UTMB Index in the top 5% for your gender',
                },
                {
                    label: 'ITRA',
                    statement: 'ITRA Performance Index at elite level: 825+ (men) or 700+ (women)',
                },
                {
                    label: 'Marathon',
                    statement: 'Under 3:05 (women) or under 2:55 (men)',
                },
                {
                    label: 'Half marathon',
                    statement: 'Under 1:30 (women) or under 1:22 (men)',
                },
                {
                    label: 'Professional',
                    statement: 'Professional athlete in any endurance sport',
                },
            ] as SpecItem[],
            alsoRequiredLabel: 'Also required',
            alsoRequired: [
                {
                    label: 'Reach',
                    statement: 'At least 1,000 followers on social media',
                },
                {
                    label: 'Races',
                    statement: 'At least two races in 2027',
                },
            ] as SpecItem[],
        },
        coach: {
            label: 'The coach',
            summary: 'Coach at least one athlete at this level, on augo, for the whole year.',
            requirementsLabel: 'Requirements · all of',
            requirements: [
                {
                    label: 'Athlete',
                    statement: 'You coach at least one athlete who meets the criteria above',
                },
                {
                    label: 'augo',
                    statement: 'You coach them on augo for the full 2027 season',
                },
                {
                    label: 'Social',
                    statement: 'An active profile on social media, Instagram for example',
                },
            ] as SpecItem[],
        },
        howLabel: 'How to apply',
        how: [
            'A coach or an athlete can apply, and names the other half of the duo.',
            'Either way, the duo is what we select.',
        ],
        cta: RACING_TEAM_CTA_TEXT,
    },

    whatYouGet: {
        title: 'What the duo gets',
        lead: 'A season of support for both halves of the duo, and a community that outlasts it.',
        groups: [
            {
                label: 'Both coach and athlete',
                items: [
                    { label: 'Featured', statement: "Featured on augo's channels as part of the augo Racing Team" },
                    { label: 'Filming', statement: 'A filming day in Zurich, content and editing covered by augo, with the rights to reuse the images and videos' },
                    {
                        label: 'Podcast',
                        statement: 'A feature on the Human Endurance Podcast',
                        link: { text: 'Human Endurance Podcast', href: PODCAST_URL },
                    },
                    { label: 'Community', statement: 'A place in the augo Racing Team community for life: coaches meet coaches, athletes meet athletes, all at the same level' },
                    { label: 'Access', statement: 'Early access to new augo features and a direct line to the founders' },
                ] as SpecItem[],
            },
            {
                label: 'The coach only',
                items: [
                    {
                        label: 'Elite',
                        statement: 'augo Elite tier free for 2027: account executive, exclusive support, AI and augo training',
                        link: { text: 'augo Elite tier', href: PRICING_ELITE_PATH },
                    },
                    { label: 'Seat', statement: 'A free augo seat for your sponsored athlete' },
                    { label: 'Events', statement: 'Invites to augo coach events in 2027' },
                ] as SpecItem[],
            },
            {
                label: 'The athlete only',
                lead: 'Discounts or better prices on everything below.',
                note: 'Exact partners and details to be confirmed.',
                items: [
                    { label: 'Kit', statement: 'Fully personalised team race kit' },
                    { label: 'Nutrition', statement: 'Training and race nutrition' },
                    { label: 'Bike fit', statement: 'Bike fit' },
                    { label: 'Shoes', statement: 'Running shoes' },
                    { label: 'Lab', statement: 'Lab testing' },
                ] as SpecItem[],
            },
        ],
    },

    whatWeAsk: {
        title: 'What we ask',
        lead: 'Train on augo, race in the kit, and tell the story as you go.',
        listLabel: 'The commitments',
        items: [
            { label: 'Coaching', statement: 'The athlete is coached on augo all year: workouts planned in augo, session feedback on, chat in augo' },
            { label: 'Announcement', statement: 'When the duo joins, a collab post on Instagram with the coach, the athlete and @augo.training to announce it' },
            { label: 'Bio', statement: '"augo racing team 2027" and @augo.training in the athlete\'s and the coach\'s bio' },
            { label: 'Races', statement: 'The athlete posts about every race as a collab with @augo.training, wearing the team kit' },
            { label: 'Content', statement: 'The coach writes at least one blog post for augo during the year, and does a collab post on Instagram' },
            { label: 'Testimonial', statement: 'A testimonial for the website' },
            { label: 'Feedback', statement: 'A 30-minute feedback call each quarter' },
        ] as SpecItem[],
        note: 'If a duo stops using augo or stops posting, the sponsorship ends early.',
    },

    timeline: {
        title: 'How the year runs',
        lead: 'From application to alumni, in five steps.',
        listLabel: 'The season',
        items: [
            { when: 'Now → Dec 15, 2026', title: 'Applications open', detail: 'A coach or an athlete applies and names the other half of the duo.' },
            { when: 'Jan 2027', title: 'Selection', detail: 'Five duos selected, a one-page agreement, onboarding.' },
            { when: 'Mar 2027', title: 'Season starts', detail: 'Elite switched on, kit and nutrition sent.' },
            { when: 'Every quarter', title: 'Check-in', detail: 'A feedback call and a check on usage and posts.' },
            { when: 'Oct 2027', title: 'Season ends', detail: 'Members join the alumni community. Duos cannot reapply for 2028.' },
        ],
    },

    finalCta: {
        statusLabel: 'augo Racing Team 2027',
        statusValue: 'Status · Open',
        deadlineLabel: 'Applications close',
        deadlineValue: 'Dec 15, 2026',
        note: [
            'Five duos. One season.',
            'The coach and the athlete, sponsored together.',
            'And a community you keep after the year ends.',
        ],
        title: ['Applications', 'are open.'],
        subtitle1: 'Five coach and athlete duos will be selected in January 2027.',
        subtitle2: 'Apply with your athlete, or apply and name your coach.',
        cta: RACING_TEAM_CTA_TEXT,
    },

    faq: {
        title: 'FAQ',
        items: [
            {
                question: 'Can an athlete apply without a coach?',
                answer: 'No. Athletes need a human coach to qualify. An athlete can apply and nominate their coach, or the coach can apply and nominate the athlete. Either way, the duo is what we select.',
            },
            {
                question: 'Does the coach need a social media presence?',
                answer: 'Yes. The coach needs an active profile on social media, Instagram for example. During the year the coach writes at least one blog post for augo and does a collab post on Instagram with @augo.training.',
            },
            {
                question: 'What does "coached on augo" mean?',
                answer: 'The athlete is coached on augo all year: workouts planned in augo, session feedback switched on, and chat in augo.',
            },
            {
                question: 'What happens after October 2027?',
                answer: 'The season ends and every member joins the augo Racing Team alumni community for good: coaches meet coaches, athletes meet athletes, all at the same level.',
            },
            {
                question: 'Can a duo reapply for 2028?',
                answer: 'No. We recruit a new team every year, so 2027 duos cannot reapply for 2028. They stay in the community.',
            },
            {
                question: 'What ends the sponsorship early?',
                answer: 'If a duo stops using augo or stops posting, the sponsorship ends early.',
            },
        ],
    },
} as const
