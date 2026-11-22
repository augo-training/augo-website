import { useTranslation } from 'react-i18next'
import { DEVICE_LOGOS, INTEGRATION_LOGOS, type LogoItem } from '../data/deviceLogos'

function LogoSet({ logos }: { logos: LogoItem[] }) {
    return (
        <div className="marquee-track flex items-center shrink-0">
            {logos.map((logo) =>
                logo.label ? (
                    <span key={logo.alt} className="flex items-center gap-3 px-8 flex-shrink-0 opacity-80">
                        <img src={logo.src} alt="" className="h-10 w-auto" />
                        <span className="font-satoshi font-black text-[34px] leading-none tracking-[-0.5px] text-white">
                            {logo.label}
                        </span>
                    </span>
                ) : (
                    <img
                        key={logo.alt}
                        src={logo.src}
                        alt={logo.alt}
                        className={`${logo.tune ?? 'h-8'} w-auto opacity-80 px-8 flex-shrink-0`}
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

            <LogoMarquee logos={INTEGRATION_LOGOS} className="py-3" />
        </section>
    )
}

/** The rotating device-logo strip. Also used on the Features page. */
export function LogoMarquee({ logos = DEVICE_LOGOS, className = '' }: { logos?: LogoItem[]; className?: string }) {
    return (
        // Marquee container with edge fades
        <div className={`marquee-container w-full overflow-hidden ${className}`}>
            {/* Same speed whatever the number of logos: the 16s in CSS was tuned for 7. */}
            <div className="marquee-scroll flex items-center" style={{ animationDuration: `${(16 * logos.length) / 7}s` }}>
                {/* Render 4 logo sets for continuous coverage on wide screens */}
                <LogoSet logos={logos} />
                <LogoSet logos={logos} />
                <LogoSet logos={logos} />
                <LogoSet logos={logos} />
            </div>
        </div>
    )
}
