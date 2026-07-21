export type Medium = "sinhala" | "tamil" | "english";

export type NodeKind =
  | "category"
  | "medium"
  | "grade"
  | "bookType"
  | "subject"
  | "book";

interface BaseNode {
  id: string;
  name: string;
}

export interface DirectoryNode extends BaseNode {
  kind: "category" | "medium" | "grade" | "bookType" | "subject";
  children: TreeNode[];
}

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
