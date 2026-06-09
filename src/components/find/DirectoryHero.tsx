import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { trackCtaClicked } from '../../utils/analytics'
import { matchingFormUrl, type MatchingFormSource } from './matchingForm'

function trackForm(source: MatchingFormSource, ctaText: string) {
    trackCtaClicked({
        cta_text: ctaText,
        cta_location: source,
        destination: matchingFormUrl(source),
    })
}

export default function DirectoryHero() {
    const { t } = useTranslation()
    return (
        <section
            aria-labelledby="directory-hero-title"
            className="relative w-full min-h-[88vh] flex items-center justify-center overflow-hidden bg-dark px-5 sm:px-8 pt-28 pb-20"
        >
            {/* Looping background video (hidden for reduced-motion; poster shown instead) */}
            <video
                className="absolute inset-0 w-full h-full object-cover motion-reduce:hidden"
                src="/hero-loop.mp4"
                poster="/hero-loop-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-hidden="true"
            />
            <img
                src="/hero-loop-poster.jpg"
                alt=""
                aria-hidden="true"
                className="hidden motion-reduce:block absolute inset-0 w-full h-full object-cover"
            />

            {/* Even cinematic dim + bottom fade so the hero melts into the section below */}
            <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{ backgroundColor: 'rgba(10,10,10,0.55)' }}
            />
            <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                    background:
                        'linear-gradient(to top, #0A0A0A 2%, rgba(10,10,10,0) 45%), linear-gradient(to bottom, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0) 22%)',
                }}
            />

            {/* Centered content */}
            <div className="relative z-10 max-w-[820px] mx-auto flex flex-col items-center text-center gap-6 sm:gap-7">
                <h1
                    id="directory-hero-title"
                    className="font-satoshi font-bold text-[44px] sm:text-[64px] lg:text-[80px] leading-[100%] tracking-[-0.03em] text-white"
                >
                    {t('find.directory.h1')}
                </h1>

                <p className="font-satoshi text-[17px] sm:text-[20px] leading-[150%] text-white/75 max-w-[560px]">
                    {t('find.directory.subhead')}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-2">
                    <a
                        href={matchingFormUrl('athlete-hero')}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackForm('athlete-hero', 'Find your coach')}
                        className="btn-gradient inline-flex items-center justify-center gap-2 font-mono text-[12px] font-extrabold tracking-[2px] uppercase text-white rounded-lg px-6 py-3.5 cursor-pointer hover:brightness-110 transition-all"
                    >
                        {t('find.directory.ctaAthlete')}
                        <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                    </a>
                    <a
                        href={matchingFormUrl('coach-hero')}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackForm('coach-hero', "I'm a coach")}
                        className="inline-flex items-center justify-center gap-2 font-mono text-[12px] font-extrabold tracking-[2px] uppercase text-white rounded-lg px-6 py-3.5 ring-1 ring-white/25 hover:bg-white hover:text-dark hover:ring-white transition-all cursor-pointer bg-transparent"
                    >
                        {t('find.directory.ctaCoach')}
                        <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                    </a>
                </div>
            </div>
        </section>
    )
}
