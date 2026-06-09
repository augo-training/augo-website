import { Link, useParams } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { Coach } from '../../data/coaches/types'
import { GENDER_LABEL } from '../../data/coaches/types'
import DisciplineIcons from './DisciplineIcons'
import FoundingBadge from './FoundingBadge'
import CoachMonogram from './CoachMonogram'

interface Props {
    coach: Coach
    matchReason?: string
}

export default function CoachCard({ coach, matchReason }: Props) {
    const { lang } = useParams<{ lang: string }>()
    const currentLang = lang ?? 'en'
    const href = `/${currentLang}/coaches/${coach.slug}`

    const founding = coach.isFoundingCoach

    return (
        <Link
            to={href}
            className={`group block relative rounded-2xl overflow-hidden bg-dark-800 transition-all duration-300 ease-out ${
                founding
                    ? 'ring-2 ring-white/30 hover:ring-white/50 shadow-[0_8px_40px_-12px_rgba(255,255,255,0.18)]'
                    : 'ring-1 ring-white/[0.08] hover:ring-white/20'
            }`}
        >
            {/* Portrait */}
            <div className="relative aspect-square overflow-hidden bg-dark-700">
                {founding ? (
                    <img
                        src={coach.media.portrait}
                        alt={`Portrait of ${coach.name}`}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <CoachMonogram coach={coach} size="md" />
                )}
                {/* Bottom gradient scrim for legibility of overlays */}
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
                    style={{
                        background:
                            'linear-gradient(to top, rgba(10,10,10,0.85), rgba(10,10,10,0))',
                    }}
                />

                {/* Founding badge — top-left */}
                {founding && (
                    <div className="absolute top-3 left-3">
                        <FoundingBadge />
                    </div>
                )}

                {/* Disciplines — bottom-left of portrait */}
                <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-dark/70 backdrop-blur-sm ring-1 ring-white/10">
                    <DisciplineIcons disciplines={coach.disciplines} size={14} />
                </div>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 flex flex-col gap-3">
                <div className="flex items-baseline justify-between gap-3">
                    <span className="font-mono text-[10px] sm:text-[11px] tracking-[2px] uppercase text-white/55">
                        {coach.location.country}
                        {coach.gender && ` · ${GENDER_LABEL[coach.gender]}`}
                    </span>
                    <span className="font-mono text-[10px] sm:text-[11px] tracking-[1.5px] uppercase text-white/55">
                        {coach.languages.map((l) => l.code.toUpperCase()).join('/')}
                    </span>
                </div>
                <h3 className="font-satoshi font-bold text-[22px] sm:text-[26px] leading-[110%] tracking-[-0.015em] text-white">
                    {coach.name}
                </h3>
                <p className="font-satoshi text-[14px] sm:text-[15px] leading-[145%] text-text-muted line-clamp-2">
                    {coach.tagline}
                </p>

                {matchReason && (
                    <p className="font-mono text-[10px] sm:text-[11px] tracking-[1.5px] uppercase text-white/70 mt-1">
                        {matchReason}
                    </p>
                )}

                <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/[0.06]">
                    <span className="font-mono text-[10px] tracking-[2px] uppercase text-white/50">
                        View profile
                    </span>
                    <ArrowUpRight
                        className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                        strokeWidth={2}
                    />
                </div>
            </div>
        </Link>
    )
}
