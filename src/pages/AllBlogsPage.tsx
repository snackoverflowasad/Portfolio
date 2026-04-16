import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPublicBlogs } from '../api/public'

type PublicBlogCard = {
  title: string
  excerpt: string
  meta: string
  href?: string
}

function isSafeExternalUrl(url?: string) {
  if (!url) {
    return false
  }

  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

function AllBlogsPage() {
  const [blogs, setBlogs] = useState<PublicBlogCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadBlogs() {
      try {
        setIsLoading(true)
        setLoadError('')

        const data = await getPublicBlogs()
        if (!isMounted) {
          return
        }

        setBlogs(
          data.map((blog) => ({
            title: blog.title,
            excerpt: blog.summary || blog.contentMarkdown || '',
            meta: [blog.category, blog.tags?.[0] ? `${blog.tags[0]}` : 'Blog']
              .filter(Boolean)
              .join(' · '),
            href: blog.href,
          })),
        )
      } catch (error) {
        if (isMounted) {
          setLoadError(error instanceof Error ? error.message : 'Failed to load blogs.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadBlogs()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <main className="min-h-screen bg-[#ebebdd] px-4 py-8 text-[#151515] sm:px-6 lg:px-9">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-['Syne'] text-[clamp(30px,7vw,56px)] leading-none tracking-[-0.03em]">
            All Blogs
          </h1>
          <Link
            to="/"
            className="inline-flex items-center justify-center border-2 border-[#111111] bg-white px-4 py-2 font-['Syne'] text-xs font-extrabold uppercase tracking-[0.14em] text-[#111111] no-underline shadow-[3px_3px_0_#111111] transition hover:-translate-y-px"
          >
            Back To Home
          </Link>
        </div>

        {loadError ? (
          <p className="mb-4 border-2 border-[#111111] bg-[#ffd9d9] px-4 py-3 font-['Syne'] text-[13px] text-[#8f1d1d]">
            {loadError}
          </p>
        ) : null}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {Array.from({ length: 6 }, (_, index) => (
              <article
                key={index}
                className="group border-2 border-[#111111] bg-[#f6f6f3] p-5 shadow-[5px_5px_0_#9f9f9f]"
              >
                <div className="mb-3 h-4 w-24 animate-pulse border border-[#111111] bg-[linear-gradient(90deg,#ececec_0%,#fafafa_50%,#ececec_100%)] bg-[length:200%_100%]" />
                <div className="mb-3 h-10 w-full animate-pulse border border-[#111111] bg-[linear-gradient(90deg,#efefef_0%,#f8f8f8_50%,#efefef_100%)] bg-[length:200%_100%]" />
                <div className="mb-5 h-24 w-full animate-pulse border border-[#111111] bg-[linear-gradient(90deg,#efefef_0%,#f8f8f8_50%,#efefef_100%)] bg-[length:200%_100%]" />
                <div className="h-9 w-28 animate-pulse border-2 border-[#111111] bg-[linear-gradient(90deg,#ececec_0%,#fafafa_50%,#ececec_100%)] bg-[length:200%_100%]" />
              </article>
            ))}
          </div>
        ) : null}

        {!isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {blogs.map((blog, index) => (
              <article
                key={`${blog.title}-${index}`}
                className="group border-2 border-[#111111] bg-[#f6f6f3] p-5 shadow-[5px_5px_0_#9f9f9f] transition-all duration-300 hover:-translate-y-1 hover:bg-[#f2f2ea] hover:shadow-[8px_8px_0_#111111]"
              >
                <p className="mb-3 font-['Syne'] text-xs font-bold uppercase tracking-[0.14em] text-[#3e3e3e]">
                  {blog.meta}
                </p>
                <h2 className="mb-3 font-['Syne'] text-[clamp(24px,3.2vw,34px)] leading-[1.05] text-[#151515]">
                  {blog.title}
                </h2>
                <p className="mb-5 text-[16px] leading-[1.45] text-[#3f3f3f]">{blog.excerpt}</p>

                {isSafeExternalUrl(blog.href) ? (
                  <a
                    href={blog.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    referrerPolicy="no-referrer"
                    className="inline-flex items-center gap-2 border-2 border-[#111111] bg-[#111111] px-3 py-1.5 font-['Syne'] text-xs font-bold uppercase tracking-[0.1em] text-white no-underline transition-all duration-200 group-hover:bg-[#9dff00] group-hover:text-[#111111]"
                  >
                    Read More <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 border-2 border-[#111111] bg-[#d8d8d8] px-3 py-1.5 font-['Syne'] text-xs font-bold uppercase tracking-[0.1em] text-[#555]">
                    Link unavailable
                  </span>
                )}
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  )
}

export default AllBlogsPage
