import bgSection1 from '../assets/images/bg_section_1.svg'
import imgSection1 from '../assets/images/img_section_1.png'

export default function Hero() {
    return (
        <section
            className="relative min-h-screen flex items-center overflow-hidden"
            style={{
                backgroundImage: `url(${bgSection1})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Content Container */}
            <div className="relative z-10 w-full max-w-[1440px] mx-auto px-12 flex items-center justify-between pt-24">
                {/* Left: Text Content */}
                <div className="max-w-[480px] flex-shrink-0">
                    <h1 className="font-mono font-bold text-[48px] leading-[120%] text-white mb-6">
                        A new standard for running coaching
                    </h1>
                    <p className="font-satoshi font-medium text-lg leading-[130%] text-text-muted mb-10">
                        The intelligent assistant that combines workout data and athlete feedback, turning insights into action and giving you time for what matters most.
                    </p>
                    <a
                        href="#join"
                        className="btn-gradient inline-block font-mono text-sm font-extrabold tracking-[2px] uppercase text-white px-8 py-4 rounded-lg hover:brightness-110 transition-all duration-200 cursor-pointer"
                    >
                        Join Augo
                    </a>
                </div>

                {/* Right: App Mockups */}
                <div>
                    {/* Image */}
                    <img
                        src={imgSection1}
                        alt="Augo AI Assistant"
                    />
                </div>
            </div>
        </section>
    )
}
