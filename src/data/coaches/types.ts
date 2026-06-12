export type Discipline = 'running' | 'cycling' | 'triathlon'
export type CoachStatus = 'accepting' | 'waitlist' | 'full'
export type CoachGender = 'female' | 'male' | 'non-binary'

// Shared display labels so cards, the profile spec sheet and JSON-LD stay in sync.
export const GENDER_LABEL: Record<CoachGender, string> = {
    female: 'Female',
    male: 'Male',
    'non-binary': 'Non-binary',
}

export interface CoachTestimonial {
    quote: string
    author: string
    result?: string
}

export interface CoachLocation {
    city: string
    country: string
    countryCode: string // ISO-2, used for flag rendering
    timezone: string
}

export interface CoachLanguage {
    code: string // ISO-2, e.g. 'en', 'de', 'pt'
    flag: string // emoji flag
    label: string // e.g. 'English'
}

export interface CoachMedia {
    portrait: string
    hero?: string
    heroVideo?: string
}

export interface CoachSocials {
    instagram?: string
    strava?: string
    website?: string
}

export interface Coach {
    slug: string
    name: string
    firstName: string
    tagline: string
    isFoundingCoach: boolean
    status: CoachStatus
    gender?: CoachGender
    disciplines: Discipline[]
    specialties: string[]
    location: CoachLocation
    coachesRemote: boolean
    languages: CoachLanguage[]
    credentials: string[]
    yearsCoaching?: number
    athletesCoached?: number
    notableResults?: string[]
    bio: {
        short: string
        long: string[]
        philosophy: string
    }
    testimonials?: CoachTestimonial[]
    // Coach pricing is intentionally not modeled here: anything in this data
    // file ships to the browser and gets scraped. Keep rates off the website.
    media: CoachMedia
    socials?: CoachSocials
}
