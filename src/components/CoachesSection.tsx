import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import coachesImg1 from '../assets/images/img_section_coaches_1.webp'
import coachesImg2 from '../assets/images/img_section_coaches_2.webp'
import coachesImg3 from '../assets/images/img_section_coaches_3.webp'

gsap.registerPlugin(ScrollTrigger)

interface Panel {
    headline: string
    body: string
    tagline: string
    image: string
}

const panels: Panel[] = [
    {
        headline: 'Instant insights\nwith full athlete context',
        body: 'augo stores and remembers every athlete conversation, session feedback, and workout data. Ask the intelligent assistant anything and get instant answers with full athlete context.',
        tagline:
            'No more searching through buried calendar notes or scrolling through messages histories to remember when your athlete mentioned that knee discomfort.',
        image: coachesImg1,
    },
    {
        headline: 'Know exactly who\nneeds you today',
        body: 'augo surfaces the athletes who need attention right now: early warning signs from training data & session feedback, schedule changes requests, sessions flagged for review, key moments where your input matters most.',
        tagline: 'Start each day with clarity & focus.',
        image: coachesImg2,
    },
    {
        headline: 'Know how your\nathletes really feel',
        body: 'augo captures post-session feedback, providing the coach visibility on long-term wellbeing trends, helping you spot subtle changes that signal challenges ahead.',
        tagline:
            'Catch fatigue, motivation dips, or early injury signs while there\'s still time to act.',
        image: coachesImg3,
    },
]

export default function CoachesSection() {
    const sectionRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const panelRefs = useRef<(HTMLDivElement | null)[]>([])
    const headlineRefs = useRef<(HTMLHeadingElement | null)[]>([])
    const bodyRefs = useRef<(HTMLDivElement | null)[]>([])
    const imageRefs = useRef<(HTMLDivElement | null)[]>([])
    const glowRefs = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches
        if (prefersReducedMotion) return

        const section = sectionRef.current
        const track = trackRef.current
        if (!section || !track) return

        // -- Calculate scroll distance --
        const panelWidth = window.innerWidth
        const totalWidth = panelWidth * panels.length
        const scrollDistance = totalWidth - panelWidth // 2 panels worth of scroll

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

        headlines.forEach((headline, i) => {
            // Skip first panel — it should be visible from the start
            if (i === 0) {
                gsap.set(headline, { opacity: 1, y: 0 })
                gsap.set(bodies[i], { opacity: 1 })
                return
            }

            gsap.set(headline, { opacity: 0, y: 20 })
            gsap.set(bodies[i], { opacity: 0 })

            // Trigger when panel enters viewport from the right
            const panelEl = panelRefs.current[i]
            if (!panelEl) return

            ScrollTrigger.create({
                trigger: panelEl,
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
                    gsap.set(headline, { opacity: 0, y: 20 })
                    gsap.set(bodies[i], { opacity: 0 })
                },
            })
        })

        // -- Floating image animation --
        const images = imageRefs.current.filter(Boolean) as HTMLElement[]
        const floatTweens = images.map((img, i) => {
            const duration = 5 + i * 0.5 // slightly different speeds for depth
            return gsap.to(img, {
                y: '+=5',
                duration,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
            })
        })

        // -- Gradient glow pulse --
        const glows = glowRefs.current.filter(Boolean) as HTMLElement[]
        const glowTweens = glows.map((glow) =>
            gsap.to(glow, {
                opacity: 1,
                duration: 1.5,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
            })
        )

        return () => {
            scrollTween.scrollTrigger?.kill()
            scrollTween.kill()
            floatTweens.forEach((t) => t.kill())
            glowTweens.forEach((t) => t.kill())
            // Kill all text-reveal ScrollTriggers
            ScrollTrigger.getAll().forEach((st) => {
                if (st.vars.containerAnimation === scrollTween) {
                    st.kill()
                }
            })
        }
    }, [])

    return (
        <section
            ref={sectionRef}
            id="coaches"
            className="relative w-full overflow-hidden"
            style={{ height: '100vh' }}
        >
            {/* Horizontal track — all panels side by side */}
            <div
                ref={trackRef}
                className="flex will-change-transform"
                style={{ width: `${panels.length * 100}vw` }}
            >
                {panels.map((panel, i) => (
                    <div
                        key={i}
                        ref={(el) => { panelRefs.current[i] = el }}
                        className="flex-shrink-0 flex items-center justify-center"
                        style={{
                            width: '100vw',
                            height: '100vh',
                        }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-20 items-center w-full max-w-[1200px] mx-auto px-8">
                            {/* Left: Text Content */}
                            <div className="flex flex-col col-span-1 md:col-span-5">
                                {/* Tag */}
                                <div className="flex items-center gap-2 mb-24">
                                    <span className="font-satoshi font-black italic text-[18px] leading-[100%] tracking-[4px] text-[#969EA7]">
                                        ///////
                                    </span>
                                    <span className="font-mono italic font-normal text-[18px] leading-[100%] tracking-[2px] text-[#969EA7] uppercase">
                                        FOR COACHES
                                    </span>
                                </div>

                                <div className="flex flex-col gap-8">
                                    {/* Headline */}
                                    <h2
                                        ref={(el) => { headlineRefs.current[i] = el }}
                                        className="font-satoshi font-bold text-[40px] leading-[130%] text-white"
                                    >
                                        {panel.headline.split('\n').map((line, j) => (
                                            <span key={j}>
                                                {line}
                                                {j < panel.headline.split('\n').length - 1 && <br />}
                                            </span>
                                        ))}
                                    </h2>

                                    {/* Body Text */}
                                    <div
                                        ref={(el) => { bodyRefs.current[i] = el }}
                                        className="flex flex-col gap-6"
                                    >
                                        <p className="font-satoshi font-medium text-[18px] leading-[130%] text-[#969EA7]">
                                            {panel.body}
                                        </p>
                                        <p className="font-satoshi font-medium italic text-[18px] leading-[130%] text-[#969EA7]">
                                            {panel.tagline}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Image with glow */}
                            <div className="relative flex justify-end col-span-1 md:col-span-7 w-full">
                                {/* Gradient glow behind image */}
                                <div
                                    ref={(el) => { glowRefs.current[i] = el }}
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                        opacity: 0.7,
                                        background:
                                            'radial-gradient(ellipse at center, rgba(197, 0, 23, 0.3) 0%, transparent 70%)',
                                    }}
                                />
                                {/* Floating image */}
                                <div
                                    ref={(el) => { imageRefs.current[i] = el }}
                                    className="relative w-full"
                                >
                                    <img
                                        src={panel.image}
                                        alt={`Coaches Interface ${i + 1}`}
                                        className="rounded-2xl w-full h-auto object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
