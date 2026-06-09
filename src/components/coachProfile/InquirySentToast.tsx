import { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'

interface Props {
    coachName: string
    onDismiss: () => void
}

export default function InquirySentToast({ coachName, onDismiss }: Props) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        // Slide in on next frame
        const id = requestAnimationFrame(() => setVisible(true))
        return () => cancelAnimationFrame(id)
    }, [])

    function dismiss() {
        setVisible(false)
        // Match transition duration
        window.setTimeout(onDismiss, 250)
    }

    return (
        <div
            role="status"
            aria-live="polite"
            className="fixed left-1/2 -translate-x-1/2 z-[70] px-4 w-full max-w-[520px]"
            style={{
                top: '88px',
                transform: `translateX(-50%) translateY(${visible ? '0' : '-20px'})`,
                opacity: visible ? 1 : 0,
                transition: 'opacity 250ms ease-out, transform 250ms ease-out',
            }}
        >
            <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-800 ring-1 ring-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            >
                <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(83.9deg, #C50017 0%, #FF5514 50%, #FFCA1E 100%)' }}
                >
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </span>
                <p className="font-satoshi text-[14px] sm:text-[15px] leading-[140%] text-white flex-1">
                    Sent to <span className="font-bold">{coachName}</span>.
                    <span className="text-white/55"> Replies within 48 hours.</span>
                </p>
                <button
                    type="button"
                    onClick={dismiss}
                    aria-label="Dismiss"
                    className="flex-shrink-0 text-white/45 hover:text-white transition-colors cursor-pointer bg-transparent border-0"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
