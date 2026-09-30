import { describe, expect, it } from 'vitest'
import { buildArticleSchema, buildVideoSchema } from '../src/seo/articleSchema.shared'

describe('buildVideoSchema', () => {
  it('emits an absolute thumbnail, YouTube URLs and an ISO 8601 duration', () => {
    const schema = buildVideoSchema({
      id: 'abc123XYZ_-',
      name: 'Example video',
      description: 'Example description',
      thumbnail: '/blog/example-post/cover.jpg',
      uploadDate: '2026-09-30T10:00:00.000Z',
      durationSeconds: 754,
    })

    expect(schema['@type']).toBe('VideoObject')
    expect(schema.thumbnailUrl).toBe('https://www.augotraining.com/blog/example-post/cover.jpg')
    expect(schema.contentUrl).toBe('https://www.youtube.com/watch?v=abc123XYZ_-')
    expect(schema.embedUrl).toBe('https://www.youtube-nocookie.com/embed/abc123XYZ_-')
    expect(schema.duration).toBe('PT12M34S')
  })

  it('omits duration when it is not known', () => {
    const schema = buildVideoSchema({
      id: 'abc123XYZ_-',
      name: 'Example video',
      description: 'Example description',
      thumbnail: '/blog/example-post/cover.jpg',
      uploadDate: '2026-09-30T10:00:00.000Z',
    })

    expect(schema).not.toHaveProperty('duration')
  })
})

describe('buildArticleSchema', () => {
  it('emits deployed absolute URLs for logo and images', () => {
    const schema = buildArticleSchema({
      slug: 'example-post',
      title: 'Example',
      description: 'Example description',
      authorName: 'Author Name',
      datePublished: '2026-05-13T10:00:00.000Z',
      coverImage: '/blog/example-post/cover.jpg',
      publisherLogoUrl: 'https://www.augotraining.com/assets/augo_footer_1.abc123.svg',
    })

    expect(schema.url).toBe('https://www.augotraining.com/en/blog/example-post')
    expect(schema.image).toBe('https://www.augotraining.com/blog/example-post/cover.jpg')
    expect(schema.publisher.logo.url).toBe(
      'https://www.augotraining.com/assets/augo_footer_1.abc123.svg'
    )
    expect(schema.publisher.logo.url).toMatch(/^https:\/\/www\.augotraining\.com\//)
  })
})
