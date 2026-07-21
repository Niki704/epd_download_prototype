import { Download, FileText } from "lucide-react";
import { BookNode } from "@/types/tree";
import { highlightTokens } from "@/lib/highlight-text";

interface FileNodeProps {
  node: BookNode;
  depth?: number;
  query?: string;
}

export default function FileNode({ node, depth = 0, query = "" }: FileNodeProps) {
  return (
    <a
      href={node.fileUrl}
      download
      style={{ paddingLeft: `${depth * 1.25 + 0.75}rem` }}
      className="group flex items-center gap-2 rounded-md py-2 pr-3 transition-colors hover:bg-[#0F4C4A0F] focus-visible:outline focus-visible:outline-[#0F4C4A]"
    >
      <span className="w-4 shrink-0" />
      <FileText size={16} className="shrink-0 text-[#C79A3E]" />
      <span className="truncate text-[14px] text-[#1C1F1E]">
        {highlightTokens(node.name, query)}
      </span>
      <span className="ml-auto flex shrink-0 items-center gap-3 text-[12px] text-[#5B615F]">
        <span className="font-mono">{node.year}</span>
        <span className="font-mono">{node.fileSize}</span>
        <Download
          size={15}
          className="text-[#5B615F] transition-colors group-hover:text-[#0F4C4A]"
        />
      </span>
    </a>
  );
}