import type { ReactNode } from 'react'
import SEOHead from '../seo/SEOHead'
import { CoachCourseJsonLd, OrganizationJsonLd } from '../seo/JsonLd'
import CoachCourseHeader from '../components/coachCourse/CoachCourseHeader'
import CoachCourseOptInForm from '../components/coachCourse/CoachCourseOptInForm'
import RotatingSport from '../components/coachCourse/RotatingSport'
import MerciQuote from '../components/merci/MerciQuote'
import {
    COPY,
    COACH_COURSE_PATH,
    COACH_COURSE_UNLOCK_KEY,
    type CoachCoursePlacement,
} from '../components/coachCourse/constants'
import { useCaptureUnlock } from '../hooks/useCaptureUnlock'
import { useCookieBannerHeight } from '../hooks/useCookieBannerHeight'

/**
 * Opt-in page for "The Irreplaceable Endurance Coach", a free 5-day email course.
 *
 * Built like the Nice landing pages: no Navbar, no Footer, and a logo that stays
 * inert until the visitor has given us a first name and an email. Unlike them
 * it is a long page. It makes the case section by section (what you get, who
 * wrote it, a day-by-day peek, who it is for) and asks again after each one,
 * the shape of the /merci ticket. The unlock is shared: once any form is
 * accepted, every form turns into the same note.
 *
 * It is meant to be found through search as well as ads, so it is prerendered,
 * linked from the site footer, listed in the sitemap, and carries Course
 * structured data. All copy is plain HTML in heading order (one h1, an h2 per
 * section), so answer engines that do not run JS still read all of it.
 *
 * The brand gradient appears only on the hero card's hairline border and on the
 * buttons, never on text.
 *
 * English-only, so SEOHead runs with noAlternates and scripts/routes.ts lists
 * just the /en URL.
 */
export default function CoachCourse() {
    const { unlocked, unlock } = useCaptureUnlock(COACH_COURSE_UNLOCK_KEY)
    const cookieBannerHeight = useCookieBannerHeight()

    const optIn = (placement: CoachCoursePlacement) => (
        <div className="mt-6">
            <CoachCourseOptInForm placement={placement} onCaptured={unlock} unlocked={unlocked} />
        </div>
    )

    return (
        <>
            <SEOHead page="coachCourse" path={COACH_COURSE_PATH} ogImagePath="/coach-course-og.jpg" noAlternates />
            <OrganizationJsonLd />
            <CoachCourseJsonLd />
            <div
                className="min-h-[100dvh] bg-dark px-5 sm:px-8 pt-5 sm:pt-8 pb-16"
                style={{ paddingBottom: cookieBannerHeight ? cookieBannerHeight + 40 : undefined }}
            >
                <div className="mx-auto w-full max-w-[620px]">
                    <CoachCourseHeader unlocked={unlocked} />
                </div>

                <main className="mx-auto w-full max-w-[620px] pt-8 sm:pt-14">
                    <div className="course-card rounded-[24px] px-5 py-6 sm:px-8 sm:py-9">
                        <h1
                            aria-label={COPY.title}
                            className="m-0 font-sans text-[clamp(26px,8.5vw,32px)] sm:text-[44px] font-extrabold leading-[1.05] tracking-[-0.03em] text-white"
                        >
                            <span aria-hidden="true">
                                {/* Three set lines, with the sport and "Coach" held
                                    together on the middle one. Every word then
                                    takes the same number of lines, so the headline
                                    keeps one height as it rotates. The phone size
                                    shrinks on very narrow screens so "Endurance
                                    Coach", the longest, still fits one line. */}
                                <span className="block">{COPY.titleParts.before}</span>{' '}
                                <span className="block whitespace-nowrap">
                                    <RotatingSport /> {COPY.titleParts.coach}
                                </span>{' '}
                                <span className="block">{COPY.titleParts.after}</span>
                            </span>
                        </h1>
                        <p className="mt-3 font-satoshi text-[17px] sm:text-[19px] leading-[1.45] text-pretty text-white/85">
                            {COPY.subtitleLead}
                        </p>
                        <p className="mt-2 font-satoshi text-[17px] sm:text-[19px] font-bold italic leading-[1.45] text-white">
                            {COPY.subtitleAside}
                        </p>
                        {optIn('hero')}
                    </div>

                    <Section title={COPY.get.title}>
                        <ul className="m-0 mt-4 list-none space-y-3 p-0">
                            {COPY.get.items.map((item) => (
                                <li key={item} className={`${BODY} flex gap-3 text-white/85`}>
                                    <Tick />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        {optIn('get')}
                    </Section>

                    <Section title={COPY.team.title}>
                        <p className={`${BODY} mt-3 text-white/85`}>{COPY.team.body}</p>
                        <MerciQuote large />
                        <p className={`${BODY} mt-5 font-bold text-white`}>{COPY.team.after}</p>
                        {optIn('team')}
                    </Section>

                    <Section title={COPY.peek.title}>
                        <p className={`${BODY} mt-3 text-white/85`}>{COPY.peek.intro}</p>
                        <ol className="m-0 mt-4 list-none space-y-3 p-0">
                            {COPY.peek.days.map((day) => (
                                <li key={day.label} className={`${BODY} flex gap-3 text-white/85`}>
                                    <Tick />
                                    <span>
                                        <strong className="text-white">{day.label}</strong> {day.text}
                                    </span>
                                </li>
                            ))}
                        </ol>
                        {optIn('peek')}
                    </Section>

                    <Section title={COPY.fit.title}>
                        <ul className="m-0 mt-4 list-none space-y-2.5 p-0">
                            {COPY.fit.items.map((item) => (
                                <li key={item} className={`${BODY} flex gap-3 text-white/85`}>
                                    <Tick />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <p className={`${BODY} mt-5 text-white`}>
                            {COPY.fit.outro.before}
                            <strong>{COPY.fit.outro.name}</strong>
                            {COPY.fit.outro.after}
                        </p>
                        {optIn('fit')}
                    </Section>
                </main>
            </div>
        </>
    )
}

/**
 * Body text below the hero card. Larger than the /merci body it started from
 * (15-16px) so it reads easily for older coaches too: 18px on phones, 20px from
 * sm up.
 */
const BODY = 'font-satoshi text-[18px] sm:text-[20px] leading-[1.55]'

/** The one list marker on the page, so every list reads as the same list. */
function Tick() {
    return (
        <span aria-hidden="true" className="shrink-0 font-mono text-white">
            ✓
        </span>
    )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="mt-14 sm:mt-16">
            <h2 className="m-0 font-sans text-[28px] sm:text-[34px] font-extrabold leading-[1.15] tracking-[-0.03em] text-white">
                {title}
            </h2>
            {children}
        </section>
    )
}
