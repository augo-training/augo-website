import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEOHead from '../seo/SEOHead'
import { OrganizationJsonLd } from '../seo/JsonLd'
import { supportUrl } from '../seo/seoConstants'
import SupportCategoryGrid from '../components/support/SupportCategoryGrid'
import SupportArticleCard from '../components/support/SupportArticleCard'
import SupportSearchBar from '../components/support/SupportSearchBar'
import SupportSearchResults from '../components/support/SupportSearchResults'
import SupportContactCard from '../components/support/SupportContactCard'
import { useSupportSearch } from '../hooks/useSupportSearch'
import { SUPPORT_CATEGORY_IDS } from '../utils/supportTypes'
import type { SupportCategoryId } from '../utils/supportTypes'
import { categoryById } from '../utils/supportTaxonomy'
import { allArticles, articlesByCategory } from '../utils/supportArticles'

function isCategoryId(value: string | null): value is SupportCategoryId {
  return value !== null && (SUPPORT_CATEGORY_IDS as readonly string[]).includes(value)
}

export default function SupportHub() {
  const { lang } = useParams<{ lang: string }>()
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { query, setQuery, clear, response, articles: resultArticles } = useSupportSearch()

  // English-only at launch, mirroring the blog.
  if (lang && lang !== 'en') {
    return <Navigate to="/en/support" replace />
  }

  const categoryParam = searchParams.get('category')
  const activeCategory = isCategoryId(categoryParam) ? categoryParam : null

  const setCategory = (id: SupportCategoryId | null) => {
    const next = new URLSearchParams(searchParams)
    if (id) next.set('category', id)
    else next.delete('category')
    setSearchParams(next, { replace: true })
  }

  const listed = activeCategory ? articlesByCategory[activeCategory] : allArticles
  const activeCategoryMeta = activeCategory ? categoryById(activeCategory) : null

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

        {/* A live query replaces the browse sections entirely. The thrash gate
            keeps the browse view in place while the query is still all
            low-signal words, so the page doesn't churn mid-sentence. */}
        {response && response.hasDiscriminatingTerm ? (
          <SupportSearchResults
            query={query}
            response={response}
            articles={resultArticles}
            onSuggestion={setQuery}
          />
        ) : activeCategory && activeCategoryMeta ? (
          <section aria-labelledby="support-category-title">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <h2
                id="support-category-title"
                className="font-satoshi font-bold text-[24px] text-white"
              >
                {t(activeCategoryMeta.labelKey)}
              </h2>
              <button
                type="button"
                onClick={() => setCategory(null)}
                className="font-satoshi text-[14px] text-text-muted hover:text-white underline underline-offset-4"
              >
                {t('support.hub.clearCategory')}
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {listed.map((article) => (
                <SupportArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </section>
        ) : (
          <>
            {allArticles.length > 0 && (
              <section aria-labelledby="support-popular-title" className="mb-16">
                <h2
                  id="support-popular-title"
                  className="font-satoshi font-bold text-[24px] text-white mb-6"
                >
                  {t('support.hub.popularTitle')}
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {allArticles.slice(0, 6).map((article) => (
                    <SupportArticleCard key={article.slug} article={article} />
                  ))}
                </div>
              </section>
            )}

            <section aria-labelledby="support-browse-title">
              <h2
                id="support-browse-title"
                className="font-satoshi font-bold text-[24px] text-white mb-6"
              >
                {t('support.hub.browseTitle')}
              </h2>
              <SupportCategoryGrid audience="all" onSelect={setCategory} />
            </section>
            <SupportContactCard />
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
