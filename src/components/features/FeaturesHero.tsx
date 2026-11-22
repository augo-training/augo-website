import { useTranslation } from 'react-i18next'

export default function FeaturesHero() {
    const { t } = useTranslation()

    return (
        <section
            aria-labelledby="features-hero-title"
            className="w-full pt-32 sm:pt-40 pb-10 sm:pb-14 px-5 sm:px-8 bg-dark texture-grain"
        >
            <div className="max-w-[1200px] mx-auto">
                <div className="flex items-center gap-2 mb-6">
                    <span className="font-satoshi font-black italic text-[18px] leading-[100%] tracking-[4px] text-[#969EA7]">
                        ///////
                    </span>
                    <span className="font-mono italic font-normal text-[18px] leading-[100%] tracking-[2px] text-[#969EA7] uppercase">
                        {t('features.hero.eyebrow')}
                    </span>
                </div>
                <h1
                    id="features-hero-title"
                    className="font-satoshi font-bold text-[36px] sm:text-[52px] lg:text-[64px] leading-[105%] tracking-[-0.03em] text-white max-w-[1200px] text-balance"
                >
                    {t('features.hero.title')}
                </h1>
                <p className="mt-6 font-satoshi text-[17px] sm:text-[20px] leading-[155%] text-white/75 max-w-[1000px]">
                    {t('features.hero.lead')}
                </p>
            </div>
        </section>
    )
}
