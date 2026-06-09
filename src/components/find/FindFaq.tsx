import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { trackFaqExpanded } from '../../utils/analytics'

interface FaqItem {
    question: string
    answer: string
}

/**
 * Athlete-intent FAQ for the coach directory. Built on native <details> so every
 * answer is in the static DOM (collapsed or not) — crawlable for SEO and readable
 * by AI answer engines. Mirrored as FAQPage JSON-LD via `find.faq.items`.
 */
export default function FindFaq() {
    const { t } = useTranslation()
    const items = t('find.faq.items', { returnObjects: true }) as FaqItem[]

    return (
        <section
            aria-labelledby="find-faq-title"
            className="w-full pt-16 pb-20 sm:pt-20 sm:pb-24 px-5 sm:px-8 bg-dark texture-grain"
        >
            <div className="max-w-[820px] mx-auto">
                <div className="inline-flex mb-5">
                    <span className="inline-flex items-center rounded-full border border-white/20 px-3 py-1.5 font-mono text-[11px] tracking-[2.5px] uppercase text-white/70">
                        FAQ
                    </span>
                </div>
                <h2
                    id="find-faq-title"
                    className="font-satoshi font-bold text-[28px] sm:text-[40px] lg:text-[44px] leading-[110%] tracking-[-0.025em] text-white max-w-[640px]"
                >
                    {t('find.faq.title')}
                </h2>

                <div className="flex flex-col mt-8 sm:mt-10">
                    {items.map((item, i) => (
                        <details
                            key={i}
                            className="group border-t border-white/[0.08] last:border-b last:border-white/[0.08]"
                            onToggle={(e) => {
                                if ((e.currentTarget as HTMLDetailsElement).open) {
                                    trackFaqExpanded({ question: item.question, page: 'find' })
                                }
                            }}
                        >
                            <summary className="flex items-center justify-between gap-4 py-5 sm:py-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden transition-colors duration-200 hover:text-white">
                                <span className="font-satoshi font-medium text-[17px] sm:text-[20px] leading-[140%] text-white">
                                    {item.question}
                                </span>
                                <Plus
                                    aria-hidden="true"
                                    strokeWidth={2}
                                    className="w-5 h-5 flex-shrink-0 text-white/50 transition-transform duration-200 group-open:rotate-45"
                                />
                            </summary>
                            <p className="pb-5 sm:pb-6 -mt-1 font-satoshi text-[15px] sm:text-[17px] leading-[160%] text-white/65 max-w-[680px]">
                                {item.answer}
                            </p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    )
}
