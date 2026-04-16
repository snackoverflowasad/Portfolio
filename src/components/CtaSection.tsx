import { useState } from 'react'
import type { FormEvent } from 'react'
import { submitContactForm } from '../api/public'

function CtaSection() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const labelHighlightClass =
    "relative isolate inline-block w-fit px-2 py-0.5 font-['Syne'] text-xs font-bold uppercase tracking-[0.12em] text-[#111111] before:absolute before:inset-0 before:-z-10 before:-rotate-[1.4deg] before:bg-[#ff86c8]/35 before:shadow-[2px_2px_0_#111111] before:content-[''] before:[clip-path:polygon(4%_20%,17%_7%,39%_12%,58%_5%,80%_11%,95%_26%,92%_56%,98%_79%,84%_92%,60%_86%,36%_95%,15%_88%,5%_70%,2%_45%)]"

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const payload = {
      senderName: String(formData.get('name') ?? '').trim(),
      senderEmail: String(formData.get('email') ?? '').trim(),
      inquiryType: String(formData.get('inquiryType') ?? '').trim(),
      organization: String(formData.get('organization') ?? '').trim() || undefined,
      profileLink: String(formData.get('profileLink') ?? '').trim() || undefined,
      message: String(formData.get('message') ?? '').trim(),
    }

    try {
      setIsSubmitting(true)
      setSubmitError('')
      await submitContactForm(payload)
      setIsSubmitted(true)
      event.currentTarget.reset()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to send your message right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section data-cta className="border-t-2 border-[#111111] px-4 pb-6 pt-6 sm:px-5 lg:px-9 lg:pb-10 lg:pt-8.5" id="cta">
      <div className="mx-auto w-full max-w-300">
        <div data-cta-box className="border-2 border-[#111111] bg-[#f8f8f8] px-4 py-8 shadow-[5px_5px_0_#9f9f9f] sm:px-4.5 sm:py-8.5">
          <h2 className="mb-6 font-['Syne'] text-[clamp(26px,7vw,48px)] leading-[1.05] tracking-[-0.03em] sm:mb-7.5">
            Let's{' '}
            <span className="inline-block -rotate-1 bg-[#c9a3ff] px-2 py-0.5 shadow-[2px_2px_0_#111111]">
              connect
            </span>
          </h2>
          {/* <p className="mx-auto mb-5.5 max-w-[42ch] text-[15px] sm:text-[19px]">
            Use this form for networking queries, collaboration conversations,
            referrals, or community opportunities.
          </p> */}

          <form className="mx-auto grid w-full max-w-215 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4" onSubmit={handleSubmit}>
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
                disabled={isSubmitting}
                className="cursor-pointer rounded-[28px] border-[3px] border-[#111111] bg-[#9fd5f8] px-5.5 py-2.75 font-['Syne'] text-[16px] font-extrabold shadow-[2px_3px_0_#000] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_5px_0_#000] sm:px-6.5 sm:text-lg"
              >
                {isSubmitting ? 'Sending...' : 'Send Connection'}
              </button>

              <div className="min-h-6">
                {isSubmitted && !submitError ? (
                  <p className="text-sm font-semibold text-[#1f4f1f]">Message sent successfully.</p>
                ) : null}
                {submitError ? <p className="text-sm font-semibold text-[#8f1d1d]">{submitError}</p> : null}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default CtaSection
