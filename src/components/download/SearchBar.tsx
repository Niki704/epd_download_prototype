"use client";

import { forwardRef, useEffect, useSyncExternalStore } from "react";
import { X } from "lucide-react";
import {
  dismissSuggestions,
  clearSuggestionsDismissed,
  getSuggestionsDismissed,
  getSuggestionsDismissedServerSnapshot,
  getSuggestionsDismissedUntil,
  subscribeToSuggestionsDismissed,
} from "@/lib/storage";

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
    // useSyncExternalStore guarantees one consistent snapshot (false, via
    // getSuggestionsDismissedServerSnapshot) for the entire hydration
    // pass, then swaps to the real persisted value afterward — avoiding
    // the tear/mismatch a plain useState+useEffect pair can hit under
    // selective/out-of-order hydration.
    const suggestionsDismissed = useSyncExternalStore(
      subscribeToSuggestionsDismissed,
      getSuggestionsDismissed,
      getSuggestionsDismissedServerSnapshot,
    );
    const showSuggestions = !suggestionsDismissed && value.trim() === "";

    // Auto-restore suggestions the moment the 15 minute window elapses,
    // even if the user never reloads the page. This is a timer side
    // effect, not state derivation, so it stays in a useEffect.
    useEffect(() => {
      const expiresAt = getSuggestionsDismissedUntil();
      if (!expiresAt) return;

      const remainingMs = expiresAt - Date.now();
      const timer = setTimeout(() => {
        clearSuggestionsDismissed();
      }, remainingMs);

      return () => clearTimeout(timer);
    }, [suggestionsDismissed]);

    function handleDismiss() {
      dismissSuggestions();
    }

    return (
      <div className="w-full max-w-none">
        <div className="relative">
          <span
            aria-hidden
            className="pointer-events-none absolute left-2 sm:left-3 top-[55%] sm:top-1/2 block h-3 w-3 sm:h-4 sm:w-4 z-10 -translate-y-1/2 bg-ink-muted"
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
            className="w-full rounded-full border border-border-strong bg-surface py-1.5 sm:py-2 pl-6 sm:pl-9 pr-6 sm:pr-9 text-[11px] sm:text-[14px] text-ink placeholder:text-ink-muted/70 outline-none transition-colors focus:border-primary/50"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted transition-colors hover:text-ink"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <p className="mt-1 sm:mt-1.5 px-1 text-[10px] sm:text-[11.5px] leading-snug text-ink-muted">
          Tip: combine keywords —{" "}
          <span className="text-ink">
            &ldquo;geography grade 11 sinhala term 2&rdquo;
          </span>{" "}
          <span className="hidden sm:inline">jumps straight to the book.</span>
        </p>

        {showSuggestions && (
          <div className="animate-fade-in mt-2 flex flex-wrap items-center gap-1.5 px-1">
            {SUGGESTED_QUERIES.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => onChange(q)}
                className="rounded-full border border-border-strong bg-bg px-3 py-1 text-[11.5px] text-ink-soft transition-colors hover:border-primary/35 hover:bg-surface-hover hover:text-ink"
              >
                {q}
              </button>
            ))}
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Hide suggested searches"
              className="ml-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-hover hover:text-ink"
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
