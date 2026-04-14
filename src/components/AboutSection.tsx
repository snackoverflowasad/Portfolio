import { motion } from 'framer-motion'
import brainIcon from '../assets/about/brain-svgrepo-com.svg'
import growthIcon from '../assets/about/grow-growth-plant-svgrepo-com.svg'
import toolsIcon from '../assets/about/tools-svgrepo-com.svg'

const aboutCards = [
  {
    title: 'Builder',
    icon: '</>',
    note: 'I build AI workflows and automate real-world processes.',
    tone: 'orange',
  },
  {
    title: 'Thinker',
    icon: '🧠',
    iconImage: brainIcon,
    note: 'Deep thinking, clear decisions, better outcomes.',
    tone: 'yellow',
  },
  {
    title: 'Automator',
    icon: '⚙',
    iconImage: toolsIcon,
    note: 'Turning manual work into intelligent systems.',
    tone: 'blue',
  },
  {
    title: 'Hustler',
    icon: '☕',
    iconImage: growthIcon,
    note: 'Focused on growth, efficiency, and shipping fast.',
    tone: 'red',
  },
]

const toneClass: Record<string, string> = {
  yellow: 'bg-[#f5d44f]',
  orange: 'bg-[#ff7a3d]',
  blue: 'bg-[#9fd5f8]',
  red: 'bg-[#ff8f8f]',
}

function ServicesSection() {
  return (
    <motion.section
      data-services
      className="border-t-2 border-[#111111] px-4 pb-6 pt-6 sm:px-5 lg:px-9 lg:pb-10 lg:pt-[34px]"
      id="aboutsection"
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65 }}
      viewport={{ once: true, amount: 0.25 }}
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <h2 className="mb-6 font-['Syne'] text-[clamp(30px,7vw,54px)] leading-[1] tracking-[-0.03em] sm:mb-8">
          About{' '}
          <span className="relative inline-block px-1.5">
            <span
              className="absolute inset-0 -rotate-[2deg] bg-[#9dff00]/70 opacity-65 [clip-path:polygon(8%_18%,20%_6%,42%_10%,63%_4%,84%_14%,95%_34%,92%_58%,97%_79%,83%_93%,60%_88%,39%_96%,18%_88%,7%_68%,4%_45%)]"
              aria-hidden="true"
            />
            <span className="relative">Me</span>
          </span>
        </h2>

        <div data-services-grid className="grid grid-cols-1 gap-4 lg:grid-cols-[1.05fr_1fr] lg:gap-6">
          <article className="border-2 border-[#111111] bg-[#f2f2ea] p-5 shadow-[5px_5px_0_#9f9f9f] transition-all duration-300 hover:-translate-y-1 hover:bg-[#f6f6ee] hover:shadow-[8px_8px_0_#111111] sm:p-7">
            <p className="m-0 font-['Syne'] text-[clamp(20px,3.2vw,33px)] leading-[1.35] text-[#151515]">
              Hello, I&apos;m{' '}
              <strong className="relative inline-block px-1 font-['Syne'] text-[#111111]">
                <span
                  className="absolute inset-0 -rotate-[2deg] bg-[#F72F35]/40 opacity-65 [clip-path:polygon(8%_18%,20%_6%,42%_10%,63%_4%,84%_14%,95%_34%,92%_58%,97%_79%,83%_93%,60%_88%,39%_96%,18%_88%,7%_68%,4%_45%)]"
                  aria-hidden="true"
                />
                <span className="relative">Asad Hussain</span>
              </strong>
              . I&apos;m a
              developer who loves building practical products that solve real
              problems.
            </p>
            <p className="mb-0 mt-5 text-[clamp(16px,2.2vw,24px)] leading-[1.45] text-[#3f3f3f] sm:mt-7">
              From frontend interfaces to backend systems and AI workflows, I
              focus on shipping work that is clean, fast, and useful in the real
              world.
            </p>

            <div className="mt-7 border-t-2 border-[#111111] pt-5 sm:mt-9 sm:pt-6">
              <h3 className="mb-3 font-['Syne'] text-sm font-extrabold uppercase tracking-[0.2em] text-[#1e1e1e] sm:mb-4">
                Core Strengths
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'Confidence',
                  'Problem Solving',
                  'Adaptability',
                  'Consistency',
                ].map((item) => (
                  <span
                    key={item}
                    className="border-2 border-[#111111] bg-white px-2 py-1 font-['Syne'] text-xs font-bold tracking-[0.08em]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </article>

          <div data-metrics className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            {aboutCards.map((card) => (
              <article
                data-service-card
                className="group border-2 border-[#111111] bg-[#f2f2ea] p-5 shadow-[5px_5px_0_#9f9f9f] transition-all duration-300 hover:-translate-y-1 hover:bg-[#f6f6ee] hover:shadow-[8px_8px_0_#111111] sm:p-6"
                key={card.title}
              >
                <span
                  data-service-icon
                  className={`mb-5 grid h-12 w-12 place-items-center border-2 border-[#111111] text-lg font-black text-[#111111] transition-transform duration-300 group-hover:scale-110 ${toneClass[card.tone]}`}
                  aria-hidden="true"
                >
                  {card.iconImage ? (
                    <img
                      src={card.iconImage}
                      alt=""
                      className="h-6 w-6 object-contain"
                    />
                  ) : (
                    card.icon
                  )}
                </span>
                <h3 className="m-0 font-['Syne'] text-[clamp(24px,3.4vw,34px)] leading-none text-[#151515]">
                  {card.title}
                </h3>
                <p className="mb-0 mt-3 text-[clamp(15px,1.8vw,22px)] leading-[1.35] text-[#4a4a4a]">
                  {card.note}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default ServicesSection
