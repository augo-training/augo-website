import { useState } from 'react'
import { Play } from 'lucide-react'
import type { SupportVideoMedia } from '../../utils/supportTypes'
import { trackSupportVideoPlayed } from '../../utils/analytics'

interface Props {
  media: SupportVideoMedia
  slug: string
}

function embedSrc(media: SupportVideoMedia): string {
  // youtube-nocookie keeps the privacy-preserving domain, which matters because the
  // iframe is injected on click and therefore sits outside the cookie-consent flow.
  return media.provider === 'youtube'
    ? `https://www.youtube-nocookie.com/embed/${media.id}?autoplay=1&rel=0`
    : `https://www.loom.com/embed/${media.id}?autoplay=1`
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

/**
 * Click-to-play video facade.
 *
 * The default state is a poster and a play button with no iframe in the DOM at
 * all, which is what the prerender pass captures. Nothing is requested from
 * YouTube or Loom until someone actually clicks — no third-party bytes, no
 * third-party cookies on load, and no dependency on cookie consent to read the
 * page.
 *
 * This is also why video is declared as structured data in the article JSON
 * rather than authored as HTML: blogHtmlSanitizer strips iframes, and its
 * server-side regex fallback only strips *paired* tags, so a hand-written embed
 * would be both blocked in the browser and unreliable at prerender time. Rendering
 * it as a component sidesteps the sanitizer entirely.
 */
export default function SupportVideo({ media, slug }: Props) {
  const [playing, setPlaying] = useState(false)

  return (
    <figure className="support-media">
      <div className="support-video">
        {playing ? (
          <iframe
            src={embedSrc(media)}
            title={media.alt}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="support-video-facade"
            aria-label={`Play video: ${media.alt}`}
            onClick={() => {
              setPlaying(true)
              trackSupportVideoPlayed({ slug, provider: media.provider, id: media.id })
            }}
          >
            <img src={media.poster} alt="" aria-hidden="true" loading="lazy" decoding="async" />
            <span className="support-video-play" aria-hidden="true">
              <Play size={22} fill="currentColor" />
            </span>
            {media.durationSeconds != null && (
              <span className="support-video-duration" aria-hidden="true">
                {formatDuration(media.durationSeconds)}
              </span>
            )}
          </button>
        )}
      </div>
      {media.caption && <figcaption>{media.caption}</figcaption>}
    </figure>
  )
}
