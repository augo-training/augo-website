import { ArrowUpRight } from 'lucide-react'
import type { Coach } from '../../data/coaches/types'
import { COMMUNICATION_LABEL, GENDER_LABEL } from '../../data/coaches/types'
import { DISCIPLINE_LABEL } from '../coachDirectory/DisciplineIcons'

interface Props {
    coach: Coach
}

/**
 * Coach sites are stored as full URLs, and some deep-link to a page rather than
 * a home page. We keep the path when it's short enough to stay readable (a
 * bare "linkedin.com" tells an athlete nothing) and fall back to the host alone
 * when it isn't. Either way the link points at the full URL.
 */
const MAX_WEBSITE_LABEL = 40

function websiteLabel(url: string): string {
    try {
        const { hostname, pathname } = new URL(url)
        const host = hostname.replace(/^www\./, '')
        const path = pathname.replace(/\/$/, '')
        const full = `${host}${path}`
        return full.length <= MAX_WEBSITE_LABEL ? full : host
    } catch {
        return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')
    }
}

export default function CoachSpecSheet({ coach }: Props) {
    const rows: { label: string; value: string; href?: string }[] = [
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

    if (coach.yearsCoaching) {
        rows.push({ label: 'Experience', value: `${coach.yearsCoaching} years coaching` })
    }

    if (coach.athleteLevels?.length) {
        rows.push({ label: 'Works with', value: coach.athleteLevels.join(' · ') })
    }

    if (coach.communication) {
        rows.push({ label: 'Communication', value: COMMUNICATION_LABEL[coach.communication] })
    }

    if (typeof coach.offersStrength === 'boolean') {
        rows.push({
            label: 'Strength training',
            value: coach.offersStrength ? 'Included' : 'Not offered',
        })
    }

    if (coach.credentials.length > 0) {
        rows.push({ label: 'Credentials', value: coach.credentials.join(' · ') })
    }

    if (coach.socials?.website) {
        rows.push({
            label: 'Website',
            value: websiteLabel(coach.socials.website),
            href: coach.socials.website,
        })
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
                                {row.href ? (
                                    <a
                                        href={row.href}
                                        target="_blank"
                                        rel="noopener noreferrer nofollow"
                                        className="inline-flex items-center gap-1.5 break-all underline decoration-white/25 underline-offset-4 hover:decoration-white transition-colors"
                                    >
                                        {row.value}
                                        <ArrowUpRight
                                            className="w-4 h-4 flex-shrink-0 text-white/45"
                                            strokeWidth={2}
                                            aria-hidden="true"
                                        />
                                    </a>
                                ) : (
                                    row.value
                                )}
                            </dd>
                        </div>
                    ))}
                </dl>

                {/* The numbered rows cover the facts; this is where the coach's
                    own voice comes through. Hidden entirely if neither is set. */}
                {(coach.bio.philosophy || coach.idealAthlete) && (
                    <div className="mt-12 sm:mt-16 flex flex-col gap-8 max-w-[760px]">
                        <span className="font-mono text-[11px] sm:text-[12px] tracking-[2.5px] uppercase text-white/55">
                            In their own words
                        </span>

                        {coach.bio.philosophy && (
                            <blockquote className="font-satoshi font-medium text-[20px] sm:text-[26px] leading-[135%] tracking-[-0.015em] text-white border-l-2 border-white/20 pl-5 sm:pl-6">
                                {coach.bio.philosophy}
                            </blockquote>
                        )}

                        {coach.idealAthlete && (
                            <div className="flex flex-col gap-2">
                                <span className="font-mono text-[11px] sm:text-[12px] tracking-[2.5px] uppercase text-white/55">
                                    Works best with
                                </span>
                                <p className="font-satoshi font-medium text-[15px] sm:text-[18px] leading-[150%] text-white">
                                    {coach.idealAthlete}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    )
}
