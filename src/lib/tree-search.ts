import { TreeNode, isDirectory } from "@/types/tree";

/**
 * Returns a pruned copy of the tree containing only nodes that match the
 * query, plus their ancestor folders. Returns null if nothing matches.
 * If a folder's own name matches, its entire subtree is kept as-is.
 */
export function filterTree(node: TreeNode, query: string): TreeNode | null {
  const q = query.trim().toLowerCase();
  if (!q) return node;

  if (!isDirectory(node)) {
    return node.name.toLowerCase().includes(q) ||
      node.subject.toLowerCase().includes(q)
      ? node
      : null;
  }

  if (node.name.toLowerCase().includes(q)) {
    return node;
  }

  const filteredChildren = node.children
    .map((child) => filterTree(child, q))
    .filter((child): child is TreeNode => child !== null);

  if (filteredChildren.length === 0) return null;

  return { ...node, children: filteredChildren };
}
