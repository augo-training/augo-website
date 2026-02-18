import { useEffect, useRef } from 'react'
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
            { label: 'Find a match', href: '#match' },
            { label: 'Community', href: '#community' },
        ],
    },
]

const socialLinks = [
    { icon: youtubeIcon, alt: 'YouTube', href: '#' },
    { icon: instagramIcon, alt: 'Instagram', href: '#' },
    { icon: linkedinIcon, alt: 'LinkedIn', href: '#' },
    { icon: unknownIcon, alt: 'Strava', href: '#' },
]

export default function Footer() {
    const logoRef = useRef<HTMLDivElement>(null)
    const linksRef = useRef<HTMLDivElement>(null)
    const socialRef = useRef<HTMLDivElement>(null)

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
        <footer className="py-16 px-8 max-w-[1200px] mx-auto flex flex-col gap-12">
            {/* Top row: Logo + Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left: Logo + tagline */}
                <div ref={logoRef} className="flex flex-col gap-4">
                    <img src={augoFooter} alt="augo" className="h-12 w-fit" />
                    <p className="font-mono font-medium text-[16px] leading-[130%] text-[#969EA7]">
                        A new standard
                        <br />
                        for endurance coaching
                    </p>
                </div>

                {/* Right: Link columns */}
                <div ref={linksRef} className="grid grid-cols-3 gap-8">
                    {linkColumns.map((col) => (
                        <div key={col.title} className="flex flex-col gap-4">
                            <h4 className="font-mono font-bold text-[24px] leading-[130%] text-white">
                                {col.title}
                            </h4>
                            <ul className="flex flex-col gap-3">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="footer-link font-satoshi font-medium text-[18px] leading-[130%] text-[#969EA7] hover:text-white transition-colors duration-200"
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

            {/* Bottom row: Badges + Socials */}
            <div className="flex items-center justify-between">
                {/* Left: Badges */}
                <div className="flex items-center gap-6">
                    <img src={footerIcon1} alt="HSG Startup" className="h-12" />
                    <div className="flex items-center gap-2">
                        <img src={footerIcon2} alt="Switzerland" className="h-auto w-36" />
                    </div>
                </div>

                {/* Right: Social icons */}
                <div ref={socialRef} className="flex items-center gap-4">
                    {socialLinks.map((social) => (
                        <a
                            key={social.alt}
                            href={social.href}
                            className="social-icon-link"
                            aria-label={social.alt}
                        >
                            <img src={social.icon} alt={social.alt} className="h-8 w-8" />
                        </a>
                    ))}
                </div>
            </div>

            {/* Copyright */}
            <p className="font-satoshi font-medium text-[20px] leading-[130%] text-center text-[#323439]">
                © 2026 augo. All rights reserved.
            </p>
        </footer>
    )
}
