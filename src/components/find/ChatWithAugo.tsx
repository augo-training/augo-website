import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Check, Sparkles, X } from 'lucide-react'
import {
    DONE_MESSAGE,
    GREETING,
    type AthleteProfile,
    type Pill,
    type Question,
} from './chatScript'
import { scriptedController } from './chatController'
import { coaches } from '../../data/coaches'
import { coachSearch, profileToQuery, type CoachSearchResult } from '../../utils/coachSearch'
import { subscribeToMailerLite } from '../../utils/mailerlite'
import {
    trackCoachMatchChatAbandoned,
    trackCoachMatchChatCompleted,
    trackCoachMatchChatEmailSubmitted,
    trackCoachMatchChatQuestionAnswered,
    trackEmailCaptureSubmitted,
} from '../../utils/analytics'
import CoachCardMini from './CoachCardMini'

type Turn =
    | { id: string; role: 'augo'; text: string }
    | { id: string; role: 'athlete'; text: string }

type Phase = 'interview' | 'email' | 'done'

interface Props {
    isOpen: boolean
    onClose: () => void
}

const FIND_MATCH_GROUP_ID =
    import.meta.env.VITE_MAILERLITE_FIND_MATCH_GROUP_ID || undefined

let turnIdCounter = 0
function nextTurnId() {
    turnIdCounter += 1
    return `t${turnIdCounter}`
}

function answerToText(question: Question, value: string | string[]): string {
    if (Array.isArray(value)) {
        const labels = value.map((v) => {
            const pill = (question as { pills?: Pill[] }).pills?.find((p) => p.value === v)
            return pill?.label ?? v
        })
        return labels.join(', ')
    }
    if (question.type === 'choice') {
        const pill = question.pills.find((p) => p.value === value)
        return pill?.label ?? value
    }
    return value
}

function initialTurns(): Turn[] {
    const step = scriptedController.getNextStep({})
    const turns: Turn[] = [{ id: nextTurnId(), role: 'augo', text: GREETING }]
    if (step.kind === 'question') {
        turns.push({ id: nextTurnId(), role: 'augo', text: step.question.prompt })
    }
    return turns
}

function initialQuestion(): Question | null {
    const step = scriptedController.getNextStep({})
    return step.kind === 'question' ? step.question : null
}

export default function ChatWithAugo({ isOpen, onClose }: Props) {
    const [profile, setProfile] = useState<AthleteProfile>({})
    const [turns, setTurns] = useState<Turn[]>(initialTurns)
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(initialQuestion)
    const [phase, setPhase] = useState<Phase>('interview')
    const [textDraft, setTextDraft] = useState('')
    const [multiDraft, setMultiDraft] = useState<string[]>([])
    const [isTyping, setIsTyping] = useState(false)
    const [email, setEmail] = useState('')
    const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'error'>('idle')
    const [matches, setMatches] = useState<CoachSearchResult[]>([])

    const conversationRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const emailInputRef = useRef<HTMLInputElement>(null)
    const reducedMotion = useRef<boolean>(false)

    // Auto-scroll to bottom on new turns
    useEffect(() => {
        const c = conversationRef.current
        if (!c) return
        c.scrollTo({
            top: c.scrollHeight,
            behavior: reducedMotion.current ? 'auto' : 'smooth',
        })
    }, [turns, currentQuestion, phase, isTyping])

    // Detect reduced motion on mount
    useEffect(() => {
        reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }, [])

    function pushAugo(text: string) {
        setTurns((t) => [...t, { id: nextTurnId(), role: 'augo', text }])
    }
    function pushAthlete(text: string) {
        setTurns((t) => [...t, { id: nextTurnId(), role: 'athlete', text }])
    }

    const advance = useCallback(
        (nextProfile: AthleteProfile) => {
            setIsTyping(true)
            const delay = reducedMotion.current ? 0 : 650
            window.setTimeout(() => {
                setIsTyping(false)
                const step = scriptedController.getNextStep(nextProfile)
                if (step.kind === 'done') {
                    pushAugo(DONE_MESSAGE)
                    setCurrentQuestion(null)
                    setPhase('email')
                    trackCoachMatchChatCompleted({
                        questions_answered: Object.keys(nextProfile).length,
                    })
                    return
                }
                pushAugo(step.question.prompt)
                setCurrentQuestion(step.question)
                setTextDraft('')
                setMultiDraft([])
            }, delay)
        },
        [],
    )

    const handleClose = useCallback(() => {
        if (phase !== 'done' && Object.keys(profile).length > 0) {
            trackCoachMatchChatAbandoned({
                questions_answered: Object.keys(profile).length,
                phase,
            })
        }
        onClose()
    }, [phase, profile, onClose])

    // Esc to close
    useEffect(() => {
        if (!isOpen) return
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') handleClose()
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [isOpen, handleClose])

    // Lock body scroll
    useEffect(() => {
        if (!isOpen) return
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = prev
        }
    }, [isOpen])


    function answerCurrent(value: string | string[]) {
        if (!currentQuestion) return
        const next: AthleteProfile = { ...profile, [currentQuestion.id]: value }
        setProfile(next)
        pushAthlete(answerToText(currentQuestion, value))
        trackCoachMatchChatQuestionAnswered({
            step: currentQuestion.id,
            skipped: false,
        })
        setCurrentQuestion(null)
        advance(next)
    }

    function skipCurrent() {
        if (!currentQuestion) return
        pushAthlete('Skip')
        trackCoachMatchChatQuestionAnswered({
            step: currentQuestion.id,
            skipped: true,
        })
        const next = { ...profile, [currentQuestion.id]: '__skipped__' as never }
        setProfile(next)
        setCurrentQuestion(null)
        advance(next)
    }

    function toggleMulti(value: string) {
        setMultiDraft((cur) =>
            cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value],
        )
    }

    async function submitEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            setEmailStatus('error')
            return
        }
        setEmailStatus('loading')
        pushAthlete(email)

        // Compute matches now so they're ready to reveal
        const query = profileToQuery(profile)
        const results = coachSearch(query, coaches).slice(0, 3)

        // Serialize profile for MailerLite custom fields (best-effort)
        const fields: Record<string, string> = {}
        for (const [k, v] of Object.entries(profile)) {
            if (v === '__skipped__' || v === undefined || v === null) continue
            fields[`profile_${k}`] = Array.isArray(v) ? v.join(', ') : String(v)
        }
        fields.profile_top_matches = results.map((r) => r.coach.slug).join(', ')

        await subscribeToMailerLite({
            email,
            groupId: FIND_MATCH_GROUP_ID,
            fields,
            ctaText: 'Coach Match Chat',
        })

        void trackEmailCaptureSubmitted({
            email,
            cta_text: 'Coach Match Chat',
        })
        void trackCoachMatchChatEmailSubmitted({
            matches: results.map((r) => r.coach.slug),
        })

        setMatches(results)
        setEmailStatus('idle')
        setIsTyping(true)
        window.setTimeout(
            () => {
                setIsTyping(false)
                pushAugo(
                    `Here are your top ${results.length}. I've sent the same list to your inbox — and let each coach know to expect you.`,
                )
                setPhase('done')
            },
            reducedMotion.current ? 0 : 700,
        )
    }

    const showSkip = Boolean(currentQuestion?.skippable)
    const canSubmitText = currentQuestion?.type === 'text' && textDraft.trim().length > 0
    const canSubmitMulti = currentQuestion?.type === 'multiChoice' && multiDraft.length > 0

    // Compute placeholder for text input
    const textPlaceholder = useMemo(() => {
        if (currentQuestion?.type === 'text') {
            return currentQuestion.placeholder ?? 'Type your answer'
        }
        return ''
    }, [currentQuestion])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-[100] bg-dark texture-grain flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Chat with augo to find a coach"
        >
            {/* Top bar */}
            <header className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-white/[0.08] flex-shrink-0">
                <div className="flex items-center gap-3">
                    <span
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full"
                        style={{
                            background:
                                'linear-gradient(83.9deg, #C50017 0%, #FF5514 50%, #FFCA1E 100%)',
                        }}
                    >
                        <Sparkles className="w-4 h-4 text-white" strokeWidth={2} />
                    </span>
                    <div className="flex flex-col">
                        <span className="font-mono text-[10px] sm:text-[11px] tracking-[2.5px] uppercase text-white/55">
                            Coach Matcher
                        </span>
                        <span className="font-satoshi font-bold text-[14px] sm:text-[15px] text-white leading-tight">
                            augo
                        </span>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleClose}
                    className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase text-white/55 hover:text-white transition-colors cursor-pointer bg-transparent border-0"
                    aria-label="Close chat"
                >
                    <span className="hidden sm:inline">Skip — just browse</span>
                    <X className="w-4 h-4" />
                </button>
            </header>

            {/* Conversation */}
            <div
                ref={conversationRef}
                className="flex-1 overflow-y-auto px-5 sm:px-8 pt-8 pb-6"
            >
                <div className="max-w-[720px] mx-auto flex flex-col gap-4">
                    {turns.map((turn) =>
                        turn.role === 'augo' ? (
                            <AugoBubble key={turn.id} text={turn.text} />
                        ) : (
                            <AthleteBubble key={turn.id} text={turn.text} />
                        ),
                    )}

                    {isTyping && <TypingIndicator />}

                    {/* Match cards reveal */}
                    {phase === 'done' && matches.length > 0 && (
                        <div className="flex flex-col gap-3 mt-4">
                            <span className="font-mono text-[10px] tracking-[2.5px] uppercase text-white/45 ml-12">
                                Your top {matches.length} matches
                            </span>
                            <div className="ml-12 flex flex-col gap-2.5">
                                {matches.map((m, i) => (
                                    <CoachCardMini
                                        key={m.coach.slug}
                                        coach={m.coach}
                                        rank={i + 1}
                                        reason={m.reason}
                                    />
                                ))}
                            </div>
                            <div className="ml-12 mt-3 flex items-center gap-2 text-white">
                                <Check className="w-4 h-4" strokeWidth={2.5} />
                                <span className="font-mono text-[11px] tracking-[2px] uppercase">
                                    Sent to your inbox · Coaches notified
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Input region */}
            <div className="border-t border-white/[0.08] flex-shrink-0 bg-dark">
                <div className="max-w-[720px] mx-auto px-5 sm:px-8 py-5">
                    {phase === 'interview' && currentQuestion && (
                        <InterviewControls
                            question={currentQuestion}
                            textDraft={textDraft}
                            setTextDraft={setTextDraft}
                            multiDraft={multiDraft}
                            toggleMulti={toggleMulti}
                            canSubmitText={canSubmitText}
                            canSubmitMulti={canSubmitMulti}
                            showSkip={showSkip}
                            onSubmitText={() => answerCurrent(textDraft.trim())}
                            onSubmitMulti={() => answerCurrent(multiDraft)}
                            onChoose={(value) => answerCurrent(value)}
                            onSkip={skipCurrent}
                            inputRef={inputRef}
                            placeholder={textPlaceholder}
                        />
                    )}

                    {phase === 'email' && (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                submitEmail()
                            }}
                            className="flex flex-col gap-3"
                        >
                            <div
                                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-800 ring-1 ring-white/[0.10]"
                            >
                                <input
                                    ref={emailInputRef}
                                    type="email"
                                    autoFocus
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        if (emailStatus === 'error') setEmailStatus('idle')
                                    }}
                                    placeholder="you@email.com"
                                    className="flex-1 bg-transparent border-0 outline-none font-satoshi text-[16px] text-white placeholder:text-white/35 min-w-0"
                                    disabled={emailStatus === 'loading'}
                                    aria-label="Your email"
                                />
                                <button
                                    type="submit"
                                    disabled={emailStatus === 'loading' || email.trim().length === 0}
                                    className="btn-gradient inline-flex items-center gap-2 font-mono text-[11px] font-extrabold tracking-[2px] uppercase text-white rounded-lg px-4 py-2.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all"
                                >
                                    {emailStatus === 'loading' ? '...' : 'Send matches'}
                                    {emailStatus !== 'loading' && (
                                        <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                                    )}
                                </button>
                            </div>
                            {emailStatus === 'error' && (
                                <p className="font-satoshi text-[13px] text-red-400">
                                    That email doesn't look right — give it another try.
                                </p>
                            )}
                            <p className="font-mono text-[10px] tracking-[2px] uppercase text-white/40">
                                We only use this to email your matches. Unsubscribe anytime.
                            </p>
                        </form>
                    )}

                    {phase === 'done' && (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <p className="font-satoshi text-[15px] text-white/70">
                                That's it — go meet your coaches.
                            </p>
                            <button
                                type="button"
                                onClick={handleClose}
                                className="self-start sm:self-auto inline-flex items-center gap-2 font-mono text-[11px] font-extrabold tracking-[2px] uppercase text-white rounded-lg ring-1 ring-white/20 hover:bg-white hover:text-dark hover:ring-white transition-all cursor-pointer bg-transparent px-5 py-2.5"
                            >
                                Browse the roster
                                <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// ── Subcomponents ──

function AugoBubble({ text }: { text: string }) {
    return (
        <div className="flex items-start gap-3 max-w-[560px]">
            <span
                className="flex-shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full mt-1"
                style={{
                    background:
                        'linear-gradient(83.9deg, #C50017 0%, #FF5514 50%, #FFCA1E 100%)',
                }}
                aria-hidden="true"
            >
                <Sparkles className="w-4 h-4 text-white" strokeWidth={2} />
            </span>
            <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-dark-800 ring-1 ring-white/[0.08]">
                <p className="font-satoshi text-[15px] sm:text-[16px] leading-[150%] text-white">
                    {text}
                </p>
            </div>
        </div>
    )
}

function AthleteBubble({ text }: { text: string }) {
    return (
        <div className="flex items-start justify-end max-w-[560px] ml-auto">
            <div
                className="px-4 py-3 rounded-2xl rounded-tr-md ring-1 ring-white/[0.06]"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)' }}
            >
                <p className="font-satoshi text-[15px] sm:text-[16px] leading-[150%] text-white">
                    {text}
                </p>
            </div>
        </div>
    )
}

function TypingIndicator() {
    return (
        <div className="flex items-center gap-3" aria-label="augo is typing">
            <span
                className="flex-shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full"
                style={{
                    background:
                        'linear-gradient(83.9deg, #C50017 0%, #FF5514 50%, #FFCA1E 100%)',
                }}
                aria-hidden="true"
            >
                <Sparkles className="w-4 h-4 text-white" strokeWidth={2} />
            </span>
            <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-dark-800 ring-1 ring-white/[0.08] flex items-center gap-1.5">
                <Dot delay={0} />
                <Dot delay={150} />
                <Dot delay={300} />
            </div>
        </div>
    )
}

function Dot({ delay }: { delay: number }) {
    return (
        <span
            className="block w-1.5 h-1.5 rounded-full bg-white/55"
            style={{
                animation: 'glow-pulse 1.1s ease-in-out infinite',
                animationDelay: `${delay}ms`,
            }}
            aria-hidden="true"
        />
    )
}

interface InterviewControlsProps {
    question: Question
    textDraft: string
    setTextDraft: (s: string) => void
    multiDraft: string[]
    toggleMulti: (v: string) => void
    canSubmitText: boolean
    canSubmitMulti: boolean
    showSkip: boolean
    onSubmitText: () => void
    onSubmitMulti: () => void
    onChoose: (value: string) => void
    onSkip: () => void
    inputRef: React.RefObject<HTMLInputElement | null>
    placeholder: string
}

function InterviewControls({
    question,
    textDraft,
    setTextDraft,
    multiDraft,
    toggleMulti,
    canSubmitText,
    canSubmitMulti,
    showSkip,
    onSubmitText,
    onSubmitMulti,
    onChoose,
    onSkip,
    inputRef,
    placeholder,
}: InterviewControlsProps) {
    if (question.type === 'choice') {
        return (
            <div className="flex flex-wrap gap-2">
                {question.pills.map((pill) => (
                    <button
                        key={pill.value}
                        type="button"
                        onClick={() => onChoose(pill.value)}
                        className="inline-flex items-center px-4 py-2.5 rounded-full font-mono text-[12px] tracking-[2px] uppercase text-white/85 ring-1 ring-white/[0.12] hover:text-white hover:ring-white/30 hover:bg-white/[0.04] transition-all cursor-pointer bg-transparent"
                    >
                        {pill.label}
                    </button>
                ))}
                {showSkip && (
                    <button
                        type="button"
                        onClick={onSkip}
                        className="inline-flex items-center px-4 py-2.5 font-mono text-[11px] tracking-[2px] uppercase text-white/45 hover:text-white transition-colors cursor-pointer bg-transparent border-0"
                    >
                        Skip
                    </button>
                )}
            </div>
        )
    }

    if (question.type === 'multiChoice') {
        return (
            <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                    {question.pills.map((pill) => {
                        const selected = multiDraft.includes(pill.value)
                        return (
                            <button
                                key={pill.value}
                                type="button"
                                onClick={() => toggleMulti(pill.value)}
                                className={`inline-flex items-center px-4 py-2.5 rounded-full font-mono text-[12px] tracking-[2px] uppercase transition-all cursor-pointer ${
                                    selected
                                        ? 'bg-white text-dark font-bold ring-1 ring-white'
                                        : 'text-white/85 ring-1 ring-white/[0.12] hover:text-white hover:ring-white/30 hover:bg-white/[0.04] bg-transparent'
                                }`}
                            >
                                {pill.label}
                            </button>
                        )
                    })}
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onSubmitMulti}
                        disabled={!canSubmitMulti}
                        className="btn-gradient inline-flex items-center gap-2 font-mono text-[11px] font-extrabold tracking-[2px] uppercase text-white rounded-lg px-5 py-2.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all"
                    >
                        Continue
                        <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </button>
                    {showSkip && (
                        <button
                            type="button"
                            onClick={onSkip}
                            className="font-mono text-[11px] tracking-[2px] uppercase text-white/45 hover:text-white transition-colors cursor-pointer bg-transparent border-0"
                        >
                            Skip
                        </button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                if (canSubmitText) onSubmitText()
            }}
            className="flex flex-col gap-3"
        >
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-800 ring-1 ring-white/[0.10] focus-within:ring-white/25 transition-all">
                <input
                    ref={inputRef}
                    type="text"
                    autoFocus
                    value={textDraft}
                    onChange={(e) => setTextDraft(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent border-0 outline-none font-satoshi text-[16px] text-white placeholder:text-white/35 min-w-0"
                />
                <button
                    type="submit"
                    disabled={!canSubmitText}
                    className="btn-gradient inline-flex items-center gap-2 font-mono text-[11px] font-extrabold tracking-[2px] uppercase text-white rounded-lg px-4 py-2.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all"
                >
                    Send
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                </button>
            </div>
            {showSkip && (
                <button
                    type="button"
                    onClick={onSkip}
                    className="self-start font-mono text-[11px] tracking-[2px] uppercase text-white/45 hover:text-white transition-colors cursor-pointer bg-transparent border-0"
                >
                    Skip
                </button>
            )}
        </form>
    )
}
