import { Link, Navigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEOHead from '../seo/SEOHead'
import { OrganizationJsonLd } from '../seo/JsonLd'
import { allPostsSorted, formatPostDate } from '../utils/blogPosts'

export default function BlogIndex() {
  const { lang } = useParams<{ lang: string }>()

  if (lang && lang !== 'en') {
    return <Navigate to="/en/blog" replace />
  }

  return (
    <>
      <SEOHead
        path="/blog"
        title="Blog | augo"
        description="Essays from the augo team on coaching, endurance training, and building tools that respect both athletes and coaches."
        canonicalOverride="https://augotraining.com/en/blog"
        noAlternates
      />
      <OrganizationJsonLd />
      <Navbar />
      <main className="mx-auto max-w-[760px] px-6 pt-32 pb-24 text-white">
        <header className="mb-16">
          <h1 className="font-satoshi font-bold text-[40px] sm:text-[48px] md:text-[56px] leading-[110%] tracking-[-0.02em] mb-4">
            The augo blog
          </h1>
          <p className="font-satoshi text-[16px] sm:text-[18px] leading-[150%] text-text-muted">
            Essays on coaching, endurance training, technology, human connection, and pushing the boundaries of what's possible.
          </p>
        </header>

        <ul className="flex flex-col divide-y divide-dark-600">
          {allPostsSorted.map((post) => (
            <li key={post.slug} className="py-8 first:pt-0 last:pb-0">
              <Link
                to={`/en/blog/${post.slug}`}
                className="group flex flex-col sm:flex-row gap-5 sm:gap-6"
              >
                {post.coverImage && (
                  <div className="sm:flex-shrink-0 sm:w-60">
                    <img
                      src={post.coverImage}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="w-full aspect-[3/2] object-cover rounded-xl"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-3 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[13px] sm:text-[14px] text-text-muted">
                    <time dateTime={post.datePublished}>
                      {formatPostDate(post.datePublished)}
                    </time>
                    <span aria-hidden>·</span>
                    <span>By {post.author.name}</span>
                  </div>
                  <h2 className="font-satoshi font-bold text-[24px] sm:text-[28px] leading-[120%] tracking-[-0.01em] group-hover:underline">
                    {post.title}
                  </h2>
                  <p className="font-satoshi text-[15px] sm:text-[17px] leading-[150%] text-text-muted">
                    {post.description}
                  </p>
                  <span className="font-satoshi text-[14px] text-text-muted group-hover:text-white transition-colors">
                    Read more →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  )
}
