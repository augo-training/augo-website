import { useEffect } from 'react'
import { Navigate, useLocation, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEOHead from '../seo/SEOHead'
import { BASE_URL } from '../seo/seoConstants'
import { formatLegalDate, legalDocs, type LegalSlug } from '../utils/legal'

/**
 * Privacy Policy and Terms & Conditions, rendered from src/content/legal/*.md.
 *
 * English-only: the English text is the binding one, so /de/privacy and
 * /pt/terms redirect to the English page rather than showing a translation.
 */
export default function Legal({ slug }: { slug: LegalSlug }) {
  const { lang } = useParams<{ lang: string }>()
  const location = useLocation()
  const doc = legalDocs[slug]

  // ScrollToTop races the browser's native hash scroll, so a deep link such as
  // /en/privacy/#garmin-data would land at the top without this (see Mcp.tsx).
  useEffect(() => {
    if (!location.hash) return
    requestAnimationFrame(() => {
      document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView()
    })
  }, [location.hash])

  if (lang && lang !== 'en') {
    return <Navigate to={`/en/${slug}/${location.hash}`} replace />
  }

  return (
    <>
      <SEOHead
        path={`/${slug}`}
        title={`${doc.title} | augo`}
        description={doc.description}
        canonicalOverride={`${BASE_URL}/en/${slug}/`}
        noAlternates
      />
      <Navbar />
      <article className="mx-auto max-w-[760px] px-6 pt-32 pb-24 text-white">
        <header className="mb-10">
          <h1 className="font-satoshi font-bold text-[34px] sm:text-[42px] leading-[115%] tracking-[-0.02em] mb-5">
            {doc.title}
          </h1>
          <p className="text-text-muted text-[13px]">
            Last updated <time dateTime={doc.lastUpdated}>{formatLegalDate(doc.lastUpdated)}</time>
            {' · '}
            <a href={`/${slug}.md`} className="underline underline-offset-4 hover:text-white">
              Markdown version
            </a>
          </p>
        </header>
        <div className="support-prose legal-prose" dangerouslySetInnerHTML={{ __html: doc.html }} />
      </article>
      <Footer />
    </>
  )
}
