import { buildSupportSearchIndex, type SupportSearchIndex } from '../../utils/supportSearchIndex'
import type { SupportArticleData } from '../../utils/supportTypes'
import { HISTORY_IMPORTS, RECOVERY_INTEGRATIONS, SECTION_IDS, TRAINING_INTEGRATIONS, type FeatureItem } from './constants'

/**
 * The Features page's own search index, built with the support search engine
 * (same tokenising, synonyms and typo tolerance). Each feature, the
 * integrations section and each FAQ entry becomes a pseudo-article whose slug
 * is the hash it links to. Pure: tests can import it.
 */

/**
 * Words people search for that the copy doesn't always use: brand names,
 * abbreviations and what something is called before you know augo's name for
 * it. English only; the copy itself is indexed in the page's language.
 */
export const FEATURE_KEYWORDS: Record<string, string[]> = {
    chat: ['whatsapp', 'messages', 'messaging', 'voice note', 'voice memo', 'transcription', 'notifications', 'comments', 'reactions'],
    feedback: ['rpe', 'pain', 'niggles', 'fuelling', 'fueling', 'nutrition', 'digestion', 'check-in', 'wellbeing', 'questionnaire', 'how they felt'],
    assistant: ['ai', 'claude', 'chatbot', 'ask', 'analysis', 'insights', 'call prep'],
    workouts: ['workout builder', 'training plan', 'library', 'templates', 'copy paste', 'drag and drop', 'intervals', 'pace', 'heart rate', 'trainingpeaks'],
    strength: ['gym', 'weights', 'exercises', 'sets', 'reps', 'mobility', 'demo video'],
    connector: ['mcp', 'chatgpt', 'claude', 'openai', 'anthropic', 'connector'],
    analysis: ['splits', 'laps', 'intervals', 'time in zone', 'charts', 'planned vs completed', 'compliance', 'metrics'],
    recovery: ['whoop', 'oura', 'hrv', 'sleep', 'resting heart rate', 'rhr', 'steps', 'apple health', 'readiness', 'wearable'],
    signals: ['alerts', 'attention', 'priorities', 'who needs me', 'flags', 'pb', 'personal best'],
    zones: ['ftp', 'threshold', 'lthr', 'power', 'pace zones', 'heart rate zones', 'lab test', 'lactate'],
    notes: ['private notes', 'injury history', 'intake'],
    switching: ['trainingpeaks', 'training peaks', 'final surge', 'migrate', 'migration', 'import', 'free trial', 'trial', 'history', 'switch'],
    'a-chat': ['message my coach', 'whatsapp', 'voice note'],
    'a-workouts': ['garmin', 'coros', 'wahoo', 'suunto', 'rouvy', 'zwift', 'mywhoosh', 'watch', 'manual entry', 'races'],
    'a-strength': ['gym', 'exercises', 'rest timer', 'demo video'],
    'a-trends': ['volume', 'progress', 'race countdown', 'charts', 'pain', 'feeling'],
    'a-recovery': ['whoop', 'oura', 'hrv', 'sleep', 'apple health', 'wearable'],
    'a-free': ['price', 'cost', 'pay', 'free', 'subscription', 'premium', 'paywall'],
}

const INTEGRATION_KEYWORDS = [
    ...TRAINING_INTEGRATIONS.map((row) => row.name),
    ...RECOVERY_INTEGRATIONS.map((row) => row.name),
    ...HISTORY_IMPORTS.map((row) => row.name),
    'history', 'import', 'export', 'unlimited',
    'karoo', 'mywhoosh', 'devices', 'watch', 'sync', 'connect', 'integrations', 'web app', 'ios', 'android', 'mobile app', 'iphone',
]

interface PageCopy {
    coach: FeatureItem[]
    athlete: FeatureItem[]
    integrations: { title: string; lead: string; text: string[] }
    faq: { question: string; answer: string }[]
}

export interface PageHit {
    /** In-page hash, e.g. "#recovery". */
    hash: string
    title: string
    summary: string
}

const doc = (
    slug: string,
    title: string,
    summary: string,
    body: string[],
    keywords: string[],
    audience: SupportArticleData['audience'],
): SupportArticleData => ({
    slug,
    title,
    description: '',
    summary,
    audience,
    category: 'getting-started',
    keywords,
    datePublished: '',
    body: [{ type: 'html', html: body.map((p) => `<p>${p}</p>`).join('') }],
})

export function buildFeaturesSearch(copy: PageCopy): { index: SupportSearchIndex; hits: Record<string, PageHit> } {
    const hits: Record<string, PageHit> = {}
    const docs: SupportArticleData[] = []

    const add = (article: SupportArticleData) => {
        docs.push(article)
        hits[article.slug] = { hash: article.slug, title: article.title, summary: article.summary }
    }

    for (const [items, audience] of [[copy.coach, 'coach'], [copy.athlete, 'athlete']] as const) {
        for (const item of items) {
            add(
                doc(
                    `#${item.id}`,
                    item.title,
                    item.summary,
                    [item.lead, ...item.steps, ...item.specs.map((s) => `${s.label}: ${s.value}`), item.proof, item.category],
                    FEATURE_KEYWORDS[item.id] ?? [],
                    audience,
                ),
            )
        }
    }

    add(doc(`#${SECTION_IDS.integrations}`, copy.integrations.title, copy.integrations.lead, copy.integrations.text, INTEGRATION_KEYWORDS, 'both'))

    copy.faq.forEach((item, i) => {
        // Every FAQ answer links to the FAQ section; the index suffix only keeps slugs unique.
        const article = doc(`#${SECTION_IDS.faqs}~${i}`, item.question, item.answer, [item.answer], [], 'both')
        docs.push(article)
        hits[article.slug] = { hash: `#${SECTION_IDS.faqs}`, title: item.question, summary: item.answer }
    })

    return { index: buildSupportSearchIndex(docs), hits }
}
