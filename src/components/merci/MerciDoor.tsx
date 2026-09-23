import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Beat, Headline, Rise } from './MerciBeat'
import { COPY, TIMING } from './constants'
import { isWellFormed, normalizeCode } from './code'
import { checkCode } from './api'
import { useTypewriter, wait } from './motion'
import { isValidEmail } from '../../utils/email'
import type { MerciSrc } from './code'
import {
    trackMerciCodeCheckError,
    trackMerciCodeFailed,
    trackMerciDoorStarted,
    trackMerciNoCodeClicked,
    type MerciCodeMethod,
    type MerciDoorEntry,
} from '../../utils/analytics'

interface MerciDoorProps {
    /** Prefill: the `?c=` code, else the last code that opened the door on this device. */
    initialCode: string
    /** Prefill: the email that last opened the door on this device. */
    initialEmail: string
    /**
     * The code came in on the URL: check it as soon as the intro has played.
     * Only honoured when an email is saved on this device; a first visit still
     * has to type one, so the door waits with the code filled in.
     */
    autoSubmit: boolean
    /** For the door_started event: how the code field was filled, if at all. */
    entry: MerciDoorEntry
    src: MerciSrc
    reduced: boolean
    onOpen: (code: string, email: string, redeemed: boolean, method: MerciCodeMethod) => void
}

type Phase = 'idle' | 'checking' | 'welcome' | 'leaving'
type Feedback = { tone: 'ok' | 'error'; text: string; field?: 'code' | 'email' } | null

const DOOR = COPY.door

/**
 * Beat 0. Nothing else on the page is reachable without a valid code; there is
 * no "continue without a code" path.
 *
 * The door asks for two things: the code, which is what opens it, and the
 * email, which is stored against that code the moment it opens. The email is
 * checked for shape here and never sent on its own: an invalid code with a
 * valid email stores nothing.
 *
 * The intro plays in order: the eyebrow types in, the headline lines rise, then
 * the form. The form is inert until it has risen, and the first empty field
 * takes focus at that moment.
 */
export default function MerciDoor({
    initialCode,
    initialEmail,
    autoSubmit,
    entry,
    src,
    reduced,
    onOpen,
}: MerciDoorProps) {
    const [value, setValue] = useState(initialCode)
    const [email, setEmail] = useState(initialEmail)
    const [phase, setPhase] = useState<Phase>('idle')
    const [feedback, setFeedback] = useState<Feedback>(null)
    const [introDone, setIntroDone] = useState(false)
    const codeRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const autoSubmitted = useRef(false)
    const started = useRef(false)

    const eyebrow = useTypewriter(DOOR.eyebrow, TIMING.eyebrowCharMs, !reduced)
    const headlineAt = reduced ? 0 : DOOR.eyebrow.length * TIMING.eyebrowCharMs
    // The form rises in as the last headline line lands, so the door asks for
    // the code the moment it has finished saying who it is for.
    const formAt = headlineAt + DOOR.headline.length * TIMING.lineStaggerMs
    const formReady = introDone || reduced
    const willAutoSubmit = autoSubmit && Boolean(initialEmail)

    useEffect(() => {
        if (reduced) return
        const timer = window.setTimeout(() => setIntroDone(true), formAt)
        return () => window.clearTimeout(timer)
    }, [reduced, formAt])

    // A link visitor arrives with the code filled in, so the email is what is
    // left to type. Everyone else starts at the code.
    useEffect(() => {
        if (!formReady) return
        const target = initialCode && !initialEmail ? emailRef.current : codeRef.current
        target?.focus({ preventScroll: true })
        // eslint-disable-next-line react-hooks/exhaustive-deps -- once, when the form is ready
    }, [formReady])

    function reject(typed: string, reason: 'malformed' | 'unknown', method: MerciCodeMethod) {
        setPhase('idle')
        setFeedback({ tone: 'error', text: DOOR.invalid, field: 'code' })
        void trackMerciCodeFailed({ code: typed, reason, method })
    }

    async function submit(raw: string, fromLink = false) {
        if (phase !== 'idle') return
        const typed = raw.trim()
        const code = normalizeCode(raw)
        if (!code) {
            setFeedback({ tone: 'error', text: DOOR.empty, field: 'code' })
            return
        }
        setValue(code)
        const method: MerciCodeMethod = fromLink
            ? 'link'
            : code === normalizeCode(initialCode)
              ? 'saved'
              : 'typed'
        if (!isWellFormed(code)) return reject(typed, 'malformed', method)

        const address = email.trim()
        if (!isValidEmail(address)) {
            setFeedback({ tone: 'error', text: DOOR.emailInvalid, field: 'email' })
            void trackMerciCodeFailed({ code: typed, reason: 'email', method })
            emailRef.current?.focus({ preventScroll: true })
            return
        }

        setPhase('checking')
        setFeedback(null)
        const status = await checkCode(code, address)
        if (status === 'error') {
            setPhase('idle')
            setFeedback({ tone: 'error', text: DOOR.error })
            void trackMerciCodeCheckError({ code, method })
            return
        }
        if (!status.valid) return reject(typed, 'unknown', method)

        setPhase('welcome')
        setFeedback({ tone: 'ok', text: DOOR.welcome })
        await wait(reduced ? 0 : TIMING.welcomeHoldMs)
        setPhase('leaving')
        await wait(reduced ? 0 : TIMING.doorFadeMs)
        onOpen(code, address, status.redeemed, method)
    }

    // Email links (?c=) open on their own once the intro has played, provided
    // this device already knows the email. The ref flips inside the timer, not
    // before it: StrictMode runs the effect, cleans it up and runs it again,
    // and a ref set on the first pass would have the second pass do nothing.
    useEffect(() => {
        if (!willAutoSubmit || !formReady || autoSubmitted.current) return
        const timer = window.setTimeout(() => {
            autoSubmitted.current = true
            void submit(initialCode, true)
        }, 0)
        return () => window.clearTimeout(timer)
        // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once, when the form is ready
    }, [willAutoSubmit, formReady])

    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        void submit(value)
    }

    // Once per door, on the first keystroke in either field.
    function touched() {
        if (feedback?.tone === 'error') setFeedback(null)
        if (started.current) return
        started.current = true
        void trackMerciDoorStarted({ src, entry })
    }

    const busy = phase !== 'idle'
    const errorOn = feedback?.tone === 'error' ? feedback.field : undefined

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
                    <input
                        ref={codeRef}
                        id="merci-code"
                        value={value}
                        onChange={(e) => {
                            setValue(e.target.value)
                            touched()
                        }}
                        placeholder={DOOR.placeholder}
                        autoComplete="off"
                        autoCapitalize="characters"
                        autoCorrect="off"
                        spellCheck={false}
                        maxLength={8}
                        aria-invalid={errorOn === 'code'}
                        aria-describedby="merci-code-feedback"
                        readOnly={busy}
                        className="merci-field mt-3 w-full font-mono text-[18px] uppercase tracking-[0.12em]"
                    />
                    <label htmlFor="merci-email" className="merci-label mt-5 block text-text-muted">
                        {DOOR.emailLabel}
                    </label>
                    <div className="mt-3 flex gap-2">
                        <input
                            ref={emailRef}
                            id="merci-email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                touched()
                            }}
                            placeholder={DOOR.emailPlaceholder}
                            autoComplete="email"
                            autoCapitalize="off"
                            autoCorrect="off"
                            spellCheck={false}
                            aria-invalid={errorOn === 'email'}
                            aria-describedby="merci-code-feedback"
                            readOnly={busy}
                            className="merci-field min-w-0 flex-1 font-satoshi text-[16px]"
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
                        onClick={() => {
                            const typed = value.trim()
                            void trackMerciNoCodeClicked(typed ? { code: typed } : {})
                        }}
                        className="merci-focus mt-1 inline-block font-satoshi text-[14px] text-text-muted underline decoration-dark-400 underline-offset-2 transition-colors duration-150 hover:text-white hover:decoration-white"
                    >
                        {DOOR.noCode}
                    </a>
                </form>
            </Rise>
        </Beat>
    )
}
