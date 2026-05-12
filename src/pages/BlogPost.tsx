import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Navigate, useParams } from 'react-router-dom'
import DOMPurify from 'dompurify'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEOHead from '../seo/SEOHead'
import { OrganizationJsonLd } from '../seo/JsonLd'
import { buildArticleSchema } from '../seo/articleSchema'
import NotFound from './NotFound'

interface BlogPostData {
  slug: string
  title: string
  description: string
  author: { name: string; url?: string }
  datePublished: string
  dateModified?: string
  coverImage?: string
  bodyHtml: string
  substackUrl?: string
  tags?: string[]
}

// Vite eager-loads every JSON file in src/content/blog/ at build time, so the
// prerender step (and runtime) both have synchronous access to the post data.
const postModules = import.meta.glob<{ default: BlogPostData }>(
  '../content/blog/*.json',
  { eager: true }
)

const postsBySlug: Record<string, BlogPostData> = Object.fromEntries(
  Object.entries(postModules).map(([path, mod]) => {
    const slug = path.split('/').pop()!.replace(/\.json$/, '')
    return [slug, mod.default]
  })
)

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return iso
  }
}

export default function BlogPost() {
  const { lang, slug } = useParams<{ lang: string; slug: string }>()
  const post = slug ? postsBySlug[slug] : undefined

  const sanitizedBody = useMemo(() => {
    if (!post) return ''
    if (typeof window === 'undefined') return post.bodyHtml
    return DOMPurify.sanitize(post.bodyHtml, {
      ADD_TAGS: ['picture', 'source', 'figure', 'figcaption'],
      ADD_ATTR: ['srcset', 'sizes', 'loading', 'decoding'],
      FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick'],
    })
  }, [post])

  // English-only at launch. Redirect /de/blog/* and /pt/blog/* to /en/blog/*.
  if (lang && lang !== 'en' && slug) {
    return <Navigate to={`/en/blog/${slug}`} replace />
  }

  if (!post) {
    return <NotFound />
  }

  const articleSchema = buildArticleSchema({
    slug: post.slug,
    title: post.title,
    description: post.description,
    authorName: post.author.name,
    authorUrl: post.author.url,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    coverImage: post.coverImage,
  })

  return (
    <>
      <SEOHead
        path={`/blog/${post.slug}`}
        title={`${post.title} | augo`}
        description={post.description}
        ogImagePath={post.coverImage}
        ogType="article"
        articleMeta={{
          publishedTime: post.datePublished,
          modifiedTime: post.dateModified,
          author: post.author.name,
          tags: post.tags,
        }}
        canonicalOverride={`https://augotraining.com/en/blog/${post.slug}`}
        noAlternates
      />
      <OrganizationJsonLd />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>
      <Navbar />
      <article className="blog-post mx-auto max-w-[760px] px-6 pt-32 pb-24 text-white">
        <header className="mb-12">
          <h1 className="font-satoshi font-bold text-[40px] sm:text-[48px] md:text-[56px] leading-[110%] tracking-[-0.02em] mb-6">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-text-muted text-sm">
            <span>By {post.author.name}</span>
            <span aria-hidden>·</span>
            <time dateTime={post.datePublished}>{formatDate(post.datePublished)}</time>
          </div>
        </header>

        {post.coverImage && (
          <img
            src={post.coverImage}
            alt=""
            className="w-full rounded-2xl mb-12"
            loading="eager"
          />
        )}

        <div
          className="blog-prose"
          dangerouslySetInnerHTML={{ __html: sanitizedBody }}
        />

        {post.substackUrl && (
          <footer className="mt-16 pt-8 border-t border-dark-600 text-text-muted text-sm">
            Originally published on{' '}
            <a
              href={post.substackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white"
            >
              augo's Substack
            </a>
            .
          </footer>
        )}
      </article>
      <Footer />
    </>
  )
}
