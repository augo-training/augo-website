import integrationImg from '../assets/images/training_peaks.webp'

export default function IntegrationSection() {
    return (
        <section className="py-28 px-8 flex flex-col items-center gap-16 max-w-[1200px] mx-auto">
            {/* Texts */}
            <div className="flex flex-col items-center gap-6 max-w-[1000px]">
                <h2 className="font-mono font-bold text-[48px] leading-[130%] text-center text-white">
                    augo works with what you already use
                </h2>
                <p className="font-satoshi font-medium text-[18px] leading-[130%] text-center text-[#ACB1B7]">
                    You keep TrainingPeaks for workout planning. Athletes keep their Garmin or Coros. augo sits in the
                    middle, connecting everything with centralized communication and intelligent insights.
                </p>
            </div>

            {/* Image */}
            <div className="w-full">
                <img src={integrationImg} alt="Integration flow" className="w-full h-auto object-contain" />
            </div>
        </section>
    )
}
