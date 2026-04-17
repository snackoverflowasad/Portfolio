import { motion } from "framer-motion";
import asadPhoto from "../assets/asad.jpeg";

function HeroSection() {
  return (
    <motion.section
      className="grid min-h-[auto] grid-cols-1 items-center gap-4 border-t-2 border-[#111111] px-4 pb-6 pt-6 sm:px-5 lg:min-h-[calc(100vh-120px)] lg:grid-cols-2 lg:gap-8 lg:px-9 lg:pb-[42px] lg:pt-[54px]"
      data-hero-shell
      id="about"
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65 }}
      viewport={{ once: true, amount: 0.25 }}
    >
      <div className="relative z-20 flex w-full flex-col items-center text-center lg:max-w-[560px] lg:items-start lg:text-left lg:pl-16 xl:pl-24 2xl:pl-32">
        <h1
          data-hero-title
          className="mb-4 mt-2 max-w-[9ch] font-['Syne'] text-[clamp(28px,8vw,72px)] leading-[0.98] tracking-[-0.03em] sm:text-[clamp(32px,7vw,76px)] lg:max-w-[10ch]"
        >
          a{" "}
          <span className="relative inline-block px-2 py-1">
            <span className="absolute inset-0 rotate-[-2deg] bg-[#9dff00]/40 [clip-path:polygon(8%_18%,20%_6%,42%_10%,63%_4%,84%_14%,95%_34%,92%_58%,97%_79%,83%_93%,60%_88%,39%_96%,18%_88%,7%_68%,4%_45%)]" />
            <span className="relative">developer</span>
          </span>{" "}
          who actually enjoys what they do
        </h1>
        <div className="mt-3 flex w-full justify-center lg:justify-start">
          <a
            href="#connect"
            data-hero-button
            className="visible !inline-flex !w-full max-w-[250px] items-center justify-center rounded-full border-[3px] border-[#111111] bg-[#9fd5f8] px-5 py-2.5 font-['Syne'] text-[clamp(14px,3.8vw,20px)] font-extrabold text-[#111111] no-underline opacity-100 ring-1 ring-[#111111] shadow-[3px_4px_0_#000] transition hover:translate-x-[-2px] hover:translate-y-[-2px] hover:bg-[#8ecbf4] hover:shadow-[5px_6px_0_#000] sm:max-w-[280px] lg:!w-auto lg:justify-start"
            aria-label="Get in touch"
          >
            Get in Touch
          </a>
        </div>
      </div>

      <div className="relative mx-auto mt-2 grid w-full max-w-[300px] justify-items-center sm:max-w-[360px] lg:mt-0 lg:max-w-[460px]">
        <div
          data-hero-note
          className="absolute left-0 top-[-42px] z-[5] hidden rotate-[-10deg] items-center gap-2 font-['Syne'] text-[14px] font-bold tracking-[0.04em] md:flex sm:top-[-68px] sm:text-[20px] lg:left-2 lg:top-[-104px] lg:rotate-[-12deg] lg:gap-5 lg:text-[28px]"
          aria-hidden="true"
        >
          <span className="inline-flex items-center gap-2.5 leading-none -rotate-[2deg]">
            <svg
              className="h-5 w-5 -translate-y-[1px] -rotate-[14deg] text-[#0f0f0f] sm:h-7 sm:w-7 lg:h-[34px] lg:w-[34px]"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="7" cy="9" r="1.3" fill="currentColor" />
              <circle cx="17" cy="9" r="1.3" fill="currentColor" />
              <path
                d="M6.5 13.2C7.7 16.2 10 17.5 12 17.5C14 17.5 16.3 16.2 17.5 13.2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="-rotate-[2deg]">ASAD</span>
          </span>
          <svg
            className="h-[40px] w-[56px] translate-y-[6px] rotate-[-6deg] text-[#121212] sm:h-[58px] sm:w-[78px] lg:h-[78px] lg:w-[104px]"
            viewBox="0 0 120 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 10C42 9 62 20 67 38C70 50 67 59 61 66"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M54 54L61 66L72 57"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div
          data-hero-frame
          className="relative aspect-square w-full max-w-[300px] border-4 border-[#111111] bg-[#ececef] shadow-[5px_5px_0_#9f9f9f] sm:max-w-[340px] lg:max-w-[360px]"
        >
          <div
            className="absolute left-1/2 top-[10px] z-[2] flex -translate-x-1/2 gap-[42px]"
            aria-hidden="true"
          >
            <span className="h-3 w-3 rounded-full bg-[#0f0f0f]" />
            <span className="h-3 w-3 rounded-full bg-[#0f0f0f]" />
          </div>
          <div className="absolute inset-9 overflow-hidden border-[3px] border-[#454545] bg-[#cfcfd2]">
            <img
              src={asadPhoto}
              alt="Asad Hussain"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div
            className="absolute bottom-[-12px] right-[-18px] z-[3] h-[70px] w-[70px] border-[3px] border-[#1a1a1a] bg-[#ff685e] [clip-path:polygon(50%_0%,60%_32%,92%_10%,70%_42%,100%_50%,70%_58%,92%_90%,60%_68%,50%_100%,40%_68%,8%_90%,30%_58%,0%_50%,30%_42%,8%_10%,40%_32%)]"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-[-16px] left-[-16px] right-[-16px] border-b-4 border-[#111111]"
            aria-hidden="true"
          />
        </div>
        <div
          className="absolute left-[10px] top-[42%] z-[4] grid h-[52px] w-[52px] -translate-y-1/2 place-items-center rounded-full border-[3px] border-[#111111] bg-[#f5d44f] lg:left-[18px] lg:h-[62px] lg:w-[62px]"
          aria-hidden="true"
        >
          <span className="relative h-6 w-[18px] rounded-[50%_50%_35%_35%] border-2 border-[#0f0f0f] before:absolute before:bottom-[-7px] before:left-1/2 before:h-1 before:w-[10px] before:-translate-x-1/2 before:border-2 before:border-[#0f0f0f] before:border-t-0 before:content-[''] after:absolute after:right-[-7px] after:top-[2px] after:h-[7px] after:w-[7px] after:rotate-[25deg] after:border-l-2 after:border-t-2 after:border-[#0f0f0f] after:content-['']" />
        </div>
      </div>
    </motion.section>
  );
}

export default HeroSection;
