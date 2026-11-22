import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supportSearch } from '../../utils/supportSearch'
import { articlesBySlug, getSupportSearchIndex } from '../../utils/supportArticles'
import { buildFeaturesSearch } from './pageSearchIndex'
import type { FeatureItem } from './constants'

/**
 * Instant search over this page and the support articles, no AI. Uses the
 * support centre's engine, so typos, synonyms and question phrasing work the
 * same way they do there. Results split into "On this page" (hash links the
 * page's click handler turns into a view switch and scroll) and "In Support".
 */
export default function FeaturesSearch() {
    const { t, i18n } = useTranslation()
    const [query, setQuery] = useState('')

    const page = useMemo(
        () =>
            buildFeaturesSearch({
                coach: t('features.coach.items', { returnObjects: true }) as FeatureItem[],
                athlete: t('features.athlete.items', { returnObjects: true }) as FeatureItem[],
                migration: t('features.migration.item', { returnObjects: true }) as FeatureItem,
                devices: {
                    title: t('features.devices.title'),
                    lead: t('features.devices.lead'),
                    text: (['coach', 'athlete'] as const).map((who) => t(`features.devices.${who}.body`)),
                },
                integrations: {
                    title: t('features.integrations.title'),
                    lead: t('features.integrations.lead'),
                    text: [
                        ...(t('features.integrations.how.items', { returnObjects: true }) as { body: string }[]).map((i) => i.body),
                        ...(t('features.integrations.connect.points', { returnObjects: true }) as string[]),
                    ],
                },
                faq: t('features.faq.items', { returnObjects: true }) as { question: string; answer: string }[],
            }),
        // The copy only changes with the language.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [i18n.language],
    )

    const results = useMemo(() => {
        if (!query.trim()) return null
        const onPage = supportSearch(query, page.index, { limit: 4 })
        const inSupport = supportSearch(query, getSupportSearchIndex(), { limit: 3 })
        const show = (r: typeof onPage) => r.hasDiscriminatingTerm && r.tier !== 'unsure'
        // FAQ entries share one anchor, so keep only the first hit per link.
        const seen = new Set<string>()
        return {
            page: show(onPage)
                ? onPage.results
                      .map((r) => page.hits[r.slug])
                      .filter((hit) => hit && !seen.has(hit.hash) && seen.add(hit.hash))
                : [],
            support: show(inSupport) ? inSupport.results.map((r) => articlesBySlug[r.slug]).filter(Boolean) : [],
        }
    }, [query, page])

    const suggestions = t('features.search.suggestions', { returnObjects: true }) as string[]
    const nothing = results && results.page.length === 0 && results.support.length === 0

    const resultLink = 'block rounded-xl px-4 py-3 hover:bg-white/[0.05] transition-colors'

    return (
        <div className="w-full">
            <label htmlFor="features-search" className="sr-only">
                {t('features.search.label')}
            </label>
            <div className="relative">
                <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                    id="features-search"
                    type="text"
                    enterKeyHint="search"
                    autoComplete="off"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('features.search.placeholder')}
                    className="w-full h-14 pl-12 pr-12 rounded-xl bg-white/[0.05] border border-white/[0.12] focus:border-white/40 focus:outline-none font-satoshi text-[16px] text-white placeholder:text-white/40"
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => setQuery('')}
                        aria-label={t('features.search.clear')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.06]"
                    >
                        ×
                    </button>
                )}
            </div>

            {!query && (
                <div className="mt-3 flex flex-wrap items-center gap-2 font-satoshi text-[14px]">
                    <span className="text-white/45">{t('features.search.suggestionsLabel')}</span>
                    {suggestions.map((s) => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => setQuery(s)}
                            className="rounded-full border border-white/[0.14] px-3 py-1 text-white/75 hover:text-white hover:border-white/35 transition-colors"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}

            {results && (
                <div aria-live="polite" className="mt-3 rounded-2xl border border-white/[0.1] bg-[#0E0E0E] p-2">
                    {nothing && <p className="px-4 py-3 font-satoshi text-[15px] text-white/60">{t('features.search.empty')}</p>}
                    {results.page.length > 0 && (
                        <div>
                            <p className="px-4 pt-2 pb-1 font-mono text-[11px] tracking-[2px] uppercase text-white/45">
                                {t('features.search.onPage')}
                            </p>
                            <ul>
                                {results.page.map((hit) => (
                                    <li key={hit.hash + hit.title}>
                                        <a href={hit.hash} className={resultLink}>
                                            <span className="block font-satoshi font-medium text-[16px] text-white">{hit.title}</span>
                                            <span className="block mt-0.5 font-satoshi text-[14px] leading-[145%] text-white/60 line-clamp-2">
                                                {hit.summary}
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {results.support.length > 0 && (
                        <div className={results.page.length > 0 ? 'mt-1 pt-1 border-t border-white/[0.08]' : ''}>
                            <p className="px-4 pt-2 pb-1 font-mono text-[11px] tracking-[2px] uppercase text-white/45">
                                {t('features.search.support')}
                            </p>
                            <ul>
                                {results.support.map((article) => (
                                    <li key={article.slug}>
                                        <a href={`/en/support/${article.slug}/`} className={resultLink}>
                                            <span className="block font-satoshi font-medium text-[16px] text-white">
                                                {article.title} <span className="text-white/40">→</span>
                                            </span>
                                            <span className="block mt-0.5 font-satoshi text-[14px] leading-[145%] text-white/60 line-clamp-2">
                                                {article.summary}
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
