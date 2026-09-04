import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { trackCtaClicked } from '../../utils/analytics'
import { SECTION_IDS } from './constants'

interface FaqItem {
    question: string
    answer: string
}

/**
 * Troubleshooting, rendered open rather than as an accordion. Find-in-page
 * inside a collapsed <details> only works in Chromium, and this page's whole
 * promise is that Ctrl-F finds the answer. Someone reading this section already
 * has a problem; hiding the answers behind a click is the wrong default.
 *
 * Mirrored as FAQPage JSON-LD via `mcp.faq.items`.
 */
export default function McpFaq() {
    const { t } = useTranslation()
    const { lang } = useParams<{ lang: string }>()
    const items = t('mcp.faq.items', { returnObjects: true }) as FaqItem[]
    // The site's only contact channel is the Typeform in ContactSection on the
    // home page; Home scrolls to location.hash on mount. Same link PricingSection uses.
    const contactHref = `/${lang ?? 'en'}#contact`

    return (
        <section
            id={SECTION_IDS.troubleshooting}
            aria-labelledby="mcp-faq-title"
            className="w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark-800 border-t border-white/[0.06] texture-grain scroll-mt-24"
        >
            <div className="max-w-[820px] mx-auto">
                <h2
                    id="mcp-faq-title"
                    className="font-satoshi font-bold text-[28px] sm:text-[40px] lg:text-[44px] leading-[110%] tracking-[-0.025em] text-white"
                >
                    {t('mcp.faq.title')}
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

                <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4">
                    <p className="font-satoshi text-[16px] sm:text-[18px] leading-[160%] text-white/65">
                        {t('mcp.faq.contactLead')}
                    </p>
                    <a
                        href={contactHref}
                        onClick={() =>
                            void trackCtaClicked({
                                cta_text: t('mcp.faq.contactCta'),
                                cta_location: 'mcp_troubleshooting',
                                destination: contactHref,
                            })
                        }
                        className="inline-flex items-center justify-center h-11 px-6 rounded-lg border border-white/20 font-mono text-[13px] font-extrabold tracking-[2px] uppercase text-white/80 hover:text-white hover:border-white/40 transition-colors duration-200"
                    >
                        {t('mcp.faq.contactCta')}
                    </a>
                </div>
            </div>
        </section>
    )
}
