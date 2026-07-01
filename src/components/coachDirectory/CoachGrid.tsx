import { useMemo, useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Coach, Discipline } from '../../data/coaches/types'
import type { CoachSearchResult } from '../../utils/coachSearch'
import CoachCard from './CoachCard'
import CoachCompactCard from './CoachCompactCard'
import SportFilter, { type SportFilterValue } from './SportFilter'

interface Props {
    coaches: Coach[]
    searchResults: CoachSearchResult[] | null
    /** When true (default browse view), founding coaches are shown above in their own row and excluded here. */
    excludeFounding?: boolean
    /** Optional search UI rendered under the section title (e.g. the coach search bar). */
    searchSlot?: ReactNode
}

function isDiscipline(v: string | null): v is Discipline {
    return v === 'running' || v === 'cycling' || v === 'triathlon'
}

export default function CoachGrid({ coaches, searchResults, excludeFounding = false, searchSlot }: Props) {
    const [searchParams, setSearchParams] = useSearchParams()
    const initial = searchParams.get('sport')
    const [sport, setSport] = useState<SportFilterValue>(
        isDiscipline(initial) ? initial : 'all',
    )

    function setSportAndSync(next: SportFilterValue) {
        setSport(next)
        const params = new URLSearchParams(searchParams)
        if (next === 'all') params.delete('sport')
        else params.set('sport', next)
        setSearchParams(params, { replace: true })
    }

    // When search is inactive and excludeFounding is set, hide founding coaches
    // (they're rendered in FoundingCoachesRow above). Search results always show everyone.
    const visibleCoaches = useMemo(() => {
        if (searchResults || !excludeFounding) return coaches
        return coaches.filter((c) => !c.isFoundingCoach)
    }, [coaches, searchResults, excludeFounding])

    const counts = useMemo<Record<SportFilterValue, number>>(() => {
        const base = { all: visibleCoaches.length, running: 0, cycling: 0, triathlon: 0 }
        for (const c of visibleCoaches) {
            for (const d of c.disciplines) base[d] += 1
        }
        return base
    }, [visibleCoaches])

    const reasonByCoach = useMemo(() => {
        if (!searchResults) return null
        const m = new Map<string, string>()
        for (const r of searchResults) {
            if (r.reason) m.set(r.coach.slug, r.reason)
        }
        return m
    }, [searchResults])

    const orderedCoaches = useMemo(() => {
        // Search results override roster ordering; otherwise the natural order
        // (founding coaches first via data/coaches/index.ts) is preserved.
        const list = searchResults ? searchResults.map((r) => r.coach) : visibleCoaches
        if (sport === 'all') return list
        return list.filter((c) => c.disciplines.includes(sport))
    }, [searchResults, visibleCoaches, sport])

    // Founding coaches carry photos and render as rich cards; everyone else we
    // have no photography for, so they render as compact text cards below.
    const foundingOrdered = useMemo(
        () => orderedCoaches.filter((c) => c.isFoundingCoach),
        [orderedCoaches],
    )
    const nonFoundingOrdered = useMemo(
        () => orderedCoaches.filter((c) => !c.isFoundingCoach),
        [orderedCoaches],
    )

    return (
        <section
            id="coach-roster"
            aria-labelledby="coach-roster-title"
            className="w-full py-16 sm:py-20 px-5 sm:px-8 bg-dark border-t border-white/[0.06]"
        >
            <div className="max-w-[1200px] mx-auto">
                <div className="flex flex-col gap-6 sm:gap-8 mb-10">
                    <div className="flex items-baseline justify-between gap-6 flex-wrap">
                        <h2
                            id="coach-roster-title"
                            className="font-satoshi font-bold text-[28px] sm:text-[36px] lg:text-[44px] leading-[110%] tracking-[-0.02em] text-white scroll-mt-24"
                        >
                            {searchResults
                                ? 'Matches from the roster.'
                                : excludeFounding
                                    ? 'Everyone else on the roster.'
                                    : 'The roster.'}
                        </h2>
                        <span className="font-mono text-[11px] tracking-[3px] uppercase text-white/35 tabular-nums">
                            {String(orderedCoaches.length).padStart(2, '0')} / {String(visibleCoaches.length).padStart(2, '0')}
                        </span>
                    </div>
                    {searchSlot}
                    <SportFilter value={sport} onChange={setSportAndSync} counts={counts} />
                </div>

                {orderedCoaches.length === 0 ? (
                    <div className="py-16 text-center font-satoshi text-[17px] text-text-muted">
                        No coaches match that filter yet. Try another sport.
                    </div>
                ) : (
                    <div className="flex flex-col gap-14 sm:gap-16">
                        {/* Founding coaches — photo cards */}
                        {foundingOrdered.length > 0 && (
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <span className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/55">
                                        Founding coaches
                                    </span>
                                    <p className="font-satoshi text-[14px] sm:text-[15px] leading-[150%] text-text-muted max-w-[560px]">
                                        The coaches building augo with us since day one.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                                    {foundingOrdered.map((coach) => (
                                        <CoachCard
                                            key={coach.slug}
                                            coach={coach}
                                            matchReason={reasonByCoach?.get(coach.slug)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Everyone else on the platform — compact text cards */}
                        {nonFoundingOrdered.length > 0 && (
                            <div className="flex flex-col gap-6">
                                <div className="flex items-baseline justify-between gap-4">
                                    <span className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/55">
                                        More on the platform
                                    </span>
                                    <span className="font-mono text-[11px] tracking-[3px] uppercase text-white/30 tabular-nums">
                                        {String(nonFoundingOrdered.length).padStart(2, '0')}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                                    {nonFoundingOrdered.map((coach) => (
                                        <CoachCompactCard
                                            key={coach.slug}
                                            coach={coach}
                                            matchReason={reasonByCoach?.get(coach.slug)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    )
}
