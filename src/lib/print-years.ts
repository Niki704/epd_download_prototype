import { DirectoryNode, isDirectory } from "@/types/tree";

/**
 * IMPORTANT: This models "latest print year" — the most recent print run
 * of a book — NOT curriculum or syllabus version. Until curriculum data is
 * tracked as its own concept (with its own version history, independent of
 * printing), this is the best proxy available, and the UI must say so
 * explicitly wherever this data is shown.
 */

export interface PrintYearGrid {
  title: string;
  grades: number[];
  subjects: string[];
  cells: Map<string, number>; // key: `${grade}|${subject}` → latest year
}

function cellKey(grade: number, subject: string): string {
  return `${grade}|${subject}`;
}

function collectBooks(
  node: DirectoryNode,
  grade: number | null,
  acc: { grade: number; subject: string; printYear: number }[],
) {
  for (const child of node.children) {
    if (isDirectory(child)) {
      const nextGrade =
        child.kind === "grade"
          ? parseInt(child.name.replace("Grade ", ""), 10)
          : grade;
      collectBooks(child, nextGrade, acc);
    } else if (grade !== null) {
      acc.push({ grade, subject: child.subject, printYear: child.printYear });
    }
  }
}

export function buildPrintYearGrid(
  categoryNode: DirectoryNode,
  title: string,
): PrintYearGrid {
  const collected: { grade: number; subject: string; printYear: number }[] = [];
  collectBooks(categoryNode, null, collected);

  const gradeSet = new Set<number>();
  const subjectSet = new Set<string>();
  const cells = new Map<string, number>();

  for (const { grade, subject, printYear } of collected) {
    gradeSet.add(grade);
    subjectSet.add(subject);
    const key = cellKey(grade, subject);
    const existing = cells.get(key);
    if (existing === undefined || printYear > existing)
      cells.set(key, printYear);
  }

  return {
    title,
    grades: [...gradeSet].sort((a, b) => a - b),
    subjects: [...subjectSet].sort(),
    cells,
  };
}

export function getCellYear(
  grid: PrintYearGrid,
  grade: number,
  subject: string,
): number | null {
  return grid.cells.get(cellKey(grade, subject)) ?? null;
}
