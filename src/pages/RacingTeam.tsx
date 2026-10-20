import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEOHead from '../seo/SEOHead'
import { OrganizationJsonLd, RacingTeamJsonLd } from '../seo/JsonLd'
import RacingTeamHero from '../components/racingTeam/RacingTeamHero'
import RacingTeamWhat from '../components/racingTeam/RacingTeamWhat'
import RacingTeamWhoCanApply from '../components/racingTeam/RacingTeamWhoCanApply'
import RacingTeamWhatYouGet from '../components/racingTeam/RacingTeamWhatYouGet'
import RacingTeamWhatWeAsk from '../components/racingTeam/RacingTeamWhatWeAsk'
import RacingTeamTimeline from '../components/racingTeam/RacingTeamTimeline'
import RacingTeamFinalCta from '../components/racingTeam/RacingTeamFinalCta'
import RacingTeamFaq from '../components/racingTeam/RacingTeamFaq'
import { RACING_TEAM_PATH } from '../components/racingTeam/constants'

/**
 * augo Racing Team 2027: the sponsorship program page.
 *
 * The same shape as /humanedge (dark editorial sections, spec-sheet lists, one
 * gradient button), with the copy in components/racingTeam/constants.ts rather
 * than the locale files because the page is English-only. Apply links out to a
 * Typeform in a new tab, so there is no modal and no MailerLite group here.
 *
 * English-only, so SEOHead runs with noAlternates and scripts/routes.ts lists
 * just the /en URL. Page views come from LanguageLayout.
 */
export default function RacingTeam() {
    return (
        <>
            <SEOHead page="racingTeam" path={RACING_TEAM_PATH} ogImagePath="/racing-team-og.jpg" noAlternates />
            <OrganizationJsonLd />
            <RacingTeamJsonLd />
            <Navbar />
            <article>
                <RacingTeamHero />
                <RacingTeamWhat />
                <RacingTeamWhoCanApply />
                <RacingTeamWhatYouGet />
                <RacingTeamWhatWeAsk />
                <RacingTeamTimeline />
                <RacingTeamFinalCta />
                <RacingTeamFaq />
            </article>
            <Footer />
        </>
    )
}
