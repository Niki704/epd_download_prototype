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

const BAND_GRADE_10_11: SubjectAvailability[] = [
  ...BAND_GRADE_9.filter(
    (s) =>
      s.name !== "Information & Communication Technology Reading Book" &&
      s.name !== "Information & Communication Technology Workbook",
  ),
  {
    name: "Information & Communication Technology",
    mediums: ["sinhala", "tamil", "english"],
  },
  { name: "Sinhala Literature Anthology", mediums: ["sinhala", "tamil"] },
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
  { name: "Japanese Language", mediums: ["sinhala"] },
];

const SECONDARY_BANDS: Record<number, SubjectAvailability[]> = {
  6: BAND_GRADE_6,
  7: BAND_GRADE_7_8,
  8: BAND_GRADE_7_8,
  9: BAND_GRADE_9,
  10: BAND_GRADE_10_11,
  11: BAND_GRADE_10_11,
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

const FURTHER_LEARNING_SUBJECTS = [
  "Information & Communication Technology",
  "Business Studies",
  "Agriculture",
  "Art",
  "Music",
  "Health & Physical Education",
];

function moduleStartYear(grade: number): number {
  return grade <= 5 ? 2025 + grade : 2021 + grade;
}

// --- Activity Books (Grades 1–5): bookType → Grade → Term, no subject layer ---

function makeActivityTermBook(
  grade: number,
  medium: string,
  term: number,
): BookNode {
  const slug = `activity-grade-${grade}-${medium}-term-${term}`;
  return {
    id: slug,
    kind: "book",
    name: `Activity Book – Term ${term}`,
    subject: "Activity Book",
    printYear: moduleStartYear(grade),
    fileSize: `${(1.5 + (term % 3) * 0.4).toFixed(1)} MB`,
    fileUrl: `/downloads/modules/${slug}.pdf`,
    downloads: mockDownloads(slug),
  };
}

function makeActivityGradeNode(grade: number, medium: string): DirectoryNode {
  return {
    id: `activity-grade-${grade}-${medium}`,
    kind: "grade",
    name: `Grade ${grade}`,
    children: [1, 2, 3].map((term) =>
      makeActivityTermBook(grade, medium, term),
    ),
  };
}

function makeActivityMediumNode(
  medium: "sinhala" | "tamil",
  label: string,
): DirectoryNode {
  return {
    id: `activity-medium-${medium}`,
    kind: "medium",
    name: label,
    children: [1, 2, 3, 4, 5].map((g) => makeActivityGradeNode(g, medium)),
  };
}

export const activityBooksTree: DirectoryNode = {
  id: "activity-books",
  kind: "bookType",
  name: "Activity Books",
  children: [
    makeActivityMediumNode("sinhala", "Sinhala Medium"),
    makeActivityMediumNode("tamil", "Tamil Medium"),
  ],
};

// --- Essential Learning Books (Grades 6–11): bookType → Medium → Grade → Subject → Term ---

function makeEssentialTermBook(
  grade: number,
  medium: string,
  subject: string,
  term: number,
): BookNode {
  const slug = slugify(
    "essential-grade",
    String(grade),
    medium,
    subject,
    "term",
    String(term),
  );
  return {
    id: slug,
    kind: "book",
    name: `Term ${term}`,
    subject,
    printYear: moduleStartYear(grade),
    fileSize: `${(1.5 + (term % 3) * 0.4).toFixed(1)} MB`,
    fileUrl: `/downloads/modules/${slug}.pdf`,
    downloads: mockDownloads(slug),
  };
}

function makeEssentialSubjectNode(
  grade: number,
  medium: string,
  subject: string,
): DirectoryNode {
  const slug = slugify("essential-subject", String(grade), medium, subject);
  return {
    id: slug,
    kind: "subject",
    name: subject,
    children: [1, 2, 3].map((term) =>
      makeEssentialTermBook(grade, medium, subject, term),
    ),
  };
}

function makeEssentialGradeNode(grade: number, medium: string): DirectoryNode {
  return {
    id: `essential-grade-${grade}-${medium}`,
    kind: "grade",
    name: `Grade ${grade}`,
    children: subjectsForMedium(SECONDARY_BANDS[grade], medium as MediumKey)
      .length
      ? subjectsForMedium(SECONDARY_BANDS[grade], medium as MediumKey).map(
          (s) => makeEssentialSubjectNode(grade, medium, s),
        )
      : [],
  };
}

function makeEssentialMediumNode(
  medium: MediumKey,
  label: string,
): DirectoryNode {
  return {
    id: `essential-medium-${medium}`,
    kind: "medium",
    name: label,
    children: [6, 7, 8, 9, 10, 11].map((g) =>
      makeEssentialGradeNode(g, medium),
    ),
  };
}

export const essentialLearningTree: DirectoryNode = {
  id: "essential-learning-books",
  kind: "bookType",
  name: "Essential Learning Books",
  children: [
    makeEssentialMediumNode("sinhala", "Sinhala Medium"),
    makeEssentialMediumNode("tamil", "Tamil Medium"),
    makeEssentialMediumNode("english", "English Medium"),
  ],
};

// --- Further Learning Books (Grades 6–11): bookType → Medium → Grade → Subject (leaf, no term) ---
// Every subject is released for every student — no per-student subject
// selection logic here, and no term split (unconfirmed / subject to change).

function makeFurtherSubjectBook(
  grade: number,
  medium: string,
  subject: string,
): BookNode {
  const slug = slugify("further-grade", String(grade), medium, subject);
  return {
    id: slug,
    kind: "book",
    name: subject,
    subject,
    printYear: moduleStartYear(grade),
    fileSize: `${(2.2 + (grade % 3) * 0.5).toFixed(1)} MB`,
    fileUrl: `/downloads/modules/${slug}.pdf`,
    downloads: mockDownloads(slug),
  };
}

function makeFurtherGradeNode(grade: number, medium: string): DirectoryNode {
  return {
    id: `further-grade-${grade}-${medium}`,
    kind: "grade",
    name: `Grade ${grade}`,
    children: FURTHER_LEARNING_SUBJECTS.map((s) =>
      makeFurtherSubjectBook(grade, medium, s),
    ),
  };
}

function makeFurtherMediumNode(
  medium: MediumKey,
  label: string,
): DirectoryNode {
  return {
    id: `further-medium-${medium}`,
    kind: "medium",
    name: label,
    children: [6, 7, 8, 9, 10, 11].map((g) => makeFurtherGradeNode(g, medium)),
  };
}

export const furtherLearningTree: DirectoryNode = {
  id: "further-learning-books",
  kind: "bookType",
  name: "Further Learning Books",
  children: [
    makeFurtherMediumNode("sinhala", "Sinhala Medium"),
    makeFurtherMediumNode("tamil", "Tamil Medium"),
    makeFurtherMediumNode("english", "English Medium"),
  ],
};

// ────────────────────────────────────────────────────────────
// Transversal Skills Books (new — under Modules, flat, no sub-categories yet)
// ────────────────────────────────────────────────────────────

export const transversalSkillsTree: DirectoryNode = {
  id: "transversal-skills-books",
  kind: "bookType",
  name: "Transversal Skills Books",
  children: [
    {
      id: "transversal-social-charity-services",
      kind: "book",
      name: "Social Charity Services Book",
      subject: "Social Charity Services",
      printYear: 2026,
      fileSize: "2.8 MB",
      fileUrl: "/downloads/modules/transversal-social-charity-services.pdf",
      downloads: mockDownloads("transversal-social-charity-services"),
    },
    {
      id: "transversal-global-study",
      kind: "book",
      name: "Global Study Book",
      subject: "Global Study",
      printYear: 2026,
      fileSize: "3.0 MB",
      fileUrl: "/downloads/modules/transversal-global-study.pdf",
      downloads: mockDownloads("transversal-global-study"),
    },
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
  name: "Pirivena",
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
  moduleTree,
  pirivenaTree,
];

// Still Textbooks-only, as scoped earlier. Pirivena isn't included here yet
// — say the word if you want a Pirivena print-year grid added too.
export const printYearGrids: PrintYearGrid[] = [
  buildPrintYearGrid(grade1to5, "Grade 1 – 5"),
  buildPrintYearGrid(grade6to11, "Grade 6 – 11"),
];
