import { CHAT_SCRIPT, type AthleteProfile, type Question } from './chatScript'

export type ChatTurn =
    | { role: 'augo'; kind: 'message' | 'question'; text: string; questionId?: keyof AthleteProfile }
    | { role: 'athlete'; text: string; questionId: keyof AthleteProfile }

export type ChatStep = { kind: 'question'; question: Question } | { kind: 'done' }

export interface ChatController {
    getNextStep(profile: AthleteProfile): ChatStep
}

/**
 * Walks the static script in order. A question is considered answered if its
 * key on `profile` is present (non-null, non-empty array, non-empty string).
 * This means skipped questions stay unfilled and won't gate completion.
 *
 * The seam: swap this implementation for an LLM-backed controller that
 * inspects the transcript + profile and decides what to ask (or stop) next.
 */
export const scriptedController: ChatController = {
    getNextStep(profile) {
        for (const q of CHAT_SCRIPT) {
            const value = profile[q.id]
            const isAnswered =
                value !== undefined &&
                value !== null &&
                !(Array.isArray(value) && value.length === 0) &&
                !(typeof value === 'string' && value.trim() === '')
            if (!isAnswered) {
                return { kind: 'question', question: q }
            }
        }
        return { kind: 'done' }
    },
}
