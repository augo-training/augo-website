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
   * Short terms and phrases — concept vocabulary, not whole questions. Whole
   * questions belong in `questionForms`.
   */
  keywords?: string[]
  /**
   * Complete phrasings a person would actually type, e.g. "my watch won't sync".
   * Never rendered as page content; drives search and the "did you mean" chips.
   *
   * This is the highest-leverage authoring field. An exact match here is the
   * single strongest ranking signal in the system, so the field must stay
   * homogeneous — a list of complete queries this article claims to answer, and
   * nothing else. Concept nouns go in `keywords`; mixing them here would make a
   * one-word query fire a whole-form bonus it hasn't earned.
   *
   * Writing them:
   * - 10-20 entries, lowercase, punctuation optional.
   * - Cover all four intent shapes: definitional ("what is session feedback"),
   *   procedural ("how do i turn on feedback"), troubleshooting ("my athletes
   *   aren't getting asked"), decisional ("should i use session feedback").
   * - Include the blunt, frustrated register — "watch not syncing", "stop
   *   paying" — not only polite full sentences.
   * - Include pre-product vocabulary: what someone calls it before they know the
   *   real term ("the thing that tells me who needs attention").
   * - Don't restate the title; it is already indexed at a high weight.
   * - A question form is a claim of ownership. Never write one that another
   *   article should win — test/supportContent.test.ts enforces uniqueness.
   */
  questionForms?: string[]
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
