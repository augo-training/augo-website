import { describe, expect, it } from 'vitest'
import { sanitizeBlogHtml } from '../src/utils/blogHtmlSanitizer'

describe('sanitizeBlogHtml', () => {
  it('strips dangerous markup on the server path', () => {
    const dirtyHtml = [
      '<p>Hello</p>',
      '<img src="/ok.jpg" onerror="alert(1)">',
      '<script>alert(1)</script>',
      '<iframe src="https://evil.example/embed"></iframe>',
      '<form action="/steal"><input name="email"></form>',
    ].join('')

    const sanitized = sanitizeBlogHtml(dirtyHtml)

    expect(sanitized).toMatch(/<p>Hello<\/p>/)
    expect(sanitized).toMatch(/<img src="\/ok\.jpg">/)
    expect(sanitized).not.toMatch(/<script/i)
    expect(sanitized).not.toMatch(/<iframe/i)
    expect(sanitized).not.toMatch(/<form/i)
    expect(sanitized).not.toMatch(/\sonerror=/i)
  })
})
