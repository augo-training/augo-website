import { useState, useCallback } from 'react'
import addIcon from '../../assets/images/add.svg'
import minusIcon from '../../assets/images/minus.svg'
import { trackFaqExpanded } from '../../utils/analytics'
import { COPY } from './constants'

export default function RacingTeamFaq() {
    const { faq } = COPY
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const handleToggle = useCallback(
        (index: number) => {
            if (openIndex === index) {
                setOpenIndex(null)
            } else {
                setOpenIndex(index)
                void trackFaqExpanded({ question: faq.items[index].question, page: 'racing_team', question_index: index })
            }
        },
        [openIndex, faq.items],
    )

    return (
        <section id="racing-team-faq" aria-labelledby="racing-team-faq-title" className="w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark-800 border-t border-white/[0.06] texture-grain">
            <div className="max-w-[800px] mx-auto flex flex-col gap-8">
                <h2 id="racing-team-faq-title" className="font-mono font-bold text-[28px] sm:text-[36px] leading-[120%] text-white text-center">
                    {faq.title}
                </h2>
                <div className="flex flex-col gap-[10px]">
                    {faq.items.map((item, index) => {
                        const isOpen = openIndex === index
                        return (
                            <div
                                key={item.question}
                                className="rounded-lg bg-[#151515] hover:bg-[#1c1c1c] transition-colors duration-150"
                            >
                                <button
                                    type="button"
                                    onClick={() => handleToggle(index)}
                                    aria-expanded={isOpen}
                                    className="w-full flex items-center justify-between py-4 px-6 cursor-pointer text-left"
                                >
                                    <span className="font-satoshi font-medium text-[16px] leading-[130%] text-white">
                                        {item.question}
                                    </span>
                                    <img
                                        src={isOpen ? minusIcon : addIcon}
                                        alt={isOpen ? 'Collapse' : 'Expand'}
                                        className="w-7 h-7 flex-shrink-0 ml-4 transition-transform duration-500 ease-in-out"
                                    />
                                </button>
                                <div
                                    className="overflow-hidden transition-[max-height] duration-500 ease-in-out"
                                    style={{ maxHeight: isOpen ? '1000px' : '0px' }}
                                >
                                    <div
                                        className="px-6 pb-4 font-satoshi font-normal text-[16px] leading-[150%] text-text-muted transition-opacity duration-350 ease-in-out"
                                        style={{
                                            opacity: isOpen ? 1 : 0,
                                            transitionDelay: isOpen ? '150ms' : '0ms',
                                        }}
                                    >
                                        {item.answer}
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
