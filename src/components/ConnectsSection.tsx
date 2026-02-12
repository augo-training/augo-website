import samsungLogo from '../assets/images/samsung.svg'
import trainingPeaksLogo from '../assets/images/training_peaks.webp'
import appleWatchLogo from '../assets/images/apple_watch.svg'
import wahooLogo from '../assets/images/wahoo.svg'
import corosLogo from '../assets/images/coros.svg'
import amazfitLogo from '../assets/images/amazfit.svg'
import polarLogo from '../assets/images/polar.svg'

const logos = [
    { src: samsungLogo, alt: 'Samsung Galaxy Watch' },
    { src: trainingPeaksLogo, alt: 'Training Peaks' },
    { src: appleWatchLogo, alt: 'Apple Watch' },
    { src: wahooLogo, alt: 'Wahoo' },
    { src: corosLogo, alt: 'Coros' },
    { src: amazfitLogo, alt: 'Amazfit' },
    { src: polarLogo, alt: 'Polar' },
]

export default function ConnectsSection() {
    return (
        <section className="py-20 flex flex-col items-center justify-center gap-12">
            <h2 className="font-mono text-[36px] font-normal leading-[150%] tracking-[0px] text-center text-[#969EA7]">
                Connects seamlessly with your apps and devices
            </h2>
            <div className="flex items-center justify-center gap-16 flex-wrap px-8">
                {logos.map((logo) => (
                    <img
                        key={logo.alt}
                        src={logo.src}
                        alt={logo.alt}
                        className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
                    />
                ))}
            </div>
        </section>
    )
}
