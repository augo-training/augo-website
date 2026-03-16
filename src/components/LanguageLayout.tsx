import { Outlet, useParams, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supportedLanguages } from '../i18n'
import type { SupportedLanguage } from '../i18n'

export default function LanguageLayout() {
  const { lang } = useParams<{ lang: string }>()
  const { i18n } = useTranslation()

  const isValid = lang && supportedLanguages.includes(lang as SupportedLanguage)

  if (!isValid) {
    return <Navigate to="/en" replace />
  }

  // Set language synchronously before rendering children,
  // so components mount with the correct language from the start.
  if (i18n.language !== lang) {
    i18n.changeLanguage(lang)
  }

  return <Outlet />
}
