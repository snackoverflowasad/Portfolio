import type { ReactNode } from "react";

import { motion } from "framer-motion";

function RoughUnderline({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block pb-1.5">
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute left-0 bottom-0 h-[7px] w-full"
        viewBox="0 0 100 7"
        preserveAspectRatio="none"
      >
        <path
          d="M0.5 4.8 C5 4.2, 8.5 5.5, 13 4.7 S22 3.9, 27 4.5 S36 5.1, 41 4.4 S49 3.7, 54 4.3 S63 5.2, 68 4.6 S76 3.8, 81 4.5 S90 5.0, 95 4.4 S99 4.8, 99.5 4.6"
          fill="none"
          stroke="#111111"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.6"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
}

function TestimonialsSection() {
  const labels = [
    { label: "Rank Holder", tone: "bg-[#f5df75]/65" },
    { label: "Winner", tone: "bg-[#f3afe4]/60" },
    { label: "Runner", tone: "bg-[#8ed0fb]/60" },
    { label: "Volunteering", tone: "bg-[#f7b07a]/60" },
  ];

  const highlights = [
    {
      id: "ranked-13th",
      tone: "bg-[#f5df75]/65",
      text: (
        <>
          <RoughUnderline>Ranked 13th</RoughUnderline> in the{" "}
          <RoughUnderline>BCA department in the first year</RoughUnderline>,
          with an aggregate <RoughUnderline>CGPA of 9.6</RoughUnderline>,
          reflecting strong academic performance.
        </>
      ),
    },
    // Winner of NATIONAL STARTUP DAY for startup idea and entrepreneurial innovation.
    {
      id: "startup-day-winner",
      tone: "bg-[#f3afe4]/60",
      text: (
        <>
          <RoughUnderline>Winner</RoughUnderline> of{" "}
          <RoughUnderline>NATIONAL STARTUP DAY</RoughUnderline> for{" "}
          <RoughUnderline>startup idea</RoughUnderline> and{" "}
          <RoughUnderline>entrepreneurial innovation</RoughUnderline>
        </>
      ),
    },
    // Achieved 2ND PRIZE WEB-A-THON, for building a website using AI-based development approaches.
    {
      id: "web-a-thon-prize",
      tone: "bg-[#8ed0fb]/60",
      text: (
        <>
          Achieved <RoughUnderline>2ND PRIZE</RoughUnderline> in{" "}
          <RoughUnderline>WEB-A-THON</RoughUnderline>, for building a website
          using <RoughUnderline>AI-based development approaches</RoughUnderline>
          .
        </>
      ),
    },
    // Organized “Hackolution” Hackathon, managing planning and execution.
    {
      id: "hackolution-organizer",
      tone: "bg-[#f7b07a]/60",
      text: (
        <>
          Organized <RoughUnderline>“Hackolution” Hackathon</RoughUnderline>,
          managing <RoughUnderline>planning </RoughUnderline> and{" "}
          <RoughUnderline>execution</RoughUnderline>.
        </>
      ),
    },
  ];

  return (
    <motion.section
      data-testimonials
      className="border-t-2 border-[#111111] px-4 pb-6 pt-6 sm:px-5 lg:px-9 lg:pb-10 lg:pt-[34px]"
      id="awards"
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65 }}
      viewport={{ once: true, amount: 0.25 }}
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <h2 className="mb-6 font-['Syne'] text-[clamp(26px,7vw,48px)] leading-[1.05] tracking-[-0.03em] sm:mb-[30px]">
          <span className="relative inline-block px-1.5">
            <span
              className="absolute inset-0 -rotate-[2deg] bg-[#9dff00]/70 opacity-65 [clip-path:polygon(8%_18%,20%_6%,42%_10%,63%_4%,84%_14%,95%_34%,92%_58%,97%_79%,83%_93%,60%_88%,39%_96%,18%_88%,7%_68%,4%_45%)]"
              aria-hidden="true"
            />
            <span className="relative">Achievements</span>
          </span>{" "}
          and{" "}
          <span className="relative inline-block px-1.5">
            <span
              className="absolute inset-0 -rotate-[2deg] bg-[#9dff00]/70 opacity-65 [clip-path:polygon(8%_18%,20%_6%,42%_10%,63%_4%,84%_14%,95%_34%,92%_58%,97%_79%,83%_93%,60%_88%,39%_96%,18%_88%,7%_68%,4%_45%)]"
              aria-hidden="true"
            />
            <span className="relative">Awards</span>
          </span>
        </h2>

        <div data-testimonial-wall className="relative p-6 sm:p-8">
          <span
            className="pointer-events-none absolute left-2 right-2 top-6 border-t border-[#111111]"
            aria-hidden="true"
          />
          <span
            className="pointer-events-none absolute left-2 right-2 bottom-6 border-t border-[#111111]"
            aria-hidden="true"
          />
          <span
            className="pointer-events-none absolute bottom-4 top-4 left-3 border-l border-[#111111]"
            aria-hidden="true"
          />
          <span
            className="pointer-events-none absolute bottom-4 top-4 right-3 border-l border-[#111111]"
            aria-hidden="true"
          />

          <div className="relative z-10 grid grid-cols-1 gap-5 px-3 py-10 md:grid-cols-2 md:gap-7 md:px-6 md:py-12">
            <div className="space-y-4">
              {labels.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span
                    className="relative h-8 w-16 shrink-0 sm:h-9 sm:w-20"
                    aria-hidden="true"
                  >
                    <span
                      className={`absolute inset-0 -rotate-[1.3deg] [clip-path:polygon(4%_20%,18%_8%,39%_12%,61%_6%,84%_13%,95%_30%,92%_57%,98%_80%,84%_93%,61%_87%,37%_95%,16%_88%,6%_69%,3%_43%)] ${item.tone}`}
                    />
                  </span>
                  <span className="font-['Syne'] text-[20px] font-bold text-[#111111] sm:text-[26px]">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="min-h-[260px] border-2 border-dashed border-[#111111]/55 bg-white p-4 sm:p-5"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, transparent 0, transparent 27px, #d8d8d8 27px, #d8d8d8 28px)",
              }}
              aria-label="Achievements details"
            >
              <ul className="space-y-3">
                {highlights.map((item) => (
                  <li
                    key={item.id}
                    className="relative isolate px-2.5 py-2 text-[13px] leading-[1.55] text-[#1c1c1c] sm:text-[14px]"
                  >
                    <span
                      className={`absolute inset-0 -z-10 -rotate-[0.9deg] [clip-path:polygon(3%_12%,13%_5%,31%_8%,50%_4%,73%_8%,91%_13%,97%_28%,94%_55%,98%_77%,90%_92%,72%_88%,48%_95%,27%_90%,11%_84%,4%_68%,2%_42%)] ${item.tone}`}
                      aria-hidden="true"
                    />
                    <span className="mr-1.5 font-bold text-[#111111]">•</span>
                    <span className="inline">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default TestimonialsSection;
