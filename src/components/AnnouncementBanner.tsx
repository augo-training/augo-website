import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { trackCtaClicked } from '../utils/analytics'

/** Paid-traffic landing pages: one message, one screen, their own funnel. */
const EXCLUDED = ['/nice-athletes', '/nice-coaches']

/**
 * The permanent bar above the header.
 *
 * Height is fixed per breakpoint rather than measured. Three sections on the
 * home page pin with GSAP at `start: 'top top'`, and a bar whose height settles
 * after mount would move every pin start mid-session and need a
 * ScrollTrigger.refresh(). A known height on first paint avoids all of that —
 * which is also why the mobile copy is a shorter string rather than the desktop
 * line left to wrap.
 *
 * The `has-announcement` class on <html> is what switches on `--banner-h`, so
 * pages without the banner keep a zero offset and are untouched.
 */
export default function AnnouncementBanner() {
    const { t } = useTranslation()
    const { pathname } = useLocation()
    // Trailing slash matters: vercel.json sets trailingSlash: true, so the live
    // URL is /en/nice-athletes/ and a bare endsWith would miss it.
    const path = pathname.replace(/\/+$/, '')
    const hidden = EXCLUDED.some((p) => path.endsWith(p))
    // Mounted above the /:lang route, so there are no route params to read.
    const lang = /^\/(en|de|pt)(\/|$)/.exec(pathname)?.[1] ?? 'en'

    useLayoutEffect(() => {
        if (hidden) return
        const root = document.documentElement
        root.classList.add('has-announcement')
        return () => root.classList.remove('has-announcement')
    }, [hidden])

    if (hidden) return null

    const href = `/${lang}/download`

    return (
        <div className="announcement-banner fixed top-0 left-0 right-0 z-[70]">
            <a
                href={href}
                onClick={() =>
                    void trackCtaClicked({
                        cta_text: 'TrainingPeaks migration banner',
                        cta_location: 'announcement_banner',
                        destination: href,
                    })
                }
                className="flex items-center justify-center gap-2 h-[var(--banner-h)] px-4 text-center font-satoshi text-[13px] sm:text-[14px] leading-[130%] text-white/75 hover:text-white transition-colors duration-200"
            >
                <span className="sm:hidden">{t('announcement.mobile')}</span>
                <span className="hidden sm:inline">{t('announcement.desktop')}</span>
            </a>
        </div>
    )
}
