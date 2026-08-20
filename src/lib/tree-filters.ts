import { TreeNode, DirectoryNode, Medium, isDirectory } from "@/types/tree";
import { parseGradeNumber } from "@/lib/tm-graph";

export type FacetKey = "grade" | "medium" | "bookType" | "term";

export interface BookTypeFacet {
  id: string;
  label: string;
}

// One optional value per facet — a selector, not a multi-select set. Picking
// a new value for a facet replaces whatever was there before.
export interface SelectedFilters {
  grade?: number;
  medium?: Medium;
  bookTypeId?: string;
  term?: number;
}

export interface AvailableFacets {
  grades: number[];
  mediums: Medium[];
  bookTypes: BookTypeFacet[];
  terms: number[];
}

interface FacetContext {
  medium?: Medium;
  grade?: number;
  bookTypeId?: string;
  term?: number;
}

export function emptySelectedFilters(): SelectedFilters {
  return {};
}

export function hasAnyActiveFilter(selected: SelectedFilters): boolean {
  return (
    selected.grade !== undefined ||
    selected.medium !== undefined ||
    selected.bookTypeId !== undefined ||
    selected.term !== undefined
  );
}

function mediumFromName(name: string): Medium | null {
  const lower = name.toLowerCase();
  if (lower.startsWith("sinhala")) return "sinhala";
  if (lower.startsWith("tamil")) return "tamil";
  if (lower.startsWith("english")) return "english";
  return null;
}

function parseTermNumber(name: string): number | null {
  const match = name.match(/^Term\s+(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
}

// Strips a trailing parenthetical (e.g. "Activity Books (Grade 1 to 5
// only)" -> "Activity Books") for a cleaner chip/dropdown label. The full
// name is untouched everywhere else — this is display-only.
function bookTypeChipLabel(name: string): string {
  return name.replace(/\s*\([^)]*\)\s*$/, "").trim();
}

function nextContext(node: DirectoryNode, ctx: FacetContext): FacetContext {
  switch (node.kind) {
    case "medium": {
      const medium = mediumFromName(node.name);
      return medium ? { ...ctx, medium } : ctx;
    }
    case "grade": {
      const grade = parseGradeNumber(node.name);
      return grade !== null ? { ...ctx, grade } : ctx;
    }
    case "bookType":
      return { ...ctx, bookTypeId: node.id };
    case "term": {
      const term = parseTermNumber(node.name);
      return term !== null ? { ...ctx, term } : ctx;
    }
    default:
      return ctx;
  }
}

function matchesSelection(
  ctx: FacetContext,
  selected: SelectedFilters,
): boolean {
  if (selected.grade !== undefined && ctx.grade !== selected.grade)
    return false;
  if (selected.medium !== undefined && ctx.medium !== selected.medium)
    return false;
  if (
    selected.bookTypeId !== undefined &&
    ctx.bookTypeId !== selected.bookTypeId
  )
    return false;
  if (selected.term !== undefined && ctx.term !== selected.term) return false;
  return true;
}

// Prunes the tree to only the branches satisfying every active facet.
// Structural (ancestor-context-based), not text-token-based, so it never
// collides with numeric grade vs. term labels the way free-text search
// tokens would.
export function filterTreeByFacets(
  node: TreeNode,
  selected: SelectedFilters,
  ctx: FacetContext = {},
): TreeNode | null {
  if (!isDirectory(node)) {
    return matchesSelection(ctx, selected) ? node : null;
  }

  const childCtx = nextContext(node, ctx);
  const filteredChildren = node.children
    .map((child) => filterTreeByFacets(child, selected, childCtx))
    .filter((child): child is TreeNode => child !== null);

  return filteredChildren.length > 0
    ? { ...node, children: filteredChildren }
    : null;
}

function collectFacetValues(nodes: TreeNode[]) {
  const grades = new Set<number>();
  const mediums = new Set<Medium>();
  const bookTypes = new Map<string, string>();
  const terms = new Set<number>();

  function walk(node: TreeNode) {
    if (!isDirectory(node)) return;

    if (node.kind === "grade") {
      const grade = parseGradeNumber(node.name);
      if (grade !== null) grades.add(grade);
    }
    if (node.kind === "medium") {
      const medium = mediumFromName(node.name);
      if (medium) mediums.add(medium);
    }
    if (node.kind === "bookType") {
      bookTypes.set(node.id, bookTypeChipLabel(node.name));
    }
    if (node.kind === "term") {
      const term = parseTermNumber(node.name);
      if (term !== null) terms.add(term);
    }

    node.children.forEach(walk);
  }

  nodes.forEach(walk);
  return { grades, mediums, bookTypes, terms };
}

const MEDIUM_ORDER: Medium[] = ["sinhala", "tamil", "english"];

// For each facet, options are computed against the tree filtered by every
// OTHER active facet, excluding the facet's own current selection. This is
// what makes the flow "pick Grade -> Medium/BookType/Term narrow down, but
// Grade's own other options stay visible so you can still change it."
export function computeAvailableFacets(
  nodes: TreeNode[],
  selected: SelectedFilters,
): AvailableFacets {
  const prune = (sel: SelectedFilters) =>
    nodes
      .map((n) => filterTreeByFacets(n, sel))
      .filter((n): n is TreeNode => n !== null);

  const gradeValues = collectFacetValues(
    prune({ ...selected, grade: undefined }),
  );
  const mediumValues = collectFacetValues(
    prune({ ...selected, medium: undefined }),
  );
  const bookTypeValues = collectFacetValues(
    prune({ ...selected, bookTypeId: undefined }),
  );
  const termValues = collectFacetValues(
    prune({ ...selected, term: undefined }),
  );

  return {
    grades: Array.from(gradeValues.grades).sort((a, b) => a - b),
    mediums: MEDIUM_ORDER.filter((m) => mediumValues.mediums.has(m)),
    bookTypes: Array.from(bookTypeValues.bookTypes.entries()).map(
      ([id, label]) => ({ id, label }),
    ),
    terms: Array.from(termValues.terms).sort((a, b) => a - b),
  };
}
