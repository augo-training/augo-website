import stravaLogo from '../assets/images/strava.svg'
import wahooLogo from '../assets/images/wahoo.svg'
import corosLogo from '../assets/images/coros.svg'
import polarLogo from '../assets/images/polar.svg'
import garminLogo from '../assets/images/garmin.svg'
import zwiftLogo from '../assets/images/zwift.svg'
import appleWatchLogo from '../assets/images/apple_watch.svg'
import suuntoLogo from '../assets/images/suunto_logo.png'
import rouvyLogo from '../assets/images/rouvy_logo.png'
import hammerheadLogo from '../assets/images/hammerhead_logo.png'
import whoopLogo from '../assets/images/whoop_logo.svg'
import ouraLogo from '../assets/images/oura_logo.png'

/** Device logos, in the order the homepage strip shows them. */
export const DEVICE_LOGOS: LogoItem[] = [
    { src: garminLogo, alt: 'Garmin' },
    { src: appleWatchLogo, alt: 'Apple Watch' },
    { src: stravaLogo, alt: 'Strava' },
    { src: corosLogo, alt: 'Coros' },
    { src: wahooLogo, alt: 'Wahoo' },
    { src: zwiftLogo, alt: 'Zwift' },
    { src: polarLogo, alt: 'Polar' },
]

export interface LogoItem {
    src: string
    alt: string
    /** For icon-only marks: the brand name, set next to the icon so it reads. */
    label?: string
    /** Tailwind height class, when the mark needs a different size to look even. */
    size?: string
}

/** Every integration's logo, for the Features page strip. The homepage keeps DEVICE_LOGOS. */
export const INTEGRATION_LOGOS: LogoItem[] = [
    ...DEVICE_LOGOS,
    { src: suuntoLogo, alt: 'Suunto', size: 'h-10' },
    { src: rouvyLogo, alt: 'Rouvy', label: 'Rouvy' },
    { src: hammerheadLogo, alt: 'Hammerhead', label: 'Hammerhead' },
    { src: whoopLogo, alt: 'WHOOP', label: 'WHOOP' },
    { src: ouraLogo, alt: 'Oura', label: 'Oura' },
]
