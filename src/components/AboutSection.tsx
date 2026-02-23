import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import aboutLeftImg from '../assets/images/about_augo_left.webp'
import aboutRightImg from '../assets/images/about_augo_right.webp'
import aboutMobileImg from '../assets/images/about_mobile.webp'

export default function AboutSection() {
    const sectionRef = useRef<HTMLDivElement>(null)

    // Text refs
    const headline1Ref = useRef<HTMLParagraphElement>(null)
    const body1Ref = useRef<HTMLParagraphElement>(null)
    const headline2Ref = useRef<HTMLParagraphElement>(null)
    const body2Ref = useRef<HTMLParagraphElement>(null)

    // Photo refs
    const photo1Ref = useRef<HTMLImageElement>(null)
    const photo2Ref = useRef<HTMLImageElement>(null)

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches

        const isMobile = window.innerWidth < 768
        const slideDistance = isMobile ? 15 : 20

        // --- Helper: text reveal via IntersectionObserver ---
        function revealText(
            headline: HTMLElement,
            body: HTMLElement
        ) {
            gsap.set(headline, { opacity: 0, y: slideDistance })
            gsap.set(body, { opacity: 0 })

            if (prefersReducedMotion) {
                gsap.set(headline, { opacity: 1, y: 0 })
                gsap.set(body, { opacity: 1 })
                return
            }

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            gsap.to(headline, {
                                opacity: 1,
                                y: 0,
                                duration: 1.6,
                                ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
                            })
                            gsap.to(body, {
                                opacity: 1,
                                duration: 1,
                                delay: 0.3,
                                ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
                            })
                            observer.disconnect()
                        }
                    })
                },
                { threshold: 0.2 }
            )
            observer.observe(headline)
            return observer
        }

        // --- Helper: photo fade-in + parallax ---
        function revealPhoto(img: HTMLImageElement) {
            gsap.set(img, { opacity: 0 })

            if (prefersReducedMotion) {
                gsap.set(img, { opacity: 1 })
                return
            }

            // Fade in when entering viewport
            const fadeObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            gsap.to(img, {
                                opacity: 1,
                                duration: 0.8,
                                ease: 'power2.out',
                            })
                            fadeObserver.disconnect()
                        }
                    })
                },
                { threshold: 0.1 }
            )
            fadeObserver.observe(img)

            // Parallax on scroll (desktop only)
            if (!isMobile) {
                const onScroll = () => {
                    const rect = img.getBoundingClientRect()
                    const viewH = window.innerHeight
                    // progress: 0 when bottom of img at bottom of viewport, 1 when top at top
                    const progress = 1 - (rect.bottom / (viewH + rect.height))
                    // parallax factor 0.95 → moves 5% slower than scroll
                    const offset = progress * rect.height * 0.05
                    gsap.set(img, { y: offset })
                }
                window.addEventListener('scroll', onScroll, { passive: true })
                return () => {
                    fadeObserver.disconnect()
                    window.removeEventListener('scroll', onScroll)
                }
            }

            return () => fadeObserver.disconnect()
        }

        const cleanups: ((() => void) | undefined)[] = []

        if (headline1Ref.current && body1Ref.current) {
            revealText(headline1Ref.current, body1Ref.current)
        }
        if (headline2Ref.current && body2Ref.current) {
            revealText(headline2Ref.current, body2Ref.current)
        }
        if (photo1Ref.current) {
            cleanups.push(revealPhoto(photo1Ref.current))
        }
        if (photo2Ref.current) {
            cleanups.push(revealPhoto(photo2Ref.current))
        }

        return () => {
            cleanups.forEach((fn) => fn?.())
        }
    }, [])

    return (
        <section
            ref={sectionRef}
            className="py-16 sm:py-20 px-5 sm:px-8 flex flex-col gap-10 md:gap-16 max-w-[1200px] mx-auto"
        >
            {/* Mobile Tag */}
            <div className="flex lg:hidden items-center gap-2">
                <span className="font-satoshi font-black italic text-[16px] leading-[100%] tracking-[4px] text-[#969EA7]">
                    ///////
                </span>
                <span className="font-mono italic font-normal text-[16px] leading-[100%] tracking-[2px] text-[#969EA7] uppercase">
                    ABOUT AUGO
                </span>
            </div>

            {/* Row 1: Text left + Image right (Desktop) / Tag + Text left + mobile img (Mobile / Tablet) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Left: Texts */}
                <div className="flex flex-col gap-4 sm:gap-6">
                    <p
                        ref={body1Ref}
                        className="font-satoshi font-medium text-[16px] sm:text-[18px] leading-[130%] text-[#969EA7]"
                    >
                        augo was founded by Fabi and Bruna, two endurance coaches who
                        also happened to work in tech. As a business analyst and data
                        scientist, they expected their tools to help them coach better.
                    </p>
                    <p
                        ref={headline1Ref}
                        className="font-satoshi font-bold text-[20px] sm:text-[24px] lg:text-[28px] xl:text-[32px] leading-[130%] text-white"
                    >
                        Instead, they found themselves drowning in
                        fragmented communication, losing important
                        details, and missing the signals that mattered.
                    </p>
                </div>

                {/* Right: Tag + Desktop Image */}
                <div className="hidden lg:flex flex-col gap-4">
                    {/* Tag aligned right (Desktop) */}
                    <div className="flex items-center gap-2 mb-2 justify-end">
                        <span className="font-satoshi font-black italic text-[18px] leading-[100%] tracking-[4px] text-[#969EA7]">
                            ///////
                        </span>
                        <span className="font-mono italic font-normal text-[18px] leading-[100%] tracking-[2px] text-[#969EA7] uppercase">
                            ABOUT AUGO
                        </span>
                    </div>
                    <div className="overflow-hidden rounded-2xl">
                        <img
                            ref={photo1Ref}
                            src={aboutRightImg}
                            alt="Augo founder"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </div>

                {/* Mobile / Tablet Image (Visible only on < lg) */}
                <div className="flex lg:hidden overflow-hidden rounded-2xl w-full">
                    <img
                        src={aboutMobileImg}
                        alt="Augo founders mobile"
                        className="w-full h-auto object-cover"
                    />
                </div>
            </div>

            {/* Row 2: Image left + Text right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Left: Desktop Image (Hidden on mobile/tablet) */}
                <div className="hidden lg:block overflow-hidden rounded-2xl">
                    <img
                        ref={photo2Ref}
                        src={aboutLeftImg}
                        alt="Augo founder"
                        className="w-full h-auto object-cover"
                    />
                </div>

                {/* Right: Texts */}
                <div className="flex flex-col gap-4 sm:gap-6">
                    <p
                        ref={body2Ref}
                        className="font-satoshi font-medium text-[16px] sm:text-[18px] leading-[130%] text-[#969EA7]"
                    >
                        So they built augo. Because coaching is hard enough without tools
                        that create more work. We believe AI should support human
                        expertise with the right insights at the right time, helping you do
                        what you do best: understand and develop your athletes.
                    </p>
                    <p
                        ref={headline2Ref}
                        className="font-satoshi font-bold text-[20px] sm:text-[24px] leading-[130%] text-white"
                    >
                        Technology that serves coaches, not the other
                        way around
                    </p>
                </div>
            </div>
        </section>
    )
}
