import type { Coach } from '../../data/coaches/types'
import { GENDER_LABEL } from '../../data/coaches/types'
import { DISCIPLINE_LABEL } from '../coachDirectory/DisciplineIcons'

interface Props {
    coach: Coach
}

export default function CoachSpecSheet({ coach }: Props) {
    const rows: { label: string; value: string }[] = [
        {
            label: 'Discipline',
            value: coach.disciplines.map((d) => DISCIPLINE_LABEL[d]).join(' · '),
        },
        { label: 'Specialties', value: coach.specialties.join(' · ') },
        { label: 'Based in', value: `${coach.location.city}, ${coach.location.country}` },
        { label: 'Languages', value: coach.languages.map((l) => l.label).join(' · ') },
    ]

    if (coach.gender) {
        rows.splice(1, 0, { label: 'Gender', value: GENDER_LABEL[coach.gender] })
    }

    if (coach.credentials.length > 0) {
        rows.push({ label: 'Credentials', value: coach.credentials.join(' · ') })
    }

    return (
        <section
            id="spec-sheet"
            aria-labelledby="spec-sheet-title"
            className="w-full py-16 sm:py-20 px-5 sm:px-8 bg-dark border-t border-white/[0.06] texture-grain"
        >
            <div className="max-w-[1200px] mx-auto">
                <h2
                    id="spec-sheet-title"
                    className="font-mono font-bold text-[24px] sm:text-[32px] lg:text-[40px] leading-[120%] text-white"
                >
                    The spec sheet.
                </h2>
                <p className="font-satoshi text-[16px] sm:text-[18px] leading-[160%] text-text-muted mt-3 max-w-[680px]">
                    Everything you need to know in one scan.
                </p>

                {/* Core facts */}
                <dl className="flex flex-col mt-10 sm:mt-12">
                    {rows.map((row, i) => (
                        <div
                            key={row.label}
                            className="group grid grid-cols-[28px_minmax(100px,150px)_1fr] sm:grid-cols-[36px_minmax(120px,190px)_1fr] items-baseline gap-x-3 sm:gap-x-6 py-5 sm:py-6 border-t border-white/[0.08] last:border-b last:border-white/[0.08] transition-colors duration-200 hover:bg-white/[0.015]"
                        >
                            <span className="font-mono text-[11px] sm:text-[12px] tracking-[1.5px] text-white/35 tabular-nums">
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <dt className="font-mono text-[11px] sm:text-[12px] tracking-[2.5px] uppercase text-white/55 group-hover:text-white/80 transition-colors duration-200">
                                {row.label}
                            </dt>
                            <dd className="font-satoshi font-medium text-[15px] sm:text-[18px] leading-[140%] text-white">
                                {row.value}
                            </dd>
                        </div>
                    ))}
                </dl>

            </div>
        </section>
    )
}
