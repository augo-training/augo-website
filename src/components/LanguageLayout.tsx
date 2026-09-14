import { useEffect, useRef } from 'react'
import { Outlet, useParams, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supportedLanguages } from '../i18n'
import type { SupportedLanguage } from '../i18n'
import { trackPageViewed, normalizePage } from '../utils/analytics'
import LegacyRedirect from './LegacyRedirect'
import { EmailCaptureProvider } from '../contexts/EmailCaptureProvider'
import { FilmProvider } from '../contexts/FilmProvider'

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
    if (!isValid) return
    const currentPath = location.pathname
    if (prevPathRef.current === currentPath) return
    prevPathRef.current = currentPath

    const pageName = normalizePage(currentPath, lang)
    trackPageViewed({
      page: pageName,
      referrer: document.referrer,
      language: lang!,
    })
  }, [location.pathname, lang, isValid])

  if (!isValid) {
    // Also catches single-segment unknown paths like /nope, which match /:lang.
    return <LegacyRedirect to="/en" reason="unknown_language_prefix" />
  }

  return (
    <EmailCaptureProvider lang={lang!}>
      <FilmProvider>
        <Outlet />
      </FilmProvider>
    </EmailCaptureProvider>
  )
}
