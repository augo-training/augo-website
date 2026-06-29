import { Trans, useTranslation } from 'react-i18next'
import { useGeoCountry } from '../hooks/useGeoCountry'
import { getPricingTier, getEarlyBirdDaysLeft } from '../config/pricingConfig'
import { useEmailCapture } from '../contexts/EmailCaptureContext'
import { trackCtaClicked } from '../utils/analytics'

interface LaunchOfferPillProps {
    className?: string
}

export default function LaunchOfferPill({ className = '' }: LaunchOfferPillProps) {
    const { t } = useTranslation()
    const { countryCode, loading } = useGeoCountry()
    const { openModal } = useEmailCapture()

    if (loading || !countryCode) return null

    const daysLeft = getEarlyBirdDaysLeft()
    if (daysLeft <= 0) return null

    const tier = getPricingTier(countryCode)
    const formattedPrice = `${tier.symbol}${tier.price}`

    return (
        <button
            type="button"
            onClick={() => {
                trackCtaClicked({ cta_text: t('nav.joinAugo'), cta_location: 'launch_offer_pill', destination: '/download' })
                openModal(t('nav.joinAugo'))
            }}
            className={`launch-offer-pill group inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 cursor-pointer transition-all duration-200 hover:brightness-125 ${className}`}
            style={{
                background: 'rgba(255, 85, 20, 0.08)',
                border: '1px solid rgba(255, 202, 30, 0.28)',
            }}
            aria-label="View early bird pricing"
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
                        1: <span className="font-bold" />,
                    }}
                />
                {' · '}
                {t('launchOffer.daysLeft', { count: daysLeft })}
            </span>
        </button>
    )
}
