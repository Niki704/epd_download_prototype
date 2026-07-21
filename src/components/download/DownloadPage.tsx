"use client";

import { useState } from "react";
import Header from "./Header";
import DownloadTree from "./DownloadTree";
import { downloadRoots } from "@/data/files";

export default function DownloadPage() {
  const [query, setQuery] = useState("");

  return (
    <>
      <Header query={query} onQueryChange={setQuery} />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <DownloadTree roots={downloadRoots} query={query} />
      </main>
    </>
  );
}
