import builtImg from '../assets/images/built.webp'
import bikeImg from '../assets/images/bike.webp'

export default function EmpowerSection() {
    return (
        <section className="py-20 px-8 flex flex-col gap-20 max-w-[1200px] mx-auto">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                {/* Left: Text */}
                <h2 className="font-mono font-bold text-[48px] leading-[130%] text-white">
                    Built to
                    <br />
                    empower coaches,
                    <br />
                    not replace them.
                </h2>

                {/* Right: Image */}
                <div className="flex justify-end">
                    <img src={builtImg} alt="Built to empower" className="rounded-2xl max-w-full h-auto object-cover" />
                </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                {/* Left: Image */}
                <div>
                    <img src={bikeImg} alt="Cycling athlete" className="rounded-2xl max-w-full h-auto object-cover" />
                </div>

                {/* Right: Text Content */}
                <div className="flex flex-col justify-center h-full ml-18">
                    <p className="font-satoshi font-medium text-[18px] leading-[130%] text-[#ACB1B7] mb-12">
                        Too many coaching tools focus on plans, not people.
                        <br />
                        Messages scatter across platforms. Context gets lost. And
                        <br />
                        important signals go unnoticed in the noise.
                    </p>

                    <p className="font-satoshi font-bold text-[24px] leading-[130%] text-white">
                        augo brings everything together -
                        <br />
                        combining athlete data, feedback, and
                        <br />
                        trends into a single view that helps you
                        <br />
                        coach better.
                    </p>
                </div>
            </div>
        </section>
    )
}
