// Content model for the augo support help centre.
//
// Pure types only — no import.meta.glob, no DOM. tsconfig.node.json (which covers
// test/**) ships neither vite/client nor the DOM lib, so anything a test imports
// has to stay clean of both or `tsc -b` fails the build. The glob lives in
// supportArticles.ts and nowhere else.

import type { FaqItem } from '../seo/articleSchema.shared'

// `erasableSyntaxOnly` forbids enum, so unions come from const arrays. The arrays
// double as the runtime allow-lists the content test validates against.
export const SUPPORT_AUDIENCES = ['coach', 'athlete', 'both'] as const
export type SupportAudience = (typeof SUPPORT_AUDIENCES)[number]

/** Adds the browse-everything option the hub toggle needs. */
export type SupportAudienceFilter = SupportAudience | 'all'

export const SUPPORT_CATEGORY_IDS = [
  'getting-started',
  'athletes',
  'training',
  'feedback',
  'assistant',
  'integrations',
  'account',
  'troubleshooting',
] as const
export type SupportCategoryId = (typeof SUPPORT_CATEGORY_IDS)[number]

export const SUPPORT_PLATFORMS = ['ios', 'android', 'web'] as const
export type SupportPlatform = (typeof SUPPORT_PLATFORMS)[number]

export const SUPPORT_VIDEO_PROVIDERS = ['youtube', 'loom'] as const
export type SupportVideoProvider = (typeof SUPPORT_VIDEO_PROVIDERS)[number]

export interface SupportImageMedia {
  type: 'image'
  /** Absolute public path, e.g. /support/connect-garmin/step-1.jpg */
  src: string
  alt: string
  caption?: string
  /** 'phone' caps the width for portrait app screenshots; 'wide' fills the column. */
  frame?: 'phone' | 'wide'
  width?: number
  height?: number
}

export interface SupportVideoMedia {
  type: 'video'
  provider: SupportVideoProvider
  /** Provider video id — never a full URL. The component builds the embed src. */
  id: string
  /** Local poster under /support/<slug>/. Required: it is what gets prerendered. */
  poster: string
  /** Accessible name for the play facade and the iframe title. */
  alt: string
  caption?: string
  durationSeconds?: number
}

export type SupportMedia = SupportImageMedia | SupportVideoMedia

export interface SupportStep {
  /** Short imperative title. Becomes the #step-N anchor label. */
  title: string
  /** Inline HTML for the step body, run through the same sanitizer as blog posts. */
  html: string
  media?: SupportMedia
}

export type SupportBlock =
  | { type: 'html'; html: string }
  | { type: 'media'; media: SupportMedia }
  | { type: 'steps'; heading?: string; steps: SupportStep[] }

export interface SupportArticleData {
  /** Must equal the filename without .json — enforced by test/supportContent.test.ts. */
  slug: string
  /** H1, phrased as the user's question. */
  title: string
  /**
   * Shorter, keyword-front-loaded <title>/og:title override. Used verbatim — add
   * "| augo" yourself. Falls back to `${title} | augo`. Same convention as BlogPostData.
   */
  seoTitle?: string
  /** Meta description. */
  description: string
  /**
   * The authored answer in 1–3 sentences. Rendered as a callout above the body, used
   * verbatim as the search-result snippet, and as the short answer for AI answer
   * engines. Always authored, never excerpted from the body — excerpts read badly.
   */
  summary: string
  audience: SupportAudience
  category: SupportCategoryId
  /**
   * Search synonyms, misspellings, error strings, old product names. Never rendered.
   * The highest-leverage authoring field: no-results queries from analytics get
   * folded back in here.
   */
  keywords?: string[]
  /** Hand ordering for "Popular" and a ranking tiebreak. 0 default; 1–3 for top articles. */
  weight?: number
  platforms?: SupportPlatform[]
  datePublished: string
  dateUpdated?: string
  body: SupportBlock[]
  faqs?: FaqItem[]
  /** Slugs. Must resolve to published articles. */
  related?: string[]
  /** Authored but hidden: excluded from the hub, search, sitemap and prerender. */
  draft?: boolean
}
