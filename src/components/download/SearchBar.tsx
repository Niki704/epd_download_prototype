"use client";

import { X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-[220px] sm:max-w-xs">
      <span
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 block h-4 w-4 z-10 -translate-y-1/2 bg-white/60"
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
        placeholder="Search books..."
        className="w-full rounded-full border border-white/25 bg-white/10 py-2 pl-9 pr-9 text-[14px] text-white placeholder:text-white/60 backdrop-blur-sm outline-none transition-colors focus:border-white/60 focus:bg-white/15"
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
  );
}
