import type { Coach } from '../data/coaches/types'
import { GENDER_LABEL } from '../data/coaches/types'
import type { AthleteProfile } from '../components/find/chatScript'

// Gender is matched by exact token equality (not substring) so a search for
// "male" doesn't match "female". Tokenizer keeps hyphens, so "non-binary" is one token.
const GENDER_SYNONYMS: Record<string, string[]> = {
    female: ['female', 'woman', 'women'],
    male: ['male', 'man', 'men'],
    'non-binary': ['non-binary', 'nonbinary', 'enby', 'nb'],
}

function genderFired(coach: Coach, tokenSet: Set<string>): boolean {
    return !!coach.gender && GENDER_SYNONYMS[coach.gender].some((s) => tokenSet.has(s))
}

export interface CoachSearchResult {
    coach: Coach
    score: number
    reason: string
}

const STOP_WORDS = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
    'i', 'in', 'is', 'it', 'me', 'my', 'of', 'on', 'or', 'that', 'the', 'to',
    'who', 'with', 'want', 'looking', 'find', 'need', 'coach', 'someone',
])

function tokenize(input: string): string[] {
    return input
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s'-]/gu, ' ')
        .split(/\s+/)
        .filter((t) => t.length > 1 && !STOP_WORDS.has(t))
}

function buildHaystack(coach: Coach): string {
    return [
        coach.name,
        coach.tagline,
        coach.disciplines.join(' '),
        coach.specialties.join(' '),
        coach.location.city,
        coach.location.country,
        coach.languages.map((l) => `${l.code} ${l.label}`).join(' '),
        coach.credentials.join(' '),
        coach.notableResults?.join(' ') ?? '',
        coach.bio.short,
        coach.bio.long.join(' '),
        coach.bio.philosophy,
        coach.coachesRemote ? 'remote online virtual' : '',
    ]
        .join(' ')
        .toLowerCase()
}

// Why-we-matched copy: explain in plain English which signals fired.
function buildReason(coach: Coach, tokens: string[]): string {
    const fired: string[] = []
    const tokenSet = new Set(tokens)

    for (const d of coach.disciplines) {
        if (tokenSet.has(d) || (d === 'running' && tokenSet.has('run')) ||
            (d === 'cycling' && (tokenSet.has('bike') || tokenSet.has('cyclist'))) ||
            (d === 'triathlon' && (tokenSet.has('tri') || tokenSet.has('ironman')))) {
            fired.push(d.charAt(0).toUpperCase() + d.slice(1))
        }
    }

    for (const s of coach.specialties) {
        for (const t of tokens) {
            if (s.toLowerCase().includes(t) || t.includes(s.toLowerCase().replace(/\s+/g, ''))) {
                fired.push(s)
                break
            }
        }
    }

    if (tokenSet.has(coach.location.city.toLowerCase())) {
        fired.push(coach.location.city)
    } else if (tokenSet.has(coach.location.country.toLowerCase())) {
        fired.push(coach.location.country)
    }

    for (const lang of coach.languages) {
        if (
            tokenSet.has(lang.code) ||
            tokenSet.has(lang.label.toLowerCase()) ||
            (lang.code === 'de' && tokenSet.has('german')) ||
            (lang.code === 'pt' && tokenSet.has('portuguese')) ||
            (lang.code === 'es' && tokenSet.has('spanish')) ||
            (lang.code === 'en' && tokenSet.has('english'))
        ) {
            fired.push(lang.label)
        }
    }

    if (genderFired(coach, tokenSet)) {
        fired.push(GENDER_LABEL[coach.gender!])
    }

    const unique = Array.from(new Set(fired))
    if (unique.length === 0) return 'Closest fit from the roster'
    return `Matched on: ${unique.slice(0, 4).join(' · ')}`
}

/**
 * Flatten a structured AthleteProfile into the free-text query the prototype
 * scorer understands. When we wire a real LLM controller, this helper becomes
 * the place to swap in structured scoring instead.
 */
export function profileToQuery(profile: AthleteProfile): string {
    const parts: string[] = []
    if (profile.sport && profile.sport !== 'mixed') parts.push(profile.sport)
    if (profile.sport === 'mixed') parts.push('running cycling triathlon')
    if (profile.event && profile.event.length > 0) parts.push(profile.event.join(' '))
    if (profile.experience) parts.push(profile.experience)
    if (profile.lifeContext) parts.push(profile.lifeContext)
    if (profile.location) parts.push(profile.location)
    if (profile.coachingStyle && profile.coachingStyle.length > 0) {
        parts.push(profile.coachingStyle.join(' '))
    }
    if (profile.notes) parts.push(profile.notes)
    return parts.join(' ').trim()
}

/**
 * Prototype natural-language coach search.
 * Token-overlap scoring across each coach's haystack.
 * Designed to be swapped for an LLM-backed endpoint later — same signature.
 */
export function coachSearch(query: string, coaches: Coach[]): CoachSearchResult[] {
    const tokens = tokenize(query)
    if (tokens.length === 0) {
        return coaches.map((c) => ({ coach: c, score: 0, reason: '' }))
    }

    const tokenSet = new Set(tokens)
    const scored = coaches.map((coach) => {
        const haystack = buildHaystack(coach)
        let score = 0
        for (const t of tokens) {
            if (haystack.includes(t)) {
                score += 1
                // Boost for high-signal fields
                if (coach.disciplines.some((d) => d.includes(t))) score += 1.5
                if (coach.specialties.some((s) => s.toLowerCase().includes(t))) score += 1
                if (coach.location.city.toLowerCase().includes(t)) score += 1
                if (coach.languages.some((l) => l.code === t || l.label.toLowerCase() === t)) score += 1
            }
        }
        // Gender is matched by exact token (high-signal), not via the substring haystack.
        if (genderFired(coach, tokenSet)) score += 2
        return { coach, score, reason: buildReason(coach, tokens) }
    })

    const matched = scored.filter((r) => r.score > 0).sort((a, b) => b.score - a.score)
    return matched.length > 0 ? matched : scored.map((r) => ({ ...r, reason: '' }))
}
