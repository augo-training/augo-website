import { useEffect, useState } from 'react'
import { getPricingTier, type PricingTier } from '../config/pricingConfig'
import { resolvePricing, type ResolvedPricing } from '../utils/planPricing'
import { useGeoCountry } from './useGeoCountry'

export interface PlanPricingResult {
    tier: PricingTier
    /** 'api' once backend prices arrived; 'fallback' = legacy hardcoded tiers. */
    source: 'api' | 'fallback'
    loading: boolean
    countryCode: string | null
}

/**
 * The displayed plan price: backend-sourced (via the IP-estimated country as
 * a `?country=` hint), falling back to the legacy hardcoded tiers while
 * loading or when the API is unavailable.
 */
export function usePlanPricing(): PlanPricingResult {
    const { countryCode, loading: geoLoading } = useGeoCountry()
    const [resolved, setResolved] = useState<ResolvedPricing | null>(null)

    useEffect(() => {
        if (geoLoading) return
        let cancelled = false
        void resolvePricing(countryCode).then((result) => {
            if (!cancelled) setResolved(result)
        })
        return () => {
            cancelled = true
        }
    }, [geoLoading, countryCode])

    return {
        tier: resolved?.tier ?? getPricingTier(countryCode ?? ''),
        source: resolved?.source ?? 'fallback',
        loading: geoLoading || resolved === null,
        countryCode,
    }
}
