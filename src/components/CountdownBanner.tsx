import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { gsap } from 'gsap'

interface TimeLeft {
    days: number
    hours: number
    minutes: number
    seconds: number
}

interface CountdownBannerProps {
    targetDate: Date
    onComplete?: () => void
}

function calculateTimeLeft(targetDate: Date): TimeLeft | null {
    const now = new Date()
    const difference = targetDate.getTime() - now.getTime()

    if (difference <= 0) {
        return null
    }

    return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
    }
}

function padNumber(num: number): string {
    return num.toString().padStart(2, '0')
}

export default function CountdownBanner({ targetDate, onComplete }: CountdownBannerProps) {
    const { t } = useTranslation()
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() => calculateTimeLeft(targetDate))
    const bannerRef = useRef<HTMLDivElement>(null)
    const hasAnimated = useRef(false)

    // Update countdown every second
    useEffect(() => {
        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft(targetDate)
            setTimeLeft(newTimeLeft)

            if (newTimeLeft === null) {
                clearInterval(timer)
                onComplete?.()
            }
        }, 1000)

        return () => clearInterval(timer)
    }, [targetDate, onComplete])

    // GSAP entrance animation
    useEffect(() => {
        const banner = bannerRef.current
        if (!banner || hasAnimated.current) return

        hasAnimated.current = true
        gsap.set(banner, { opacity: 0, y: -20 })

        gsap.to(banner, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            delay: 0.3,
        })
    }, [])

    // Hide component when countdown is complete
    if (timeLeft === null) {
        return null
    }

    return (
        <div
            ref={bannerRef}
            className="countdown-banner fixed left-0 right-0 z-50"
            style={{
                top: '72px',
            }}
        >
            <div className="w-full px-3 sm:px-6 py-1.5 sm:py-4">
                <div className="flex items-center justify-center">
                    {/* Countdown numbers */}
                    <div className="flex items-center gap-2 sm:gap-4 lg:gap-5">
                        {/* Days */}
                        <div className="flex items-baseline gap-0.5 sm:gap-1">
                            <span className="countdown-number font-mono text-[16px] sm:text-[28px] lg:text-[32px] font-bold tabular-nums">
                                {padNumber(timeLeft.days)}
                            </span>
                            <span className="font-mono text-[8px] sm:text-[11px] lg:text-[12px] tracking-[1px] uppercase text-text-muted">
                                {t('countdown.days')}
                            </span>
                        </div>

                        <span className="text-white/40 font-mono text-[12px] sm:text-[20px] lg:text-[24px]">:</span>

                        {/* Hours */}
                        <div className="flex items-baseline gap-0.5 sm:gap-1">
                            <span className="countdown-number font-mono text-[16px] sm:text-[28px] lg:text-[32px] font-bold tabular-nums">
                                {padNumber(timeLeft.hours)}
                            </span>
                            <span className="font-mono text-[8px] sm:text-[11px] lg:text-[12px] tracking-[1px] uppercase text-text-muted">
                                {t('countdown.hrs')}
                            </span>
                        </div>

                        <span className="text-white/40 font-mono text-[12px] sm:text-[20px] lg:text-[24px]">:</span>

                        {/* Minutes */}
                        <div className="flex items-baseline gap-0.5 sm:gap-1">
                            <span className="countdown-number font-mono text-[16px] sm:text-[28px] lg:text-[32px] font-bold tabular-nums">
                                {padNumber(timeLeft.minutes)}
                            </span>
                            <span className="font-mono text-[8px] sm:text-[11px] lg:text-[12px] tracking-[1px] uppercase text-text-muted">
                                {t('countdown.mins')}
                            </span>
                        </div>

                        <span className="text-white/40 font-mono text-[12px] sm:text-[20px] lg:text-[24px]">:</span>

                        {/* Seconds */}
                        <div className="flex items-baseline gap-0.5 sm:gap-1">
                            <span className="countdown-number font-mono text-[16px] sm:text-[28px] lg:text-[32px] font-bold tabular-nums">
                                {padNumber(timeLeft.seconds)}
                            </span>
                            <span className="font-mono text-[8px] sm:text-[11px] lg:text-[12px] tracking-[1px] uppercase text-text-muted">
                                {t('countdown.secs')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
