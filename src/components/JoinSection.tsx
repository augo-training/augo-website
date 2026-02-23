import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import bgImage from '../assets/images/bg_section_1.webp'

export default function JoinSection() {
    const sectionRef = useRef<HTMLElement>(null)
    const bgOverlayRef = useRef<HTMLDivElement>(null)
    const headlineRef = useRef<HTMLHeadingElement>(null)
    const boldTextRef = useRef<HTMLParagraphElement>(null)
    const bodyRef = useRef<HTMLParagraphElement>(null)
    const formRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches

        const isMobile = window.innerWidth < 768
        const slideDistance = isMobile ? 15 : 20

        // Initial states
        if (headlineRef.current) gsap.set(headlineRef.current, { opacity: 0, y: slideDistance })
        if (boldTextRef.current) gsap.set(boldTextRef.current, { opacity: 0, y: slideDistance })
        if (bodyRef.current) gsap.set(bodyRef.current, { opacity: 0 })
        if (formRef.current) gsap.set(formRef.current, { opacity: 0, y: slideDistance })
        if (bgOverlayRef.current) gsap.set(bgOverlayRef.current, { opacity: 0 })

        if (prefersReducedMotion) {
            if (headlineRef.current) gsap.set(headlineRef.current, { opacity: 1, y: 0 })
            if (boldTextRef.current) gsap.set(boldTextRef.current, { opacity: 1, y: 0 })
            if (bodyRef.current) gsap.set(bodyRef.current, { opacity: 1 })
            if (formRef.current) gsap.set(formRef.current, { opacity: 1, y: 0 })
            if (bgOverlayRef.current) gsap.set(bgOverlayRef.current, { opacity: 0.3 })
            return
        }

        const ease = 'cubic-bezier(0.16, 1, 0.3, 1)'

        // Background radial fade in
        if (bgOverlayRef.current) {
            gsap.to(bgOverlayRef.current, {
                opacity: 0.3,
                duration: 1.2,
                ease: 'power2.out',
            })
        }

        // Headline: "Join the community…"
        if (headlineRef.current) {
            gsap.to(headlineRef.current, {
                opacity: 1,
                y: 0,
                duration: 1.6,
                ease,
            })
        }

        // Bold text: "who are looking for a new standard"
        if (boldTextRef.current) {
            gsap.to(boldTextRef.current, {
                opacity: 1,
                y: 0,
                duration: 1.6,
                delay: 0.15,
                ease,
            })
        }

        // Body text: fades in after headline
        if (bodyRef.current) {
            gsap.to(bodyRef.current, {
                opacity: 1,
                duration: 1,
                delay: 0.3,
                ease,
            })
        }

        // Form container: slide-up + fade-in
        if (formRef.current) {
            gsap.to(formRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: 0.2,
                ease,
            })
        }
    }, [])

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >

            {/* Content */}
            <div className="relative z-10 w-full max-w-[1200px] mx-auto px-5 sm:px-8 py-20 sm:py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left: Text */}
                <div className="flex flex-col gap-6 lg:gap-8 items-center lg:items-start text-center lg:text-left pt-10">
                    <h1 ref={headlineRef} className="font-mono font-bold text-[32px] sm:text-[44px] lg:text-[40px] xl:text-[48px] leading-[130%] text-white">
                        Join the community of
                        coaches & athletes who
                        are looking for a new
                        standard
                    </h1>
                    <p ref={bodyRef} className="font-satoshi font-medium text-[16px] sm:text-[18px] leading-[130%] text-[#969EA7] max-w-[420px] sm:max-w-[500px] lg:max-w-[420px]">
                        Join the waitlist and be first to experience the
                        intelligent assistant that helps you provide the best
                        service for the athletes you coach.
                    </p>
                </div>

                {/* Right: Form placeholder with animated border + glow */}
                <div ref={formRef} className="flex justify-center lg:justify-end w-full mt-4 lg:mt-0">
                    <div className="join-form-wrapper relative w-full max-w-[360px] sm:max-w-[420px]">
                        {/* Pulsing glow behind */}
                        <div className="join-form-glow absolute -inset-10 sm:-inset-16 rounded-[2rem] pointer-events-none" />

                        {/* Rotating gradient border */}
                        <div className="join-form-border relative rounded-[20px] sm:rounded-[24px] p-[2px] sm:p-[3px]">
                            {/* Inner container */}
                            <div className="join-form-inner rounded-[18px] sm:rounded-[21px] bg-[#0A0A0A] p-6 sm:p-8 w-full flex flex-col gap-6">
                                <p className="font-satoshi font-bold text-[18px] sm:text-[22px] leading-[130%] text-white text-left">
                                    Fill in this form to join<br className="hidden sm:block" /> augo waitlist
                                </p>

                                <div className="flex flex-col gap-3">
                                    <div className="w-full bg-[#1F1F1F] rounded-lg px-4 py-3 text-[#7B8289] text-[14px] sm:text-[15px] flex items-center justify-start border border-transparent shadow-inner">
                                        First name*
                                    </div>
                                    <div className="w-full bg-[#1F1F1F] rounded-lg px-4 py-3 text-[#7B8289] text-[14px] sm:text-[15px] flex items-center justify-start border border-transparent shadow-inner">
                                        Last name*
                                    </div>
                                    <div className="w-full bg-[#1F1F1F] rounded-lg px-4 py-3 text-[#7B8289] text-[14px] sm:text-[15px] flex items-center justify-between border border-transparent shadow-inner">
                                        <span>You are...</span>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M4 6L8 10L12 6" stroke="#7B8289" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="w-full bg-[#1F1F1F] rounded-lg px-4 py-3 text-[#7B8289] text-[14px] sm:text-[15px] flex items-center justify-start border border-transparent shadow-inner">
                                        Email*
                                    </div>
                                    <div className="w-full bg-[#1F1F1F] rounded-lg px-4 py-3 text-[#7B8289] text-[14px] sm:text-[15px] h-24 sm:h-28 flex items-start justify-start border border-transparent shadow-inner">
                                        Message (Optional)
                                    </div>
                                </div>

                                <button className="w-full bg-white text-[#0A0A0A] font-mono font-bold text-[14px] sm:text-[16px] tracking-[2px] uppercase py-3 sm:py-4 rounded flex items-center justify-center hover:scale-[1.02] transition-transform duration-300">
                                    JOIN AUGO
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
