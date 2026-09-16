import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import MerciDoor from '../components/merci/MerciDoor'
import MerciOffer, { MerciDone } from '../components/merci/MerciOffer'
import { Beat } from '../components/merci/MerciBeat'
import {
    COPY,
    MERCI_CANONICAL,
    MERCI_CODE_STORAGE_KEY,
    MERCI_PATH,
} from '../components/merci/constants'
import { parseSrc } from '../components/merci/code'
import { useReducedMotion } from '../components/merci/motion'
import { useCookieBannerHeight } from '../hooks/useCookieBannerHeight'
import { trackMerciGateOpened, trackPageViewed } from '../utils/analytics'

type Stage = 'door' | 'card' | 'done'

function readSavedCode(): string {
    try {
        return window.localStorage.getItem(MERCI_CODE_STORAGE_KEY) ?? ''
    } catch {
        return ''
    }
}

function saveCode(code: string) {
    try {
        window.localStorage.setItem(MERCI_CODE_STORAGE_KEY, code)
    } catch {
        // Private mode or blocked storage: the prefill is a nicety, nothing more.
    }
}

/**
 * The page behind the QR code on the "Merci, coach." postcards (see
 * components/merci/constants.ts for the why). Two full-screen stages and no way
 * to move between them by hand:
 *
 *   door   the code gate. Nothing else is reachable without a valid code.
 *   card   the offer and the one form on the page.
 *   done   replaces the card on success.
 *
 * A valid code goes straight to the card, so the ask arrives while the postcard
 * is still in the coach's hand. `?c=` opens the door on its own, which is what
 * the email arm's links use; `&src=email` marks where they came from.
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

    const [initialCode] = useState(() => urlCode ?? readSavedCode())
    const [stage, setStage] = useState<Stage>('door')
    const [code, setCode] = useState('')
    const [redeemed, setRedeemed] = useState(false)
    const [firstName, setFirstName] = useState('')
    const pageTracked = useRef(false)

    useEffect(() => {
        if (pageTracked.current) return
        pageTracked.current = true
        void trackPageViewed({ page: MERCI_PATH, referrer: document.referrer, language: 'en' })
    }, [])

    const handleOpen = useCallback(
        (openedCode: string, wasRedeemed: boolean) => {
            setCode(openedCode)
            setRedeemed(wasRedeemed)
            saveCode(openedCode)
            void trackMerciGateOpened({ code: openedCode, src })
            setStage('card')
        },
        [src],
    )

    const handleRedeemed = useCallback((name: string) => {
        setFirstName(name)
        setStage('done')
    }, [])

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
                <meta property="og:title" content="Merci, coach." />
                <meta property="og:description" content={COPY.pageDescription} />
                <meta property="og:url" content={MERCI_CANONICAL} />
                <meta property="og:image" content="https://augotraining.com/og-image.jpg" />
            </Helmet>

            <main className="relative mx-auto h-full w-full max-w-[900px]">
                {stage === 'door' && (
                    <MerciDoor
                        initialCode={initialCode}
                        autoSubmit={Boolean(urlCode)}
                        reduced={reduced}
                        onOpen={handleOpen}
                    />
                )}
                {stage === 'card' && (
                    <Beat key="card" labelledBy="merci-offer-title" interactive scroll tight>
                        <MerciOffer
                            code={code}
                            src={src}
                            alreadyRedeemed={redeemed}
                            onRedeemed={handleRedeemed}
                        />
                    </Beat>
                )}
                {stage === 'done' && (
                    <Beat key="done" labelledBy="merci-done-title" interactive>
                        <MerciDone firstName={firstName} />
                    </Beat>
                )}
            </main>
        </div>
    )
}
