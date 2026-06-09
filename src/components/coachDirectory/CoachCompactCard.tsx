import { Link, useParams } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { Coach } from '../../data/coaches/types'
import { GENDER_LABEL } from '../../data/coaches/types'
import DisciplineIcons from './DisciplineIcons'

interface Props {
    coach: Coach
    matchReason?: string
}

/**
 * Photo-less directory card for coaches we have no photography for (currently
 * every non-founding coach). Text-forward and compact so the rest of the
 * roster stays scannable without reserving image space.
 */
export default function CoachCompactCard({ coach, matchReason }: Props) {
    const { lang } = useParams<{ lang: string }>()
    const currentLang = lang ?? 'en'
    const href = `/${currentLang}/coaches/${coach.slug}`

    return (
        <Link
            to={href}
            className="group flex flex-col gap-3 p-5 rounded-xl bg-dark-800 ring-1 ring-white/[0.08] hover:ring-white/20 hover:bg-white/[0.02] transition-all duration-200"
        >
            <div className="flex items-center justify-between gap-3">
                <DisciplineIcons disciplines={coach.disciplines} size={15} className="text-white/70" />
                <span className="font-mono text-[10px] sm:text-[11px] tracking-[1px] text-white/55">
                    {coach.languages.map((l) => l.code.toUpperCase()).join('/')}
                </span>
            </div>

            <div className="flex flex-col gap-1">
                <h4 className="font-satoshi font-bold text-[18px] sm:text-[20px] leading-[110%] tracking-[-0.01em] text-white">
                    {coach.name}
                </h4>
                <span className="font-mono text-[10px] sm:text-[11px] tracking-[1.5px] uppercase text-white/50">
                    {coach.location.city}, {coach.location.country}
                    {coach.gender && ` · ${GENDER_LABEL[coach.gender]}`}
                </span>
            </div>

            <p className="font-satoshi text-[13px] sm:text-[14px] leading-[145%] text-text-muted line-clamp-2">
                {coach.tagline}
            </p>

            {matchReason && (
                <p className="font-mono text-[10px] tracking-[1.5px] uppercase text-white/70">
                    {matchReason}
                </p>
            )}

            <div className="mt-auto pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[2px] uppercase text-white/45">
                    View profile
                </span>
                <ArrowUpRight
                    className="w-4 h-4 text-white/45 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                    strokeWidth={2}
                />
            </div>
        </Link>
    )
}
