import { useMemo } from 'react'
import { sanitizeBlogHtml } from '../../utils/blogHtmlSanitizer'
import type { SupportBlock, SupportMedia } from '../../utils/supportTypes'
import SupportImage from './SupportImage'
import SupportVideo from './SupportVideo'

interface Props {
  blocks: SupportBlock[]
  slug: string
}

function Media({ media, slug }: { media: SupportMedia; slug: string }) {
  return media.type === 'image' ? (
    <SupportImage media={media} />
  ) : (
    <SupportVideo media={media} slug={slug} />
  )
}

function HtmlBlock({ html }: { html: string }) {
  const sanitized = useMemo(() => sanitizeBlogHtml(html), [html])
  return <div className="support-prose" dangerouslySetInnerHTML={{ __html: sanitized }} />
}

/**
 * Renders an article body from its block list.
 *
 * The body is a block array rather than one HTML string specifically so media can
 * be React components sitting *between* sanitized HTML runs. That's what lets a
 * video embed exist on a page whose prose pipeline forbids iframes.
 */
export default function SupportBody({ blocks, slug }: Props) {
  return (
    <>
      {blocks.map((block, i) => {
        if (block.type === 'html') {
          return <HtmlBlock key={i} html={block.html} />
        }

        if (block.type === 'media') {
          return <Media key={i} media={block.media} slug={slug} />
        }

        return (
          <section key={i} className="support-steps-section">
            {block.heading && (
              <h2 id={`steps-${i}`} className="support-steps-heading">
                {block.heading}
              </h2>
            )}
            <ol className="support-steps">
              {block.steps.map((step, s) => (
                <li key={s} id={`step-${i}-${s + 1}`}>
                  <h3 className="support-step-title">{step.title}</h3>
                  <HtmlBlock html={step.html} />
                  {step.media && <Media media={step.media} slug={slug} />}
                </li>
              ))}
            </ol>
          </section>
        )
      })}
    </>
  )
}
