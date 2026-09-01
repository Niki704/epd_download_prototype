"use client";

import { useMemo } from "react";
import { DirectoryNode } from "@/types/tree";
import { filterTree } from "@/lib/tree-search";
import { SelectedFilters } from "@/lib/tree-filters";
import FolderNode from "./FolderNode";

interface DownloadTreeProps {
  roots: DirectoryNode[];
  pinnedRoot?: DirectoryNode | null;
  query: string;
  filters: SelectedFilters;
  pinnedBookIds?: Set<string>;
  onTogglePin?: (bookId: string) => void;
}

export default function DownloadTree({
  roots,
  pinnedRoot,
  query,
  filters,
  pinnedBookIds,
  onTogglePin,
}: DownloadTreeProps) {
  const isSearching = query.trim() !== "";

  const filteredRoots = useMemo(
    () =>
      roots
        .map((root) => filterTree(root, query) as DirectoryNode | null)
        .filter((r): r is DirectoryNode => r !== null),
    [roots, query],
  );

  const visibleRoots = pinnedRoot
    ? [pinnedRoot, ...filteredRoots]
    : filteredRoots;

  return (
    <div
      className="overflow-hidden rounded-xl select-none border border-border shadow-sm bg-cover bg-center"
      style={{ backgroundImage: "url(/sidebar.png)" }}
    >
      <div className="divide-y divide-border bg-white/92">
        {visibleRoots.length === 0 ? (
          <p className="animate-fade-in px-4 py-8 text-center text-[14px] text-ink-muted">
            {roots.length === 0 && !pinnedRoot
              ? "No books match the selected filters."
              : `No books found for &ldquo;${query}&rdquo;.`}
          </p>
        ) : (
          visibleRoots.map((root) => (
            <FolderNode
              key={root.id}
              node={root}
              depth={0}
              forceOpen={isSearching}
              filters={filters}
              query={query}
              defaultOpen={
                root.id === "pinned-books"
                  ? true
                  : root.id === "pirivena"
                    ? false
                    : undefined
              }
              pinnedBookIds={pinnedBookIds}
              onTogglePin={onTogglePin}
            />
          ))
        )}
      </div>
    </div>
  );
}
