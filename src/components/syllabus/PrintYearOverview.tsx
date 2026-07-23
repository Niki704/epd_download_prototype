import { PrintYearGrid, getCellYear } from "@/lib/print-years";

const YEAR_COLOR: Record<number, string> = {
  2019: "#7A2E3B", // maroon — oldest, most overdue for revision
  2021: "#C79A3E", // gold
  2023: "#4B8073", // muted teal
  2025: "#0F4C4A", // primary teal — most recent
};

function CellBadge({ year }: { year: number | null }) {
  if (year === null) {
    return (
      <span className="block rounded-md bg-[#E4E1D8]/50 py-2 text-center text-[12px] text-[#5B615F]/50">
        —
      </span>
    );
  }
  return (
    <span
      className="block rounded-md py-2 text-center font-mono text-[12px] font-medium text-white"
      style={{ backgroundColor: YEAR_COLOR[year] ?? "#5B615F" }}
    >
      {year}
    </span>
  );
}

function HeatmapTable({ grid }: { grid: PrintYearGrid }) {
  return (
    <div className="relative">
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-1 text-left">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-white px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-[#5B615F] shadow-[4px_0_6px_-4px_rgba(0,0,0,0.12)]">
                Grade
              </th>
              {grid.subjects.map((s) => (
                <th
                  key={s}
                  className="min-w-[110px] px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-[#5B615F]"
                >
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.grades.map((g) => (
              <tr key={g}>
                <td className="sticky left-0 z-10 bg-white px-2 py-1 text-[13px] font-medium text-[#1C1F1E] shadow-[4px_0_6px_-4px_rgba(0,0,0,0.12)]">
                  Grade {g}
                </td>
                {grid.subjects.map((s) => (
                  <td key={s} className="min-w-[110px] px-1">
                    <CellBadge year={getCellYear(grid, g, s)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hints that more columns exist off-screen to the right */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent" />
    </div>
  );
}

interface PrintYearOverviewProps {
  grids: PrintYearGrid[];
}

export default function PrintYearOverview({ grids }: PrintYearOverviewProps) {
  return (
    <section className="mt-10 rounded-xl border border-[#E4E1D8] bg-white p-5 sm:p-6">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl text-[#0F4C4A]">
            Latest Print Year Overview
          </h2>
          <p className="mt-1 max-w-lg text-[13px] text-[#5B615F]">
            Shows the most recent print run available per subject and grade.
            This reflects printing history only — it is not the curriculum
            or syllabus version, which is tracked separately.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(YEAR_COLOR).map(([year, color]) => (
            <span key={year} className="flex items-center gap-1.5 text-[11px] text-[#5B615F]">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
              {year}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-8">
        {grids.map((grid) => (
          <div key={grid.title}>
            <h3 className="mb-2 text-[13px] font-medium text-[#1C1F1E]">
              {grid.title}
            </h3>
            <HeatmapTable grid={grid} />
          </div>
        ))}
      </div>
    </section>
  );
}
