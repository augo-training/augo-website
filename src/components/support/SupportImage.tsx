import type { SupportImageMedia } from '../../utils/supportTypes'

interface Props {
  media: SupportImageMedia
}

/**
 * Content images for support articles. Rendered as a React component rather than
 * inside the article HTML so figures stay consistent and the sanitizer never has
 * to be trusted with layout.
 *
 * Width and height are passed through when the author supplies them: without an
 * intrinsic ratio the browser can't reserve space, and a screenshot-heavy help
 * article turns into a column of layout shifts as it loads.
 */
export default function SupportImage({ media }: Props) {
  const { src, alt, caption, frame = 'wide', width, height } = media

  return (
    <figure className={`support-media ${frame === 'phone' ? 'support-media-phone' : ''}`}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
