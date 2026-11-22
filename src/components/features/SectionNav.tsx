import { useTranslation } from 'react-i18next'
import { SECTION_IDS } from './constants'

/**
 * The page's section menu, pinned under the site Navbar from the feature
 * guide down. On phones it scrolls sideways inside itself.
 */
export default function SectionNav() {
    const { t } = useTranslation()

    const links = [
        { id: SECTION_IDS.index, label: t('features.nav.allFeatures'), icon: true },
        { id: SECTION_IDS.coaches, label: t('features.guide.coachHeading') },
        { id: SECTION_IDS.athletes, label: t('features.guide.athleteHeading') },
        { id: SECTION_IDS.devices, label: t('features.devices.eyebrow') },
        { id: SECTION_IDS.integrations, label: t('features.integrations.eyebrow') },
        { id: SECTION_IDS.migration, label: t('features.migration.label') },
        { id: SECTION_IDS.faqs, label: t('features.nav.faq') },
    ]

    return (
        <nav
            aria-label={t('features.nav.label')}
            className="features-nav sticky z-40 bg-[#090909]/95 backdrop-blur border-y border-white/[0.06]"
        >
            <ul className="max-w-[1200px] mx-auto flex items-center gap-1.5 sm:gap-2 overflow-x-auto px-5 sm:px-8 xl:px-0 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {links.map((link) => (
                    <li key={link.id} className="shrink-0">
                        <a
                            href={`#${link.id}`}
                            className={`flex items-center gap-2 h-9 px-3.5 rounded-full font-satoshi text-[14px] whitespace-nowrap transition-colors ${
                                link.icon
                                    ? 'bg-white text-[#0A0A0A] font-medium hover:bg-white/90'
                                    : 'border border-white/[0.12] text-white/75 hover:text-white hover:border-white/35'
                            }`}
                        >
                            {link.icon && (
                                <svg aria-hidden viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                                </svg>
                            )}
                            {link.label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
