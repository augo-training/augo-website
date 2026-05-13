// Postbuild: spin up a vite preview server, walk every known route with
// Puppeteer, and write the fully-rendered HTML to dist/<route>/index.html.
//
// Why: the site is a Vite + React SPA. Without prerendering, the initial HTML
// is an empty <div id="root">. AI answer engines (Perplexity, ChatGPT, Bing)
// generally don't execute JS, so they see no content. Prerendering fixes that
// without migrating off Vite.

import { preview } from 'vite'
import puppeteer, { type Browser } from 'puppeteer'
import { writeFile, mkdir, copyFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { getAllPrerenderRoutes, ROOT, DEFAULT_LANG } from './routes.ts'

const HELMET_READY_SELECTOR = 'link[rel="canonical"]'
const PAGE_TIMEOUT_MS = 30_000
const MAX_ATTEMPTS = 3
const INTER_ROUTE_DELAY_MS = 150

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function prerenderRouteOnce(
  browser: Browser,
  baseUrl: string,
  route: string
): Promise<string> {
  const page = await browser.newPage()
  try {
    page.setDefaultTimeout(PAGE_TIMEOUT_MS)
    await page.setViewport({ width: 1280, height: 800 })

    const targetUrl = `${baseUrl.replace(/\/$/, '')}${route}`
    await page.goto(targetUrl, { waitUntil: 'networkidle0' })

    // react-helmet-async injects <link rel="canonical"> after React mounts.
    // Wait for that signal before snapshotting.
    try {
      await page.waitForSelector(HELMET_READY_SELECTOR, { timeout: PAGE_TIMEOUT_MS })
    } catch {
      console.warn(`    ⚠ no canonical link, snapshotting anyway`)
    }

    return await page.content()
  } finally {
    await page.close().catch(() => {})
  }
}

async function prerenderRoute(
  browser: Browser,
  baseUrl: string,
  route: string
): Promise<string> {
  let lastErr: unknown
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await prerenderRouteOnce(browser, baseUrl, route)
    } catch (err: unknown) {
      lastErr = err
      if (attempt < MAX_ATTEMPTS) {
        const backoff = 250 * attempt
        const message = err instanceof Error ? err.message : String(err)
        console.warn(`    retry ${attempt}/${MAX_ATTEMPTS - 1} after ${backoff}ms: ${message}`)
        await sleep(backoff)
      }
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr))
}

function outputPathFor(route: string): string {
  if (route === '/') return join(ROOT, 'dist', 'index.html')
  return join(ROOT, 'dist', route.replace(/^\//, ''), 'index.html')
}

async function main() {
  const routes = await getAllPrerenderRoutes()
  console.log(`Prerendering ${routes.length} routes…`)

  // Preserve the original (un-prerendered) dist/index.html as dist/404.html.
  // GitHub Pages serves 404.html for any unknown URL; using the SPA shell here
  // (rather than a prerendered page) avoids flashing the home page before
  // React routes to the actual NotFound view.
  try {
    await copyFile(join(ROOT, 'dist', 'index.html'), join(ROOT, 'dist', '404.html'))
    console.log('  ✓ saved SPA shell as 404.html')
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.warn(`  ! could not save 404.html: ${message}`)
  }

  const previewServer = await preview({
    root: ROOT,
    preview: { port: 0, host: '127.0.0.1' },
  })

  const baseUrl = previewServer.resolvedUrls?.local?.[0]
  if (!baseUrl) throw new Error('Failed to start vite preview server')
  console.log(`  preview server: ${baseUrl}`)

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    for (const route of routes) {
      try {
        const html = await prerenderRoute(browser, baseUrl, route)
        const out = outputPathFor(route)
        await mkdir(dirname(out), { recursive: true })
        await writeFile(out, html, 'utf8')
        console.log(`  ✓ ${route}`)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err)
        console.error(`  ✗ ${route}: ${message}`)
        process.exitCode = 1
      }
      await sleep(INTER_ROUTE_DELAY_MS)
    }

    // Mirror the language-default route to dist/index.html so direct hits to /
    // serve a real, indexable page (the SPA still client-redirects on load).
    try {
      const html = await prerenderRoute(browser, baseUrl, `/${DEFAULT_LANG}`)
      await writeFile(join(ROOT, 'dist', 'index.html'), html, 'utf8')
      console.log(`  ✓ / (mirrors /${DEFAULT_LANG})`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.error(`  ✗ /: ${message}`)
      process.exitCode = 1
    }
  } finally {
    await browser.close()
    await new Promise((resolve) => previewServer.httpServer.close(resolve))
  }

  console.log('Prerender complete.')
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err: unknown) => {
    console.error(err)
    process.exit(1)
  })
}
