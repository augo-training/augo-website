import { Trans, useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { useGeoCountry } from '../hooks/useGeoCountry'
import { getPricingTier } from '../config/pricingConfig'

interface LaunchOfferPillProps {
    className?: string
}

export default function LaunchOfferPill({ className = '' }: LaunchOfferPillProps) {
    const { i18n } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()
    const { countryCode, loading } = useGeoCountry()

    if (loading || !countryCode) return null

    const tier = getPricingTier(countryCode)
    const formattedPrice = `${tier.symbol}${tier.price}`
    const langMatch = location.pathname.match(/^\/(en|de|pt)(\/|$)/)
    const targetLang = langMatch?.[1] ?? i18n.language ?? 'en'

    return (
        <button
            type="button"
            onClick={() => navigate(`/${targetLang}/pricing`)}
            className={`launch-offer-pill group inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 cursor-pointer transition-all duration-200 hover:brightness-125 ${className}`}
            style={{
                background: 'rgba(255, 85, 20, 0.08)',
                border: '1px solid rgba(255, 202, 30, 0.28)',
            }}
            aria-label="View launch pricing"
        >
            <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{
                    background: 'linear-gradient(83.9deg, #C50017 0%, #FF5514 55%, #FFCA1E 100%)',
                    boxShadow: '0 0 8px rgba(255, 138, 30, 0.6)',
                }}
            />
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[1.5px] uppercase text-white/80 group-hover:text-white transition-colors duration-200 leading-none">
                <Trans
                    i18nKey="launchOffer.text"
                    values={{ price: formattedPrice }}
                    components={{
                        1: (
                            <span
                                className="font-bold"
                                style={{
                                    background: 'linear-gradient(83.9deg, #FF5514 0%, #FFCA1E 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            />
                        ),
                    }}
                />
            </span>
        </button>
    )
}
