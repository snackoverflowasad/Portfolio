import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { projects } from '../data/projects'

const toneClass: Record<string, string> = {
  sand: 'bg-[linear-gradient(135deg,#f8d8c4_10%,#f8f5d3_50%,#c7dbbf_90%)]',
  dark: 'bg-[linear-gradient(135deg,#c6dff0_10%,#dfe8c9_55%,#f6dfc7_90%)]',
  yellow: 'bg-[linear-gradient(135deg,#f7dc53,#f6f2d0)]',
  light: 'bg-[linear-gradient(135deg,#ffffff,#dce7cf)]',
}

function PortfolioSection() {
  return (
    <motion.section
      data-portfolio
      className="border-t-2 border-[#111111] px-4 pb-6 pt-6 sm:px-5 lg:px-9 lg:pb-10 lg:pt-[34px]"
      id="projectsection"
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto w-full max-w-[1200px]">
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
        <div data-portfolio-grid className="grid grid-cols-1 gap-[14px] md:grid-cols-2 lg:gap-6">
          {projects.map((project, idx) => (
            <Link
              data-portfolio-card
              className="group relative block border-2 border-[#111111] bg-[#f6f6f3] p-[14px] no-underline shadow-[5px_5px_0_#9f9f9f] transition hover:-translate-y-1"
              key={`${project.slug}-${idx}`}
              to={`/projects/${project.slug}`}
              aria-label={`Open ${project.title} details`}
            >
              <div data-project-image className="relative aspect-[16/10] overflow-hidden border-2 border-[#111111]">
                <img
                  src={project.image}
                  alt={`${project.title} preview`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div
                  className={`absolute inset-0 ${toneClass[project.imgTone]} opacity-100 transition-opacity duration-300 group-hover:opacity-0`}
                  aria-hidden="true"
                />
              </div>
              <h3 className="mb-2 mt-3 font-['Syne'] text-[34px]">{project.title}</h3>
              <p className="m-0 max-w-[28ch] text-[16px] text-[#2f2f2f]">Click to view project details and README summary</p>
              <div data-project-keywords className="mt-3 flex flex-wrap gap-2">
                {project.keywords.map((word) => (
                  <span
                    key={word}
                    className="cursor-default border-2 border-[#111111] bg-[#111111] px-2 py-1 font-['Syne'] text-[12px] font-semibold tracking-[0.02em] text-white transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#9dff00] hover:text-[#111111] hover:shadow-[2px_2px_0_#111111]"
                  >
                    {word}
                  </span>
                ))}
              </div>
              <span
                aria-hidden="true"
                className="absolute bottom-[14px] right-[14px] grid h-7 w-7 place-items-center bg-[#111111] text-[17px] text-white"
              >
                ↗
              </span>
            </Link>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export default PortfolioSection
