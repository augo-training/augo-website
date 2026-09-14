import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'
import { ArrowUpRight } from 'lucide-react'
import { BOOK_DEMO_URL } from './constants'
import { trackCtaClicked } from '../../utils/analytics'
import brunaTrack from '../../assets/images/bruna-track.webp'

export default function BookDemoHero() {
    const { t } = useTranslation()

    const headingRef = useRef<HTMLHeadingElement>(null)
    const leadRef = useRef<HTMLParagraphElement>(null)
    const ctaRef = useRef<HTMLDivElement>(null)
    const photoRef = useRef<HTMLDivElement>(null)

    // Entrance on mount rather than on scroll: this hero is above the fold, so
    // there is nothing to scroll into view. Same fade-up recipe as the footer.
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        // The build prerenders this page with Puppeteer and snapshots the DOM on
        // network idle, which lands mid-animation and bakes GSAP's inline styles
        // into the static HTML. Skip the animation entirely for the crawler.
        if (prefersReducedMotion || navigator.webdriver) return

        const text = [headingRef.current, leadRef.current, ctaRef.current].filter(Boolean) as HTMLElement[]
        const photo = photoRef.current
        if (!text.length && !photo) return

        gsap.set(text, { opacity: 0, y: 16 })
        if (photo) gsap.set(photo, { opacity: 0, scale: 1.02 })

        const tl = gsap.timeline({
            // Leave no inline styles behind: the prerenderer snapshots this DOM,
            // and a frozen opacity would ship a blank page in the static HTML.
            onComplete: () => {
                gsap.set([...text, ...(photo ? [photo] : [])], { clearProps: 'all' })
            },
        })

        if (photo) {
            tl.to(photo, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, 0.05)
        }
        text.forEach((el, i) => {
            tl.to(el, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, i * 0.1)
        })

        return () => {
            tl.kill()
        }
    }, [])

    return (
        <section className="w-full min-h-screen flex items-center pt-28 pb-16 sm:pt-32 sm:pb-20 px-5 sm:px-8 bg-dark texture-grain">
            <div className="w-full max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_0.72fr] gap-10 lg:gap-16 items-center">
                <div className="order-2 lg:order-1 flex flex-col gap-6 sm:gap-8">
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

                <div ref={photoRef} className="order-1 lg:order-2">
                    {/* Wide on mobile so the CTA stays near the fold, tall on desktop to
                        fill the column. Offset to 62% because a 4:5 window on this 16:9
                        frame crops her trailing foot off at centre. */}
                    <div className="relative aspect-[3/2] lg:aspect-[4/5] w-full max-w-[420px] mx-auto lg:ml-auto overflow-hidden rounded-2xl bg-dark-700 ring-1 ring-white/[0.10]">
                        <img
                            src={brunaTrack}
                            alt={t('bookDemo.hero.imageAlt')}
                            width={1600}
                            height={900}
                            className="w-full h-full object-cover object-[62%_center]"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
