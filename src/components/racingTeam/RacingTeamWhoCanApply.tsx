import ApplyButton from './ApplyButton'
import SpecList from './SpecList'
import { COPY } from './constants'

/**
 * The two halves of the duo get the same treatment: a numbered heading, a
 * one-line summary, then the spec-sheet rows. An athlete and a coach can each
 * find their own half and scan it the same way, instead of the coach side
 * sitting in a panel of its own.
 */
export default function RacingTeamWhoCanApply() {
    const { whoCanApply } = COPY
    const { athlete, coach } = whoCanApply

    return (
        <section
            id="who-can-apply"
            aria-labelledby="who-can-apply-title"
            className="w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark border-t border-white/[0.06] texture-grain"
        >
            <div className="max-w-[1100px] mx-auto">
                <h2
                    id="who-can-apply-title"
                    className="font-mono font-bold text-[28px] sm:text-[36px] lg:text-[44px] leading-[120%] text-white"
                >
                    {whoCanApply.title}
                </h2>
                {/* Each sentence on its own line, unbroken on desktop. */}
                <div className="mt-3 flex flex-col gap-1 font-satoshi text-[16px] sm:text-[18px] leading-[160%] text-text-muted">
                    {whoCanApply.lead.map((line) => <p key={line} className="lg:whitespace-nowrap">{line}</p>)}
                </div>

                <div className="mt-12 sm:mt-14 flex flex-col gap-14 sm:gap-16">
                    <div className="flex flex-col gap-5">
                        <GroupHeading index={1} label={athlete.label} summary={athlete.summary} />
                        <SpecList label={athlete.resultsLabel} items={athlete.results} />
                        <SpecList
                            label={athlete.alsoRequiredLabel}
                            items={athlete.alsoRequired}
                            startAt={athlete.results.length + 1}
                            counter={false}
                        />
                    </div>

                    <div className="flex flex-col gap-5">
                        <GroupHeading index={2} label={coach.label} summary={coach.summary} />
                        <SpecList label={coach.requirementsLabel} items={coach.requirements} />
                    </div>
                </div>

                <div className="mt-14 sm:mt-16 pt-10 sm:pt-12 border-t border-white/[0.10]">
                    <div className="flex flex-col gap-4">
                        <p className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/55">
                            {whoCanApply.howLabel}
                        </p>
                        {/* Each sentence on its own line, unbroken on desktop. */}
                        <div className="flex flex-col gap-1 font-satoshi font-medium text-[20px] sm:text-[24px] md:text-[26px] leading-[140%] tracking-[-0.005em] text-white">
                            {whoCanApply.how.map((line) => <p key={line} className="lg:whitespace-nowrap">{line}</p>)}
                        </div>
                        <div className="mt-4">
                            <ApplyButton location="racing_team_who_can_apply" label={whoCanApply.cta} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function GroupHeading({ index, label, summary }: { index: number; label: string; summary: string }) {
    return (
        <div className="flex flex-col gap-3 mb-3">
            <h3 className="font-satoshi font-bold text-[28px] sm:text-[40px] md:text-[48px] leading-[100%] tracking-[-0.025em] text-white">
                <span className="font-mono text-[12px] sm:text-[14px] tracking-[2px] text-white/35 tabular-nums align-middle mr-4">
                    {String(index).padStart(2, '0')}
                </span>
                {label}
            </h3>
            {/* One line on desktop, like the other lead sentences on the page. */}
            <p className="font-satoshi text-[16px] sm:text-[18px] leading-[160%] text-text-muted lg:whitespace-nowrap">
                {summary}
            </p>
        </div>
    )
}
