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

/** Marker red, the brand red. Only ever used for ink on the paper sheet. */
export const INK = '#C50017'

export function inkStyle(font: number, sizePx: number): CSSProperties {
    const f = SIGNATURE_FONTS[font] ?? SIGNATURE_FONTS[0]
    return { fontFamily: f.family, fontSize: `${sizePx * f.size}px`, color: INK }
}
