"use client";

import { useMemo } from "react";
import { DirectoryNode } from "@/types/tree";
import { filterTree } from "@/lib/tree-search";
import FolderNode from "./FolderNode";

interface DownloadTreeProps {
  root: DirectoryNode;
  query: string;
}

export default function DownloadTree({ root, query }: DownloadTreeProps) {
  const filtered = useMemo(
    () => filterTree(root, query) as DirectoryNode | null,
    [root, query],
  );
  const isSearching = query.trim() !== "";

  return (
    <div
      className="overflow-hidden rounded-xl border border-[#E4E1D8] shadow-sm bg-cover bg-center"
      style={{ backgroundImage: "url(/sidebar.png)" }}
    >
      <div className="bg-white/92">
        {filtered ? (
          <FolderNode
            node={filtered}
            depth={0}
            forceOpen={isSearching}
            query={query}
          />
        ) : (
          <p className="px-4 py-8 text-center text-[14px] text-[#5B615F]">
            No books found for &ldquo;{query}&rdquo;.
          </p>
        )}
      </div>
    </div>
  );
}
