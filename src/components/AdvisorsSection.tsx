import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import marcoPhoto from '../assets/images/advisor-marco.png?w=256&h=256&format=webp'
import gordonPhoto from '../assets/images/advisor-gordon.png?w=256&h=256&format=webp'
import retoPhoto from '../assets/images/advisor-reto.png?w=256&h=256&format=webp'

/**
 * The three coaches who have advised augo since day 0, under the About section.
 * Title and bio live in the locale files under `advisors.<key>`. A locale can
 * override a name with `advisors.<key>.name` (German spells Reto's "Brändli").
 * Same headshot crops as the course page (CoachCourseAdvisors).
 *
 * Split layout: the headline on the left (sticky on desktop), one card per
 * advisor on the right. On phones everything stacks.
 */
const advisors = [
    { key: 'marco', name: 'Dr. Marco Altini', photo: marcoPhoto },
    { key: 'gordon', name: 'Gordon Crawford', photo: gordonPhoto },
    { key: 'reto', name: 'Reto Braendli', photo: retoPhoto },
] as const

export default function AdvisorsSection() {
    const { t } = useTranslation()
    const headlineRef = useRef<HTMLDivElement>(null)
    const cardRefs = useRef<(HTMLLIElement | null)[]>([])

    useEffect(() => {
        // Bail out before any gsap.set, so reduced-motion users never get
        // content stranded at opacity 0.
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches
        if (prefersReducedMotion) return

        const isMobile = window.innerWidth < 768
        const slideDistance = isMobile ? 15 : 20

        const targets: { el: Element; delay: number }[] = []
        if (headlineRef.current) targets.push({ el: headlineRef.current, delay: 0 })
        cardRefs.current.forEach((el, i) => {
            if (el) targets.push({ el, delay: 0.08 * (i + 1) })
        })

        const observers = targets.map(({ el, delay }) => {
            gsap.set(el, { opacity: 0, y: slideDistance })

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            gsap.to(el, {
                                opacity: 1,
                                y: 0,
                                delay,
                                duration: 1.6,
                                ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
                            })
                            observer.disconnect()
                        }
                    })
                },
                { threshold: 0.2 }
            )
            observer.observe(el)
            return observer
        })

        return () => observers.forEach((observer) => observer.disconnect())
    }, [])

    return (
        <section
            id="advisors"
            aria-labelledby="advisors-title"
            className="py-16 sm:py-20 px-5 sm:px-8 max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16"
        >
            <div ref={headlineRef} className="lg:col-span-5 lg:sticky lg:top-32 self-start flex flex-col gap-6">
                {/* Same slashed tag as the About section above. */}
                <div className="flex items-center gap-2">
                    <span className="font-satoshi font-black italic text-[16px] lg:text-[18px] leading-[100%] tracking-[4px] text-[#969EA7]">///////</span>
                    <span className="font-mono italic font-normal text-[16px] lg:text-[18px] leading-[100%] tracking-[2px] text-[#969EA7] uppercase">{t('advisors.tag')}</span>
                </div>
                <h2
                    id="advisors-title"
                    className="m-0 font-mono font-bold text-[36px] sm:text-[48px] md:text-[56px] leading-[120%] text-white"
                >
                    {t('advisors.headline1')}
                    <br />
                    {t('advisors.headline2')}
                </h2>
                <p className="m-0 font-satoshi font-medium text-[16px] sm:text-[18px] leading-[130%] text-[#969EA7]">
                    {t('advisors.intro')}
                </p>
            </div>

            <ul className="lg:col-span-7 list-none p-0 m-0 flex flex-col gap-4">
                {advisors.map((advisor, i) => (
                    <li
                        key={advisor.key}
                        ref={(el) => { cardRefs.current[i] = el }}
                        className="rounded-2xl bg-dark-800 ring-1 ring-white/[0.08] p-6 sm:p-7 flex flex-col sm:flex-row sm:items-start gap-5 sm:gap-6"
                    >
                        {/* Square with rounded corners, like the team photos in
                            AboutSection. The name sits right beside it, so no alt text. */}
                        <img
                            src={advisor.photo}
                            alt=""
                            width={128}
                            height={128}
                            loading="lazy"
                            className="h-28 w-28 sm:h-32 sm:w-32 shrink-0 rounded-2xl object-cover grayscale"
                        />
                        <div className="flex flex-col gap-4">
                            <div>
                                <p className="m-0 font-satoshi font-bold text-[22px] sm:text-[24px] leading-[130%] text-white">
                                    {t(`advisors.${advisor.key}.name`, { defaultValue: advisor.name })}
                                </p>
                                <p className="m-0 mt-1 font-satoshi font-medium text-[16px] leading-[140%] text-[#969EA7]">
                                    {t(`advisors.${advisor.key}.title`)}
                                </p>
                            </div>
                            <p className="m-0 font-satoshi text-[16px] sm:text-[17px] leading-[145%] text-white/80">
                                {t(`advisors.${advisor.key}.bio`)}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    )
}
