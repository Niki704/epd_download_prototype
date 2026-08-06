"use client";

import { forwardRef, useState } from "react";
import { X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SUGGESTED_QUERIES = [
  "grade 6 mathematics",
  "further learning",
  "activity books",
  "grade 10 science",
  "common english books",
];

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  function SearchBar({ value, onChange }, ref) {
    const [suggestionsDismissed, setSuggestionsDismissed] = useState(false);
    const showSuggestions = !suggestionsDismissed && value.trim() === "";

    return (
      <div className="w-full max-w-40 sm:max-w-60 md:max-w-80">
        <div className="relative">
          <span
            aria-hidden
            className="pointer-events-none absolute left-2 sm:left-3 top-[55%] sm:top-1/2 block h-3 w-3 sm:h-4 sm:w-4 z-10 -translate-y-1/2 bg-white/60"
            style={{
              maskImage: "url(/search.svg)",
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskImage: "url(/search.svg)",
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
            }}
          />
          <input
            ref={ref}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="eg: physical grade 7 sinhala"
            className="w-full rounded-full border border-white/25 bg-white/10 py-1 sm:py-2 pl-6 sm:pl-9 pr-6 sm:pr-9 text-[9px] sm:text-[14px] text-white placeholder:text-white/60 backdrop-blur-sm outline-none transition-colors focus:border-white/60 focus:bg-white/15"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 transition-colors hover:text-white"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <p className="mt-1 sm:mt-1.5 px-1 text-[9px] sm:text-[11.5px] leading-snug text-white/55">
          Tip: combine keywords —{" "}
          <span className="text-white/75">
            &ldquo;geography grade 11 sinhala term 2&rdquo;
          </span>{" "}
          <span className="hidden sm:inline">jumps straight to the book.</span>
        </p>

        {showSuggestions && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5 px-1">
            {SUGGESTED_QUERIES.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => onChange(q)}
                className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11.5px] text-white/80 transition-colors hover:border-white/50 hover:bg-white/20 hover:text-white"
              >
                {q}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSuggestionsDismissed(true)}
              aria-label="Hide suggested searches"
              className="ml-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white/80"
            >
              <X size={13} />
            </button>
          </div>
        )}
      </div>
    );
  },
);

export default SearchBar;

