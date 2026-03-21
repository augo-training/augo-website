// TODO: Replace with your actual Meta Pixel ID
const META_PIXEL_ID = 'YOUR_PIXEL_ID_HERE'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    _fbq?: (...args: unknown[]) => void
  }
}

let initialized = false

export function initMetaPixel(pixelId: string = META_PIXEL_ID): void {
  if (initialized) return
  if (typeof window === 'undefined') return

  // Meta Pixel base code
  const f = window
  const b = document
  const n = 'script'

  if (f.fbq) return

  interface FbqFunction {
    (...args: unknown[]): void
    callMethod?: (...args: unknown[]) => void
    queue: unknown[][]
    push: (...args: unknown[]) => void
    loaded: boolean
    version: string
  }

  const fbq = function (...args: unknown[]) {
    fbq.callMethod
      ? fbq.callMethod.apply(fbq, args)
      : fbq.queue.push(args)
  } as FbqFunction

  if (!f._fbq) f._fbq = fbq
  fbq.push = fbq
  fbq.loaded = true
  fbq.version = '2.0'
  fbq.queue = []
  f.fbq = fbq

  const script = b.createElement(n)
  script.async = true
  script.src = 'https://connect.facebook.net/en_US/fbevents.js'
  script.id = 'meta-pixel-script'
  const firstScript = b.getElementsByTagName(n)[0]
  firstScript.parentNode?.insertBefore(script, firstScript)

  window.fbq!('init', pixelId)
  initialized = true
}

export function trackPageView(): void {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView')
  }
}

export function trackLead(): void {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead')
  }
}

export function revokeConsent(): void {
  if (typeof window === 'undefined') return

  if (window.fbq) {
    window.fbq('consent', 'revoke')
  }

  // Remove the pixel script
  const script = document.getElementById('meta-pixel-script')
  if (script) {
    script.parentNode?.removeChild(script)
  }

  // Remove Meta Pixel cookies
  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const name = cookie.split('=')[0].trim()
    if (name.startsWith('_fbp') || name.startsWith('_fbc')) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
    }
  }

  initialized = false
}
