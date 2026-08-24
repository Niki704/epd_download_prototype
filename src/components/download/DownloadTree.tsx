"use client";

import { useMemo } from "react";
import { DirectoryNode } from "@/types/tree";
import { filterTree } from "@/lib/tree-search";
import { SelectedFilters } from "@/lib/tree-filters";
import FolderNode from "./FolderNode";

interface DownloadTreeProps {
  roots: DirectoryNode[];
  query: string;
  filters: SelectedFilters;
}

export default function DownloadTree({
  roots,
  query,
  filters,
}: DownloadTreeProps) {
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
      className="overflow-hidden rounded-xl select-none border border-border shadow-sm bg-cover bg-center"
      style={{ backgroundImage: "url(/sidebar.png)" }}
    >
      <div className="divide-y divide-border bg-white/92">
        {roots.length === 0 ? (
          <p className="animate-fade-in px-4 py-8 text-center text-[14px] text-ink-muted">
            No books match the selected filters.
          </p>
        ) : filteredRoots.length > 0 ? (
          filteredRoots.map((root) => (
            <FolderNode
              key={root.id}
              node={root}
              depth={0}
              forceOpen={isSearching}
              filters={filters}
              query={query}
              defaultOpen={root.id === "pirivena" ? false : undefined}
            />
          ))
        ) : (
          <p className="animate-fade-in px-4 py-8 text-center text-[14px] text-ink-muted">
            No books found for &ldquo;{query}&rdquo;.
          </p>
        )}
      </div>
    </div>
  );
}
