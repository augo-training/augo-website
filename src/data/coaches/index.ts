import type { Coach, Discipline } from './types'
import { coaches as rawCoaches } from './roster'

// Explicit display priority for founding coaches (highest value to us first).
// Founding coaches not listed here fall after, in roster order.
const FOUNDING_ORDER: string[] = [
    'marco-altini',
    'andrea-salvisberg',
    'bevan-mckinnon',
    'brian-boisvert',
    'markus-lombardini',
    'stef-vanhaeren',
    'megan-edwards',
]

function foundingRank(slug: string): number {
    const i = FOUNDING_ORDER.indexOf(slug)
    return i === -1 ? FOUNDING_ORDER.length : i
}

// Founding coaches always sit on top of the default browse order, sorted by the
// priority above (Array.sort is stable, so unranked founders keep roster order).
// Search results override this — relevance wins there.
export const coaches: Coach[] = [
    ...rawCoaches
        .filter((c) => c.isFoundingCoach)
        .sort((a, b) => foundingRank(a.slug) - foundingRank(b.slug)),
    // Everyone else is shown alphabetically by name.
    ...rawCoaches
        .filter((c) => !c.isFoundingCoach)
        .sort((a, b) => a.name.localeCompare(b.name)),
]

export function getCoachBySlug(slug: string): Coach | undefined {
    return coaches.find((c) => c.slug === slug)
}

export function getFoundingCoaches(): Coach[] {
    return coaches.filter((c) => c.isFoundingCoach)
}

export function getCoachesByDiscipline(discipline: Discipline | 'all'): Coach[] {
    if (discipline === 'all') return coaches
    return coaches.filter((c) => c.disciplines.includes(discipline))
}

export function getRelatedCoaches(slug: string, limit = 3): Coach[] {
    const current = getCoachBySlug(slug)
    if (!current) return []
    const score = (c: Coach) => {
        const sharedDisciplines = c.disciplines.filter((d) =>
            current.disciplines.includes(d),
        ).length
        const sharedSpecialties = c.specialties.filter((s) =>
            current.specialties.includes(s),
        ).length
        return sharedDisciplines * 3 + sharedSpecialties
    }
    return coaches
        .filter((c) => c.slug !== slug)
        .sort((a, b) => score(b) - score(a))
        .slice(0, limit)
}

export type { Coach, Discipline } from './types'
