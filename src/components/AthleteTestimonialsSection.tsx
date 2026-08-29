import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import { athleteTestimonials } from '../data/athleteTestimonials'

export default function AthleteTestimonialsSection() {
    const { t } = useTranslation()
    const headlineRef = useRef<HTMLHeadingElement>(null)
    const cardRefs = useRef<(HTMLLIElement | null)[]>([])
    const scrollRefs = useRef<(HTMLDivElement | null)[]>([])

    // Flag the quote boxes that still have content below the fold, so the CSS
    // can fade their bottom edge. Kept separate from the reveal effect below,
    // which bails out under prefers-reduced-motion — this affordance must not.
    useEffect(() => {
        const update = () => {
            scrollRefs.current.forEach((el) => {
                if (!el) return
                el.classList.toggle(
                    'has-more',
                    el.scrollTop + el.clientHeight < el.scrollHeight - 2
                )
            })
        }

        const els = scrollRefs.current.filter(Boolean) as HTMLDivElement[]
        update()
        // Fonts land after first paint and re-wrap the text.
        document.fonts?.ready.then(update).catch(() => {})

        els.forEach((el) => el.addEventListener('scroll', update, { passive: true }))
        window.addEventListener('resize', update)

        return () => {
            els.forEach((el) => el.removeEventListener('scroll', update))
            window.removeEventListener('resize', update)
        }
    }, [])

    useEffect(() => {
        // Bail out before any gsap.set, so reduced-motion users never get
        // cards stranded at opacity 0.
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
            id="athlete-testimonials"
            aria-labelledby="athlete-testimonials-title"
            className="w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark texture-grain"
        >
            <div className="max-w-[1200px] mx-auto flex flex-col gap-10 sm:gap-14">
                <h2
                    id="athlete-testimonials-title"
                    ref={headlineRef}
                    className="font-mono font-bold text-[36px] sm:text-[48px] md:text-[56px] lg:text-[64px] leading-[130%] text-white"
                >
                    {t('athleteTestimonials.headline1')}
                    <br />
                    {t('athleteTestimonials.headline2')}
                </h2>

                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 xl:gap-6 items-stretch list-none p-0 m-0">
                    {athleteTestimonials.map((athlete, i) => (
                        <li
                            key={`${athlete.name}-${i}`}
                            ref={(el) => { cardRefs.current[i] = el }}
                            className="h-full"
                        >
                            {/* Fixed height from md up so all cards match; the quote
                                scrolls inside rather than stretching the row. */}
                            <figure className="h-full md:h-[480px] rounded-2xl bg-dark-800 ring-1 ring-white/[0.08] p-6 sm:p-7 flex flex-col m-0">
                                <div
                                    ref={(el) => { scrollRefs.current[i] = el }}
                                    tabIndex={0}
                                    className="athlete-quote-scroll flex-1 min-h-0 overflow-y-auto mb-6 rounded-sm focus-visible:outline-2 focus-visible:outline-white/40"
                                >
                                    <blockquote className="font-satoshi font-medium text-[16px] sm:text-[17px] leading-[145%] text-white m-0 pr-1">
                                        {athlete.quote}
                                    </blockquote>
                                </div>

                                <figcaption className="flex items-center gap-3 flex-shrink-0">
                                    <img
                                        src={athlete.photo}
                                        alt={athlete.name}
                                        loading="lazy"
                                        className="flex-shrink-0 rounded-lg object-cover w-10 h-10 sm:w-12 sm:h-12 grayscale"
                                    />
                                    <span className="font-mono font-extrabold text-[16px] sm:text-[17px] leading-[130%] text-white">
                                        {athlete.name}
                                    </span>
                                </figcaption>
                            </figure>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}
