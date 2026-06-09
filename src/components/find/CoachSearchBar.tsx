import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import { coaches } from '../../data/coaches'
import { coachSearch, type CoachSearchResult } from '../../utils/coachSearch'

const PLACEHOLDER_QUERIES = [
    'Marathon coach who is also a parent',
    'Cycling coach in Zurich who speaks German',
    'Triathlon coach for my first IRONMAN',
    'Calm coach for a returning runner',
    'Gravel coach for time-crunched riders',
    'Triathlon coach who speaks Portuguese',
]

// One-tap examples that show the search understands sport, location, language & name.
const EXAMPLE_CHIPS = ['Triathlon', 'Zurich', 'German', 'Marathon', 'Marco']

interface Props {
    onResults: (results: CoachSearchResult[] | null) => void
}

export default function CoachSearchBar({ onResults }: Props) {
    const [query, setQuery] = useState('')
    const [placeholderIndex, setPlaceholderIndex] = useState(0)
    const [isFocused, setIsFocused] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (query || isFocused) return
        const id = setInterval(() => {
            setPlaceholderIndex((i) => (i + 1) % PLACEHOLDER_QUERIES.length)
        }, 3200)
        return () => clearInterval(id)
    }, [query, isFocused])

    function scrollToRoster() {
        const rosterEl = document.getElementById('coach-roster')
        if (rosterEl) rosterEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    function runSearch(value: string) {
        const trimmed = value.trim()
        if (trimmed.length === 0) {
            onResults(null)
            return
        }
        onResults(coachSearch(trimmed, coaches))
        scrollToRoster()
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        runSearch(query)
    }

    function runChip(value: string) {
        setQuery(value)
        runSearch(value)
    }

    function clear() {
        setQuery('')
        onResults(null)
        inputRef.current?.focus()
    }

    return (
        <div className="flex flex-col gap-4">
            <form onSubmit={handleSubmit} className="w-full">
                    <div
                        className={`relative w-full rounded-2xl bg-dark-800 transition-all duration-300 ${
                            isFocused
                                ? 'ring-2 ring-white/40 shadow-[0_0_0_8px_rgba(255,255,255,0.04)]'
                                : 'ring-2 ring-white/20'
                        }`}
                    >
                        <div className="flex items-center gap-3 sm:gap-4 px-5 sm:px-6 py-4 sm:py-5">
                            <Search
                                className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-white/70"
                                strokeWidth={1.5}
                                aria-hidden="true"
                            />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => {
                                    const value = e.target.value
                                    setQuery(value)
                                    if (value.trim().length === 0) {
                                        onResults(null)
                                    }
                                }}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder={PLACEHOLDER_QUERIES[placeholderIndex]}
                                className="flex-1 bg-transparent border-0 outline-none font-satoshi text-[17px] sm:text-[20px] leading-[140%] tracking-[-0.005em] text-white placeholder:text-white/45 min-w-0"
                                aria-label="Search coaches by sport, location, language or name"
                            />
                            {query && (
                                <button
                                    type="button"
                                    onClick={clear}
                                    className="font-mono text-[11px] tracking-[2px] uppercase text-white/55 hover:text-white transition-colors cursor-pointer bg-transparent border-0"
                                    aria-label="Clear search"
                                >
                                    Clear
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={query.trim().length === 0}
                                aria-label="Search coaches"
                                className="hidden sm:inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white text-dark hover:brightness-95 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                            >
                                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                            </button>
                        </div>
                        <button
                            type="submit"
                            disabled={query.trim().length === 0}
                            className="sm:hidden w-full bg-white text-dark font-mono text-[11px] font-extrabold tracking-[2px] uppercase rounded-b-2xl py-3 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            Search <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                        </button>
                    </div>
                </form>

                {/* Facet hint + one-tap examples */}
                <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] sm:text-[11px] tracking-[2px] uppercase text-white/40 mr-1">
                        Try
                    </span>
                    {EXAMPLE_CHIPS.map((chip) => (
                        <button
                            key={chip}
                            type="button"
                            onClick={() => runChip(chip)}
                            className="inline-flex items-center px-3 py-1.5 rounded-full font-mono text-[11px] tracking-[1.5px] uppercase text-white/65 ring-1 ring-white/[0.12] hover:text-white hover:ring-white/30 hover:bg-white/[0.04] transition-all cursor-pointer bg-transparent"
                        >
                            {chip}
                        </button>
                    ))}
                </div>
            </div>
    )
}
