import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import augoLogo from '../assets/images/augo_footer_1.svg'
import SEOHead from '../seo/SEOHead'
import { OrganizationJsonLd } from '../seo/JsonLd'
import ManifestoSheet from '../components/manifesto/ManifestoSheet'
import SignPanel from '../components/manifesto/SignPanel'
import Counter from '../components/manifesto/Counter'
import { SIGNATURE_FONTS_HREF } from '../components/manifesto/ink'
import { fetchSignatures } from '../components/manifesto/api'
import {
    COPY,
    FOUNDING_SIGNATURES,
    MANIFESTO_PATH,
    MANIFESTO_SIGNATURE_STORAGE_KEY,
    type Signature,
} from '../components/manifesto/constants'
import { countSignatures, isApproved, mergeSignatures } from '../components/manifesto/signatures'
import { useReducedMotion } from '../components/merci/motion'
import { trackManifestoSignOpened, type ManifestoOpenLocation } from '../utils/analytics'

const IS_PRERENDER = typeof window !== 'undefined' && window.__PRERENDER__ === true

function readOwn(): Signature | null {
    try {
        const raw = window.localStorage.getItem(MANIFESTO_SIGNATURE_STORAGE_KEY)
        if (!raw) return null
        const parsed = JSON.parse(raw) as Partial<Signature>
        if (typeof parsed.name !== 'string' || typeof parsed.signedAt !== 'string') return null
        return { name: parsed.name, role: parsed.role, signedAt: parsed.signedAt }
    } catch {
        return null
    }
}

function writeOwn(signature: Signature | null) {
    try {
        if (signature) window.localStorage.setItem(MANIFESTO_SIGNATURE_STORAGE_KEY, JSON.stringify(signature))
        else window.localStorage.removeItem(MANIFESTO_SIGNATURE_STORAGE_KEY)
    } catch {
        // Private mode: the signature still went in, the signer just won't see it until approval.
    }
}

/**
 * The community manifesto, "What we stand for", as a sheet people sign.
 *
 * Nothing but the manifesto: no navbar or footer, a small logo home, the
 * counter, the sheet with the signatures around it, and one button. The sheet
 * is modelled on the poster signed in Zürich on 26 March 2026, and its yellow
 * signatures break the site's text rule on purpose (see
 * components/manifesto/constants.ts).
 *
 * The prerendered HTML holds the founding signatures only. The client then
 * fetches the approved ones and adds the visitor's own if it is still waiting
 * for approval. A new signature is written onto the sheet at once, but only in
 * this browser; everyone else sees it once someone approves it in Make.
 *
 * English-only, so SEOHead runs with noAlternates and scripts/routes.ts lists
 * just the /en URL. Page views come from LanguageLayout.
 */
export default function Manifesto() {
    const reducedMotion = useReducedMotion()
    const [approved, setApproved] = useState<Signature[]>([])
    const [own, setOwn] = useState<Signature | null>(null)
    const [fresh, setFresh] = useState<Signature | null>(null)
    const [panelOpen, setPanelOpen] = useState(false)
    const [inlineVisible, setInlineVisible] = useState(true)
    const inlineRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (IS_PRERENDER) return
        const saved = readOwn()
        setOwn(saved)
        let cancelled = false
        void fetchSignatures().then((result) => {
            if (cancelled || result === 'error') return
            setApproved(result)
            // Approved now: the saved copy has done its job.
            if (saved && isApproved(result, saved)) writeOwn(null)
        })
        return () => {
            cancelled = true
        }
    }, [])

    useEffect(() => {
        const target = inlineRef.current
        if (!target) return
        const observer = new IntersectionObserver(([entry]) => setInlineVisible(entry.isIntersecting))
        observer.observe(target)
        return () => observer.disconnect()
    }, [])

    const signatures = useMemo(() => mergeSignatures(FOUNDING_SIGNATURES, approved, own), [approved, own])
    const counts = useMemo(() => countSignatures(signatures), [signatures])
    const freshIndex = fresh ? signatures.findIndex((s) => s.pending && s.name === fresh.name) : -1

    const openPanel = (location: ManifestoOpenLocation) => {
        setPanelOpen(true)
        void trackManifestoSignOpened({ location })
    }
    const closePanel = useCallback(() => setPanelOpen(false), [])
    const onSigned = useCallback((signature: Signature) => {
        writeOwn(signature)
        setOwn(signature)
        setFresh(signature)
        setPanelOpen(false)
    }, [])

    const signed = own !== null

    const button = (location: ManifestoOpenLocation) => (
        <button
            type="button"
            disabled={signed}
            onClick={() => openPanel(location)}
            className="btn-gradient inline-flex items-center justify-center h-12 px-8 rounded-lg font-mono text-sm font-extrabold tracking-[2px] uppercase text-white hover:brightness-110 transition-all disabled:opacity-50 disabled:hover:brightness-100"
        >
            {signed ? COPY.signedCta : COPY.signCta}
        </button>
    )

    return (
        <>
            <SEOHead page="manifesto" path={MANIFESTO_PATH} ogImagePath="/manifesto-og.jpg" noAlternates />
            <OrganizationJsonLd />
            <Helmet>
                <link rel="stylesheet" href={SIGNATURE_FONTS_HREF} />
            </Helmet>

            <main className="min-h-screen bg-dark px-3 sm:px-6 pt-8 pb-28">
                <div className="max-w-[1240px] mx-auto flex items-center justify-between">
                    <Link to="/en" aria-label="augo home">
                        <img src={augoLogo} alt="augo" width={160} height={56} className="w-[72px] h-auto" />
                    </Link>
                    <p className="font-mono text-[11px] sm:text-[12px] tracking-[2px] uppercase text-dark-200">
                        {COPY.pageEyebrow}
                    </p>
                </div>

                <h1 className="sr-only">augo community manifesto: what we stand for</h1>

                <div className="mt-10 mb-10 sm:mb-14">
                    <Counter counts={counts} reducedMotion={reducedMotion} />
                </div>

                <ManifestoSheet signatures={signatures} freshIndex={freshIndex >= 0 ? freshIndex : null} />

                <div ref={inlineRef} className="mt-10 flex flex-col items-center gap-3">
                    {button('below_sheet')}
                    {fresh && <p className="text-text-muted text-[15px]">{COPY.thanks}</p>}
                </div>
            </main>

            {/* Pinned to the bottom while the button under the sheet is out of view. */}
            {!signed && !inlineVisible && !panelOpen && (
                <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-5 pt-10 bg-gradient-to-t from-dark via-dark/80 to-transparent pointer-events-none">
                    <div className="pointer-events-auto">{button('sticky')}</div>
                </div>
            )}

            <SignPanel open={panelOpen} onClose={closePanel} onSigned={onSigned} />
        </>
    )
}
