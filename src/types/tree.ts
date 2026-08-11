export type Medium = "sinhala" | "tamil" | "english";

export type NodeKind =
  | "category"
  | "medium"
  | "grade"
  | "bookType"
  | "subject"
  | "term"
  | "book";

interface BaseNode {
  id: string;
  name: string;
}

export interface DirectoryNode extends BaseNode {
  kind: "category" | "medium" | "grade" | "bookType" | "subject" | "term";
  children: TreeNode[];
}

export interface BookNode extends BaseNode {
  kind: "book";
  subject: string;
  /**
   * Latest PRINT year for this book — i.e. when this copy was most
   * recently produced. This is NOT the curriculum/syllabus version.
   * Curriculum version, edition, and print-batch tracking are separate
   * concepts we don't model yet (see conversation notes / lib/print-years.ts).
   * Do not present this field to users as "syllabus year."
   */
  printYear: number;
  fileSize: string;
  fileUrl: string;
  downloads: number;
}

export type TreeNode = DirectoryNode | BookNode;

export function isDirectory(node: TreeNode): node is DirectoryNode {
  return node.kind !== "book";
}
