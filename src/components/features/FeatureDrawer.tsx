import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import FeatureDetail from './FeatureDetail'
import FeaturesDevices from './FeaturesDevices'
import FeaturesIntegrations from './FeaturesIntegrations'
import { SECTION_IDS, type FeatureItem } from './constants'

export interface Panel {
    id: string
    title: string
    /** A feature's copy; Devices and Integrations have their own layouts and leave this out. */
    item?: FeatureItem
}

/**
 * The side panel every tile and search result opens. All panels are always in
 * the DOM, closed ones `hidden`, so the prerendered HTML carries every
 * feature in full for search engines and AI crawlers; only the open one shows.
 * Full screen on phones, a 600px drawer from the right on larger screens.
 */
export default function FeatureDrawer({
    panels,
    openId,
    onOpen,
    onClose,
}: {
    panels: Panel[]
    openId: string | null
    onOpen: (id: string) => void
    onClose: () => void
}) {
    const { t } = useTranslation()
    const scroller = useRef<HTMLDivElement>(null)
    const closeButton = useRef<HTMLButtonElement>(null)
    const open = openId !== null
    const index = panels.findIndex((p) => p.id === openId)
    const next = index >= 0 ? panels[(index + 1) % panels.length] : undefined

    // Lock the page behind, close on Escape, and start each panel at its top.
    useEffect(() => {
        if (!open) return
        const root = document.documentElement
        const previous = root.style.overflow
        root.style.overflow = 'hidden'
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
        window.addEventListener('keydown', onKey)
        return () => {
            root.style.overflow = previous
            window.removeEventListener('keydown', onKey)
        }
    }, [open, onClose])

    useEffect(() => {
        if (!openId) return
        scroller.current?.scrollTo({ top: 0 })
        closeButton.current?.focus({ preventScroll: true })
    }, [openId])

    return (
        <div className={`fixed inset-0 z-[90] ${open ? '' : 'pointer-events-none'}`} inert={!open}>
            <div
                aria-hidden
                onClick={onClose}
                className={`absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
            />
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={openId ? `${openId}-title` : undefined}
                className={`absolute right-0 top-0 h-full w-full sm:w-[min(600px,92vw)] bg-[#0D0D0D] sm:border-l border-white/[0.08] shadow-[-24px_0_60px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-out ${
                    open ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div ref={scroller} className="h-full overflow-y-auto overscroll-contain">
                    <div className="sticky top-0 z-10 flex justify-end px-4 sm:px-6 py-3 bg-[#0D0D0D]/90 backdrop-blur">
                        <button
                            ref={closeButton}
                            type="button"
                            onClick={onClose}
                            aria-label={t('features.panel.close')}
                            className="w-10 h-10 rounded-full border border-white/[0.14] text-white/80 hover:text-white hover:border-white/40 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                        >
                            <svg aria-hidden viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6 6l12 12M18 6 6 18" />
                            </svg>
                        </button>
                    </div>

                    <div className="px-5 sm:px-8 pb-12">
                        {panels.map((panel) => (
                            <article key={panel.id} id={panel.id} aria-labelledby={`${panel.id}-title`} hidden={panel.id !== openId}>
                                {panel.id === SECTION_IDS.devices ? (
                                    <FeaturesDevices />
                                ) : panel.id === SECTION_IDS.integrations ? (
                                    <FeaturesIntegrations />
                                ) : (
                                    panel.item && <FeatureDetail item={panel.item} />
                                )}
                            </article>
                        ))}

                        {next && (
                            <a
                                href={`#${next.id}`}
                                onClick={(e) => {
                                    e.preventDefault()
                                    onOpen(next.id)
                                }}
                                className="mt-12 flex items-center justify-between gap-4 rounded-xl border border-white/[0.1] px-5 py-4 hover:border-white/30 transition-colors"
                            >
                                <span>
                                    <span className="block font-mono text-[11px] tracking-[2px] uppercase text-white/45">
                                        {t('features.panel.next')}
                                    </span>
                                    <span className="block mt-1 font-satoshi font-medium text-[16px] text-white">{next.title}</span>
                                </span>
                                <span aria-hidden className="text-white/60 text-[20px]">→</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
