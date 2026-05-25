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
