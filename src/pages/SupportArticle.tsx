import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEOHead from '../seo/SEOHead'
import { OrganizationJsonLd } from '../seo/JsonLd'
import { buildFaqSchema } from '../seo/articleSchema.shared'
import { supportUrl } from '../seo/seoConstants'
import NotFound from './NotFound'
import SupportBody from '../components/support/SupportBody'
import SupportArticleCard from '../components/support/SupportArticleCard'
import { categoryById } from '../utils/supportTaxonomy'
import { articlesBySlug, formatSupportDate, getRelated } from '../utils/supportArticles'
import { trackSupportArticleViewed } from '../utils/analytics'

export default function SupportArticle() {
  const { lang, slug } = useParams<{ lang: string; slug: string }>()
  const { t } = useTranslation()
  const article = slug ? articlesBySlug[slug] : undefined

  useEffect(() => {
    if (!article) return
    trackSupportArticleViewed({
      slug: article.slug,
      category: article.category,
      audience: article.audience,
    })
  }, [article])

  // English-only at launch, mirroring the blog.
  if (lang && lang !== 'en' && slug) {
    return <Navigate to={`/en/support/${slug}`} replace />
  }

  if (!article) {
    return <NotFound />
  }

  const category = categoryById(article.category)
  const related = getRelated(article.slug)
  const updated = article.dateUpdated ?? article.datePublished

  return (
    <>
      <SEOHead
        path={`/support/${article.slug}`}
        title={article.seoTitle ?? `${article.title} | augo`}
        description={article.description}
        ogType="article"
        articleMeta={{
          publishedTime: article.datePublished,
          modifiedTime: article.dateUpdated,
        }}
        canonicalOverride={supportUrl(article.slug)}
        noAlternates
      />
      <OrganizationJsonLd />
      {article.faqs && article.faqs.length > 0 && (
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify(buildFaqSchema(article.faqs))}
          </script>
        </Helmet>
      )}
      <Navbar />
      <article className="mx-auto max-w-[760px] px-6 pt-32 pb-24 text-white">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-text-muted">
            <li>
              <Link to="/en/support" className="hover:text-white underline-offset-4 hover:underline">
                {t('support.hub.breadcrumb')}
              </Link>
            </li>
            {category && (
              <>
                <li aria-hidden>/</li>
                <li>
                  <Link
                    to={`/en/support?category=${article.category}`}
                    className="hover:text-white underline-offset-4 hover:underline"
                  >
                    {t(category.labelKey)}
                  </Link>
                </li>
              </>
            )}
          </ol>
        </nav>

        <header className="mb-10">
          <h1 className="font-satoshi font-bold text-[34px] sm:text-[42px] leading-[115%] tracking-[-0.02em] mb-5">
            {article.title}
          </h1>
          <p className="support-callout">{article.summary}</p>
          <p className="mt-5 text-text-muted text-[13px]">
            {t('support.article.updatedOn')}{' '}
            <time dateTime={updated}>{formatSupportDate(updated)}</time>
          </p>
        </header>

        <SupportBody blocks={article.body} slug={article.slug} />

        {article.faqs && article.faqs.length > 0 && (
          <section aria-labelledby="support-faq-title" className="mt-16 pt-8 border-t border-dark-600">
            <h2
              id="support-faq-title"
              className="font-satoshi font-bold text-[24px] text-white mb-6"
            >
              {t('support.article.faqTitle')}
            </h2>
            <div className="flex flex-col">
              {/* Native details/summary: every answer stays in the static DOM whether
                  open or closed, so it is crawlable and keyboard-navigable for free. */}
              {article.faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group border-t border-white/[0.08] last:border-b py-4"
                >
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden font-satoshi font-medium text-[17px] text-white">
                    {faq.question}
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-text-muted transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-text-muted text-[15px] leading-[165%]">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section
            aria-labelledby="support-related-title"
            className="mt-16 pt-8 border-t border-dark-600"
          >
            <h2
              id="support-related-title"
              className="font-satoshi font-bold text-[24px] text-white mb-6"
            >
              {t('support.article.relatedTitle')}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {related.map((item) => (
                <SupportArticleCard key={item.slug} article={item} />
              ))}
            </div>
          </section>
        )}
      </article>
      <Footer />
    </>
  )
}
