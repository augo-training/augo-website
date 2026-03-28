import { useState, useEffect } from 'react'

const STORAGE_KEY = 'augo_country_code'

const TIMEZONE_TO_COUNTRY: Record<string, string> = {
    'Europe/Zurich': 'CH',
    'Europe/Vaduz': 'CH',
    'Europe/Berlin': 'DE',
    'Europe/Vienna': 'AT',
    'Europe/Amsterdam': 'NL',
    'Europe/Brussels': 'BE',
    'Europe/Luxembourg': 'LU',
    'Europe/Helsinki': 'FI',
    'Europe/Paris': 'FR',
    'Europe/Rome': 'IT',
    'Europe/Madrid': 'ES',
    'Europe/Lisbon': 'PT',
    'Europe/Warsaw': 'PL',
    'Europe/Prague': 'CZ',
    'Europe/Bucharest': 'RO',
    'Europe/Budapest': 'HU',
    'Europe/Sofia': 'BG',
    'Europe/Zagreb': 'HR',
    'Europe/Bratislava': 'SK',
    'Europe/Ljubljana': 'SI',
    'Europe/Belgrade': 'RS',
    'Europe/Athens': 'GR',
    'Europe/Riga': 'LV',
    'Europe/Vilnius': 'LT',
    'Europe/Tallinn': 'EE',
    'Europe/London': 'GB',
    'Europe/Dublin': 'IE',
    'America/New_York': 'US',
    'America/Chicago': 'US',
    'America/Denver': 'US',
    'America/Los_Angeles': 'US',
    'America/Toronto': 'CA',
    'America/Vancouver': 'CA',
    'Australia/Sydney': 'AU',
    'Australia/Melbourne': 'AU',
    'Pacific/Auckland': 'NZ',
    'Europe/Copenhagen': 'DK',
    'Europe/Stockholm': 'SE',
    'Europe/Oslo': 'NO',
    'America/Sao_Paulo': 'BR',
    'Asia/Dubai': 'AE',
    'America/Mexico_City': 'MX',
    'America/Bogota': 'CO',
    'America/Santiago': 'CL',
    'America/Argentina/Buenos_Aires': 'AR',
    'America/Lima': 'PE',
    'Africa/Johannesburg': 'ZA',
    'Asia/Singapore': 'SG',
    'Asia/Seoul': 'KR',
    'Asia/Tokyo': 'JP',
}

function guessCountryFromBrowser(): string | null {
    // 1. Try timezone
    try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
        const fromTz = TIMEZONE_TO_COUNTRY[tz]
        if (fromTz) return fromTz
    } catch {
        // ignore
    }

    // 2. Try language locale suffix (e.g. "de-CH" → "CH")
    try {
        const lang = navigator.language ?? ''
        const parts = lang.split('-')
        if (parts.length >= 2) {
            const code = parts[parts.length - 1].toUpperCase()
            if (code.length === 2) return code
        }
    } catch {
        // ignore
    }

    return null
}

interface GeoCountryResult {
    countryCode: string | null
    loading: boolean
}

export function useGeoCountry(): GeoCountryResult {
    const cached = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null

    const [countryCode, setCountryCode] = useState<string | null>(cached)
    const [loading, setLoading] = useState<boolean>(cached === null)

    useEffect(() => {
        if (cached !== null) return

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 4000)

        fetch('https://api.country.is/', { signal: controller.signal })
            .then((res) => res.json())
            .then((data: { country?: string }) => {
                const code = data.country ?? null
                if (code) localStorage.setItem(STORAGE_KEY, code)
                setCountryCode(code)
            })
            .catch(() => {
                const fallback = guessCountryFromBrowser()
                if (fallback) localStorage.setItem(STORAGE_KEY, fallback)
                setCountryCode(fallback)
            })
            .finally(() => {
                clearTimeout(timeoutId)
                setLoading(false)
            })

        return () => {
            controller.abort()
            clearTimeout(timeoutId)
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return { countryCode, loading }
}
