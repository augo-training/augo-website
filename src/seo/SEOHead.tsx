import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { getPageMeta, getCanonicalUrl, getAlternateUrls, BASE_URL } from './seoConfig'
import type { SupportedLanguage } from '../i18n'

interface ArticleMeta {
  publishedTime: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
}

interface SEOHeadProps {
  /** Lookup key in seoConfig for static pages. Ignored if title+description provided. */
  page?: string
  path: string
  /** Override title/description (used by blog posts where metadata is dynamic). */
  title?: string
  description?: string
  /** Optional per-page OG image path, e.g. "/humanedge-og.jpg". Falls back to /og-image.jpg. */
  ogImagePath?: string
  /** Override og:type. Defaults to "website". Use "article" for blog posts. */
  ogType?: 'website' | 'article'
  /** Article-specific OG tags. Only emitted when present. */
  articleMeta?: ArticleMeta
  /** Override canonical URL (for English-only blog posts). */
  canonicalOverride?: string
  /** When true, suppresses hreflang alternates (English-only content). */
  noAlternates?: boolean
}

export default function SEOHead({
  page,
  path,
  title,
  description,
  ogImagePath,
  ogType = 'website',
  articleMeta,
  canonicalOverride,
  noAlternates = false,
}: SEOHeadProps) {
  const { i18n } = useTranslation()
  const lang = i18n.language as SupportedLanguage
  const meta = page ? getPageMeta(page, lang) : { title: '', description: '' }
  const finalTitle = title ?? meta.title
  const finalDescription = description ?? meta.description
  const canonical = canonicalOverride ?? getCanonicalUrl(lang, path)
  const alternates = noAlternates ? [] : getAlternateUrls(path)
  const ogImage = ogImagePath
    ? ogImagePath.startsWith('http')
      ? ogImagePath
      : `${BASE_URL}${ogImagePath}`
    : `${BASE_URL}/og-image.jpg`

  // Search engine site verification. Set the corresponding env vars in your
  // hosting provider (Vercel/Netlify) to enable. Empty/missing → tag not rendered.
  const gscVerification = import.meta.env.VITE_GSC_VERIFICATION as string | undefined
  const bingVerification = import.meta.env.VITE_BING_VERIFICATION as string | undefined

  return (
    <Helmet>
      <html lang={lang} />
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <link rel="canonical" href={canonical} />

      {gscVerification && (
        <meta name="google-site-verification" content={gscVerification} />
      )}
      {bingVerification && (
        <meta name="msvalidate.01" content={bingVerification} />
      )}

      {/* hreflang alternates */}
      {alternates.map(({ lang: altLang, url }) => (
        <link key={altLang} rel="alternate" hrefLang={altLang} href={url} />
      ))}
      {!noAlternates && (
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`${BASE_URL}/en${path === '/' ? '' : path}`}
        />
      )}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="augo" />
      <meta property="og:locale" content={lang === 'de' ? 'de_DE' : lang === 'pt' ? 'pt_BR' : 'en_US'} />

      {/* Article-specific OG tags */}
      {articleMeta && (
        <meta property="article:published_time" content={articleMeta.publishedTime} />
      )}
      {articleMeta?.modifiedTime && (
        <meta property="article:modified_time" content={articleMeta.modifiedTime} />
      )}
      {articleMeta?.author && (
        <meta property="article:author" content={articleMeta.author} />
      )}
      {articleMeta?.section && (
        <meta property="article:section" content={articleMeta.section} />
      )}
      {articleMeta?.tags?.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  )
}
