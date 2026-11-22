import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { trackCtaClicked } from '../../utils/analytics'

/** Closing CTA. Trial goes to sign-up, same as the menu's "Sign up". */
export default function FeaturesCta() {
    const { t } = useTranslation()
    const { lang } = useParams<{ lang: string }>()
    const currentLang = lang ?? 'en'

    const track = (text: string, destination: string) => {
        void trackCtaClicked({ cta_text: text, cta_location: 'features_final_cta', destination })
    }

    const trialHref = `/${currentLang}/download`
    const demoHref = `/${currentLang}/book-a-demo`

    return (
        <section
            aria-labelledby="features-cta-title"
            className="w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark-800 border-t border-white/[0.06] texture-grain"
        >
            <div className="max-w-[960px] mx-auto">
                <h2
                    id="features-cta-title"
                    className="font-satoshi font-bold text-[28px] sm:text-[40px] leading-[110%] tracking-[-0.025em] text-white max-w-[620px]"
                >
                    {t('features.cta.title')}
                </h2>
                <p className="mt-4 font-satoshi text-[16px] sm:text-[18px] leading-[160%] text-white/65 max-w-[620px]">
                    {t('features.cta.lead')}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:items-center">
                    <a
                        href={trialHref}
                        onClick={() => track(t('features.cta.primary'), trialHref)}
                        className="btn-gradient inline-flex items-center justify-center h-12 px-8 rounded-lg font-mono text-sm font-extrabold tracking-[2px] uppercase text-white hover:brightness-110 transition-all duration-200"
                    >
                        {t('features.cta.primary')}
                    </a>
                    <a
                        href={demoHref}
                        onClick={() => track(t('features.cta.secondary'), demoHref)}
                        className="inline-flex items-center justify-center h-12 px-8 rounded-lg border border-white/20 font-mono text-sm font-extrabold tracking-[2px] uppercase text-white/80 hover:text-white hover:border-white/40 transition-colors duration-200"
                    >
                        {t('features.cta.secondary')}
                    </a>
                </div>
            </div>
        </section>
    )
}
