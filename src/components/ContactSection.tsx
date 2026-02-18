import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function ContactSection() {
    const blob1Ref = useRef<HTMLDivElement>(null)
    const blob2Ref = useRef<HTMLDivElement>(null)
    const blob3Ref = useRef<HTMLDivElement>(null)
    const blob4Ref = useRef<HTMLDivElement>(null)
    const blob5Ref = useRef<HTMLDivElement>(null)
    const formCardRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches
        if (prefersReducedMotion) return

        const blobs = [
            { ref: blob1Ref, duration: 8, x: 40, y: 25, r: 15 },
            { ref: blob2Ref, duration: 10, x: -30, y: 35, r: -20 },
            { ref: blob3Ref, duration: 7, x: 25, y: -30, r: 10 },
            { ref: blob4Ref, duration: 9, x: -35, y: 25, r: -15 },
            { ref: blob5Ref, duration: 11, x: 20, y: -25, r: 12 },
        ]

        const tweens = blobs.map(({ ref, duration, x, y, r }) => {
            const el = ref.current
            if (!el) return null
            return gsap.to(el, {
                x, y, rotation: r, scale: 1.08,
                duration,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
            })
        })

        // Form card fade in
        const card = formCardRef.current
        if (card) {
            gsap.set(card, { opacity: 0, y: 20 })
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            gsap.to(card, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
                            observer.disconnect()
                        }
                    })
                },
                { threshold: 0.1 }
            )
            observer.observe(card)
        }

        return () => { tweens.forEach((t) => t?.kill()) }
    }, [])

    return (
        <section
            id="contact"
            className="w-full flex items-center relative overflow-hidden bg-[#090909]"
            style={{ minHeight: '100vh' }}
        >
            {/* ── Mesh gradient — full coverage ── */}
            <div
                className="absolute inset-0"
                aria-hidden="true"
                style={{ filter: 'blur(60px)', opacity: 0.9 }}
            >
                {/* Yellow — top-right large */}
                <div
                    ref={blob1Ref}
                    className="absolute"
                    style={{
                        width: '80%', height: '80%',
                        top: '-20%', right: '-10%',
                        background: 'radial-gradient(ellipse 80% 50% at 70% 30%, #FFCA1E 0%, transparent 65%)',
                    }}
                />
                {/* Orange — center-right */}
                <div
                    ref={blob2Ref}
                    className="absolute"
                    style={{
                        width: '75%', height: '75%',
                        top: '0%', right: '0%',
                        background: 'radial-gradient(ellipse 60% 40% at 55% 50%, #FF5514 0%, transparent 65%)',
                    }}
                />
                {/* Red — center, large */}
                <div
                    ref={blob3Ref}
                    className="absolute"
                    style={{
                        width: '85%', height: '85%',
                        top: '10%', left: '10%',
                        background: 'radial-gradient(ellipse 50% 50% at 50% 50%, #C50017 0%, transparent 60%)',
                    }}
                />
                {/* Orange — bottom-center */}
                <div
                    ref={blob4Ref}
                    className="absolute"
                    style={{
                        width: '70%', height: '70%',
                        bottom: '-20%', right: '5%',
                        background: 'radial-gradient(ellipse 40% 35% at 50% 60%, #FF5514 0%, transparent 65%)',
                    }}
                />
                {/* Yellow — left side to fill left black area */}
                <div
                    ref={blob5Ref}
                    className="absolute"
                    style={{
                        width: '60%', height: '60%',
                        top: '20%', left: '-5%',
                        background: 'radial-gradient(ellipse 70% 60% at 40% 40%, #FFCA1E 0%, transparent 60%)',
                    }}
                />
            </div>

            {/* ── Edge fades 150px ── */}
            <div className="absolute inset-x-0 top-0 z-10 pointer-events-none"
                style={{ height: '150px', background: 'linear-gradient(to bottom, #090909 0%, transparent 100%)' }} />
            <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
                style={{ height: '150px', background: 'linear-gradient(to top, #090909 0%, transparent 100%)' }} />

            {/* ── Content ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-[1200px] mx-auto w-full items-start relative z-20 px-8 py-24">

                {/* Left: Form placeholder card — 486×617 per Figma */}
                <div
                    ref={formCardRef}
                    className="bg-white rounded-2xl p-8 flex flex-col gap-5"
                    style={{ minHeight: '617px', maxWidth: '486px', width: '100%' }}
                >
                    <p className="font-satoshi font-bold text-[22px] leading-[130%] text-[#151515]">
                        Fill in this form and we'll<br />reach out
                    </p>

                    {/* Form fields placeholder */}
                    <div className="flex flex-col gap-3 flex-1">
                        {['Full name*', 'Email*', 'Phone number'].map((label) => (
                            <div
                                key={label}
                                className="w-full rounded-lg px-4 py-3 text-[15px] text-[#969EA7]"
                                style={{ background: '#F2F2F2', minHeight: '44px', display: 'flex', alignItems: 'center' }}
                            >
                                {label}
                            </div>
                        ))}
                        {/* Subject dropdown */}
                        <div
                            className="w-full rounded-lg px-4 py-3 text-[15px] text-[#969EA7] flex items-center justify-between"
                            style={{ background: '#F2F2F2', minHeight: '44px' }}
                        >
                            <span>Subject*</span>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M4 6L8 10L12 6" stroke="#969EA7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        {/* Message textarea */}
                        <div
                            className="w-full rounded-lg px-4 py-3 text-[15px] text-[#969EA7]"
                            style={{ background: '#F2F2F2', minHeight: '120px', display: 'flex', alignItems: 'flex-start' }}
                        >
                            Message
                        </div>
                    </div>

                    {/* CTA button */}
                    <button
                        className="w-full rounded-lg py-4 font-mono font-bold text-[14px] tracking-[2px] text-white uppercase"
                        style={{ background: '#151515' }}
                    >
                        Get in touch
                    </button>

                    <p className="text-center text-[12px] text-[#969EA7] font-satoshi">
                        ↑ Placeholder — replace with your embedded form
                    </p>
                </div>

                {/* Right: Text */}
                <div className="flex flex-col gap-6 pt-4">
                    <h2 className="font-mono font-bold text-[56px] leading-[110%] text-white">
                        Questions?<br />
                        Ideas?<br />
                        Let's talk.
                    </h2>
                    <p className="font-satoshi font-medium text-[18px] leading-[150%] text-white" style={{ opacity: 0.8 }}>
                        Whether you're curious about augo, want to share
                        feedback, or just want to connect, we'd love to hear
                        from you.
                    </p>
                </div>
            </div>
        </section>
    )
}
