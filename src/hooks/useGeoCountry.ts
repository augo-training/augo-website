import { useState, useEffect } from 'react'

const STORAGE_KEY = 'augo_country_code'

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
                setCountryCode(null)
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
