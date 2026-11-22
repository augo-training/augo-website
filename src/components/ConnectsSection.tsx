import { useTranslation } from 'react-i18next'
import { DEVICE_LOGOS, type LogoItem } from '../data/deviceLogos'

function LogoSet({ logos }: { logos: LogoItem[] }) {
    return (
        <div className="marquee-track flex items-center shrink-0">
            {logos.map((logo) =>
                logo.label ? (
                    <span key={logo.alt} className="flex items-center gap-2.5 px-8 flex-shrink-0 opacity-80">
                        <img src={logo.src} alt="" className="h-8 w-auto" />
                        <span className="font-satoshi font-bold text-[20px] leading-none tracking-[0.2px] text-white">
                            {logo.label}
                        </span>
                    </span>
                ) : (
                    <img
                        key={logo.alt}
                        src={logo.src}
                        alt={logo.alt}
                        className={`${logo.size ?? 'h-8'} w-auto opacity-80 px-8 flex-shrink-0`}
                    />
                ),
            )}
        </div>
    )
}

export default function ConnectsSection() {
    const { t } = useTranslation()

    return (
        <section className="py-12 sm:py-16 md:py-20 flex flex-col items-center justify-center gap-8 sm:gap-10 md:gap-12 px-5 sm:px-6 md:px-8 lg:px-12">
            <h2 className="font-satoshi text-[20px] sm:text-[24px] md:text-[28px] lg:text-[36px] font-normal leading-[150%] tracking-[0px] text-center text-[#969EA7]">
                {t('connects.headline')}
            </h2>

            <LogoMarquee />
        </section>
    )
}

/** The rotating device-logo strip. Also used on the Features page. */
export function LogoMarquee({ logos = DEVICE_LOGOS }: { logos?: LogoItem[] }) {
    return (
        // Marquee container with edge fades
        <div className="marquee-container w-full overflow-hidden">
            <div className="marquee-scroll flex items-center">
                {/* Render 4 logo sets for continuous coverage on wide screens */}
                <LogoSet logos={logos} />
                <LogoSet logos={logos} />
                <LogoSet logos={logos} />
                <LogoSet logos={logos} />
            </div>
        </div>
    )
}
