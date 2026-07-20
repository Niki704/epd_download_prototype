export interface TreeNode {
  id: string;
  name: string;
  type: "folder" | "file";

  children?: TreeNode[];

  size?: string;

  downloaded?: boolean;
}