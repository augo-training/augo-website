# augo website

Marketing site and blog for augo, built with React, TypeScript, and Vite.

## Local development

Requirements:

- Node.js 22.18+
- npm

Install dependencies:

```sh
npm ci
```

Start the dev server:

```sh
npm run dev
```

Useful commands:

- `npm run build` builds the site, generates the sitemap, and prerenders routes with Puppeteer.
- `npm run prerender` reruns the prerender step against an existing build.
- `npm run sitemap` regenerates the sitemap.
- `npm run lint` runs ESLint.

## Build and deploy

`npm run build` is the production build path used in CI and deploy workflows. It performs these steps:

1. TypeScript build
2. Vite build
3. Sitemap generation
4. Route prerendering with Puppeteer

During prerendering, the script also preserves the original SPA shell as `dist/404.html` for GitHub Pages fallback routing.

## Blog content workflow

Blog posts are sourced from Substack and stored in the repo as:

- `src/content/blog/*.json` for post metadata and cleaned HTML
- `public/blog/**` for downloaded image assets

### Automatic sync

[`.github/workflows/sync-substack.yml`](/Users/ahermann/Workspaces/augo/augo-website/.github/workflows/sync-substack.yml:1) supports two triggers:

- `repository_dispatch` with `event_type=substack-post`
  The intended caller is Make.com when a new item appears in the augotraining Substack RSS feed.
- `workflow_dispatch`
  Manual trigger from GitHub Actions for a single post URL or a full RSS backfill.

The workflow:

1. Checks out the repo and installs dependencies with `npm ci`
2. Runs `npm run ingest-substack -- <url>` or `npm run ingest-substack:all`
3. Detects changes under `src/content/blog/` and `public/blog/`
4. Opens a pull request with the generated content

Review the generated PR before merging. In particular, check:

- author attribution
- cleaned article HTML
- downloaded images under `public/blog/`

### Manual local sync

Ingest a single post:

```sh
npm run ingest-substack -- <substack-post-url>
```

Backfill all current feed items:

```sh
npm run ingest-substack:all
```

After ingesting content locally:

1. Review the JSON added under `src/content/blog/`
2. Review downloaded assets under `public/blog/`
3. Run `npm run build` to verify the post renders and prerenders correctly

## Notes

- Blog pages are currently English-only. Non-English blog routes redirect to `/en/blog/:slug`.
- Imported blog HTML is sanitized before rendering in the app. Keep that protection intact when changing the blog pipeline.
