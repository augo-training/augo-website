import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import { trackCtaClicked } from '../utils/analytics'
import bgSection1 from '../assets/images/bg_section_1.webp'
import imgScreen from '../assets/images/app_session_details.png?w=1400&format=webp'
import imgScreen2x from '../assets/images/app_session_details.png?w=2400&format=webp'
import imgAssistant from '../assets/images/app_assistant_empty.png?w=600&format=webp'
import imgAssistant2x from '../assets/images/app_assistant_empty.png?w=900&format=webp'

const WORD_DURATION = 3 // seconds each word is visible
const FADE_DURATION = 0.4 // seconds for fade in/out

interface HeroProps {
    /** Called on "Watch the film" click — gates behind email capture and plays the film. */
    onWatchFilm?: () => void
}

interface IPhoneProps {
    className: string
    src: string
    src2x: string
    alt: string
    style: React.CSSProperties
}

/** CSS iPhone frame — titanium rim, side buttons and Dynamic Island around a 393×852 screen. */
function IPhone({ className, src, src2x, alt, style }: IPhoneProps) {
    const button = (side: 'left' | 'right', top: string, height: string) => (
        <div
            className="absolute"
            style={{
                [side]: '-2.5%',
                top,
                width: '2%',
                height,
                borderRadius: side === 'left' ? '2px 0 0 2px' : '0 2px 2px 0',
                background: '#2c2c2e',
            }}
        />
    )
    return (
        <div className={`${className} absolute`} style={style}>
            <div
                className="relative"
                style={{
                    padding: '3.2%',
                    borderRadius: '16% / 7.4%',
                    background: 'linear-gradient(145deg, #3a3a3d 0%, #1c1c1e 45%, #121214 100%)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    boxShadow: 'inset 0 0 0 2px #050505, 0 30px 80px -20px rgba(0,0,0,0.85)',
                }}
            >
                {/* Action, volume and side buttons */}
                {button('left', '17%', '5%')}
                {button('left', '25%', '9%')}
                {button('left', '36%', '9%')}
                {button('right', '27%', '14%')}
                <div className="relative overflow-hidden" style={{ borderRadius: '13% / 6%', aspectRatio: '393 / 852' }}>
                    <img
                        src={src}
                        srcSet={`${src} 600w, ${src2x} 900w`}
                        sizes="(min-width: 1280px) 200px, (min-width: 1024px) 135px, 32vw"
                        alt={alt}
                        className="block w-full h-full"
                    />
                    {/* Dynamic Island */}
                    <div className="absolute left-1/2 -translate-x-1/2" style={{ top: '1.4%', width: '32%', height: '3.6%', borderRadius: '999px', background: '#000' }} />
                </div>
            </div>
        </div>
    )
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
    const mockupsRef = useRef<HTMLDivElement>(null)
    const glowRef = useRef<HTMLDivElement>(null)

    // Mouse position for glow follow (using refs to avoid re-renders)
    const mousePos = useRef({ x: 0, y: 0 })
    const glowPos = useRef({ x: 0, y: 0 })
    const rafId = useRef<number>(0)
    const isMouseInSection = useRef(false)

    useEffect(() => {
        const lines = [line1Ref.current, line2Ref.current, line3Ref.current].filter(Boolean) as HTMLElement[]
        const subheadline = subheadlineRef.current
        const rotatingContainer = rotatingRef.current
        const cta = ctaRef.current
        const section = sectionRef.current
        const mockups = mockupsRef.current
        const glow = glowRef.current
        if (lines.length === 0 || !subheadline || !rotatingContainer || !cta || !section || !mockups || !glow) return

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

        // 5. Mockups — laptop and phone rise in on entrance, then float at different speeds for depth
        const laptop = mockups.querySelector<HTMLElement>('.mockup-laptop')
        const phone = mockups.querySelector<HTMLElement>('.mockup-phone')
        const devices = [laptop, phone].filter(Boolean) as HTMLElement[]
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        // Tracked so they can be killed on cleanup — the effect re-runs on language change
        const floatTweens: gsap.core.Tween[] = []
        let entranceTween: gsap.core.Tween | null = null
        let driftTl: gsap.core.Timeline | null = null

        const startFloats = () => {
            const floats: [HTMLElement | null, number, number][] = [
                [laptop, -8, 6.5],
                [phone, -11, 5.8],
            ]
            floats.forEach(([el, y, duration]) => {
                if (!el) return
                floatTweens.push(gsap.to(el, { y, duration, ease: 'sine.inOut', yoyo: true, repeat: -1 }))
            })
        }

        if (devices.length > 0 && !prefersReducedMotion) {
            gsap.set(devices, { opacity: 0, scale: 0.94, y: 28 })
            entranceTween = gsap.to(devices, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.9,
                ease: 'power3.out',
                stagger: 0.12,
                delay: 0.35,
                onComplete: startFloats,
            })
        }

        const killMockupTweens = () => {
            entranceTween?.kill()
            floatTweens.forEach((tween) => tween.kill())
            driftTl?.kill()
        }

        // 6. Glow mouse-follow (desktop) — set up event listeners
        const isMobile = window.matchMedia('(max-width: 768px)').matches

        if (isMobile) {
            // Mobile: simple ambient drift behind mockups
            gsap.set(glow, { opacity: 0.7 })
            driftTl = gsap.timeline({ repeat: -1, yoyo: true })
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
                killMockupTweens()
                section.removeEventListener('mousemove', handleMouseMove)
                section.removeEventListener('mouseenter', handleMouseEnter)
                section.removeEventListener('mouseleave', handleMouseLeave)
                cancelAnimationFrame(rafId.current)
            }
        }

        return () => {
            tl.kill()
            rotateTl.kill()
            killMockupTweens()
            cancelAnimationFrame(rafId.current)
        }
    }, [i18n.language]) // eslint-disable-line react-hooks/exhaustive-deps

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

                {/* Right: Laptop mockup */}
                <div ref={mockupsRef} className="relative z-10 w-full max-w-[340px] sm:max-w-[440px] md:max-w-[620px] lg:w-[420px] xl:w-[620px] lg:max-w-none flex-shrink-0" style={{ perspective: '1400px', paddingBottom: '6%' }}>
                    {/* Static gradient glow behind the laptop — warm core behind the screen */}
                    <div
                        className="absolute pointer-events-none"
                        style={{
                            width: '100%',
                            height: '100%',
                            top: '45%',
                            left: '55%',
                            transform: 'translate(-50%, -50%)',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(255,202,30,0.5) 0%, rgba(255,85,20,0.3) 35%, rgba(197,0,23,0.15) 65%, transparent 100%)',
                            filter: 'blur(50px)',
                            zIndex: 0,
                        }}
                    />
                    {/* Low wash beneath the base */}
                    <div
                        className="absolute pointer-events-none"
                        style={{
                            width: '120%',
                            height: '50%',
                            top: '90%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(255,202,30,0.4) 0%, rgba(255,85,20,0.25) 35%, rgba(197,0,23,0.12) 65%, transparent 100%)',
                            filter: 'blur(50px)',
                            zIndex: 0,
                        }}
                    />
                    <div className="mockup-laptop relative" style={{ zIndex: 1 }}>
                        {/* Lid — black bezel around the screen, camera notch at the top */}
                        <div
                            className="relative"
                            style={{
                                padding: '2.2% 2.2% 2.6%',
                                borderRadius: '3.2% / 4.2%',
                                background: 'linear-gradient(180deg, #1c1c1e 0%, #0b0b0c 100%)',
                                border: '1px solid rgba(255,255,255,0.14)',
                                boxShadow: 'inset 0 0 0 2px #050505, 0 40px 90px -30px rgba(0,0,0,0.85)',
                            }}
                        >
                            <div
                                className="absolute left-1/2 -translate-x-1/2"
                                style={{ top: '0.9%', width: '1%', aspectRatio: '1', borderRadius: '50%', background: '#1f2a33', boxShadow: '0 0 0 1px #000' }}
                            />
                            <div className="overflow-hidden" style={{ borderRadius: '0.6%', background: '#090909', aspectRatio: '1512 / 982' }}>
                                <img
                                    src={imgScreen}
                                    srcSet={`${imgScreen} 1400w, ${imgScreen2x} 2400w`}
                                    sizes="(min-width: 1280px) 600px, (min-width: 1024px) 400px, 90vw"
                                    alt="augo web app: session details with pace, heart rate and cadence zones and athlete feedback"
                                    className="block w-full h-full"
                                    style={{ objectFit: 'cover', objectPosition: 'top' }}
                                />
                            </div>
                        </div>
                        {/* Base — aluminium deck, wider than the lid, with the thumb notch */}
                        <div
                            className="relative w-[106%] -ml-[3%] sm:w-[114%] sm:-ml-[7%]"
                            style={{
                                height: 0,
                                paddingBottom: '3.4%',
                                borderRadius: '0 0 12% 12% / 0 0 100% 100%',
                                background: 'linear-gradient(180deg, #d9d9dc 0%, #a7a7ab 35%, #6e6e73 70%, #3a3a3d 100%)',
                                boxShadow: '0 18px 30px -12px rgba(0,0,0,0.8)',
                            }}
                        >
                            <div
                                className="absolute left-1/2 -translate-x-1/2 top-0"
                                style={{ width: '15%', height: '45%', borderRadius: '0 0 10px 10px / 0 0 6px 6px', background: 'linear-gradient(180deg, #8d8d92 0%, #b9b9bd 100%)' }}
                            />
                        </div>
                    </div>
                    {/* iPhone on the left, keeping the athlete feedback panel visible */}
                    <IPhone
                        className="mockup-phone left-[-4%] xl:left-[-24%]"
                        src={imgAssistant}
                        src2x={imgAssistant2x}
                        alt="augo AI assistant on iPhone"
                        style={{ width: '32%', bottom: 0, zIndex: 3, transform: 'rotateY(6deg) rotate(-1.5deg)' }}
                    />
                </div>
            </div>
        </section>
    )
}
