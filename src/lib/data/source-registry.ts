// ==============================================================================
// EDUVERSE AI — CENTRAL SOURCE REGISTRY
// Strict copyright, official provenance, and verification tracking
// ==============================================================================

import { SourceRegistryItem } from "@/types";

export const SOURCE_REGISTRY: SourceRegistryItem[] = [
  // 1. CBSE
  {
    sourceId: "cbse-academic-portal",
    sourceName: "CBSE Academic Curriculum & Syllabus Repository",
    organization: "Central Board of Secondary Education, Ministry of Education, Govt. of India",
    boardCode: "cbse",
    country: "India",
    sourceType: "OFFICIAL_BOARD_PORTAL",
    officialUrl: "https://cbseacademic.nic.in/curriculum_2025.html",
    license: "Government Open Data / Public Educational Assessment Notice",
    copyrightStatus: "GOVERNMENT_OPEN_DATA",
    allowedActions: [
      "EXTRACT_QUESTIONS_FAIR_USE",
      "DOWNLOAD_ORIGINAL",
      "LINK_ONLY",
    ],
    lastChecked: "2026-03-28",
    lastUpdated: "2026-03-15",
    verificationStatus: "OFFICIAL_VERIFIED",
    notes: "Primary repository for Class 10 & 12 curriculum frameworks, unit weightage, and learning objectives.",
  },
  {
    sourceId: "cbse-examination-archive",
    sourceName: "CBSE Official Examination & Question Paper Archive",
    organization: "Central Board of Secondary Education",
    boardCode: "cbse",
    country: "India",
    sourceType: "EXAMINATION_AUTHORITY",
    officialUrl: "https://www.cbse.gov.in/cbsenew/question-paper.html",
    license: "Official Examination Release for Educational Preparation",
    copyrightStatus: "GOVERNMENT_OPEN_DATA",
    allowedActions: [
      "EXTRACT_QUESTIONS_FAIR_USE",
      "DOWNLOAD_ORIGINAL",
      "LINK_ONLY",
    ],
    lastChecked: "2026-03-20",
    lastUpdated: "2026-03-01",
    verificationStatus: "OFFICIAL_VERIFIED",
    notes: "Official repository of past 10-year Class 10 & 12 board examination papers, marking schemes, and model answer keys.",
  },

  // 2. NCERT
  {
    sourceId: "ncert-national-curriculum",
    sourceName: "National Council of Educational Research and Training (NCERT)",
    organization: "NCERT, Department of School Education and Literacy",
    boardCode: "cbse",
    country: "India",
    sourceType: "CURRICULUM_FRAMEWORK",
    officialUrl: "https://ncert.nic.in/textbook.php",
    license: "Educational Fair Use / National Curriculum Reference",
    copyrightStatus: "EDUCATIONAL_FAIR_USE",
    allowedActions: [
      "EXTRACT_QUESTIONS_FAIR_USE",
      "LINK_ONLY",
      "METADATA_ONLY",
    ],
    lastChecked: "2026-03-10",
    lastUpdated: "2026-02-15",
    verificationStatus: "OFFICIAL_VERIFIED",
    notes: "Reference for standard scientific terminology, formulas, and verified exemplar question sets.",
  },

  // 3. CISCE (ICSE / ISC)
  {
    sourceId: "cisce-official-portal",
    sourceName: "Council for the Indian School Certificate Examinations (CISCE)",
    organization: "CISCE New Delhi",
    boardCode: "icse",
    country: "India",
    sourceType: "OFFICIAL_BOARD_PORTAL",
    officialUrl: "https://cisce.org/regulations-and-syllabuses/",
    license: "Official Board Publications / Student Revision Notice",
    copyrightStatus: "RESTRICTED_OFFICIAL_COPYRIGHT",
    allowedActions: [
      "EXTRACT_QUESTIONS_FAIR_USE",
      "LINK_ONLY",
      "METADATA_ONLY",
    ],
    lastChecked: "2026-03-18",
    lastUpdated: "2026-02-28",
    verificationStatus: "OFFICIAL_VERIFIED",
    notes: "Provides ICSE (Class 10) and ISC (Class 12) official regulations, specimen question papers, and pupil performance analyses.",
  },

  // 4. MAHARASHTRA STATE BOARD (MSBSHSE)
  {
    sourceId: "msbshse-pune-portal",
    sourceName: "Maharashtra State Board of Secondary and Higher Secondary Education",
    organization: "MSBSHSE Pune",
    boardCode: "state_board",
    country: "India",
    sourceType: "OFFICIAL_BOARD_PORTAL",
    officialUrl: "https://mahahsscboard.in",
    license: "State Public Education Portal",
    copyrightStatus: "GOVERNMENT_OPEN_DATA",
    allowedActions: ["EXTRACT_QUESTIONS_FAIR_USE", "LINK_ONLY"],
    lastChecked: "2026-03-01",
    lastUpdated: "2026-01-10",
    verificationStatus: "OFFICIALLY_PUBLISHED",
    notes: "State SSC (10th) and HSC (12th) syllabus documents and question bank releases.",
  },

  // 5. UTTAR PRADESH BOARD (UPMSP)
  {
    sourceId: "upmsp-official-portal",
    sourceName: "Uttar Pradesh Madhyamik Shiksha Parishad (UPMSP)",
    organization: "UPMSP Prayagraj",
    boardCode: "state_board",
    country: "India",
    sourceType: "OFFICIAL_BOARD_PORTAL",
    officialUrl: "https://upmsp.edu.in/ModelPaper.html",
    license: "State Public Education Portal",
    copyrightStatus: "GOVERNMENT_OPEN_DATA",
    allowedActions: ["EXTRACT_QUESTIONS_FAIR_USE", "LINK_ONLY"],
    lastChecked: "2026-02-20",
    lastUpdated: "2026-01-05",
    verificationStatus: "OFFICIALLY_PUBLISHED",
    notes: "Official model paper sets for Class 10 (High School) and Class 12 (Intermediate).",
  },

  // 6. PUNJAB SCHOOL EDUCATION BOARD (PSEB)
  {
    sourceId: "pseb-official-portal",
    sourceName: "Punjab School Education Board (PSEB)",
    organization: "PSEB Mohali",
    boardCode: "pseb",
    country: "India",
    sourceType: "OFFICIAL_BOARD_PORTAL",
    officialUrl: "https://www.pseb.ac.in/syllabus",
    license: "State Public Educational Authority",
    copyrightStatus: "GOVERNMENT_OPEN_DATA",
    allowedActions: ["EXTRACT_QUESTIONS_FAIR_USE", "LINK_ONLY"],
    lastChecked: "2026-03-05",
    lastUpdated: "2026-01-20",
    verificationStatus: "OFFICIALLY_PUBLISHED",
    notes: "Bilingual syllabus and structure of question paper for Class 10 & 12 board examinations.",
  },

  // 7. KARNATAKA (KSEAB)
  {
    sourceId: "kseab-karnataka-portal",
    sourceName: "Karnataka School Examination and Assessment Board",
    organization: "Government of Karnataka",
    boardCode: "state_board",
    country: "India",
    sourceType: "EXAMINATION_AUTHORITY",
    officialUrl: "https://kseab.karnataka.gov.in",
    license: "State Government Official Archive",
    copyrightStatus: "GOVERNMENT_OPEN_DATA",
    allowedActions: ["EXTRACT_QUESTIONS_FAIR_USE", "LINK_ONLY"],
    lastChecked: "2026-02-15",
    lastUpdated: "2025-12-18",
    verificationStatus: "OFFICIALLY_PUBLISHED",
    notes: "SSLC and 2nd PUC examination blueprint and model question papers.",
  },

  // 8. TAMIL NADU (TNDGE)
  {
    sourceId: "tndge-official-portal",
    sourceName: "Tamil Nadu Directorate of Government Examinations",
    organization: "Government of Tamil Nadu",
    boardCode: "state_board",
    country: "India",
    sourceType: "OFFICIAL_BOARD_PORTAL",
    officialUrl: "https://dge.tn.gov.in",
    license: "State Educational Resource",
    copyrightStatus: "GOVERNMENT_OPEN_DATA",
    allowedActions: ["EXTRACT_QUESTIONS_FAIR_USE", "LINK_ONLY"],
    lastChecked: "2026-01-25",
    lastUpdated: "2025-11-30",
    verificationStatus: "OFFICIALLY_PUBLISHED",
    notes: "SSLC and Higher Secondary model questions and question blueprints.",
  },
];

export function getSourceById(sourceId: string): SourceRegistryItem | undefined {
  return SOURCE_REGISTRY.find((s) => s.sourceId === sourceId);
}

export function getSourcesForBoard(boardCode: string): SourceRegistryItem[] {
  return SOURCE_REGISTRY.filter((s) => s.boardCode === boardCode || s.boardCode === "state_board");
}
