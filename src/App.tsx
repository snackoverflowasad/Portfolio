import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import FloatingDoodles from './components/FloatingDoodles'
import SiteHeader from './components/SiteHeader'
import HeroSection from './components/HeroSection'
import ToolStrip from './components/ToolStrip'
import ServicesSection from './components/AboutSection'
import PortfolioSection from './components/ProjectSection'
import TestimonialsSection from './components/Achievements'
import BlogsSection from './components/BlogsSection'
import CtaSection from './components/CtaSection'
import SiteFooter from './components/SiteFooter'
import Loader from './components/loader'

function App() {
  const appRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false)
    }, 5500)

    return () => window.clearTimeout(timer)
  }, [])

  useLayoutEffect(() => {
    if (isLoading) return
    if (!appRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-nav-shell]',
        { y: -28, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          clearProps: 'opacity,visibility,transform',
          duration: 0.8,
          ease: 'power3.out',
        },
      )

      gsap.fromTo(
        '[data-nav-brand], [data-nav-toggle], [data-nav-link], [data-nav-resume]',
        { y: -10, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          clearProps: 'opacity,visibility,transform',
          duration: 0.55,
          ease: 'power2.out',
          stagger: 0.08,
          delay: 0.18,
        },
      )

      gsap.fromTo(
        '[data-hero-title], [data-hero-button], [data-hero-note]',
        { y: 36, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          clearProps: 'opacity,visibility,transform',
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.1,
          delay: 0.15,
        },
      )

      gsap.fromTo(
        '[data-hero-frame]',
        { scale: 0.86, rotate: -4, autoAlpha: 0 },
        {
          scale: 1,
          rotate: 0,
          autoAlpha: 1,
          clearProps: 'opacity,visibility,transform',
          duration: 1,
          delay: 0.3,
          ease: 'elastic.out(1, 0.65)',
        },
      )

      gsap.to('[data-floating-doodle]', {
        y: 'random(-12, 12)',
        x: 'random(-10, 10)',
        rotate: 'random(-18, 18)',
        duration: 'random(1.9, 3.4)',
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 0.25,
      })
    }, appRef)

    return () => ctx.revert()
  }, [isLoading])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div
      className="site relative min-h-screen w-full overflow-x-hidden border-2 border-[#111111] bg-[#ebebdd] text-[#151515]"
      ref={appRef}
    >
      <FloatingDoodles />
      <SiteHeader />

      <main>
        <HeroSection />
        <ToolStrip />
        <ServicesSection />
        <PortfolioSection />
        <TestimonialsSection />
        <BlogsSection />
        <CtaSection />
      </main>

      <SiteFooter />
    </div>
  )
}

export default App
