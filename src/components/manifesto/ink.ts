import type { CSSProperties } from 'react'

/**
 * The handwriting fonts, loaded from Google Fonts on this page only (see
 * pages/Manifesto.tsx). `size` evens out how big each one looks at the same
 * font-size: Reenie Beanie is small and tight, Homemade Apple wide.
 */
export const SIGNATURE_FONTS = [
    { family: "'Homemade Apple', cursive", size: 0.82 },
    { family: "'La Belle Aurore', cursive", size: 1.05 },
    { family: "'Nothing You Could Do', cursive", size: 0.95 },
    { family: "'Reenie Beanie', cursive", size: 1.35 },
]

export const SIGNATURE_FONTS_HREF =
    'https://fonts.googleapis.com/css2?family=Homemade+Apple&family=La+Belle+Aurore&family=Nothing+You+Could+Do&family=Reenie+Beanie&display=swap'

/**
 * Two looks for the sheet, picked with `?look=` on the page while the team
 * compares them:
 *
 *   paper  the poster: off-white sheet, near-black text, red marker (default)
 *   night  all black: the sheet is the page, white text, yellow marker
 *
 * Both break the site's white-or-grey text rule for the ink on purpose; see
 * constants.ts. Only the sheet and the preview strip change, the rest of the
 * page is the same dark page in both.
 */
export type LookName = 'paper' | 'night'

export interface Look {
    name: LookName
    /** Marker colour. Only ever used for signatures. */
    ink: string
    sheet: string
    statement: string
    body: string
    eyebrow: string
    place: string
    /** Signature dates and the pending note. */
    note: string
    /** Classes for the augo wordmark at the sheet's corner; the file is white. */
    logo: string
    /** Paper grain overlay. */
    grain: boolean
    /** The preview strip in the sign panel. */
    strip: string
    stripEmpty: string
}

export const LOOKS: Record<LookName, Look> = {
    paper: {
        name: 'paper',
        ink: '#C50017',
        sheet: 'rounded-[6px] bg-[#F7F5F0] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]',
        statement: 'text-[#111111]',
        body: 'text-[#2A2A2A]',
        eyebrow: 'text-[#111111]',
        place: 'text-[#3A3A3A]',
        note: 'text-[#6B6B6B]',
        logo: 'invert',
        grain: true,
        strip: 'bg-[#F7F5F0]',
        stripEmpty: 'text-[#9A9A9A]',
    },
    night: {
        name: 'night',
        ink: '#FFCA1E',
        sheet: 'bg-dark',
        statement: 'text-white',
        body: 'text-white',
        eyebrow: 'text-white',
        place: 'text-text-muted',
        note: 'text-dark-200',
        logo: '',
        grain: false,
        strip: 'bg-dark border border-dark-600',
        stripEmpty: 'text-dark-400',
    },
}

export function parseLook(value: string | null): Look {
    return value === 'night' ? LOOKS.night : LOOKS.paper
}

export function inkStyle(font: number, sizePx: number, look: Look): CSSProperties {
    const f = SIGNATURE_FONTS[font] ?? SIGNATURE_FONTS[0]
    return { fontFamily: f.family, fontSize: `${sizePx * f.size}px`, color: look.ink }
}
