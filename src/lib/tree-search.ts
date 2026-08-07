import { TreeNode, isDirectory, BookNode } from "@/types/tree";

function tokenize(query: string): string[] {
  return query.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

function isNumericToken(token: string): boolean {
  return /^\d+$/.test(token);
}

function parseGradeNumber(name: string): number | null {
  const match = name.match(/^Grade\s+(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
}

function bookSearchText(book: BookNode, ancestorPath: string): string {
  return `${ancestorPath} ${book.name} ${book.subject}`.toLowerCase();
}

/**
 * Multi-token AND search across the full ancestor path (e.g. "Modules >
 * Further Learning Books > Sinhala Medium > Grade 7 > Health & Physical
 * Education"). Every token must be satisfied somewhere along that path,
 * but different tokens can each match a different level.
 *
 * Numeric tokens (e.g. "5") are the one exception to plain substring
 * matching: they're matched ONLY against an exact Grade node number along
 * the path, never as a loose substring. Without this, searching "5" would
 * match every grade inside a category folder like "Grade 1 – 5", since
 * that range label itself contains the digit "5" — even for Grade 1, 2,
 * 3, and 4, which obviously aren't Grade 5.
 */
export function filterTree(
  node: TreeNode,
  query: string,
  ancestorPath = "",
  ancestorGrade: number | null = null,
): TreeNode | null {
  const tokens = tokenize(query);
  if (tokens.length === 0) return node;

  const currentGrade =
    isDirectory(node) && node.kind === "grade"
      ? (parseGradeNumber(node.name) ?? ancestorGrade)
      : ancestorGrade;

  const currentPath = ancestorPath ? `${ancestorPath} ${node.name}` : node.name;

  function matchesAllTokens(text: string, grade: number | null): boolean {
    return tokens.every((t) => {
      if (isNumericToken(t)) {
        return grade !== null && grade === parseInt(t, 10);
      }
      return text.includes(t);
    });
  }

  if (!isDirectory(node)) {
    const text = bookSearchText(node, ancestorPath);
    return matchesAllTokens(text, currentGrade) ? node : null;
  }

  // If every token is already satisfied at this folder level, every
  // descendant book satisfies it too — keep the whole subtree without
  // needing to prune deeper.
  const selfPathLower = currentPath.toLowerCase();
  if (matchesAllTokens(selfPathLower, currentGrade)) {
    return node;
  }

  const filteredChildren = node.children
    .map((child) => filterTree(child, query, currentPath, currentGrade))
    .filter((child): child is TreeNode => child !== null);

  return filteredChildren.length > 0
    ? { ...node, children: filteredChildren }
    : null;
}
