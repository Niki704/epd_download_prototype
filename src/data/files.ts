import { DirectoryNode, BookNode } from "@/types/tree";

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
    year: 2025,
    fileSize: `${(2 + (grade % 4) * 0.6).toFixed(1)} MB`,
    fileUrl: `/downloads/textbooks/${slug}.pdf`,
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

const grade1to5: DirectoryNode = {
  id: "category-1-5",
  kind: "category",
  name: "Grade 1 – 5",
  children: [
    makeMediumNode("sinhala", "Sinhala Medium", [1, 2, 3, 4, 5], SUBJECTS_1_5),
    makeMediumNode("tamil", "Tamil Medium", [1, 2, 3, 4, 5], SUBJECTS_1_5),
  ],
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
  ],
};

export const textbookTree: DirectoryNode = {
  id: "textbooks",
  kind: "category",
  name: "Textbooks",
  children: [grade1to5, grade6to11],
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

function makeActivityTermBook(grade: number, medium: string, term: number): BookNode {
  const slug = `activity-grade-${grade}-${medium}-term-${term}`;
  return {
    id: slug,
    kind: "book",
    name: `Activity Book – Term ${term}`,
    subject: "Activity Book",
    year: moduleStartYear(grade),
    fileSize: `${(1.5 + (term % 3) * 0.4).toFixed(1)} MB`,
    fileUrl: `/downloads/modules/${slug}.pdf`,
  };
}

function makeActivityGradeNode(grade: number, medium: string): DirectoryNode {
  return {
    id: `activity-grade-${grade}-${medium}`,
    kind: "grade",
    name: `Grade ${grade}`,
    children: [1, 2, 3].map((term) => makeActivityTermBook(grade, medium, term)),
  };
}

function makeActivityMediumNode(medium: "sinhala" | "tamil", label: string): DirectoryNode {
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
  term: number
): BookNode {
  const slug = `essential-grade-${grade}-${medium}-${subject}-term-${term}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
  return {
    id: slug,
    kind: "book",
    name: `Term ${term}`,
    subject,
    year: moduleStartYear(grade),
    fileSize: `${(1.5 + (term % 3) * 0.4).toFixed(1)} MB`,
    fileUrl: `/downloads/modules/${slug}.pdf`,
  };
}

function makeEssentialSubjectNode(grade: number, medium: string, subject: string): DirectoryNode {
  const slug = `essential-subject-${grade}-${medium}-${subject}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
  return {
    id: slug,
    kind: "subject",
    name: subject,
    children: [1, 2, 3].map((term) => makeEssentialTermBook(grade, medium, subject, term)),
  };
}

function makeEssentialGradeNode(grade: number, medium: string): DirectoryNode {
  return {
    id: `essential-grade-${grade}-${medium}`,
    kind: "grade",
    name: `Grade ${grade}`,
    children: SUBJECTS_6_11.map((s) => makeEssentialSubjectNode(grade, medium, s)),
  };
}

function makeEssentialMediumNode(
  medium: "sinhala" | "tamil" | "english",
  label: string
): DirectoryNode {
  return {
    id: `essential-medium-${medium}`,
    kind: "medium",
    name: label,
    children: [6, 7, 8, 9, 10, 11].map((g) => makeEssentialGradeNode(g, medium)),
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

function makeFurtherSubjectBook(grade: number, medium: string, subject: string): BookNode {
  const slug = `further-grade-${grade}-${medium}-${subject}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
  return {
    id: slug,
    kind: "book",
    name: subject,
    subject,
    year: moduleStartYear(grade),
    fileSize: `${(2.2 + (grade % 3) * 0.5).toFixed(1)} MB`,
    fileUrl: `/downloads/modules/${slug}.pdf`,
  };
}

function makeFurtherGradeNode(grade: number, medium: string): DirectoryNode {
  return {
    id: `further-grade-${grade}-${medium}`,
    kind: "grade",
    name: `Grade ${grade}`,
    children: FURTHER_LEARNING_SUBJECTS.map((s) => makeFurtherSubjectBook(grade, medium, s)),
  };
}

function makeFurtherMediumNode(
  medium: "sinhala" | "tamil" | "english",
  label: string
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

export const moduleTree: DirectoryNode = {
  id: "modules",
  kind: "category",
  name: "Modules",
  children: [activityBooksTree, essentialLearningTree, furtherLearningTree],
};

// ────────────────────────────────────────────────────────────
// Combined roots — both trees start at the same top level
// ────────────────────────────────────────────────────────────

export const downloadRoots: DirectoryNode[] = [textbookTree, moduleTree];
