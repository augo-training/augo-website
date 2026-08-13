import type { Coach } from '../../data/coaches/types'

interface Props {
    coach: Coach
}

/**
 * Fills the hero's right column for coaches without dedicated photography — the
 * slot a portrait occupies for everyone else. Everything here also appears in
 * the spec sheet below; this is a summary in a space that would otherwise be
 * empty, not new information.
 */
export default function CoachFactsPanel({ coach }: Props) {
    const facts: { label: string; value: string }[] = [
        { label: 'Based in', value: `${coach.location.city}, ${coach.location.country}` },
    ]

    if (coach.yearsCoaching) {
        facts.push({
            label: 'Experience',
            value: `${coach.yearsCoaching} ${coach.yearsCoaching === 1 ? 'year' : 'years'} coaching`,
        })
    }

    if (coach.languages.length > 0) {
        facts.push({ label: 'Languages', value: coach.languages.map((l) => l.label).join(' · ') })
    }

    if (coach.athleteLevels?.length) {
        facts.push({ label: 'Works with', value: coach.athleteLevels.join(' · ') })
    }

    if (facts.length === 0) return null

    return (
        <div className="rounded-2xl bg-dark-800 ring-1 ring-white/[0.08] p-7 sm:p-9 flex flex-col gap-6">
            <span className="font-mono text-[11px] sm:text-[12px] tracking-[2.5px] uppercase text-white/55">
                At a glance
            </span>

            <dl className="flex flex-col gap-5">
                {facts.map((fact, i) => (
                    <div
                        key={fact.label}
                        className={`flex flex-col gap-1.5 ${i > 0 ? 'pt-5 border-t border-white/[0.08]' : ''}`}
                    >
                        <dt className="font-mono text-[11px] tracking-[2px] uppercase text-white/45">
                            {fact.label}
                        </dt>
                        <dd className="font-satoshi font-medium text-[16px] sm:text-[17px] leading-[145%] text-white">
                            {fact.value}
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    )
}
