import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supportSearch } from '../utils/supportSearch'
import type { SupportSearchResponse } from '../utils/supportSearch'
import { getSupportSearchIndex, articlesBySlug } from '../utils/supportArticles'
import type { SupportArticleData } from '../utils/supportTypes'
import { trackSupportSearch, trackSupportSearchNoResults } from '../utils/analytics'

const URL_DEBOUNCE_MS = 250
const ANALYTICS_DEBOUNCE_MS = 700

export interface UseSupportSearch {
  query: string
  setQuery: (next: string) => void
  clear: () => void
  response: SupportSearchResponse | null
  /** Result articles resolved in rank order. */
  articles: SupportArticleData[]
}

/**
 * Owns the query, the URL sync and the analytics debounce.
 *
 * The scorer stays pure and stateless; everything impure lives here. That split
 * is what keeps the ranking assertions meaningful and the prerendered hub
 * byte-identical across builds.
 */
export function useSupportSearch(): UseSupportSearch {
  const [searchParams, setSearchParams] = useSearchParams()
  // The input is the source of truth; results derive from it synchronously via
  // useMemo. Deriving from the URL instead would put a round-trip between the
  // keystroke and the result, which reads as lag.
  const [query, setQueryState] = useState(() => searchParams.get('q') ?? '')
  // The last value we wrote to the URL ourselves, so an echo of our own
  // debounced write can be told apart from a real URL change.
  const [lastWritten, setLastWritten] = useState(query)

  // URL -> input, but only for changes we did not make ourselves (back/forward,
  // or a shared ?q= link). Done during render (React's "adjust state when a
  // prop changes" pattern) rather than in an effect, so the input never shows a
  // stale value for a frame and the no-setState-in-effect rule stays happy.
  const fromUrl = searchParams.get('q') ?? ''
  const [prevFromUrl, setPrevFromUrl] = useState(fromUrl)
  if (fromUrl !== prevFromUrl) {
    setPrevFromUrl(fromUrl)
    if (fromUrl !== lastWritten) {
      setLastWritten(fromUrl)
      setQueryState(fromUrl)
    }
  }

  const response = useMemo(() => {
    if (!query.trim()) return null
    return supportSearch(query, getSupportSearchIndex())
  }, [query])

  // Debounced URL write. Untamed, every keystroke becomes a history entry and
  // the back button stops working.
  useEffect(() => {
    const id = setTimeout(() => {
      const current = searchParams.get('q') ?? ''
      if (current === query) return
      const next = new URLSearchParams(searchParams)
      if (query) next.set('q', query)
      else next.delete('q')
      // A query and a category filter together produce baffling empty states,
      // so searching drops the category.
      if (query) next.delete('category')
      setLastWritten(query)
      setSearchParams(next, { replace: true })
    }, URL_DEBOUNCE_MS)
    return () => clearTimeout(id)
  }, [query, searchParams, setSearchParams])

  useEffect(() => {
    if (!response || !query.trim()) return
    const id = setTimeout(() => {
      trackSupportSearch({
        query,
        result_count: response.results.length,
        confidence: Math.round(response.confidence * 100) / 100,
        tier: response.tier,
        top_slug: response.results[0]?.slug ?? '',
      })
      // The queries we can't answer are the content roadmap: unknownTerms is
      // literally the list of words the corpus has never seen.
      if (response.tier === 'unsure') {
        trackSupportSearchNoResults({ query, unknown_terms: response.unknownTerms.join(',') })
      }
    }, ANALYTICS_DEBOUNCE_MS)
    return () => clearTimeout(id)
  }, [response, query])

  const articles = useMemo(() => {
    if (!response) return []
    return response.results
      .map((r) => articlesBySlug[r.slug])
      .filter((a): a is SupportArticleData => !!a)
  }, [response])

  const setQuery = useCallback((next: string) => setQueryState(next), [])
  const clear = useCallback(() => setQueryState(''), [])

  return { query, setQuery, clear, response, articles }
}
