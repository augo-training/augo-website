// Ingests a single Substack post URL into the website's blog content.
//
// Usage:
//   npm run ingest-substack -- <substack-post-url>
//   npm run ingest-substack:all   (backfill from RSS)
//
// Direct execution:
//   node scripts/ingest-substack-post.ts <substack-post-url>
//   node scripts/ingest-substack-post.ts --all
//
// Output:
//   - src/content/blog/<slug>.json         (post data + cleaned HTML body)
//   - public/blog/<slug>/<hash>.<ext>      (downloaded images)
//
// Pipeline:
//   1. Try the RSS feed for clean <content:encoded> + metadata.
//   2. Fall back to scraping the post URL directly (for older posts not in feed).
//   3. Parse with cheerio, strip Substack widgets/subscribe CTAs/tracking pixels.
//   4. Detect <img>/<picture>/<source> elements, download to /public/blog/<slug>/,
//      rewrite src to local paths.
//   5. Write JSON file. The build pipeline picks it up via import.meta.glob.

import * as cheerio from 'cheerio'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { createHash } from 'node:crypto'
import { pathToFileURL } from 'node:url'
import { ROOT } from './routes.ts'

const SUBSTACK_HOST = 'augotraining.substack.com'
const SUBSTACK_FEED = `https://${SUBSTACK_HOST}/feed`

// ── URL & slug helpers ──────────────────────────────────────────────────────

function slugFromUrl(url: string): string {
  const match = url.match(/\/p\/([^/?#]+)/)
  if (!match) throw new Error(`Cannot extract slug from URL: ${url}`)
  return match[1]
}

function hashFilename(url: string, fallbackExt = '.jpg'): string {
  const hash = createHash('sha1').update(url).digest('hex').slice(0, 12)
  const match = url.match(/\.(jpe?g|png|gif|webp|avif)(\?|$|\/)/i)
  const ext = match ? `.${match[1].toLowerCase().replace('jpeg', 'jpg')}` : fallbackExt
  return `${hash}${ext}`
}

// ── Source fetchers ─────────────────────────────────────────────────────────

interface ScrapedPost {
  title: string
  link: string
  pubDate: string
  author: string
  contentHtml: string
  description: string
}

interface MediaItem {
  localPath: string
  originalUrl: string
  filename: string
}

async function fetchPostFromFeed(targetUrl: string): Promise<ScrapedPost | null> {
  const res = await fetch(SUBSTACK_FEED)
  if (!res.ok) throw new Error(`Feed fetch failed: ${res.status}`)
  const xml = await res.text()
  const $ = cheerio.load(xml, { xmlMode: true })

  let found = null
  $('item').each((_, el) => {
    const link = $(el).find('link').first().text().trim()
    if (link === targetUrl || link === targetUrl.replace(/\/$/, '')) {
      found = {
        title: $(el).find('title').first().text().trim(),
        link,
        pubDate: $(el).find('pubDate').first().text().trim(),
        author: $(el).find('dc\\:creator').first().text().trim() || 'augo',
        contentHtml: $(el).find('content\\:encoded').first().text(),
        description: $(el).find('description').first().text().trim(),
      }
      return false
    }
  })
  return found
}

async function fetchPostFromUrl(url: string): Promise<ScrapedPost> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'augo-website-ingester/1.0' },
  })
  if (!res.ok) throw new Error(`URL fetch failed: ${res.status}`)
  const html = await res.text()
  const $ = cheerio.load(html)

  const title =
    $('h1.post-title').first().text().trim() ||
    $('meta[property="og:title"]').attr('content') ||
    ''
  const description =
    $('meta[name="description"]').attr('content') ||
    $('meta[property="og:description"]').attr('content') ||
    ''
  const author =
    $('meta[name="author"]').attr('content') ||
    $('a.frontend-pencraft-Text-module__color-action').first().text().trim() ||
    'augo'
  const pubDate =
    $('meta[property="article:published_time"]').attr('content') ||
    $('time').first().attr('datetime') ||
    new Date().toISOString()
  const contentHtml =
    $('.body.markup').first().html() ||
    $('div.available-content').first().html() ||
    $('article .single-post').first().html() ||
    ''
  return { title, link: url, pubDate, author, contentHtml, description }
}

async function listAllFeedItems(): Promise<string[]> {
  const res = await fetch(SUBSTACK_FEED)
  if (!res.ok) throw new Error(`Feed fetch failed: ${res.status}`)
  const xml = await res.text()
  const $ = cheerio.load(xml, { xmlMode: true })
  const items: string[] = []
  $('item').each((_, el) => {
    items.push($(el).find('link').first().text().trim())
  })
  return items
}

// ── Body cleaning ───────────────────────────────────────────────────────────

function stripSubstackWidgets($: cheerio.CheerioAPI): void {
  // Subscription / email capture widgets
  $('.subscription-widget-wrap, .subscription-widget, .subscribe-widget').remove()
  $('div[data-component-name="SubscribeWidget"]').remove()
  $('div[class*="subscribe"]').remove()

  // Button wrappers that are CTAs (Subscribe, Share, Leave a Comment)
  $('.button-wrapper, div[class*="button-wrapper"]').each((_, el) => {
    const text = $(el).text().toLowerCase()
    if (
      text.includes('subscribe') ||
      text.includes('share') ||
      text.includes('leave a comment') ||
      text.includes('comment')
    ) {
      $(el).remove()
    }
  })

  // Like / share / restack action rows
  $('a[href*="action=share"], a[href*="/comments"], a[href*="action=like"]').each((_, el) => {
    const $parent = $(el).closest('p, div')
    if ($parent.text().trim().length < 100) $parent.remove()
  })

  // 1x1 tracking pixels
  $('img[width="1"], img[height="1"]').remove()

  // Substack footer images / decorative gradient bars often appended at the bottom
  $('img[src*="substack-cdn-static"]').remove()

  // Empty paragraphs left over after cleanup
  $('p').each((_, el) => {
    if (!$(el).text().trim() && $(el).find('img, picture, iframe').length === 0) {
      $(el).remove()
    }
  })
}

function flattenPicturesAndRewriteImages(
  $: cheerio.CheerioAPI,
  slug: string,
  mediaToDownload: Map<string, MediaItem>
): void {
  // Convert <picture><source/><img/></picture> to a single <img/>
  $('picture').each((_, el) => {
    const $picture = $(el)
    const $img = $picture.find('img').first()
    if ($img.length) {
      $picture.replaceWith($img)
    } else {
      $picture.remove()
    }
  })

  // Drop srcset/sizes; use src only
  $('img').each((_, el) => {
    const $img = $(el)
    let src = $img.attr('src')
    if (!src && $img.attr('data-src')) src = $img.attr('data-src')
    if (!src) {
      $img.remove()
      return
    }
    if (src.startsWith('//')) src = `https:${src}`
    // Only rehost Substack/CDN-hosted images
    if (
      src.includes('substackcdn.com') ||
      src.includes('substack-post-media.s3') ||
      src.includes('substackcdn-img') ||
      src.includes('bucketeer-')
    ) {
      const filename = hashFilename(src)
      const localPath = `/blog/${slug}/${filename}`
      if (!mediaToDownload.has(src)) {
        mediaToDownload.set(src, { localPath, originalUrl: src, filename })
      }
      $img.attr('src', localPath)
    }
    $img.removeAttr('srcset')
    $img.removeAttr('sizes')
    $img.removeAttr('data-src')
    if (!$img.attr('alt')) $img.attr('alt', '')
    if (!$img.attr('loading')) $img.attr('loading', 'lazy')
    if (!$img.attr('decoding')) $img.attr('decoding', 'async')
  })

  // Strip leftover <source> tags
  $('source').remove()
}

// ── Image download ──────────────────────────────────────────────────────────

async function downloadMedia(mediaMap: Map<string, MediaItem>, slug: string): Promise<void> {
  if (mediaMap.size === 0) return
  const outDir = join(ROOT, 'public/blog', slug)
  await mkdir(outDir, { recursive: true })
  for (const [, { originalUrl, filename }] of mediaMap) {
    try {
      const res = await fetch(originalUrl, {
        headers: { 'User-Agent': 'augo-website-ingester/1.0' },
      })
      if (!res.ok) {
        console.warn(`  ! image ${res.status}: ${originalUrl}`)
        continue
      }
      const buf = Buffer.from(await res.arrayBuffer())
      await writeFile(join(outDir, filename), buf)
      console.log(`  ↓ ${filename} (${(buf.byteLength / 1024).toFixed(1)} kB)`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.warn(`  ! image error ${originalUrl}: ${message}`)
    }
  }
}

// ── Output ──────────────────────────────────────────────────────────────────

function deriveDescription(rawDescription: string, $cleaned: cheerio.CheerioAPI): string {
  const stripped = rawDescription.replace(/<[^>]+>/g, '').trim()
  // Substack descriptions often end with "By <Author>, <role>..." — drop the
  // byline for the meta description so it's clean lede text only.
  const withoutByline = stripped.replace(/\s*By\s+[A-Z][^.]*\.?\s*$/, '').trim()
  if (withoutByline.length > 40) return withoutByline.slice(0, 200).trim()
  if (stripped.length > 40) return stripped.slice(0, 200).trim()
  const firstP = $cleaned('p').first().text().trim()
  return firstP.slice(0, 200).trim()
}

// Substack's <dc:creator> is the publication name ("augo"), not the byline.
// Author resolution order:
//   1. Parse Article JSON-LD from the post page (most reliable, Substack writes
//      author.name there for every post).
//   2. Fall back to "By <Name>" pattern in the RSS description.
//   3. Fall back to "About the Author: <Name>" pattern.
//   4. Default to "augo".

function extractAuthorFromHtml(html: string): string | null {
  const PUBLICATION_NAMES = new Set(['augo', "augo's substack", 'augo training'])
  function pickRealAuthor(author: unknown): string | null {
    if (!author) return null
    if (typeof author === 'string') {
      return PUBLICATION_NAMES.has(author.toLowerCase()) ? null : author
    }
    if (Array.isArray(author)) {
      // Substack lists [publication, ...real authors]. Pick the first that
      // isn't the publication.
      for (const entry of author) {
        const name = typeof entry === 'string' ? entry : entry?.name
        if (name && !PUBLICATION_NAMES.has(name.toLowerCase())) return name
      }
      // No non-publication author found.
      return null
    }
    if (
      typeof author === 'object' &&
      author !== null &&
      'name' in author &&
      typeof author.name === 'string'
    ) {
      return PUBLICATION_NAMES.has(author.name.toLowerCase()) ? null : author.name
    }
    return null
  }

  try {
    const $ = cheerio.load(html)
    const scripts = $('script[type="application/ld+json"]')
    for (let i = 0; i < scripts.length; i++) {
      const raw = $(scripts[i]).contents().text()
      if (!raw) continue
      let parsed
      try {
        parsed = JSON.parse(raw)
      } catch {
        continue
      }
      const candidates = Array.isArray(parsed) ? parsed : [parsed]
      for (const node of candidates) {
        if (node?.['@type'] === 'NewsArticle' || node?.['@type'] === 'Article') {
          const picked = pickRealAuthor(node.author)
          if (picked) return picked
        }
      }
    }
  } catch {
    // fall through
  }
  return null
}

// Strip trailing credentials like ", PhD" or ", MD" from a name.
function cleanName(name: string): string {
  return name
    .replace(/,\s*(PhD|MD|MS|MSc|DPT|RD|MA|MBA|PT|RN)\b.*$/i, '')
    .replace(/\s+\(.*\)\s*$/, '')
    .trim()
}

function extractAuthorFromDescription(rawDescription: string): string | null {
  const stripped = rawDescription.replace(/<[^>]+>/g, '').trim()
  // No /i flag anywhere — we rely on [A-Z] vs [a-z] character classes.
  // "By Firstname Lastname" — name parts must start uppercase, body lowercase.
  const m1 = stripped.match(/\bBy\s+([A-ZÀ-Ý][a-zà-ÿ]+(?:\s+[A-ZÀ-Ý][a-zà-ÿ]+){0,3})/)
  if (m1) return cleanName(m1[1])
  // "About the Author: Firstname Lastname"
  const m2 = stripped.match(/About the Author:\s+([A-ZÀ-Ý][a-zà-ÿ]+(?:\s+[A-ZÀ-Ý][a-zà-ÿ]+){0,3})/)
  if (m2) return cleanName(m2[1])
  // Description starts with "Firstname Lastname, <credentials>"
  const m3 = stripped.match(/^([A-ZÀ-Ý][a-zà-ÿ]+(?:\s+[A-ZÀ-Ý][a-zà-ÿ]+){0,2}),\s+(?:PhD|MD|MS|DPT|RD|Coach|Doctor|Former|Partner|Pro)/)
  if (m3) return cleanName(m3[1])
  return null
}

async function resolveAuthor(url: string, rawDescription: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'augo-website-ingester/1.0' },
    })
    if (res.ok) {
      const html = await res.text()
      const fromLd = extractAuthorFromHtml(html)
      if (fromLd && fromLd.toLowerCase() !== 'augo') return cleanName(fromLd)
    }
  } catch {
    // network failure → fall back to description
  }
  return extractAuthorFromDescription(rawDescription) || 'augo'
}

async function ingest(url: string): Promise<string> {
  const slug = slugFromUrl(url)
  console.log(`\nIngesting ${url}\n  slug=${slug}`)

  let post = await fetchPostFromFeed(url)
  if (!post) {
    console.log('  (not in feed — scraping post page)')
    post = await fetchPostFromUrl(url)
  }
  if (!post.contentHtml) {
    throw new Error(`No content extracted from ${url}`)
  }

  const $body = cheerio.load(post.contentHtml, null, false)
  stripSubstackWidgets($body)
  const mediaToDownload = new Map<string, MediaItem>()
  flattenPicturesAndRewriteImages($body, slug, mediaToDownload)

  await downloadMedia(mediaToDownload, slug)

  // First image after cleanup = cover image. Remove its wrapping figure
  // from the body so it isn't rendered twice (once as hero, once inline).
  const firstImg = $body('img').first()
  const firstImgSrc = firstImg.attr('src') || null
  if (firstImg.length) {
    const wrapper = firstImg.closest('figure, .captioned-image-container')
    if (wrapper.length) wrapper.remove()
    else firstImg.remove()
  }

  const authorName = await resolveAuthor(url, post.description)

  const data = {
    slug,
    title: post.title,
    description: deriveDescription(post.description, $body),
    author: { name: authorName, url },
    datePublished: new Date(post.pubDate).toISOString(),
    dateModified: new Date(post.pubDate).toISOString(),
    coverImage: firstImgSrc,
    bodyHtml: $body.html(),
    substackUrl: url,
    tags: [],
  }

  const outFile = join(ROOT, 'src/content/blog', `${slug}.json`)
  await mkdir(join(ROOT, 'src/content/blog'), { recursive: true })
  await writeFile(outFile, JSON.stringify(data, null, 2) + '\n', 'utf8')
  console.log(`  ✓ wrote ${outFile}`)
  return slug
}

// ── Entry ───────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const arg = process.argv[2]
  if (!arg) {
    console.error('Usage: npm run ingest-substack -- <url> | npm run ingest-substack:all')
    process.exit(1)
  }

  if (arg === '--all') {
    const urls = await listAllFeedItems()
    console.log(`Found ${urls.length} posts in feed`)
    for (const url of urls) {
      try {
        await ingest(url)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err)
        console.error(`  ✗ ${url}: ${message}`)
      }
    }
    return
  }

  await ingest(arg)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err: unknown) => {
    console.error(err)
    process.exit(1)
  })
}
