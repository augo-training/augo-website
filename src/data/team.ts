/**
 * Public profiles for the founders and advisors. The homepage links their
 * photos and names here, and the schema uses them as `sameAs`.
 */
export const FOUNDERS = {
    bruna: { name: 'Bruna Maia', profile: 'https://www.linkedin.com/in/brunamnc/' },
    fabi: { name: 'Fabienne Maia', profile: 'https://www.linkedin.com/in/fabienne-maia-b7b561119/' },
    andreas: { name: 'Andreas Hermann', profile: 'https://www.linkedin.com/in/andreas-hermann-7a567b8a/' },
} as const

export const ADVISOR_PROFILES = {
    marco: 'https://substack.com/@marcoaltini',
    gordon: 'https://www.linkedin.com/in/gordon-crawford-6149a868/',
    reto: 'https://www.instagram.com/reto_braendli/',
} as const
