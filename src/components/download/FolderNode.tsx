"use client";

import { useMemo, useState } from "react";
import {
  ChevronRight,
  Folder,
  FolderOpen,
  GraduationCap,
  Library,
  Languages,
  BookMarked,
  BookOpenCheck,
  CalendarDays,
} from "lucide-react";
import { DirectoryNode, isDirectory } from "@/types/tree";
import { highlightTokens } from "@/lib/highlight-text";
import { getGradeBadge, parseGradeNumber } from "@/lib/tm-graph";
import FileNode from "./FileNode";

const KIND_ICON: Record<DirectoryNode["kind"], typeof Folder> = {
  category: Library,
  medium: Languages,
  grade: GraduationCap,
  bookType: BookMarked,
  subject: BookOpenCheck,
  term: CalendarDays,
};

// One distinct hover background per tree level — applied only to the row
// actually under the cursor, never cascaded to children or ancestors.
const KIND_HOVER_BG: Record<DirectoryNode["kind"], string> = {
  category: "hover:bg-[#0F4C4A]/[0.12]", // Color1 — primary teal
  medium: "hover:bg-[#C79A3E]/[0.14]", // Color2 — gold
  grade: "hover:bg-[#2563EB]/[0.12]", // Color3 — blue
  bookType: "hover:bg-[#7C3AED]/[0.10]", // Color4 — violet
  subject: "hover:bg-[#0D9488]/[0.10]", // teal-600, for the Subject level
  term: "hover:bg-[#EA580C]/[0.10]", // Color5 — orange
};

function countBooks(node: DirectoryNode): number {
  return node.children.reduce(
    (sum, child) => sum + (isDirectory(child) ? countBooks(child) : 1),
    0,
  );
}

// Pirivena isn't part of the T/M rollout system — its grade folders
// shouldn't show a badge even though the numbers overlap (1–5).
function getGradeBadgeFor(node: DirectoryNode) {
  if (node.kind !== "grade" || node.id.startsWith("pirivena")) return null;
  const gradeNumber = parseGradeNumber(node.name);
  if (gradeNumber === null || gradeNumber > 11) return null;
  return getGradeBadge(gradeNumber);
}

interface FolderNodeProps {
  node: DirectoryNode;
  depth?: number;
  forceOpen?: boolean;
  query?: string;
  defaultOpen?: boolean;
}

export default function FolderNode({
  node,
  depth = 0,
  forceOpen = false,
  query = "",
  defaultOpen,
}: FolderNodeProps) {
  const [manualOpen, setManualOpen] = useState(defaultOpen ?? depth === 0);
  const open = forceOpen || manualOpen;
  const Icon = KIND_ICON[node.kind];
  const bookCount = useMemo(() => countBooks(node), [node]);
  const badge = useMemo(() => getGradeBadgeFor(node), [node]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setManualOpen((v) => !v)}
        disabled={forceOpen}
        aria-expanded={open}
        style={{ paddingLeft: `${depth * 1.25 + 0.75}rem` }}
        className={`flex w-full items-center gap-2 rounded-md py-2 pr-3 text-left transition-colors focus-visible:outline focus-visible:outline-[#0F4C4A] disabled:cursor-default ${KIND_HOVER_BG[node.kind]}`}
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

        {badge && (
          <span
            title={
              badge.isNewThisYear
                ? `Transitioned to Modules this year`
                : badge.status === "M"
                  ? "Currently Modules"
                  : "Currently Textbooks"
            }
            className={`flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
              badge.status === "M"
                ? "bg-[#0F4C4A]/10 text-[#0F4C4A]"
                : "bg-[#E4E1D8] text-[#5B615F]"
            }`}
          >
            {badge.status}
            {badge.isNewThisYear && (
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            )}
          </span>
        )}

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
                // defaultOpen intentionally NOT passed down — it's a
                // root-level override only, deeper levels keep the normal
                // depth-based default.
              />
            ) : (
              <FileNode
                key={child.id}
                node={child}
                depth={depth + 1}
                query={query}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}
