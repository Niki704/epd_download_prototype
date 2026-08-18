import { moduleStartYear } from "@/data/files";

export type TMStatus = "T" | "M";

export const TM_GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

// 2025 = last fully-Textbook year; 2032 = full rollout completion.
export const TM_YEARS = Array.from(
  { length: 2032 - 2025 + 1 },
  (_, i) => 2025 + i,
);

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

// Computed live — never hardcoded per year, so both the graph and the
// tree badges stay correct automatically as real time passes.
export function getTMStatus(grade: number, year: number): TMStatus {
  return year >= moduleStartYear(grade) ? "M" : "T";
}

export function moduleLabelForGrade(grade: number): string {
  return grade <= 5
    ? "Activity Books"
    : "Essential Learning, Further Learning & Transversal Skills Books";
}

export interface GradeBadgeInfo {
  status: TMStatus;
  isNewThisYear: boolean; // transitioned to Module exactly this year
}

// Single source both the TM Graph and the Grade-folder badges pull from.
export function getGradeBadge(grade: number): GradeBadgeInfo {
  const year = getCurrentYear();
  const status = getTMStatus(grade, year);
  const isNewThisYear = status === "M" && moduleStartYear(grade) === year;
  return { status, isNewThisYear };
}

// Grade folders outside the 1–11 Textbook/Module system (e.g. Pirivena)
// shouldn't show a T/M badge at all — this parses "Grade N" out of a
// folder name for badge purposes only.
export function parseGradeNumber(name: string): number | null {
  const match = name.match(/^Grade\s+(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
}
