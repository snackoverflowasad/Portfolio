import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const navItems = [
  { label: 'About', href: '#aboutsection' },
  { label: 'Projects', href: '#projectsection' },
  { label: 'Awards', href: '#awards' },
  { label: 'Blog', href: '#blog' },
  { label: 'Connect', href: '#connect' },
]

const resumeDownloadUrl = 'https://drive.google.com/file/d/1sB0WBMSeVFoC2y27WhNr7uYwwcENZ2-D/view?usp=drive_link'

function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const clickCountRef = useRef(0)
  const resetTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null)

  const handleBrandClick = () => {
    clickCountRef.current += 1

    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current)
    }

    resetTimerRef.current = window.setTimeout(() => {
      clickCountRef.current = 0
    }, 1200)

    if (clickCountRef.current >= 4) {
      clickCountRef.current = 0
      window.clearTimeout(resetTimerRef.current)
      resetTimerRef.current = null
      navigate('/v3/admin/login-page')
    }
  }

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current)
      }
    }
  }, [])

  return (
    <header data-nav-shell className="relative z-30 mx-auto my-3 flex w-[calc(100%-8px)] items-center justify-between border-2 border-[#111111] bg-white shadow-[5px_5px_0_#9f9f9f] sm:my-4 sm:w-[calc(100%-12px)] lg:my-6 lg:w-fit lg:justify-start">
      <button
        type="button"
        data-nav-brand
        onClick={handleBrandClick}
        aria-label="Asad Hussain"
        className="whitespace-nowrap px-2 py-2 text-left font-['Syne'] text-[14px] font-bold text-[#111111] sm:px-3 sm:text-[17px] lg:border-r-2 lg:border-[#111111] lg:px-4 lg:text-[20px]"
      >
        asad hussain
      </button>
      <button
        type="button"
        data-nav-toggle
        className="mr-1 inline-flex h-9 w-10 shrink-0 items-center justify-center border-2 border-[#111111] bg-[#f5d44f] text-[#111111] shadow-[2px_2px_0_#000] transition hover:translate-x-px hover:translate-y-px hover:shadow-none lg:hidden"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
      >
        <span className="font-['Syne'] text-base font-black">{isOpen ? 'X' : '≡'}</span>
      </button>

      <nav className="hidden items-center lg:flex" aria-label="Primary navigation">
        {navItems.map((item, idx) => (
          <a
            key={item.label}
            href={item.href}
            data-nav-link
            className={`block whitespace-nowrap px-3 py-2.25 font-['Syne'] text-[12px] font-bold text-[#151515]
              shadow-[1px_1px_0_#000] transition-all duration-200
              hover:bg-[#f5d44f] hover:shadow-none hover:translate-x-px hover:translate-y-px
              sm:px-4 sm:text-[13px] lg:px-4 lg:py-2.75 lg:text-[15px] ${idx === 0 ? '' : 'border-l-2 border-[#111111]'}`}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <a
        data-nav-resume
        className="hidden h-9 shrink-0 items-center justify-center border-l-2 border-[#111111] bg-[#111111] px-3 font-['Syne'] text-[10px] font-extrabold uppercase tracking-wide text-white shadow-[3px_3px_0_#000] transition-all duration-200 hover:bg-[#252525] hover:translate-x-0.75 hover:translate-y-0.75 hover:shadow-none sm:h-10 sm:px-4 sm:text-[11px] lg:inline-flex lg:h-12 lg:px-5 lg:text-[13px]"
        href={resumeDownloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        referrerPolicy="no-referrer"
        aria-label="Download resume"
      >
        Resume
      </a>

      <div
        className={`${isOpen ? 'flex' : 'hidden'} absolute left-0 right-0 top-[calc(100%+8px)] z-40 flex-col border-2 border-[#111111] bg-white shadow-[5px_5px_0_#9f9f9f] lg:hidden`}
      >
        {navItems.map((item) => (
          <a
            key={`mobile-${item.label}`}
            href={item.href}
            onClick={() => setIsOpen(false)}
            className="border-b-2 border-[#111111] px-4 py-3 font-['Syne'] text-sm font-bold text-[#151515] hover:bg-[#f5d44f]"
          >
            {item.label}
          </a>
        ))}
        <a
          href={resumeDownloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          referrerPolicy="no-referrer"
          onClick={() => setIsOpen(false)}
          className="px-4 py-3 font-['Syne'] text-sm font-extrabold uppercase tracking-wide text-white bg-[#111111]"
          aria-label="Download resume"
        >
          Resume
        </a>
      </div>
    </header>
  )
}

export default SiteHeader
