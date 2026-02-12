import coachesImg from '../assets/images/img_section_coaches_1.webp'

export default function CoachesSection() {
    return (
        <section id="coaches" className="min-h-screen py-20 px-8 flex flex-col justify-center max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-20 items-center">

                {/* Left: Text Content */}
                <div className="flex flex-col col-span-1 md:col-span-5">
                    {/* Tag */}
                    <div className="flex items-center gap-2 mb-24">
                        <span className="font-satoshi font-black italic text-[18px] leading-[100%] tracking-[4px] text-[#969EA7]">
                            ///////
                        </span>
                        <span className="font-mono italic font-normal text-[18px] leading-[100%] tracking-[2px] text-[#969EA7] uppercase">
                            FOR COACHES
                        </span>
                    </div>

                    <div className="flex flex-col gap-8">
                        {/* Headline */}
                        <h2 className="font-satoshi font-bold text-[40px] leading-[130%] text-white">
                            Instant insights
                            <br />
                            with full athlete context
                        </h2>

                        {/* Body Text */}
                        <div className="flex flex-col gap-6">
                            <p className="font-satoshi font-medium text-[18px] leading-[130%] text-[#969EA7]">
                                augo stores and remembers every athlete
                                <br className="hidden md:block" />
                                conversation, session feedback, and workout data.
                                <br className="hidden md:block" />
                                Ask the intelligent assistant anything and get instant
                                <br className="hidden md:block" />
                                answers with full athlete context.
                            </p>
                            <p className="font-satoshi font-medium text-[18px] leading-[130%] text-[#969EA7]">
                                No more searching through buried calendar notes
                                <br className="hidden md:block" />
                                or scrolling through messages histories to
                                <br className="hidden md:block" />
                                remember when your athlete mentioned that knee
                                <br className="hidden md:block" />
                                discomfort.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right: Image */}
                <div className="flex justify-end col-span-1 md:col-span-7 w-full">
                    <img src={coachesImg} alt="Coaches Interface" className="rounded-2xl w-full h-auto object-cover" />
                </div>
            </div>
        </section>
    )
}
