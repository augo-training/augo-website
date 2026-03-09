import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import tobiasPhoto from '../assets/images/Tobias.png'
import mikaelPhoto from '../assets/images/Mikael.png'
import jazminePhoto from '../assets/images/Jazmine.png'
import manuelPhoto from '../assets/images/Manuel.png'
import marcoPhoto from '../assets/images/Marco.webp'
import brianPhoto from '../assets/images/Brian.png'

gsap.registerPlugin(ScrollTrigger)

interface Testimonial {
    quote: string
    name: string
    role: string
    photo: string
}

const testimonials: Testimonial[] = [
    {
        quote:
            'augo brings together workout data and athlete feedback in a simple overview that makes staying in tune with remote athletes effortless. In a world where wearables pretend to know better than the athlete, augo feels like fresh air — the only AI coaching platform that truly understands the coach-athlete relationship.',
        name: 'Marco Altini',
        role: 'Ultra & Trail-Running Coach',
        photo: marcoPhoto,
    },
    {
        quote:
            'As a coach, augo is a game-changer in my communication with my athletes, making sure I never miss anything and always understand the full context of each message or comment.',
        name: 'Mikael Eriksson',
        role: 'Founder | Scientific Triathlon',
        photo: mikaelPhoto,
    },
    {
        quote:
            'Coaching is about the human connection, and augo protects and enhances that. It handles the operational clutter so I can focus entirely on my athletes. That means more time for check-ins, stronger 1-on-1 feedback, and the confidence that nothing falls through the cracks.',
        name: 'Brian Boisvert',
        role: 'Running Coach',
        photo: brianPhoto,
    },
    {
        quote:
            'With augo, I track specific metrics related to RED-S, like carbohydrates consumed and perceived energy levels during sessions. This helps illuminate patterns and prevent low energy.',
        name: 'Jazmine Lowther',
        role: 'Pro Trail Runner & Coach',
        photo: jazminePhoto,
    },
    {
        quote:
            'A training program is only as strong as the communication between coach and athlete. augo bridges the gap that arises from remote coaching, allowing coaches to truly coach.',
        name: 'Tobias Haumann',
        role: 'Coach | Scientific Triathlon',
        photo: tobiasPhoto,
    },
    {
        quote:
            'Throughout nearly 20 years of coaching, I\'ve needed a tool that lets me stay connected and truly present for the people I coach. augo is that tool. It finally exists.',
        name: 'Manuel Wyss',
        role: 'Triathlon Coach',
        photo: manuelPhoto,
    },
]

export default function TestimonialsSection() {
    const sectionRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const headlineRef = useRef<HTMLHeadingElement>(null)
    const cardRefs = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        // Reduced motion check
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches
        if (prefersReducedMotion) return

        const section = sectionRef.current
        const track = trackRef.current
        const headline = headlineRef.current
        if (!section || !track || !headline) return

        const isMobile = window.innerWidth < 768
        const slideDistance = isMobile ? 15 : 20

        // --- Headline animation via IntersectionObserver ---
        // Using IntersectionObserver instead of ScrollTrigger because the carousel's
        // pin: true distorts ScrollTrigger coordinate calculations.
        gsap.set(headline, { opacity: 0, y: slideDistance })
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
                        observer.disconnect()
                    }
                })
            },
            { threshold: 0.2 }
        )
        observer.observe(headline)

        // --- Horizontal scroll ---
        const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[]

        const getScrollDistance = () => track.scrollWidth - window.innerWidth

        const scrollTween = gsap.to(track, {
            x: () => -getScrollDistance(),
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: () => `+=${getScrollDistance()}`,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
                anticipatePin: 1,
            },
        })

        // --- Active / Inactive card states ---
        const updateCards = () => {
            const sectionRect = section.getBoundingClientRect()
            const centerX = sectionRect.left + sectionRect.width / 2

            cards.forEach((card) => {
                const cardRect = card.getBoundingClientRect()
                const cardCenter = cardRect.left + cardRect.width / 2
                const distance = Math.abs(centerX - cardCenter)
                const maxDistance = window.innerWidth / 2

                const progress = Math.min(distance / maxDistance, 1)
                const opacity = 1 - progress * 0.5 // 1 → 0.5
                const scale = 1 - progress * 0.1   // 1 → 0.9

                gsap.set(card, {
                    opacity,
                    scale,
                })
            })
        }

        // Run on scroll
        ScrollTrigger.addEventListener('refresh', updateCards)
        const onScroll = () => requestAnimationFrame(updateCards)
        window.addEventListener('scroll', onScroll, { passive: true })
        updateCards()

        return () => {
            scrollTween.scrollTrigger?.kill()
            scrollTween.kill()
            ScrollTrigger.removeEventListener('refresh', updateCards)
            window.removeEventListener('scroll', onScroll)
            observer.disconnect()
        }
    }, [])

    return (
        <section
            ref={sectionRef}
            className="testimonials-section relative w-full flex flex-col justify-center gap-12 overflow-hidden"
            style={{
                minHeight: '100vh',
                background: `
                    linear-gradient(to bottom, #090909 0%, transparent 20%),
                    linear-gradient(to top, #090909 0%, transparent 20%),
                    radial-gradient(ellipse at 0% 100%, #090909 0%, transparent 50%),
                    radial-gradient(ellipse at 100% 0%, #090909 0%, transparent 50%),
                    radial-gradient(ellipse at 50% 60%, #C50017 0%, #8B0000 35%, #561d09ff 60%, #151515 100%)
                `,
            }}
        >
            {/* Headline */}
            <h2
                ref={headlineRef}
                className="font-mono font-bold text-[36px] sm:text-[48px] md:text-[56px] lg:text-[64px] leading-[130%] text-white px-5 sm:px-8 md:px-16"
                style={{
                    maxWidth: '1200px',
                    marginLeft: 'max(1.25rem, calc((100vw - 1200px) / 2))',
                }}
            >
                What coaches
                <br />
                say about augo
            </h2>

            {/* Carousel container */}
            <div className="testimonials-carousel-wrapper relative w-full">

                {/* Card track */}
                <div
                    ref={trackRef}
                    className="flex items-stretch gap-4 sm:gap-6 md:gap-8 will-change-transform"
                    style={{
                        paddingLeft: 'max(1.25rem, calc((100vw - 1200px) / 2))',
                    }}
                >
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            ref={(el) => { cardRefs.current[i] = el }}
                            className="testimonial-card flex-shrink-0 bg-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between w-[320px] sm:w-[380px] md:w-[420px]"
                            style={{
                                minHeight: '320px',
                                transition: 'opacity 300ms ease-out, transform 300ms ease-out',
                            }}
                        >
                            {/* Quote */}
                            <p
                                className={`font-satoshi font-medium leading-[130%] mb-6 sm:mb-8 ${t.quote.length > 200
                                        ? 'text-[14px] sm:text-[16px] md:text-[20px]'
                                        : 'text-[16px] sm:text-[20px] md:text-[24px]'
                                    }`}
                                style={{ color: '#151515' }}
                            >
                                {t.quote}
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3 mt-auto">
                                {/* Avatar */}
                                <img
                                    src={t.photo}
                                    alt={t.name}
                                    className="flex-shrink-0 rounded-lg object-cover w-10 h-10 sm:w-12 sm:h-12 grayscale"
                                />
                                <div className="flex flex-col">
                                    <span
                                        className="font-mono font-extrabold text-[16px] sm:text-[18px] md:text-[22px] leading-[130%]"
                                        style={{ color: '#151515' }}
                                    >
                                        {t.name}
                                    </span>
                                    <span
                                        className="font-satoshi font-medium text-[14px] sm:text-[16px] md:text-[18px] leading-[130%]"
                                        style={{ color: '#48494B' }}
                                    >
                                        {t.role}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Invisible spacer to mirror the left padding at the end */}
                    <div
                        aria-hidden="true"
                        className="flex-shrink-0"
                        style={{ width: 'max(1.25rem, calc((100vw - 1200px) / 2))' }}
                    />
                </div>
            </div>
        </section>
    )
}
