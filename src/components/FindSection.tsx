import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import bgImage from '../assets/images/bg_section_1.webp'

const ROTATING_WORDS = ['coach', 'athlete']
const WORD_DURATION = 3 // seconds each word is visible
const FADE_DURATION = 0.4 // seconds for fade in/out

export default function FindSection() {
    const sectionRef = useRef<HTMLElement>(null)
    const bgOverlayRef = useRef<HTMLDivElement>(null)
    const headlineRef = useRef<HTMLHeadingElement>(null)
    const rotatingRef = useRef<HTMLSpanElement>(null)
    const bodyRef = useRef<HTMLParagraphElement>(null)
    const formRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches

        const isMobile = window.innerWidth < 768
        const slideDistance = isMobile ? 15 : 20

        const rotatingContainer = rotatingRef.current
        const wordEls = rotatingContainer?.querySelectorAll<HTMLSpanElement>('.rotating-word')

        // Initial states
        if (headlineRef.current) gsap.set(headlineRef.current, { opacity: 0, y: slideDistance })
        if (bodyRef.current) gsap.set(bodyRef.current, { opacity: 0 })
        if (formRef.current) gsap.set(formRef.current, { opacity: 0, scale: 0.95 })
        if (bgOverlayRef.current) gsap.set(bgOverlayRef.current, { opacity: 0 })
        if (wordEls) gsap.set(wordEls, { opacity: 0, y: 10 })

        if (prefersReducedMotion) {
            if (headlineRef.current) gsap.set(headlineRef.current, { opacity: 1, y: 0 })
            if (bodyRef.current) gsap.set(bodyRef.current, { opacity: 1 })
            if (formRef.current) gsap.set(formRef.current, { opacity: 1, scale: 1 })
            if (bgOverlayRef.current) gsap.set(bgOverlayRef.current, { opacity: 0.3 })
            if (wordEls && wordEls[0]) gsap.set(wordEls[0], { opacity: 1, y: 0 })
            return
        }

        const ease = 'cubic-bezier(0.16, 1, 0.3, 1)'

        // Background radial fade in
        if (bgOverlayRef.current) {
            gsap.to(bgOverlayRef.current, {
                opacity: 0.3,
                duration: 1.2,
                ease: 'power2.out',
            })
        }

        // Headline: fade-in + slide up
        if (headlineRef.current) {
            gsap.to(headlineRef.current, {
                opacity: 1,
                y: 0,
                duration: 1.6,
                ease,
            })
        }

        // Body text: fades in 300ms after headline starts
        if (bodyRef.current) {
            gsap.to(bodyRef.current, {
                opacity: 1,
                duration: 1,
                delay: 0.3,
                ease,
            })
        }

        // Form container: fade-in + scale up, 200ms after headline starts
        if (formRef.current) {
            gsap.to(formRef.current, {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                delay: 0.2,
                ease,
            })
        }

        // Rotating word animation
        let rotateTl: gsap.core.Timeline | null = null

        if (wordEls && wordEls.length > 0) {
            // Show first word after headline starts revealing
            gsap.to(wordEls[0], {
                opacity: 1,
                y: 0,
                duration: FADE_DURATION,
                delay: 0.6, // starts after initial headline reveal begins
                ease: 'power2.inOut',
            })

            // Build infinite rotation timeline
            rotateTl = gsap.timeline({
                repeat: -1,
                delay: 0.6 + FADE_DURATION + WORD_DURATION,
            })

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

                // Reset current word position
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
        }

        return () => {
            rotateTl?.kill()
        }
    }, [])

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >

            {/* Content */}
            <div className="relative z-10 w-full max-w-[1200px] mx-auto px-5 sm:px-8 py-20 sm:py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left: Text */}
                <div className="flex flex-col gap-6 lg:gap-8 items-center lg:items-start text-center lg:text-left">
                    <h1 ref={headlineRef} className="font-mono font-bold text-[36px] sm:text-[44px] xl:text-[48px] leading-[130%] text-white">
                        Get matched
                        <br className="hidden lg:block" />
                        <span className="inline lg:hidden"> </span>with the
                        <br />
                        perfect{' '}
                        <span ref={rotatingRef} className="relative inline-block text-left align-bottom">
                            {ROTATING_WORDS.map((word) => (
                                <span
                                    key={word}
                                    className="rotating-word absolute left-0 top-0 whitespace-nowrap"
                                    style={{ opacity: 0 }}
                                >
                                    {word}
                                </span>
                            ))}
                            {/* Invisible spacer to hold width */}
                            <span className="invisible">athlete</span>
                        </span>
                    </h1>
                    <p ref={bodyRef} className="font-satoshi font-medium text-[16px] sm:text-[18px] leading-[130%] text-[#969EA7] max-w-[420px]">
                        Answer a few questions about your training, goals,
                        and communication style. We'll connect you with
                        the right match based on what matters most to
                        you.
                    </p>
                </div>

                {/* Right: Form placeholder with animated border + glow */}
                <div ref={formRef} className="flex justify-center lg:justify-end w-full mt-4 lg:mt-0">
                    <div className="join-form-wrapper relative w-full max-w-[340px] sm:max-w-[400px]">
                        {/* Pulsing glow behind */}
                        <div className="join-form-glow absolute -inset-10 sm:-inset-16 rounded-[2rem] pointer-events-none" />

                        {/* Rotating gradient border */}
                        <div className="join-form-border relative rounded-[20px] sm:rounded-[24px] p-[2px] sm:p-[3px]">
                            {/* Inner container */}
                            <div className="join-form-inner rounded-[18px] sm:rounded-[21px] bg-[#0A0A0A] h-[480px] sm:h-[550px] w-full flex flex-col items-center justify-center">
                                <button className="bg-white text-[#0A0A0A] font-mono font-bold text-[14px] sm:text-[16px] tracking-[2px] uppercase py-3 sm:py-4 px-6 sm:px-8 rounded flex items-center justify-center hover:scale-105 transition-transform duration-300">
                                    Get Started
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
