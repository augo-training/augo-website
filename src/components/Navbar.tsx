import augoLogo from '../assets/images/augo_logo.webp'

const navLinks = [
    { label: 'For Coaches', href: '#coaches' },
    { label: 'For Athletes', href: '#athletes' },
]

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-6 bg-[#090909]">
            {/* Left Side: Logo + Nav Links */}
            <div className="flex items-center gap-[100px]">
                {/* Logo */}
                <a href="/" className="flex-shrink-0">
                    <img src={augoLogo} alt="Augo" className="h-7" />
                </a>

                {/* Nav Links */}
                <div className="flex items-center gap-10">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="font-mono text-sm tracking-[2px] uppercase text-white hover:opacity-70 transition-opacity duration-200"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-8">
                <a
                    href="#match"
                    className="font-mono text-sm tracking-[2px] uppercase text-white hover:opacity-70 transition-opacity duration-200"
                >
                    Find a Match
                </a>
                <a
                    href="#join"
                    className="btn-gradient font-mono text-sm font-extrabold tracking-[2px] uppercase text-white px-6 py-3 rounded-lg hover:brightness-110 transition-all duration-200"
                >
                    Join Augo
                </a>
            </div>
        </nav>
    )
}
