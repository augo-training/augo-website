import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import aboutLeftImg from '../assets/images/about_section_left.webp'
import aboutTopRightImg from '../assets/images/about_section_top_right.webp'
import aboutBottomRightImg from '../assets/images/about_section_bottom_right.webp'


export default function AboutSection() {
    const { t } = useTranslation()
    const sectionRef = useRef<HTMLDivElement>(null)

    // Text refs
    const headline1Ref = useRef<HTMLParagraphElement>(null)
    const body1Ref = useRef<HTMLParagraphElement>(null)
    const headline2Ref = useRef<HTMLParagraphElement>(null)
    const body2Ref = useRef<HTMLParagraphElement>(null)
    const headline3Ref = useRef<HTMLParagraphElement>(null)
    const body3Ref = useRef<HTMLParagraphElement>(null)

    // Photo refs
    const photo1Ref = useRef<HTMLImageElement>(null)
    const photo2Ref = useRef<HTMLImageElement>(null)
    const photo3Ref = useRef<HTMLImageElement>(null)

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches

        const isMobile = window.innerWidth < 768
        const slideDistance = isMobile ? 15 : 20

        function revealText(headline: HTMLElement, body: HTMLElement) {
            gsap.set(headline, { opacity: 0, y: slideDistance })
            gsap.set(body, { opacity: 0 })

            if (prefersReducedMotion) {
                gsap.set(headline, { opacity: 1, y: 0 })
                gsap.set(body, { opacity: 1 })
                return
            }

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            gsap.to(headline, {
                                opacity: 1, y: 0, duration: 1.6,
                                ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
                            })
                            gsap.to(body, {
                                opacity: 1, duration: 1, delay: 0.3,
                                ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
                            })
                            observer.disconnect()
                        }
                    })
                },
                { threshold: 0.2 }
            )
            observer.observe(headline)
            return observer
        }

        function revealPhoto(img: HTMLImageElement) {
            gsap.set(img, { opacity: 0 })

            if (prefersReducedMotion) {
                gsap.set(img, { opacity: 1 })
                return
            }

            const fadeObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            gsap.to(img, {
                                opacity: 1, duration: 0.8, ease: 'power2.out',
                            })
                            fadeObserver.disconnect()
                        }
                    })
                },
                { threshold: 0.1 }
            )
            fadeObserver.observe(img)

            if (!isMobile) {
                const onScroll = () => {
                    const rect = img.getBoundingClientRect()
                    const viewH = window.innerHeight
                    const progress = 1 - (rect.bottom / (viewH + rect.height))
                    const offset = progress * rect.height * 0.05
                    gsap.set(img, { y: offset })
                }
                window.addEventListener('scroll', onScroll, { passive: true })
                return () => {
                    fadeObserver.disconnect()
                    window.removeEventListener('scroll', onScroll)
                }
            }

            return () => fadeObserver.disconnect()
        }

        const cleanups: ((() => void) | undefined)[] = []

        if (headline1Ref.current && body1Ref.current) revealText(headline1Ref.current, body1Ref.current)
        if (headline2Ref.current && body2Ref.current) revealText(headline2Ref.current, body2Ref.current)
        if (headline3Ref.current && body3Ref.current) revealText(headline3Ref.current, body3Ref.current)
        if (photo1Ref.current) cleanups.push(revealPhoto(photo1Ref.current))
        if (photo2Ref.current) cleanups.push(revealPhoto(photo2Ref.current))
        if (photo3Ref.current) cleanups.push(revealPhoto(photo3Ref.current))

        return () => { cleanups.forEach((fn) => fn?.()) }
    }, [])

    return (
        <section
            ref={sectionRef}
            id='about'
            className="py-16 sm:py-20 px-5 sm:px-8 flex flex-col gap-10 md:gap-16 max-w-[1200px] mx-auto"
        >
            {/* MOBILE / TABLET LAYOUT (< lg) */}
            <div className="flex lg:hidden flex-col gap-10">
                <div className="flex items-center gap-2">
                    <span className="font-satoshi font-black italic text-[16px] leading-[100%] tracking-[4px] text-[#969EA7]">///////</span>
                    <span className="font-mono italic font-normal text-[16px] leading-[100%] tracking-[2px] text-[#969EA7] uppercase">{t('about.tag')}</span>
                </div>

                <div className="flex flex-col gap-4 sm:gap-6">
                    <p className="font-satoshi font-medium text-[16px] sm:text-[18px] leading-[130%] text-[#969EA7]">{t('about.body1')}</p>
                    <p className="font-satoshi font-bold text-[20px] sm:text-[24px] leading-[130%] text-white">{t('about.highlight1')}</p>
                </div>

                <div className="overflow-hidden rounded-2xl w-full">
                    <img src={aboutTopRightImg} alt="augo founder" className="w-full h-auto object-cover" />
                </div>

                <div className="flex flex-col gap-4 sm:gap-6">
                    <p className="font-satoshi font-medium text-[16px] sm:text-[18px] leading-[130%] text-[#969EA7]">{t('about.body2')}</p>
                    <p className="font-satoshi font-bold text-[20px] sm:text-[24px] leading-[130%] text-white">{t('about.highlight2')}</p>
                </div>

                <div className="overflow-hidden rounded-2xl w-full">
                    <img src={aboutLeftImg} alt="augo founder" className="w-full h-auto object-cover" />
                </div>

                <div className="flex flex-col gap-4 sm:gap-6">
                    <p className="font-satoshi font-medium text-[16px] sm:text-[18px] leading-[130%] text-[#969EA7]">{t('about.body3')}</p>
                    <p className="font-satoshi font-bold text-[20px] sm:text-[24px] leading-[130%] text-white">{t('about.highlight3')}</p>
                </div>

                <div className="overflow-hidden rounded-2xl w-full">
                    <img src={aboutBottomRightImg} alt="augo co-founder Andreas" className="w-full h-auto object-cover" />
                </div>
            </div>

            {/* DESKTOP LAYOUT (>= lg) */}
            <div className="hidden lg:grid grid-cols-2 gap-12">
                {/* LEFT COLUMN */}
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-6 pt-44">
                        <p ref={body1Ref} className="font-satoshi font-medium text-[18px] leading-[130%] text-[#969EA7]">{t('about.body1')}</p>
                        <p ref={headline1Ref} className="font-satoshi font-bold text-[22px] xl:text-[32px] leading-[130%] text-white">{t('about.highlight1')}</p>
                    </div>

                    <div className="overflow-hidden rounded-2xl">
                        <img ref={photo2Ref} src={aboutLeftImg} alt="augo founder" className="w-full h-auto object-cover" />
                    </div>

                    <div className="flex flex-col gap-6">
                        <p ref={body3Ref} className="font-satoshi font-medium text-[18px] leading-[130%] text-[#969EA7]">{t('about.body3')}</p>
                        <p ref={headline3Ref} className="font-satoshi font-bold text-[22px] xl:text-[32px] leading-[130%] text-white">{t('about.highlight3')}</p>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="flex flex-col gap-8">
                    <div className="flex items-center gap-2 justify-end">
                        <span className="font-satoshi font-black italic text-[18px] leading-[100%] tracking-[4px] text-[#969EA7]">///////</span>
                        <span className="font-mono italic font-normal text-[18px] leading-[100%] tracking-[2px] text-[#969EA7] uppercase">{t('about.tag')}</span>
                    </div>

                    <div className="overflow-hidden rounded-2xl">
                        <img ref={photo1Ref} src={aboutTopRightImg} alt="augo founder" className="w-full h-auto object-cover" />
                    </div>

                    <div className="flex flex-col gap-6">
                        <p ref={body2Ref} className="font-satoshi font-medium text-[18px] leading-[130%] text-[#969EA7]">{t('about.body2')}</p>
                        <p ref={headline2Ref} className="font-satoshi font-bold text-[22px] xl:text-[32px] leading-[130%] text-white">{t('about.highlight2')}</p>
                    </div>

                    <div className="overflow-hidden rounded-2xl">
                        <img ref={photo3Ref} src={aboutBottomRightImg} alt="augo co-founder Andreas" className="w-full h-auto object-cover" />
                    </div>
                </div>
            </div>
        </section>
    )
}
