import { DirectoryNode, BookNode } from "@/types/tree";
import { buildPrintYearGrid, PrintYearGrid } from "@/lib/print-years";

// ────────────────────────────────────────────────────────────
// Shared mock helpers
// ────────────────────────────────────────────────────────────

// Deterministic mock print year so it stays stable across renders instead
// of re-randomizing on reload. Real data would come from a print-run
// record per book, independent of curriculum/edition.
const PRINT_YEARS = [2019, 2021, 2023, 2025];

function mockPrintYear(grade: number, subject: string): number {
  const seed = `${grade}-${subject}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 1000;
  }
  return PRINT_YEARS[hash % PRINT_YEARS.length];
}

// Deterministic mock download count so numbers stay stable across renders
// instead of re-randomizing on every reload.
function mockDownloads(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
  }
  return 40 + (hash % 2400);
}

function slugify(...parts: string[]): string {
  return parts
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
}

type MediumKey = "sinhala" | "tamil" | "english";

function makeSubjectBook(
  grade: number,
  medium: string,
  subject: string,
  urlBase: string,
): BookNode {
  const slug = slugify("grade", String(grade), medium, subject);
  return {
    id: slug,
    kind: "book",
    name: subject,
    subject,
    printYear: mockPrintYear(grade, subject),
    fileSize: `${(2 + (grade % 4) * 0.6).toFixed(1)} MB`,
    fileUrl: `/downloads/${urlBase}/${slug}.pdf`,
    downloads: mockDownloads(slug),
  };
}

function makeGradeNodeFromSubjects(
  grade: number,
  medium: string,
  subjects: string[],
  urlBase: string,
): DirectoryNode {
  return {
    id: `grade-${grade}-${medium}-${urlBase}`,
    kind: "grade",
    name: `Grade ${grade}`,
    children: subjects.map((s) => makeSubjectBook(grade, medium, s, urlBase)),
  };
}

// ────────────────────────────────────────────────────────────
// Phase 1: Textbooks — Grade 1–5 (Primary), reconciled against the real
// booklist. ABOE/English items excluded here — they live in Common
// English Books below, and already matched the booklist exactly.
// ────────────────────────────────────────────────────────────

const PRIMARY_GRADE_SUBJECTS: Record<
  number,
  { sinhala: string[]; tamil: string[] }
> = {
  1: {
    sinhala: [
      "Buddhism",
      "Catholicism",
      "Christianity",
      "Islam",
      "Sinhala Reading Book",
      "Sinhala Workbook",
      "Mathematics",
    ],
    tamil: [
      "Hinduism",
      "Catholicism",
      "Christianity",
      "Islam",
      "Tamil Reading Book",
      "Tamil Workbook",
      "Mathematics",
    ],
  },
  2: {
    sinhala: [
      "Buddhism",
      "Catholicism",
      "Christianity",
      "Islam",
      "Sinhala Reading Book",
      "Sinhala Workbook",
      "Mathematics",
    ],
    tamil: [
      "Hinduism",
      "Catholicism",
      "Christianity",
      "Islam",
      "Tamil Reading Book",
      "Tamil Workbook",
      "Mathematics",
    ],
  },
  3: {
    sinhala: [
      "Buddhism",
      "Catholicism",
      "Christianity",
      "Islam",
      "Sinhala Reading Book",
      "Sinhala Workbook",
      "Mathematics Part I",
      "Mathematics Part II",
    ],
    tamil: [
      "Hinduism",
      "Catholicism",
      "Christianity",
      "Islam",
      "Tamil Reading Book",
      "Tamil Workbook",
      "Mathematics Part I",
      "Mathematics Part II",
    ],
  },
  4: {
    sinhala: [
      "Buddhism",
      "Catholicism",
      "Christianity",
      "Islam",
      "Sinhala Reading Book",
      "Mathematics",
    ],
    tamil: [
      "Hinduism",
      "Catholicism",
      "Christianity",
      "Islam",
      "Tamil Reading Book",
      "Mathematics",
    ],
  },
  5: {
    sinhala: [
      "Buddhism",
      "Catholicism",
      "Christianity",
      "Islam",
      "Sinhala Reading Book",
      "Mathematics",
    ],
    tamil: [
      "Hinduism",
      "Catholicism",
      "Christianity",
      "Islam",
      "Tamil Reading Book",
      "Mathematics",
    ],
  },
};

function makePrimaryMediumNode(
  medium: "sinhala" | "tamil",
  label: string,
): DirectoryNode {
  return {
    id: `primary-medium-${medium}`,
    kind: "medium",
    name: label,
    children: [1, 2, 3, 4, 5].map((g) =>
      makeGradeNodeFromSubjects(
        g,
        medium,
        PRIMARY_GRADE_SUBJECTS[g][medium],
        "textbooks",
      ),
    ),
  };
}

// Common English Books (Grade 1–5) — unchanged from before, already
// matched the booklist exactly.
function makeCommonEnglishBook(
  id: string,
  name: string,
  grade: number,
): BookNode {
  return {
    id,
    kind: "book",
    name,
    subject: name,
    printYear: mockPrintYear(grade, name),
    fileSize: `${(1.6 + (grade % 3) * 0.3).toFixed(1)} MB`,
    fileUrl: `/downloads/textbooks/${id}.pdf`,
    downloads: mockDownloads(id),
  };
}

function makeCommonEnglishGradeNode(
  grade: number,
  bookNames: string[],
): DirectoryNode {
  return {
    id: `common-english-1-5-grade-${grade}`,
    kind: "grade",
    name: `Grade ${grade}`,
    children: bookNames.map((name) =>
      makeCommonEnglishBook(
        slugify("common-english-1-5-grade", String(grade), name),
        name,
        grade,
      ),
    ),
  };
}

// --- Grade 1–5: Sinhala Medium, Tamil Medium, Common English Books ---

const commonEnglishBooks1to5: DirectoryNode = {
  id: "common-english-books-1-5",
  kind: "bookType",
  name: "Common English Books",
  children: [
    makeCommonEnglishGradeNode(1, ["ABOE Activity Book", "ABOE Song Book"]),
    makeCommonEnglishGradeNode(2, ["ABOE Activity Book", "ABOE Song Book"]),
    makeCommonEnglishGradeNode(3, [
      "English Reading Book",
      "English Workbook",
      "English Writing Practice",
    ]),
    makeCommonEnglishGradeNode(4, ["English Reading Book", "English Workbook"]),
    makeCommonEnglishGradeNode(5, ["English Reading Book", "English Workbook"]),
  ],
};

const grade1to5: DirectoryNode = {
  id: "category-1-5",
  kind: "category",
  name: "Grade 1 – 5",
  children: [
    makePrimaryMediumNode("sinhala", "Sinhala Medium"),
    makePrimaryMediumNode("tamil", "Tamil Medium"),
    commonEnglishBooks1to5,
  ],
};

// ────────────────────────────────────────────────────────────
// Phase 2 + 3: Textbooks — Grade 6–11 (Secondary), reconciled + renamed
// Common English Books to match the official booklist.
// ────────────────────────────────────────────────────────────

interface SubjectAvailability {
  name: string;
  mediums: MediumKey[];
}

function subjectsForMedium(
  band: SubjectAvailability[],
  medium: MediumKey,
): string[] {
  return band.filter((s) => s.mediums.includes(medium)).map((s) => s.name);
}

const BAND_GRADE_6: SubjectAvailability[] = [
  { name: "Buddhism", mediums: ["sinhala"] },
  { name: "Hinduism", mediums: ["tamil"] },
  { name: "Catholicism", mediums: ["sinhala", "tamil", "english"] },
  { name: "Christianity", mediums: ["sinhala", "tamil"] },
  { name: "Islam", mediums: ["sinhala", "tamil"] },
  { name: "Sinhala Language and Literature", mediums: ["sinhala"] },
  { name: "Tamil Language and Literature", mediums: ["tamil"] },
  { name: "Mathematics Part I", mediums: ["sinhala", "tamil", "english"] },
  { name: "Mathematics Part II", mediums: ["sinhala", "tamil", "english"] },
  { name: "History", mediums: ["sinhala", "tamil", "english"] },
  { name: "Science", mediums: ["sinhala", "tamil", "english"] },
  { name: "Geography", mediums: ["sinhala", "tamil", "english"] },
  { name: "Civic Education", mediums: ["sinhala", "tamil", "english"] },
  { name: "Secondary Language Tamil", mediums: ["sinhala"] },
  { name: "Secondary Language Sinhala", mediums: ["tamil"] },
  {
    name: "Information & Communication Technology Reading Book",
    mediums: ["sinhala", "tamil", "english"],
  },
  {
    name: "Information & Communication Technology Workbook",
    mediums: ["sinhala", "tamil", "english"],
  },
  {
    name: "Health & Physical Education",
    mediums: ["sinhala", "tamil", "english"],
  },
  { name: "Practical & Technical Skills", mediums: ["sinhala", "tamil"] },
];

const BAND_GRADE_7_8: SubjectAvailability[] = [
  ...BAND_GRADE_6.filter((s) => s.name !== "Science"),
  { name: "Science Part I", mediums: ["sinhala", "tamil", "english"] },
  { name: "Science Part II", mediums: ["sinhala", "tamil", "english"] },
];

const BAND_GRADE_9: SubjectAvailability[] = [
  ...BAND_GRADE_7_8,
  { name: "Mathematics Part III", mediums: ["sinhala", "tamil", "english"] },
];

// Shared base for Grade 10 and 11 — everything they have in common.
// Mathematics Part III is deliberately excluded here since it doesn't
// apply to Grade 10; it's added back in only for BAND_GRADE_11 below.
const BAND_GRADE_10_11_BASE: SubjectAvailability[] = [
  ...BAND_GRADE_9.filter(
    (s) =>
      s.name !== "Information & Communication Technology Reading Book" &&
      s.name !== "Information & Communication Technology Workbook" &&
      s.name !== "Mathematics Part III",
  ),
  {
    name: "Information & Communication Technology",
    mediums: ["sinhala", "tamil", "english"],
  },
  { name: "Sinhala Literary Appreciation", mediums: ["sinhala"] },
  { name: "Tamil Literary Appreciation", mediums: ["tamil"] },
  { name: "English Literary Appreciation", mediums: ["english"] },
  {
    name: "Entrepreneurship Studies",
    mediums: ["sinhala", "tamil", "english"],
  },
  {
    name: "Business & Accounting Studies",
    mediums: ["sinhala", "tamil", "english"],
  },
  { name: "Sinhala Literature", mediums: ["sinhala", "tamil", "english"] },
  { name: "Agricultural Science", mediums: ["sinhala", "tamil"] },
  { name: "Aquatic Bioresources Technology", mediums: ["sinhala", "tamil"] },
  { name: "Design & Construction Technology", mediums: ["sinhala", "tamil"] },
  { name: "Design & Mechanical Technology", mediums: ["sinhala", "tamil"] },
  {
    name: "Design Electrical & Electronic Technology",
    mediums: ["sinhala", "tamil"],
  },
  { name: "Arts & Crafts", mediums: ["sinhala", "tamil"] },
  { name: "Home Economics", mediums: ["sinhala", "tamil"] },
  { name: "Communication and Media Studies", mediums: ["sinhala", "tamil"] },
  // Doesn't fit the medium split — single edition, no Sinhala/Tamil/English
  // variants. Placed here as a pragmatic default; needs a real decision.
  // Dev Note: This might belongs to other books category when it becomes exist.
  { name: "Japanese Language", mediums: ["sinhala"] },
];

const BAND_GRADE_10: SubjectAvailability[] = BAND_GRADE_10_11_BASE;

const BAND_GRADE_11: SubjectAvailability[] = [
  ...BAND_GRADE_10_11_BASE,
  { name: "Mathematics Part III", mediums: ["sinhala", "tamil", "english"] },
];

const SECONDARY_BANDS: Record<number, SubjectAvailability[]> = {
  6: BAND_GRADE_6,
  7: BAND_GRADE_7_8,
  8: BAND_GRADE_7_8,
  9: BAND_GRADE_9,
  10: BAND_GRADE_10,
  11: BAND_GRADE_11,
};

function makeSecondaryMediumNode(
  medium: MediumKey,
  label: string,
): DirectoryNode {
  return {
    id: `secondary-medium-${medium}`,
    kind: "medium",
    name: label,
    children: [6, 7, 8, 9, 10, 11].map((g) =>
      makeGradeNodeFromSubjects(
        g,
        medium,
        subjectsForMedium(SECONDARY_BANDS[g], medium),
        "textbooks",
      ),
    ),
  };
}

// Common English Books (Grade 6–11) — renamed to match the official
// booklist: "English Reading Book" / "English Workbook".
function makeCommonEnglishGradeNode6to11(grade: number): DirectoryNode {
  const readingId = `common-english-6-11-grade-${grade}-reading`;
  const workbookId = `common-english-6-11-grade-${grade}-workbook`;
  return {
    id: `common-english-6-11-grade-${grade}`,
    kind: "grade",
    name: `Grade ${grade}`,
    children: [
      {
        id: readingId,
        kind: "book",
        name: "English Reading Book",
        subject: "English Reading Book",
        printYear: mockPrintYear(grade, "English Reading Book"),
        fileSize: `${(1.8 + (grade % 3) * 0.3).toFixed(1)} MB`,
        fileUrl: `/downloads/textbooks/${readingId}.pdf`,
        downloads: mockDownloads(readingId),
      },
      {
        id: workbookId,
        kind: "book",
        name: "English Workbook",
        subject: "English Workbook",
        printYear: mockPrintYear(grade, "English Workbook"),
        fileSize: `${(1.5 + (grade % 3) * 0.3).toFixed(1)} MB`,
        fileUrl: `/downloads/textbooks/${workbookId}.pdf`,
        downloads: mockDownloads(workbookId),
      },
    ],
  };
}

const commonEnglishBooks6to11: DirectoryNode = {
  id: "common-english-books-6-11",
  kind: "bookType",
  name: "Common English Books",
  children: [6, 7, 8, 9, 10, 11].map((g) => makeCommonEnglishGradeNode6to11(g)),
};

const grade6to11: DirectoryNode = {
  id: "category-6-11",
  kind: "category",
  name: "Grade 6 – 11",
  children: [
    makeSecondaryMediumNode("sinhala", "Sinhala Medium"),
    makeSecondaryMediumNode("tamil", "Tamil Medium"),
    makeSecondaryMediumNode("english", "English Medium"),
    commonEnglishBooks6to11,
  ],
};

// General English — Grades 12–13 only. Flat, no sub-categories yet
// (medium/term structure to be defined later). Nested here as a sibling
// of the other two grade categories, since it's Textbook content, not a
// separate top-level root.
const generalEnglish: DirectoryNode = {
  id: "category-general-english",
  kind: "category",
  name: "General English (Grade 12 – 13)",
  children: [
    {
      id: "general-english-sample-book",
      kind: "book",
      name: "General English Book",
      subject: "General English",
      printYear: 2026,
      fileSize: "2.5 MB",
      fileUrl: "/downloads/textbooks/general-english-sample-book.pdf",
      downloads: mockDownloads("general-english-sample-book"),
    },
  ],
};

export const textbookTree: DirectoryNode = {
  id: "textbooks",
  kind: "category",
  name: "Textbooks",
  children: [grade1to5, grade6to11, generalEnglish],
};

// ────────────────────────────────────────────────────────────
// Modules (reshaped)
// Three book types sit directly under Modules as siblings:
// Activity Books (1–5), Essential Learning Books (6–11, with Subject
// + Term), Further Learning Books (6–11, with Subject, no Term).
// ────────────────────────────────────────────────────────────

export function moduleStartYear(grade: number): number {
  return grade <= 5 ? 2025 + grade : 2021 + grade;
}

// --- Activity Books (Grades 1–5): Medium → Grade → Term → Book.
// Every book lives inside a specific term's folder — nothing is shared
// across terms, per the confirmed git-diff data. Grades 1–2 are real,
// confirmed data; Grades 3–5 are placeholders pending real booklists. ---

interface ActivityTermData {
  term1: string[];
  term2: string[];
  term3: string[];
}

const ACTIVITY_BOOKS_DATA: Record<
  number,
  { sinhala: ActivityTermData; tamil: ActivityTermData }
> = {
  1: {
    sinhala: {
      term1: [
        "Buddhism",
        "Catholicism",
        "Christianity",
        "Islam",
        "Akuru Nuwana 1",
        "Akuru Nuwana 2",
        "Reading Book",
        "Mathematics",
        "Elementary Science and Environment Related Activities",
      ],
      term2: [
        "Buddhism",
        "Catholicism",
        "Christianity",
        "Islam",
        "Akuru Nuwana 3",
        "Mathematics",
        "Elementary Science and Environment Related Activities",
      ],
      term3: [
        "Buddhism",
        "Catholicism",
        "Christianity",
        "Islam",
        "Akuru Nuwana 4",
        "Mathematics",
        "Elementary Science and Environment Related Activities",
      ],
    },
    tamil: {
      term1: [
        "Hinduism",
        "Catholicism",
        "Christianity",
        "Islam",
        "Eluththei Arivom 1",
        "Eluththei Arivom 2",
        "Reading Book",
        "Mathematics",
        "Elementary Science and Environment Related Activities",
      ],
      term2: [
        "Hinduism",
        "Catholicism",
        "Christianity",
        "Islam",
        "Akuru Nuwana 3",
        "Mathematics",
        "Elementary Science and Environment Related Activities",
      ],
      term3: [
        "Hinduism",
        "Catholicism",
        "Christianity",
        "Islam",
        "Akuru Nuwana 4",
        "Mathematics",
        "Elementary Science and Environment Related Activities",
      ],
    },
  },
  2: {
    sinhala: {
      term1: [
        "Buddhism",
        "Catholicism",
        "Christianity",
        "Islam",
        "Sinhala Reading Book",
        "Akuru Nuwana 1",
        "Akuru Nuwana 2",
        "Mathematics First Term",
        "Elementary Science & ERA",
      ],
      term2: [
        "Buddhism",
        "Catholicism",
        "Christianity",
        "Islam",
        "Akuru Nuwana 3",
        "Mathematics Second Term",
        "Elementary Science & ERA",
      ],
      term3: [
        "Buddhism",
        "Catholicism",
        "Christianity",
        "Islam",
        "Akuru Nuwana 4",
        "Mathematics Third Term",
        "Elementary Science & ERA",
      ],
    },
    tamil: {
      term1: [
        "Hinduism - Saivaneri",
        "Catholicism",
        "Christianity",
        "Islam",
        "Tamil Reading Book",
        "Akuru Nuwana 1",
        "Akuru Nuwana 2",
        "Mathematics First Term",
        "Elementary Science & ERA",
      ],
      term2: [
        "Hinduism - Saivaneri",
        "Catholicism",
        "Christianity",
        "Islam",
        "Akuru Nuwana 3",
        "Mathematics Second Term",
        "Elementary Science & ERA",
      ],
      term3: [
        "Hinduism - Saivaneri",
        "Catholicism",
        "Christianity",
        "Islam",
        "Akuru Nuwana 4",
        "Mathematics Third Term",
        "Elementary Science & ERA",
      ],
    },
  },
  // Grades 3–5 intentionally omitted here — see makeActivityGradeNode
  // below, which falls back to a placeholder when a grade has no entry.
};

function makeActivityBook(
  grade: number,
  medium: string,
  term: number,
  name: string,
): BookNode {
  const displayName = `${name} – Term ${term}`;
  const slug = slugify(
    "activity-grade",
    String(grade),
    medium,
    "term",
    String(term),
    name,
  );
  return {
    id: slug,
    kind: "book",
    name: displayName,
    subject: name,
    printYear: mockPrintYear(grade, name),
    fileSize: `${(1.4 + (grade % 3) * 0.3).toFixed(1)} MB`,
    fileUrl: `/downloads/modules/${slug}.pdf`,
    downloads: mockDownloads(slug),
  };
}

function makeActivityTermNode(
  grade: number,
  medium: string,
  term: number,
  bookNames: string[],
): DirectoryNode {
  return {
    id: `activity-grade-${grade}-${medium}-term-${term}`,
    kind: "term",
    name: `Term ${term}`,
    children: bookNames.map((name) =>
      makeActivityBook(grade, medium, term, name),
    ),
  };
}

function makeActivityGradeNode(
  grade: number,
  medium: "sinhala" | "tamil",
): DirectoryNode {
  const data = ACTIVITY_BOOKS_DATA[grade]?.[medium];
  // Placeholder terms for grades without real data yet — flagged clearly
  // so it's obvious in the UI this isn't final content.
  const terms: ActivityTermData = data ?? {
    term1: ["Activity Book (placeholder — awaiting real booklist)"],
    term2: ["Activity Book (placeholder — awaiting real booklist)"],
    term3: ["Activity Book (placeholder — awaiting real booklist)"],
  };

  return {
    id: `activity-grade-${grade}-${medium}`,
    kind: "grade",
    name: `Grade ${grade}`,
    children: [
      makeActivityTermNode(grade, medium, 1, terms.term1),
      makeActivityTermNode(grade, medium, 2, terms.term2),
      makeActivityTermNode(grade, medium, 3, terms.term3),
    ],
  };
}

function makeActivityMediumNode(
  medium: "sinhala" | "tamil",
  label: string,
): DirectoryNode {
  const availableGrades = Object.keys(ACTIVITY_BOOKS_DATA)
    .map(Number)
    .sort((a, b) => a - b);

  return {
    id: `activity-medium-${medium}`,
    kind: "medium",
    name: label,
    children: availableGrades.map((g) => makeActivityGradeNode(g, medium)),
  };
}

// --- Common English Books (Modules → Activity Books only): ABOE content,
// shared across Sinhala and Tamil Medium — no per-medium split, unlike
// the subject books elsewhere in Activity Books. Deliberately a SEPARATE
// tree from Textbooks' "Common English Books" — Modules and Textbooks are
// parallel, independent curricula, not a shared content pool.

function makeModuleCommonEnglishBook(
  grade: number,
  term: number | null,
  name: string,
): BookNode {
  const displayName = term ? `${name} – Term ${term}` : name;
  const slug = term
    ? slugify(
        "module-common-english-grade",
        String(grade),
        "term",
        String(term),
        name,
      )
    : slugify("module-common-english-grade", String(grade), name);
  return {
    id: slug,
    kind: "book",
    name: displayName,
    subject: name,
    printYear: mockPrintYear(grade, name),
    fileSize: `${(1.2 + (grade % 3) * 0.3).toFixed(1)} MB`,
    fileUrl: `/downloads/modules/${slug}.pdf`,
    downloads: mockDownloads(slug),
  };
}

type ModuleCommonEnglishData =
  | { hasTerm: false; books: string[] }
  | { hasTerm: true; term1: string[]; term2: string[]; term3: string[] };

const MODULE_COMMON_ENGLISH_DATA: Record<number, ModuleCommonEnglishData> = {
  1: {
    hasTerm: true,
    term1: ["ABOE Activity Book I"],
    term2: ["ABOE Activity Book II"],
    term3: ["ABOE Activity Book III"],
  },
  2: {
    hasTerm: true,
    term1: ["ABOE - Activity Based Oral English"],
    term2: ["ABOE - Activity Based Oral English"],
    term3: ["ABOE - Activity Based Oral English"],
  },
  // Grades 3–5 pending real data — placeholder fallback below.
};

function makeModuleCommonEnglishTermNode(
  grade: number,
  term: number,
  names: string[],
): DirectoryNode {
  return {
    id: `module-common-english-grade-${grade}-term-${term}`,
    kind: "term",
    name: `Term ${term}`,
    children: names.map((name) =>
      makeModuleCommonEnglishBook(grade, term, name),
    ),
  };
}

function makeModuleCommonEnglishGradeNode(grade: number): DirectoryNode {
  const data = MODULE_COMMON_ENGLISH_DATA[grade];

  if (!data) {
    return {
      id: `module-common-english-grade-${grade}`,
      kind: "grade",
      name: `Grade ${grade}`,
      children: [
        makeModuleCommonEnglishBook(
          grade,
          null,
          "Common English Book (placeholder — awaiting real booklist)",
        ),
      ],
    };
  }

  if (!data.hasTerm) {
    return {
      id: `module-common-english-grade-${grade}`,
      kind: "grade",
      name: `Grade ${grade}`,
      children: data.books.map((name) =>
        makeModuleCommonEnglishBook(grade, null, name),
      ),
    };
  }

  return {
    id: `module-common-english-grade-${grade}`,
    kind: "grade",
    name: `Grade ${grade}`,
    children: [
      makeModuleCommonEnglishTermNode(grade, 1, data.term1),
      makeModuleCommonEnglishTermNode(grade, 2, data.term2),
      makeModuleCommonEnglishTermNode(grade, 3, data.term3),
    ],
  };
}

const moduleCommonEnglishBooks: DirectoryNode = {
  id: "module-common-english-books",
  kind: "bookType",
  name: "Common English Books",
  children: Object.keys(MODULE_COMMON_ENGLISH_DATA)
    .map(Number)
    .sort((a, b) => a - b)
    .map((g) => makeModuleCommonEnglishGradeNode(g)),
};

export const activityBooksTree: DirectoryNode = {
  id: "activity-books",
  kind: "bookType",
  name: "Activity Books (Grade 1 to 5 only)",
  children: [
    makeActivityMediumNode("sinhala", "Sinhala Medium"),
    makeActivityMediumNode("tamil", "Tamil Medium"),
    moduleCommonEnglishBooks,
  ],
};

// ────────────────────────────────────────────────────────────
// Modules — Essential Learning, Further Learning, Transversal Skills.
// All three now share the same shape as Activity Books:
// bookType → Medium → Grade → Term → Book. The "Subject" folder layer
// used previously has been dropped — real data shows subjects don't
// appear uniformly across terms, and book titles change per term rather
// than staying fixed with just a term number attached. `subject` on each
// BookNode still tracks the underlying topic for search/filtering, it
// just no longer dictates tree nesting.
// ────────────────────────────────────────────────────────────

interface ModuleGradeTermData {
  term1: string[];
  term2: string[];
  term3: string[];
}

function makeModuleTermBook(
  grade: number,
  medium: string,
  term: number,
  name: string,
  categorySlug: string,
): BookNode {
  const slug = slugify(
    categorySlug,
    "grade",
    String(grade),
    medium,
    "term",
    String(term),
    name,
  );
  return {
    id: slug,
    kind: "book",
    name,
    subject: name,
    printYear: moduleStartYear(grade),
    fileSize: `${(1.5 + (term % 3) * 0.35).toFixed(1)} MB`,
    fileUrl: `/downloads/modules/${slug}.pdf`,
    downloads: mockDownloads(slug),
  };
}

// Returns null (rather than an empty folder) when a term has no books for
// this medium — e.g. Grade 6 Term 1 has content only for English Medium,
// so Sinhala/Tamil Medium simply don't get a Term 1 folder at all.
function makeModuleTermNode(
  grade: number,
  medium: string,
  term: number,
  names: string[],
  categorySlug: string,
): DirectoryNode {
  const books =
    names.length > 0
      ? names.map((n) =>
          makeModuleTermBook(grade, medium, term, n, categorySlug),
        )
      : [
          makeModuleTermBook(
            grade,
            medium,
            term,
            "Module Book (placeholder — awaiting real booklist)",
            categorySlug,
          ),
        ];

  return {
    id: `${categorySlug}-grade-${grade}-${medium}-term-${term}`,
    kind: "term",
    name: `Term ${term}`,
    children: books,
  };
}

function makeModuleGradeNode(
  grade: number,
  medium: string,
  data: ModuleGradeTermData,
  categorySlug: string,
): DirectoryNode {
  const termNodes = [1, 2, 3]
    .map((t) =>
      makeModuleTermNode(
        grade,
        medium,
        t,
        t === 1 ? data.term1 : t === 2 ? data.term2 : data.term3,
        categorySlug,
      ),
    )
    .filter((n): n is DirectoryNode => n !== null);

  return {
    id: `${categorySlug}-grade-${grade}-${medium}`,
    kind: "grade",
    name: `Grade ${grade}`,
    children: termNodes,
  };
}

function makeModuleMediumNode(
  medium: MediumKey,
  label: string,
  gradeData: Record<number, ModuleGradeTermData>,
  categorySlug: string,
): DirectoryNode {
  const availableGrades = Object.keys(gradeData)
    .map(Number)
    .sort((a, b) => a - b);
  
  return {
    id: `${categorySlug}-medium-${medium}`,
    kind: "medium",
    name: label,
    children: availableGrades.map((g) =>
      makeModuleGradeNode(g, medium, gradeData[g], categorySlug),
    ),
  };
}

// --- Essential Learning Books — Grade 6 real data ---

const ESSENTIAL_GRADE_6_SINHALA: ModuleGradeTermData = {
  term1: [],
  term2: [
    "Buddhism – Term 2",
    "Catholicism – Term 2",
    "Christianity – Term 2",
    "Islam – Term 2",
    "Sinhala Language & Literature",
    "Second National Language - Wadan Mihira",
    "Mathematics - Second Term - Module 1, 2, 3",
    "Science Second Term Module 1, 2, 3",
    "Let's Present presentation Electronically / Instructions to Actions",
    "Health & Physical Education Second Term Module 1, 2, 3",
    "Technology for Life Second Term Module 1, 2",
    "History Module 3 & 4",
    "Amazing Earth Wonders and Challengers - Geography",
    "Our Motherland - Civic Education",
    "Art - Second Term",
    "Dancing - Second Term",
    "Oriental Music - Second Term",
    "Drama & Theater - Second Term",
    "Entrepreneurship & Financial Literacy - Second Term",
  ],
  term3: [
    "Buddhism – Term 3",
    "Catholicism – Term 3",
    "Christianity – Term 3",
    "Islam – Term 3",
    "Sinhala Language & Literature Module 7, 8, 9",
    "Second Language - Tamil",
    "Mathematics - Third Term - Module 1, 2, 3",
    "Science Third Term Module 1, 2, 3",
    "Health & Physical Education Third Term Module 1, 2, 3",
    "Use Internet for Explore and Communicate Information",
    "Play and Learn with Machine Intelligence and Embedded Systems",
    "Technology for Life Third Term Module 1, 2",
    "Let's Commit to the Sustainable Environment - Geography",
    "Ancient civilizations of the world - History",
    "Law for Life - Civic Education",
    "Art - Third Term",
    "Dancing - Third Term",
    "Oriental Music - Third Term",
    "Drama & Theater - Third Term",
    "Entrepreneurship & Financial Literacy - Third Term",
  ],
};

const ESSENTIAL_GRADE_6_TAMIL: ModuleGradeTermData = {
  term1: [],
  term2: [
    "Hinduism - Saivaneri – Term 2",
    "Catholicism – Term 2",
    "Christianity – Term 2",
    "Islam – Term 2",
    "Tamil Language & Literature – Term 2",
    "Second National Language - Wadan Mihira",
    "Mathematics - Second Term - Module 1, 2, 3",
    "Science Second Term Module 1, 2, 3",
    "Let's Present presentation Electronically / Instructions to Actions",
    "Health & Physical Education Second Term Module 1, 2, 3",
    "Technology for Life Second Term Module 1, 2",
    "History Module 3 & 4",
    "Amazing Earth Wonders and Challengers - Geography",
    "Our Motherland - Civic Education",
    "Art - Second Term",
    "Bharatanatyam - Second Term",
    "Carnatic Music - Second Term",
    "Drama & Theater - Second Term",
    "Entrepreneurship & Financial Literacy - Second Term",
  ],
  term3: [
    "Hinduism - Saivaneri – Term 3",
    "Catholicism – Term 3",
    "Christianity – Term 3",
    "Islam – Term 3",
    "Tamil Language & Literature – Term 3",
    "Second Language Sinhala - Kavi Gee Katha Mihira",
    "Mathematics - Third Term - Module 1, 2, 3",
    "Science Third Term Module 1, 2, 3",
    "Health & Physical Education Third Term Module 1, 2, 3",
    "Use Internet for Explore and Communicate Information",
    "Play and Learn with Machine Intelligence and Embedded Systems",
    "Technology for Life Third Term Module 1, 2",
    "Let's Commit to the Sustainable Environment - Geography",
    "Ancient civilizations of the world - History",
    "Law for Life - Civic Education",
    "Art - Third Term",
    "Bharatanatyam - Third Term",
    "Carnatic Music - Third Term",
    "Drama & Theater - Third Term",
    "Entrepreneurship & Financial Literacy - Third Term",
  ],
};

const ESSENTIAL_GRADE_6_ENGLISH: ModuleGradeTermData = {
  term1: [
    "Information and Communication Technology First Term Module 1, 2",
    "Vision for Life - Entrepreneurship & Financial Literacy",
  ],
  term2: [
    "Mathematics - Second Term - Module 1, 2, 3",
    "Science Second Term Module 1, 2, 3",
    "Let's Present presentation Electronically / Instructions to Actions",
    "Health & Physical Education Second Term Module 1, 2, 3",
    "History Module 3 & 4",
    "Amazing Earth Wonders and Challengers - Geography",
    "Our Motherland - Civic Education",
    "Western Music - Second Term",
    "Entrepreneurship & Financial Literacy - Second Term",
  ],
  term3: [
    "Mathematics - Third Term - Module 1, 2, 3",
    "Science Third Term Module 1, 2, 3",
    "Health & Physical Education Third Term Module 1, 2, 3",
    "Use Internet for Explore and Communicate Information",
    "Play and Learn with Machine Intelligence and Embedded Systems",
    "Let's Commit to the Sustainable Environment - Geography",
    "Ancient civilizations of the world - History",
    "Law for Life - Civic Education",
    "Western Music - Third Term",
    "Entrepreneurship & Financial Literacy - Third Term",
  ],
};

// Common English Books — Essential Learning only, per your instruction.
// No confirmed content for any grade yet (Grade 6 included) — this exists
// purely as a ready placeholder slot for future grades.
const commonEnglishBooksEssentialLearning: DirectoryNode = {
  id: "common-english-books-essential-learning",
  kind: "bookType",
  name: "Common English Books",
  children: [6, 7, 8, 9, 10, 11].map((g) => ({
    id: `common-english-essential-grade-${g}`,
    kind: "grade",
    name: `Grade ${g}`,
    children: [
      makeModuleTermBook(
        g,
        "common",
        1,
        "Common English Book (placeholder — awaiting confirmation)",
        "common-english-essential",
      ),
    ],
  })),
};

export const essentialLearningTree: DirectoryNode = {
  id: "essential-learning-books",
  kind: "bookType",
  name: "Essential Learning Books",
  children: [
    makeModuleMediumNode(
      "sinhala",
      "Sinhala Medium",
      { 6: ESSENTIAL_GRADE_6_SINHALA },
      "essential",
    ),
    makeModuleMediumNode(
      "tamil",
      "Tamil Medium",
      { 6: ESSENTIAL_GRADE_6_TAMIL },
      "essential",
    ),
    makeModuleMediumNode(
      "english",
      "English Medium",
      { 6: ESSENTIAL_GRADE_6_ENGLISH },
      "essential",
    ),
    commonEnglishBooksEssentialLearning,
  ],
};

// --- Further Learning Books — Grade 6 real data ---

const FURTHER_GRADE_6_SINHALA: ModuleGradeTermData = {
  term1: [],
  term2: [
    "Mathematics Second Term - Tangrams related to Plane Figures",
    "Let's Manage Plastic - Science",
    "Let's Draw Pictures using Computer - ICT",
    "Early settlements of the world - History",
    "Appreciation of Literature - Sahitha Siyapatha",
  ],
  term3: [
    "Mathematics Third Term - History of Measurements",
    "Wonder of Science - Science",
    "E-Learning Tools - ICT",
    "Town Planing of ancient civilization in the world - History",
    "Appreciation of Literature - Sahitha Kadapatha",
  ],
};

const FURTHER_GRADE_6_TAMIL: ModuleGradeTermData = {
  term1: [],
  term2: [
    "Mathematics Second Term - Tangrams related to Plane Figures",
    "Let's Manage Plastic - Science",
    "Let's Draw Pictures using Computer - ICT",
    "Early settlements of the world - History",
    "Tamil Literary Appreciation – Term 2",
  ],
  term3: [
    "Mathematics Third Term - History of Measurements",
    "Wonder of Science - Science",
    "E-Learning Tools - ICT",
    "Town Planing of ancient civilization in the world - History",
    "Tamil Literary Appreciation – Term 3",
  ],
};

const FURTHER_GRADE_6_ENGLISH: ModuleGradeTermData = {
  term1: ["Story of the Life - History"],
  term2: [
    "Mathematics Second Term - Tangrams related to Plane Figures",
    "Let's Manage Plastic - Science",
    "Let's Draw Pictures using Computer - ICT",
    "Early settlements of the world - History",
  ],
  term3: [
    "Mathematics Third Term - History of Measurements",
    "Wonder of Science - Science",
    "E-Learning Tools - ICT",
    "Town Planing of ancient civilization in the world - History",
  ],
};

export const furtherLearningTree: DirectoryNode = {
  id: "further-learning-books",
  kind: "bookType",
  name: "Further Learning Books",
  children: [
    makeModuleMediumNode(
      "sinhala",
      "Sinhala Medium",
      { 6: FURTHER_GRADE_6_SINHALA },
      "further",
    ),
    makeModuleMediumNode(
      "tamil",
      "Tamil Medium",
      { 6: FURTHER_GRADE_6_TAMIL },
      "further",
    ),
    makeModuleMediumNode(
      "english",
      "English Medium",
      { 6: FURTHER_GRADE_6_ENGLISH },
      "further",
    ),
  ],
};

// --- Transversal Skills Books — Grade 6 real data (identical across all
// three mediums, since every entry is tagged S/T/E together) ---

const TRANSVERSAL_GRADE_6: ModuleGradeTermData = {
  term1: [],
  term2: ["Global Village - Global Studies"],
  term3: ["Feeding the World - Global Studies"],
};

export const transversalSkillsTree: DirectoryNode = {
  id: "transversal-skills-books",
  kind: "bookType",
  name: "Transversal Skills Books",
  children: [
    makeModuleMediumNode(
      "sinhala",
      "Sinhala Medium",
      { 6: TRANSVERSAL_GRADE_6 },
      "transversal",
    ),
    makeModuleMediumNode(
      "tamil",
      "Tamil Medium",
      { 6: TRANSVERSAL_GRADE_6 },
      "transversal",
    ),
    makeModuleMediumNode(
      "english",
      "English Medium",
      { 6: TRANSVERSAL_GRADE_6 },
      "transversal",
    ),
  ],
};

export const moduleTree: DirectoryNode = {
  id: "modules",
  kind: "category",
  name: "Modules",
  children: [
    activityBooksTree,
    essentialLearningTree,
    furtherLearningTree,
    transversalSkillsTree,
  ],
};

// ────────────────────────────────────────────────────────────
// Phase 4: Pirivena — new top-level root. No medium split, per your data.
// ────────────────────────────────────────────────────────────

const PIRIVENA_GRADE_1: string[] = [
  "Sinhala",
  "Pali Language",
  "Sanskrit Language",
  "Tripitaka Dhamma",
  "Mathematics",
  "English",
  "Secondary Language Tamil",
];
const PIRIVENA_GRADE_2: string[] = [...PIRIVENA_GRADE_1, "English Workbook"];
const PIRIVENA_GRADE_3_5: string[] = [
  ...PIRIVENA_GRADE_2,
  "History",
  "Social Studies",
  "Geography",
  "General Science",
  "Health",
];

function makePirivenaBook(grade: number, subject: string): BookNode {
  const slug = slugify("pirivena-grade", String(grade), subject);
  return {
    id: slug,
    kind: "book",
    name: subject,
    subject,
    printYear: mockPrintYear(grade, subject),
    fileSize: `${(1.8 + (grade % 3) * 0.4).toFixed(1)} MB`,
    fileUrl: `/downloads/pirivena/${slug}.pdf`,
    downloads: mockDownloads(slug),
  };
}

function makePirivenaGradeNode(
  grade: number,
  subjects: string[],
): DirectoryNode {
  return {
    id: `pirivena-grade-${grade}`,
    kind: "grade",
    name: `Grade ${grade}`,
    children: subjects.map((s) => makePirivenaBook(grade, s)),
  };
}

export const pirivenaTree: DirectoryNode = {
  id: "pirivena",
  kind: "category",
  name: "Pirivena Books",
  children: [
    makePirivenaGradeNode(1, PIRIVENA_GRADE_1),
    makePirivenaGradeNode(2, PIRIVENA_GRADE_2),
    makePirivenaGradeNode(3, PIRIVENA_GRADE_3_5),
    makePirivenaGradeNode(4, PIRIVENA_GRADE_3_5),
    makePirivenaGradeNode(5, PIRIVENA_GRADE_3_5),
  ],
};

// ────────────────────────────────────────────────────────────
// Combined roots + Print Year grids
// ────────────────────────────────────────────────────────────

export const downloadRoots: DirectoryNode[] = [
  textbookTree,
  pirivenaTree,
  moduleTree,
];

// Still Textbooks-only, as scoped earlier. Pirivena isn't included here yet
// — say the word if you want a Pirivena print-year grid added too.
export const printYearGrids: PrintYearGrid[] = [
  buildPrintYearGrid(grade1to5, "Grade 1 – 5"),
  buildPrintYearGrid(grade6to11, "Grade 6 – 11"),
];
