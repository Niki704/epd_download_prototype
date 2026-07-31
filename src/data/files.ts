import { DirectoryNode, BookNode } from "@/types/tree";
import { buildPrintYearGrid, PrintYearGrid } from "@/lib/print-years";

// ────────────────────────────────────────────────────────────
// Textbooks (unchanged from before)
// ────────────────────────────────────────────────────────────

const SUBJECTS_1_5 = [
  "Mathematics",
  "Environmental Studies",
  "Religion",
  "Language",
];
const SUBJECTS_6_11 = [
  "Mathematics",
  "Science",
  "History",
  "Geography",
  "Religion",
  "Language & Literature",
];

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

function makeBook(
  gradeLabel: string,
  medium: string,
  subject: string,
  grade: number,
): BookNode {
  const slug = `${gradeLabel}-${medium}-${subject}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
  return {
    id: slug,
    kind: "book",
    name: subject,
    subject,
    printYear: mockPrintYear(grade, subject),
    fileSize: `${(2 + (grade % 4) * 0.6).toFixed(1)} MB`,
    fileUrl: `/downloads/textbooks/${slug}.pdf`,
    downloads: mockDownloads(slug),
  };
}

function makeGradeNode(
  grade: number,
  medium: string,
  subjects: string[],
): DirectoryNode {
  return {
    id: `grade-${grade}-${medium}`,
    kind: "grade",
    name: `Grade ${grade}`,
    children: subjects.map((s) => makeBook(`grade-${grade}`, medium, s, grade)),
  };
}

function makeMediumNode(
  medium: "sinhala" | "tamil" | "english",
  label: string,
  grades: number[],
  subjects: string[],
): DirectoryNode {
  return {
    id: `medium-${medium}-${grades[0]}-${grades[grades.length - 1]}`,
    kind: "medium",
    name: label,
    children: grades.map((g) => makeGradeNode(g, medium, subjects)),
  };
}

// Small local helper — Common English Books leaves aren't generated from a
// uniform subject list (unlike everything else in the tree), since the
// book count and titles genuinely differ per grade. Hand-built on purpose.
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
        `common-english-1-5-grade-${grade}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
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
    makeCommonEnglishGradeNode(1, ["ABOE Activity Book (Grade 1)", "ABOE Song Book (Grade 1"]),
    makeCommonEnglishGradeNode(2, ["ABOE Activity Book (Grade 2)", "ABOE Song Book (Grade 2)"]),
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
    makeMediumNode("sinhala", "Sinhala Medium", [1, 2, 3, 4, 5], SUBJECTS_1_5),
    makeMediumNode("tamil", "Tamil Medium", [1, 2, 3, 4, 5], SUBJECTS_1_5),
    commonEnglishBooks1to5,
  ],
};

// --- Grade 6–11: Sinhala Medium, Tamil Medium, English Medium, Common English Books ---

// Uniform per grade (always exactly Pupils Book + Work Book), so a loop
// fits here — unlike the 1–5 case above.
function makeCommonEnglishGradeNode6to11(grade: number): DirectoryNode {
  const pupilsId = `common-english-6-11-grade-${grade}-pupils`;
  const workId = `common-english-6-11-grade-${grade}-workbook`;
  return {
    id: `common-english-6-11-grade-${grade}`,
    kind: "grade",
    name: `Grade ${grade}`,
    children: [
      {
        id: pupilsId,
        kind: "book",
        name: "English Pupils Book",
        subject: "English Pupils Book",
        printYear: mockPrintYear(grade, "English Pupils Book"),
        fileSize: `${(1.8 + (grade % 3) * 0.3).toFixed(1)} MB`,
        fileUrl: `/downloads/textbooks/${pupilsId}.pdf`,
        downloads: mockDownloads(pupilsId),
      },
      {
        id: workId,
        kind: "book",
        name: "English Work Book",
        subject: "English Work Book",
        printYear: mockPrintYear(grade, "English Work Book"),
        fileSize: `${(1.5 + (grade % 3) * 0.3).toFixed(1)} MB`,
        fileUrl: `/downloads/textbooks/${workId}.pdf`,
        downloads: mockDownloads(workId),
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
    makeMediumNode(
      "sinhala",
      "Sinhala Medium",
      [6, 7, 8, 9, 10, 11],
      SUBJECTS_6_11,
    ),
    makeMediumNode(
      "tamil",
      "Tamil Medium",
      [6, 7, 8, 9, 10, 11],
      SUBJECTS_6_11,
    ),
    makeMediumNode(
      "english",
      "English Medium",
      [6, 7, 8, 9, 10, 11],
      SUBJECTS_6_11,
    ),
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
  const slug = `essential-grade-${grade}-${medium}-${subject}-term-${term}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
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
  const slug = `essential-subject-${grade}-${medium}-${subject}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
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
    children: SUBJECTS_6_11.map((s) =>
      makeEssentialSubjectNode(grade, medium, s),
    ),
  };
}

function makeEssentialMediumNode(
  medium: "sinhala" | "tamil" | "english",
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
  const slug = `further-grade-${grade}-${medium}-${subject}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
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
  medium: "sinhala" | "tamil" | "english",
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
// Combined roots — General English no longer listed separately; it now
// lives inside textbookTree.
// ────────────────────────────────────────────────────────────

export const downloadRoots: DirectoryNode[] = [textbookTree, moduleTree];

// ────────────────────────────────────────────────────────────
// Print Year grids — scoped to Textbooks Grade 1–5 / 6–11 only.
// General English is deliberately excluded: it has no per-grade
// breakdown yet (flat placeholder), so it can't populate a grade×subject
// grid meaningfully.
// ────────────────────────────────────────────────────────────

export const printYearGrids: PrintYearGrid[] = [
  buildPrintYearGrid(grade1to5, "Grade 1 – 5"),
  buildPrintYearGrid(grade6to11, "Grade 6 – 11"),
];