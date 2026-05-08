import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import addIcon from '../../assets/images/add.svg'
import minusIcon from '../../assets/images/minus.svg'
import { trackFaqExpanded } from '../../utils/analytics'

export default function HumanEdgeFaq() {
    const { t } = useTranslation()
    const items = t('humanEdge.faq.items', { returnObjects: true }) as Array<{
        question: string
        answer: string
    }>

    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const handleToggle = useCallback(
        (index: number) => {
            if (openIndex === index) {
                setOpenIndex(null)
            } else {
                setOpenIndex(index)
                trackFaqExpanded({ question: items[index].question, page: 'human_edge' })
            }
        },
        [openIndex, items],
    )

    return (
        <section className="w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark-800">
            <div className="max-w-[800px] mx-auto flex flex-col gap-8">
                <h2 className="font-mono font-bold text-[28px] sm:text-[36px] leading-[120%] text-white text-center">
                    {t('humanEdge.faq.title')}
                </h2>
                <div className="flex flex-col gap-[10px]">
                    {items.map((faq, index) => {
                        const isOpen = openIndex === index
                        return (
                            <div
                                key={index}
                                className="rounded-lg transition-colors duration-150"
                                style={{ backgroundColor: '#151515' }}
                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1c1c1c' }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#151515' }}
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
                                    className="overflow-hidden transition-[max-height] duration-500 ease-in-out"
                                    style={{ maxHeight: isOpen ? '400px' : '0px' }}
                                >
                                    <div
                                        className="px-6 pb-4 font-satoshi font-normal text-[16px] leading-[150%] text-text-muted transition-opacity duration-350 ease-in-out"
                                        style={{
                                            opacity: isOpen ? 1 : 0,
                                            transitionDelay: isOpen ? '150ms' : '0ms',
                                        }}
                                    >
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
