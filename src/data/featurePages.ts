/**
 * The address of each Features sub-page: /:lang/features/<slug>. Keyed by the
 * feature ids in the locale files. Slugs are English in every language, so a
 * link keeps working when someone switches language.
 *
 * Plain data on purpose: scripts/routes.ts imports this for prerender and the
 * sitemap, and node can't load the image imports the components use.
 */
export const FEATURE_SLUGS: Record<string, string> = {
    devices: 'devices',
    integrations: 'integrations',
    switching: 'migration',
    chat: 'chat-and-workout-feed',
    feedback: 'session-feedback',
    assistant: 'in-app-assistant',
    workouts: 'workout-builder',
    strength: 'strength-training',
    connector: 'claude-and-chatgpt-connector',
    analysis: 'workout-analysis',
    recovery: 'recovery-data',
    signals: 'athlete-signals',
    zones: 'zones-and-performance-anchors',
    files: 'lab-report-upload',
    notes: 'private-coach-notes',
    'a-chat': 'athlete-chat',
    'a-workouts': 'workouts-on-your-watch',
    'a-strength': 'strength-training-for-athletes',
    'a-trends': 'athlete-trends',
    'a-recovery': 'athlete-recovery-data',
    'a-free': 'free-for-athletes',
}

/** Paths under /:lang, for routes.ts. */
export const FEATURE_PAGE_PATHS = Object.values(FEATURE_SLUGS).map((slug) => `/features/${slug}`)

export const featureIdForSlug = (slug: string): string | undefined =>
    Object.keys(FEATURE_SLUGS).find((id) => FEATURE_SLUGS[id] === slug)

export const featureHref = (lang: string, id: string) => `/${lang}/features/${FEATURE_SLUGS[id]}`
