import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import athletesImg1 from '../assets/images/img_for_athletes_1.webp'
import athletesImg2 from '../assets/images/img_for_athletes_2.webp'
import athletesImg3 from '../assets/images/img_for_athletes_3.webp'

gsap.registerPlugin(ScrollTrigger)

interface Panel {
    headline: string
    body: string
    image: string
}

const panels: Panel[] = [
    {
        headline: 'Your dedicated\nspace to connect\nwith your coach',
        body: 'All messages, session feedbacks and workout data in one place—so you always feel supported, no matter where you are.',
        image: athletesImg1,
    },
    {
        headline: "Share how you're\nfeeling, not just\nhow you're\nperforming",
        body: "Log session feedback and share it seamlessly with your coach: energy level, pain, fueling, and how you're feeling. Help your coach understand the complete picture, not just the data coming from your watch.",
        image: athletesImg2,
    },
    {
        headline: "Track how\nyou're really\ndoing",
        body: "Your feedback isn't just logged: it's visible as trends for both you and your coach. Catch early warning signs together and stay ahead of burnout or injury.",
        image: athletesImg3,
    },
]

export default function AthletesSection() {
    const sectionRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const panelRefs = useRef<(HTMLDivElement | null)[]>([])
    const headlineRefs = useRef<(HTMLHeadingElement | null)[]>([])
    const bodyRefs = useRef<(HTMLParagraphElement | null)[]>([])
    const imageRefs = useRef<(HTMLDivElement | null)[]>([])
    const glowRefs = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches
        if (prefersReducedMotion) return

        const isMobile = window.innerWidth < 768
        const slideDistance = isMobile ? 15 : 20

        const section = sectionRef.current
        const track = trackRef.current
        if (!section || !track) return

        // -- Calculate scroll distance --
        const scrollDistance = window.innerWidth * (panels.length - 1)

        // -- Main horizontal scroll with pin --
        const scrollTween = gsap.to(track, {
            x: -scrollDistance,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: () => `+=${scrollDistance}`,
                pin: true,
                scrub: 0.5,
                invalidateOnRefresh: true,
            },
        })

        // -- Text reveal animations per panel --
        const headlines = headlineRefs.current.filter(Boolean) as HTMLElement[]
        const bodies = bodyRefs.current.filter(Boolean) as HTMLElement[]
        let panel0Observer: IntersectionObserver | undefined

        headlines.forEach((headline, i) => {
            gsap.set(headline, { opacity: 0, y: slideDistance })
            gsap.set(bodies[i], { opacity: 0 })

            // Panel 0: animate in via IntersectionObserver (immune to pin distortion)
            if (i === 0) {
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
                                gsap.to(bodies[i], {
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
                panel0Observer = observer
                return
            }


            const panel = panelRefs.current[i]
            if (!panel) return

            ScrollTrigger.create({
                trigger: panel,
                containerAnimation: scrollTween,
                start: 'left 80%',
                onEnter: () => {
                    gsap.to(headline, {
                        opacity: 1,
                        y: 0,
                        duration: 1.6,
                        ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    })
                    gsap.to(bodies[i], {
                        opacity: 1,
                        duration: 1,
                        delay: 0.3,
                        ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    })
                },
                onLeaveBack: () => {
                    gsap.set(headline, { opacity: 0, y: slideDistance })
                    gsap.set(bodies[i], { opacity: 0 })
                },
            })
        })

        // -- Floating image animation: ±12px centered, different speeds for depth --
        const images = imageRefs.current.filter(Boolean) as HTMLElement[]
        const floatAmplitude = isMobile ? 6 : 12
        const floatTweens = images.map((img, i) => {
            const duration = 5 + i * 0.5
            return gsap.fromTo(
                img,
                { y: -floatAmplitude },
                {
                    y: floatAmplitude,
                    duration,
                    ease: 'sine.inOut',
                    yoyo: true,
                    repeat: -1,
                }
            )
        })

        // -- Gradient glow pulse: 0.5 → 1.0 → 0.5, 3s cycle --
        const glows = glowRefs.current.filter(Boolean) as HTMLElement[]
        const glowTweens = glows.map((glow) =>
            gsap.fromTo(
                glow,
                { opacity: 0.5 },
                {
                    opacity: 1.0,
                    duration: 1.5,
                    ease: 'sine.inOut',
                    yoyo: true,
                    repeat: -1,
                }
            )
        )

        return () => {
            scrollTween.scrollTrigger?.kill()
            scrollTween.kill()
            floatTweens.forEach((t) => t.kill())
            glowTweens.forEach((t) => t.kill())
            panel0Observer?.disconnect()
        }
    }, [])

    return (
        <section
            ref={sectionRef}
            id="athletes"
            className="relative w-full overflow-hidden"
            style={{ height: '100vh' }}
        >
            {/* Fixed header — stays in place while cards scroll */}
            <div className="absolute top-0 left-0 right-0 z-10 flex flex-col items-center gap-6 pt-26 pb-4 pointer-events-none">
                {/* Tag */}
                <div className="flex items-center gap-2">
                    <span className="font-satoshi font-black italic text-[18px] leading-[100%] tracking-[4px] text-[#969EA7]">
                        ///////
                    </span>
                    <span className="font-mono italic font-normal text-[18px] leading-[100%] tracking-[2px] text-[#969EA7] uppercase">
                        FOR ATHLETES
                    </span>
                </div>

                {/* Headline */}
                <h2 className="font-mono font-bold text-[48px] leading-[130%] text-center text-white">
                    Everything your athletes need in
                    <br className="hidden md:block" />
                    {' '}one place
                </h2>
            </div>

            {/* Horizontal scroll track */}
            <div
                ref={trackRef}
                className="flex will-change-transform"
                style={{ width: `${panels.length * 100}vw` }}
            >
                {panels.map((panel, i) => (
                    <div
                        key={i}
                        ref={(el) => { panelRefs.current[i] = el }}
                        className="flex-shrink-0 flex flex-col justify-end px-8 pb-12"
                        style={{
                            width: '100vw',
                            height: '100vh',
                        }}
                    >
                        {/* Card with gradient background */}
                        <div
                            className="w-full max-w-[1200px] mx-auto rounded-2xl pl-8 md:pl-12"
                            style={{
                                background:
                                    'linear-gradient(14.48deg, #151515 -17.53%, #090909 79.83%)'
                            }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end h-full pb-6">
                                {/* Left: Text */}
                                <div className="flex flex-col gap-6 col-span-1 md:col-span-5">
                                    <h3
                                        ref={(el) => { headlineRefs.current[i] = el }}
                                        className="font-satoshi font-bold text-[48px] leading-[130%] text-white"
                                    >
                                        {panel.headline.split('\n').map((line, j) => (
                                            <span key={j}>
                                                {line}
                                                {j < panel.headline.split('\n').length - 1 && <br />}
                                            </span>
                                        ))}
                                    </h3>
                                    <p
                                        ref={(el) => { bodyRefs.current[i] = el }}
                                        className="font-satoshi font-medium text-[18px] leading-[130%] text-[#ACB1B7]"
                                    >
                                        {panel.body}
                                    </p>
                                </div>

                                {/* Right: Image with glow */}
                                <div className="relative col-span-1 md:col-span-7 flex justify-end">
                                    {/* Gradient glow behind image */}
                                    <div
                                        ref={(el) => { glowRefs.current[i] = el }}
                                        className="absolute inset-0 pointer-events-none"
                                        style={{
                                            opacity: 0.5,
                                            background:
                                                'radial-gradient(ellipse at center, rgba(197, 0, 23, 0.6) 0%, rgba(255, 85, 20, 0.2) 35%, transparent 55%)',
                                        }}
                                    />
                                    {/* Floating image */}
                                    <div
                                        ref={(el) => { imageRefs.current[i] = el }}
                                        className="relative w-full"
                                    >
                                        <img
                                            src={panel.image}
                                            alt={`Athletes Interface ${i + 1}`}
                                            className="rounded-2xl w-full h-auto object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
