import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { SupportArticleData } from '../../utils/supportTypes'
import { categoryById } from '../../utils/supportTaxonomy'

interface Props {
  article: SupportArticleData
}

/**
 * Result and listing card.
 *
 * The snippet is the article's authored `summary`, never an excerpt of the body.
 * Excerpts read badly out of context and force ellipsis logic; a written one-line
 * answer is also what an answer engine can quote directly.
 */
export default function SupportArticleCard({ article }: Props) {
  const { t } = useTranslation()
  const category = categoryById(article.category)

  return (
    <Link
      to={`/en/support/${article.slug}`}
      className="group block rounded-2xl border border-white/[0.08] bg-[#151515] hover:bg-[#1c1c1c] transition-colors p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {category && (
          <span className="font-mono text-[10px] tracking-[2px] uppercase text-text-muted">
            {t(category.labelKey)}
          </span>
        )}
        {article.audience !== 'both' && (
          <span className="inline-flex items-center rounded-full border border-white/20 px-2 py-0.5 font-mono text-[10px] tracking-[1.5px] uppercase text-white/70">
            {t(`support.audience.${article.audience}`)}
          </span>
        )}
      </div>
      <h3 className="font-satoshi font-bold text-[18px] sm:text-[20px] leading-[130%] text-white group-hover:underline underline-offset-4">
        {article.title}
      </h3>
      <p className="mt-2 text-text-muted text-[15px] leading-[160%]">{article.summary}</p>
    </Link>
  )
}
