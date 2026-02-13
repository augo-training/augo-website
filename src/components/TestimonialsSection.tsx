import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import testimonialPhoto from '../assets/images/testimonial_photo.png'

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
            'A training program is only as strong as the communication between coach and athlete. augo bridges the gap that arises from remote coaching, allowing coaches to truly coach.',
        name: 'Tobias Haumann',
        role: 'Coach | Scientific Triathlon',
        photo: testimonialPhoto,
    },
    {
        quote:
            'As a coach, augo is a game-changer in my communication with my athletes, making sure I never miss anything and always understand the full context of each message or comment.',
        name: 'Mikael Eriksson',
        role: 'Founder | Scientific Triathlon',
        photo: testimonialPhoto,
    },
    {
        quote:
            'With augo, I track specific metrics related to RED-S, like carbohydrates consumed and perceived energy during sessions. This helps illustrate patterns and prevent low energy availability.',
        name: 'Jazmine Lowther',
        role: 'Pro Trail Runner & Coach',
        photo: testimonialPhoto,
    },
    {
        quote:
            'Managing 30+ athletes used to mean endless scrolling through messages. augo gives me instant context on every athlete — it\'s like having a perfect memory.',
        name: 'Carlos Mendes',
        role: 'Head Coach | Endurance Lab',
        photo: testimonialPhoto,
    },
    {
        quote:
            'The AI assistant understands the nuances of endurance training. I can ask about an athlete\'s fatigue trends over the past month and get a meaningful answer in seconds.',
        name: 'Sophie Laurent',
        role: 'Coach | Tri Performance',
        photo: testimonialPhoto,
    },
    {
        quote:
            'Since switching to augo, my athletes feel more connected and supported. The platform keeps everything organized so I can focus on what I do best — coaching.',
        name: 'David Kim',
        role: 'Cycling Coach | Velo Elite',
        photo: testimonialPhoto,
    },
    {
        quote:
            'augo transformed how I handle athlete feedback. Instead of lost notes and forgotten details, everything is searchable and contextualized. It\'s a must-have for any serious coach.',
        name: 'Anna Fischer',
        role: 'Triathlon Coach | SwimBikeRun',
        photo: testimonialPhoto,
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

        // --- Headline animation ---
        gsap.fromTo(
            headline,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 1.6,
                ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
                scrollTrigger: {
                    trigger: headline,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
            }
        )

        // --- Horizontal scroll ---
        const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[]
        const viewportWidth = window.innerWidth
        const scrollDistance = track.scrollWidth - viewportWidth

        const scrollTween = gsap.to(track, {
            x: -scrollDistance,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: () => `+=${scrollDistance}`,
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
                const maxDistance = viewportWidth / 2

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
                className="font-mono font-bold text-[64px] leading-[130%] text-white px-8 md:px-16"
                style={{ maxWidth: '1200px', marginLeft: 'max(2rem, calc((100vw - 1200px) / 2))' }}
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
                    className="flex items-stretch gap-8 will-change-transform"
                    style={{
                        paddingLeft: 'max(2rem, calc((100vw - 1200px) / 2))',
                    }}
                >
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            ref={(el) => { cardRefs.current[i] = el }}
                            className="testimonial-card flex-shrink-0 bg-white rounded-2xl p-8 flex flex-col justify-between"
                            style={{
                                width: '420px',
                                minHeight: '320px',
                                transition: 'opacity 300ms ease-out, transform 300ms ease-out',
                            }}
                        >
                            {/* Quote */}
                            <p
                                className="font-satoshi font-medium text-[24px] leading-[130%] mb-8"
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
                                    className="flex-shrink-0 rounded-lg object-cover"
                                    style={{ width: '48px', height: '48px' }}
                                />
                                <div className="flex flex-col">
                                    <span
                                        className="font-mono font-extrabold text-[22px] leading-[130%]"
                                        style={{ color: '#151515' }}
                                    >
                                        {t.name}
                                    </span>
                                    <span
                                        className="font-satoshi font-medium text-[18px] leading-[130%]"
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
                        style={{ width: 'max(2rem, calc((100vw - 1200px) / 2))' }}
                    />
                </div>
            </div>
        </section>
    )
}
