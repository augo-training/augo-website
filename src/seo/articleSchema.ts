import { BASE_URL } from './seoConfig'

export interface ArticleSchemaInput {
  slug: string
  title: string
  description: string
  authorName: string
  authorUrl?: string
  datePublished: string
  dateModified?: string
  coverImage?: string
  /** Substack URL if syndicated. Currently unused in schema (canonical points
   *  here, not Substack), but kept for potential future use. */
  substackUrl?: string
}

export function buildArticleSchema(input: ArticleSchemaInput) {
  const url = `${BASE_URL}/en/blog/${input.slug}`
  const image = input.coverImage
    ? input.coverImage.startsWith('http')
      ? input.coverImage
      : `${BASE_URL}${input.coverImage}`
    : `${BASE_URL}/og-image.jpg`

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
        url: `${BASE_URL}/assets/images/augo_footer_1.svg`,
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
