import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import athletesImg1_1 from '../assets/images/img_for_athletes_1_1.png'
import athletesImg1_2 from '../assets/images/img_for_athletes_1_2.png'
import athletesImg1_3 from '../assets/images/img_for_athletes_1_3.png'
import athletesImg1_4 from '../assets/images/img_for_athletes_1_4.png'
import athletesImg1_5 from '../assets/images/img_for_athletes_1_5.png'
import athletesImg1_6 from '../assets/images/img_for_athletes_1_6.png'
import athletesImg2_1 from '../assets/images/img_for_athletes_2_1.png'
import athletesImg2_2 from '../assets/images/img_for_athletes_2_2.png'
import athletesImg2_3 from '../assets/images/img_for_athletes_2_3.png'
import athletesImg3_1 from '../assets/images/img_for_athletes_3_1.png'
import athletesImg3_2 from '../assets/images/img_for_athletes_3_2.png'
import athletesImg3_3 from '../assets/images/img_for_athletes_3_3.png'

gsap.registerPlugin(ScrollTrigger)

interface PanelImage {
    src: string
    className?: string
}

const panelImages: PanelImage[][] = [
    [
        { src: athletesImg1_2, className: 'absolute top-[7%] left-[12%] w-[55%] z-10' },
        { src: athletesImg1_3, className: 'grayscale absolute top-[78%] left-[5%] w-[5%] z-10' },
        { src: athletesImg1_4, className: 'absolute top-[22%] left-[12%] w-[52%] z-10' },
        { src: athletesImg1_5, className: 'absolute top-[40%] right-[18%] w-[52%] z-10' },
        { src: athletesImg1_3, className: 'absolute top-[32%] left-[5%] w-[5%] z-10' },
        { src: athletesImg1_6, className: 'absolute top-[62%] left-[12%] w-[52%] z-10' },
        { src: athletesImg1_1, className: 'grayscale absolute top-[56%] right-[10%] w-[5%] z-10' },
    ],
    [
        { src: athletesImg2_1, className: 'absolute top-[7%] lg:top-[7%] md:top-[10%] left-[10%] w-[45%] z-10' },
        { src: athletesImg2_2, className: 'absolute top-[20%] lg:top-[15%] md:top-[20%] right-[5%] w-[38%] z-10' },
        { src: athletesImg2_3, className: 'absolute top-[45%] lg:top-[45%] md:top-[55%] left-[10%] w-[45%] z-10' },
    ],
    [
        { src: athletesImg3_1, className: 'absolute top-[1%] left-[15%] w-[48%] z-10' },
        { src: athletesImg3_2, className: 'absolute top-[30%] right-[1%] w-[48%] z-10' },
        { src: athletesImg3_3, className: 'absolute top-[50%] left-[8%] w-[48%] z-10' },
    ],
]

export default function AthletesSection() {
    const { t } = useTranslation()
    const panels = t('athletes.panels', { returnObjects: true }) as Array<{
        headline: string
        body: string
    }>

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

        const getScrollDistance = () => window.innerWidth * (panels.length - 1)

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

        const headlines = headlineRefs.current.filter(Boolean) as HTMLElement[]
        const bodies = bodyRefs.current.filter(Boolean) as HTMLElement[]
        let panel0Observer: IntersectionObserver | undefined

        headlines.forEach((headline, i) => {
            gsap.set(headline, { opacity: 0, y: slideDistance })
            gsap.set(bodies[i], { opacity: 0 })

            if (i === 0) {
                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                gsap.to(headline, {
                                    opacity: 1, y: 0, duration: 4.2,
                                    ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
                                })
                                gsap.to(bodies[i], {
                                    opacity: 1, duration: 3, delay: 1.5,
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
                        opacity: 1, y: 0, duration: 4.2,
                        ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    })
                    gsap.to(bodies[i], {
                        opacity: 1, duration: 3, delay: 1,
                        ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    })
                },
                onLeaveBack: () => {
                    gsap.set(headline, { opacity: 0, y: slideDistance })
                    gsap.set(bodies[i], { opacity: 0 })
                },
            })
        })

        const images = imageRefs.current.filter(Boolean) as HTMLElement[]
        const baseAmplitude = isMobile ? 2 : 4
        const floatTweens: gsap.core.Tween[] = []

        images.forEach((imgContainer, i) => {
            const childImages = imgContainer.querySelectorAll('img')

            if (childImages.length > 1) {
                childImages.forEach((childImg, j) => {
                    const amplitude = baseAmplitude * (1 + 0.3 * Math.sin(j * 2.1))
                    const duration = 5 + 1.5 * Math.cos(j * 1.7)
                    const delay = j * 0.5

                    floatTweens.push(
                        gsap.fromTo(childImg, { y: -amplitude }, {
                            y: amplitude, duration, ease: 'sine.inOut',
                            yoyo: true, repeat: -1, delay,
                        })
                    )
                })
            } else {
                const duration = 5 + i * 0.5
                floatTweens.push(
                    gsap.fromTo(imgContainer, { y: -baseAmplitude }, {
                        y: baseAmplitude, duration, ease: 'sine.inOut',
                        yoyo: true, repeat: -1,
                    })
                )
            }
        })

        const glows = glowRefs.current.filter(Boolean) as HTMLElement[]
        const glowTweens = glows.map((glow) =>
            gsap.fromTo(glow, { opacity: 0.5 }, {
                opacity: 1.0, duration: 1.5, ease: 'sine.inOut',
                yoyo: true, repeat: -1,
            })
        )

        return () => {
            scrollTween.scrollTrigger?.kill()
            scrollTween.kill()
            floatTweens.forEach((t) => t.kill())
            glowTweens.forEach((t) => t.kill())
            panel0Observer?.disconnect()
            ScrollTrigger.getAll().forEach((st) => {
                if (st.vars.containerAnimation === scrollTween) {
                    st.kill()
                }
            })
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <section
            ref={sectionRef}
            id="athletes"
            className="relative w-full overflow-hidden"
            style={{ height: '100vh' }}
        >
            {/* Fixed header */}
            <div className="absolute top-0 left-0 right-0 z-10 flex flex-col md:items-center gap-4 sm:gap-6 pt-28 sm:pt-20 md:pt-26 pb-6 pointer-events-none px-4 bg-gradient-to-b from-[#0A0A0A] from-80% to-transparent">
                <div className="flex items-center gap-2">
                    <span className="font-satoshi font-black italic text-[18px] leading-[100%] tracking-[4px] text-[#969EA7]">
                        ///////
                    </span>
                    <span className="font-mono italic font-normal text-[18px] leading-[100%] tracking-[2px] text-[#969EA7] uppercase">
                        {t('athletes.tag')}
                    </span>
                </div>

                <h2 className="font-mono font-bold text-[28px] sm:text-[36px] md:text-[48px] leading-[130%] md:text-center text-white">
                    {t('athletes.sectionHeadline')}
                </h2>
            </div>

            {/* Horizontal scroll track */}
            <div
                ref={trackRef}
                className="flex will-change-transform overflow-y-hidden"
                style={{ width: `${panels.length * 100}vw` }}
            >
                {panels.map((panel, i) => (
                    <div
                        key={i}
                        ref={(el) => { panelRefs.current[i] = el }}
                        className="flex-shrink-0 flex flex-col justify-start sm:justify-end px-0 sm:px-6 md:px-8 pb-0 sm:pb-8 md:pb-12 pt-[280px] sm:pt-0"
                        style={{ width: '100vw', height: '100vh' }}
                    >
                        <div
                            className="relative w-full max-w-[1200px] mx-auto rounded-none sm:rounded-2xl flex flex-col justify-end pl-5 sm:pl-8 md:pl-12 pt-4 sm:pt-12 md:pt-0 overflow-hidden sm:overflow-visible"
                        >
                            {/* Card background — hidden on mobile so panels blend seamlessly like coaches */}
                            <div
                                className="absolute inset-0 hidden sm:block rounded-2xl"
                                style={{
                                    background: 'linear-gradient(14.48deg, #151515 -17.53%, #090909 79.83%)',
                                }}
                            />
                            <div className="relative flex flex-col md:grid md:grid-cols-12 gap-0 sm:gap-10 md:gap-12 items-center md:items-end h-full pb-0 md:pb-6 mt-4 sm:mt-0">
                                <div className="flex flex-col gap-4 sm:gap-6 md:col-span-5 w-full pr-5 sm:pr-8 md:pr-0 self-start md:self-auto pt-6 md:pt-0">
                                    <h3
                                        ref={(el) => { headlineRefs.current[i] = el }}
                                        className="font-satoshi font-bold text-[28px] sm:text-[32px] md:text-[40px] lg:text-[48px] leading-[130%] text-white"
                                    >
                                        {panel.headline.split('\n').map((line, j) => (
                                            <span key={j}>
                                                {line}
                                                {j < panel.headline.split('\n').length - 1 && (
                                                    <>
                                                        <br className="hidden md:block" />
                                                        <span className="md:hidden"> </span>
                                                    </>
                                                )}
                                            </span>
                                        ))}
                                    </h3>
                                    <p
                                        ref={(el) => { bodyRefs.current[i] = el }}
                                        className="font-satoshi font-medium text-[15px] sm:text-[16px] md:text-[18px] leading-[130%] text-[#ACB1B7]"
                                    >
                                        {panel.body}
                                    </p>
                                </div>

                                <div className="relative w-full md:col-span-7 flex justify-center md:justify-end mt-auto md:mt-0">
                                    <div
                                        ref={(el) => { glowRefs.current[i] = el }}
                                        className="absolute inset-0 pointer-events-none"
                                        style={{
                                            opacity: 0.5,
                                            background: 'radial-gradient(ellipse at center, rgba(197, 0, 23, 0.6) 0%, rgba(255, 85, 20, 0.2) 35%, transparent 55%)',
                                        }}
                                    />
                                    <div
                                        ref={(el) => { imageRefs.current[i] = el }}
                                        className="relative w-full max-w-[500px] md:max-w-none"
                                    >
                                        <div className='relative rounded-2xl w-full h-[28vh] sm:h-[38vh] md:h-[45vh] lg:h-[60vh] lg:top-20 top-6 overflow-hidden'>
                                            {panelImages[i]?.map((img, j) => (
                                                <img
                                                    key={j}
                                                    src={img.src}
                                                    alt={`Athletes Interface ${i + 1} - ${j + 1}`}
                                                    className={`object-cover ${img.className || ''}`}
                                                />
                                            ))}
                                        </div>
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
