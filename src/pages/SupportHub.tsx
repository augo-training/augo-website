import { Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEOHead from '../seo/SEOHead'
import { OrganizationJsonLd } from '../seo/JsonLd'
import { supportUrl } from '../seo/seoConstants'
import SupportArticleCard from '../components/support/SupportArticleCard'
import SupportSearchBar from '../components/support/SupportSearchBar'
import SupportSearchResults from '../components/support/SupportSearchResults'
import SupportContactCard from '../components/support/SupportContactCard'
import { useSupportSearch } from '../hooks/useSupportSearch'
import { articlesByCategory } from '../utils/supportArticles'
import { SUPPORT_CATEGORIES } from '../utils/supportTaxonomy'

export default function SupportHub() {
  const { lang } = useParams<{ lang: string }>()
  const { t } = useTranslation()
  const { query, setQuery, clear, response, articles: resultArticles } = useSupportSearch()

  // English-only at launch, mirroring the blog.
  if (lang && lang !== 'en') {
    return <Navigate to="/en/support" replace />
  }

  return (
    <>
      <SEOHead
        path="/support"
        title={t('support.hub.seoTitle')}
        description={t('support.hub.seoDescription')}
        canonicalOverride={supportUrl()}
        noAlternates
      />
      <OrganizationJsonLd />
      <Navbar />
      <main className="mx-auto max-w-[900px] px-6 pt-32 pb-24 text-white">
        <header className="mb-12">
          <span className="inline-flex items-center rounded-full border border-white/20 px-3 py-1.5 font-mono text-[11px] tracking-[2.5px] uppercase text-white/70">
            {t('support.hub.eyebrow')}
          </span>
          <h1 className="mt-6 font-satoshi font-bold text-[40px] sm:text-[48px] leading-[110%] tracking-[-0.02em]">
            {t('support.hub.h1')}
          </h1>
          <p className="mt-4 mb-8 text-text-muted text-[17px] leading-[165%] max-w-[620px]">
            {t('support.hub.subhead')}
          </p>
          <SupportSearchBar
            value={query}
            onChange={setQuery}
            onClear={clear}
            resultCount={response ? response.results.length : null}
          />
        </header>

        {/* A live query replaces the article list entirely. The thrash gate
            keeps the list in place while the query is still all low-signal
            words, so the page doesn't churn mid-sentence. */}
        {response && response.hasDiscriminatingTerm ? (
          <SupportSearchResults
            query={query}
            response={response}
            articles={resultArticles}
            onSuggestion={setQuery}
          />
        ) : (
          <>
            {/* The whole corpus, grouped under category headings in taxonomy
                order. Small enough to scan; no filter view needed yet. Empty
                categories are skipped so unwritten topics leave no gap. */}
            {SUPPORT_CATEGORIES.filter((c) => articlesByCategory[c.id].length > 0).map((c) => (
              <section key={c.id} aria-labelledby={`support-cat-${c.id}`} className="mb-14">
                <h2
                  id={`support-cat-${c.id}`}
                  className="font-satoshi font-bold text-[24px] text-white mb-6"
                >
                  {t(c.labelKey)}
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {articlesByCategory[c.id].map((article) => (
                    <SupportArticleCard key={article.slug} article={article} />
                  ))}
                </div>
              </section>
            ))}
            <SupportContactCard />
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
