export type Sport = 'running' | 'cycling' | 'triathlon' | 'mixed'

export interface AthleteProfile {
    sport?: Sport
    event?: string[]
    timeline?: 'lt-3mo' | '3-6mo' | '6-12mo' | 'no-rush'
    experience?: 'beginner' | 'intermediate' | 'experienced' | 'returning'
    lifeContext?: string
    location?: string
    coachingStyle?: string[]
    notes?: string
}

export type Pill = { value: string; label: string }

export type Question =
    | {
          id: keyof AthleteProfile
          type: 'choice'
          prompt: string
          pills: Pill[]
          skippable?: boolean
      }
    | {
          id: keyof AthleteProfile
          type: 'multiChoice'
          prompt: string
          pills: Pill[]
          skippable?: boolean
      }
    | {
          id: keyof AthleteProfile
          type: 'text'
          prompt: string
          placeholder?: string
          skippable?: boolean
      }

export const GREETING =
    "Hi — I'm augo. I help athletes find a coach who actually fits. Mind if I ask you a few quick questions? Takes about 2 minutes."

export const CHAT_SCRIPT: Question[] = [
    {
        id: 'sport',
        type: 'choice',
        prompt: "First — what's your sport?",
        pills: [
            { value: 'running', label: 'Running' },
            { value: 'cycling', label: 'Cycling' },
            { value: 'triathlon', label: 'Triathlon' },
            { value: 'mixed', label: 'A mix' },
        ],
    },
    {
        id: 'event',
        type: 'multiChoice',
        prompt: "Got a specific distance or event in mind? Pick anything that fits.",
        skippable: true,
        pills: [
            { value: '5K', label: '5K' },
            { value: '10K', label: '10K' },
            { value: 'half marathon', label: 'Half' },
            { value: 'marathon', label: 'Marathon' },
            { value: 'ultra', label: 'Ultra' },
            { value: 'gravel', label: 'Gravel' },
            { value: 'road race', label: 'Road race' },
            { value: '70.3', label: '70.3' },
            { value: 'IRONMAN', label: 'IRONMAN' },
            { value: 'sprint triathlon', label: 'Sprint tri' },
            { value: 'no specific event', label: 'Nothing specific' },
        ],
    },
    {
        id: 'timeline',
        type: 'choice',
        prompt: "When are you hoping to hit that?",
        pills: [
            { value: 'lt-3mo', label: 'Next 3 months' },
            { value: '3-6mo', label: '3–6 months' },
            { value: '6-12mo', label: '6–12 months' },
            { value: 'no-rush', label: 'No rush' },
        ],
    },
    {
        id: 'experience',
        type: 'choice',
        prompt: "How would you describe yourself right now?",
        skippable: true,
        pills: [
            { value: 'beginner', label: 'New to it' },
            { value: 'intermediate', label: 'Intermediate' },
            { value: 'experienced', label: 'Experienced' },
            { value: 'returning', label: 'Coming back after a break' },
        ],
    },
    {
        id: 'lifeContext',
        type: 'text',
        prompt:
            "How does training fit into your life? Hours per week, kids, shift work, travel — anything that shapes the schedule.",
        placeholder: "e.g. 6–8 hrs/week, two young kids, evenings only",
        skippable: true,
    },
    {
        id: 'location',
        type: 'text',
        prompt: "Where are you based, and what language do you want to be coached in?",
        placeholder: "e.g. Zurich, German or English",
        skippable: true,
    },
    {
        id: 'coachingStyle',
        type: 'multiChoice',
        prompt: "What kind of coach actually helps you show up? Pick any that resonate.",
        skippable: true,
        pills: [
            { value: 'tough love', label: 'Tough love' },
            { value: 'calm and steady', label: 'Calm and steady' },
            { value: 'data-driven', label: 'Data-driven' },
            { value: 'intuitive', label: 'Intuitive' },
            { value: 'technical', label: 'Technical' },
            { value: 'big-picture', label: 'Big-picture' },
        ],
    },
    {
        id: 'notes',
        type: 'text',
        prompt: "Last one — anything else I should know about you before I match you?",
        placeholder: "Optional",
        skippable: true,
    },
]

export const DONE_MESSAGE =
    "Got enough. Drop your email and I'll send you your top matches — and let each coach know to expect you."
