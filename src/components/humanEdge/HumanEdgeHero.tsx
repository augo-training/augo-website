import { useTranslation } from 'react-i18next'
import brianHero from '../../assets/images/brian-hero.png'

interface HumanEdgeHeroProps {
    onApply: () => void
}

export default function HumanEdgeHero({ onApply }: HumanEdgeHeroProps) {
    const { t } = useTranslation()
    const bodyLines = t('humanEdge.hero.body', { returnObjects: true }) as string[]

    return (
        <section className="w-full pt-32 pb-20 sm:pt-40 sm:pb-24 px-5 sm:px-8 bg-dark">
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
                <div className="flex flex-col gap-6 sm:gap-8">
                    <span className="font-mono text-[12px] tracking-[3px] uppercase text-yellow">
                        {t('humanEdge.hero.eyebrow')}
                    </span>
                    <h1 className="font-mono font-bold text-[36px] sm:text-[48px] lg:text-[60px] leading-[110%] text-white">
                        {t('humanEdge.hero.title')}
                    </h1>
                    <div className="flex flex-col gap-2 font-satoshi text-[18px] sm:text-[20px] leading-[150%] text-text-muted">
                        {bodyLines.map((line, i) => <p key={i}>{line}</p>)}
                    </div>
                    {/* Mobile-only image: sits after the body, before the tagline */}
                    <div className="lg:hidden w-full max-w-[460px] mx-auto">
                        <div
                            className="aspect-[4/5] w-full rounded-2xl overflow-hidden bg-dark-700"
                            style={{ border: '1px solid #222' }}
                        >
                            <img
                                src={brianHero}
                                alt="Brian Boisvert"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    <p className="font-satoshi text-[16px] sm:text-[17px] leading-[160%] text-white max-w-[560px]">
                        {t('humanEdge.hero.tagline')}
                    </p>
                    <p className="font-mono text-[14px] sm:text-[15px] tracking-[1px] text-yellow uppercase">
                        {t('humanEdge.hero.tagline2')}
                    </p>
                    <button
                        type="button"
                        onClick={onApply}
                        className="btn-gradient self-start font-mono text-sm font-extrabold tracking-[2px] uppercase text-white rounded-lg hover:brightness-110 transition-all duration-200 border-0 cursor-pointer mt-2"
                        style={{ width: '209px', height: '48px' }}
                    >
                        {t('humanEdge.hero.cta')}
                    </button>
                </div>
                {/* Desktop-only image: right column */}
                <div className="hidden lg:block relative w-full max-w-[460px] mx-auto lg:mx-0 lg:justify-self-end">
                    <div
                        className="aspect-[4/5] w-full rounded-2xl overflow-hidden bg-dark-700"
                        style={{ border: '1px solid #222' }}
                    >
                        <img
                            src={brianHero}
                            alt="Brian Boisvert"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
