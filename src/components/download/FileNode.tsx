"use client";

import type { MouseEvent } from "react";
import { Download, FileText, Pin, PinOff } from "lucide-react";
import { BookNode } from "@/types/tree";
import { highlightTokens } from "@/lib/highlight-text";
import { useUserProfile } from "@/context/UserProfileContext";

interface FileNodeProps {
  node: BookNode;
  depth?: number;
  query?: string;
  isPinned?: boolean;
  onTogglePin?: (bookId: string) => void;
}

function formatDownloads(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

export default function FileNode({
  node,
  depth = 0,
  query = "",
  isPinned = false,
  onTogglePin,
}: FileNodeProps) {
  const { isStaff } = useUserProfile();

  const handlePinClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onTogglePin?.(node.id);
  };

  return (
    <div
      style={{ paddingLeft: `${depth * 1.25 + 0.75}rem` }}
      className="group flex items-center gap-2 rounded-md py-2 pr-3 transition-colors hover:bg-[#BE123C]/[0.06] focus-visible:outline focus-visible:outline-[#0F4C4A]"
    >
      <span className="w-4 shrink-0" />
      <a
        href={node.fileUrl}
        download
        className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden"
      >
        <FileText size={16} className="shrink-0 text-[#C79A3E]" />
        <span className="truncate text-[14px] text-[#1C1F1E]">
          {highlightTokens(node.name, query)}
        </span>
      </a>

      <span className="ml-auto flex shrink-0 items-center gap-3 text-[12px] text-[#5B615F]">
        {isStaff && (
          <span className="font-mono" title="Latest print year">
            {node.printYear}
          </span>
        )}
        <span className="font-mono">{node.fileSize}</span>
        <span
          className="flex items-center gap-1 font-mono"
          title={`${node.downloads.toLocaleString()} downloads`}
        >
          <Download size={13} className="text-[#5B615F]" />
          {formatDownloads(node.downloads)}
        </span>
        <Download
          size={15}
          className="text-[#5B615F] transition-colors group-hover:text-[#0F4C4A]"
        />
        <button
          type="button"
          onClick={handlePinClick}
          aria-label={isPinned ? "Unpin book" : "Pin book"}
          title={isPinned ? "Unpin this book" : "Pin this book"}
          className={`flex h-6 w-6 items-center justify-center rounded-md border transition-all ${
            isPinned
              ? "border-[#0F4C4A]/30 bg-[#0F4C4A]/10 text-[#0F4C4A] opacity-100"
              : "border-transparent bg-transparent text-[#5B615F] opacity-0 group-hover:opacity-100 hover:border-[#0F4C4A]/20 hover:bg-[#0F4C4A]/5"
          }`}
        >
          {isPinned ? <PinOff size={14} /> : <Pin size={14} />}
        </button>
      </span>
    </div>
  );
}
