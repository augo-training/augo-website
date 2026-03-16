import { useEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import augoFooter from '../assets/images/augo_footer_1.svg'
import footerIcon1 from '../assets/images/footer_icon_1.png'
import footerIcon2 from '../assets/images/footer_icon_2.svg'
import instagramIcon from '../assets/images/instagram_footer.svg'
import linkedinIcon from '../assets/images/linkedin_footer.svg'
import unknownIcon from '../assets/images/unknown_footer.svg'

const socialLinks = [
    { icon: instagramIcon, alt: 'Instagram', href: 'https://www.instagram.com/augo.training/' },
    { icon: linkedinIcon, alt: 'LinkedIn', href: 'https://www.linkedin.com/company/augotraining' },
    { icon: unknownIcon, alt: 'Substack', href: 'https://substack.com/@augotraining' },
]

export default function Footer() {
    const { t, i18n } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()
    const { lang } = useParams<{ lang: string }>()
    const currentLang = lang || i18n.language || 'en'

    const linkColumns = [
        {
            title: t('footer.columns.product'),
            links: [
                { label: t('footer.links.forCoaches'), href: '#coaches' },
                { label: t('footer.links.forAthletes'), href: '#athletes' },
                { label: t('footer.links.howItWorks'), href: '#how-it-works' },
            ],
        },
        {
            title: t('footer.columns.augo'),
            links: [
                { label: t('footer.links.about'), href: '#about' },
                { label: t('footer.links.faq'), href: '#faq' },
            ],
        },
        {
            title: t('footer.columns.explore'),
            links: [
                { label: t('footer.links.findAMatch'), href: `/${currentLang}/find` },
            ],
        },
    ]

    const logoRef = useRef<HTMLDivElement>(null)
    const linksRef = useRef<HTMLDivElement>(null)
    const socialRef = useRef<HTMLDivElement>(null)

    const handleHashClick = useCallback((e: React.MouseEvent, href: string) => {
        if (!href.startsWith('#')) return
        e.preventDefault()
        const homePath = `/${currentLang}`
        if (location.pathname === homePath || location.pathname === `${homePath}/`) {
            const el = document.querySelector(href)
            if (el) el.scrollIntoView({ behavior: 'smooth' })
        } else {
            navigate(`${homePath}${href}`)
        }
    }, [location.pathname, navigate, currentLang])

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (prefersReducedMotion) return

        const groups = [
            { el: logoRef.current, delay: 0 },
            { el: linksRef.current, delay: 0.15 },
            { el: socialRef.current, delay: 0.3 },
        ]

        groups.forEach(({ el }) => {
            if (el) gsap.set(el, { opacity: 0, y: 16 })
        })

        const observers: IntersectionObserver[] = []

        groups.forEach(({ el, delay }) => {
            if (!el) return
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            gsap.to(el, { opacity: 1, y: 0, duration: 0.4, delay, ease: 'power2.out' })
                            observer.disconnect()
                        }
                    })
                },
                { threshold: 0.2 }
            )
            observer.observe(el)
            observers.push(observer)
        })

        return () => { observers.forEach((obs) => obs.disconnect()) }
    }, [])

    return (
        <footer className="py-12 sm:py-16 px-5 sm:px-8 max-w-[1200px] mx-auto flex flex-col gap-10 sm:gap-12 lg:gap-16">
            {/* Top row: Logo + Links */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
                <div ref={logoRef} className="flex flex-col gap-4">
                    <img src={augoFooter} alt="augo" className="h-10 sm:h-12 w-fit" />
                    <p className="font-mono font-medium text-[14px] sm:text-[16px] leading-[130%] text-[#969EA7]">
                        {t('footer.tagline1')}
                        <br />
                        {t('footer.tagline2')}
                    </p>
                </div>

                <div ref={linksRef} className="grid grid-cols-3 gap-2 sm:gap-8">
                    {linkColumns.map((col) => (
                        <div key={col.title} className="flex flex-col gap-3 sm:gap-4">
                            <h4 className="font-mono font-bold text-[16px] sm:text-[20px] lg:text-[24px] leading-[130%] text-white">
                                {col.title}
                            </h4>
                            <ul className="flex flex-col gap-2 sm:gap-3">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            onClick={(e) => handleHashClick(e, link.href)}
                                            className="footer-link font-satoshi font-medium text-[13px] sm:text-[16px] lg:text-[18px] leading-[130%] text-[#969EA7] hover:text-white transition-colors duration-200"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom row: Socials + Badges */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-0 mt-4 lg:mt-0">
                <div ref={socialRef} className="flex items-center gap-3 sm:gap-4 order-1 lg:order-2">
                    {socialLinks.map((social) => (
                        <a
                            key={social.alt}
                            href={social.href === '#' ? undefined : social.href}
                            target={social.href === '#' ? undefined : '_blank'}
                            rel={social.href === '#' ? undefined : 'noopener noreferrer'}
                            onClick={social.href === '#' ? (e: React.MouseEvent) => e.preventDefault() : undefined}
                            className="social-icon-link"
                            aria-label={social.alt}
                            style={social.href === '#' ? { cursor: 'default' } : undefined}
                        >
                            <img src={social.icon} alt={social.alt} className="h-10 w-10 sm:h-12 sm:w-12 lg:h-10 lg:w-10" />
                        </a>
                    ))}
                </div>

                <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-8 w-full lg:w-auto order-2 lg:order-1">
                    <img src={footerIcon1} alt="HSG Startup" className="h-10 sm:h-12 w-auto" />
                    <div className="flex items-center gap-2">
                        <img src={footerIcon2} alt="Switzerland" className="h-auto w-32 sm:w-36" />
                    </div>
                </div>
            </div>

            <p className="font-satoshi font-medium text-[12px] sm:text-[14px] lg:text-[20px] leading-[130%] text-center text-[#323439] mt-4 lg:mt-0">
                {t('footer.copyright')}
            </p>
        </footer>
    )
}
