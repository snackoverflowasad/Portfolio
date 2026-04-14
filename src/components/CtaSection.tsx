import { useState } from 'react'
import type { FormEvent } from 'react'

function CtaSection() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const labelHighlightClass =
    "relative isolate inline-block w-fit px-2 py-0.5 font-['Syne'] text-xs font-bold uppercase tracking-[0.12em] text-[#111111] before:absolute before:inset-0 before:-z-10 before:-rotate-[1.4deg] before:bg-[#ff86c8]/35 before:shadow-[2px_2px_0_#111111] before:content-[''] before:[clip-path:polygon(4%_20%,17%_7%,39%_12%,58%_5%,80%_11%,95%_26%,92%_56%,98%_79%,84%_92%,60%_86%,36%_95%,15%_88%,5%_70%,2%_45%)]"

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Backend hook point: POST payload to your API when backend is ready.
    // Avoid logging form payload in the browser console to prevent accidental data exposure.
    setIsSubmitted(true)
  }

  return (
    <section data-cta className="border-t-2 border-[#111111] px-4 pb-6 pt-6 sm:px-5 lg:px-9 lg:pb-10 lg:pt-[34px]" id="cta">
      <div className="mx-auto w-full max-w-[1200px]">
        <div data-cta-box className="border-2 border-[#111111] bg-[#f8f8f8] px-4 py-8 shadow-[5px_5px_0_#9f9f9f] sm:px-[18px] sm:py-[34px]">
          <h2 className="mb-6 font-['Syne'] text-[clamp(26px,7vw,48px)] leading-[1.05] tracking-[-0.03em] sm:mb-[30px]">
            Let's{' '}
            <span className="inline-block -rotate-1 bg-[#c9a3ff] px-2 py-0.5 shadow-[2px_2px_0_#111111]">
              connect
            </span>
          </h2>
          {/* <p className="mx-auto mb-[22px] max-w-[42ch] text-[15px] sm:text-[19px]">
            Use this form for networking queries, collaboration conversations,
            referrals, or community opportunities.
          </p> */}

          <form className="mx-auto grid w-full max-w-[860px] grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-1.5 text-left">
              <span className={labelHighlightClass}>Name</span>
              <input
                type="text"
                name="name"
                required
                placeholder="Your full name"
                className="w-full border-2 border-[#111111] bg-white px-3 py-2.5 text-[15px] text-[#111111] outline-none transition focus:bg-[#f7f7f7]"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-left">
              <span className={labelHighlightClass}>Email</span>
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="w-full border-2 border-[#111111] bg-white px-3 py-2.5 text-[15px] text-[#111111] outline-none transition focus:bg-[#f7f7f7]"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-left sm:col-span-2">
              <span className={labelHighlightClass}>Inquiry Type</span>
              <select
                name="inquiryType"
                required
                className="w-full border-2 border-[#111111] bg-white px-3 py-2.5 text-[15px] text-[#111111] outline-none transition focus:bg-[#f7f7f7]"
                defaultValue=""
              >
                <option value="" disabled>
                  Select inquiry type
                </option>
                <option value="networking">Networking</option>
                <option value="collaboration">Collaboration</option>
                {/* <option value="referral">Referral</option> */}
                <option value="mentorship">Mentorship / Guidance</option>
              </select>
            </label>

            <label className="flex flex-col gap-1.5 text-left">
              <span className={labelHighlightClass}>Organization</span>
              <input
                type="text"
                name="organization"
                placeholder="Company, community, or group"
                className="w-full border-2 border-[#111111] bg-white px-3 py-2.5 text-[15px] text-[#111111] outline-none transition focus:bg-[#f7f7f7]"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-left">
              <span className={labelHighlightClass}>Profile Link</span>
              <input
                type="url"
                name="profileLink"
                placeholder="LinkedIn or portfolio URL"
                className="w-full border-2 border-[#111111] bg-white px-3 py-2.5 text-[15px] text-[#111111] outline-none transition focus:bg-[#f7f7f7]"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-left sm:col-span-2">
              <span className={labelHighlightClass}>Message</span>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Share your query and what kind of connection you are looking for..."
                className="w-full resize-y border-2 border-[#111111] bg-white px-3 py-2.5 text-[15px] text-[#111111] outline-none transition focus:bg-[#f7f7f7]"
              />
            </label>

            <div className="flex flex-col gap-2 text-left sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                className="cursor-pointer rounded-[28px] border-[3px] border-[#111111] bg-[#9fd5f8] px-[22px] py-[11px] font-['Syne'] text-[16px] font-extrabold shadow-[2px_3px_0_#000] transition hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_5px_0_#000] sm:px-[26px] sm:text-lg"
              >
                Send Connection
              </button>

              {isSubmitted && (
                <p className="text-sm font-semibold text-[#1f4f1f]">
                  Query captured. Connect backend in handleSubmit to send it.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default CtaSection
