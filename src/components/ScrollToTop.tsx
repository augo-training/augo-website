import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Resets scroll to the top whenever the route path changes. Without this,
 * React Router keeps the previous scroll position, so navigating from a
 * scrolled-down list into a coach profile lands you mid-page / at the footer.
 *
 * Keyed on pathname only, so query-string changes (e.g. ?sport= filters,
 * search updates) don't yank the page to the top.
 */
export default function ScrollToTop() {
    const { pathname } = useLocation()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    return null
}
