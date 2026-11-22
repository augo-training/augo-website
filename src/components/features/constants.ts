import chat from '../../assets/images/img_section_chat.png?w=960&format=webp'
import feedback from '../../assets/images/img_section_coaches_3.png?w=652&format=webp'
import assistant from '../../assets/images/app_assistant.png?w=640&format=webp'
import workouts from '../../assets/images/img_section_coaches_workouts.png?w=960&format=webp'
import strength from '../../assets/images/img_section_coaches_strength.png?w=960&format=webp'
import connector from '../../assets/images/img_section_coaches_connector.png?w=960&format=webp'
import analysis from '../../assets/images/img_section_coaches_analysis.png?w=960&format=webp'
import recovery from '../../assets/images/img_section_coaches_recovery.png?w=960&format=webp'
import signals from '../../assets/images/img_section_coaches_signals.png?w=960&format=webp'
import zones from '../../assets/images/img_section_coaches_zones.png?w=744&format=webp'
import notes from '../../assets/images/img_section_coaches_4.png?w=640&format=webp'
import dashboard from '../../assets/images/app_web_dashboard.png?w=1280&format=webp'
import athleteWorkout from '../../assets/images/img_for_athletes_workout.png?w=960&format=webp'
import athleteStrength from '../../assets/images/img_for_athletes_strength.png?w=960&format=webp'
import athleteTrends from '../../assets/images/img_for_athletes_trends.png?w=960&format=webp'
import athleteHome from '../../assets/images/athlete_home.png?w=334&format=webp'

/**
 * Everything on the Features page that must not be translated: renders, support
 * links and which coaching-week stage each feature belongs to. The copy lives
 * under `features` in the locale files; test/featuresContent.test.ts keeps the
 * two in step.
 */

/** Section ids. Hash links use these, so they are part of the page's public URLs. */
export const SECTION_IDS = {
    index: 'all-features',
    guide: 'by-feature',
    week: 'by-week',
    integrations: 'integrations',
    glance: 'at-a-glance',
    faqs: 'faqs',
} as const

export type FeaturesView = 'guide' | 'week'

/**
 * Renders come in three shapes. Square ones are cut out onto transparency and
 * sit on the glow; tall ones are phone screens; wide is the web app.
 */
export type VisualShape = 'square' | 'tall' | 'wide'

export interface FeatureVisual {
    src: string
    shape: VisualShape
}

export const FEATURE_VISUALS: Record<string, FeatureVisual> = {
    chat: { src: chat, shape: 'square' },
    feedback: { src: feedback, shape: 'tall' },
    assistant: { src: assistant, shape: 'tall' },
    workouts: { src: workouts, shape: 'square' },
    strength: { src: strength, shape: 'square' },
    connector: { src: connector, shape: 'square' },
    analysis: { src: analysis, shape: 'square' },
    recovery: { src: recovery, shape: 'square' },
    signals: { src: signals, shape: 'square' },
    zones: { src: zones, shape: 'square' },
    notes: { src: notes, shape: 'tall' },
    switching: { src: dashboard, shape: 'wide' },
    'a-chat': { src: chat, shape: 'square' },
    'a-workouts': { src: athleteWorkout, shape: 'square' },
    'a-strength': { src: athleteStrength, shape: 'square' },
    'a-trends': { src: athleteTrends, shape: 'square' },
    'a-recovery': { src: recovery, shape: 'square' },
    'a-free': { src: athleteHome, shape: 'tall' },
}

/** Support articles are English-only, so these always link to /en/support. */
export const SUPPORT_SLUGS: Record<string, string> = {
    chat: 'getting-started-as-a-coach',
    assistant: 'what-can-i-ask-the-assistant',
    workouts: 'create-workouts',
    strength: 'strength-workouts',
    connector: 'connect-augo-with-claude-and-chatgpt',
    recovery: 'connect-devices-and-apps',
    signals: 'athlete-signals',
    notes: 'coach-private-notes',
    switching: 'import-training-history',
    'a-workouts': 'workouts-on-your-device',
    'a-recovery': 'connect-devices-and-apps',
}

/**
 * Feature ids shown at each stage of the coaching week, in the same order as
 * `features.week.stages`. A feature's "Where it fits" link points at the first
 * stage that lists it, so the two views can't disagree. Features that aren't
 * part of a week (switching, free for athletes) simply have no link.
 */
export const STAGE_FEATURES: { key: string; coach: string[]; athlete: string[] }[] = [
    { key: 'plan', coach: ['workouts', 'strength', 'zones'], athlete: ['a-workouts'] },
    { key: 'deliver', coach: ['connector'], athlete: ['a-strength'] },
    { key: 'listen', coach: ['feedback', 'recovery', 'analysis'], athlete: ['a-recovery'] },
    { key: 'decide', coach: ['signals', 'assistant'], athlete: ['a-trends'] },
    { key: 'adjust', coach: ['chat', 'notes'], athlete: ['a-chat'] },
]

export const stageId = (key: string) => `week-${key}`

/** Index into STAGE_FEATURES for each feature id that appears in the week. */
export const STAGE_OF: Record<string, number> = {}
STAGE_FEATURES.forEach((stage, i) => {
    for (const id of [...stage.coach, ...stage.athlete]) {
        if (!(id in STAGE_OF)) STAGE_OF[id] = i
    }
})

/**
 * Which view holds a given hash target, or null for sections that sit under
 * both views (index, integrations, at a glance, FAQ), where the view shouldn't change.
 */
export function viewForHash(hash: string): FeaturesView | null {
    const id = hash.replace(/^#/, '')
    if (id === SECTION_IDS.week || STAGE_FEATURES.some((s) => stageId(s.key) === id)) return 'week'
    if (id === SECTION_IDS.guide || id === 'for-coaches' || id === 'for-athletes' || id in FEATURE_VISUALS) return 'guide'
    return null
}

/**
 * The integrations table, from the support article "Which devices and apps
 * does augo integrate with?". Cell values are keys into
 * `features.integrations.table.values`.
 */
export type IntegrationCell = 'yes' | 'no' | 'rides' | 'export' | 'days30' | 'years5'

export interface IntegrationRow {
    name: string
    planned: IntegrationCell
    completed: IntegrationCell
    history: IntegrationCell
    recovery: IntegrationCell
}

export const TRAINING_INTEGRATIONS: IntegrationRow[] = [
    { name: 'Garmin', planned: 'yes', completed: 'yes', history: 'days30', recovery: 'yes' },
    { name: 'COROS', planned: 'yes', completed: 'yes', history: 'years5', recovery: 'yes' },
    { name: 'Wahoo', planned: 'yes', completed: 'yes', history: 'years5', recovery: 'no' },
    { name: 'Suunto', planned: 'yes', completed: 'yes', history: 'years5', recovery: 'no' },
    { name: 'Polar', planned: 'no', completed: 'yes', history: 'years5', recovery: 'no' },
    { name: 'Apple Watch', planned: 'no', completed: 'yes', history: 'years5', recovery: 'no' },
    { name: 'Strava', planned: 'no', completed: 'yes', history: 'years5', recovery: 'no' },
    { name: 'Zwift', planned: 'export', completed: 'yes', history: 'years5', recovery: 'no' },
    { name: 'Rouvy', planned: 'rides', completed: 'yes', history: 'years5', recovery: 'no' },
    { name: 'Hammerhead', planned: 'no', completed: 'yes', history: 'years5', recovery: 'no' },
]

/** Recovery-only sources: sleep, resting heart rate, HRV and steps. */
export const RECOVERY_INTEGRATIONS: IntegrationRow[] = [
    { name: 'WHOOP', planned: 'no', completed: 'no', history: 'no', recovery: 'yes' },
    { name: 'Oura', planned: 'no', completed: 'no', history: 'no', recovery: 'yes' },
    { name: 'Apple Health', planned: 'no', completed: 'no', history: 'no', recovery: 'yes' },
]

export interface FeatureItem {
    id: string
    category: string
    title: string
    summary: string
    lead: string
    steps: string[]
    specs: { label: string; value: string }[]
    proof: string
}

export interface WeekStage {
    key: string
    name: string
    title: string
    intro: string
    coach: { points: string[] }
    athlete: { points: string[] }
}
