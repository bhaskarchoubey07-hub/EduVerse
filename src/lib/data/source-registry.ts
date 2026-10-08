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

// ==============================================================================
// SECTION 3: OFFICIAL SOURCE REGISTRY (content_sources table models)
// Trust Levels: LEVEL_1 = Official Government/Board, LEVEL_2 = Authorized Source
// ==============================================================================
import { ContentSourceRecord } from "@/types/content-engine";

export const OFFICIAL_CONTENT_SOURCES: ContentSourceRecord[] = [
  // 1. CBSE Main Portal
  {
    id: "src-cbse-official-portal",
    board_id: "cbse",
    source_name: "CBSE Official Main Portal & Pariksha Sangam",
    source_type: "official_board",
    official_url: "https://www.cbse.gov.in/",
    document_url: "https://parikshasangam.cbse.gov.in/",
    source_category: "curriculum",
    language: "english",
    academic_year: "2025-2026",
    syllabus_year: "2025-2026",
    license_status: "GOVERNMENT_OPEN_DATA",
    permission_status: "authorized_redistribution",
    trust_level: "LEVEL_1",
    last_checked_at: "2026-03-25T10:00:00Z",
    checksum: "sha256-cbse-gov-in-parikshasangam-root",
    content_hash: "hash-cbse-portal-verified",
    status: "active",
    notes: "Primary portal for examination notices, Pariksha Sangam resources, and board notifications.",
  },

  // 2. CBSE Examination Archive
  {
    id: "src-cbse-pyq-archive",
    board_id: "cbse",
    source_name: "CBSE Past Examination Papers & Marking Schemes Archive",
    source_type: "official_board",
    official_url: "https://www.cbse.gov.in/cbsenew/question-paper.html",
    document_url: "https://cbseacademic.nic.in/marking_scheme.html",
    source_category: "question_paper",
    language: "english",
    class: 10,
    subject: "science",
    academic_year: "2024-2025",
    syllabus_year: "2024-2025",
    license_status: "GOVERNMENT_OPEN_DATA",
    permission_status: "verified_public",
    trust_level: "LEVEL_1",
    last_checked_at: "2026-03-20T14:30:00Z",
    checksum: "sha256-7f89c0b1e4210dcb8291a1cbse2025sci3111",
    content_hash: "hash-cbse-pyq-2025-verified",
    status: "active",
    notes: "Official repository of question papers, marking schemes, and model answer keys for Class 10 & 12.",
  },

  // 3. NCERT Textbook Portal
  {
    id: "src-ncert-textbooks",
    board_id: "cbse",
    source_name: "NCERT Rationalized Textbook & Exemplar Portal",
    source_type: "official_ncert",
    official_url: "https://www.ncert.nic.in/",
    document_url: "https://ncert.nic.in/textbook.php",
    source_category: "textbook",
    language: "english",
    class: 10,
    subject: "science",
    academic_year: "2025-2026",
    syllabus_year: "2025-2026",
    license_status: "EDUCATIONAL_FAIR_USE",
    permission_status: "verified_public",
    trust_level: "LEVEL_1",
    last_checked_at: "2026-03-15T09:15:00Z",
    checksum: "sha256-ncert-textbook-class10-science-rat2024",
    content_hash: "hash-ncert-rationalized-10th-sci",
    status: "active",
    notes: "Authoritative rationalized textbook PDFs and exemplar problem collections.",
  },

  // 4. CISCE Official Portal
  {
    id: "src-cisce-portal",
    board_id: "cisce",
    source_name: "Council for the Indian School Certificate Examinations (CISCE)",
    source_type: "official_cisce",
    official_url: "https://cisce.org/",
    document_url: "https://cisce.org/previous-years-question-papers",
    source_category: "question_paper",
    language: "english",
    academic_year: "2024-2025",
    syllabus_year: "2025-2026",
    license_status: "EDUCATIONAL_FAIR_USE",
    permission_status: "fair_use_metadata",
    trust_level: "LEVEL_1",
    last_checked_at: "2026-03-18T12:00:00Z",
    checksum: "sha256-cisce-official-curriculum-portal",
    content_hash: "hash-cisce-regulations-active",
    status: "active",
    notes: "Official syllabi, specimen papers, and pupil performance reviews for ICSE & ISC.",
  },

  // 5. NIOS Official Portal
  {
    id: "src-nios-portal",
    board_id: "nios",
    source_name: "National Institute of Open Schooling (NIOS)",
    source_type: "official_nios",
    official_url: "https://nios.ac.in/",
    document_url: "https://www.nios.ac.in/online-course-material.aspx",
    source_category: "textbook",
    language: "english",
    academic_year: "2025-2026",
    syllabus_year: "2025-2026",
    license_status: "GOVERNMENT_OPEN_DATA",
    permission_status: "authorized_redistribution",
    trust_level: "LEVEL_1",
    last_checked_at: "2026-03-22T11:45:00Z",
    checksum: "sha256-nios-ac-in-course-materials",
    content_hash: "hash-nios-secondary-senior",
    status: "active",
    notes: "Self-learning material, Secondary (10th) & Senior Secondary (12th) question banks.",
  },

  // 6. Maharashtra State Board (MSBSHSE)
  {
    id: "src-msbshse-portal",
    board_id: "msbshse",
    source_name: "Maharashtra State Board of Secondary and Higher Secondary Education",
    source_type: "official_board",
    official_url: "https://mahahsscboard.in",
    document_url: "https://mahahsscboard.in/question_papers.html",
    source_category: "question_paper",
    language: "marathi",
    academic_year: "2024-2025",
    syllabus_year: "2025-2026",
    license_status: "GOVERNMENT_OPEN_DATA",
    permission_status: "fair_use_metadata",
    trust_level: "LEVEL_1",
    last_checked_at: "2026-03-10T16:20:00Z",
    checksum: "sha256-msbshse-pune-papers-archive",
    content_hash: "hash-msbshse-ssc-hsc-papers",
    status: "active",
    notes: "SSC (10th) and HSC (12th) official papers, evaluation blueprints.",
  },

  // 7. Punjab School Education Board (PSEB)
  {
    id: "src-pseb-portal",
    board_id: "pseb",
    source_name: "Punjab School Education Board (PSEB)",
    source_type: "official_board",
    official_url: "https://www.pseb.ac.in",
    document_url: "https://www.pseb.ac.in/previous-year-question-papers",
    source_category: "question_paper",
    language: "punjabi",
    academic_year: "2024-2025",
    syllabus_year: "2025-2026",
    license_status: "GOVERNMENT_OPEN_DATA",
    permission_status: "verified_public",
    trust_level: "LEVEL_1",
    last_checked_at: "2026-03-14T08:30:00Z",
    checksum: "sha256-pseb10sci2024verified",
    content_hash: "hash-pseb-annual-papers",
    status: "active",
    notes: "Bilingual Punjabi/English curriculum, model tests, and matriculation papers.",
  },

  // 8. UP Board (UPMSP)
  {
    id: "src-upmsp-portal",
    board_id: "upmsp",
    source_name: "Uttar Pradesh Madhyamik Shiksha Parishad (UPMSP)",
    source_type: "official_board",
    official_url: "https://upmsp.edu.in",
    document_url: "https://upmsp.edu.in/ModelPaper.html",
    source_category: "sample_paper",
    language: "hindi",
    academic_year: "2024-2025",
    syllabus_year: "2025-2026",
    license_status: "GOVERNMENT_OPEN_DATA",
    permission_status: "verified_public",
    trust_level: "LEVEL_1",
    last_checked_at: "2026-03-16T15:00:00Z",
    checksum: "sha256-upmsp-prayagraj-model-papers",
    content_hash: "hash-upmsp-highschool-inter",
    status: "active",
    notes: "Official model questions and blueprint for UP Board Class 10 & 12 examinations.",
  },
];

export function getContentSourcesByBoard(boardId: string): ContentSourceRecord[] {
  return OFFICIAL_CONTENT_SOURCES.filter((s) => s.board_id === boardId);
}

export function getContentSourcesByTrustLevel(trustLevel: string): ContentSourceRecord[] {
  return OFFICIAL_CONTENT_SOURCES.filter((s) => s.trust_level === trustLevel);
}

