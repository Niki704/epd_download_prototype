"use client";

import { useEffect, useRef, useState } from "react";
import Header from "./Header";
import DownloadTree from "./DownloadTree";
import SearchBar from "./SearchBar";
import { downloadRoots, printYearGrids } from "@/data/files";
import PrintYearOverview from "@/components/syllabus/PrintYearOverview";

export default function DownloadPage() {
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

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
          <SearchBar ref={searchInputRef} value={query} onChange={setQuery} />
        </div>
        <div className="mx-auto w-full max-w-3xl">
          <DownloadTree roots={downloadRoots} query={query} />
          <PrintYearOverview grids={printYearGrids} />
        </div>
      </main>
    </>
  );
}
