import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import bgSection1 from '../assets/images/bg_section_1.webp'
import imgHome from '../assets/images/home.png'
import imgAthlete from '../assets/images/athlete_home.png'
import imgCoach from '../assets/images/coach_home.png'

const ROTATING_WORDS = ['running', 'swimming', 'biking', 'triathlon', 'endurance']
const WORD_DURATION = 3 // seconds each word is visible
const FADE_DURATION = 0.4 // seconds for fade in/out

export default function Hero() {
    const line1Ref = useRef<HTMLSpanElement>(null)
    const line2Ref = useRef<HTMLSpanElement>(null)
    const line3Ref = useRef<HTMLSpanElement>(null)
    const subheadlineRef = useRef<HTMLParagraphElement>(null)
    const rotatingRef = useRef<HTMLSpanElement>(null)
    const ctaRef = useRef<HTMLAnchorElement>(null)
    const sectionRef = useRef<HTMLElement>(null)
    const mockupsRef = useRef<HTMLDivElement>(null)
    const glowRef = useRef<HTMLDivElement>(null)

    // Mouse position for glow follow (using refs to avoid re-renders)
    const mousePos = useRef({ x: 0, y: 0 })
    const glowPos = useRef({ x: 0, y: 0 })
    const rafId = useRef<number>(0)
    const isMouseInSection = useRef(false)

    useEffect(() => {
        const lines = [line1Ref.current, line2Ref.current, line3Ref.current]
        const subheadline = subheadlineRef.current
        const rotatingContainer = rotatingRef.current
        const cta = ctaRef.current
        const section = sectionRef.current
        const mockups = mockupsRef.current
        const glow = glowRef.current
        if (!lines.every(Boolean) || !subheadline || !rotatingContainer || !cta || !section || !mockups || !glow) return

        const wordEls = rotatingContainer.querySelectorAll<HTMLSpanElement>('.rotating-word')

        // Set initial states
        gsap.set(lines, { opacity: 0, y: 20 })
        gsap.set(subheadline, { opacity: 0 })
        gsap.set(wordEls, { opacity: 0, y: 10 })
        gsap.set(cta, { opacity: 0 })
        gsap.set(glow, { opacity: 0 })

        // --- Main timeline ---
        const tl = gsap.timeline()

        // 1. Headline text reveal — stagger each line
        const cubicEase = 'cubic-bezier(0.16, 1, 0.3, 1)'
        lines.forEach((line, i) => {
            tl.to(line!, {
                opacity: 1,
                y: 0,
                duration: 1.6,
                ease: cubicEase,
            }, 0.3 + i * 0.3) // starts at 300ms, 300ms gap
        })

        // 2. Subheadline fade-in — 300ms after last headline line starts
        const subheadlineStart = 0.3 + 2 * 0.3 + 0.3 // last line start + 300ms
        tl.to(subheadline, {
            opacity: 1,
            duration: 1,
            ease: cubicEase,
        }, subheadlineStart)

        // 3. CTA button fade-in — ~1400ms after subheadline starts
        const ctaStart = subheadlineStart + 1.4
        tl.to(cta, {
            opacity: 1,
            duration: 0.2,
            ease: 'power2.out',
        }, ctaStart)

        // 4. Rotating word — starts after headline reveal completes
        const headlineEnd = 0.3 + 2 * 0.3 + 1.6 // last line start + duration
        // Show first word immediately at headlineEnd
        tl.to(wordEls[0], {
            opacity: 1,
            y: 0,
            duration: FADE_DURATION,
            ease: 'ease-in-out',
        }, headlineEnd)

        // Build infinite rotation timeline
        const rotateTl = gsap.timeline({ repeat: -1, delay: headlineEnd + FADE_DURATION + WORD_DURATION })

        for (let i = 0; i < ROTATING_WORDS.length; i++) {
            const currentWord = wordEls[i]
            const nextWord = wordEls[(i + 1) % ROTATING_WORDS.length]

            // Fade out current word + slide up
            rotateTl.to(currentWord, {
                opacity: 0,
                y: -10,
                duration: FADE_DURATION,
                ease: 'power2.inOut',
            })

            // Reset current word position for next cycle
            rotateTl.set(currentWord, { y: 10 })

            // Fade in next word + slide up from below
            rotateTl.to(nextWord, {
                opacity: 1,
                y: 0,
                duration: FADE_DURATION,
                ease: 'power2.inOut',
            })

            // Hold the word visible
            rotateTl.to({}, { duration: WORD_DURATION })
        }

        // 5. Mockups floating animation — different speeds for depth
        const homeImg = mockups.querySelector('.mockup-home')
        const athleteImg = mockups.querySelector('.mockup-athlete')
        const coachImg = mockups.querySelector('.mockup-coach')

        if (homeImg) {
            gsap.to(homeImg, {
                y: -10,
                duration: 6,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
            })
        }
        if (athleteImg) {
            gsap.to(athleteImg, {
                y: -14,
                duration: 5,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
            })
        }
        if (coachImg) {
            gsap.to(coachImg, {
                y: -12,
                duration: 5.5,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
            })
        }

        // 6. Glow mouse-follow (desktop) — set up event listeners
        const isMobile = window.matchMedia('(max-width: 768px)').matches

        if (isMobile) {
            // Mobile: simple ambient drift behind mockups
            gsap.set(glow, { opacity: 0.7 })
            const driftTl = gsap.timeline({ repeat: -1, yoyo: true })
            driftTl.to(glow, {
                x: 30,
                y: -20,
                duration: 3,
                ease: 'sine.inOut',
            }).to(glow, {
                x: -20,
                y: 25,
                duration: 4,
                ease: 'sine.inOut',
            })
        } else {
            // Desktop: follow cursor with lerp
            const handleMouseMove = (e: MouseEvent) => {
                const rect = section.getBoundingClientRect()
                mousePos.current.x = e.clientX - rect.left
                mousePos.current.y = e.clientY - rect.top
            }

            const handleMouseEnter = () => {
                isMouseInSection.current = true
                gsap.to(glow, { opacity: 0.7, duration: 0.4, ease: 'power2.out' })
            }

            const handleMouseLeave = () => {
                isMouseInSection.current = false
                gsap.to(glow, { opacity: 0, duration: 0.6, ease: 'power2.out' })
            }

            section.addEventListener('mousemove', handleMouseMove)
            section.addEventListener('mouseenter', handleMouseEnter)
            section.addEventListener('mouseleave', handleMouseLeave)

            // Glow lerp animation loop
            function animateGlow() {
                const g = glowRef.current
                if (!g) return
                const lerp = 0.08
                glowPos.current.x += (mousePos.current.x - glowPos.current.x) * lerp
                glowPos.current.y += (mousePos.current.y - glowPos.current.y) * lerp
                g.style.transform = `translate(${glowPos.current.x - 225}px, ${glowPos.current.y - 225}px)`
                rafId.current = requestAnimationFrame(animateGlow)
            }

            // Start glow animation loop
            rafId.current = requestAnimationFrame(animateGlow)

            // Cleanup
            return () => {
                tl.kill()
                rotateTl.kill()
                section.removeEventListener('mousemove', handleMouseMove)
                section.removeEventListener('mouseenter', handleMouseEnter)
                section.removeEventListener('mouseleave', handleMouseLeave)
                cancelAnimationFrame(rafId.current)
            }
        }

        return () => {
            tl.kill()
            rotateTl.kill()
            cancelAnimationFrame(rafId.current)
        }
    }, [])

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen flex items-center overflow-hidden"
            style={{
                backgroundImage: `url(${bgSection1})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Glow — stays behind UI mockups (z-index lower) */}
            <div
                ref={glowRef}
                className="pointer-events-none absolute"
                style={{
                    width: 450,
                    height: 450,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,202,30,0.7) 0%, rgba(255,85,20,0.45) 35%, rgba(197,0,23,0.2) 65%, transparent 100%)',
                    filter: 'blur(40px)',
                    opacity: 0,
                    zIndex: 5,
                    willChange: 'transform, opacity',
                }}
            />

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-6 md:px-8 lg:px-12 flex flex-col items-center text-center lg:flex-row lg:items-center lg:justify-between lg:text-left pt-44 sm:pt-40 lg:pt-36 pb-12 lg:pb-0 gap-12 lg:gap-0">
                {/* Left: Text Content */}
                <div className="max-w-[480px] flex-shrink-0">
                    <h1 className="font-mono font-bold text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] leading-[120%] text-white mb-6">
                        <span ref={line1Ref} className="block">
                            A new standard
                        </span>
                        <span ref={line2Ref} className="block">
                            for{' '}
                            <span ref={rotatingRef} className="relative inline-block align-bottom" style={{ minWidth: '160px' }}>
                                {ROTATING_WORDS.map((word) => (
                                    <span
                                        key={word}
                                        className="rotating-word absolute left-0 top-0 whitespace-nowrap lg:left-0 w-full lg:w-auto"
                                        style={{ opacity: 0 }}
                                    >
                                        {word}
                                    </span>
                                ))}
                                {/* Invisible spacer to hold width */}
                                <span className="invisible">endurance</span>
                            </span>
                        </span>
                        <span ref={line3Ref} className="block">
                            coaching
                        </span>
                    </h1>
                    <p ref={subheadlineRef} className="font-satoshi font-medium text-base sm:text-lg leading-[130%] text-text-muted mb-8 sm:mb-10" style={{ opacity: 0 }}>
                        The intelligent assistant that combines coach-athlete communication, workout data and session feedback, turning insights into action and giving you time for what matters most.
                    </p>
                    <a
                        ref={ctaRef}
                        href="/join"
                        className="btn-gradient inline-block font-mono text-sm font-extrabold tracking-[2px] uppercase text-white px-8 py-4 rounded-lg transition-all duration-200 cursor-pointer"
                        data-cta="hero"
                        style={{
                            opacity: 0,
                            transitionProperty: 'transform, box-shadow, filter',
                        }}
                        onMouseEnter={(e) => {
                            gsap.to(e.currentTarget, {
                                scale: 1.02,
                                boxShadow: '0 8px 32px rgba(255, 85, 20, 0.35)',
                                duration: 0.2,
                                ease: 'power2.out',
                            })
                        }}
                        onMouseLeave={(e) => {
                            gsap.to(e.currentTarget, {
                                scale: 1,
                                boxShadow: '0 0px 0px rgba(255, 85, 20, 0)',
                                duration: 0.2,
                                ease: 'power2.out',
                            })
                        }}
                        onTouchStart={(e) => {
                            gsap.to(e.currentTarget, {
                                scale: 0.98,
                                duration: 0.1,
                                ease: 'power2.out',
                            })
                        }}
                        onTouchEnd={(e) => {
                            gsap.to(e.currentTarget, {
                                scale: 1,
                                duration: 0.1,
                                ease: 'power2.out',
                            })
                        }}
                    >
                        Join Augo
                    </a>
                </div>

                {/* Right: App Mockups */}
                <div ref={mockupsRef} className="relative z-10 w-full max-w-[300px] sm:max-w-[400px] md:max-w-[620px] lg:w-[420px] xl:w-[620px] lg:max-w-none aspect-[620/580] flex-shrink-0">
                    {/* Static gradient glow behind mockups */}
                    <div
                        className="absolute pointer-events-none"
                        style={{
                            width: '106%',
                            height: '106%',
                            top: '50%',
                            left: '70%',
                            transform: 'translate(-50%, -50%)',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(255,202,30,0.5) 0%, rgba(255,85,20,0.3) 35%, rgba(197,0,23,0.15) 65%, transparent 100%)',
                            filter: 'blur(50px)',
                            zIndex: 0,
                        }}
                    />
                    <div
                        className="absolute pointer-events-none"
                        style={{
                            width: '106%',
                            height: '69%',
                            top: '30%',
                            left: '20%',
                            transform: 'translate(-50%, -50%)',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(255,202,30,0.5) 0%, rgba(255,85,20,0.3) 35%, rgba(197,0,23,0.15) 65%, transparent 100%)',
                            filter: 'blur(50px)',
                            zIndex: 0,
                        }}
                    />
                    {/* home.png — main dashboard (back, largest) */}
                    <img
                        src={imgHome}
                        alt="Augo Coach Dashboard"
                        className="mockup-home absolute rounded-2xl shadow-2xl"
                        style={{
                            width: '100%',
                            top: 0,
                            right: 0,
                            zIndex: 1,
                        }}
                    />
                    {/* athlete_home.png — phone on the left */}
                    <img
                        src={imgAthlete}
                        alt="Augo Athlete App"
                        className="mockup-athlete absolute rounded-2xl shadow-2xl"
                        style={{
                            width: '30.6%',
                            bottom: '13.8%',
                            left: '-9.7%',
                            zIndex: 3,
                        }}
                    />
                    {/* coach_home.png — phone center/below */}
                    <img
                        src={imgCoach}
                        alt="Augo Coach App"
                        className="mockup-coach absolute rounded-2xl shadow-2xl"
                        style={{
                            width: '30.6%',
                            bottom: 0,
                            left: '16.1%',
                            zIndex: 3,
                        }}
                    />
                </div>
            </div>
        </section>
    )
}
