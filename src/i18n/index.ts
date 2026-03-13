import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.json'
import de from './locales/de.json'
import pt from './locales/pt.json'

export const supportedLanguages = ['en', 'de', 'pt'] as const
export type SupportedLanguage = (typeof supportedLanguages)[number]

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      de: { translation: de },
      pt: { translation: pt },
    },
    fallbackLng: 'en',
    supportedLngs: supportedLanguages,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      // Language is determined from URL path (/:lang/...)
      // The LanguageDetector serves as fallback for initial redirect
      order: ['path', 'navigator'],
      lookupFromPathIndex: 0,
    },
  })

export default i18n
