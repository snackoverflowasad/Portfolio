import { motion } from 'framer-motion'
import cppLogo from '../assets/logos/c-plus-plus-svgrepo-com.svg'
import cssLogo from '../assets/logos/css-3-svgrepo-com.svg'
import expressLogo from '../assets/logos/express-svgrepo-com.svg'
import firebaseLogo from '../assets/logos/firebase-svgrepo-com.svg'
import gitLogo from '../assets/logos/git-svgrepo-com.svg'
import githubLogo from '../assets/logos/github-142-svgrepo-com.svg'
import htmlLogo from '../assets/logos/html-5-svgrepo-com.svg'
import javaLogo from '../assets/logos/java-svgrepo-com.svg'
import jsLogo from '../assets/logos/javascript-svgrepo-com.svg'
import jupyterLogo from '../assets/logos/jupyter-svgrepo-com.svg'
import langchainLogo from '../assets/logos/Langchain--Streamline-Simple-Icons.svg'
import matplotlibLogo from '../assets/logos/Matplotlib.svg'
import mongoLogo from '../assets/logos/mongo-svgrepo-com.svg'
import nodeLogo from '../assets/logos/node-svgrepo-com.svg'
import numpyLogo from '../assets/logos/numpy-svgrepo-com.svg'
import pandasLogo from '../assets/logos/1920px-Pandas_mark.svg.png'
import pythonLogo from '../assets/logos/python-svgrepo-com.svg'
import reactLogo from '../assets/logos/react-svgrepo-com.svg'
import seabornLogo from '../assets/logos/seaborn-1.svg'
import tailwindLogo from '../assets/logos/tailwindcss-svgrepo-com.svg'
import tsLogo from '../assets/logos/typescript-official-svgrepo-com.svg'
import vercelLogo from '../assets/logos/vercel-logo-svgrepo-com.svg'
import viteLogo from '../assets/logos/vite-svgrepo-com.svg'

type Tech = {
  name: string
  logo: string
  invert?: boolean
  whiteBg?: boolean
}

const techStack: Tech[] = [
  // Frontend
  { name: 'HTML', logo: htmlLogo },
  { name: 'CSS', logo: cssLogo },
  { name: 'Tailwind CSS', logo: tailwindLogo },
  { name: 'JavaScript', logo: jsLogo },
  { name: 'TypeScript', logo: tsLogo },
  { name: 'React', logo: reactLogo },
  { name: 'Vite', logo: viteLogo },

  // Backend & databases
  { name: 'Node.js', logo: nodeLogo },
  { name: 'Express', logo: expressLogo, whiteBg: true },
  { name: 'MongoDB', logo: mongoLogo },
  { name: 'Firebase', logo: firebaseLogo },

  // Data, AI & analytics
  { name: 'Python', logo: pythonLogo },
  { name: 'NumPy', logo: numpyLogo },
  { name: 'Pandas', logo: pandasLogo },
  { name: 'Jupyter', logo: jupyterLogo },
  { name: 'Matplotlib', logo: matplotlibLogo },
  { name: 'Seaborn', logo: seabornLogo },
  { name: 'LangChain', logo: langchainLogo, whiteBg: true },

  // Languages, tooling & deployment
  { name: 'Java', logo: javaLogo },
  { name: 'C++', logo: cppLogo },
  { name: 'Git', logo: gitLogo },
  { name: 'GitHub', logo: githubLogo, invert: true },
  { name: 'Vercel', logo: vercelLogo, whiteBg: true },
]

function TechBadge({ tech }: { tech: Tech }) {
  return (
    <article
      data-tool-badge
      className="inline-flex items-center gap-2 whitespace-nowrap border-2 border-[#f4f1df] bg-[#1f1f1f] px-2 py-[5px] font-['Syne'] text-[12px] shadow-[2px_2px_0_#000] sm:gap-2.5 sm:px-[10px] sm:py-[6px] sm:text-base lg:px-3 lg:py-[7px] lg:text-[20px]"
      aria-label={tech.name}
    >
      <img
        className={`h-5 w-5 shrink-0 sm:h-7 sm:w-7 lg:h-[34px] lg:w-[34px] ${tech.invert ? 'invert' : ''} ${tech.whiteBg ? 'rounded bg-white p-[2px]' : ''}`}
        src={tech.logo}
        alt=""
        aria-hidden="true"
      />
      <span>{tech.name}</span>
    </article>
  )
}

function ToolStrip() {
  const marqueeItems = [...techStack]

  return (
    <section data-tool-strip className="overflow-hidden bg-[#111111] py-2 text-white sm:py-[10px] lg:py-[14px]" aria-label="Technology stack">
      <motion.div
        data-tool-strip-track
        className="flex w-max items-center"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 24, ease: 'linear', repeat: Infinity }}
      >
        <div className="flex items-center gap-2 px-2 sm:gap-2.5 lg:gap-4">
          {marqueeItems.map((tech) => (
            <TechBadge key={`a-${tech.name}`} tech={tech} />
          ))}
        </div>
        <div className="flex items-center gap-2 px-2 sm:gap-2.5 lg:gap-4" aria-hidden="true">
          {marqueeItems.map((tech) => (
            <TechBadge key={`b-${tech.name}`} tech={tech} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}

export default ToolStrip
