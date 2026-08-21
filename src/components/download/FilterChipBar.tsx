"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { Medium } from "@/types/tree";
import { AvailableFacets, FacetKey, SelectedFilters } from "@/lib/tree-filters";

interface FilterChipBarProps {
  available: AvailableFacets;
  selected: SelectedFilters;
  onChange: (next: SelectedFilters) => void;
}

const MEDIUM_LABEL: Record<Medium, string> = {
  sinhala: "Sinhala",
  tamil: "Tamil",
  english: "English",
};

interface FacetOption {
  value: string;
  label: string;
}

interface FacetDef {
  key: FacetKey;
  label: string;
  options: FacetOption[];
  selectedLabel: string | null;
}

export default function FilterChipBar({
  available,
  selected,
  onChange,
}: FilterChipBarProps) {
  const [openFacet, setOpenFacet] = useState<FacetKey | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpenFacet(null);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenFacet(null);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const allFacets: FacetDef[] = [
    {
      key: "grade",
      label: "Grade",
      options: available.grades.map((g) => ({
        value: String(g),
        label: `Grade ${g}`,
      })),
      selectedLabel:
        selected.grade !== undefined ? `Grade ${selected.grade}` : null,
    },
    {
      key: "medium",
      label: "Medium",
      options: available.mediums.map((m) => ({
        value: m,
        label: MEDIUM_LABEL[m],
      })),
      selectedLabel: selected.medium ? MEDIUM_LABEL[selected.medium] : null,
    },
    {
      key: "bookType",
      label: "Book Type",
      options: available.bookTypes.map((bt) => ({
        value: bt.id,
        label: bt.label,
      })),
      selectedLabel:
        available.bookTypes.find((bt) => bt.id === selected.bookTypeId)
          ?.label ?? null,
    },
    {
      key: "term",
      label: "Term",
      options: available.terms.map((t) => ({
        value: String(t),
        label: `Term ${t}`,
      })),
      selectedLabel:
        selected.term !== undefined ? `Term ${selected.term}` : null,
    },
  ];
  const facets = allFacets.filter((facet) => facet.options.length > 0);

  if (facets.length === 0) return null;

  function selectValue(key: FacetKey, rawValue: string) {
    const next = { ...selected };
    switch (key) {
      case "grade":
        next.grade = parseInt(rawValue, 10);
        break;
      case "medium":
        next.medium = rawValue as Medium;
        break;
      case "bookType":
        next.bookTypeId = rawValue;
        break;
      case "term":
        next.term = parseInt(rawValue, 10);
        break;
    }
    onChange(next);
    setOpenFacet(null);
  }

  function clearFacet(key: FacetKey) {
    const next = { ...selected };
    switch (key) {
      case "grade":
        delete next.grade;
        break;
      case "medium":
        delete next.medium;
        break;
      case "bookType":
        delete next.bookTypeId;
        break;
      case "term":
        delete next.term;
        break;
    }
    onChange(next);
  }

  return (
    <div
      ref={containerRef}
      className="relative mb-3 flex flex-wrap justify-end gap-x-3 gap-y-2"
    >
      {facets.map((facet) => {
        const isActive = facet.selectedLabel !== null;
        const isOpen = openFacet === facet.key;

        return (
          <div key={facet.key} className="relative shrink-0">
            <button
              type="button"
              onClick={() =>
                setOpenFacet((curr) => (curr === facet.key ? null : facet.key))
              }
              aria-expanded={isOpen}
              className={`flex items-center gap-1 whitespace-nowrap rounded-full py-1.5 pl-3.5 text-[12.5px] font-medium transition-colors ${
                isActive ? "pr-2" : "pr-3"
              } ${
                isActive
                  ? "animate-chip-pop bg-primary text-white"
                  : "bg-chip-inactive text-ink-soft hover:bg-chip-inactive-hover"
              }`}
            >
              {facet.selectedLabel ?? facet.label}
              {isActive ? (
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`Clear ${facet.label} filter`}
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFacet(facet.key);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.stopPropagation();
                      clearFacet(facet.key);
                    }
                  }}
                  className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full text-white/80 hover:bg-white/15 hover:text-white"
                >
                  <X size={11} />
                </span>
              ) : (
                <ChevronDown
                  size={13}
                  className={`text-ink-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              )}
            </button>

            {isOpen && (
              <div className="animate-dropdown-in absolute right-0 top-[calc(100%+0.375rem)] z-20 max-h-64 min-w-[10rem] overflow-y-auto rounded-lg border border-border bg-surface py-1 shadow-lg">
                {facet.options.map((option) => {
                  const isSelected = facet.selectedLabel === option.label;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => selectValue(facet.key, option.value)}
                      className={`flex w-full items-center justify-between gap-3 px-3.5 py-2 text-left text-[13px] transition-colors hover:bg-bg ${
                        isSelected ? "font-semibold text-primary" : "text-ink"
                      }`}
                    >
                      {option.label}
                      {isSelected && (
                        <Check size={14} className="shrink-0 text-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
