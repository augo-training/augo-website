import CopyableValue from './CopyableValue'

export interface McpStep {
    /** Short imperative title. Becomes HowToStep.name. */
    title: string
    /** One or two sentences. Becomes HowToStep.text. */
    body: string
    /** Optional caveat, rendered muted under the body. */
    note?: string
}

interface McpStepsProps {
    steps: McpStep[]
    /** Prefix for per-step anchors, e.g. 'claude' gives #claude-step-2. */
    idPrefix: string
    /** Rendered inside the step whose index this matches. */
    copyValue?: string
    copyLabel?: string
    copyAtIndex?: number
}

/**
 * Numbered steps. An <ol> so the ordinality is real rather than painted on;
 * the visible number is aria-hidden because a screen reader already announces
 * the list position and would otherwise say it twice.
 */
export default function McpSteps({
    steps,
    idPrefix,
    copyValue,
    copyLabel,
    copyAtIndex,
}: McpStepsProps) {
    return (
        <ol className="flex flex-col list-none p-0 mt-8 sm:mt-10">
            {steps.map((step, i) => (
                <li
                    key={i}
                    id={`${idPrefix}-step-${i + 1}`}
                    className="grid grid-cols-[2rem_1fr] sm:grid-cols-[2.5rem_1fr] gap-x-4 sm:gap-x-6 py-6 sm:py-7 border-t border-white/[0.08] last:border-b last:border-white/[0.08] scroll-mt-24"
                >
                    <span
                        aria-hidden="true"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 font-mono text-[13px] text-white/70 tabular-nums"
                    >
                        {i + 1}
                    </span>
                    <div className="min-w-0">
                        <h3 className="font-satoshi font-medium text-[18px] sm:text-[22px] leading-[135%] text-white">
                            {step.title}
                        </h3>
                        <p className="mt-2 font-satoshi text-[15px] sm:text-[17px] leading-[160%] text-white/75 max-w-[680px]">
                            {step.body}
                        </p>
                        {copyValue && copyAtIndex === i && (
                            <CopyableValue
                                value={copyValue}
                                label={copyLabel}
                                trackingLocation={idPrefix}
                            />
                        )}
                        {step.note && (
                            <p className="mt-3 font-satoshi text-[14px] sm:text-[15px] leading-[160%] text-white/50 max-w-[680px]">
                                {step.note}
                            </p>
                        )}
                    </div>
                </li>
            ))}
        </ol>
    )
}
