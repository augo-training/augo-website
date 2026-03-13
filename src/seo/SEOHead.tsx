import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { getPageMeta, getCanonicalUrl, getAlternateUrls, BASE_URL } from './seoConfig'
import type { SupportedLanguage } from '../i18n'

interface SEOHeadProps {
  page: string
  path: string
}

export default function SEOHead({ page, path }: SEOHeadProps) {
  const { i18n } = useTranslation()
  const lang = i18n.language as SupportedLanguage
  const meta = getPageMeta(page, lang)
  const canonical = getCanonicalUrl(lang, path)
  const alternates = getAlternateUrls(path)
  const ogImage = `${BASE_URL}/og-image.jpg`

  return (
    <Helmet>
      <html lang={lang} />
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={canonical} />

      {/* hreflang alternates */}
      {alternates.map(({ lang: altLang, url }) => (
        <link key={altLang} rel="alternate" hrefLang={altLang} href={url} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${BASE_URL}/en${path === '/' ? '' : path}`} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="augo" />
      <meta property="og:locale" content={lang === 'de' ? 'de_DE' : lang === 'pt' ? 'pt_BR' : 'en_US'} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  )
}
