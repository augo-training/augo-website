import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { trackFloatingButtonClicked } from '../utils/analytics'

function AugoIcon({ className }: { className?: string }) {
    return (
        <svg
            width="17"
            height="20"
            viewBox="0 0 17 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M11.5761 5.14454V0H4.41782H1.27148L1.27148 5.14454H6.42378H11.5761Z"
                fill="currentColor"
            />
            <path
                d="M16.7285 7.58007V5.14423H11.5762V7.58007H7.6605C5.1874 7.58007 3.29136 8.08919 1.97543 9.1059C0.657966 10.1241 0 11.5814 0 13.4791C0 15.2397 0.555684 16.6345 1.66553 17.6634C2.77537 18.6923 4.28212 19.2075 6.18275 19.2075C7.87728 19.2075 9.23443 18.7898 10.2527 17.956C10.9641 17.3722 11.4282 16.6467 11.6419 15.7778H11.7472V18.8645H16.7285V7.58007ZM11.5762 12.5188C11.5762 13.3877 11.2495 14.0919 10.5977 14.6285C9.9443 15.1666 9.11535 15.4348 8.1078 15.4348C7.19183 15.4348 6.46975 15.2123 5.94307 14.7657C5.41639 14.319 5.15382 13.7078 5.15382 12.9304C5.15382 12.1987 5.39349 11.6103 5.8759 11.1637C6.35678 10.7171 6.98574 10.4946 7.76584 10.4946H11.5793V12.5188H11.5762Z"
                fill="currentColor"
            />
        </svg>
    )
}

interface FloatingButtonProps {
    onClick?: () => void
}

const RING_GRADIENT = 'linear-gradient(83.9deg, #151515 -4%, #C50017 38.22%, #FF5514 69.06%, #FFCA1E 99.9%)'

export default function FloatingButton({ onClick }: FloatingButtonProps) {
    const btnRef = useRef<HTMLButtonElement>(null)
    const [showTooltip, setShowTooltip] = useState(false)
    const [hovered, setHovered] = useState(false)
    const [showRing, setShowRing] = useState(false)
    const { t } = useTranslation()

    // Entrance animation + tooltip + ring timing
    useEffect(() => {
        const btn = btnRef.current
        if (!btn) return

        btn.style.opacity = '0'
        btn.style.transform = 'scale(0.8)'

        const entranceTimer = setTimeout(() => {
            btn.style.transition = 'opacity 400ms ease-in-out, transform 400ms ease-in-out'
            btn.style.opacity = '1'
            btn.style.transform = 'scale(1)'
            setShowRing(true)
        }, 2000)

        const tooltipShowTimer = setTimeout(() => {
            setShowTooltip(true)
            setTimeout(() => setShowTooltip(false), 3000)
        }, 2500)

        const ringStopTimer = setTimeout(() => {
            setShowRing(false)
        }, 8000)

        return () => {
            clearTimeout(entranceTimer)
            clearTimeout(tooltipShowTimer)
            clearTimeout(ringStopTimer)
        }
    }, [])

    const tooltipVisible = showTooltip || hovered

    return (
        <button
            ref={btnRef}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => {
                trackFloatingButtonClicked({ page: window.location.pathname })
                onClick?.()
            }}
            className="floating-app-btn fixed z-50 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl cursor-pointer bottom-6 right-5 sm:bottom-12 sm:right-12"
            aria-label="Watch video"
        >
            {/* Tooltip */}
            <div
                className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-opacity duration-300 pointer-events-none"
                style={{
                    opacity: tooltipVisible ? 1 : 0,
                    background: 'rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(8px)',
                }}
            >
                {t('floatingButton.label')}
            </div>

            {/* Pulsing ring */}
            {showRing && (
                <span
                    className="absolute inset-0 rounded-xl sm:rounded-2xl animate-ping opacity-60"
                    style={{ background: RING_GRADIENT }}
                />
            )}

            <AugoIcon className="w-[24px] h-[24px] sm:w-[28px] sm:h-[28px] relative z-10" />
        </button>
    )
}
