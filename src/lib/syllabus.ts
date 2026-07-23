import { DirectoryNode, isDirectory } from "@/types/tree";

export interface SyllabusGrid {
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
  acc: { grade: number; subject: string; year: number }[],
) {
  for (const child of node.children) {
    if (isDirectory(child)) {
      const nextGrade =
        child.kind === "grade"
          ? parseInt(child.name.replace("Grade ", ""), 10)
          : grade;
      collectBooks(child, nextGrade, acc);
    } else if (grade !== null) {
      acc.push({ grade, subject: child.subject, year: child.year });
    }
  }
}

export function buildSyllabusGrid(
  categoryNode: DirectoryNode,
  title: string,
): SyllabusGrid {
  const collected: { grade: number; subject: string; year: number }[] = [];
  collectBooks(categoryNode, null, collected);

  const gradeSet = new Set<number>();
  const subjectSet = new Set<string>();
  const cells = new Map<string, number>();

  for (const { grade, subject, year } of collected) {
    gradeSet.add(grade);
    subjectSet.add(subject);
    const key = cellKey(grade, subject);
    const existing = cells.get(key);
    if (existing === undefined || year > existing) cells.set(key, year);
  }

  return {
    title,
    grades: [...gradeSet].sort((a, b) => a - b),
    subjects: [...subjectSet].sort(),
    cells,
  };
}

export function getCellYear(
  grid: SyllabusGrid,
  grade: number,
  subject: string,
): number | null {
  return grid.cells.get(cellKey(grade, subject)) ?? null;
}
