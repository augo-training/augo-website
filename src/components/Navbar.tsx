import { useEffect, useState, useRef, useCallback } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import { supportedLanguages } from '../i18n'
import type { SupportedLanguage } from '../i18n'
import augoLogo from '../assets/images/augo_footer_1.svg'

function NavLink({ label, href, onClick }: { label: string; href: string; onClick?: (e: React.MouseEvent) => void }) {
    return (
        <a
            href={href}
            onClick={onClick}
            className="group flex items-center gap-1 font-['JetBrains_Mono'] text-[14px] font-normal leading-[100%] tracking-[2px] uppercase text-white no-underline transition-all duration-200 ease-out hover:font-bold hover:italic"
        >
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out">
                ///
            </span>
            <span>{label}</span>
        </a>
    )
}

function LanguageSwitcher() {
    const { i18n } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()
    const currentLang = i18n.language as SupportedLanguage

    const switchLanguage = (newLang: SupportedLanguage) => {
        if (newLang === currentLang) return
        // Replace the language prefix in the current path
        const pathWithoutLang = location.pathname.replace(/^\/(en|de|pt)/, '')
        i18n.changeLanguage(newLang)
        navigate(`/${newLang}${pathWithoutLang || ''}`, { replace: true })
    }

    return (
        <div className="flex items-center gap-1">
            {supportedLanguages.map((lang, i) => (
                <span key={lang} className="flex items-center">
                    {i > 0 && <span className="text-white/30 mx-1 font-mono text-[12px]">/</span>}
                    <button
                        onClick={() => switchLanguage(lang)}
                        className={`font-mono text-[12px] tracking-[1px] uppercase cursor-pointer transition-colors duration-200 bg-transparent border-none ${
                            lang === currentLang
                                ? 'text-white font-bold'
                                : 'text-white/50 hover:text-white/80 font-normal'
                        }`}
                    >
                        {lang}
                    </button>
                </span>
            ))}
        </div>
    )
}

export default function Navbar() {
    const { t, i18n } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()
    const { lang } = useParams<{ lang: string }>()
    const currentLang = lang || i18n.language || 'en'

    const navLinks = [
        { label: t('nav.forCoaches'), href: '#coaches' },
        { label: t('nav.forAthletes'), href: '#athletes' },
    ]

    const mobileMenuLinks = [
        { label: t('nav.forCoaches'), href: '#coaches' },
        { label: t('nav.forAthletes'), href: '#athletes' },
        { label: t('nav.findAMatch'), href: `/${currentLang}/find` },
    ]

    const [showJoinButton, setShowJoinButton] = useState(() => !location.pathname.endsWith('/join'))
    const [menuOpen, setMenuOpen] = useState(false)
    const isAnimating = useRef(false)

    // Refs for GSAP animations
    const overlayRef = useRef<HTMLDivElement>(null)
    const menuItemRefs = useRef<(HTMLAnchorElement | null)[]>([])
    const menuJoinRef = useRef<HTMLAnchorElement>(null)

    // Intersection Observer: hide Join Augo when Hero CTA or FAQ CTA is on screen
    useEffect(() => {
        // Already on the Join page → hide the button (handled by initial state)
        if (location.pathname.endsWith('/join')) return

        const heroCta = document.querySelector('[data-cta="hero"]')
        const faqCta = document.querySelector('[data-cta="faq"]')

        const targets = [heroCta, faqCta].filter(Boolean) as Element[]
        if (targets.length === 0) {
            // No CTA targets on this page (e.g. /find) → always show the button
            const id = requestAnimationFrame(() => setShowJoinButton(true))
            return () => cancelAnimationFrame(id)
        }

        const visibleSet = new Set<Element>()

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        visibleSet.add(entry.target)
                    } else {
                        visibleSet.delete(entry.target)
                    }
                })
                setShowJoinButton(visibleSet.size === 0)
            },
            { threshold: 0 }
        )

        targets.forEach((el) => observer.observe(el))

        return () => observer.disconnect()
    }, [location.pathname])

    // Lock body scroll when menu is open
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [menuOpen])

    // Open menu animation
    const openMenu = useCallback(() => {
        if (isAnimating.current) return
        isAnimating.current = true
        setMenuOpen(true)

        const overlay = overlayRef.current
        const items = menuItemRefs.current.filter(Boolean) as HTMLElement[]
        const joinBtn = menuJoinRef.current
        if (!overlay) return

        // Set initial states
        gsap.set(overlay, { height: 0, display: 'flex' })
        gsap.set(items, { opacity: 0, y: 20 })
        if (joinBtn) gsap.set(joinBtn, { opacity: 0, y: 20 })

        const tl = gsap.timeline({
            onComplete: () => { isAnimating.current = false },
        })

        // Panel expands from top to bottom
        tl.to(overlay, {
            height: '100vh',
            duration: 0.4,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        })

        // Menu items stagger in (100ms apart), starting during expansion
        items.forEach((item, i) => {
            tl.to(item, {
                opacity: 1,
                y: 0,
                duration: 0.3,
                ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }, 0.2 + i * 0.1) // starts 200ms into the panel animation
        })

        // JOIN AUGO button fades in last
        if (joinBtn) {
            tl.to(joinBtn, {
                opacity: 1,
                y: 0,
                duration: 0.3,
                ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }, 0.2 + items.length * 0.1)
        }
    }, [])

    // Close menu animation
    const closeMenu = useCallback(() => {
        if (isAnimating.current) return
        isAnimating.current = true
        setMenuOpen(false) // morph X → hamburger immediately

        const overlay = overlayRef.current
        const items = menuItemRefs.current.filter(Boolean) as HTMLElement[]
        const joinBtn = menuJoinRef.current
        if (!overlay) return

        const tl = gsap.timeline({
            onComplete: () => {
                gsap.set(overlay, { display: 'none' })
                isAnimating.current = false
            },
        })

        // Content fades out first
        if (joinBtn) {
            tl.to(joinBtn, {
                opacity: 0,
                y: -10,
                duration: 0.2,
                ease: 'power2.in',
            }, 0)
        }

        tl.to(items, {
            opacity: 0,
            y: -10,
            duration: 0.2,
            ease: 'power2.in',
            stagger: 0.05,
        }, 0)

        // Then panel shrinks up
        tl.to(overlay, {
            height: 0,
            duration: 0.35,
            ease: 'power2.inOut',
        }, 0.15)
    }, [])

    const handleToggle = useCallback(() => {
        if (menuOpen) {
            closeMenu()
        } else {
            openMenu()
        }
    }, [menuOpen, openMenu, closeMenu])

    // Handle hash link click: smooth scroll if on Home, navigate otherwise
    const handleHashLinkClick = useCallback((e: React.MouseEvent, href: string) => {
        if (!href.startsWith('#')) return // non-hash links navigate normally
        const isHome = location.pathname === `/${currentLang}` || location.pathname === `/${currentLang}/`
        if (isHome) {
            e.preventDefault()
            const el = document.querySelector(href)
            if (el) el.scrollIntoView({ behavior: 'smooth' })
        } else {
            e.preventDefault()
            navigate(`/${currentLang}` + href)
        }
    }, [location.pathname, navigate, currentLang])

    // Close menu when a link is clicked
    const handleMenuLinkClick = useCallback((e: React.MouseEvent, href: string) => {
        if (href.startsWith('#')) {
            handleHashLinkClick(e, href)
        }
        closeMenu()
    }, [closeMenu, handleHashLinkClick])

    return (
        <>
            <nav className="navbar-sticky fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-5 sm:px-6 md:px-8 lg:px-12 pt-6 pb-2">
                {/* Left Side: Logo + Nav Links */}
                <div className="flex items-center gap-[100px]">
                    {/* Logo */}
                    <a href={`/${currentLang}`} className="flex-shrink-0 relative z-[60]">
                        <img src={augoLogo} alt="augo" className="h-7" />
                    </a>

                    {/* Nav Links — visible only on lg+ (desktop) */}
                    <div className="hidden lg:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <NavLink key={link.href} label={link.label} href={link.href} onClick={(e) => handleHashLinkClick(e, link.href)} />
                        ))}
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
                    {/* Language Switcher */}
                    <div className="hidden sm:block">
                        <LanguageSwitcher />
                    </div>
                    {/* Find a Match — visible only on md+ (tablet and desktop) */}
                    <div className="hidden md:block">
                        <NavLink label={t('nav.findAMatch')} href={`/${currentLang}/find`} />
                    </div>
                    <a
                        href={`/${currentLang}/join`}
                        className="join-augo-btn font-mono text-[11px] sm:text-sm font-extrabold tracking-[1.5px] sm:tracking-[2px] uppercase px-3.5 py-2 sm:px-6 sm:py-3 rounded-md sm:rounded-lg"
                        style={{
                            opacity: showJoinButton && !menuOpen ? 1 : 0,
                            transform: showJoinButton && !menuOpen ? 'translateY(0)' : 'translateY(10px)',
                            pointerEvents: showJoinButton && !menuOpen ? 'auto' : 'none',
                            transition: 'opacity 300ms ease-in-out, transform 300ms ease-in-out, background 200ms ease-in-out, color 200ms ease-in-out',
                        }}
                    >
                        {t('nav.joinAugo')}
                    </a>
                    {/* Hamburger / Close toggle — visible only below md (mobile) */}
                    <button
                        className="md:hidden relative z-[60] flex flex-col items-center justify-center w-8 h-8 cursor-pointer gap-[6px]"
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        onClick={handleToggle}
                    >
                        <span
                            className="block w-6 h-[2px] bg-white rounded-full transition-all duration-300 ease-in-out origin-center"
                            style={{
                                transform: menuOpen ? 'translateY(8px) rotate(45deg)' : 'none',
                            }}
                        />
                        <span
                            className="block w-6 h-[2px] bg-white rounded-full transition-all duration-300 ease-in-out"
                            style={{
                                opacity: menuOpen ? 0 : 1,
                                transform: menuOpen ? 'scaleX(0)' : 'scaleX(1)',
                            }}
                        />
                        <span
                            className="block w-6 h-[2px] bg-white rounded-full transition-all duration-300 ease-in-out origin-center"
                            style={{
                                transform: menuOpen ? 'translateY(-8px) rotate(-45deg)' : 'none',
                            }}
                        />
                    </button>
                </div>
            </nav>

            {/* ─── Mobile Menu Overlay ─── */}
            <div
                ref={overlayRef}
                className="fixed top-0 left-0 right-0 z-[55] flex-col items-center justify-between overflow-hidden"
                style={{
                    display: 'none',
                    height: 0,
                    backgroundColor: '#0A0A0A',
                }}
            >
                {/* Language switcher in mobile menu */}
                <div className="pt-24 flex justify-center sm:hidden">
                    <LanguageSwitcher />
                </div>

                {/* Menu links — centered in the upper area */}
                <nav className="flex flex-col items-center gap-8 pt-8 sm:pt-32 flex-1">
                    {mobileMenuLinks.map((link, i) => (
                        <a
                            key={link.href}
                            href={link.href}
                            ref={(el) => { menuItemRefs.current[i] = el }}
                            onClick={(e) => handleMenuLinkClick(e, link.href)}
                            className="font-['JetBrains_Mono'] font-normal text-[24px] leading-[150%] tracking-[0px] text-center uppercase text-white no-underline"
                            style={{ opacity: 0 }}
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* JOIN AUGO button — pinned to bottom */}
                <div className="px-5 sm:px-6 pb-10 w-full">
                    <a
                        ref={menuJoinRef}
                        href={`/${currentLang}/join`}
                        onClick={(e) => handleMenuLinkClick(e, `/${currentLang}/join`)}
                        className="btn-gradient block w-full font-mono text-sm font-extrabold tracking-[2px] uppercase text-white text-center py-4 rounded-lg"
                        style={{ opacity: 0 }}
                    >
                        {t('nav.joinAugo')}
                    </a>
                </div>
            </div>
        </>
    )
}
