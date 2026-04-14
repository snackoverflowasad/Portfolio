function SiteFooter() {
  return (
    <footer
      data-site-footer
      className="mx-auto mt-8 flex w-full max-w-[1200px] flex-col gap-4 border-2 border-[#111111] bg-[#f1f2e6] px-5 py-4 sm:px-7 lg:mt-10 lg:flex-row lg:items-center lg:justify-between"
      id="connect"
    >
      <div className="flex items-center gap-2.5">
        {/* <svg
          aria-hidden="true"
          className="h-[26px] w-[26px] text-[#111111]"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2.5L13.9 9.1L20.5 11L13.9 12.9L12 19.5L10.1 12.9L3.5 11L10.1 9.1L12 2.5Z"
            fill="currentColor"
          />
        </svg> */}
        <span className="font-['Syne'] text-[30px] font-bold leading-none tracking-[-0.03em]">
          asxuu
        </span>
      </div>

      <span className="font-['Syne'] text-[20px] font-bold tracking-[-0.02em] text-[#111111]">
        copyright &copy; 2026
      </span>

      <div className="flex items-center gap-4">
        <a
          aria-label="GitHub"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#111111] transition hover:-translate-y-0.5 hover:bg-white"
          href="#"
        >
          <svg
            aria-hidden="true"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 3C7.03 3 3 7.03 3 12C3 15.98 5.58 19.36 9.16 20.55C9.61 20.63 9.77 20.36 9.77 20.13V18.52C7.27 19.06 6.74 17.45 6.74 17.45C6.33 16.41 5.74 16.13 5.74 16.13C4.92 15.57 5.8 15.58 5.8 15.58C6.71 15.64 7.19 16.52 7.19 16.52C7.99 17.9 9.29 17.5 9.81 17.26C9.89 16.68 10.12 16.29 10.38 16.07C8.39 15.84 6.3 15.08 6.3 11.68C6.3 10.71 6.65 9.91 7.22 9.27C7.13 9.04 6.82 8.13 7.31 6.9C7.31 6.9 8.07 6.66 9.77 7.81C10.49 7.61 11.27 7.51 12.05 7.51C12.83 7.51 13.61 7.61 14.33 7.81C16.03 6.66 16.79 6.9 16.79 6.9C17.28 8.13 16.97 9.04 16.88 9.27C17.45 9.91 17.8 10.71 17.8 11.68C17.8 15.09 15.71 15.84 13.72 16.06C14.05 16.34 14.35 16.89 14.35 17.73V20.13C14.35 20.36 14.51 20.63 14.96 20.55C18.54 19.36 21.12 15.98 21.12 12C21.12 7.03 17.09 3 12.12 3H12Z"
              fill="#111111"
            />
          </svg>
        </a>

        <a
          aria-label="Instagram"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#111111] transition hover:-translate-y-0.5 hover:bg-white"
          href="https://www.instagram.com/overfittinginsomnia/"
          target="_blank"
          rel="noopener noreferrer"
          referrerPolicy="no-referrer"
        >
          <svg
            aria-hidden="true"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              height="15"
              rx="4"
              stroke="#111111"
              strokeWidth="1.8"
              width="15"
              x="4.5"
              y="4.5"
            />
            <circle
              cx="12"
              cy="12"
              r="3.7"
              stroke="#111111"
              strokeWidth="1.8"
            />
            <circle cx="16.8" cy="7.2" fill="#111111" r="1" />
          </svg>
        </a>

        <a
          aria-label="X"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#111111] transition hover:-translate-y-0.5 hover:bg-white"
          href="https://x.com/asad2408dev"
          target="_blank"
          rel="noopener noreferrer"
          referrerPolicy="no-referrer"
        >
          <svg
            aria-hidden="true"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6 4H9.5L18 20H14.5L6 4Z" fill="#111111" />
            <path d="M18 4L6 20" stroke="#111111" strokeWidth="1.8" />
          </svg>
        </a>
      </div>
    </footer>
  );
}

export default SiteFooter;
