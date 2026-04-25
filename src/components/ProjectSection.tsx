import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getPublicProjects } from '../api/public'

type PublicProjectCard = {
  slug: string
  title: string
  imageUrl?: string
  summary?: string
  description?: string
  projectUrl?: string
  liveUrl?: string
  repositoryUrl?: string
  techStack: string[]
}

const toneClass = [
  'bg-[linear-gradient(135deg,#f8d8c4_10%,#f8f5d3_50%,#c7dbbf_90%)]',
  'bg-[linear-gradient(135deg,#c6dff0_10%,#dfe8c9_55%,#f6dfc7_90%)]',
  'bg-[linear-gradient(135deg,#f7dc53,#f6f2d0)]',
  'bg-[linear-gradient(135deg,#ffffff,#dce7cf)]',
]

function PortfolioSection() {
  const [projects, setProjects] = useState<PublicProjectCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const showcaseLimit = 4

  const skeletonCards = Array.from({ length: 4 }, (_, index) => index)

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
            projectUrl: project.projectUrl,
            liveUrl: project.liveUrl,
            repositoryUrl: project.repositoryUrl,
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
    <motion.section
      data-portfolio
      className="border-t-2 border-[#111111] px-4 pb-6 pt-6 sm:px-5 lg:px-9 lg:pb-10 lg:pt-8.5"
      id="projectsection"
      initial={{ opacity: 0, y: 52 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.35 }}
    >
      <div className="mx-auto w-full max-w-300">
        <h2 className="mb-6 font-['Syne'] text-[clamp(26px,7vw,48px)] leading-[1.05] tracking-[-0.03em] sm:mb-[30px]">
          My{' '}
          <span className="relative inline-block px-1.5">
            <span
              className="absolute inset-0 -rotate-[2deg] bg-[#9dff00]/70 opacity-65 [clip-path:polygon(8%_18%,20%_6%,42%_10%,63%_4%,84%_14%,95%_34%,92%_58%,97%_79%,83%_93%,60%_88%,39%_96%,18%_88%,7%_68%,4%_45%)]"
              aria-hidden="true"
            />
            <span className="relative">Projects</span>
          </span>
        </h2>
        {loadError ? (
          <p className="mb-4 border-2 border-[#111111] bg-[#ffd9d9] px-4 py-3 font-['Syne'] text-[13px] text-[#8f1d1d]">
            {loadError}
          </p>
        ) : null}

        {isLoading ? (
          <div data-portfolio-grid className="grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:gap-6">
            {skeletonCards.map((index) => (
              <article
                key={index}
                className="overflow-hidden border-2 border-[#111111] bg-[#f6f6f3] p-3.5 shadow-[5px_5px_0_#9f9f9f]"
              >
                <div className="aspect-16/10 animate-pulse border-2 border-[#111111] bg-[#efefef]" />
                <div className="mt-3 h-8 w-2/3 animate-pulse border border-[#111111] bg-[#ececec]" />
                <div className="mt-3 h-5 w-full animate-pulse border border-[#111111] bg-[#efefef]" />
                <div className="mt-3 flex flex-wrap gap-2">
                  {Array.from({ length: 4 }, (_, keywordIndex) => (
                    <span key={keywordIndex} className="h-7 w-20 animate-pulse border-2 border-[#111111] bg-[#ececec]" />
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div data-portfolio-grid className="grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:gap-6">
            {projects.slice(0, showcaseLimit).map((project, idx) => (
              <Link
                data-portfolio-card
                className="group relative block border-2 border-[#111111] bg-[#f6f6f3] p-3.5 no-underline shadow-[5px_5px_0_#9f9f9f] transition hover:-translate-y-1"
                key={`${project.slug}-${idx}`}
                to={`/projects/${project.slug}`}
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
                <h3 className="mb-2 mt-3 font-['Syne'] text-[34px]">{project.title}</h3>
                <p className="m-0 max-w-[28ch] text-[16px] text-[#2f2f2f]">
                  {project.summary || 'Click to view project details and README summary'}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(project.techStack || []).map((word) => (
                    <span
                      key={word}
                      className="cursor-default border-2 border-[#111111] bg-[#111111] px-2 py-1 font-['Syne'] text-[12px] font-semibold tracking-[0.02em] text-white transition-all duration-200 hover:-translate-y-px hover:bg-[#9dff00] hover:text-[#111111] hover:shadow-[2px_2px_0_#111111]"
                    >
                      {word}
                    </span>
                  ))}
                </div>
                <span aria-hidden="true" className="absolute bottom-3.5 right-3.5 grid h-7 w-7 place-items-center bg-[#111111] text-[17px] text-white">
                  ↗
                </span>
              </Link>
            ))}
          </div>
        )}

        <div data-portfolio-grid className="grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:gap-6">
          {projects.slice(0, showcaseLimit).map((project, idx) => (
            <Link
              data-portfolio-card
              className="group relative block border-2 border-[#111111] bg-[#f6f6f3] p-3.5 no-underline shadow-[5px_5px_0_#9f9f9f] transition hover:-translate-y-1"
              key={`${project.slug}-${idx}`}
              to={`/projects/${project.slug}`}
              aria-label={`Open ${project.title} details`}
            >
              <div data-project-image className="relative aspect-16/10 overflow-hidden border-2 border-[#111111]">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={`${project.title} preview`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : null}
                <div className={`absolute inset-0 ${toneClass[idx % toneClass.length]} opacity-100 transition-opacity duration-300 group-hover:opacity-0`} aria-hidden="true"/>
              </div>
              <h3 className="mb-2 mt-3 font-['Syne'] text-[34px]">{project.title}</h3>
              <p className="m-0 max-w-[28ch] text-[16px] text-[#2f2f2f]">
                {project.summary || 'Click to view project details and README summary'}
              </p>
              {/* <p>
                Click to view project details
              </p> */}
              <div data-project-keywords className="mt-3 flex flex-wrap gap-2">
                {(project.techStack || []).map((word) => (
                  <span
                    key={word}
                    className="cursor-default border-2 border-[#111111] bg-[#111111] px-2 py-1 font-['Syne'] text-[12px] font-semibold tracking-[0.02em] text-white transition-all duration-200 hover:-translate-y-px hover:bg-[#9dff00] hover:text-[#111111] hover:shadow-[2px_2px_0_#111111]"
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

        {!isLoading && !loadError && projects.length > showcaseLimit ? (
          <div className="mt-6 flex justify-center">
            <Link
              to="/projects"
              className="inline-flex items-center justify-center border-2 border-[#111111] bg-[#9dff00] px-4 py-2 font-['Syne'] text-xs font-extrabold uppercase tracking-[0.14em] text-[#111111] no-underline shadow-[3px_3px_0_#111111] transition hover:-translate-y-px"
            >
              View More Projects
            </Link>
          </div>
        ) : null}
      </div>
    </motion.section>
  )
}

export default PortfolioSection
