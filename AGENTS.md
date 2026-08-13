<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Project Architecture Reference for AI Agents

## 1) Project purpose

This repository is a frontend-only catalog prototype for a school publication archive. The app lets users browse, search, and download official educational materials such as textbooks, pirivena books, and modules. It is not a CMS, API-backed product, or authenticated portal yet; it is a static, data-driven UI prototype built around a searchable tree of materials.

## 2) Product shape

The user experience is a single-page archive interface:

- Top branded header
- Global search box
- Collapsible category tree of materials
- Downloadable book entries with metadata
- Optional print-year overview tables for textbook collections

The main entry point is in `src/app/page.tsx`, which renders the `DownloadPage` component.

## 3) Runtime and stack

- Next.js 16 app-router project
- React 19 + TypeScript
- Tailwind CSS v4
- `lucide-react` icons
- `motion` dependency is present but not central to the current implementation

This is a frontend-only prototype with deterministic mock data. The expected production direction is a real data source, but the current app deliberately avoids backend dependencies.

## 4) Critical application flow

1. `src/app/page.tsx` renders `DownloadPage`.
2. `src/components/download/DownloadPage.tsx`:
   - manages the search text state (`query`)
   - listens for keyboard shortcuts to focus the search box when the user types a printable character while not already typing in a text field
   - renders `Header`, `SearchBar`, `DownloadTree`, and `PrintYearOverview`
3. `src/components/download/DownloadTree.tsx` builds filtered tree roots from `downloadRoots` and applies `filterTree` from `src/lib/tree-search.ts`.
4. `FolderNode` / `FileNode` render the hierarchical tree and each downloadable item.
5. `src/data/files.ts` provides the complete catalog structure and metadata used by the UI.
6. `src/lib/print-years.ts` computes print-year heatmaps for overview tables.

## 5) Core data model

The canonical model is defined in `src/types/tree.ts`.

### TreeNode types

- `DirectoryNode`: a folder-like container with `kind` and `children`
- `BookNode`: a downloadable publication with metadata

### Supported node kinds

- `category`
- `medium`
- `grade`
- `bookType`
- `subject`
- `term`
- `book`

### Book metadata fields

Every `BookNode` contains:

- `id`
- `kind: "book"`
- `name`
- `subject`
- `printYear`
- `fileSize`
- `fileUrl`
- `downloads`

Important semantic rule: `printYear` means latest print run / latest available production year. It is not curriculum or syllabus versioning. The app explicitly calls this out in comments and UI copy to avoid conflating print history with academic version history.

## 6) Data source and catalog content

The main source of truth is `src/data/files.ts`.

This file is not a backend fetch. It defines deterministic mock catalog data in code. It includes:

- `downloadRoots` as the top-level category tree
- `printYearGrids` as overview tables built from the same content
- several book families such as textbooks, pirivena books, and modules
- grade/medium/subject nesting patterns derived from publication metadata
- generated `fileUrl` paths like `/downloads/.../*.pdf`

The generator logic creates stable values using deterministic hashing rather than random values so UI state remains consistent between renders.

Important: if actual PDF files are later added or a real backend is introduced, the data layer and `fileUrl` paths are the integration point.

## 7) Search behavior

The search system is in `src/lib/tree-search.ts`.

### Behavior

- It tokenizes the query into lowercase tokens.
- It applies multi-token AND matching across the full ancestor path and book metadata.
- Numeric tokens like `5` are treated specially; they match only against actual Grade nodes, not accidental digit matches inside folder labels.
- Search expands folders automatically because the tree is filtered while preserving ancestor paths.

### Search contract

When a user searches for things like:

- `grade 6 mathematics`
- `physical grade 7 sinhala`
- `common english books`

The engine matches against a combined textual representation of the node's path and book labels, not simply the file name alone.

## 8) Rendering architecture

### `src/components/download/DownloadPage.tsx`

Owns the main page composition. It keeps the active query state and wires the keyboard shortcut behavior.

### `src/components/download/SearchBar.tsx`

Provides the search field and suggested queries. This is the primary discovery UI.

### `src/components/download/DownloadTree.tsx`

Takes `roots` and `query`, filters them, then passes the visible nodes to `FolderNode`.

### `src/components/download/FolderNode.tsx`

Renders collapsible folder nodes. It tracks expansion state and recursively nests children. It highlights query matches using `highlightTokens` and calculates book counts per folder.

### `src/components/download/FileNode.tsx`

Renders each downloadable book entry with metadata (print year, file size, download count) and uses an anchor with `download` so the browser downloads the resource.

### `src/components/syllabus/PrintYearOverview.tsx`

Displays the print-year grid. It shows a color-coded heatmap for subject-by-grade latest print-year availability.

## 9) Utility and helper files

### `src/lib/tree-search.ts`

Search + tree filtering logic. This is the most important behavior file for question-answering about “how do searches work?”

### `src/lib/print-years.ts`

Aggregates and computes the latest print year per subject/grade combination. This is the source of the print-year grid visualizations.

### `src/lib/highlight-text.tsx`

Applies highlighting for matched query tokens in folder and file labels.

## 10) Styling and layout

### `src/app/layout.tsx`

Global app layout that defines metadata and loads custom fonts with `next/font/google`.

### `src/app/globals.css`

Defines the theme tokens and Tailwind integration. It sets colors, fonts, and base styling values.

### `src/components/download/Header.tsx`

Contains the top banner branding and app title information.

## 11) Folder map and file responsibilities

- `src/app/` — App Router pages and global app layout
  - `src/app/page.tsx` — home page entry
  - `src/app/layout.tsx` — shell metadata and font loading
  - `src/app/globals.css` — design tokens and global styling
- `src/components/download/` — user-facing archive UI
  - `DownloadPage.tsx` — page composition and keyboard behavior
  - `SearchBar.tsx` — search input + suggestions
  - `DownloadTree.tsx` — root filtering and tree rendering
  - `FolderNode.tsx` — expandable folder UI
  - `FileNode.tsx` — downloadable file row UI
  - `Header.tsx` — top banner and branding
- `src/components/syllabus/` — print-year analysis view
  - `PrintYearOverview.tsx` — heatmap view of latest print years
- `src/data/` — content model and mock catalog
  - `files.ts` — deterministic catalog generation, roots, print-year data
- `src/lib/` — reusable logic
  - `tree-search.ts` — search/filter behaviors
  - `print-years.ts` — print-year aggregation logic
  - `highlight-text.tsx` — token highlight UI
- `src/types/` — TypeScript models
  - `tree.ts` — `TreeNode`, `DirectoryNode`, `BookNode` definitions
- `public/` — static assets
  - branding images, PDFs, and other public files

## 12) Important conventions for future work

- Do not rename the core tree model without updating `src/types/tree.ts` and all recursive consumers.
- Do not treat `printYear` as curriculum data; it is a print-run indicator, and the UI explicitly calls that out.
- Any new downloadable PDFs should be represented in the data tree and should match the file structure implied by `fileUrl`.
- The tree is recursive; most UI behavior depends on the nested `DirectoryNode`/`BookNode` structure, so keep node shape consistent.
- Search behavior is path-aware; changing the tree names or hierarchy affects matching quality.
- This project is intentionally static; if a backend is introduced later, the correct insertion point is the `src/data` layer and the `BookNode` structure rather than replacing UI components blindly.

## 13) Quick mental model for agents

This app is best understood as a “catalog tree + metadata renderer” project:

- `files.ts` defines the catalog content
- `tree.ts` defines the structural contract
- `tree-search.ts` filters the tree by query
- `FolderNode` and `FileNode` render that tree
- `PrintYearOverview` builds a secondary analytical view from the same data

If an issue relates to browsing, searching, or download metadata, start in those files in that order.

## 14) Validation and build notes

- Development command: `npm run dev`
- Production build: `npm run build`
- Lint: `npm run lint`
- This project is currently a UI prototype and may not yet have a backend or live content pipeline.

When working in this repo, prefer changes that preserve the static tree model and search semantics over ad-hoc UI-only fixes.
