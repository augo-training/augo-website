import { Navigate } from 'react-router-dom'
import i18n from '../i18n'
import { supportedLanguages } from '../i18n'

export default function LanguageRedirect() {
  // Use the detected language from i18next (browser language detection)
  const detected = i18n.language?.split('-')[0] || 'en'
  const lang = supportedLanguages.includes(detected as typeof supportedLanguages[number])
    ? detected
    : 'en'

  return <Navigate to={`/${lang}`} replace />
}
