import DOMPurify from 'dompurify'

const SANITIZE_OPTIONS = {
  ADD_TAGS: ['picture', 'source', 'figure', 'figcaption'],
  ADD_ATTR: ['srcset', 'sizes', 'loading', 'decoding'],
  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick'],
}

function sanitizeForServer(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<(iframe|object|embed|form)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/\s(onerror|onload|onclick)\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, '')
}

export function sanitizeBlogHtml(html: string): string {
  if (!html) return ''

  if (typeof (globalThis as { window?: unknown }).window === 'undefined') {
    return sanitizeForServer(html)
  }

  return DOMPurify.sanitize(html, SANITIZE_OPTIONS)
}
