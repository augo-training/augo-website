/**
 * Drawn, not a screenshot: a lab report sliding into the augo assistant, with
 * the PDF attached in the input box. Every size is in container units (cqw),
 * so the one drawing scales from an index card up to a full feature section.
 * Text stays white, grey or ink on paper; the colour is in shapes only.
 */
export default function LabUploadVisual() {
    return (
        <div aria-hidden className="@container relative aspect-square h-full max-w-full mx-auto select-none">
            {/* The app: input box with attachments, then the tab bar */}
            <div className="absolute left-[6cqw] right-[6cqw] top-[50cqw] bottom-[6cqw] rounded-[3cqw] border border-white/[0.1] bg-[#0B0B0B] overflow-hidden flex flex-col">
                <div className="m-[3cqw] mb-0 rounded-[2.6cqw] bg-[#1B1B1B] p-[3cqw] flex flex-col gap-[2.6cqw]">
                    <div className="flex items-center gap-[2cqw]">
                        <div className="flex items-center gap-[2cqw] rounded-[1.8cqw] bg-white/[0.06] pl-[1.4cqw] pr-[2.4cqw] py-[1.4cqw]">
                            <div className="w-[5.6cqw] h-[5.6cqw] rounded-[1.2cqw] bg-gradient-to-br from-[#C80F25] to-[#FE5F21] flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="w-[3.2cqw] h-[3.2cqw]" fill="none" stroke="white" strokeWidth="2">
                                    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                                    <path d="M14 3v5h5M9 13h6M9 17h6" />
                                </svg>
                            </div>
                            <div className="leading-tight">
                                <p className="font-satoshi font-medium text-[2.6cqw] text-white">Robin_lab_test.pdf</p>
                                <p className="font-mono text-[1.6cqw] tracking-[0.3cqw] text-white/45">PDF · 3 PAGES</p>
                            </div>
                            <span className="ml-[1cqw] text-[2.6cqw] text-white/45">×</span>
                        </div>
                        {/* An attached photo: thumbnail of a chart */}
                        <div className="w-[8cqw] h-[8cqw] rounded-[1.6cqw] border border-white/[0.14] bg-[#151515] flex flex-col justify-center gap-[0.9cqw] px-[1.4cqw]">
                            <span className="block h-[0.9cqw] w-full rounded-full bg-[#2BB673]" />
                            <span className="block h-[0.9cqw] w-[70%] rounded-full bg-[#F5A623]" />
                            <span className="block h-[0.9cqw] w-[45%] rounded-full bg-[#3B82F6]" />
                        </div>
                    </div>
                    <p className="font-satoshi text-[2.8cqw] text-white/45">ask anything...</p>
                    <div className="flex items-center gap-[2cqw]">
                        <span className="w-[5cqw] h-[5cqw] rounded-[1.2cqw] bg-[#3A1612] flex items-center justify-center">
                            <svg viewBox="0 0 24 24" className="w-[2.8cqw] h-[2.8cqw]" fill="none" stroke="white" strokeWidth="2">
                                <path d="m21 11-8.5 8.5a5 5 0 0 1-7-7L14 4a3.3 3.3 0 0 1 4.7 4.7L10.2 17.2a1.7 1.7 0 0 1-2.4-2.4L15.5 7" />
                            </svg>
                        </span>
                        <svg viewBox="0 0 24 24" className="w-[3cqw] h-[3cqw]" fill="none" stroke="white" strokeWidth="2">
                            <rect x="9" y="3" width="6" height="11" rx="3" />
                            <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
                        </svg>
                        <span className="rounded-[1cqw] bg-white/[0.08] px-[1.6cqw] py-[0.8cqw] font-satoshi font-medium text-[2.2cqw] text-white">EN</span>
                        <span className="ml-auto w-[7cqw] h-[6cqw] rounded-[1.6cqw] bg-white flex items-center justify-center">
                            <svg viewBox="0 0 24 24" className="w-[3cqw] h-[3cqw]" fill="none" stroke="#0A0A0A" strokeWidth="2.4">
                                <path d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                        </span>
                    </div>
                </div>
                <div className="mt-auto grid grid-cols-3 bg-black py-[2.4cqw]">
                    {['Home', 'Chats', 'Assistant'].map((tab) => (
                        <span
                            key={tab}
                            className={`text-center font-satoshi text-[2.4cqw] ${tab === 'Assistant' ? 'text-white font-medium' : 'text-white/55'}`}
                        >
                            {tab}
                        </span>
                    ))}
                </div>
            </div>

            {/* The lab report, tilted, on its way in */}
            <div className="absolute right-[3cqw] top-[5cqw] w-[40cqw] rotate-[5deg] rounded-[1.8cqw] bg-[#F1EFE9] p-[3.2cqw] shadow-[0_3cqw_8cqw_rgba(0,0,0,0.55)]">
                <div className="flex justify-between font-mono text-[1.5cqw] tracking-[0.35cqw] text-[#6B6B6B]">
                    <span>PERFORMANCE LAB</span>
                    <span>1 / 3</span>
                </div>
                <p className="mt-[1.6cqw] font-satoshi font-bold text-[3.6cqw] leading-none text-[#111]">VO2max test</p>
                <p className="mt-[0.8cqw] font-satoshi text-[1.7cqw] text-[#555]">Robin K. · Treadmill</p>
                <div className="mt-[2cqw] border-t border-black/10 pt-[1.6cqw] flex flex-col gap-[0.9cqw]">
                    {[
                        ['VO2max', '58.2 ml/kg/min'],
                        ['VT1', '5:00 /km · 144 bpm'],
                        ['VT2', '4:08 /km · 168 bpm'],
                        ['HR max', '189 bpm'],
                    ].map(([label, value]) => (
                        <div key={label} className="flex justify-between gap-[2cqw]">
                            <span className="font-satoshi text-[1.7cqw] text-[#444]">{label}</span>
                            <span className="font-mono text-[1.7cqw] text-[#111] whitespace-nowrap">{value}</span>
                        </div>
                    ))}
                </div>
                <svg viewBox="0 0 200 60" className="mt-[2cqw] w-full" fill="none">
                    <path d="M0 20h200M0 40h200" stroke="#000" strokeOpacity="0.07" />
                    <path d="M58 6v52M142 6v52" stroke="#C80F25" strokeDasharray="3 3" strokeOpacity="0.8" />
                    <path d="M0 48C50 46 90 40 130 32s50-10 70-11" stroke="#111" strokeWidth="2" />
                    <path d="M0 52C55 50 95 44 135 35s45-6 65-6" stroke="#C80F25" strokeWidth="2" />
                </svg>
                <div className="mt-[1.6cqw] flex flex-col gap-[0.8cqw]">
                    <span className="block h-[0.7cqw] w-full rounded-full bg-black/10" />
                    <span className="block h-[0.7cqw] w-[70%] rounded-full bg-black/10" />
                </div>
            </div>
        </div>
    )
}
