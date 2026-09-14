import { Check } from 'lucide-react'
import CopyableValue from './CopyableValue'

export interface McpDialogRow {
    /** The provider's own field label, e.g. "Remote MCP server URL". Not translated. */
    label: string
    /** Literal value shown in the field, e.g. "augo" or "OAuth". */
    value?: string
    /** When set, the field is a copyable one instead of static text. */
    copyValue?: string
    /** Translated guidance for a field to leave alone. */
    hint?: string
}

export interface McpDialogCheckbox {
    /** The provider's warning line above the box. Not translated. */
    warning: string
    /** The provider's label beside the box. Not translated. */
    label: string
    /** The provider's smaller print under the label. Not translated. */
    description: string
}

interface McpDialogMockProps {
    /** The provider's dialog title. Not translated — it is what is on their screen. */
    title: string
    rows: McpDialogRow[]
    /** A tick-box the coach has to check before the dialog will submit. */
    checkbox?: McpDialogCheckbox
    /** Translated instruction under the mock. */
    note?: string
    /** Passed to CopyableValue for analytics. */
    trackingLocation: string
}

/**
 * A drawing of the dialog the coach is looking at, so they can match field for
 * field instead of parsing a sentence.
 *
 * Drawn rather than screenshotted: it stays sharp at any width, carries a real
 * copy button on the URL, and does not rot into a stale JPEG the next time
 * Anthropic or OpenAI move a button.
 *
 * The fields are divs. Real inputs would be focusable controls that do nothing,
 * which is worse than useless with a keyboard or a screen reader — the only
 * thing here you can interact with is the copy button.
 */
export default function McpDialogMock({
    title,
    rows,
    checkbox,
    note,
    trackingLocation,
}: McpDialogMockProps) {
    return (
        <figure className="mt-6 mb-1 max-w-[520px]">
            <div className="rounded-xl border border-white/[0.12] bg-dark-800 overflow-hidden">
                <div className="px-5 py-3.5 border-b border-white/[0.08]">
                    <p className="font-satoshi font-medium text-[15px] sm:text-[16px] text-white">
                        {title}
                    </p>
                </div>
                <div className="px-5 py-5 flex flex-col gap-4">
                    {rows.map((row, i) => (
                        <div key={i}>
                            <p className="font-mono text-[10px] sm:text-[11px] tracking-[2px] uppercase text-white/45 mb-1.5">
                                {row.label}
                            </p>
                            {row.copyValue ? (
                                <CopyableValue
                                    value={row.copyValue}
                                    trackingLocation={trackingLocation}
                                    variant="inline"
                                />
                            ) : (
                                <div className="flex items-center rounded-lg border border-white/[0.12] bg-dark px-3.5 py-3">
                                    <span
                                        className={`font-satoshi text-[15px] sm:text-[16px] leading-[150%] ${
                                            row.value ? 'text-white/85' : 'text-white/35'
                                        }`}
                                    >
                                        {row.value ?? '—'}
                                    </span>
                                </div>
                            )}
                            {row.hint && (
                                <p className="mt-1.5 font-satoshi text-[13px] sm:text-[14px] leading-[155%] text-white/50">
                                    {row.hint}
                                </p>
                            )}
                        </div>
                    ))}

                    {checkbox && (
                        <div className="rounded-lg border border-white/[0.12] bg-dark overflow-hidden">
                            <p className="px-3.5 py-2.5 border-b border-white/[0.12] font-satoshi text-[13px] sm:text-[14px] leading-[150%] text-white/70">
                                {checkbox.warning}
                            </p>
                            <div className="flex gap-3 px-3.5 py-3">
                                {/* Drawn ticked, because ticked is the state the coach
                                    needs to reach. Not an input — see the note above. */}
                                <span
                                    aria-hidden="true"
                                    className="mt-0.5 flex-shrink-0 flex h-4 w-4 items-center justify-center rounded-[4px] border border-white/60 bg-white/90"
                                >
                                    <Check strokeWidth={3} className="w-3 h-3 text-dark" />
                                </span>
                                <div className="min-w-0">
                                    <p className="font-satoshi font-medium text-[14px] sm:text-[15px] leading-[145%] text-white">
                                        {checkbox.label}
                                    </p>
                                    <p className="mt-1 font-satoshi text-[13px] sm:text-[14px] leading-[155%] text-white/55">
                                        {checkbox.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {note && (
                <figcaption className="mt-3 font-satoshi text-[14px] sm:text-[15px] leading-[160%] text-white/55">
                    {note}
                </figcaption>
            )}
        </figure>
    )
}
