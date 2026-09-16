import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Beat, Headline, Rise } from './MerciBeat'
import { COPY, TIMING } from './constants'
import { isWellFormed, normalizeCode } from './code'
import { checkCode } from './api'
import { useTypewriter, wait } from './motion'
import { trackMerciCodeFailed } from '../../utils/analytics'

interface MerciDoorProps {
    /** Prefill: the `?c=` code, else the last code that opened the door on this device. */
    initialCode: string
    /** The code came in on the URL: check it as soon as the intro has played. */
    autoSubmit: boolean
    reduced: boolean
    onOpen: (code: string, redeemed: boolean) => void
}

type Phase = 'idle' | 'checking' | 'welcome' | 'leaving'
type Feedback = { tone: 'ok' | 'error'; text: string } | null

const DOOR = COPY.door

/**
 * Beat 0. Nothing else on the page is reachable without a valid code; there is
 * no "continue without a code" path.
 *
 * The intro plays in order: the eyebrow types in, the headline lines rise, then
 * then the form. The form is inert until it has risen, and the
 * field takes focus at that moment.
 */
export default function MerciDoor({ initialCode, autoSubmit, reduced, onOpen }: MerciDoorProps) {
    const [value, setValue] = useState(initialCode)
    const [phase, setPhase] = useState<Phase>('idle')
    const [feedback, setFeedback] = useState<Feedback>(null)
    const [introDone, setIntroDone] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const autoSubmitted = useRef(false)

    const eyebrow = useTypewriter(DOOR.eyebrow, TIMING.eyebrowCharMs, !reduced)
    const headlineAt = reduced ? 0 : DOOR.eyebrow.length * TIMING.eyebrowCharMs
    // The form rises in as the last headline line lands, so the door asks for
    // the code the moment it has finished saying who it is for.
    const formAt = headlineAt + DOOR.headline.length * TIMING.lineStaggerMs
    const formReady = introDone || reduced

    useEffect(() => {
        if (reduced) return
        const timer = window.setTimeout(() => setIntroDone(true), formAt)
        return () => window.clearTimeout(timer)
    }, [reduced, formAt])

    useEffect(() => {
        if (formReady) inputRef.current?.focus({ preventScroll: true })
    }, [formReady])

    function reject(typed: string) {
        setPhase('idle')
        setFeedback({ tone: 'error', text: DOOR.invalid })
        void trackMerciCodeFailed({ code: typed })
    }

    async function submit(raw: string) {
        if (phase !== 'idle') return
        const typed = raw.trim()
        const code = normalizeCode(raw)
        if (!code) {
            setFeedback({ tone: 'error', text: DOOR.empty })
            return
        }
        setValue(code)
        if (!isWellFormed(code)) return reject(typed)

        setPhase('checking')
        setFeedback(null)
        const status = await checkCode(code)
        if (status === 'error') {
            setPhase('idle')
            setFeedback({ tone: 'error', text: DOOR.error })
            return
        }
        if (!status.valid) return reject(typed)

        setPhase('welcome')
        setFeedback({ tone: 'ok', text: DOOR.welcome })
        await wait(reduced ? 0 : TIMING.welcomeHoldMs)
        setPhase('leaving')
        await wait(reduced ? 0 : TIMING.doorFadeMs)
        onOpen(code, status.redeemed)
    }

    // Email links (?c=) open on their own once the intro has played.
    useEffect(() => {
        if (!autoSubmit || !formReady || autoSubmitted.current) return
        autoSubmitted.current = true
        const timer = window.setTimeout(() => void submit(initialCode), 0)
        return () => window.clearTimeout(timer)
        // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once, when the form is ready
    }, [autoSubmit, formReady])

    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        void submit(value)
    }

    const busy = phase !== 'idle'

    return (
        <Beat role="dialog" labelledBy="merci-door-title" interactive leaving={phase === 'leaving'}>
            <p className="merci-label min-h-[1.5em] text-text-muted">
                <span className="sr-only">{DOOR.eyebrowSpoken}</span>
                <span aria-hidden="true">
                    {eyebrow}
                    {eyebrow.length < DOOR.eyebrow.length && <span className="merci-cursor" />}
                </span>
            </p>

            <div className="mt-5 sm:mt-7">
                <Headline id="merci-door-title" lines={DOOR.headline} startMs={headlineAt} />
            </div>

            <Rise delayMs={formAt} className="mt-8 w-full max-w-[520px] sm:mt-10">
                <form onSubmit={handleSubmit} noValidate inert={!formReady}>
                    <label htmlFor="merci-code" className="merci-label block text-text-muted">
                        {DOOR.fieldLabel}
                    </label>
                    <div className="mt-3 flex gap-2">
                        <input
                            ref={inputRef}
                            id="merci-code"
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value)
                                if (feedback?.tone === 'error') setFeedback(null)
                            }}
                            placeholder={DOOR.placeholder}
                            autoComplete="off"
                            autoCapitalize="characters"
                            autoCorrect="off"
                            spellCheck={false}
                            maxLength={16}
                            aria-invalid={feedback?.tone === 'error'}
                            aria-describedby="merci-code-feedback"
                            readOnly={busy}
                            className="merci-field min-w-0 flex-1 font-mono text-[18px] uppercase tracking-[0.12em]"
                        />
                        <button type="submit" disabled={busy} className="merci-btn shrink-0">
                            {phase === 'checking' ? DOOR.checking : DOOR.button}
                        </button>
                    </div>
                    <p
                        id="merci-code-feedback"
                        role="status"
                        className={`mt-3 min-h-[1.5em] font-satoshi text-[15px] leading-[1.45] ${
                            feedback?.tone === 'ok' ? 'font-bold text-white' : 'text-white/80'
                        }`}
                    >
                        {feedback?.text}
                    </p>
                    {/* Inside the form so it inherits `inert` and cannot be
                        clicked while the intro is still playing it in. */}
                    <a
                        href={DOOR.noCodeHref}
                        className="merci-focus mt-1 inline-block font-satoshi text-[14px] text-text-muted underline decoration-dark-400 underline-offset-2 transition-colors duration-150 hover:text-white hover:decoration-white"
                    >
                        {DOOR.noCode}
                    </a>
                </form>
            </Rise>
        </Beat>
    )
}
