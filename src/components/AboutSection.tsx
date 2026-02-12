import aboutLeftImg from '../assets/images/about_augo_left.webp'
import aboutRightImg from '../assets/images/about_augo_right.webp'

export default function AboutSection() {
    return (
        <section className="py-20 px-8 flex flex-col gap-16 max-w-[1200px] mx-auto">
            {/* Row 1: Text left + Image right */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Left: Texts */}
                <div className="flex flex-col gap-6">
                    <p className="font-satoshi font-medium text-[18px] leading-[130%] text-[#969EA7]">
                        augo was founded by Fabi and Bruna, two endurance coaches who
                        also happened to work in tech. As a business analyst and data
                        scientist, they expected their tools to help them coach better.
                    </p>
                    <p className="font-satoshi font-bold text-[24px] leading-[130%] text-white">
                        Instead, they found themselves drowning in
                        fragmented communication, losing important
                        details, and missing the signals that mattered.
                    </p>
                </div>

                {/* Right: Tag + Image */}
                <div className="flex flex-col gap-4">
                    {/* Tag aligned right */}
                    <div className="flex items-center gap-2 mb-2 justify-end">
                        <span className="font-satoshi font-black italic text-[18px] leading-[100%] tracking-[4px] text-[#969EA7]">
                            ///////
                        </span>
                        <span className="font-mono italic font-normal text-[18px] leading-[100%] tracking-[2px] text-[#969EA7] uppercase">
                            ABOUT AUGO
                        </span>
                    </div>
                    <img src={aboutRightImg} alt="Augo founder" className="rounded-2xl w-full h-auto object-cover" />
                </div>
            </div>

            {/* Row 2: Image left + Text right */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Left: Image */}
                <div>
                    <img src={aboutLeftImg} alt="Augo founder" className="rounded-2xl w-full h-auto object-cover" />
                </div>

                {/* Right: Texts */}
                <div className="flex flex-col gap-6">
                    <p className="font-satoshi font-medium text-[18px] leading-[130%] text-[#969EA7]">
                        So they built augo. Because coaching is hard enough without tools
                        that create more work. We believe AI should support human
                        expertise with the right insights at the right time, helping you do
                        what you do best: understand and develop your athletes.
                    </p>
                    <p className="font-satoshi font-bold text-[24px] leading-[130%] text-white">
                        Technology that serves coaches, not the other
                        way around
                    </p>
                </div>
            </div>
        </section>
    )
}
