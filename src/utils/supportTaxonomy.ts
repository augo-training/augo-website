// Support category definitions and the curated onboarding paths.
//
// Lives in .ts rather than a JSON file in src/content/support/ on purpose:
// discoverSupportSlugs() treats every .json in that directory as a live article
// slug, so a stray taxonomy file there would prerender as a soft 404.

import type { SupportCategoryId } from './supportTypes'

export interface SupportCategory {
  id: SupportCategoryId
  /** i18n key under support.categories — label and description live in en.json. */
  labelKey: string
  descriptionKey: string
  order: number
}

export const SUPPORT_CATEGORIES: SupportCategory[] = [
  {
    id: 'getting-started',
    labelKey: 'support.categories.getting-started.label',
    descriptionKey: 'support.categories.getting-started.description',
    order: 1,
  },
  {
    id: 'athletes',
    labelKey: 'support.categories.athletes.label',
    descriptionKey: 'support.categories.athletes.description',
    order: 2,
  },
  {
    id: 'training',
    labelKey: 'support.categories.training.label',
    descriptionKey: 'support.categories.training.description',
    order: 3,
  },
  {
    id: 'feedback',
    labelKey: 'support.categories.feedback.label',
    descriptionKey: 'support.categories.feedback.description',
    order: 4,
  },
  {
    id: 'assistant',
    labelKey: 'support.categories.assistant.label',
    descriptionKey: 'support.categories.assistant.description',
    order: 5,
  },
  {
    id: 'integrations',
    labelKey: 'support.categories.integrations.label',
    descriptionKey: 'support.categories.integrations.description',
    order: 6,
  },
  {
    id: 'account',
    labelKey: 'support.categories.account.label',
    descriptionKey: 'support.categories.account.description',
    order: 7,
  },
  {
    id: 'troubleshooting',
    labelKey: 'support.categories.troubleshooting.label',
    descriptionKey: 'support.categories.troubleshooting.description',
    order: 8,
  },
]

const categoriesById = new Map(SUPPORT_CATEGORIES.map((c) => [c.id, c]))

export function categoryById(id: SupportCategoryId): SupportCategory | undefined {
  return categoriesById.get(id)
}

/**
 * Curated ordered slugs for the two "start here" cards on the hub. Hand-ordered
 * rather than derived, because the right first article is an editorial call.
 * Slugs that don't resolve are dropped at render time, so this can name articles
 * that haven't been written yet.
 */
export const GETTING_STARTED_PATHS: Record<'coach' | 'athlete', string[]> = {
  coach: [
    'getting-started-as-a-coach',
    'add-an-athlete',
    'connect-devices-and-apps',
    'whats-free-and-when-do-i-pay',
  ],
  athlete: [
    'getting-started-as-an-athlete',
    'connect-devices-and-apps',
    'session-feedback-explained',
    'workout-not-showing-up',
  ],
}
