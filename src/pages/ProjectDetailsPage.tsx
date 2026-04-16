import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPublicProjectBySlug } from '../api/public'
import type { PublicProject } from '../types'

function isSafeExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    return false
  }
}

function ProjectDetailsPage() {
  const { slug } = useParams()
  const [project, setProject] = useState<PublicProject | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadProject() {
      try {
        setIsLoading(true)
        setLoadError('')

        if (!slug) {
          throw new Error('Project slug is missing.')
        }

        const data = await getPublicProjectBySlug(slug)
        if (isMounted) {
          setProject(data)
        }
      } catch (error) {
        if (isMounted) {
          setProject(null)
          setLoadError(error instanceof Error ? error.message : 'Project not found.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadProject()

    return () => {
      isMounted = false
    }
  }, [slug])

  const safeProjectUrl = project && isSafeExternalUrl(project.projectUrl || project.liveUrl || '')
    ? project.projectUrl || project.liveUrl
    : undefined

  if (isLoading) {
    return (
      <main className="min-h-screen border-2 border-[#111111] bg-[#ebebdd] px-4 py-10 text-[#151515] sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[900px] border-2 border-[#111111] bg-[#f2f2ea] p-6 shadow-[6px_6px_0_#9f9f9f] sm:p-8">
          <h1 className="mb-3 font-['Syne'] text-[clamp(28px,6vw,52px)]">Loading Project</h1>
          <p className="mb-6 text-[18px] text-[#3c3c3c]">Projects are being dragged out of bed....</p>
        </div>
      </main>
    )
  }

  if (!project) {
    return (
      <main className="min-h-screen border-2 border-[#111111] bg-[#ebebdd] px-4 py-10 text-[#151515] sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[900px] border-2 border-[#111111] bg-[#f2f2ea] p-6 shadow-[6px_6px_0_#9f9f9f] sm:p-8">
          <h1 className="mb-3 font-['Syne'] text-[clamp(28px,6vw,52px)]">Project Not Found</h1>
          <p className="mb-6 text-[18px] text-[#3c3c3c]">{loadError || 'The project page you requested does not exist.'}</p>
          <Link
            to="/"
            className="inline-flex items-center justify-center border-2 border-[#111111] bg-[#9dff00] px-4 py-2 font-['Syne'] text-sm font-bold tracking-wide text-[#111111] no-underline shadow-[3px_3px_0_#111111] transition hover:-translate-y-[1px]"
          >
            Back to Home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen border-2 border-[#111111] bg-[#ebebdd] px-4 py-10 text-[#151515] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[980px] space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center border-2 border-[#111111] bg-white px-3 py-1.5 font-['Syne'] text-xs font-bold tracking-wide text-[#111111] no-underline shadow-[2px_2px_0_#111111] transition hover:-translate-y-[1px]"
          >
            ← Back
          </Link>
          <span className="font-['Syne'] text-xs font-extrabold uppercase tracking-[0.2em] text-[#444]">Project Details</span>
        </div>

        <article className="border-2 border-[#111111] bg-[#f2f2ea] p-5 shadow-[6px_6px_0_#9f9f9f] sm:p-8">
          <h1 className="mb-3 font-['Syne'] text-[clamp(30px,6vw,58px)] leading-[1] tracking-[-0.03em]">{project.title}</h1>
          <div className="mb-6 flex flex-wrap gap-2">
            {(project.techStack || []).map((keyword) => (
              <span
                key={keyword}
                className="border-2 border-[#111111] bg-white px-2 py-1 font-['Syne'] text-xs font-semibold tracking-[0.03em] text-[#111111]"
              >
                {keyword}
              </span>
            ))}
          </div>

          <div className="mb-6 overflow-hidden border-2 border-[#111111]">
            {project.imageUrl ? (
              <img src={project.imageUrl} alt={`${project.title} preview`} className="h-auto w-full object-cover" />
            ) : (
              <div className="flex min-h-[280px] items-center justify-center bg-[#f7f2da] font-['Syne'] text-[18px] font-bold text-[#555]">
                No project image available
              </div>
            )}
          </div>

          <div className="border-2 border-[#111111] bg-white p-4 sm:p-5">
            <h2 className="mb-3 font-['Syne'] text-[22px]">Project Summary</h2>
            <p className="m-0 text-[16px] leading-[1.7] text-[#2f2f2f]">{project.description || project.summary || 'No summary available.'}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {safeProjectUrl && (
              <a
                href={safeProjectUrl}
                target="_blank"
                rel="noopener noreferrer"
                referrerPolicy="no-referrer"
                className="inline-flex items-center justify-center border-2 border-[#111111] bg-[#9dff00] px-4 py-2 font-['Syne'] text-sm font-bold tracking-wide text-[#111111] no-underline shadow-[3px_3px_0_#111111] transition hover:-translate-y-[1px]"
              >
                Go to Project ↗
              </a>
            )}
          </div>
        </article>
      </div>
    </main>
  )
}

export default ProjectDetailsPage
