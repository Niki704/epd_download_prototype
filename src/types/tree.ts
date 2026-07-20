export type Medium = "sinhala" | "tamil" | "english";

export type NodeKind = "category" | "medium" | "grade" | "book";

interface BaseNode {
  id: string;
  name: string;
}

/** A node that contains other nodes (category, medium, or grade level) */
export interface DirectoryNode extends BaseNode {
  kind: "category" | "medium" | "grade";
  children: TreeNode[];
}

/** A leaf node representing a downloadable book */
export interface BookNode extends BaseNode {
  kind: "book";
  subject: string;
  year: number;
  fileSize: string;
  fileUrl: string;
}

export type TreeNode = DirectoryNode | BookNode;

export function isDirectory(node: TreeNode): node is DirectoryNode {
  return node.kind !== "book";
}
