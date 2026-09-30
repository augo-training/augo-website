import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { confirmIntro, type ConfirmResult } from '../utils/coachIntro'
import { trackCoachIntroConfirmed, trackCoachIntroConfirmViewed } from '../utils/analytics'

/**
 * Where the link in the "Confirm your email" message lands. See
 * src/utils/coachIntro.ts for the whole flow.
 *
 * Confirming takes a click, not just a visit: mail security scanners open
 * links on their own, and a page that confirmed on load would let a scanner
 * send the athlete's details to the coach. Unlinked, noindex, and not in
 * scripts/routes.ts, so it is neither prerendered nor in the sitemap.
 */

type State = { status: 'ready' | 'sending' } | ConfirmResult

const STEPS = [
    'You confirm your email here.',
    'We send the coach your name, email and note.',
    'The coach replies to you directly, by email.',
]

export default function ConfirmIntro() {
    const { lang = 'en' } = useParams()
    const [params] = useSearchParams()
    const token = params.get('t') ?? ''
    const [state, setState] = useState<State>(token ? { status: 'ready' } : { status: 'invalid' })

    useEffect(() => {
        void trackCoachIntroConfirmViewed()
    }, [])

    async function confirm() {
        setState({ status: 'sending' })
        const result = await confirmIntro(token)
        void trackCoachIntroConfirmed({ result: result.status })
        setState(result)
    }

    return (
        <>
            <Helmet>
                <title>Confirm your email | augo</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <Navbar />
            <main className="min-h-screen flex items-center justify-center px-4 pt-28 pb-16">
                <div
                    className="w-full max-w-[520px] rounded-2xl p-8 flex flex-col gap-6"
                    style={{ backgroundColor: '#0A0A0A', border: '1px solid #222' }}
                >
                    <Body state={state} lang={lang} onConfirm={confirm} />
                </div>
            </main>
        </>
    )
}

function Heading({ children }: { children: React.ReactNode }) {
    return <h1 className="font-mono font-bold text-[24px] leading-[125%] text-white">{children}</h1>
}

function Text({ children }: { children: React.ReactNode }) {
    return <p className="font-satoshi text-[16px] leading-[160%] text-[#969EA7]">{children}</p>
}

function Steps({ done }: { done: number }) {
    return (
        <ol className="flex flex-col gap-3">
            {STEPS.map((step, i) => (
                <li key={step} className="flex gap-3 items-start font-satoshi text-[15px] leading-[150%]">
                    <span
                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-mono text-[12px] font-bold text-white"
                        style={{
                            background: i < done ? 'linear-gradient(83.9deg, #C50017 0%, #FF5514 50%, #FFCA1E 100%)' : '#1A1A1A',
                            border: i < done ? 'none' : '1px solid #333',
                        }}
                    >
                        {i + 1}
                    </span>
                    <span className={i < done ? 'text-white' : 'text-[#969EA7]'}>{step}</span>
                </li>
            ))}
        </ol>
    )
}

const buttonClass =
    'btn-gradient font-mono text-[12px] font-extrabold tracking-[2px] uppercase text-white rounded-lg h-12 px-6 flex items-center justify-center hover:brightness-110 transition-all duration-200 disabled:opacity-60 cursor-pointer'

function Body({ state, lang, onConfirm }: { state: State; lang: string; onConfirm: () => void }) {
    switch (state.status) {
        case 'ready':
        case 'sending':
            return (
                <>
                    <Heading>One click to reach your coach</Heading>
                    <Steps done={0} />
                    <button type="button" onClick={onConfirm} disabled={state.status === 'sending'} className={buttonClass}>
                        {state.status === 'sending' ? '...' : 'Confirm and send my details'}
                    </button>
                    <Text>Didn't ask for this? Close this page and nothing is sent.</Text>
                </>
            )
        case 'ok':
        case 'already': {
            const coach = state.coachFirstName || 'Your coach'
            return (
                <>
                    <Heading>{state.status === 'ok' ? `Done. ${coach} has your details.` : `Already sent to ${coach}.`}</Heading>
                    <Steps done={2} />
                    <Text>
                        {coach} will reply to you by email. We've sent you a copy of what happens next. If nothing
                        arrives in a few days, check your spam folder.
                    </Text>
                </>
            )
        }
        case 'expired':
            return (
                <>
                    <Heading>This link has expired</Heading>
                    <Text>Links are valid for 7 days. Ask again from the coach's profile and we'll send you a new one.</Text>
                    <Link to={state.coachSlug ? `/${lang}/coaches/${state.coachSlug}` : `/${lang}/find`} className={buttonClass}>
                        {state.coachSlug ? "Back to the coach's profile" : 'Find a coach'}
                    </Link>
                </>
            )
        case 'invalid':
            return (
                <>
                    <Heading>This link doesn't work</Heading>
                    <Text>It may be incomplete. Open it again from the email, or ask again from the coach's profile.</Text>
                    <Link to={`/${lang}/find`} className={buttonClass}>
                        Find a coach
                    </Link>
                </>
            )
        case 'error':
            return (
                <>
                    <Heading>Something went wrong</Heading>
                    <Text>We couldn't confirm your email just now. Please try again in a moment.</Text>
                    <button type="button" onClick={onConfirm} className={buttonClass}>
                        Try again
                    </button>
                </>
            )
    }
}
