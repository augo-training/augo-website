import { useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import bgSection from '../assets/images/bg_section_1.webp'
import addIcon from '../assets/images/add.svg'
import minusIcon from '../assets/images/minus.svg'

export default function FaqSection() {
    const { t, i18n } = useTranslation()
    const { lang } = useParams<{ lang: string }>()
    const currentLang = lang || i18n.language || 'en'

    const faqItems = t('faq.items', { returnObjects: true }) as Array<{
        question: string
        answer: string
        linkText?: string
    }>

    const [openIndex, setOpenIndex] = useState<number | null>(null)
    const [isAnimating, setIsAnimating] = useState(false)
    const contentRefs = useRef<(HTMLDivElement | null)[]>([])

    const handleToggle = useCallback(
        (index: number) => {
            if (isAnimating) return

            if (openIndex === index) {
                setIsAnimating(true)
                setOpenIndex(null)
                setTimeout(() => setIsAnimating(false), 500)
            } else if (openIndex !== null) {
                setIsAnimating(true)
                setOpenIndex(null)
                setTimeout(() => {
                    setOpenIndex(index)
                    setTimeout(() => setIsAnimating(false), 500)
                }, 800)
            } else {
                setIsAnimating(true)
                setOpenIndex(index)
                setTimeout(() => setIsAnimating(false), 500)
            }
        },
        [openIndex, isAnimating]
    )

    return (
        <section
            className="min-h-screen w-full py-16 sm:py-20 px-5 sm:px-8 flex items-center"
            style={{
                backgroundImage: `url(${bgSection})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
            id='faq'
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-[1200px] mx-auto w-full items-start">
                {/* Left: CTA */}
                <div className="flex flex-col gap-6 sm:gap-8 justify-center h-full pt-8 sm:pt-16 lg:pt-24 items-center lg:items-start text-center lg:text-left">
                    <h2 className="font-mono font-bold text-[32px] sm:text-[40px] lg:text-[48px] leading-[120%] text-white">
                        {t('faq.ctaHeadline1')}
                        <br />
                        {t('faq.ctaHeadline2')}
                        <br />
                        {t('faq.ctaHeadline3')}
                    </h2>
                    <p className="font-satoshi font-medium text-[16px] sm:text-[18px] leading-[130%] text-[#969EA7] max-w-[500px] lg:max-w-none">
                        {t('faq.ctaBody')}
                    </p>
                    <a
                        href={`/${currentLang}/join`}
                        className="btn-gradient font-mono text-sm font-extrabold tracking-[2px] uppercase text-white rounded-lg hover:brightness-110 transition-all duration-200 flex items-center justify-center mt-2 lg:mt-0"
                        data-cta="faq"
                        style={{ width: '209px', height: '48px' }}
                    >
                        {t('nav.joinAugo')}
                    </a>
                </div>

                {/* Right: FAQ */}
                <div className="flex flex-col gap-6 w-full">
                    <h3 className="font-satoshi font-bold text-[32px] sm:text-[40px] leading-[130%] text-[#969EA7] text-left">
                        {t('faq.title')}
                    </h3>
                    <div className="flex flex-col gap-[10px]">
                        {faqItems.map((faq, index) => {
                            const isOpen = openIndex === index
                            return (
                                <div
                                    key={index}
                                    className="rounded-lg transition-colors duration-150"
                                    style={{ backgroundColor: '#151515' }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#1c1c1c'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#151515'
                                    }}
                                >
                                    <button
                                        onClick={() => handleToggle(index)}
                                        className="w-full flex items-center justify-between py-4 px-6 cursor-pointer text-left"
                                    >
                                        <span className="font-satoshi font-medium text-[16px] leading-[130%] text-white">
                                            {faq.question}
                                        </span>
                                        <img
                                            src={isOpen ? minusIcon : addIcon}
                                            alt={isOpen ? 'Collapse' : 'Expand'}
                                            className="w-7 h-7 flex-shrink-0 ml-4 transition-transform duration-500 ease-in-out"
                                        />
                                    </button>
                                    <div
                                        ref={(el) => { contentRefs.current[index] = el }}
                                        className="overflow-hidden transition-[max-height] duration-500 ease-in-out"
                                        style={{ maxHeight: isOpen ? '1000px' : '0px' }}
                                    >
                                        <div
                                            className="px-6 pb-4 font-satoshi font-normal text-[16px] leading-[130%] text-[#969EA7] transition-opacity duration-350 ease-in-out"
                                            style={{
                                                opacity: isOpen ? 1 : 0,
                                                transitionDelay: isOpen ? '150ms' : '0ms',
                                            }}
                                        >
                                            {faq.answer}
                                            {faq.linkText && (
                                                <>
                                                    <br />
                                                    <a href={`/${currentLang}/join`} className="font-satoshi font-bold text-[16px] leading-[130%] underline hover:text-white transition-colors">
                                                        {faq.linkText}
                                                    </a>{' '}
                                                    {currentLang === 'en' ? 'to secure your spot.' : currentLang === 'de' ? 'um deinen Platz zu sichern.' : 'para garantir sua vaga.'}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
