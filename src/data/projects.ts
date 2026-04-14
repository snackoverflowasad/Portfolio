import chatBuddyImage from '../assets/projects/chat-buddy.png'
import graphImage from '../assets/projects/graph.png'
import jwtImage from '../assets/projects/jwt-min.png'
import metasphereImage from '../assets/projects/metasphere.png'

export type ProjectTone = 'sand' | 'dark' | 'yellow' | 'light'

export type ProjectInfo = {
  slug: string
  title: string
  imgTone: ProjectTone
  image: string
  keywords: string[]
  projectUrl: string
  readme: string
}

export const projects: ProjectInfo[] = [
  {
    slug: 'chat-buddy',
    title: 'chat-buddy',
    imgTone: 'sand',
    image: chatBuddyImage,
    keywords: ['npm.js', 'openai', 'ai-agent', 'agent-sdk'],
    projectUrl: 'https://www.npmjs.com/package/chat-buddy',
    readme:
      'Chat Buddy is a WhatsApp AI assistant package that helps automate replies, scheduling, and conversational workflows with a personality-driven agent setup. It focuses on practical daily productivity, secure local configuration, and smooth terminal-first deployment for quick startup.',
  },
  {
    slug: 'metasphere-2026',
    title: 'Metasphere-2026',
    imgTone: 'dark',
    image: metasphereImage,
    keywords: ['html', 'gsap', 'tailwind', 'javascript'],
    projectUrl: 'https://metasphere2026.iem.edu.in/',
    readme:
      'Official website for MetaSphere 2026, organized by the Department of BCA, IEM Kolkata. Built by a team of students using HTML, Tailwind CSS, and JavaScript, featuring event details, schedule, speakers, and registration information.',
  },
  {
    slug: 'jwt-auth',
    title: 'JWT-Auth',
    imgTone: 'yellow',
    image: jwtImage,
    keywords: ['jsonwebtoken', 'express', 'node.js'],
    projectUrl: 'https://github.com/snackoverflowasad/JWT-Auth',
    readme:
      'JWT-Auth is a backend authentication system using Node.js, Express, and MongoDB. It includes secure login and registration flows, token-based session handling, password recovery utilities, and validation middleware to keep account workflows robust and maintainable.',
  },
  {
    slug: 'keyword-graph-extractor',
    title: 'keyword-graph-extractor',
    imgTone: 'light',
    image: graphImage,
    keywords: ['python', 'networkx', 'matplotlib'],
    projectUrl: 'https://github.com/snackoverflowasad/keyword-graph-extractor',
    readme:
      'This project extracts keywords from text using a word co-occurrence graph and the PageRank algorithm. It builds a graph where nodes are words and edges represent co-occurrence within a sliding window. Then, PageRank is applied to rank words by importance, similar to how Google ranks web pages.',
  },
]

export function getProjectBySlug(slug: string): ProjectInfo | undefined {
  return projects.find((project) => project.slug === slug)
}
