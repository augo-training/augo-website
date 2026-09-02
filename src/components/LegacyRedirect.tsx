import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { trackLegacyRedirect } from '../utils/analytics'

/**
 * Client-side redirect that records where the visitor came from before
 * navigating. Use for legacy and unknown URLs so stale inbound links stay visible
 * in analytics; the destination page fires its own page_viewed as usual.
 * `reason` distinguishes e.g. an unknown language prefix from a retired URL.
 */
export default function LegacyRedirect({ to, reason }: { to: string; reason?: string }) {
  const { pathname, search } = useLocation()
  // Keep the query string so UTM tags on old campaign links survive the hop.
  const target = to + search

  useEffect(() => {
    void trackLegacyRedirect({ from: pathname + search, to: target, reason })
    // Fire once per mount: the component unmounts as soon as Navigate runs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Navigate to={target} replace />
}
