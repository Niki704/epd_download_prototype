import { TreeNode, isDirectory, BookNode } from "@/types/tree";

function tokenize(query: string): string[] {
  return query.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

function bookSearchText(book: BookNode, ancestorPath: string): string {
  return `${ancestorPath} ${book.name} ${book.subject}`.toLowerCase();
}

/**
 * Multi-token AND search across the full ancestor path (e.g. "Modules >
 * Further Learning Books > Sinhala Medium > Grade 7 > Health & Physical
 * Education"), not just the leaf book's own name.
 *
 * Every token must appear *somewhere* along that path, but different
 * tokens can each match a different level. "physical grade 7 sinhala"
 * matches because "physical" is in the book name, "grade"/"7" are in the
 * Grade folder, and "sinhala" is in the Medium folder — even though no
 * single node contains the full phrase.
 */
export function filterTree(
  node: TreeNode,
  query: string,
  ancestorPath = "",
): TreeNode | null {
  const tokens = tokenize(query);
  if (tokens.length === 0) return node;

  const currentPath = ancestorPath ? `${ancestorPath} ${node.name}` : node.name;

  if (!isDirectory(node)) {
    const text = bookSearchText(node, ancestorPath);
    return tokens.every((t) => text.includes(t)) ? node : null;
  }

  // If every token is already satisfied by the folder path itself, every
  // descendant book satisfies it too (their path is a superset) — so keep
  // the whole subtree without needing to prune deeper.
  const selfPathLower = currentPath.toLowerCase();
  if (tokens.every((t) => selfPathLower.includes(t))) {
    return node;
  }

  const filteredChildren = node.children
    .map((child) => filterTree(child, query, currentPath))
    .filter((child): child is TreeNode => child !== null);

  return filteredChildren.length > 0
    ? { ...node, children: filteredChildren }
    : null;
}
