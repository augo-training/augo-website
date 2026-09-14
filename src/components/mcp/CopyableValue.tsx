import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, Copy } from 'lucide-react'
import { trackCtaClicked } from '../../utils/analytics'

interface CopyableValueProps {
    /** The exact string copied and displayed. */
    value: string
    /** Mono label above the value, e.g. "augo MCP server URL". */
    label?: string
    /** Where this instance lives, for analytics: 'hero', 'claude', 'prompt'. */
    trackingLocation: string
    /** 'block' = bordered row (the server URL). 'inline' = a prompt line. */
    variant?: 'block' | 'inline'
}

/**
 * A value with a copy button. The page's whole purpose is getting one URL into
 * another app's text field, so this is the most load-bearing control on it.
 *
 * Three tiers of fallback: the async clipboard API, then execCommand on an
 * offscreen textarea (http and older Safari), then selecting the text in place
 * so the reader can press Cmd-C. A dead button with no explanation is the one
 * outcome worth engineering around.
 */
export default function CopyableValue({
    value,
    label,
    trackingLocation,
    variant = 'block',
}: CopyableValueProps) {
    const { t } = useTranslation()
    const [copied, setCopied] = useState(false)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const textRef = useRef<HTMLSpanElement>(null)

    // Clear the reset timer on unmount so a late setState never lands on a
    // component that is already gone.
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [])

    const copy = useCallback(async () => {
        let ok = false

        // Undefined outside a secure context, and can reject when the document
        // is not focused. Both fail silently otherwise.
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(value)
                ok = true
            }
        } catch {
            ok = false
        }

        if (!ok) {
            try {
                const textarea = document.createElement('textarea')
                textarea.value = value
                textarea.setAttribute('readonly', '')
                textarea.style.position = 'fixed'
                textarea.style.opacity = '0'
                document.body.appendChild(textarea)
                textarea.select()
                ok = document.execCommand('copy')
                document.body.removeChild(textarea)
            } catch {
                ok = false
            }
        }

        if (!ok && textRef.current) {
            // Last resort: select it so the keyboard shortcut works.
            const range = document.createRange()
            range.selectNodeContents(textRef.current)
            const selection = window.getSelection()
            selection?.removeAllRanges()
            selection?.addRange(range)
        }

        setCopied(ok)
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => setCopied(false), 2000)

        void trackCtaClicked({
            cta_text: 'copy',
            cta_location: `mcp_${trackingLocation}`,
            destination: value,
        })
    }, [value, trackingLocation])

    const isBlock = variant === 'block'

    return (
        <div className={isBlock ? 'mt-5 sm:mt-6' : ''}>
            {label && (
                <p className="font-mono text-[11px] sm:text-[12px] tracking-[2.5px] uppercase text-white/55 mb-2">
                    {label}
                </p>
            )}
            <div
                className={`flex items-center gap-3 rounded-lg border border-white/[0.12] bg-dark-800 ${
                    isBlock ? 'px-4 py-3.5' : 'px-3.5 py-3'
                }`}
            >
                <span
                    ref={textRef}
                    className={`flex-1 min-w-0 break-all text-white/85 ${
                        isBlock
                            ? 'font-mono text-[13px] sm:text-[14px] leading-[150%]'
                            : 'font-satoshi text-[15px] sm:text-[16px] leading-[150%]'
                    }`}
                >
                    {value}
                </span>
                <button
                    type="button"
                    onClick={copy}
                    aria-label={`${t('mcp.copy.label')} — ${value}`}
                    className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-md border border-white/20 px-2.5 py-1.5 font-mono text-[11px] tracking-[1.5px] uppercase text-white/70 transition-colors duration-200 hover:text-white hover:border-white/40 cursor-pointer"
                >
                    {copied ? (
                        <Check aria-hidden="true" strokeWidth={2} className="w-3.5 h-3.5" />
                    ) : (
                        <Copy aria-hidden="true" strokeWidth={2} className="w-3.5 h-3.5" />
                    )}
                    <span className="hidden sm:inline">
                        {copied ? t('mcp.copy.copied') : t('mcp.copy.label')}
                    </span>
                </button>
            </div>
            {/* Persistent live region. Mounting it with its content would not be
                announced reliably. Mirrors InquirySentToast. */}
            <span role="status" aria-live="polite" className="sr-only">
                {copied ? t('mcp.copy.announce') : ''}
            </span>
        </div>
    )
}
