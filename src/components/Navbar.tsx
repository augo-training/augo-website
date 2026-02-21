import { useEffect, useState } from 'react'
import augoLogo from '../assets/images/augo_logo.webp'

const navLinks = [
    { label: 'For Coaches', href: '#coaches' },
    { label: 'For Athletes', href: '#athletes' },
]

function NavLink({ label, href }: { label: string; href: string }) {
    return (
        <a
            href={href}
            className="group flex items-center gap-1 font-['JetBrains_Mono'] text-[14px] font-normal leading-[100%] tracking-[2px] uppercase text-white no-underline transition-all duration-200 ease-out hover:font-bold hover:italic"
        >
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out">
                ///
            </span>
            <span>{label}</span>
        </a>
    )
}

export default function Navbar() {
    const [showJoinButton, setShowJoinButton] = useState(false)

    // Intersection Observer: hide Join Augo when Hero CTA or FAQ CTA is on screen
    useEffect(() => {
        // Already on the Join page → hide the button
        if (window.location.pathname === '/join') {
            setShowJoinButton(false)
            return
        }

        const heroCta = document.querySelector('[data-cta="hero"]')
        const faqCta = document.querySelector('[data-cta="faq"]')

        const targets = [heroCta, faqCta].filter(Boolean) as Element[]
        if (targets.length === 0) {
            // No CTA targets on this page (e.g. /find) → always show the button
            setShowJoinButton(true)
            return
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
    }, [])

    return (
        <nav className="navbar-sticky fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 pt-6 pb-2">
            {/* Left Side: Logo + Nav Links */}
            <div className="flex items-center gap-[100px]">
                {/* Logo */}
                <a href="/" className="flex-shrink-0">
                    <img src={augoLogo} alt="Augo" className="h-7" />
                </a>

                {/* Nav Links */}
                <div className="flex items-center gap-10">
                    {navLinks.map((link) => (
                        <NavLink key={link.label} label={link.label} href={link.href} />
                    ))}
                </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-8">
                <NavLink label="Find a Match" href="/find" />
                <a
                    href="/join"
                    className="join-augo-btn font-mono text-sm font-extrabold tracking-[2px] uppercase px-6 py-3 rounded-lg"
                    style={{
                        opacity: showJoinButton ? 1 : 0,
                        transform: showJoinButton ? 'translateY(0)' : 'translateY(10px)',
                        pointerEvents: showJoinButton ? 'auto' : 'none',
                        transition: 'opacity 300ms ease-in-out, transform 300ms ease-in-out, background 200ms ease-in-out, color 200ms ease-in-out',
                    }}
                >
                    Join Augo
                </a>
            </div>
        </nav>
    )
}
