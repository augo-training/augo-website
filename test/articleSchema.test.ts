import { describe, expect, it } from 'vitest'
import { buildArticleSchema } from '../src/seo/articleSchema.shared'

describe('buildArticleSchema', () => {
  it('emits deployed absolute URLs for logo and images', () => {
    const schema = buildArticleSchema({
      slug: 'example-post',
      title: 'Example',
      description: 'Example description',
      authorName: 'Author Name',
      datePublished: '2026-05-13T10:00:00.000Z',
      coverImage: '/blog/example-post/cover.jpg',
      publisherLogoUrl: 'https://augotraining.com/assets/augo_footer_1.abc123.svg',
    })

    expect(schema.url).toBe('https://augotraining.com/en/blog/example-post')
    expect(schema.image).toBe('https://augotraining.com/blog/example-post/cover.jpg')
    expect(schema.publisher.logo.url).toBe(
      'https://augotraining.com/assets/augo_footer_1.abc123.svg'
    )
    expect(schema.publisher.logo.url).toMatch(/^https:\/\/augotraining\.com\//)
  })
})
