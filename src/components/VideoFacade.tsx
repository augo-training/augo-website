import { useState } from 'react'
import { Play } from 'lucide-react'

export type VideoProvider = 'youtube' | 'loom'

interface Props {
  provider: VideoProvider
  /** Provider video id — never a full URL. The component builds the embed src. */
  id: string
  /** Local poster. Required: it is what gets prerendered. */
  poster: string
  /** Accessible name for the play facade and the iframe title. */
  alt: string
  caption?: string
  durationSeconds?: number
  /** Set when the player is the first thing on the page, so the poster isn't lazy-loaded. */
  eagerPoster?: boolean
  className?: string
  onPlay?: () => void
}

function embedSrc(provider: VideoProvider, id: string): string {
  // youtube-nocookie keeps the privacy-preserving domain, which matters because the
  // iframe is injected on click and therefore sits outside the cookie-consent flow.
  return provider === 'youtube'
    ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
    : `https://www.loom.com/embed/${id}?autoplay=1`
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
 * This is also why video is declared as structured data in the content JSON
 * rather than authored as HTML: blogHtmlSanitizer strips iframes, and its
 * server-side regex fallback only strips *paired* tags, so a hand-written embed
 * would be both blocked in the browser and unreliable at prerender time. Rendering
 * it as a component sidesteps the sanitizer entirely.
 */
export default function VideoFacade({
  provider,
  id,
  poster,
  alt,
  caption,
  durationSeconds,
  eagerPoster = false,
  className = 'support-media',
  onPlay,
}: Props) {
  const [playing, setPlaying] = useState(false)

  return (
    <figure className={className}>
      <div className="support-video">
        {playing ? (
          <iframe
            src={embedSrc(provider, id)}
            title={alt}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="support-video-facade"
            aria-label={`Play video: ${alt}`}
            onClick={() => {
              setPlaying(true)
              onPlay?.()
            }}
          >
            <img
              src={poster}
              alt=""
              aria-hidden="true"
              loading={eagerPoster ? 'eager' : 'lazy'}
              decoding="async"
            />
            <span className="support-video-play" aria-hidden="true">
              <Play size={22} fill="currentColor" />
            </span>
            {durationSeconds != null && (
              <span className="support-video-duration" aria-hidden="true">
                {formatDuration(durationSeconds)}
              </span>
            )}
          </button>
        )}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
