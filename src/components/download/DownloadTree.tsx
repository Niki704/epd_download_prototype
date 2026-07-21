"use client";

import { useMemo } from "react";
import { DirectoryNode } from "@/types/tree";
import { filterTree } from "@/lib/tree-search";
import FolderNode from "./FolderNode";

interface DownloadTreeProps {
  roots: DirectoryNode[];
  query: string;
}

export default function DownloadTree({ roots, query }: DownloadTreeProps) {
  const isSearching = query.trim() !== "";

  const filteredRoots = useMemo(
    () =>
      roots
        .map((root) => filterTree(root, query) as DirectoryNode | null)
        .filter((r): r is DirectoryNode => r !== null),
    [roots, query],
  );

  return (
    <div
      className="overflow-hidden rounded-xl border border-[#E4E1D8] shadow-sm bg-cover bg-center"
      style={{ backgroundImage: "url(/sidebar.png)" }}
    >
      <div className="divide-y divide-[#E4E1D8] bg-white/92">
        {filteredRoots.length > 0 ? (
          filteredRoots.map((root) => (
            <FolderNode
              key={root.id}
              node={root}
              depth={0}
              forceOpen={isSearching}
              query={query}
            />
          ))
        ) : (
          <p className="px-4 py-8 text-center text-[14px] text-[#5B615F]">
            No books found for &ldquo;{query}&rdquo;.
          </p>
        )}
      </div>
    </div>
  );
}
