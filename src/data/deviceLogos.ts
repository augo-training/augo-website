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
import corosWordmark from '../assets/images/coros_wordmark.svg'

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
    /**
     * Classes that even the logo out in the Features strip: thin wordmarks get
     * taller, and marks with something above the letters shift up so the
     * letters line up. Tuned by eye against Strava and Polar.
     */
    tune?: string
}

/*
 * Sized so every logo's letters stand about 23px tall, like Strava and Polar
 * at h-8. Garmin's and Suunto's letters fill only the lower half of their
 * image (a triangle sits above), so they're drawn taller and lifted by the
 * triangle's offset. Measured from each logo rendered at 200px.
 */
const TUNE: Record<string, string> = {
    Garmin: 'h-[46px] -translate-y-[10px]',
}

/** Every integration's logo, for the Features page strip. The homepage keeps DEVICE_LOGOS. */
export const INTEGRATION_LOGOS: LogoItem[] = [
    ...DEVICE_LOGOS.map((logo) =>
        // COROS: the wordmark alone, since its icon is three times the letters' height.
        logo.alt === 'Coros' ? { ...logo, src: corosWordmark, tune: 'h-[22px]' } : { ...logo, tune: TUNE[logo.alt] },
    ),
    { src: suuntoLogo, alt: 'Suunto', tune: 'h-[46px] -translate-y-[11px]' },
    { src: rouvyLogo, alt: 'Rouvy', label: 'Rouvy' },
    { src: hammerheadLogo, alt: 'Hammerhead', label: 'Hammerhead' },
    { src: whoopLogo, alt: 'WHOOP', label: 'WHOOP' },
    { src: ouraLogo, alt: 'Oura', label: 'Oura' },
]
