import { useParams } from 'react-router-dom'
import augoLogo from '../../assets/images/augo_footer_1.svg'
import { trackCtaClicked } from '../../utils/analytics'

interface NiceAthletesHeaderProps {
    /** True once the visitor has given us their email. */
    unlocked: boolean
}

/**
 * The page's entire chrome: the augo logo, and nothing else.
 *
 * While locked the logo is a plain image — the page offers no route to the rest
 * of the site. Once the email is captured it becomes the ordinary home link,
 * matching the raw <a> the Navbar uses (a full page load, not a router push).
 *
 * Padding comes from the page, which owns the single-screen layout.
 */
export default function NiceAthletesHeader({ unlocked }: NiceAthletesHeaderProps) {
    const { lang } = useParams<{ lang: string }>()
    const home = `/${lang ?? 'en'}`
    const logo = <img src={augoLogo} alt="augo" className="h-6 sm:h-7" />

    return (
        <header className="relative z-10 w-full max-w-[900px] mx-auto flex">
            {unlocked ? (
                <a
                    href={home}
                    className="flex-shrink-0"
                    onClick={() => trackCtaClicked({ cta_text: 'logo', cta_location: 'nice_header', destination: home })}
                >
                    {logo}
                </a>
            ) : (
                <span className="flex-shrink-0">{logo}</span>
            )}
        </header>
    )
}
