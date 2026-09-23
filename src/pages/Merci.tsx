import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type CSSProperties,
    type MouseEvent,
} from 'react'
import { useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import topoBg from '../assets/images/bg_section_1.webp'
import augoLogo from '../assets/images/augo_footer_1.svg'
import MerciDoor from '../components/merci/MerciDoor'
import MerciTerminal from '../components/merci/MerciTerminal'
import MerciQuote from '../components/merci/MerciQuote'
import MerciOffer, { MerciDone } from '../components/merci/MerciOffer'
import { MerciHint, MerciProgress } from '../components/merci/MerciProgress'
import { Beat, Headline, Rise } from '../components/merci/MerciBeat'
import {
    BEAT_NAMES,
    COPY,
    MERCI_CANONICAL,
    MERCI_CODE_STORAGE_KEY,
    MERCI_EMAIL_STORAGE_KEY,
    MERCI_OG_IMAGE,
    MERCI_OG_IMAGE_ALT,
    MERCI_PATH,
    MERCI_SOURCE,
    TIMING,
} from '../components/merci/constants'
import { parseSrc } from '../components/merci/code'
import { useReducedMotion } from '../components/merci/motion'
import { useCookieBannerHeight } from '../hooks/useCookieBannerHeight'
import {
    identifyEmailCapture,
    trackMerciBeatViewed,
    trackMerciDoorViewed,
    trackMerciGateOpened,
    trackPageViewed,
    type MerciCodeMethod,
} from '../utils/analytics'

/** 0 is the door; 1 to 5 are the beats. The done state replaces beat 5. */
type BeatNumber = 0 | 1 | 2 | 3 | 4 | 5

const STEP = TIMING.lineStaggerMs

function readSaved(key: string): string {
    try {
        return window.localStorage.getItem(key) ?? ''
    } catch {
        return ''
    }
}

function save(key: string, value: string) {
    try {
        window.localStorage.setItem(key, value)
    } catch {
        // Private mode or blocked storage: the prefill is a nicety, nothing more.
    }
}

function isTypingTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false
    return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
}

/**
 * The page behind the QR code on the "Merci, coach." postcards (see
 * components/merci/constants.ts for the why). A code-gated, full-screen
 * tap-through of five beats ending in one tap:
 *
 *   0 the door    the code gate, and the email. Nothing else is reachable
 *                 without a valid code, and the email is stored as it opens.
 *   1 the memory  everything the athlete ever told you
 *   2 one prompt  the typing terminal
 *   3 you decide  the reassurance
 *   4 the quote   a coach they may know vouching for augo
 *   5 the ticket  the offer and its one button
 *   done          replaces the ticket on success; no further navigation
 *
 * The right half of the screen is Next and the left half Back, as real buttons
 * sitting under the beat content so taps on a field never advance. Arrow keys
 * and Space do the same. Nothing advances on its own.
 *
 * `?c=` fills the code in, which is what the email arm's links use, and opens
 * the door by itself on a device that has already given its email;
 * `&src=email` marks where they came from.
 *
 * Lives outside /:lang because the card's QR points at augotraining.com/merci.
 * That also means LanguageLayout's page_viewed never fires here, so the page
 * sends its own.
 */
export default function Merci() {
    const [params] = useSearchParams()
    const urlCode = params.get('c')
    const src = parseSrc(params.get('src'))
    const reduced = useReducedMotion()
    const bannerHeight = useCookieBannerHeight()

    const [initialCode] = useState(() => urlCode ?? readSaved(MERCI_CODE_STORAGE_KEY))
    const [initialEmail] = useState(() => readSaved(MERCI_EMAIL_STORAGE_KEY))
    const [beat, setBeat] = useState<BeatNumber>(0)
    const [code, setCode] = useState('')
    const [email, setEmail] = useState('')
    const [redeemed, setRedeemed] = useState(false)
    const [done, setDone] = useState(false)
    const pageTracked = useRef(false)
    const lastBeatTracked = useRef<number | null>(null)
    const beatsSeen = useRef(new Set<number>())
    const beatShownAt = useRef<number | null>(null)

    const navigable = beat > 0 && !done
    /**
     * The story beats carry the app's warm glow; the door and the ticket do not.
     * The door stays plain so the code field is the only thing on it, and the
     * ticket stays plain so the ticket is the only colour on that screen.
     */
    const glowing = navigable && beat < 5

    useEffect(() => {
        if (pageTracked.current) return
        pageTracked.current = true
        void trackPageViewed({ page: MERCI_PATH, referrer: document.referrer, language: 'en' })
        void trackMerciDoorViewed({
            src,
            entry: urlCode ? 'link' : initialCode ? 'saved' : 'blank',
            ...(initialCode ? { code: initialCode } : {}),
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps -- once, with the values the page loaded with
    }, [])

    // Every time a beat becomes visible, including on the way back.
    useEffect(() => {
        if (!navigable || lastBeatTracked.current === beat) return
        lastBeatTracked.current = beat
        const now = Date.now()
        const shownAt = beatShownAt.current
        beatShownAt.current = now
        const firstView = !beatsSeen.current.has(beat)
        beatsSeen.current.add(beat)
        void trackMerciBeatViewed({
            code,
            src,
            beat,
            beat_name: BEAT_NAMES[beat],
            first_view: firstView,
            ...(shownAt === null ? {} : { seconds_on_previous: Math.round((now - shownAt) / 1000) }),
        })
    }, [navigable, beat, code, src])

    const handleOpen = useCallback(
        (openedCode: string, openedEmail: string, wasRedeemed: boolean, method: MerciCodeMethod) => {
            setCode(openedCode)
            setEmail(openedEmail)
            setRedeemed(wasRedeemed)
            save(MERCI_CODE_STORAGE_KEY, openedCode)
            save(MERCI_EMAIL_STORAGE_KEY, openedEmail)
            void trackMerciGateOpened({
                code: openedCode,
                src,
                method,
                already_redeemed: wasRedeemed,
            })
            // The email is known from here on, so the profile is tied to it
            // now rather than at the ticket: a coach who stops reading is still
            // the same person next time they turn up.
            void identifyEmailCapture({
                email: openedEmail,
                source: MERCI_SOURCE,
                page: MERCI_PATH,
                merci_code: openedCode,
            })
            setBeat(1)
        },
        [src],
    )

    const go = useCallback((step: 1 | -1) => {
        setBeat((current) =>
            current === 0 ? current : (Math.min(5, Math.max(1, current + step)) as BeatNumber),
        )
    }, [])

    useEffect(() => {
        if (!navigable) return
        const onKey = (e: KeyboardEvent) => {
            if (e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target)) return
            // Space on a focused button already clicks it; on the offer it scrolls.
            const spaceAdvances =
                e.key === ' ' && beat < 5 && !(e.target instanceof HTMLButtonElement)
            if (e.key === 'ArrowRight' || spaceAdvances) {
                e.preventDefault()
                go(1)
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault()
                go(-1)
            }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [navigable, beat, go])

    // A tapped zone would keep focus, and the next arrow key would then draw its
    // focus ring around half the screen. `detail` is 0 for keyboard clicks, so
    // keyboard users keep both the focus and the ring.
    function handleZone(e: MouseEvent<HTMLButtonElement>, step: 1 | -1) {
        if (e.detail > 0) e.currentTarget.blur()
        go(step)
    }

    // The offer scrolls, so it catches its own taps: anything not on a control,
    // in its left third, goes back.
    function handleOfferClick(e: MouseEvent<HTMLElement>) {
        if ((e.target as HTMLElement).closest('a, button, input, label, form')) return
        const { left, width } = e.currentTarget.getBoundingClientRect()
        if (e.clientX < left + width / 3) go(-1)
    }

    function renderBeat() {
        if (done) {
            return (
                <Beat key="done" labelledBy="merci-done-title" interactive>
                    <MerciDone code={code} />
                </Beat>
            )
        }
        switch (beat) {
            case 0:
                return (
                    <MerciDoor
                        key="door"
                        initialCode={initialCode}
                        initialEmail={initialEmail}
                        autoSubmit={Boolean(urlCode)}
                        reduced={reduced}
                        onOpen={handleOpen}
                    />
                )
            case 1:
                return (
                    <Beat key="memory" labelledBy="merci-beat-title">
                        <Headline id="merci-beat-title" size="lg" lines={COPY.memory.headline} />
                        <Rise
                            delayMs={COPY.memory.headline.length * STEP}
                            className="merci-sub merci-sub-wide mt-6 text-white/75 sm:mt-8"
                        >
                            {COPY.memory.subline.map((line) => (
                                <span key={line} className="block">
                                    {line}{' '}
                                </span>
                            ))}
                        </Rise>
                    </Beat>
                )
            case 2:
                return (
                    <Beat key="prompt" labelledBy="merci-beat-title">
                        <Headline id="merci-beat-title" lines={COPY.prompt.headline} />
                        <MerciTerminal
                            reduced={reduced}
                            delayMs={COPY.prompt.headline.length * STEP}
                        />
                    </Beat>
                )
            case 3:
                return (
                    <Beat key="decide" labelledBy="merci-beat-title">
                        <Headline id="merci-beat-title" lines={COPY.decide.headline} />
                        <Rise
                            delayMs={COPY.decide.headline.length * STEP}
                            className="merci-sub mt-6 text-white/75 sm:mt-8"
                        >
                            {COPY.decide.subline}
                        </Rise>
                    </Beat>
                )
            case 4:
                return (
                    <Beat key="quote" labelledBy="merci-beat-title">
                        <MerciQuote />
                    </Beat>
                )
            case 5:
                return (
                    <Beat
                        key="offer"
                        labelledBy="merci-offer-title"
                        align="top"
                        interactive
                        scroll
                        tight
                        onClick={handleOfferClick}
                    >
                        <MerciOffer
                            code={code}
                            src={src}
                            email={email}
                            alreadyRedeemed={redeemed}
                            onRedeemed={() => setDone(true)}
                        />
                    </Beat>
                )
        }
    }

    return (
        <div
            className="merci-root fixed inset-0 overflow-hidden bg-dark text-white"
            style={{ '--merci-banner': `${bannerHeight}px` } as CSSProperties}
        >
            <Helmet>
                <html lang="en" />
                <title>{COPY.pageTitle}</title>
                <meta name="description" content={COPY.pageDescription} />
                <meta name="robots" content="noindex, nofollow" />
                {/* scripts/prerender.ts snapshots once a canonical link appears.
                    On a noindex page it is otherwise inert. */}
                <link rel="canonical" href={MERCI_CANONICAL} />
                <meta name="theme-color" content="#0A0A0A" />

                {/* Hand-rolled rather than seo/SEOHead, which derives html lang,
                    og:locale, canonical and hreflang from the language tree.
                    This page sits outside /:lang on purpose, so through SEOHead
                    a coach on a German browser would get lang="de" on English
                    copy. The cost is that these tags have to be kept complete
                    here. og:image:width/height are what the card actually is,
                    and WhatsApp reads them to choose the large preview over the
                    small thumbnail. */}
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="augo" />
                <meta property="og:title" content="Merci, coach." />
                <meta property="og:description" content={COPY.pageDescription} />
                <meta property="og:url" content={MERCI_CANONICAL} />
                <meta property="og:image" content={MERCI_OG_IMAGE} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:alt" content={MERCI_OG_IMAGE_ALT} />

                {/* Without twitter:card there is no large card on X at all. */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Merci, coach." />
                <meta name="twitter:description" content={COPY.pageDescription} />
                <meta name="twitter:image" content={MERCI_OG_IMAGE} />
                <meta name="twitter:image:alt" content={MERCI_OG_IMAGE_ALT} />
            </Helmet>

            <div
                aria-hidden="true"
                className={`merci-glow-topo ${glowing ? 'merci-glow-on' : ''}`}
                style={{ backgroundImage: `url(${topoBg})` }}
            />
            <div aria-hidden="true" className={`merci-glow ${glowing ? 'merci-glow-on' : ''}`} />

            {navigable && (
                <>
                    <button
                        type="button"
                        aria-label="Back"
                        onClick={(e) => handleZone(e, -1)}
                        disabled={beat === 1}
                        className="merci-zone absolute inset-y-0 left-0 z-10 w-1/2 bg-transparent"
                    />
                    <button
                        type="button"
                        aria-label="Next"
                        onClick={(e) => handleZone(e, 1)}
                        disabled={beat === 5}
                        className="merci-zone absolute inset-y-0 right-0 z-10 w-1/2 bg-transparent"
                    />
                </>
            )}

            <main className="pointer-events-none relative z-20 mx-auto h-full w-full max-w-[900px]">
                {navigable && <MerciProgress beat={beat} />}
                {/* Pinned rather than part of each beat, so it holds still while
                    the beats change around it. On every screen, the door
                    included: someone who has just scanned a code off a postcard
                    should know whose page this is. */}
                <img src={augoLogo} alt="augo" className="merci-logo absolute left-6 z-30 h-5 w-auto" />
                {renderBeat()}
                {navigable && beat < 5 && <MerciHint key={`hint-${beat}`} />}
            </main>
        </div>
    )
}
