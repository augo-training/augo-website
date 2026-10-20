import { Link } from 'react-router-dom'
import type { SpecItem } from './constants'

interface SpecListProps {
    label: string
    items: readonly SpecItem[]
    /** Starts the row numbering here, so several lists can count on from one another. */
    startAt?: number
    /** Shows "NN / NN" in the header row. Off for short lists that follow another. */
    counter?: boolean
}

const LINK_CLASS = 'underline underline-offset-4 decoration-white/40 hover:decoration-white transition-colors duration-200'

/**
 * The statement, with the linked phrase (if any) wrapped in a link: a router
 * Link for in-app paths, an outbound anchor otherwise. White with an
 * underline, like every other link on the dark pages: no coloured text.
 */
function Statement({ item }: { item: SpecItem }) {
    const { statement, link } = item
    const at = link ? statement.indexOf(link.text) : -1
    if (!link || at === -1) return <>{statement}</>
    const internal = link.href.startsWith('/')
    return (
        <>
            {statement.slice(0, at)}
            {internal ? (
                <Link to={link.href} className={LINK_CLASS}>
                    {link.text}
                </Link>
            ) : (
                <a href={link.href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
                    {link.text}
                </a>
            )}
            {statement.slice(at + link.text.length)}
        </>
    )
}

/**
 * The numbered spec-sheet list that the Human Edge page repeats in every
 * section: a mono header row, then label / statement rows separated by
 * hairlines. Extracted here so the Racing Team page writes it once.
 */
export default function SpecList({ label, items, startAt = 1, counter = true }: SpecListProps) {
    const total = String(items.length).padStart(2, '0')
    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-baseline justify-between gap-6">
                <p className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/55">
                    {label}
                </p>
                {counter && (
                    <p className="shrink-0 whitespace-nowrap font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/30 tabular-nums">
                        {total} / {total}
                    </p>
                )}
            </div>

            <dl className="flex flex-col">
                {items.map((item, i) => (
                    <div
                        key={item.label + i}
                        className="group grid grid-cols-[28px_minmax(80px,120px)_1fr] sm:grid-cols-[36px_minmax(110px,160px)_1fr] items-baseline gap-x-3 sm:gap-x-6 py-5 sm:py-6 border-t border-white/[0.08] last:border-b last:border-white/[0.08] transition-colors duration-200 hover:bg-white/[0.015]"
                    >
                        <span className="font-mono text-[11px] sm:text-[12px] tracking-[1.5px] text-white/35 tabular-nums">
                            {String(startAt + i).padStart(2, '0')}
                        </span>
                        <dt className="font-mono text-[11px] sm:text-[12px] tracking-[2.5px] uppercase text-white/55 group-hover:text-white/80 transition-colors duration-200">
                            {item.label}
                        </dt>
                        <dd className="font-satoshi font-medium text-[15px] sm:text-[18px] leading-[140%] text-white">
                            <Statement item={item} />
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    )
}
