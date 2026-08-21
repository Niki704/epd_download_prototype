import { TreeNode, DirectoryNode, Medium, isDirectory } from "@/types/tree";
import { parseGradeNumber } from "@/lib/tm-graph";

export type FacetKey = "grade" | "medium" | "bookType" | "term";

const BOOK_TYPE_LABEL_OVERRIDES: Record<string, string> = {
  "common-english-books-1-5": "Common English Books (Grade 1-5 Textbooks)",
  "common-english-books-6-11": "Common English Books (Grade 6-11 Textbooks)",
  "module-common-english-books": "Common English (Activity Books)",
  "common-english-books-essential-learning":
    "Common English (Essential Learning Books)",
};

const CUSTOM_BOOK_TYPE_ORDER = [
  "common-english-books-1-5",
  "common-english-books-6-11",
  "module-common-english-books",
  "common-english-books-essential-learning",
];

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
  bookTypeLocked?: boolean;
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
function bookTypeChipLabel(node: DirectoryNode): string {
  return (
    BOOK_TYPE_LABEL_OVERRIDES[node.id] ??
    node.name.replace(/\s*\([^)]*\)\s*$/, "").trim()
  );
}

// A category becomes its own selectable "book type" only if nothing
// beneath it already carries a real bookType node (Modules has those;
// Textbooks and Pirivena don't) — so this never needs a hardcoded id list
// and stays correct if the data shape changes later.
function hasBookTypeDescendant(node: TreeNode): boolean {
  if (!isDirectory(node)) return false;
  if (node.kind === "bookType") return true;
  return node.children.some(hasBookTypeDescendant);
}

// Categories whose *own* id should be the final bookTypeId for everything
// beneath them, ignoring any bookType-kind wrapper nodes further down
// (those wrappers exist in the data for icon/grouping purposes, not as
// user-facing filter values). Modules is deliberately NOT here — its
// bookType children (Activity/Essential/Further/Transversal/Common
// English) should keep overriding, since those ARE the intended values.
const LOCKED_BOOK_TYPE_CATEGORY_IDS = new Set(["textbooks", "pirivena"]);

function nextContext(node: DirectoryNode, ctx: FacetContext): FacetContext {
  switch (node.kind) {
    case "category":
      if (ctx.bookTypeLocked) return ctx;
      return LOCKED_BOOK_TYPE_CATEGORY_IDS.has(node.id)
        ? { ...ctx, bookTypeId: node.id, bookTypeLocked: true }
        : { ...ctx, bookTypeId: node.id };
    case "medium": {
      const medium = mediumFromName(node.name);
      return medium ? { ...ctx, medium } : ctx;
    }
    case "grade": {
      const grade = parseGradeNumber(node.name);
      return grade !== null ? { ...ctx, grade } : ctx;
    }
    case "bookType": {
      return ctx.bookTypeLocked ? ctx : { ...ctx, bookTypeId: node.id };
    }
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

  function walk(node: TreeNode, isRoot: boolean) {
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
      bookTypes.set(node.id, bookTypeChipLabel(node));
    }
    if (isRoot && node.kind === "category" && !hasBookTypeDescendant(node)) {
      bookTypes.set(node.id, node.name);
    }
    if (node.kind === "term") {
      const term = parseTermNumber(node.name);
      if (term !== null) terms.add(term);
    }

    node.children.forEach((child) => walk(child, false));
  }

  nodes.forEach((node) => walk(node, true));
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
    bookTypes: Array.from(bookTypeValues.bookTypes.entries())
      .map(([id, label]) => ({ id, label }))
      .sort((a, b) => {
        const aCustomIndex = CUSTOM_BOOK_TYPE_ORDER.indexOf(a.id);
        const bCustomIndex = CUSTOM_BOOK_TYPE_ORDER.indexOf(b.id);
        const aIsCustom = aCustomIndex !== -1;
        const bIsCustom = bCustomIndex !== -1;

        if (aIsCustom !== bIsCustom) return aIsCustom ? 1 : -1;
        if (aIsCustom && bIsCustom) return aCustomIndex - bCustomIndex;
        return 0;
      }),
    terms: Array.from(termValues.terms).sort((a, b) => a - b),
  };
}
