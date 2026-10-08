import { useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import SessionZeroHero from '../components/sessionZero/SessionZeroHero'
import SessionZeroIdea from '../components/sessionZero/SessionZeroIdea'
import SessionZeroLeaveWith from '../components/sessionZero/SessionZeroLeaveWith'
import SessionZeroAgenda from '../components/sessionZero/SessionZeroAgenda'
import SessionZeroAuthors from '../components/sessionZero/SessionZeroAuthors'
import SessionZeroClosing from '../components/sessionZero/SessionZeroClosing'
import {
    COPY,
    SESSION_ZERO_CANONICAL,
    SESSION_ZERO_OG_IMAGE,
    SESSION_ZERO_OG_IMAGE_ALT,
    SESSION_ZERO_PATH,
    SESSION_ZERO_ROBOTS,
    SESSION_ZERO_ROBOTS_AI,
} from '../components/sessionZero/constants'
import { trackPageViewed } from '../utils/analytics'

/**
 * scripts/prerender.ts sets this before the page loads, so it is already true
 * at the first render. Under it the page emits its head and an empty body: the
 * snapshot that ends up in dist/ carries the title, the robots tags and the
 * share card, and none of the invitation (see components/sessionZero/constants.ts).
 */
const IS_PRERENDER = typeof window !== 'undefined' && window.__PRERENDER__ === true

/**
 * The invitation to Future of Coaching: Session Zero. A reading page, no form
 * and no button; the coach replies to the message that brought them here.
 *
 * Lives outside /:lang because it is English only and shared one to one. That
 * also means LanguageLayout's page_viewed never fires here, so the page sends
 * its own, the way /merci does.
 */
export default function SessionZero() {
    const pageTracked = useRef(false)

    useEffect(() => {
        if (pageTracked.current) return
        pageTracked.current = true
        void trackPageViewed({ page: SESSION_ZERO_PATH, referrer: document.referrer, language: 'en' })
    }, [])

    return (
        <div className="min-h-screen bg-dark text-white">
            <Helmet>
                <html lang="en" />
                <title>{COPY.pageTitle}</title>
                <meta name="description" content={COPY.pageDescription} />
                <meta name="robots" content={SESSION_ZERO_ROBOTS} />
                <meta name="robots" content={SESSION_ZERO_ROBOTS_AI} />
                {/* scripts/prerender.ts snapshots once a canonical link appears.
                    On a noindex page it is otherwise inert. */}
                <link rel="canonical" href={SESSION_ZERO_CANONICAL} />
                <meta name="theme-color" content="#0A0A0A" />

                {/* Hand-rolled rather than seo/SEOHead, which derives html lang,
                    og:locale, canonical and hreflang from the language tree. This
                    page sits outside /:lang on purpose. The description says no
                    more than the share card does. */}
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="augo" />
                <meta property="og:title" content={COPY.ogTitle} />
                <meta property="og:description" content={COPY.pageDescription} />
                <meta property="og:url" content={SESSION_ZERO_CANONICAL} />
                <meta property="og:image" content={SESSION_ZERO_OG_IMAGE} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:alt" content={SESSION_ZERO_OG_IMAGE_ALT} />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={COPY.ogTitle} />
                <meta name="twitter:description" content={COPY.pageDescription} />
                <meta name="twitter:image" content={SESSION_ZERO_OG_IMAGE} />
                <meta name="twitter:image:alt" content={SESSION_ZERO_OG_IMAGE_ALT} />
            </Helmet>

            {!IS_PRERENDER && (
                <main>
                    <SessionZeroHero />
                    <SessionZeroIdea />
                    <SessionZeroAuthors />
                    <SessionZeroAgenda />
                    <SessionZeroLeaveWith />
                    <SessionZeroClosing />
                </main>
            )}
        </div>
    )
}
