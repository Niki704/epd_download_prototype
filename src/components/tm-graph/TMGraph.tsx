import {
  TM_GRADES,
  TM_YEARS,
  getTMStatus,
  getCurrentYear,
  moduleLabelForGrade,
} from "@/lib/tm-graph";
import { useEffect, useRef, useState } from "react";

function StatusCell({ grade, year }: { grade: number; year: number }) {
  const status = getTMStatus(grade, year);
  const isCurrentYear = year === getCurrentYear();
  const isM = status === "M";

  return (
    <span
      title={`Grade ${grade}, ${year}: ${
        isM ? `Module (${moduleLabelForGrade(grade)})` : "Textbook"
      }`}
      className={`flex h-7 w-7 items-center justify-center rounded-md font-mono text-[12px] font-medium ${
        isM ? "bg-[#0F4C4A] text-white" : "bg-[#E4E1D8] text-[#5B615F]"
      } ${isCurrentYear ? "ring-2 ring-[#C79A3E] ring-offset-1" : ""}`}
    >
      {status}
    </span>
  );
}

export default function TMGraph() {
  const currentYear = getCurrentYear();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    function checkOverflow() {
      const el = scrollRef.current;
      if (el) setIsOverflowing(el.scrollWidth > el.clientWidth);
    }
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  return (
    <section className="mt-10 rounded-xl border border-[#E4E1D8] bg-white p-5 sm:p-6">
      <div className="mb-1">
        <h2 className="font-display text-xl text-[#0F4C4A]">TM Graph</h2>
        <p className="mt-1 text-[13px] text-[#5B615F]">
          Shows which grades have transitioned from Textbooks (T) to Modules
          (M), year by year. Updates automatically as real time passes — no
          manual edits needed as new grades convert each year.
        </p>
      </div>

      <div className="mt-5 flex items-start justify-between gap-6">
        <div className="relative min-w-0">
          <div ref={scrollRef} className="overflow-x-auto">
            <table className="border-separate text-left [border-spacing:0.85rem_0.25rem]">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 bg-white px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-[#5B615F] shadow-[4px_0_6px_-4px_rgba(0,0,0,0.12)]">
                    Grade
                  </th>
                  {TM_YEARS.map((y) => (
                    <th
                      key={y}
                      className={`px-1 py-1 text-center font-mono text-[11px] font-medium ${
                        y === currentYear ? "text-[#C79A3E]" : "text-[#5B615F]"
                      }`}
                    >
                      {y}
                      {y === currentYear && (
                        <div className="mt-0.5 text-[9px] uppercase tracking-wide text-[#C79A3E]">
                          Today
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TM_GRADES.map((g) => (
                  <tr key={g}>
                    <td className="sticky left-0 z-10 bg-white px-2 py-1 text-[13px] font-medium text-[#1C1F1E] shadow-[4px_0_6px_-4px_rgba(0,0,0,0.12)]">
                      Grade {g}
                    </td>
                    {TM_YEARS.map((y) => (
                      <td key={y} className="px-0.5 py-0.5">
                        <StatusCell grade={g} year={y} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {isOverflowing && (
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent" />
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-2 text-[12px] text-[#5B615F] sm:pt-8">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-[#E4E1D8]" /> T — Textbooks
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-[#0F4C4A]" /> M — Modules
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-green-500" /> Grade newly
            transitioned
          </span>
          <span> to Modules this year</span>
        </div>
      </div>

      <p className="mt-5 border-t border-[#E4E1D8] pt-4 text-[12px] leading-snug text-[#5B615F]">
        For Grades 1–5, M means <strong>Activity Books</strong>. For Grades
        6–11, M means{" "}
        <strong>
          Essential Learning, Further Learning &amp; Transversal Skills Books
        </strong>
        .
      </p>
    </section>
  );
}
