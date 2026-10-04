// ==============================================================================
// EDUVERSE AI — NORMALIZED EDUCATION HIERARCHY & DATA ARCHITECTURE
// Schema standard: BOARD -> ACADEMIC_YEAR -> CLASS -> SUBJECT -> SYLLABUS -> UNIT -> CHAPTER -> TOPIC -> SUBTOPIC -> CONTENT -> QUESTIONS -> EXAM_PAPER -> ANSWER_KEY
// ==============================================================================

export type BoardIdentifier =
  | "cbse"
  | "cisce" // ICSE (10th) / ISC (12th)
  | "nios"
  | "msbshse" // Maharashtra
  | "upmsp" // Uttar Pradesh
  | "kseab" // Karnataka
  | "tndge" // Tamil Nadu
  | "bieap" // Andhra Pradesh
  | "tsbie" // Telangana
  | "bseb" // Bihar
  | "wbchse" // West Bengal
  | "rbse" // Rajasthan
  | "gseb" // Gujarat
  | "kbpe" // Kerala
  | "mpbse" // Madhya Pradesh
  | "pseb" // Punjab
  | "chse_odisha"
  | "ahsec_assam"
  | "other_state_board";

export type AcademicClassLevel = 10 | 11 | 12;

export type AcademicStream = "general_10th" | "science_pcm" | "science_pcb" | "commerce" | "humanities";

export type EducationalSubject =
  | "biology"
  | "physics"
  | "chemistry"
  | "mathematics"
  | "geography"
  | "history"
  | "english"
  | "computer_science"
  | "economics"
  | "political_science";

export type ContentVerificationStatus =
  | "LEVEL_5_OFFICIAL_GOVERNMENT"
  | "LEVEL_4_OFFICIAL_INSTITUTION"
  | "LEVEL_3_AUTHORIZED_PUBLISHER"
  | "LEVEL_2_TRUSTED_EDUCATIONAL"
  | "LEVEL_1_UNVERIFIED_EXTERNAL";

export type LicenseStatus =
  | "GOVERNMENT_OPEN_DATA"
  | "EDUCATIONAL_FAIR_USE"
  | "CREATIVE_COMMONS"
  | "RESTRICTED_METADATA_ONLY"
  | "PUBLIC_DOMAIN";

/**
 * Standard provenance metadata for EVERY educational record
 */
export interface EducationalMetadata {
  board: BoardIdentifier;
  class_level: AcademicClassLevel;
  academic_year: string; // e.g. "2025-2026"
  subject: EducationalSubject;
  syllabus_version: string;
  unit?: string;
  chapter: string;
  topic?: string;
  subtopic?: string;
  language: string; // e.g. "english" | "hindi" | "hinglish"
  content_type: "syllabus" | "textbook_ref" | "notes" | "formula" | "definition" | "pyq" | "marking_scheme" | "3d_model";
  source_id: string;
  source_url: string;
  source_title: string;
  publication_year: number;
  verification_status: ContentVerificationStatus;
  license_status: LicenseStatus;
  checksum: string;
  imported_at: string;
  updated_at: string;
}

/**
 * Multi-Board Registry Entry (Phase 4 & 5)
 */
export interface BoardRegistryEntry {
  boardId: BoardIdentifier;
  code: string;
  shortName: string;
  fullName: string;
  authorityName: string;
  headquarters: string;
  jurisdiction: "National" | "State";
  stateName?: string;
  trustLevel: 5 | 4 | 3;
  officialUrls: {
    portal: string;
    curriculum: string;
    syllabus: string;
    questionPapers: string;
    samplePapers: string;
    markingSchemes: string;
    textbooks: string;
  };
  supportedClasses: AcademicClassLevel[];
  classStructureNotes: string;
  activeCurriculumYear: string;
  isVerifiedAuthority: boolean;
}

/**
 * Normalized Subject Taxonomy Node
 */
export interface SubjectTaxonomyNode {
  subjectId: string;
  subjectCode: EducationalSubject;
  displayName: string;
  boardsSupported: BoardIdentifier[];
  classesSupported: AcademicClassLevel[];
  streams: AcademicStream[];
  iconName: string;
  themeColor: string;
  has3DWorld: boolean;
  linked3DRoute?: string;
}

/**
 * Content Coverage Matrix for Classes 10–12 across Boards (Phase 10 & 48)
 */
export interface BoardCoverageMatrix {
  board: BoardIdentifier;
  class_level: AcademicClassLevel;
  subject: EducationalSubject;
  academic_year: string;
  syllabusAvailable: boolean;
  chaptersCount: number;
  totalTopicsCount: number;
  textbookAvailable: boolean;
  samplePaperAvailable: boolean;
  pyqAvailableYears: number[];
  markingSchemesAvailable: boolean;
  answerKeysAvailable: boolean;
  verifiedPercentage: number;
  lastAuditDate: string;
}
