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
