import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import empowerVideo1 from '../assets/videos/empower_1.mp4'
import empowerVideo2 from '../assets/videos/empower_2.mp4'

export default function EmpowerSection() {
    const sectionRef = useRef<HTMLElement>(null)

    // Headline ref
    const headlineRef = useRef<HTMLHeadingElement>(null)

    // Row 2 text refs
    const body2Ref = useRef<HTMLParagraphElement>(null)
    const headline2Ref = useRef<HTMLParagraphElement>(null)

    // Image/video frame refs
    const frame1Ref = useRef<HTMLVideoElement>(null)
    const frame2Ref = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches

        const isMobile = window.innerWidth < 768
        const slideDistance = isMobile ? 15 : 20

        // --- Helper: headline reveal via IntersectionObserver ---
        function revealHeadline(el: HTMLElement) {
            gsap.set(el, { opacity: 0, y: slideDistance })

            if (prefersReducedMotion) {
                gsap.set(el, { opacity: 1, y: 0 })
                return
            }

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            gsap.to(el, {
                                opacity: 1,
                                y: 0,
                                duration: 1.6,
                                ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
                            })
                            observer.disconnect()
                        }
                    })
                },
                { threshold: 0.3 }
            )
            observer.observe(el)
            return observer
        }

        // --- Helper: text pair reveal (headline + body) ---
        function revealTextPair(headline: HTMLElement, body: HTMLElement) {
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
                { threshold: 0.3 }
            )
            observer.observe(headline)
            return observer
        }

        // --- Helper: image/video frame fade-in + parallax ---
        function revealFrame(
            img: HTMLElement,
            staggerDelay: number = 0
        ) {
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
                                delay: staggerDelay,
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
                    const progress =
                        1 - rect.bottom / (viewH + rect.height)
                    // parallax factor ~0.95 → moves 5% slower than scroll
                    const offset = progress * rect.height * 0.05
                    gsap.set(img, { y: offset })
                }
                window.addEventListener('scroll', onScroll, {
                    passive: true,
                })
                return () => {
                    fadeObserver.disconnect()
                    window.removeEventListener('scroll', onScroll)
                }
            }

            return () => fadeObserver.disconnect()
        }

        const cleanups: ((() => void) | undefined)[] = []

        // Section headline
        if (headlineRef.current) {
            revealHeadline(headlineRef.current)
        }

        // Row 2 text pair
        if (headline2Ref.current && body2Ref.current) {
            revealTextPair(headline2Ref.current, body2Ref.current)
        }

        // Frame 1 (no stagger)
        if (frame1Ref.current) {
            cleanups.push(revealFrame(frame1Ref.current, 0))
        }

        // Frame 2 (1.5s stagger offset)
        if (frame2Ref.current) {
            cleanups.push(revealFrame(frame2Ref.current, 1.5))
        }

        return () => {
            cleanups.forEach((fn) => fn?.())
        }
    }, [])

    return (
        <section
            ref={sectionRef}
            className="py-20 px-8 flex flex-col gap-20 max-w-[1200px] mx-auto"
        >
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                {/* Left: Text */}
                <h2
                    ref={headlineRef}
                    className="font-mono font-bold text-[48px] leading-[130%] text-white"
                >
                    Built to
                    <br />
                    empower coaches,
                    <br />
                    not replace them.
                </h2>

                {/* Right: Image/Video Frame 1 */}
                <div className="flex justify-end overflow-hidden rounded-2xl">
                    <video
                        ref={frame1Ref}
                        src={empowerVideo1}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="max-w-full h-auto object-cover will-change-transform"
                    />
                </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                {/* Left: Image/Video Frame 2 */}
                <div className="overflow-hidden rounded-2xl">
                    <video
                        ref={frame2Ref}
                        src={empowerVideo2}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-auto object-cover will-change-transform"
                    />
                </div>

                {/* Right: Text Content */}
                <div className="flex flex-col justify-center h-full ml-18">
                    <p
                        ref={body2Ref}
                        className="font-satoshi font-medium text-[18px] leading-[130%] text-[#ACB1B7] mb-12"
                    >
                        Too many coaching tools focus on plans, not people.
                        <br />
                        Messages scatter across platforms. Context gets lost. And
                        <br />
                        important signals go unnoticed in the noise.
                    </p>

                    <p
                        ref={headline2Ref}
                        className="font-satoshi font-bold text-[24px] leading-[130%] text-white"
                    >
                        augo brings everything together -
                        <br />
                        combining athlete data, feedback, and
                        <br />
                        trends into a single view that helps you
                        <br />
                        coach better.
                    </p>
                </div>
            </div>
        </section>
    )
}
