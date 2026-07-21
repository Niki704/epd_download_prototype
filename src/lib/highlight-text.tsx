import { ReactNode } from "react";

function tokenize(query: string): string[] {
  return query.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

export function highlightTokens(name: string, query: string): ReactNode {
  const tokens = tokenize(query);
  if (tokens.length === 0) return name;

  const lower = name.toLowerCase();
  const ranges: [number, number][] = [];
  for (const t of tokens) {
    let idx = lower.indexOf(t);
    while (idx !== -1) {
      ranges.push([idx, idx + t.length]);
      idx = lower.indexOf(t, idx + 1);
    }
  }
  if (ranges.length === 0) return name;

  ranges.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const [start, end] of ranges) {
    const last = merged[merged.length - 1];
    if (last && start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      merged.push([start, end]);
    }
  }

  const parts: ReactNode[] = [];
  let cursor = 0;
  merged.forEach(([start, end], i) => {
    if (start > cursor) parts.push(name.slice(cursor, start));
    parts.push(
      <mark key={i} className="rounded-sm bg-[#C79A3E]/35 text-[#1C1F1E]">
        {name.slice(start, end)}
      </mark>,
    );
    cursor = end;
  });
  if (cursor < name.length) parts.push(name.slice(cursor));
  return parts;
}
