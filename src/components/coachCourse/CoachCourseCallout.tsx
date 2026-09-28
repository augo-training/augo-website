import { Link } from 'react-router-dom'
import { trackCtaClicked } from '../../utils/analytics'
import { COACH_COURSE_PATH } from './constants'

const HREF = `/en${COACH_COURSE_PATH}`

/**
 * A one-line pointer to the free course, from related pages. It exists as much
 * for search engines as for readers: an internal link whose text says what the
 * course page is about. So the link text is descriptive, never "click here".
 * English only, like the course page.
 */
export default function CoachCourseCallout({ location }: { location: string }) {
    return (
        <aside className="mt-12 rounded-2xl border border-dark-600 bg-white/[0.025] p-5 sm:p-6">
            <p className="m-0 font-mono text-[12px] uppercase tracking-[0.08em] text-text-muted">For coaches</p>
            <p className="m-0 mt-2 font-satoshi text-[17px] leading-[1.5] text-white/85">
                Want to coach more athletes without it turning into templates? Take the{' '}
                <Link
                    to={HREF}
                    onClick={() => void trackCtaClicked({ cta_text: 'course_callout', cta_location: location, destination: HREF })}
                    className="font-bold text-white underline decoration-orange decoration-2 underline-offset-4"
                >
                    free 5-day email course: become an irreplaceable endurance coach
                </Link>
                .
            </p>
        </aside>
    )
}
