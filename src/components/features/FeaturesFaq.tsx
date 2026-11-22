import { useTranslation } from 'react-i18next'
import { SECTION_IDS } from './constants'

interface FaqItem {
    question: string
    answer: string
}

/** Rendered open, like McpFaq, and mirrored as FAQPage JSON-LD via `features.faq.items`. */
export default function FeaturesFaq() {
    const { t } = useTranslation()
    const items = t('features.faq.items', { returnObjects: true }) as FaqItem[]

    return (
        <section
            id={SECTION_IDS.faqs}
            aria-labelledby="features-faq-title"
            className="features-target w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark border-t border-white/[0.06] texture-grain"
        >
            <div className="max-w-[820px] mx-auto">
                <h2
                    id="features-faq-title"
                    className="font-satoshi font-bold text-[28px] sm:text-[40px] lg:text-[44px] leading-[110%] tracking-[-0.025em] text-white"
                >
                    {t('features.faq.title')}
                </h2>

                <div className="flex flex-col mt-8 sm:mt-10">
                    {items.map((item, i) => (
                        <div
                            key={i}
                            className="py-5 sm:py-6 border-t border-white/[0.08] last:border-b last:border-white/[0.08]"
                        >
                            <h3 className="font-satoshi font-medium text-[17px] sm:text-[20px] leading-[140%] text-white">
                                {item.question}
                            </h3>
                            <p className="mt-2 font-satoshi text-[15px] sm:text-[17px] leading-[160%] text-white/65 max-w-[680px]">
                                {item.answer}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
