import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import type { Coach } from '../../data/coaches/types'
import DisciplineIcons, { DISCIPLINE_LABEL } from '../coachDirectory/DisciplineIcons'
import FoundingBadge from '../coachDirectory/FoundingBadge'
import { trackCtaClicked } from '../../utils/analytics'
import { hasPortrait } from '../../data/coaches'
import CoachFactsPanel from './CoachFactsPanel'

interface Props {
    coach: Coach
    onContact: () => void
}

/**
 * Coach sites are stored as full URLs, and some deep-link to a page rather than
 * a home page. We keep the path when it's short enough to stay readable (a
 * bare "linkedin.com" tells an athlete nothing) and fall back to the host alone
 * when it isn't. Either way the link points at the full URL.
 */
const MAX_WEBSITE_LABEL = 40

function websiteLabel(url: string): string {
    try {
        const { hostname, pathname } = new URL(url)
        const host = hostname.replace(/^www\./, '')
        const path = pathname.replace(/\/$/, '')
        const full = `${host}${path}`
        return full.length <= MAX_WEBSITE_LABEL ? full : host
    } catch {
        return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')
    }
}

export default function CoachHero({ coach, onContact }: Props) {
    const { lang } = useParams<{ lang: string }>()
    const currentLang = lang ?? 'en'

    const disciplineString = coach.disciplines
        .map((d) => DISCIPLINE_LABEL[d].toUpperCase())
        .join(' · ')

    const backLink = (
        <Link
            to={`/${currentLang}/find`}
            className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase text-white/55 hover:text-white transition-colors w-fit"
        >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            All coaches
        </Link>
    )

    const eyebrow = (
        <span className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/75 inline-flex items-center gap-3 flex-wrap">
            <span>Coach</span>
            <span className="text-white/30">/</span>
            <DisciplineIcons disciplines={coach.disciplines} size={14} />
            <span>{disciplineString}</span>
            <span className="text-white/30">/</span>
            <span>{coach.location.country.toUpperCase()}</span>
        </span>
    )

    // Sits directly under the name so athletes can reach the coach's own site
    // without scrolling the spec sheet. Lowercase mono — an uppercased URL is
    // harder to read than the eyebrow copy the style otherwise matches.
    const websiteUrl = coach.socials?.website
    const website = websiteUrl ? (
        <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            onClick={() =>
                trackCtaClicked({
                    cta_text: 'Coach website',
                    cta_location: 'coach_hero',
                    destination: websiteUrl,
                })
            }
            className="inline-flex items-center gap-1.5 w-fit py-1 font-mono text-[13px] sm:text-[14px] text-white/70 underline decoration-white/25 underline-offset-4 hover:text-white hover:decoration-white transition-colors"
        >
            {websiteLabel(websiteUrl)}
            <ArrowUpRight className="w-4 h-4 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
        </a>
    ) : null

    const cta = (
        <button
            type="button"
            onClick={onContact}
            className="btn-gradient self-start inline-flex items-center gap-2.5 font-mono text-sm font-extrabold tracking-[2px] uppercase text-white rounded-lg cursor-pointer hover:brightness-110 transition-all duration-200"
            style={{ minWidth: '240px', height: '52px', paddingLeft: '24px', paddingRight: '24px' }}
        >
            Work with {coach.firstName}
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
        </button>
    )

    const summary = (
        <p className="font-satoshi font-medium text-[19px] sm:text-[22px] leading-[150%] tracking-[-0.01em] text-white/80 max-w-[600px]">
            {coach.bio.short}
        </p>
    )

    // The founding badge only shows for actual founding coaches.
    const intro = (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 flex-wrap">
                {eyebrow}
                {coach.isFoundingCoach && <FoundingBadge size="md" />}
            </div>
            <div className="flex flex-col gap-3">
                <h1 className="font-satoshi font-bold text-[44px] sm:text-[64px] lg:text-[80px] leading-[98%] tracking-[-0.03em] text-white">
                    {coach.name}
                </h1>
                {website}
            </div>
            {summary}
            <div className="mt-2">{cta}</div>
        </div>
    )

    // One hero skeleton for every coach: content left, a block on the right.
    // With dedicated photography that block is the portrait; without it, a
    // summary of the facts takes the slot rather than leaving the column empty.
    const portrait = hasPortrait(coach)

    const aside = portrait ? (
        <div className="relative aspect-[4/5] w-full max-w-[420px] mx-auto lg:ml-auto overflow-hidden rounded-2xl bg-dark-700 ring-1 ring-white/[0.10]">
            <img
                src={coach.media.portrait}
                alt={`Portrait of ${coach.name}`}
                className="w-full h-full object-cover"
            />
        </div>
    ) : (
        <CoachFactsPanel coach={coach} />
    )

    // Once the columns stack, a portrait reads well above the name — it's how
    // you recognise someone. A panel of facts doesn't: it needs the name first
    // to have anyone to attach them to. So only the portrait jumps the intro.
    const introOrder = portrait ? 'order-2 lg:order-1' : 'order-1'
    const asideOrder = portrait ? 'order-1 lg:order-2' : 'order-2'

    return (
        <section className="w-full pt-32 pb-16 sm:pt-40 sm:pb-20 px-5 sm:px-8 bg-dark texture-grain">
            <div className="max-w-[1200px] mx-auto flex flex-col gap-10">
                {backLink}

                {aside ? (
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.72fr] gap-10 lg:gap-16 items-center">
                        <div className={introOrder}>{intro}</div>
                        <div className={asideOrder}>{aside}</div>
                    </div>
                ) : (
                    intro
                )}
            </div>
        </section>
    )
}
