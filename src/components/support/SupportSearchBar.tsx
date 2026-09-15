import { useEffect, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface Props {
  value: string
  onChange: (next: string) => void
  onClear: () => void
  /** Announced politely to screen readers; null while no query is active. */
  resultCount: number | null
}

/**
 * Placeholders rotate to teach the query language by example — that natural
 * language works, and roughly what shape it takes.
 *
 * Index 0 is what the prerender pass captures, so the first entry is fixed
 * rather than derived: a rotating or randomised initial value would make the
 * static HTML differ between builds.
 */
const PLACEHOLDERS = [
  'my watch won’t sync',
  'how do i invite an athlete',
  'what are athlete signals',
  'prepare me for a call with my athlete',
  'can athletes see my notes',
  'how far back does augo import',
]

const EXAMPLE_CHIPS = ['connect garmin', 'invite an athlete', 'athlete signals', 'create a workout']

const ROTATE_MS = 3200

export default function SupportSearchBar({ value, onChange, onClear, resultCount }: Props) {
  const { t } = useTranslation()
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Freeze while the user is engaged — a placeholder changing under an active
    // cursor is distracting, and pointless once they know what to type.
    if (value || focused) return
    const id = setInterval(
      () => setPlaceholderIndex((i) => (i + 1) % PLACEHOLDERS.length),
      ROTATE_MS,
    )
    return () => clearInterval(id)
  }, [value, focused])

  return (
    <div>
      <form role="search" onSubmit={(e) => e.preventDefault()}>
        <div
          className={`relative flex items-center gap-3 w-full rounded-2xl bg-dark-800 px-4 sm:px-5 py-4 transition-all duration-300 ring-2 ${
            focused
              ? 'ring-white/40 shadow-[0_0_0_8px_rgba(255,255,255,0.04)]'
              : 'ring-white/20'
          }`}
        >
          <Search size={20} strokeWidth={1.5} className="shrink-0 text-white/45" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={PLACEHOLDERS[placeholderIndex]}
            aria-label={t('support.search.inputLabel')}
            // No autofocus: on mobile it throws up the keyboard and buries the page.
            className="flex-1 bg-transparent border-0 outline-none font-satoshi text-[17px] sm:text-[20px] leading-[140%] tracking-[-0.005em] text-white placeholder:text-white/45 min-w-0 [&::-webkit-search-cancel-button]:hidden"
          />
          {value && (
            <button
              type="button"
              onClick={() => {
                onClear()
                inputRef.current?.focus()
              }}
              aria-label={t('support.search.clear')}
              className="shrink-0 text-white/45 hover:text-white transition-colors"
            >
              <X size={18} strokeWidth={2} aria-hidden="true" />
            </button>
          )}
        </div>
      </form>

      {!value && (
        <div className="mt-4 flex flex-wrap gap-2">
          {EXAMPLE_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => onChange(chip)}
              className="inline-flex items-center px-3 py-1.5 rounded-full font-mono text-[11px] tracking-[1.5px] uppercase text-white/65 ring-1 ring-white/[0.12] hover:text-white hover:ring-white/30 hover:bg-white/[0.04] transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Debounced by the caller — an undebounced live region announces on every
          keystroke, which is unusable with a screen reader. */}
      <p className="sr-only" aria-live="polite">
        {resultCount === null ? '' : t('support.search.resultCount', { count: resultCount })}
      </p>
    </div>
  )
}
