import { Link, useParams } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { Coach } from '../../data/coaches/types'
import DisciplineIcons from '../coachDirectory/DisciplineIcons'
import CoachMonogram from '../coachDirectory/CoachMonogram'

interface Props {
    coach: Coach
    rank: number
    reason?: string
}

export default function CoachCardMini({ coach, rank, reason }: Props) {
    const { lang } = useParams<{ lang: string }>()
    const currentLang = lang ?? 'en'

    return (
        <Link
            to={`/${currentLang}/coaches/${coach.slug}`}
            className="group flex items-stretch gap-4 p-3 rounded-xl bg-dark-800 ring-1 ring-white/[0.08] hover:ring-white/20 transition-all duration-200"
        >
            <div className="relative w-20 h-24 sm:w-24 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden bg-dark-700">
                {coach.isFoundingCoach ? (
                    <img
                        src={coach.media.portrait}
                        alt={`Portrait of ${coach.name}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <CoachMonogram coach={coach} size="sm" />
                )}
                <span className="absolute top-1 left-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-dark/85 ring-1 ring-white/15 font-mono text-[10px] font-bold tabular-nums text-white">
                    {rank}
                </span>
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-0 py-1">
                <div className="flex items-baseline justify-between gap-3">
                    <span className="font-mono text-[10px] tracking-[2px] uppercase text-white/55 truncate">
                        {coach.location.city}, {coach.location.country}
                    </span>
                    <span className="font-mono text-[10px] tracking-[1px] text-white/55 flex-shrink-0">
                        {coach.languages.map((l) => l.flag).join(' ')}
                    </span>
                </div>
                <h4 className="font-satoshi font-bold text-[17px] sm:text-[19px] leading-[110%] tracking-[-0.01em] text-white truncate">
                    {coach.name}
                </h4>
                <p className="font-satoshi text-[13px] sm:text-[14px] leading-[140%] text-text-muted line-clamp-2">
                    {coach.tagline}
                </p>
                <div className="mt-auto pt-2 flex items-center justify-between gap-3">
                    <DisciplineIcons disciplines={coach.disciplines} size={13} className="text-white/70" />
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] tracking-[2px] uppercase text-white/45 group-hover:text-white transition-colors">
                        View
                        <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={2.5} />
                    </span>
                </div>
                {reason && (
                    <span className="font-mono text-[10px] tracking-[1.5px] uppercase text-white/70 mt-1 truncate">
                        {reason}
                    </span>
                )}
            </div>
        </Link>
    )
}
