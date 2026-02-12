import athletesImg from '../assets/images/img_for_athletes_1.webp'

export default function AthletesSection() {
    return (
        <section id="athletes" className="min-h-screen pt-16 pb-8 flex flex-col items-center justify-center gap-8 max-w-[1200px] mx-auto">
            {/* Tag */}
            <div className="flex items-center gap-2">
                <span className="font-satoshi font-black italic text-[18px] leading-[100%] tracking-[4px] text-[#969EA7]">
                    ///////
                </span>
                <span className="font-mono italic font-normal text-[18px] leading-[100%] tracking-[2px] text-[#969EA7] uppercase">
                    FOR ATHLETES
                </span>
            </div>

            {/* Headline */}
            <h2 className="font-mono font-bold text-[48px] leading-[130%] text-center text-white">
                Everything your athletes need in
                <br className="hidden md:block" />
                one place
            </h2>

            {/* Card with gradient background */}
            <div
                className="w-full rounded-2xl pl-8 md:pl-12"
                style={{ background: 'linear-gradient(14.48deg, #151515 -17.53%, #090909 79.83%)' }}
            >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                    {/* Left: Text */}
                    <div className="flex flex-col gap-6 col-span-1 md:col-span-5">
                        <h3 className="font-satoshi font-bold text-[48px] leading-[130%] text-white">
                            Your dedicated
                            <br />
                            space to connect
                            <br />
                            with your coach
                        </h3>
                        <p className="font-satoshi font-medium text-[18px] leading-[130%] text-[#ACB1B7]">
                            All messages, session feedbacks and workout data in
                            <br className="hidden md:block" />
                            one place—so you always feel supported, no matter
                            <br className="hidden md:block" />
                            where you are.
                        </p>
                    </div>

                    {/* Right: Image */}
                    <div className="col-span-1 md:col-span-7 flex justify-end">
                        <img src={athletesImg} alt="Athletes Interface" className="rounded-2xl w-full h-auto object-cover" />
                    </div>
                </div>
            </div>
        </section>
    )
}
