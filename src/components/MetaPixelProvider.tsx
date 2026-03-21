import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { getConsentStatus } from './cookieUtils'
import { initMetaPixel, trackPageView, revokeConsent } from '../lib/metaPixel'

export default function MetaPixelProvider() {
  const location = useLocation()
  const consentRef = useRef(getConsentStatus())
  const initializedRef = useRef(false)

  // Listen for consent changes
  useEffect(() => {
    const handler = () => {
      const status = getConsentStatus()
      consentRef.current = status

      if (status === 'accepted') {
        initMetaPixel()
        trackPageView()
        initializedRef.current = true
      } else if (status === 'declined') {
        revokeConsent()
        initializedRef.current = false
      }
    }

    // Check initial consent
    if (consentRef.current === 'accepted') {
      initMetaPixel()
      trackPageView()
      initializedRef.current = true
    }

    window.addEventListener('cookie-consent-changed', handler)
    return () => window.removeEventListener('cookie-consent-changed', handler)
  }, [])

  // Track page views on route change
  useEffect(() => {
    if (initializedRef.current && consentRef.current === 'accepted') {
      trackPageView()
    }
  }, [location.pathname])

  return null
}
