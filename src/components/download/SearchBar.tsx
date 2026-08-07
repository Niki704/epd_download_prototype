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
      <div className="w-full max-w-none">
        <div className="relative">
          <span
            aria-hidden
            className="pointer-events-none absolute left-2 sm:left-3 top-[55%] sm:top-1/2 block h-3 w-3 sm:h-4 sm:w-4 z-10 -translate-y-1/2 bg-[#5B615F]"
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
            className="w-full rounded-full border border-[#D5D1C7] bg-white py-1.5 sm:py-2 pl-6 sm:pl-9 pr-6 sm:pr-9 text-[11px] sm:text-[14px] text-[#1C1F1E] placeholder:text-[#5B615F]/70 outline-none transition-colors focus:border-[#0F4C4A]/50"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5B615F] transition-colors hover:text-[#1C1F1E]"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <p className="mt-1 sm:mt-1.5 px-1 text-[10px] sm:text-[11.5px] leading-snug text-[#5B615F]">
          Tip: combine keywords —{" "}
          <span className="text-[#1C1F1E]">
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
                className="rounded-full border border-[#D5D1C7] bg-[#F6F5F1] px-3 py-1 text-[11.5px] text-[#3F4543] transition-colors hover:border-[#0F4C4A]/35 hover:bg-[#EDEAE1] hover:text-[#1C1F1E]"
              >
                {q}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSuggestionsDismissed(true)}
              aria-label="Hide suggested searches"
              className="ml-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[#5B615F] transition-colors hover:bg-[#EDEAE1] hover:text-[#1C1F1E]"
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
