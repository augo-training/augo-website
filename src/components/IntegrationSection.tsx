import { useTranslation } from 'react-i18next'
import integrationImg from '../assets/images/training_peaks.webp'
import integrationImgMobile from '../assets/images/training_peaks_mobile.webp'

export default function IntegrationSection() {
    const { t } = useTranslation()

    return (
        <section id='how-it-works' className="py-12 sm:py-16 md:py-28 px-5 sm:px-6 md:px-8 flex flex-col items-center gap-10 sm:gap-14 md:gap-16 max-w-[1200px] mx-auto">
            {/* Texts */}
            <div className="flex flex-col items-center gap-4 sm:gap-6 max-w-[1000px]">
                <h2 className="font-mono font-bold text-[28px] sm:text-[36px] md:text-[48px] leading-[130%] text-center text-white">
                    {t('integration.headline')}
                </h2>
                <p className="font-satoshi font-medium text-[15px] sm:text-[16px] md:text-[18px] leading-[130%] text-center text-[#ACB1B7] max-w-[800px]">
                    {t('integration.body')}
                </p>
            </div>

            {/* Images: Desktop / Mobile swap */}
            <div className="w-full flex justify-center">
                <img
                    src={integrationImg}
                    alt="Integration flow"
                    className="hidden md:block w-full h-auto object-contain"
                />
                <img
                    src={integrationImgMobile}
                    alt="Integration flow mobile"
                    className="block md:hidden w-full max-w-[200px] h-auto object-contain"
                />
            </div>
        </section>
    )
}
