import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, Navigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEOHead from '../seo/SEOHead'
import { OrganizationJsonLd } from '../seo/JsonLd'
import { buildArticleSchema } from '../seo/articleSchema'
import { buildFaqSchema } from '../seo/articleSchema.shared'
import NotFound from './NotFound'
import { sanitizeBlogHtml } from '../utils/blogHtmlSanitizer.ts'
import {
  formatPostDate,
  getAdjacentPosts,
  postsBySlug,
} from '../utils/blogPosts'

export default function BlogPost() {
  const { lang, slug } = useParams<{ lang: string; slug: string }>()
  const post = slug ? postsBySlug[slug] : undefined

  const sanitizedBody = useMemo(() => {
    if (!post) return ''
    return sanitizeBlogHtml(post.bodyHtml)
  }, [post])

  // English-only at launch. Redirect /de/blog/* and /pt/blog/* to /en/blog/*.
  if (lang && lang !== 'en' && slug) {
    return <Navigate to={`/en/blog/${slug}`} replace />
  }

  if (!post) {
    return <NotFound />
  }

  const { newer, older } = getAdjacentPosts(post.slug)

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
        {post.faqs && post.faqs.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify(buildFaqSchema(post.faqs))}
          </script>
        )}
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
            <time dateTime={post.datePublished}>{formatPostDate(post.datePublished)}</time>
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

        <nav
          aria-label="More blog posts"
          className="mt-16 pt-8 border-t border-dark-600 flex flex-col gap-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {newer ? (
              <Link
                to={`/en/blog/${newer.slug}`}
                className="group flex flex-col gap-2 sm:text-left"
              >
                <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-text-muted">
                  ← Newer post
                </span>
                <span className="font-satoshi font-bold text-[18px] sm:text-[20px] leading-[130%] text-white group-hover:underline">
                  {newer.title}
                </span>
              </Link>
            ) : (
              <span aria-hidden className="hidden sm:block" />
            )}
            {older ? (
              <Link
                to={`/en/blog/${older.slug}`}
                className="group flex flex-col gap-2 sm:text-right sm:items-end"
              >
                <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-text-muted">
                  Older post →
                </span>
                <span className="font-satoshi font-bold text-[18px] sm:text-[20px] leading-[130%] text-white group-hover:underline">
                  {older.title}
                </span>
              </Link>
            ) : (
              <span aria-hidden className="hidden sm:block" />
            )}
          </div>
          <div className="text-center">
            <Link
              to="/en/blog"
              className="font-satoshi text-[14px] sm:text-[15px] text-text-muted hover:text-white underline-offset-4 hover:underline"
            >
              View all posts
            </Link>
          </div>
        </nav>
      </article>
      <Footer />
    </>
  )
}
