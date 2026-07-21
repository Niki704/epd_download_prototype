"use client";

import { X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="w-full max-w-40 sm:max-w-60 md:max-w-80">
      <div className="relative">
        <span
          aria-hidden
          className="pointer-events-none absolute left-2 sm:left-3 top-1/2 block h-3 w-3 sm:h-4 sm:w-4 z-10 -translate-y-1/2 bg-white/60"
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
    </div>
  );
}
