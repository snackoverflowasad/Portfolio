// Loader.tsx
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

const LINES = [
  { delay: 200,  prompt: true,  cls: "text-[#e8e8d8]",  text: "git pull origin main" },
  { delay: 900,  prompt: false, cls: "text-[#666]",      text: "remote: Enumerating objects: 42, done." },
  { delay: 1300, prompt: false, cls: "text-[#666]",      text: "remote: Counting objects: 100% (42/42), done." },
  { delay: 1700, prompt: false, cls: "text-[#6ec6f5]",   text: "Receiving objects: 100% (42/42)" },
  { delay: 2200, prompt: false, cls: "text-[#f5c842]",   text: "Resolving deltas: 100% (18/18), done." },
  { delay: 2700, prompt: false, cls: "text-[#c8f060]",   text: "Fast-forward" },
  { delay: 3000, prompt: false, cls: "text-[#666]",      text: " projects/   | 12 ++++++++" },
  { delay: 3200, prompt: false, cls: "text-[#666]",      text: " awards/     |  6 +++" },
  { delay: 3400, prompt: false, cls: "text-[#666]",      text: " skills/     |  9 +++++" },
  { delay: 3700, prompt: false, cls: "text-[#e07fd4]",   text: "merge conflict: too much talent" },
  { delay: 4200, prompt: false, cls: "text-[#f97b50]",   text: "force pushing greatness..." },
  { delay: 4800, prompt: false, cls: "text-[#c8f060]",   text: "✓ portfolio loaded. you're welcome." },
  { delay: 5300, prompt: true,  cls: "",                 text: "", cursor: true },
];

const PROG_STEPS = [
  { at: 1700, pct: 30,  text: "Receiving objects..." },
  { at: 2200, pct: 60,  text: "Resolving deltas..." },
  { at: 3700, pct: 80,  text: "Applying changes..." },
  { at: 4800, pct: 95,  text: "Force pushing greatness..." },
  { at: 5200, pct: 100, text: "Complete!" },
];

const STARS = [
  { style: { top: "16px", left: "44px" },   size: 22, color: "#e07fd4", delay: "0s" },
  { style: { top: "20px", right: "55px" },  size: 16, color: "#f5c842", delay: "0.4s" },
  { style: { bottom: "55px", left: "20px" },size: 26, color: "#f97b50", delay: "0.7s" },
  { style: { bottom: "52px", right: "35px" },size: 28, color: "#6ec6f5", delay: "1.1s" },
];

export default function Loader() {
  const termRef = useRef<HTMLDivElement>(null);
  const [visibleLines, setVisibleLines] = useState<typeof LINES>([]);
  const [prog, setProg] = useState({ pct: 0, text: "Receiving objects..." });

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    LINES.forEach((line) => {
      timers.push(setTimeout(() => {
        setVisibleLines((prev) => [...prev, line]);
        setTimeout(() => {
          if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
        }, 10);
      }, line.delay));
    });

    PROG_STEPS.forEach((s) => {
      timers.push(setTimeout(() => {
        setProg({ pct: s.pct, text: s.text });
      }, s.at));
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#e8e8d8] flex flex-col items-center justify-center overflow-hidden font-['Space_Grotesk',sans-serif] rounded-xl border-2 border-[#1a1a1a]">

      {STARS.map((s, i) => (
        <span key={i} className="absolute [animation:var(--animate-star-pop)]"
          style={{ ...s.style, animationDelay: s.delay } as CSSProperties}>
          <svg width={s.size} height={s.size} viewBox="0 0 22 22">
            <path d="M11 1l2.4 7.4H21l-6.2 4.5 2.4 7.4L11 16l-6.2 4.3 2.4-7.4L1 8.4h7.6z"
              fill={s.color} stroke="#1a1a1a" strokeWidth="1.2" />
          </svg>
        </span>
      ))}

      <div className="w-[min(500px,90%)] bg-[#1a1a1a] rounded-xl border-2 border-[#333] overflow-hidden [animation:var(--animate-fade-up)]">
        {/* Title bar */}
        <div className="bg-[#2a2a2a] px-3.5 py-2.5 flex items-center gap-1.5 border-b border-[#333]">
          <div className="w-3 h-3 rounded-full bg-[#f97b50]" />
          <div className="w-3 h-3 rounded-full bg-[#f5c842]" />
          <div className="w-3 h-3 rounded-full bg-[#c8f060]" />
          <span className="ml-2 text-[12px] text-[#666] font-mono">asad@portfolio ~ main</span>
        </div>

        <div ref={termRef} className="p-5 font-mono text-[13px] leading-[1.8] min-h-[180px] overflow-y-auto">
          {visibleLines.map((line, i) => (
            <div key={i} className="flex items-start gap-2 opacity-0 [animation:var(--animate-line-in)]">
              {line.prompt && <span className="text-[#c8f060] shrink-0">❯</span>}
              {line.cursor ? (
                <span>
                  <span className="inline-block w-2 h-[14px] bg-[#c8f060] align-middle [animation:var(--animate-blink)]" />
                </span>
              ) : (
                <span className={line.cls}>{line.text}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="w-[min(500px,90%)] mt-5 [animation:var(--animate-fade-up-delay)]">
        <div className="flex justify-between font-mono text-[12px] text-[#888] mb-1.5">
          <span>{prog.text}</span>
          <span>{prog.pct}%</span>
        </div>
        <div className="h-1.5 bg-[#ccc] rounded-full overflow-hidden border-[1.5px] border-[#1a1a1a]">
          <div
            className="h-full rounded-sm transition-all duration-100 ease-linear"
            style={{
              width: `${prog.pct}%`,
              background: "linear-gradient(90deg,#c8f060,#f97b50,#f5c842,#6ec6f5,#e07fd4)",
            }}
          />
        </div>
      </div>

      {/* <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#1a1a1a] flex items-center px-4 gap-4">
        <div className="w-1.5 h-1.5 rounded-full bg-[#c8f060]" />
        <span className="font-mono text-[11px] text-[#e07fd4]">✦ main</span>
        <span className="font-mono text-[11px] text-[#555]">|</span>
        <span className="font-mono text-[11px] text-[#c8f060]">
          {done ? "✓ up to date" : "syncing..."}
        </span>
        <span className="font-mono text-[11px] text-[#555] ml-auto">UTF-8</span>
        <span className="font-mono text-[11px] text-[#555]">bash</span>
      </div> */}
    </div>
  );
}