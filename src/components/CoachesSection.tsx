import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import coachesImg1_1 from '../assets/images/img_section_coaches_1_1.png'
import coachesImg1_2 from '../assets/images/img_section_coaches_1_2.png'
import coachesImg1_3 from '../assets/images/img_section_coaches_1_3.png'
import coachesImg1_4 from '../assets/images/img_section_coaches_1_4.png'
import coachesImg1_5 from '../assets/images/img_section_coaches_1_5.png'
import coachesImg1_6 from '../assets/images/img_section_coaches_1_6.png'
import coachesImg1_7 from '../assets/images/img_section_coaches_1_7.png'
import carouselImgBg from '../assets/images/carousel_img_bg.webp'
import coachesImg2_1 from '../assets/images/img_section_coaches_2_1.png'
import coachesImg2_2 from '../assets/images/img_section_coaches_2_2.png'
import coachesImg3_1 from '../assets/images/img_section_coaches_3_1.png'
import coachesImg3_2 from '../assets/images/img_section_coaches_3_2.png'

gsap.registerPlugin(ScrollTrigger)

interface PanelImage {
    src: string
    className?: string
}

interface Panel {
    headline: string
    body: string
    tagline: string
    image?: string
    images?: PanelImage[]
}

const panels: Panel[] = [
    {
        headline: 'Instant insights\nwith full athlete context',
        body: 'augo stores and remembers every athlete conversation, session feedback, and workout data. Ask the intelligent assistant anything and get instant answers with full athlete context.',
        tagline:
            'No more searching through buried calendar notes or scrolling through messages histories to remember when your athlete mentioned that knee discomfort.',
        images: [
            // Background card — base layer, centered
            { src: carouselImgBg, className: 'absolute inset-0 m-auto w-auto h-[80%] rounded-2xl opacity-30' },
            // User bubble 1: "How is Sarah recovering..." — top right
            { src: coachesImg1_1, className: 'absolute top-[6%] right-[18%] w-[55%] z-10' },
            // User avatar 1 — next to first user bubble
            { src: coachesImg1_7, className: 'absolute top-[6%] right-[10%] w-[5%] z-10' },
            // AI bubble 1: "She's trending well..." — left side
            { src: coachesImg1_2, className: 'absolute top-[16%] left-[12%] w-[52%] z-10' },
            // AI bubble 2: "In chat, she mentioned..." — left side
            { src: coachesImg1_3, className: 'absolute top-[36%] left-[12%] w-[52%] z-10' },
            // Augo icon 1 — beside AI bubble 2 (bottom-left)
            { src: coachesImg1_4, className: 'absolute top-[48%] left-[5%] w-[4.5%] z-10' },
            // User bubble 2: "Is she feeling ready..." — right side
            { src: coachesImg1_5, className: 'absolute top-[60%] right-[18%] w-[52%] z-10' },
            // User avatar 2 — next to second user bubble
            { src: coachesImg1_7, className: 'absolute top-[63%] right-[10%] w-[5%] z-10' },
            // AI bubble 3: "Signs point to yes..." — left side, bottom
            { src: coachesImg1_6, className: 'absolute top-[73%] left-[12%] w-[52%] z-10' },
            // Augo icon 2 — beside AI bubble 3 (bottom-left)
            { src: coachesImg1_4, className: 'absolute top-[84%] left-[5%] w-[4.5%] z-10' },
        ],
    },
    {
        headline: 'Know exactly who\nneeds you today',
        body: 'augo surfaces the athletes who need attention right now: early warning signs from training data & session feedback, schedule changes requests, sessions flagged for review, key moments where your input matters most.',
        tagline: 'Start each day with clarity & focus.',
        images: [
            // Background glow
            { src: carouselImgBg, className: 'absolute inset-0 m-auto w-auto h-[80%] rounded-2xl opacity-30' },
            // Assistant card — upper area
            { src: coachesImg2_1, className: 'absolute top-[15%] left-[30%] w-[50%] z-10' },
            // Tasks list — lower area
            { src: coachesImg2_2, className: 'absolute top-[60%] left-[15%] w-[65%] z-10' },
        ],
    },
    {
        headline: 'Know how your\nathletes really feel',
        body: 'augo captures post-session feedback, providing the coach visibility on long-term wellbeing trends, helping you spot subtle changes that signal challenges ahead.',
        tagline:
            'Catch fatigue, motivation dips, or early injury signs while there\'s still time to act.',
        images: [
            // Background glow
            { src: carouselImgBg, className: 'absolute inset-0 m-auto w-auto h-[80%] rounded-2xl opacity-30' },
            // Feeling chart — upper area
            { src: coachesImg3_1, className: 'absolute top-[15%] left-[18%] w-[50%] z-10' },
            // Aches & pains chart — lower area, slightly offset
            { src: coachesImg3_2, className: 'absolute top-[53%] left-[32%] w-[50%] z-10' },
        ],
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

        const isMobile = window.innerWidth < 768
        const slideDistance = isMobile ? 15 : 20

        const section = sectionRef.current
        const track = trackRef.current
        if (!section || !track) return

        // -- Calculate scroll distance --
        const getScrollDistance = () => window.innerWidth * (panels.length - 1) // 2 panels worth of scroll

        // -- Main horizontal scroll with pin --
        const scrollTween = gsap.to(track, {
            x: () => -getScrollDistance(),
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: () => `+=${getScrollDistance()}`,
                pin: true,
                scrub: 0.5,
                invalidateOnRefresh: true,
                anticipatePin: 1,
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
                                    duration: 4.2,
                                    ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
                                })
                                gsap.to(bodies[i], {
                                    opacity: 1,
                                    duration: 2,
                                    delay: 0.9,
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
                        duration: 2.2,
                        ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    })
                    gsap.to(bodies[i], {
                        opacity: 1,
                        duration: 2,
                        delay: 0.9,
                        ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    })
                },
                onLeaveBack: () => {
                    gsap.set(headline, { opacity: 0, y: slideDistance })
                    gsap.set(bodies[i], { opacity: 0 })
                },
            })
        })

        // -- Floating image animation: varied speeds & amplitudes per image for depth --
        const images = imageRefs.current.filter(Boolean) as HTMLElement[]
        const baseAmplitude = isMobile ? 2 : 4
        const floatTweens: gsap.core.Tween[] = []

        images.forEach((imgContainer, i) => {
            // Check if this panel has multiple images (children <img> inside the wrapper div)
            const childImages = imgContainer.querySelectorAll('img')

            if (childImages.length > 1) {
                // Animate each child image independently with varied params
                childImages.forEach((childImg, j) => {
                    // Vary amplitude: 70%-130% of base using sine spread
                    const amplitude = baseAmplitude * (1 + 0.3 * Math.sin(j * 2.1))
                    // Vary duration: 4s to 6.5s for noticeable but smooth desync
                    const duration = 5 + 1.5 * Math.cos(j * 1.7)
                    // Stagger start phase
                    const delay = j * 0.5

                    floatTweens.push(
                        gsap.fromTo(
                            childImg,
                            { y: -amplitude },
                            {
                                y: amplitude,
                                duration,
                                ease: 'sine.inOut',
                                yoyo: true,
                                repeat: -1,
                                delay,
                            }
                        )
                    )
                })
            } else {
                // Single image panel: animate the container as before
                const duration = 5 + i * 0.5
                floatTweens.push(
                    gsap.fromTo(
                        imgContainer,
                        { y: -baseAmplitude },
                        {
                            y: baseAmplitude,
                            duration,
                            ease: 'sine.inOut',
                            yoyo: true,
                            repeat: -1,
                        }
                    )
                )
            }
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
                        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-0 sm:gap-12 lg:gap-20 items-center w-full max-w-[1200px] mx-auto px-5 sm:px-6 md:px-8 lg:px-8 md:text-center lg:text-left overflow-y-auto max-h-[100vh] py-0 sm:py-20 lg:py-0 lg:overflow-visible lg:max-h-none">
                            {/* Left: Text Content */}
                            <div className="flex flex-col lg:col-span-5">
                                {/* Tag — visible only on lg+ (desktop) */}
                                <div className="hidden lg:flex items-center gap-2 mb-24">
                                    <span className="font-satoshi font-black italic text-[18px] leading-[100%] tracking-[4px] text-[#969EA7]">
                                        ///////
                                    </span>
                                    <span className="font-mono italic font-normal text-[18px] leading-[100%] tracking-[2px] text-[#969EA7] uppercase">
                                        FOR COACHES
                                    </span>
                                </div>

                                <div className="flex flex-col gap-6 sm:gap-8">
                                    {/* Headline */}
                                    <h2
                                        ref={(el) => { headlineRefs.current[i] = el }}
                                        className="font-satoshi font-bold text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] leading-[130%] text-white"
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
                                        className="flex flex-col gap-4 sm:gap-6"
                                    >
                                        <p className="font-satoshi font-medium text-[15px] sm:text-[16px] md:text-[17px] lg:text-[18px] leading-[130%] text-[#969EA7]">
                                            {panel.body}
                                        </p>
                                        <p className="font-satoshi font-medium italic text-[15px] sm:text-[16px] md:text-[17px] lg:text-[18px] leading-[130%] text-[#969EA7]">
                                            {panel.tagline}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Image with glow */}
                            <div className="relative flex justify-center lg:justify-end lg:col-span-7 w-full">
                                {/* Gradient glow behind image */}
                                <div
                                    ref={(el) => { glowRefs.current[i] = el }}
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                        opacity: 0.5,
                                        background:
                                            'radial-gradient(ellipse at center, rgba(200, 15, 37, 0.6) 0%, rgba(254, 95, 33, 0.2) 45%, transparent 75%)',
                                    }}
                                />
                                {/* Floating image(s) */}
                                <div
                                    ref={(el) => { imageRefs.current[i] = el }}
                                    className="relative w-full max-w-[500px] lg:max-w-none"
                                >
                                    {panel.images ? (
                                        <div className='relative rounded-2xl w-full h-[45vh] md:h-[55vh] lg:h-[70vh] overflow-hidden'>
                                            {panel.images.map((img, j) => (
                                                <img
                                                    key={j}
                                                    src={img.src}
                                                    alt={`Coaches Interface ${i + 1} - ${j + 1}`}
                                                    className={`object-cover ${img.className || ''}`}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <img
                                            src={panel.image}
                                            alt={`Coaches Interface ${i + 1}`}
                                            className="rounded-2xl w-full h-auto object-cover"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
