import { createContext, useContext } from 'react'

export interface FilmContextValue {
    /** Opens the film, gated behind the first-name + email capture (asked only once). */
    requestFilm: (trigger: string) => void
}

export const FilmContext = createContext<FilmContextValue | null>(null)

export function useFilm(): FilmContextValue {
    const ctx = useContext(FilmContext)
    if (!ctx) {
        throw new Error('useFilm must be used inside <FilmProvider>')
    }
    return ctx
}
