import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPublicProjects } from '../api/public'

type PublicProjectCard = {
  slug: string
  title: string
  imageUrl?: string
  summary?: string
  description?: string
  techStack: string[]
}

const toneClass = [
  'bg-[linear-gradient(135deg,#f8d8c4_10%,#f8f5d3_50%,#c7dbbf_90%)]',
  'bg-[linear-gradient(135deg,#c6dff0_10%,#dfe8c9_55%,#f6dfc7_90%)]',
  'bg-[linear-gradient(135deg,#f7dc53,#f6f2d0)]',
  'bg-[linear-gradient(135deg,#ffffff,#dce7cf)]',
]

function AllProjectsPage() {
  const [projects, setProjects] = useState<PublicProjectCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadProjects() {
      try {
        setIsLoading(true)
        setLoadError('')

        const data = await getPublicProjects()
        if (!isMounted) {
          return
        }

        setProjects(
          data.map((project) => ({
            slug: project.slug,
            title: project.title,
            imageUrl: project.imageUrl,
            summary: project.summary,
            description: project.description,
            techStack: project.techStack ?? [],
          })),
        )
      } catch (error) {
        if (isMounted) {
          setLoadError(error instanceof Error ? error.message : 'Failed to load projects.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadProjects()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <main className="min-h-screen bg-[#ebebdd] px-4 py-8 text-[#151515] sm:px-6 lg:px-9">
      <div className="mx-auto w-full max-w-300">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-['Syne'] text-[clamp(30px,7vw,56px)] leading-none tracking-[-0.03em]">
            All Projects
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
          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:gap-6">
            {Array.from({ length: 6 }, (_, index) => (
              <article
                key={index}
                className="overflow-hidden border-2 border-[#111111] bg-[#f6f6f3] p-3.5 shadow-[5px_5px_0_#9f9f9f]"
              >
                <div className="aspect-16/10 animate-pulse border-2 border-[#111111] bg-[linear-gradient(90deg,#efefef_0%,#f8f8f8_50%,#efefef_100%)] bg-size-[200%_100%]" />
                <div className="mt-3 h-8 w-2/3 animate-pulse border border-[#111111] bg-[linear-gradient(90deg,#ececec_0%,#fafafa_50%,#ececec_100%)] bg-size-[200%_100%]" />
                <div className="mt-3 h-5 w-full animate-pulse border border-[#111111] bg-[linear-gradient(90deg,#efefef_0%,#f8f8f8_50%,#efefef_100%)] bg-size-[200%_100%]" />
              </article>
            ))}
          </div>
        ) : null}

        {!isLoading ? (
          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:gap-6">
            {projects.map((project, idx) => (
              <Link
                key={`${project.slug}-${idx}`}
                to={`/projects/${project.slug}`}
                className="group relative block border-2 border-[#111111] bg-[#f6f6f3] p-3.5 no-underline shadow-[5px_5px_0_#9f9f9f] transition hover:-translate-y-1"
                aria-label={`Open ${project.title} details`}
              >
                <div className="relative aspect-16/10 overflow-hidden border-2 border-[#111111]">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={`${project.title} preview`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : null}
                  <div className={`absolute inset-0 ${toneClass[idx % toneClass.length]} opacity-100 transition-opacity duration-300 group-hover:opacity-0`} aria-hidden="true" />
                </div>

                <h2 className="mb-2 mt-3 font-['Syne'] text-[34px] text-[#151515]">{project.title}</h2>
                <p className="m-0 max-w-[28ch] text-[16px] text-[#2f2f2f]">
                  {project.summary || project.description || 'Click to view project details and README summary'}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {(project.techStack || []).map((word) => (
                    <span
                      key={`${project.slug}-${word}`}
                      className="cursor-default border-2 border-[#111111] bg-[#111111] px-2 py-1 font-['Syne'] text-[12px] font-semibold tracking-[0.02em] text-white"
                    >
                      {word}
                    </span>
                  ))}
                </div>

                <span
                  aria-hidden="true"
                  className="absolute bottom-3.5 right-3.5 grid h-7 w-7 place-items-center bg-[#111111] text-[17px] text-white"
                >
                  ↗
                </span>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  )
}

export default AllProjectsPage
