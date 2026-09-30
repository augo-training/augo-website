import type { SupportVideoMedia } from '../../utils/supportTypes'
import { trackSupportVideoPlayed } from '../../utils/analytics'
import VideoFacade from '../VideoFacade'

interface Props {
  media: SupportVideoMedia
  slug: string
}

/** Support-article video block. The click-to-play behaviour lives in VideoFacade. */
export default function SupportVideo({ media, slug }: Props) {
  return (
    <VideoFacade
      provider={media.provider}
      id={media.id}
      poster={media.poster}
      alt={media.alt}
      caption={media.caption}
      durationSeconds={media.durationSeconds}
      onPlay={() => trackSupportVideoPlayed({ slug, provider: media.provider, id: media.id })}
    />
  )
}
