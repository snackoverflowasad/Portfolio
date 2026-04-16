import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
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

function BlogsSection() {
  const [blogs, setBlogs] = useState<PublicBlogCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const showcaseLimit = 3

  const skeletonCards = Array.from({ length: 3 }, (_, index) => index)

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
    <motion.section
      data-blogs
      className="border-t-2 border-[#111111] px-4 pb-6 pt-6 sm:px-5 lg:px-9 lg:pb-10 lg:pt-[34px]"
      id="blog"
      initial={{ opacity: 0, y: 52 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.35 }}
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <h2 className="mb-6 font-['Syne'] text-[clamp(26px,7vw,48px)] leading-[1.05] tracking-[-0.03em] sm:mb-[30px]">
          My{' '}
          <span className="relative inline-block px-1.5">
            <span
              className="absolute inset-0 -rotate-[2deg] bg-[#9dff00]/70 opacity-65 [clip-path:polygon(8%_18%,20%_6%,42%_10%,63%_4%,84%_14%,95%_34%,92%_58%,97%_79%,83%_93%,60%_88%,39%_96%,18%_88%,7%_68%,4%_45%)]"
              aria-hidden="true"
            />
            <span className="relative">Blogs</span>
          </span>
        </h2>

        {loadError ? (
          <p className="mb-4 border-2 border-[#111111] bg-[#ffd9d9] px-4 py-3 font-['Syne'] text-[13px] text-[#8f1d1d]">
            {loadError}
          </p>
        ) : null}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {skeletonCards.map((index) => (
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {blogs.slice(0, showcaseLimit).map((blog) => (
            <article
              key={blog.title}
              className="group border-2 border-[#111111] bg-[#f6f6f3] p-5 shadow-[5px_5px_0_#9f9f9f] transition-all duration-300 hover:-translate-y-1 hover:bg-[#f2f2ea] hover:shadow-[8px_8px_0_#111111]"
            >
              <p className="mb-3 font-['Syne'] text-xs font-bold uppercase tracking-[0.14em] text-[#3e3e3e]">
                {blog.meta}
              </p>
              <h3 className="mb-3 font-['Syne'] text-[clamp(24px,3.2vw,34px)] leading-[1.05] text-[#151515]">
                {blog.title}
              </h3>
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

        {!isLoading && !loadError && blogs.length > showcaseLimit ? (
          <div className="mt-6 flex justify-center">
            <Link
              to="/blogs"
              className="inline-flex items-center justify-center border-2 border-[#111111] bg-[#9fd5f8] px-4 py-2 font-['Syne'] text-xs font-extrabold uppercase tracking-[0.14em] text-[#111111] no-underline shadow-[3px_3px_0_#111111] transition hover:-translate-y-px"
            >
              View More Blogs
            </Link>
          </div>
        ) : null}
      </div>
    </motion.section>
  )
}

export default BlogsSection
