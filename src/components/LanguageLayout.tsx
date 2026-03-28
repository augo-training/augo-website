import { useEffect, useRef } from 'react'
import { Outlet, useParams, useLocation, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supportedLanguages } from '../i18n'
import type { SupportedLanguage } from '../i18n'
import { setupMixpanelConsentListener, trackPageViewed } from '../utils/analytics'

export default function LanguageLayout() {
  const { lang } = useParams<{ lang: string }>()
  const { i18n } = useTranslation()
  const location = useLocation()
  const prevPathRef = useRef<string | null>(null)

  const isValid = lang && supportedLanguages.includes(lang as SupportedLanguage)

  // Set language synchronously before rendering children,
  // so components mount with the correct language from the start.
  if (isValid && i18n.language !== lang) {
    i18n.changeLanguage(lang)
  }

  useEffect(() => {
    return setupMixpanelConsentListener()
  }, [])

  useEffect(() => {
    if (!isValid) return
    const currentPath = location.pathname
    if (prevPathRef.current === currentPath) return
    prevPathRef.current = currentPath

    const pageName = currentPath.replace(`/${lang}`, '') || '/'
    trackPageViewed({
      page: pageName,
      referrer: document.referrer,
      language: lang!,
    })
  }, [location.pathname, lang, isValid])

  if (!isValid) {
    return <Navigate to="/en" replace />
  }

  return <Outlet />
}
