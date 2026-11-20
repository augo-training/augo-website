import { readFileSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { imagetools } from 'vite-imagetools'

// Publishes src/content/legal/<slug>.md unchanged as /<slug>.md, next to the
// rendered /en/<slug>/ page, so agents can fetch the plain text directly.
// Keep the list in sync with LEGAL_SLUGS in src/utils/legal.ts.
const LEGAL_SLUGS = ['privacy', 'terms']
const legalSource = (slug: string) =>
  readFileSync(new URL(`./src/content/legal/${slug}.md`, import.meta.url), 'utf8')

function legalMarkdownPlugin(): Plugin {
  return {
    name: 'legal-markdown',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const slug = req.url?.match(/^\/(\w+)\.md$/)?.[1]
        if (!slug || !LEGAL_SLUGS.includes(slug)) return next()
        res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
        res.end(legalSource(slug))
      })
    },
    generateBundle() {
      for (const slug of LEGAL_SLUGS) {
        this.emitFile({ type: 'asset', fileName: `${slug}.md`, source: legalSource(slug) })
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), imagetools(), legalMarkdownPlugin()],
  server: {
    host: '0.0.0.0',
  },
})
