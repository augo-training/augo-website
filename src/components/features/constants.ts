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
import { ONBOARDING_CALL_URL } from '../../data/onboarding'

/**
 * Everything on the Features page that must not be translated: renders,
 * support links and the integrations table. The copy lives
 * under `features` in the locale files; test/featuresContent.test.ts keeps the
 * two in step.
 */

/** Section ids. Hash links use these, so they are part of the page's public URLs. */
export const SECTION_IDS = {
    index: 'all-features',
    coaches: 'for-coaches',
    athletes: 'for-athletes',
    devices: 'devices',
    integrations: 'integrations',
    migration: 'migration',
    glance: 'at-a-glance',
    faqs: 'faqs',
} as const

/**
 * Renders come in three shapes. Square ones are cut out onto transparency and
 * sit on the glow; tall ones are phone screens; wide is the web app; phone is
 * a phone screen in a wide frame, to sit next to the web app.
 */
export type VisualShape = 'square' | 'tall' | 'wide' | 'phone'

export interface FeatureVisual {
    src?: string
    shape: VisualShape
    /** A visual drawn in code instead of an image (see LabUploadVisual). */
    drawing?: 'labUpload'
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
    files: { shape: 'square', drawing: 'labUpload' },
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
    files: 'what-can-i-do-with-the-connector',
    notes: 'coach-private-notes',
    switching: 'import-training-history',
    'a-workouts': 'workouts-on-your-device',
    'a-recovery': 'connect-devices-and-apps',
}

/** Features with a booking button of their own, keyed by feature id. */
export const FEATURE_CALLS: Record<string, string> = {
    switching: ONBOARDING_CALL_URL,
}

/**
 * The integrations table, from the support article "Which devices and apps
 * does augo integrate with?". Cell values are keys into
 * `features.integrations.table.values`.
 */
export type IntegrationCell = 'yes' | 'no' | 'rides' | 'export' | 'days30' | 'years5' | 'none' | 'unlimited'

export interface IntegrationRow {
    name: string
    planned: IntegrationCell
    completed: IntegrationCell
    /** What comes in on its own when the athlete connects. */
    historyAuto: IntegrationCell
    /** What we can import when the athlete asks. */
    historyRequest: IntegrationCell
    recovery: IntegrationCell
    /** Support guide for requesting the history, linked from the on-request cell. */
    requestHref?: string
}

const IMPORT_GUIDE = '/en/support/import-training-history/'

export const TRAINING_INTEGRATIONS: IntegrationRow[] = [
    { name: 'Garmin', planned: 'yes', completed: 'yes', historyAuto: 'days30', historyRequest: 'unlimited', recovery: 'yes', requestHref: `${IMPORT_GUIDE}#option-2-garmin` },
    { name: 'COROS', planned: 'yes', completed: 'yes', historyAuto: 'days30', historyRequest: 'years5', recovery: 'yes' },
    { name: 'Wahoo', planned: 'yes', completed: 'yes', historyAuto: 'days30', historyRequest: 'years5', recovery: 'no' },
    { name: 'Suunto', planned: 'yes', completed: 'yes', historyAuto: 'days30', historyRequest: 'years5', recovery: 'no' },
    { name: 'Polar', planned: 'no', completed: 'yes', historyAuto: 'days30', historyRequest: 'years5', recovery: 'no' },
    { name: 'Apple Watch', planned: 'no', completed: 'yes', historyAuto: 'days30', historyRequest: 'years5', recovery: 'no' },
    { name: 'Strava', planned: 'no', completed: 'yes', historyAuto: 'days30', historyRequest: 'years5', recovery: 'no' },
    { name: 'Zwift', planned: 'export', completed: 'yes', historyAuto: 'days30', historyRequest: 'years5', recovery: 'no' },
    // Planned rides only, as a .zwo file exported from the augo app. Nothing syncs back.
    { name: 'MyWhoosh', planned: 'export', completed: 'no', historyAuto: 'no', historyRequest: 'no', recovery: 'no' },
    { name: 'Rouvy', planned: 'rides', completed: 'yes', historyAuto: 'days30', historyRequest: 'years5', recovery: 'no' },
    { name: 'Hammerhead', planned: 'no', completed: 'yes', historyAuto: 'days30', historyRequest: 'years5', recovery: 'no' },
]

/**
 * TrainingPeaks isn't a live connection: augo replaces it. Nothing comes over
 * on its own, but we import the full history from an export.
 */
export const HISTORY_IMPORTS: IntegrationRow[] = [
    { name: 'TrainingPeaks', planned: 'no', completed: 'no', historyAuto: 'none', historyRequest: 'unlimited', recovery: 'no', requestHref: `${IMPORT_GUIDE}#option-1-trainingpeaks` },
]

/** Recovery-only sources: sleep, resting heart rate, HRV and steps. */
export const RECOVERY_INTEGRATIONS: IntegrationRow[] = [
    { name: 'WHOOP', planned: 'no', completed: 'no', historyAuto: 'no', historyRequest: 'no', recovery: 'yes' },
    { name: 'Oura', planned: 'no', completed: 'no', historyAuto: 'no', historyRequest: 'no', recovery: 'yes' },
    { name: 'Apple Health', planned: 'no', completed: 'no', historyAuto: 'no', historyRequest: 'no', recovery: 'yes' },
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
