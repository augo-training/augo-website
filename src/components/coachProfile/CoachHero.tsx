import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import type { Coach } from '../../data/coaches/types'
import DisciplineIcons, { DISCIPLINE_LABEL } from '../coachDirectory/DisciplineIcons'
import FoundingBadge from '../coachDirectory/FoundingBadge'
import placeholderPortrait from '../../assets/images/brian-profile.webp'

interface Props {
    coach: Coach
    onContact: () => void
}

// Static brand gradient (animated .btn-gradient would be distracting at band scale).
const BRAND_BAND =
    'linear-gradient(83.9deg, #151515 -4%, #C50017 38%, #FF5514 69%, #FFCA1E 100%)'

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

    // A real portrait (founding coaches, or others with dedicated photography)
    // gets the featured two-column layout. The founding badge only shows for
    // actual founding coaches.
    const hasPortrait = coach.media.portrait !== placeholderPortrait
    if (hasPortrait) {
        return (
            <section className="w-full pt-32 pb-12 sm:pt-40 sm:pb-16 px-5 sm:px-8 bg-dark texture-grain">
                <div className="max-w-[1200px] mx-auto flex flex-col gap-10">
                    {backLink}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.72fr] gap-10 lg:gap-16 items-center">
                    <div className="flex flex-col gap-6 order-2 lg:order-1">
                        <div className="flex items-center gap-4 flex-wrap">
                            {eyebrow}
                            {coach.isFoundingCoach && <FoundingBadge size="md" />}
                        </div>
                        <h1 className="font-satoshi font-bold text-[44px] sm:text-[64px] lg:text-[80px] leading-[98%] tracking-[-0.03em] text-white">
                            {coach.name}
                        </h1>
                        {summary}
                        <div className="mt-2">{cta}</div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <div className="relative aspect-[4/5] w-full max-w-[420px] mx-auto lg:ml-auto overflow-hidden rounded-2xl bg-dark-700 ring-1 ring-white/[0.10]">
                            <img
                                src={coach.media.portrait}
                                alt={`Portrait of ${coach.name}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    </div>
                </div>
            </section>
        )
    }

    // No dedicated photo yet — brand gradient cover band.
    return (
        <section className="w-full pt-28 pb-12 sm:pt-32 sm:pb-16 px-5 sm:px-8 bg-dark texture-grain">
            <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
                {backLink}
                <div
                    className="relative overflow-hidden rounded-2xl ring-1 ring-white/[0.10] flex items-end p-7 sm:p-10 min-h-[220px] sm:min-h-[300px]"
                    style={{ background: BRAND_BAND }}
                >
                    {/* Dark scrim at the base keeps the name + eyebrow legible over the gradient */}
                    <div
                        aria-hidden="true"
                        className="absolute inset-0"
                        style={{
                            background:
                                'linear-gradient(to top, rgba(10,10,10,0.60) 0%, rgba(10,10,10,0.10) 55%, rgba(10,10,10,0) 100%)',
                        }}
                    />
                    <div className="relative z-10 flex flex-col gap-3">
                        {eyebrow}
                        <h1 className="font-satoshi font-bold text-[40px] sm:text-[60px] lg:text-[72px] leading-[98%] tracking-[-0.03em] text-white">
                            {coach.name}
                        </h1>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    {summary}
                    <div>{cta}</div>
                </div>
            </div>
        </section>
    )
}
