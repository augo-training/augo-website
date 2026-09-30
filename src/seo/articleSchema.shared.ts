import { BASE_URL } from './seoConstants.ts'

const DEFAULT_ARTICLE_IMAGE = `${BASE_URL}/og-image.jpg`

export interface ArticleSchemaInput {
  slug: string
  title: string
  description: string
  authorName: string
  authorUrl?: string
  datePublished: string
  dateModified?: string
  coverImage?: string
  substackUrl?: string
  publisherLogoUrl?: string
}

export interface FaqItem {
  question: string
  answer: string
}

export function buildFaqSchema(faqs: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }
}

export interface VideoSchemaInput {
  /** YouTube video id. */
  id: string
  name: string
  description: string
  /** Site-relative or absolute poster URL. */
  thumbnail: string
  uploadDate: string
  durationSeconds?: number
}

function toIsoDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}${s || (!h && !m) ? `${s}S` : ''}`
}

export function buildVideoSchema(input: VideoSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: input.name,
    description: input.description,
    thumbnailUrl: input.thumbnail.startsWith('http')
      ? input.thumbnail
      : `${BASE_URL}${input.thumbnail}`,
    uploadDate: input.uploadDate,
    contentUrl: `https://www.youtube.com/watch?v=${input.id}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${input.id}`,
    ...(input.durationSeconds != null
      ? { duration: toIsoDuration(input.durationSeconds) }
      : {}),
  }
}

export function buildArticleSchema(input: ArticleSchemaInput) {
  const url = `${BASE_URL}/en/blog/${input.slug}`
  const image = input.coverImage
    ? input.coverImage.startsWith('http')
      ? input.coverImage
      : `${BASE_URL}${input.coverImage}`
    : DEFAULT_ARTICLE_IMAGE

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    image,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: {
      '@type': 'Person',
      name: input.authorName,
      ...(input.authorUrl ? { url: input.authorUrl } : {}),
    },
    publisher: {
      '@type': 'Organization',
      name: 'augo',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: input.publisherLogoUrl ?? DEFAULT_ARTICLE_IMAGE,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    url,
    inLanguage: 'en',
  }
}
