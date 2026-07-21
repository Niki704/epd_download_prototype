"use client";

import { useMemo, useState } from "react";
import {
  BookMarked,
  BookOpenCheck,
  ChevronRight,
  Folder,
  FolderOpen,
  GraduationCap,
  Layers,
} from "lucide-react";
import { DirectoryNode, isDirectory } from "@/types/tree";
import { highlightTokens } from "@/lib/highlight-text";
import FileNode from "./FileNode";

const KIND_ICON: Record<DirectoryNode["kind"], typeof Folder> = {
  category: Layers,
  medium: GraduationCap,
  grade: Folder,
  bookType: BookMarked,
  subject: BookOpenCheck,
};

function countBooks(node: DirectoryNode): number {
  return node.children.reduce(
    (sum, child) => sum + (isDirectory(child) ? countBooks(child) : 1),
    0
  );
}

interface FolderNodeProps {
  node: DirectoryNode;
  depth?: number;
  forceOpen?: boolean;
  query?: string;
}

export default function FolderNode({
  node,
  depth = 0,
  forceOpen = false,
  query = "",
}: FolderNodeProps) {
  const [manualOpen, setManualOpen] = useState(depth === 0);
  const open = forceOpen || manualOpen;
  const Icon = KIND_ICON[node.kind];
  const bookCount = useMemo(() => countBooks(node), [node]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setManualOpen((v) => !v)}
        disabled={forceOpen}
        aria-expanded={open}
        style={{ paddingLeft: `${depth * 1.25 + 0.75}rem` }}
        className="flex w-full items-center gap-2 rounded-md py-2 pr-3 text-left transition-colors hover:bg-[#0F4C4A0F] focus-visible:outline focus-visible:outline-[#0F4C4A] disabled:cursor-default"
      >
        <ChevronRight
          size={16}
          className={`shrink-0 text-[#5B615F] transition-transform duration-200 ${
            open ? "rotate-90" : ""
          }`}
        />
        {open ? (
          <FolderOpen size={17} className="shrink-0 text-[#0F4C4A]" />
        ) : (
          <Icon size={17} className="shrink-0 text-[#0F4C4A]" />
        )}
        <span className="truncate text-[15px] font-medium text-[#1C1F1E]">
          {highlightTokens(node.name, query)}
        </span>
        <span className="ml-auto shrink-0 rounded-full bg-[#E4E1D8] px-2 py-0.5 font-mono text-[11px] text-[#5B615F]">
          {bookCount}
        </span>
      </button>

      {open && (
        <div>
          {node.children.map((child) =>
            isDirectory(child) ? (
              <FolderNode
                key={child.id}
                node={child}
                depth={depth + 1}
                forceOpen={forceOpen}
                query={query}
              />
            ) : (
              <FileNode
                key={child.id}
                node={child}
                depth={depth + 1}
                query={query}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}
