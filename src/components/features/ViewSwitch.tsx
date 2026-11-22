import { useRef, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { SECTION_IDS, type FeaturesView } from './constants'

const VIEWS: { view: FeaturesView; key: 'guide' | 'week'; panel: string }[] = [
    { view: 'guide', key: 'guide', panel: SECTION_IDS.guide },
    { view: 'week', key: 'week', panel: SECTION_IDS.week },
]

/**
 * The "By feature / By coaching week" switch. Sticky just under the fixed
 * Navbar, so a coach can flip views from anywhere in either one.
 */
export default function ViewSwitch({
    view,
    onChange,
}: {
    view: FeaturesView
    onChange: (view: FeaturesView) => void
}) {
    const { t } = useTranslation()
    const tabs = useRef<(HTMLButtonElement | null)[]>([])

    // Arrow keys move between tabs, as the tabs pattern expects.
    const onKeyDown = (e: KeyboardEvent, i: number) => {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
        e.preventDefault()
        const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + VIEWS.length) % VIEWS.length
        tabs.current[next]?.focus()
        onChange(VIEWS[next].view)
    }

    return (
        <div className="features-switch sticky z-40 bg-[#090909]/95 backdrop-blur border-b border-white/[0.06] px-5 sm:px-8 py-3">
            <div className="max-w-[1200px] mx-auto">
                <div
                    role="tablist"
                    aria-label={t('features.switch.label')}
                    className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] sm:max-w-[560px]"
                >
                    {VIEWS.map(({ view: v, key, panel }, i) => {
                        const selected = view === v
                        return (
                            <button
                                key={v}
                                ref={(el) => { tabs.current[i] = el }}
                                type="button"
                                role="tab"
                                id={`${panel}-tab`}
                                aria-selected={selected}
                                aria-controls={panel}
                                tabIndex={selected ? 0 : -1}
                                onClick={() => onChange(v)}
                                onKeyDown={(e) => onKeyDown(e, i)}
                                className={`flex flex-col items-start text-left rounded-lg px-3 sm:px-4 py-2 transition-colors duration-200 ${
                                    selected ? 'bg-white text-[#0A0A0A]' : 'text-white/80 hover:text-white hover:bg-white/[0.06]'
                                }`}
                            >
                                <span className="font-satoshi font-bold text-[14px] sm:text-[16px] leading-[130%]">
                                    {t(`features.switch.${key}.title`)}
                                </span>
                                <span
                                    className={`font-satoshi text-[12px] sm:text-[13px] leading-[130%] ${
                                        selected ? 'text-[#0A0A0A]/60' : 'text-white/50'
                                    }`}
                                >
                                    {t(`features.switch.${key}.hint`)}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
