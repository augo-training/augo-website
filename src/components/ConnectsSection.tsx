import { useTranslation } from 'react-i18next'
import { DEVICE_LOGOS } from '../data/deviceLogos'

function LogoSet() {
    return (
        <div className="marquee-track flex items-center shrink-0">
            {DEVICE_LOGOS.map((logo) => (
                <img
                    key={logo.alt}
                    src={logo.src}
                    alt={logo.alt}
                    className="h-8 w-auto opacity-80 px-8 flex-shrink-0"
                />
            ))}
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
export function LogoMarquee() {
    return (
        // Marquee container with edge fades
        <div className="marquee-container w-full overflow-hidden">
            <div className="marquee-scroll flex items-center">
                {/* Render 4 logo sets for continuous coverage on wide screens */}
                <LogoSet />
                <LogoSet />
                <LogoSet />
                <LogoSet />
            </div>
        </div>
    )
}
