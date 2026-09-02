import SEOHead from '../seo/SEOHead'
import NiceAthletesHeader from '../components/niceAthletes/NiceAthletesHeader'
import NiceAthletesHero from '../components/niceAthletes/NiceAthletesHero'
import NiceAthletesEmailForm from '../components/niceAthletes/NiceAthletesEmailForm'
import { COPY, NICE_ATHLETES_PATH } from '../components/niceAthletes/constants'
import { useNiceAthletesUnlock } from '../hooks/useNiceAthletesUnlock'
import { useCookieBannerHeight } from '../hooks/useCookieBannerHeight'
import niceBay from '../assets/images/nice-bay.webp'

/**
 * Ironman Nice paid-ad landing page, and a deliberate dead end.
 *
 * No Navbar, no Footer, no outbound links: someone who lands here from an ad
 * has exactly one thing to do — leave a first name and an email, and get the
 * five things back by email. The logo in NiceAthletesHeader stays inert until
 * that happens, at which point the page becomes an ordinary door into the site.
 * Nothing on the site links here; traffic comes from the ad, and from search
 * once it is indexed.
 *
 * Everything sits on one screen, hook through button, so nobody has to scroll
 * to find the ask. Hence min-h-[100dvh] (dvh, not vh — vh sits under mobile
 * browser chrome) with the content centred in whatever space is left over, and
 * min-h rather than h so a very short viewport degrades to a scroll instead of
 * clipping the button.
 *
 * The background photo is bright end to end — pale sky, sunlit sea, orange
 * rooftops — so it carries a heavier dim than the video in DirectoryHero, plus
 * a gradient weighted left where all the text and the form actually sit.
 *
 * Note the photo and its scrims are NOT inside a texture-grain element: that
 * class sets `.texture-grain > * { position: relative }`, which beats Tailwind's
 * `absolute` and drops background layers into the flow. The photo supplies its
 * own texture, so the grain is not needed here anyway.
 *
 * English-only, so SEOHead runs with noAlternates and scripts/routes.ts lists
 * just the /en URL.
 */
export default function NiceAthletes() {
    const { unlocked, unlock } = useNiceAthletesUnlock()
    const cookieBannerHeight = useCookieBannerHeight()

    return (
        <>
            <SEOHead page="niceAthletes" path={NICE_ATHLETES_PATH} noAlternates />
            <div
                className="relative min-h-[100dvh] overflow-hidden flex flex-col bg-dark px-5 sm:px-8 py-6 sm:py-8"
                style={{ paddingBottom: cookieBannerHeight ? cookieBannerHeight + 20 : undefined }}
            >
                <img
                    src={niceBay}
                    alt=""
                    aria-hidden="true"
                    loading="eager"
                    className="absolute inset-0 z-0 w-full h-full object-cover object-[38%_center] sm:object-center"
                />
                <div
                    aria-hidden="true"
                    className="absolute inset-0 z-0"
                    style={{ backgroundColor: 'rgba(10,10,10,0.48)' }}
                />
                <div
                    aria-hidden="true"
                    className="absolute inset-0 z-0"
                    style={{
                        background:
                            'linear-gradient(to right, rgba(10,10,10,0.82) 0%, rgba(10,10,10,0.5) 55%, rgba(10,10,10,0.12) 100%), linear-gradient(to top, rgba(10,10,10,0.8) 0%, rgba(10,10,10,0) 38%)',
                    }}
                />

                <NiceAthletesHeader unlocked={unlocked} />
                <main className="relative z-10 flex-1 w-full max-w-[900px] mx-auto flex flex-col justify-center gap-7 sm:gap-10 py-0 sm:py-6">
                    <NiceAthletesHero />
                    <NiceAthletesEmailForm onCaptured={unlock} unlocked={unlocked} />
                </main>
                <p className="relative z-10 w-full max-w-[900px] mx-auto pt-2 sm:pt-3 font-mono text-[10px] sm:text-[11px] tracking-[2px] uppercase text-white/40">
                    {COPY.photoCredit}
                </p>
            </div>
        </>
    )
}
