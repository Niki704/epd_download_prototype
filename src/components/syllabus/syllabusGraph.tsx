import { SyllabusGrid, getCellYear } from "@/lib/syllabus";

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

function HeatmapTable({ grid }: { grid: SyllabusGrid }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-1 text-left">
        <thead>
          <tr>
            <th className="px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-[#5B615F]">
              Grade
            </th>
            {grid.subjects.map((s) => (
              <th
                key={s}
                className="px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-[#5B615F]"
              >
                {s}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.grades.map((g) => (
            <tr key={g}>
              <td className="px-2 py-1 text-[13px] font-medium text-[#1C1F1E]">
                Grade {g}
              </td>
              {grid.subjects.map((s) => (
                <td key={s} className="min-w-23 px-1">
                  <CellBadge year={getCellYear(grid, g, s)} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface SyllabusGraphProps {
  grids: SyllabusGrid[];
}

export default function SyllabusGraph({ grids }: SyllabusGraphProps) {
  return (
    <section className="mt-10 rounded-xl border border-[#E4E1D8] bg-white p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl text-[#0F4C4A]">
            Syllabus Overview
          </h2>
          <p className="mt-1 text-[13px] text-[#5B615F]">
            Latest curriculum year in use, per subject and grade.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(YEAR_COLOR).map(([year, color]) => (
            <span
              key={year}
              className="flex items-center gap-1.5 text-[11px] text-[#5B615F]"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              {year}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-8">
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
