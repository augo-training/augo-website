import { useTranslation } from 'react-i18next'
import type { SupportSearchResponse } from '../../utils/supportSearch'
import type { SupportArticleData } from '../../utils/supportTypes'
import { allArticles } from '../../utils/supportArticles'
import SupportArticleCard from './SupportArticleCard'
import SupportContactCard from './SupportContactCard'

interface Props {
  query: string
  response: SupportSearchResponse
  articles: SupportArticleData[]
  onSuggestion: (q: string) => void
}

/**
 * Results, framed by how confident the ranking is.
 *
 * The framing is the point: presenting a hedged guess as a confident answer is
 * how a help centre loses trust. `closest` says so plainly rather than hoping
 * the user works it out.
 */
export default function SupportSearchResults({ query, response, articles, onSuggestion }: Props) {
  const { t } = useTranslation()
  const { tier } = response

  if (tier === 'unsure' || articles.length === 0) {
    // Never a dead end: say we don't know, then offer the most-asked articles
    // and a route to a human.
    const fallback = allArticles.slice(0, 3)
    return (
      <section aria-labelledby="support-results-title">
        <h2 id="support-results-title" className="font-satoshi font-bold text-[24px] text-white">
          {t('support.search.unsureTitle')}
        </h2>
        <p className="mt-2 text-text-muted text-[15px] leading-[165%]">
          {t('support.search.unsureBody')}
        </p>
        <SupportContactCard variant="prominent" />
        <h3 className="mt-12 mb-4 font-mono text-[11px] tracking-[2px] uppercase text-white/45">
          {t('support.search.mostAsked')}
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {fallback.map((article) => (
            <SupportArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>
    )
  }

  const suggestions =
    tier === 'closest'
      ? articles
          .flatMap((a) => (a.questionForms ?? []).slice(0, 2))
          .slice(0, 4)
      : []

  return (
    <section aria-labelledby="support-results-title">
      <h2 id="support-results-title" className="font-satoshi font-bold text-[24px] text-white">
        {tier === 'confident'
          ? t('support.search.resultsTitle', { count: articles.length })
          : t('support.search.closestTitle', { query })}
      </h2>
      {tier === 'closest' && (
        <p className="mt-2 text-text-muted text-[15px] leading-[165%]">
          {t('support.search.closestBody')}
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4">
        {articles.map((article, i) => (
          <SupportArticleCard
            key={article.slug}
            article={article}
            section={response.results[i]?.section}
          />
        ))}
      </div>

      {suggestions.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-3 font-mono text-[11px] tracking-[2px] uppercase text-white/45">
            {t('support.search.didYouMean')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSuggestion(s)}
                className="inline-flex items-center px-3 py-1.5 rounded-full font-satoshi text-[13px] text-white/75 ring-1 ring-white/[0.12] hover:text-white hover:ring-white/30 hover:bg-white/[0.04] transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <SupportContactCard variant={tier === 'confident' ? 'quiet' : 'prominent'} />
    </section>
  )
}
