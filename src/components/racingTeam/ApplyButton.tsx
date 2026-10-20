import { RACING_TEAM_APPLY_URL, RACING_TEAM_CTA_TEXT, type RacingTeamCtaLocation } from './constants'
import { trackCtaClicked } from '../../utils/analytics'

interface ApplyButtonProps {
    location: RacingTeamCtaLocation
    label?: string
}

/**
 * The one CTA on the page. A real link to the Typeform, so it works in the
 * prerendered HTML without JS; the click handler only adds the Mixpanel event.
 */
export default function ApplyButton({ location, label = RACING_TEAM_CTA_TEXT }: ApplyButtonProps) {
    return (
        <a
            href={RACING_TEAM_APPLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
                void trackCtaClicked({
                    cta_text: label,
                    cta_location: location,
                    destination: RACING_TEAM_APPLY_URL,
                })
            }}
            className="btn-gradient self-start inline-flex items-center justify-center font-mono text-sm font-extrabold tracking-[2px] uppercase text-white rounded-lg hover:brightness-110 transition-all duration-200 no-underline"
            style={{ width: '209px', height: '48px' }}
        >
            {label}
        </a>
    )
}
