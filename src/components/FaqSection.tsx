import { useState, useRef, useCallback } from 'react'
import bgSection from '../assets/images/bg_section_1.webp'
import addIcon from '../assets/images/add.svg'
import minusIcon from '../assets/images/minus.svg'

const faqData = [
    {
        question: 'When is augo launching?',
        answer: (
            <>
                augo is available on the App Store and Google Play for a select group of Beta users as of November 2025. augo will become generally available to all users in March 2026. Access will be released in waves and users on the waitlist will have special pricing. Athletes can join through their coach.
                <br />
                <a href="/join" className="font-satoshi font-bold text-[16px] leading-[130%] underline hover:text-white transition-colors">
                    Join the waitlist
                </a>{' '}
                to secure your spot.
            </>
        ),
    },
    {
        question: 'How much does augo cost?',
        answer: 'augo offers flexible pricing plans designed for both coaches and athletes. Waitlist members will receive special early-access pricing. Visit our pricing page or join the waitlist for the latest details.',
    },
    {
        question: 'What are the benefits of joining the waitlist?',
        answer: 'Joining the waitlist gives you priority access to augo, special introductory pricing, and the opportunity to shape the product with your feedback during the early-access phase.',
    },
    {
        question: 'Will augo replace coaches?',
        answer: 'No. augo is designed to empower coaches, not replace them. It automates repetitive tasks and surfaces actionable insights so coaches can focus on strategy, relationships, and what they do best.',
    },
    {
        question: 'Can athletes use augo without a coach?',
        answer: 'Athletes can join augo through their coach. The platform is built around the coach-athlete relationship, enhancing communication and providing data-driven insights for both.',
    },
    {
        question: "How does augo's AI analyze workouts?",
        answer: "augo\u2019s AI processes workout data from popular devices and platforms, combining performance metrics with contextual information to deliver personalized insights and recommendations.",
    },
    {
        question: 'Why choose augo over AI coaching apps?',
        answer: 'Unlike standalone AI coaching apps, augo keeps the human coach at the center. It combines the power of AI analysis with human expertise, context, and the personal connection that drives athlete success.',
    },
    {
        question: 'How does augo handle my data?',
        answer: 'Your data privacy and security are our top priorities. augo uses industry-standard encryption and never shares your personal data with third parties. You remain in full control of your information.',
    },
]

export default function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)
    const [isAnimating, setIsAnimating] = useState(false)
    const contentRefs = useRef<(HTMLDivElement | null)[]>([])

    const handleToggle = useCallback(
        (index: number) => {
            if (isAnimating) return

            if (openIndex === index) {
                // Close current item
                setIsAnimating(true)
                setOpenIndex(null)
                setTimeout(() => setIsAnimating(false), 500)
            } else if (openIndex !== null) {
                // Sequential: close current, wait, open new
                setIsAnimating(true)
                setOpenIndex(null)
                setTimeout(() => {
                    setOpenIndex(index)
                    setTimeout(() => setIsAnimating(false), 500)
                }, 800) // 500ms close + 300ms wait
            } else {
                // Nothing closes, just open
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
                        A new standard
                        <br />
                        for endurance
                        <br />
                        coaching
                    </h2>
                    <p className="font-satoshi font-medium text-[16px] sm:text-[18px] leading-[130%] text-[#969EA7] max-w-[500px] lg:max-w-none">
                        The intelligent assistant that combines data with
                        <br className="hidden lg:block" />
                        {' '}human context, turning insights into action and
                        <br className="hidden lg:block" />
                        {' '}giving you time for what matters most.
                    </p>
                    <a
                        href="/join"
                        className="btn-gradient font-mono text-sm font-extrabold tracking-[2px] uppercase text-white rounded-lg hover:brightness-110 transition-all duration-200 flex items-center justify-center mt-2 lg:mt-0"
                        data-cta="faq"
                        style={{ width: '209px', height: '48px' }}
                    >
                        Join Augo
                    </a>
                </div>

                {/* Right: FAQ */}
                <div className="flex flex-col gap-6 w-full">
                    <h3 className="font-satoshi font-bold text-[32px] sm:text-[40px] leading-[130%] text-[#969EA7] text-left">
                        FAQ
                    </h3>
                    <div className="flex flex-col gap-[10px]">
                        {faqData.map((faq, index) => {
                            const isOpen = openIndex === index
                            return (
                                <div
                                    key={index}
                                    className="rounded-lg transition-colors duration-150"
                                    style={{
                                        backgroundColor: '#151515',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor =
                                            '#1c1c1c'
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
                                        ref={(el) => {
                                            contentRefs.current[index] = el
                                        }}
                                        className="overflow-hidden transition-[max-height] duration-500 ease-in-out"
                                        style={{
                                            maxHeight: isOpen ? '1000px' : '0px',
                                        }}
                                    >
                                        <div
                                            className="px-6 pb-4 font-satoshi font-normal text-[16px] leading-[130%] text-[#969EA7] transition-opacity duration-350 ease-in-out"
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
            </div>
        </section>
    )
}
