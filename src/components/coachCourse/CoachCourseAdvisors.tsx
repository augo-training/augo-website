import marcoPhoto from '../../assets/images/advisor-marco.png?w=192&h=192&format=webp'
import gordonPhoto from '../../assets/images/advisor-gordon.png?w=192&h=192&format=webp'
import retoPhoto from '../../assets/images/advisor-reto.png?w=192&h=192&format=webp'
import { COPY } from './constants'

const PHOTOS = { marco: marcoPhoto, gordon: gordonPhoto, reto: retoPhoto } as const

/**
 * The three coaches who advise the augo team, under "Written by the augo team":
 * a round headshot, the name and the title, and nothing else. They are advisers,
 * not quoted, so there is no blockquote here.
 *
 * One row per coach on phones (photo left, text right), three columns from sm
 * up. The photos are square head-and-shoulders crops made from the originals;
 * recrop at the source rather than nudging object-position here.
 *
 * The photo's alt is empty because the name sits right beside it.
 */
export default function CoachCourseAdvisors() {
    return (
        <ul className="m-0 mt-5 grid list-none gap-3 p-0 sm:grid-cols-3">
            {COPY.team.advisors.map((advisor) => (
                <li
                    key={advisor.name}
                    className="merci-quote flex items-center gap-4 rounded-[20px] p-4 sm:flex-col sm:items-center sm:gap-3 sm:p-5 sm:text-center"
                >
                    <img
                        src={PHOTOS[advisor.photo]}
                        alt=""
                        width={96}
                        height={96}
                        loading="lazy"
                        className="h-[72px] w-[72px] shrink-0 rounded-full object-cover sm:h-24 sm:w-24"
                    />
                    <div>
                        <p className="m-0 font-sans text-[18px] font-extrabold leading-[1.2] tracking-[-0.02em] text-white sm:text-[19px]">
                            {advisor.name}
                        </p>
                        <p className="m-0 mt-1 font-satoshi text-[16px] leading-[1.4] text-text-muted sm:text-[17px]">
                            {advisor.title}
                        </p>
                    </div>
                </li>
            ))}
        </ul>
    )
}
