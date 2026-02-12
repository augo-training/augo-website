import bgSection from '../assets/images/bg_section_1.webp'

export default function FaqSection() {
    return (
        <section
            className="min-h-screen w-full py-20 px-8 flex items-center"
            style={{
                backgroundImage: `url(${bgSection})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-[1200px] mx-auto w-full items-start">
                {/* Left: CTA */}
                <div className="flex flex-col gap-8 justify-center h-full pt-24">
                    <h2 className="font-mono font-bold text-[48px] leading-[120%] text-white">
                        A new standard
                        <br />
                        for endurance
                        <br />
                        coaching
                    </h2>
                    <p className="font-satoshi font-medium text-[18px] leading-[130%] text-[#969EA7]">
                        The intelligent assistant that combines data with
                        <br className="hidden md:block" />
                        human context, turning insights into action and
                        <br className="hidden md:block" />
                        giving you time for what matters most.
                    </p>
                    <a
                        href="#join"
                        className="btn-gradient font-mono text-sm font-extrabold tracking-[2px] uppercase text-white rounded-lg hover:brightness-110 transition-all duration-200 flex items-center justify-center"
                        style={{ width: '209px', height: '48px' }}
                    >
                        Join Augo
                    </a>
                </div>

                {/* Right: FAQ */}
                <div className="flex flex-col gap-6">
                    <h3 className="font-satoshi font-bold text-[40px] leading-[130%] text-[#969EA7]">
                        FAQ
                    </h3>
                    {/* FAQ expandable items placeholder */}
                    <div className="min-h-[400px]">
                        {/* Expandable FAQ items will be implemented here */}
                    </div>
                </div>
            </div>
        </section>
    )
}
