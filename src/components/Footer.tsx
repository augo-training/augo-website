import { useEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import augoFooter from '../assets/images/augo_footer_1.svg'
import footerIcon1 from '../assets/images/footer_icon_1.png'
import footerIcon2 from '../assets/images/footer_icon_2.svg'
import youtubeIcon from '../assets/images/youtube_footer.svg'
import instagramIcon from '../assets/images/instagram_footer.svg'
import linkedinIcon from '../assets/images/linkedin_footer.svg'
import unknownIcon from '../assets/images/unknown_footer.svg'

const linkColumns = [
    {
        title: 'Product',
        links: [
            { label: 'For coaches', href: '#coaches' },
            { label: 'For athletes', href: '#athletes' },
            { label: 'How it works', href: '#how-it-works' },
        ],
    },
    {
        title: 'augo',
        links: [
            { label: 'About', href: '#about' },
            { label: 'FAQ', href: '#faq' },
        ],
    },
    {
        title: 'Explore',
        links: [
            { label: 'Find a match', href: '/find' },
            { label: 'Community', href: '#community' },
        ],
    },
]

const socialLinks = [
    { icon: youtubeIcon, alt: 'YouTube', href: '#' },
    { icon: instagramIcon, alt: 'Instagram', href: 'https://www.instagram.com/augo.training/' },
    { icon: linkedinIcon, alt: 'LinkedIn', href: 'https://www.linkedin.com/company/augotraining' },
    { icon: unknownIcon, alt: 'Substack', href: 'https://substack.com/@augotraining' },
]

export default function Footer() {
    const location = useLocation()
    const navigate = useNavigate()
    const logoRef = useRef<HTMLDivElement>(null)
    const linksRef = useRef<HTMLDivElement>(null)
    const socialRef = useRef<HTMLDivElement>(null)

    const handleHashClick = useCallback((e: React.MouseEvent, href: string) => {
        if (!href.startsWith('#')) return
        e.preventDefault()
        if (location.pathname === '/') {
            const el = document.querySelector(href)
            if (el) el.scrollIntoView({ behavior: 'smooth' })
        } else {
            navigate('/' + href)
        }
    }, [location.pathname, navigate])

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches
        if (prefersReducedMotion) return

        const groups = [
            { el: logoRef.current, delay: 0 },
            { el: linksRef.current, delay: 0.15 },
            { el: socialRef.current, delay: 0.3 },
        ]

        // Set initial state via GSAP (same as CoachesSection pattern)
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
                            gsap.to(el, {
                                opacity: 1,
                                y: 0,
                                duration: 0.4,
                                delay,
                                ease: 'power2.out',
                            })
                            observer.disconnect()
                        }
                    })
                },
                { threshold: 0.2 }
            )

            observer.observe(el)
            observers.push(observer)
        })

        return () => {
            observers.forEach((obs) => obs.disconnect())
        }
    }, [])

    return (
        <footer className="py-12 sm:py-16 px-5 sm:px-8 max-w-[1200px] mx-auto flex flex-col gap-10 sm:gap-12 lg:gap-16">
            {/* Top row: Logo + Links */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
                {/* Left: Logo + tagline */}
                <div ref={logoRef} className="flex flex-col gap-4">
                    <img src={augoFooter} alt="augo" className="h-10 sm:h-12 w-fit" />
                    <p className="font-mono font-medium text-[14px] sm:text-[16px] leading-[130%] text-[#969EA7]">
                        A new standard
                        <br />
                        for endurance coaching
                    </p>
                </div>

                {/* Right: Link columns */}
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
                {/* Right (Desktop) / Top (Mobile): Social icons */}
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

                {/* Left (Desktop) / Bottom (Mobile): Badges */}
                <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-8 w-full lg:w-auto order-2 lg:order-1">
                    <img src={footerIcon1} alt="HSG Startup" className="h-10 sm:h-12 w-auto" />
                    <div className="flex items-center gap-2">
                        <img src={footerIcon2} alt="Switzerland" className="h-auto w-32 sm:w-36" />
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <p className="font-satoshi font-medium text-[12px] sm:text-[14px] lg:text-[20px] leading-[130%] text-center text-[#323439] mt-4 lg:mt-0">
                © 2026 augo. All rights reserved.
            </p>
        </footer>
    )
}
