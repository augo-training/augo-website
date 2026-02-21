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
            <div className="relative z-10 w-full max-w-[1200px] mx-auto px-8 py-32 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                {/* Left: Text */}
                <div className="flex flex-col gap-8">
                    <h1 ref={headlineRef} className="font-mono font-bold text-[40px] leading-[130%] text-white">
                        Join the community of
                        <br />
                        coaches & athletes
                        <br />
                        who are looking for a
                        <br />
                        new standard
                    </h1>
                    <p ref={bodyRef} className="font-satoshi font-medium text-[18px] leading-[130%] text-[#969EA7] max-w-[420px]">
                        Join the waitlist and be first to experience the
                        intelligent assistant that helps you provide the best
                        service for the athletes you coach.
                    </p>
                </div>

                {/* Right: Form placeholder with animated border + glow */}
                <div ref={formRef} className="flex justify-center md:justify-end">
                    <div className="join-form-wrapper relative">
                        {/* Pulsing glow behind */}
                        <div className="join-form-glow absolute -inset-16 rounded-2xl pointer-events-none" />

                        {/* Rotating gradient border */}
                        <div className="join-form-border relative rounded-xl p-[3px]">
                            {/* Inner container (form will be embedded here) */}
                            <div className="join-form-inner rounded-xl bg-[#0A0A0A] px-8 py-10 min-h-[420px] min-w-[380px] flex flex-col items-center justify-center gap-4">
                                <p className="font-satoshi font-medium text-[16px] text-[#969EA7] text-center">
                                    Fill in this form to join augo waitlist
                                </p>
                                <div className="w-full h-[1px] bg-[#2D2D2D] my-2" />
                                <p className="font-satoshi text-[14px] text-[#555] text-center italic">
                                    Form embed will be placed here
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
