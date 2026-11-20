import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import { trackCtaClicked } from '../utils/analytics'
import heroVideo from '../assets/videos/home-hero.mp4'
import heroPoster from '../assets/images/home-hero-poster.jpg'

const WORD_DURATION = 3 // seconds each word is visible
const FADE_DURATION = 0.4 // seconds for fade in/out

interface HeroProps {
    /** Called on "Watch the film" click — gates behind email capture and plays the film. */
    onWatchFilm?: () => void
}

export default function Hero({ onWatchFilm }: HeroProps) {
    const { t, i18n } = useTranslation()
    const rotatingWords = t('hero.rotatingWords', { returnObjects: true }) as string[]

    const line1Ref = useRef<HTMLSpanElement>(null)
    const line2Ref = useRef<HTMLSpanElement>(null)
    const line3Ref = useRef<HTMLSpanElement>(null)
    const subheadlineRef = useRef<HTMLParagraphElement>(null)
    const rotatingRef = useRef<HTMLSpanElement>(null)
    const ctaRef = useRef<HTMLButtonElement>(null)
    const sectionRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const lines = [line1Ref.current, line2Ref.current, line3Ref.current].filter(Boolean) as HTMLElement[]
        const subheadline = subheadlineRef.current
        const rotatingContainer = rotatingRef.current
        const cta = ctaRef.current
        const section = sectionRef.current
        if (lines.length === 0 || !subheadline || !rotatingContainer || !cta || !section) return

        const wordEls = rotatingContainer.querySelectorAll<HTMLSpanElement>('.rotating-word')

        // Set initial states
        gsap.set(lines, { opacity: 0, y: 20 })
        gsap.set(subheadline, { opacity: 0 })
        gsap.set(wordEls, { opacity: 0, y: 10 })
        gsap.set(cta, { opacity: 0 })

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
        const subheadlineStart = 0.3 + (lines.length - 1) * 0.3 + 0.3 // last line start + 300ms
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
        const headlineEnd = 0.3 + (lines.length - 1) * 0.3 + 1.6 // last line start + duration
        // Show first word immediately at headlineEnd
        tl.to(wordEls[0], {
            opacity: 1,
            y: 0,
            duration: FADE_DURATION,
            ease: 'ease-in-out',
        }, headlineEnd)

        // Build infinite rotation timeline
        const rotateTl = gsap.timeline({ repeat: -1, delay: headlineEnd + FADE_DURATION + WORD_DURATION })

        for (let i = 0; i < rotatingWords.length; i++) {
            const currentWord = wordEls[i]
            const nextWord = wordEls[(i + 1) % rotatingWords.length]

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

        return () => {
            tl.kill()
            rotateTl.kill()
        }
    }, [i18n.language]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen flex items-center overflow-hidden bg-dark"
        >
            {/* Brand footage, full bleed behind the copy. Hidden for
                reduced-motion, where the poster frame takes its place. */}
            <video
                src={heroVideo}
                poster={heroPoster}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover motion-reduce:hidden"
            />
            <img
                src={heroPoster}
                alt=""
                aria-hidden="true"
                className="hidden motion-reduce:block absolute inset-0 w-full h-full object-cover"
            />

            {/* Readability: an even dim, darker behind the text column, a band
                behind the navbar and a fade into the page background below. */}
            <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{ backgroundColor: 'rgba(10,10,10,0.6)' }}
            />
            <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                    background:
                        'linear-gradient(to right, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0) 55%), linear-gradient(to top, #0A0A0A 2%, rgba(10,10,10,0) 40%), linear-gradient(to bottom, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0) 22%)',
                }}
            />

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-6 md:px-8 lg:px-12 flex flex-col items-center text-center lg:flex-row lg:items-center lg:justify-between lg:text-left pt-44 sm:pt-40 lg:pt-36 pb-12 lg:pb-0 gap-12 lg:gap-0">
                {/* Left: Text Content */}
                <div className="max-w-[480px] flex-shrink-0">
                    <h1 className="font-mono font-bold text-[34px] sm:text-[44px] md:text-[52px] lg:text-[60px] leading-[120%] text-white mb-6">
                        <span ref={line1Ref} className="block">
                            {t('hero.line1')}
                        </span>
                        <span ref={line2Ref} className="block">
                            {t('hero.line2prefix')}{' '}
                            <span ref={rotatingRef} className="relative inline-block align-bottom" style={{ minWidth: '160px' }}>
                                {rotatingWords.map((word: string) => (
                                    <span
                                        key={word}
                                        className="rotating-word absolute left-0 top-0 whitespace-nowrap lg:left-0 w-full lg:w-auto"
                                        style={{ opacity: 0 }}
                                    >
                                        {word}
                                    </span>
                                ))}
                                {/* Invisible spacer to hold width */}
                                <span className="invisible">{rotatingWords[rotatingWords.length - 1]}</span>
                            </span>
                        </span>
                        {t('hero.line3') && (
                            <span ref={line3Ref} className="block">
                                {t('hero.line3')}
                            </span>
                        )}
                    </h1>
                    <p ref={subheadlineRef} className="font-satoshi font-medium text-base sm:text-lg leading-[130%] text-text-muted mb-8 sm:mb-10" style={{ opacity: 0 }}>
                        {t('hero.subheadline')}
                    </p>
                    <button
                        ref={ctaRef}
                        type="button"
                        className="btn-gradient inline-block font-mono text-sm font-extrabold tracking-[2px] uppercase text-white px-8 py-4 rounded-lg transition-all duration-200 cursor-pointer border-0"
                        data-cta="hero"
                        onClick={() => {
                            trackCtaClicked({ cta_text: t('floatingButton.label'), cta_location: 'hero', destination: 'film' })
                            onWatchFilm?.()
                        }}
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
                        {t('floatingButton.label')}
                    </button>
                </div>
            </div>
        </section>
    )
}
