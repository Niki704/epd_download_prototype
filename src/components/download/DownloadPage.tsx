"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Header from "./Header";
import DownloadTree from "./DownloadTree";
import SearchBar from "./SearchBar";
import FilterChipBar from "./FilterChipBar";
import { downloadRoots, printYearGrids } from "@/data/files";
import { BookNode, DirectoryNode, TreeNode, isDirectory } from "@/types/tree";
import {
  computeAvailableFacets,
  emptySelectedFilters,
  filterTreeByFacets,
} from "@/lib/tree-filters";
import TMGraph from "@/components/tm-graph/TMGraph";
import PrintYearOverview from "@/components/syllabus/PrintYearOverview";
import {
  UserProfileProvider,
  useUserProfile,
} from "@/context/UserProfileContext";

function collectPinnedBooks(
  nodes: TreeNode[],
  pinnedIds: Set<string>,
  acc: BookNode[] = [],
): BookNode[] {
  for (const node of nodes) {
    if (isDirectory(node)) {
      collectPinnedBooks(node.children, pinnedIds, acc);
      continue;
    }

    if (pinnedIds.has(node.id)) {
      acc.push(node);
    }
  }

  return acc;
}

function removePinnedBooks(
  node: TreeNode,
  pinnedIds: Set<string>,
): TreeNode | null {
  if (!isDirectory(node)) {
    return pinnedIds.has(node.id) ? null : node;
  }

  const children = node.children
    .map((child) => removePinnedBooks(child, pinnedIds))
    .filter((child): child is TreeNode => child !== null);

  return children.length > 0 ? { ...node, children } : null;
}

function DownloadPageContent() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(emptySelectedFilters());
  const [pinnedBookIds, setPinnedBookIds] = useState<Set<string>>(new Set());
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { isStaff } = useUserProfile();

  // Chip availability is recomputed against the full tree each time filters
  // change (each facet excludes its own selection when computing its own
  // options — see computeAvailableFacets), so chips never go stale as the
  // user narrows down.
  const availableFacets = useMemo(
    () => computeAvailableFacets(downloadRoots, filters),
    [filters],
  );

  const pinnedBooks = useMemo(
    () => collectPinnedBooks(downloadRoots, pinnedBookIds),
    [pinnedBookIds],
  );

  const pinnedRoot = useMemo<DirectoryNode | null>(
    () =>
      pinnedBooks.length > 0
        ? {
            id: "pinned-books",
            kind: "category",
            name: "Pinned Books",
            children: pinnedBooks,
          }
        : null,
    [pinnedBooks],
  );

  const togglePinnedBook = (bookId: string) => {
    setPinnedBookIds((current) => {
      const next = new Set(current);
      if (next.has(bookId)) {
        next.delete(bookId);
      } else {
        next.add(bookId);
      }
      return next;
    });
  };

  // Structural filtering runs BEFORE the tree's own text search — it just
  // narrows which roots/branches even reach DownloadTree, so the existing
  // filterTree(query) logic there keeps working unmodified and the two
  // combine as a plain AND.
  const structurallyFilteredRoots = useMemo(
    () =>
      downloadRoots
        .map((root) => {
          const withoutPinned = removePinnedBooks(root, pinnedBookIds);
          return withoutPinned
            ? (filterTreeByFacets(
                withoutPinned,
                filters,
              ) as DirectoryNode | null)
            : null;
        })
        .filter((root): root is DirectoryNode => root !== null),
    [filters, pinnedBookIds],
  );

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const active = document.activeElement;
      const isTypingElsewhere =
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement ||
        (active instanceof HTMLElement && active.isContentEditable);

      // Only redirect focus for plain, single printable characters — not
      // Tab/Escape/Enter/arrow keys, and not modifier combos like Cmd+C,
      // Ctrl+R, etc., so browser/OS shortcuts keep working normally.
      const isPlainPrintableKey =
        e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;

      if (!isTypingElsewhere && isPlainPrintableKey) {
        searchInputRef.current?.focus();
        // Don't preventDefault — letting the keydown continue naturally
        // means the character the user just typed lands in the input,
        // since focus moves before the browser's default keypress handling.
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <Header />
      <main className="px-4 py-10 sm:px-6">
        <div className="mx-auto mb-6 w-full max-w-5xl sm:mb-8">
          <FilterChipBar
            available={availableFacets}
            selected={filters}
            onChange={setFilters}
          />
          <SearchBar ref={searchInputRef} value={query} onChange={setQuery} />
        </div>
        <div className="mx-auto w-full max-w-3xl">
          <DownloadTree
            roots={structurallyFilteredRoots}
            pinnedRoot={pinnedRoot}
            query={query}
            filters={filters}
            pinnedBookIds={pinnedBookIds}
            onTogglePin={togglePinnedBook}
          />
          <TMGraph />
          {isStaff && <PrintYearOverview grids={printYearGrids} />}
        </div>
      </main>
    </>
  );
}

export default function DownloadPage() {
  return (
    <UserProfileProvider>
      <DownloadPageContent />
    </UserProfileProvider>
  );
}
