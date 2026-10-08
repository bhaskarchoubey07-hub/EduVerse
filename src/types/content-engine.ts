// ==============================================================================
// EDUVERSE AI — CONTENT & QUESTION PAPER ENGINE TYPE SYSTEM
// Robust, syllabus-aligned, source-traceable educational content schemas
// ==============================================================================

import { ClassLevel, QuestionType } from "./index";

export type VerificationLevel =
  | "OFFICIAL_VERIFIED"
  | "OFFICIALLY_PUBLISHED"
  | "AUTHORIZED_SOURCE"
  | "SECONDARY_SOURCE"
  | "UNVERIFIED"
  | "UNKNOWN";

export type CopyrightStatus =
  | "PUBLIC_DOMAIN"
  | "GOVERNMENT_OPEN_DATA"
  | "CREATIVE_COMMONS"
  | "EDUCATIONAL_FAIR_USE"
  | "RESTRICTED_OFFICIAL_COPYRIGHT"
  | "UNKNOWN";

export type AllowedAction =
  | "REDISTRIBUTE_FULL"
  | "DOWNLOAD_ORIGINAL"
  | "EXTRACT_QUESTIONS_FAIR_USE"
  | "LINK_ONLY"
  | "METADATA_ONLY";

export type OfficialSourceType =
  | "official_board"
  | "official_ncert"
  | "official_cisce"
  | "official_nios"
  | "authorized_publisher"
  | "public_domain"
  | "open_license"
  | "teacher_uploaded"
  | "admin_uploaded"
  | "external_reference";

export type OfficialTrustLevel = "LEVEL_1" | "LEVEL_2" | "LEVEL_3" | "LEVEL_4" | "LEVEL_5";

export interface ContentSourceRecord {
  id: string;
  board_id: string;
  source_name: string;
  source_type: OfficialSourceType;
  official_url: string;
  document_url?: string;
  source_category: "curriculum" | "syllabus" | "question_paper" | "marking_scheme" | "sample_paper" | "textbook" | "question_bank";
  language: string;
  class?: number;
  subject?: string;
  academic_year: string;
  syllabus_year?: string;
  license_status: string;
  permission_status: "verified_public" | "fair_use_metadata" | "authorized_redistribution" | "link_only";
  trust_level: OfficialTrustLevel;
  last_checked_at: string;
  checksum: string;
  content_hash: string;
  status: "active" | "deprecated" | "pending_verification" | "offline";
  notes?: string;
}

export interface BookRecord {
  id: string;
  board_id: string;
  class_id: number;
  subject_id: string;
  title: string;
  author?: string;
  publisher: string;
  edition: string;
  academic_year: string;
  language: string;
  isbn?: string;
  source_id: string;
  source_url: string;
  storage_path?: string;
  license_status: string;
  verification_status: VerificationLevel;
  published: boolean;
}

export interface BookChapterRecord {
  id: string;
  book_id: string;
  chapter_number: number;
  chapter_title: string;
  page_start: number;
  page_end: number;
  source_page_start: number;
  source_page_end: number;
}

export interface BookSectionRecord {
  id: string;
  chapter_id: string;
  title: string;
  section_number: string;
  page_number: number;
  content: string;
  content_type: "concept" | "experiment" | "example" | "summary" | "intext_question";
}

export interface BookTopicRecord {
  id: string;
  section_id: string;
  topic_name: string;
  subtopic_name?: string;
  content: string;
  page_number: number;
}

export interface MarkingSchemeRecord {
  id: string;
  paper_id: string;
  question_id: string;
  official_marks: number;
  marking_points: { point: string; marksAllocated: number }[];
  accepted_answers: string[];
  alternative_answers?: string[];
  source_document: string;
  source_page: number;
  verification_status: "OFFICIAL_VERIFIED" | "AI_ASSISTED_EVALUATION" | "NEEDS_REVIEW";
}

export interface Learning3DObjectRecord {
  id: string;
  subject: string;
  chapter: string;
  topic: string;
  object_name: string;
  model_url: string;
  description: string;
  source: string;
  verified: boolean;
  related_questions?: string[];
  related_content?: string;
}

export interface ImportJobRecord {
  id: string;
  source_id: string;
  job_type: "document_ingestion" | "ocr_extraction" | "pyq_mapping" | "syllabus_import";
  board: string;
  class: number;
  subject: string;
  year?: number;
  status: "queued" | "discovering" | "downloading" | "processing" | "extracting" | "mapping" | "validating" | "review" | "completed" | "failed";
  progress: number;
  documents_found: number;
  documents_processed: number;
  documents_failed: number;
  questions_extracted: number;
  started_at: string;
  completed_at?: string;
  error_log?: string[];
}

export type SourceType =
  | "OFFICIAL_BOARD_PORTAL"
  | "GOVERNMENT_EDUCATION_REPOSITORY"
  | "EXAMINATION_AUTHORITY"
  | "CURRICULUM_FRAMEWORK"
  | "ACADEMIC_RESEARCH_ARCHIVE"
  | "OER_COMMONS";

export interface SourceRegistryItem {
  sourceId: string;
  sourceName: string;
  organization: string;
  boardCode: string;
  country: string;
  sourceType: SourceType;
  officialUrl: string;
  license: string;
  copyrightStatus: CopyrightStatus;
  allowedActions: AllowedAction[];
  lastChecked: string;
  lastUpdated: string;
  verificationStatus: VerificationLevel;
  trustLevel?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export interface ContentProvenance {
  sourceId: string;
  sourceUrl: string;
  officialDocumentId?: string;
  license: string;
  copyrightStatus: CopyrightStatus;
  verificationStatus: VerificationLevel;
  extractedAt: string;
  verifiedBy?: string;
}

// -----------------------------------------------------------------------------
// CHAPTER & SYLLABUS STRUCTURE
// -----------------------------------------------------------------------------

export interface ConceptDefinition {
  id: string;
  term: string;
  definition: string;
  importance: "high" | "medium" | "core";
  officialSourceRef?: string;
}

export interface FormulaItem {
  id: string;
  name: string;
  formulaLatex: string;
  description: string;
  units: string;
  variables: { symbol: string; meaning: string; siUnit?: string }[];
}

export interface CommonMisconception {
  id: string;
  misconception: string;
  scientificFact: string;
  whyStudentsErr: string;
  sampleQuestionTrap: string;
}

export interface ExamTip {
  id: string;
  title: string;
  tip: string;
  category: "time_management" | "keyword_scoring" | "diagram_presentation" | "common_pitfall";
}

export interface TopicNode {
  id: string;
  topicNumber: string;
  title: string;
  syllabusReferenceCode?: string;
  learningObjectives: string[];
  keyPoints: string[];
  examWeightage: "very_high" | "high" | "medium" | "foundational";
  pyqFrequencyCount: number;
}

export interface DetailedChapterContent {
  id: string;
  chapterNumber: number;
  title: string;
  subjectId: string;
  boardCode: string;
  classLevel: ClassLevel;
  academicYear: string;
  syllabusVersion: string;
  marksWeightage: number;
  estimatedHours: number;
  
  // Educational Depth
  overview: string;
  learningObjectives: string[];
  topics: TopicNode[];
  definitions: ConceptDefinition[];
  formulas?: FormulaItem[];
  misconceptions: CommonMisconception[];
  examTips: ExamTip[];
  quickRevisionBulletPoints: string[];
  
  // Connections
  has3DModel: boolean;
  model3DId?: string;
  linked3DRoute?: string;
  
  // Provenance & QA
  provenance: ContentProvenance;
  contentVersion: string;
  isComplete: boolean;
  completionScorePct: number;
  lastAudited: string;
}

// -----------------------------------------------------------------------------
// QUESTION EXTRACTION & PREVIOUS-YEAR ENGINE
// -----------------------------------------------------------------------------

export type PaperAvailabilityStatus =
  | "VERIFIED_AVAILABLE"
  | "OFFICIALLY_PUBLISHED"
  | "NOT_AVAILABLE"
  | "SOURCE_NOT_FOUND"
  | "PENDING_DIGITIZATION";

export interface QuestionPaperMetadata {
  paperId: string;
  title: string;
  boardCode: string;
  boardName: string;
  classLevel: ClassLevel;
  subjectId: string;
  subjectName: string;
  year: number;
  session: string;
  paperCode: string;
  setNumber?: string;
  totalMarks: number;
  durationMinutes: number;
  availabilityStatus: PaperAvailabilityStatus;
  availabilityReason?: string;
  officialSourceUrl: string;
  license: string;
  copyrightStatus: CopyrightStatus;
  verificationLevel: VerificationLevel;
  hasOfficialAnswerKey: boolean;
  hasMarkingScheme: boolean;
  totalQuestionsExtracted: number;
}

export interface ExtractedQuestionItem {
  id: string;
  paperId: string;
  year: number;
  boardCode: string;
  classLevel: ClassLevel;
  subjectId: string;
  chapterId: string;
  topicId?: string;
  section: string;
  questionNumber: number;
  marks: number;
  questionType: QuestionType | "assertion_reason" | "case_based";
  
  // Exact source text preserving scientific notations
  questionText: string;
  options?: { id: string; label: string; text: string }[];
  
  // Official Solution vs AI Explanation (Strict Distinction)
  officialAnswerKey?: string;
  officialMarkingRubric?: { step: string; marks: number }[];
  isOfficialAnswerVerified: boolean;
  
  // Derived AI content (strictly marked)
  aiExplanation?: {
    conceptBreakdown: string;
    stepByStepApproach: string[];
    commonStudentMistakes: string;
    examinerTip: string;
    generatedAt: string;
    sourceGrounding: string;
  };

  // Metadata & Analytics
  difficulty: "easy" | "medium" | "hard";
  appearedInYears?: number[];
  provenance: ContentProvenance;
  mappingConfidence: "HIGH" | "NEEDS_REVIEW";
}

export interface QuestionFrequencyStat {
  topicId: string;
  topicTitle: string;
  chapterId: string;
  timesAskedInPapers: number;
  yearsList: number[];
  averageMarks: number;
  mostRecentYear: number;
  sampleQuestionsCount: number;
  weightageCategory: "Frequently Tested" | "Recently Tested" | "High-Mark Questions" | "Conceptual Core";
}

export interface ChapterPYQSummary {
  chapterId: string;
  totalQuestionsFound: number;
  yearsSpan: string; // e.g. "2016-2025"
  mostRecentYear: number;
  frequencyStats: QuestionFrequencyStat[];
  questions: ExtractedQuestionItem[];
}

// -----------------------------------------------------------------------------
// ADMIN COVERAGE & INGESTION PIPELINE LOGS
// -----------------------------------------------------------------------------

export interface CoverageMatrixRow {
  boardCode: string;
  boardName: string;
  classLevel: ClassLevel;
  subjectId: string;
  subjectName: string;
  chapterCount: number;
  completedChapters: number;
  syllabusStatus: "COMPLETE" | "PARTIAL" | "NOT_STARTED";
  tenYearPapersTarget: number;
  verifiedPapersCount: number;
  totalExtractedQuestions: number;
  missingPapersList: { year: number; reason: string }[];
  coveragePercentage: number;
}

export interface IngestionLogItem {
  id: string;
  jobName: string;
  boardCode: string;
  subjectId: string;
  timestamp: string;
  filesDiscovered: number;
  filesValidated: number;
  filesRejected: number;
  duplicatesBlocked: number;
  ocrIssuesFlagged: number;
  itemsPublished: number;
  status: "SUCCESS" | "WARNING" | "FAILED";
  logMessage: string;
}

export interface IngestionValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  fileHash?: string;
  isDuplicate: boolean;
  ocrQualityScorePct: number;
  scientificNotationValid: boolean;
}
