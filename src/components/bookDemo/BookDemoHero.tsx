import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import { ArrowUpRight } from 'lucide-react'
import { BOOK_DEMO_URL } from './constants'
import { trackCtaClicked } from '../../utils/analytics'
import heroVideo from '../../assets/videos/book-demo-hero.mp4'
import heroPoster from '../../assets/images/book-demo-hero-poster.jpg'

export default function BookDemoHero() {
    const { t } = useTranslation()

    const headingRef = useRef<HTMLHeadingElement>(null)
    const leadRef = useRef<HTMLParagraphElement>(null)
    const ctaRef = useRef<HTMLDivElement>(null)

    // Entrance on mount rather than on scroll: this hero is above the fold, so
    // there is nothing to scroll into view. Same fade-up recipe as the footer.
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        // The build prerenders this page with Puppeteer and snapshots the DOM on
        // network idle, which lands mid-animation and bakes GSAP's inline styles
        // into the static HTML. Skip the animation entirely for the crawler.
        if (prefersReducedMotion || navigator.webdriver) return

        const text = [headingRef.current, leadRef.current, ctaRef.current].filter(Boolean) as HTMLElement[]
        if (!text.length) return

        gsap.set(text, { opacity: 0, y: 16 })

        const tl = gsap.timeline({
            // Leave no inline styles behind: the prerenderer snapshots this DOM,
            // and a frozen opacity would ship a blank page in the static HTML.
            onComplete: () => {
                gsap.set(text, { clearProps: 'all' })
            },
        })

        text.forEach((el, i) => {
            tl.to(el, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, i * 0.1)
        })

        return () => {
            tl.kill()
        }
    }, [])

    return (
        // No texture-grain here: it forces every direct child to position: relative,
        // which would pull the video out of its absolute full-bleed layer.
        <section className="relative w-full min-h-screen flex items-center overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 px-5 sm:px-8 bg-dark">
            {/* Running footage, full bleed behind the copy. Hidden for
                reduced-motion, where the poster frame takes its place. */}
            <video
                src={heroVideo}
                poster={heroPoster}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover motion-reduce:hidden"
            />
            <img
                src={heroPoster}
                alt=""
                aria-hidden="true"
                className="hidden motion-reduce:block absolute inset-0 w-full h-full object-cover"
            />

            {/* Readability: an even dim, darker behind the text column, a band
                behind the navbar and a fade into the page background below. */}
            <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{ backgroundColor: 'rgba(10,10,10,0.6)' }}
            />
            <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                    background:
                        'linear-gradient(to right, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0) 55%), linear-gradient(to top, #0A0A0A 2%, rgba(10,10,10,0) 40%), linear-gradient(to bottom, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0) 22%)',
                }}
            />

            <div className="relative z-10 w-full max-w-[1200px] mx-auto">
                <div className="max-w-[700px] flex flex-col gap-6 sm:gap-8">
                    <h1
                        ref={headingRef}
                        className="font-satoshi font-bold text-[44px] sm:text-[64px] lg:text-[80px] leading-[98%] tracking-[-0.03em] text-white"
                    >
                        {t('bookDemo.hero.title')}
                    </h1>

                    <p
                        ref={leadRef}
                        className="font-satoshi font-medium text-[19px] sm:text-[22px] md:text-[24px] leading-[145%] tracking-[-0.005em] text-white/85"
                    >
                        {t('bookDemo.hero.lead')}
                    </p>

                    <div ref={ctaRef} className="mt-2 sm:mt-4 pt-8 sm:pt-10 border-t border-white/[0.10]">
                        <a
                            href={BOOK_DEMO_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackCtaClicked({
                                cta_text: t('bookDemo.hero.cta'),
                                cta_location: 'book_demo_hero',
                                destination: BOOK_DEMO_URL,
                            })}
                            className="btn-gradient inline-flex items-center justify-center gap-2 font-mono text-sm font-extrabold tracking-[2px] uppercase text-white rounded-lg px-7 py-4 hover:brightness-110 transition-all duration-200 border-0 cursor-pointer"
                        >
                            {t('bookDemo.hero.cta')}
                            <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
