# Project Summary for Stakeholders

## What This Product Is

This project is a web-based school publication archive for the Education Publications Department. It gives users a single place to browse and download textbooks, modules, and Pirivena books by grade, medium, and subject.

The current implementation is a polished prototype built with Next.js and React. It is designed to support fast browsing, simple search, and a clear presentation of publication metadata such as file size, download count, and latest print year.

## What Users Can Do

- Browse books through a collapsible category tree.
- Search across grades, subjects, and book titles from a single search box.
- Jump to books quickly using keyboard input or suggested searches.
- Download individual PDF files directly from the catalog.
- Review a print-year overview table for the textbook collection.

## Information Structure

The content is organized into three main root areas:

- Textbooks
- Pirivena Books
- Modules

Inside those roots, the structure expands by category, medium, grade, book type, and subject depending on the content family. The tree is intentionally flexible so the UI can represent both simple and deeply nested collections.

## Current Content Model

The catalog data is currently defined in code as deterministic mock data. That means the files, print years, and download counts are stable for the prototype, but they are not yet coming from a live backend or CMS.

The app also includes a separate print-year overview for textbooks. That table shows the most recent print run available per subject and grade, and it is clearly labeled as print history rather than curriculum versioning.

## Experience And Design

The interface uses a branded header, a prominent search experience, and a compact tree layout to keep scanning easy. The visual design leans on the department branding and a clean archival feel rather than a dashboard-style layout.

Search is the main discovery mechanism. It filters the tree immediately and keeps matching sections open so users can reach the relevant book with minimal clicking.

## What Stakeholders Should Know

- This is a frontend-first prototype, not a live data platform yet.
- The app is already structured for growth if content later moves to a database, CMS, or API.
- The print-year view is useful for publishing visibility, but it should not be described as syllabus history.
- The current priority for UI work should be preserving search clarity, tree readability, and the lightweight download flow.

## Practical Product Value

The main value of the project is reducing friction for schools and staff who need to locate official learning materials quickly. It turns a large publication list into a searchable, navigable archive and provides a consistent way to present publication metadata.
