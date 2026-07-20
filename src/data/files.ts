import { DirectoryNode, BookNode } from "@/types/tree";

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
