import { useTranslation } from 'react-i18next'
import type { SupportAudienceFilter, SupportCategoryId } from '../../utils/supportTypes'
import { SUPPORT_CATEGORIES } from '../../utils/supportTaxonomy'
import { countsByCategory } from '../../utils/supportArticles'

interface Props {
  audience: SupportAudienceFilter
  onSelect: (id: SupportCategoryId) => void
}

/**
 * Browse-by-category grid.
 *
 * Selecting a category filters the hub in place via ?category= rather than
 * navigating to a per-category route. One page, one search index, no extra
 * sitemap entries, and no thin category pages competing with the articles
 * themselves for the same queries.
 *
 * Empty categories are hidden rather than shown at zero — a help centre that
 * advertises sections with nothing in them reads as broken.
 */
export default function SupportCategoryGrid({ audience, onSelect }: Props) {
  const { t } = useTranslation()
  const counts = countsByCategory(audience)

  const visible = SUPPORT_CATEGORIES.filter((c) => counts[c.id] > 0).sort(
    (a, b) => a.order - b.order,
  )

  if (visible.length === 0) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {visible.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelect(category.id)}
          className="text-left rounded-2xl border border-white/[0.08] bg-[#151515] hover:bg-[#1c1c1c] transition-colors p-5"
        >
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-satoshi font-bold text-[17px] text-white">
              {t(category.labelKey)}
            </h3>
            <span className="font-mono text-[11px] text-text-muted shrink-0">
              {counts[category.id]}
            </span>
          </div>
          <p className="mt-2 text-text-muted text-[14px] leading-[155%]">
            {t(category.descriptionKey)}
          </p>
        </button>
      ))}
    </div>
  )
}
