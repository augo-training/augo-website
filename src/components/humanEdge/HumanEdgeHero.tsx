import { useTranslation } from 'react-i18next'
import heroVideo from '../../assets/videos/human-edge-hero.mp4'
import heroPoster from '../../assets/images/human-edge-hero-poster.jpg'

interface HumanEdgeHeroProps {
    onApply: () => void
}

export default function HumanEdgeHero({ onApply }: HumanEdgeHeroProps) {
    const { t } = useTranslation()
    const bodyLines = t('humanEdge.hero.body', { returnObjects: true }) as string[]
    const titleLines = t('humanEdge.hero.title', { returnObjects: true }) as string[]

    return (
        <section className="w-full pt-32 pb-20 sm:pt-40 sm:pb-24 px-5 sm:px-8 bg-dark texture-grain">
            <div className="max-w-[1100px] mx-auto flex flex-col gap-6 sm:gap-8">
                <span className="font-mono text-[12px] tracking-[3px] uppercase text-white">
                    {t('humanEdge.hero.eyebrow')}
                </span>
                <h1 className="font-satoshi font-bold text-[40px] sm:text-[56px] md:text-[68px] lg:text-[80px] xl:text-[88px] leading-[100%] tracking-[-0.03em] text-white">
                    {titleLines.map((line, i) => (
                        <span key={i} className="block">{line}</span>
                    ))}
                </h1>
                <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden bg-dark-700 my-2 ring-1 ring-white/[0.08]">
                    <video
                        src={heroVideo}
                        poster={heroPoster}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        aria-hidden="true"
                        className="w-full h-full object-cover motion-reduce:hidden"
                    />
                    <img
                        src={heroPoster}
                        alt=""
                        aria-hidden="true"
                        className="hidden motion-reduce:block w-full h-full object-cover"
                    />
                </div>
                <div className="mt-2 sm:mt-4 flex flex-col font-satoshi font-medium text-[20px] sm:text-[24px] md:text-[26px] leading-[140%] tracking-[-0.005em] text-white/85 max-w-[760px]">
                    {bodyLines.map((line, i) => <p key={i}>{line}</p>)}
                </div>
                <div className="mt-8 sm:mt-10 pt-8 sm:pt-10 border-t border-white/[0.10] max-w-[820px] flex flex-col gap-5 sm:gap-6">
                    <p className="font-satoshi font-medium text-[22px] sm:text-[28px] md:text-[32px] leading-[125%] tracking-[-0.015em] text-white">
                        {t('humanEdge.hero.tagline')}
                    </p>
                    <p className="font-mono text-[12px] sm:text-[13px] tracking-[2.5px] uppercase text-white/55">
                        {t('humanEdge.hero.tagline2')}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onApply}
                    className="btn-gradient self-start font-mono text-sm font-extrabold tracking-[2px] uppercase text-white rounded-lg hover:brightness-110 transition-all duration-200 border-0 cursor-pointer mt-4"
                    style={{ width: '209px', height: '48px' }}
                >
                    {t('humanEdge.hero.cta')}
                </button>
            </div>
        </section>
    )
}
