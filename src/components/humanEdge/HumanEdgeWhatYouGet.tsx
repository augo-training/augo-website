import { useTranslation } from 'react-i18next'
import brianProfile from '../../assets/images/brian-profile.webp'

export default function HumanEdgeWhatYouGet() {
    const { t } = useTranslation()
    const credentials = t('humanEdge.whatYouGet.credentials', { returnObjects: true }) as string[]

    return (
        <section id="what-you-get" aria-labelledby="what-you-get-title" className="w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark">
            <div className="max-w-[1100px] mx-auto flex flex-col gap-8">
                <div className="flex flex-col gap-3">
                    <h2 id="what-you-get-title" className="font-mono font-bold text-[28px] sm:text-[36px] lg:text-[44px] leading-[120%] text-white">
                        {t('humanEdge.whatYouGet.title')}
                    </h2>
                    <p className="font-satoshi text-[18px] text-text-muted">
                        {t('humanEdge.whatYouGet.lead')}
                    </p>
                </div>
                <div
                    className="rounded-2xl p-6 sm:p-10 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 md:gap-10 items-center"
                    style={{ backgroundColor: '#151515', border: '1px solid #2D2D2D' }}
                >
                    <div
                        className="w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] rounded-full overflow-hidden bg-dark-700 mx-auto md:mx-0"
                        style={{ border: '2px solid #FFCA1E' }}
                    >
                        <img
                            src={brianProfile}
                            alt="Portrait of running coach Brian Boisvert — RRCA Level II Coach and 2:44 marathoner"
                            width={200}
                            height={200}
                            loading="lazy"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col gap-3 text-center md:text-left">
                        <p className="font-mono text-[12px] tracking-[2px] uppercase text-yellow">
                            {t('humanEdge.whatYouGet.headline')}
                        </p>
                        <h3 className="font-mono font-bold text-[26px] sm:text-[32px] text-white">
                            <a
                                href="https://greatdayforrunners.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-yellow transition-colors duration-200"
                            >
                                {t('humanEdge.whatYouGet.coachName')}
                            </a>
                        </h3>
                        <ul className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                            {credentials.map((c, i) => (
                                <li
                                    key={i}
                                    className="font-satoshi text-[13px] sm:text-[14px] text-white px-3 py-1.5 rounded-full"
                                    style={{ backgroundColor: '#2D2D2D' }}
                                >
                                    {c}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col gap-2 mt-4">
                    <p className="font-mono text-[14px] tracking-[1px] uppercase text-yellow">
                        {t('humanEdge.whatYouGet.extraTitle')}
                    </p>
                    <p className="font-satoshi text-[17px] sm:text-[18px] leading-[160%] text-white max-w-[800px]">
                        {t('humanEdge.whatYouGet.extraBody')}
                    </p>
                </div>
            </div>
        </section>
    )
}
