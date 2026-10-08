export type UserRole = "student" | "admin" | "educator";

export type BoardCode = "cbse" | "icse" | "pseb" | "state_board";

export interface Board {
  id: string;
  code: BoardCode;
  name: string;
  shortName: string;
  description: string;
  logoText: string;
  availableClasses: number[];
  state?: string;
  activeSessions: string[];
}

export type ClassLevel = 10 | 11 | 12;

export type StreamType = "science_pcm" | "science_pcb" | "commerce" | "arts_humanities" | "general_10th";

export interface Subject {
  id: string;
  code: string;
  name: string;
  boardId: string;
  classLevel: ClassLevel;
  iconName: string;
  color: string;
  chapterCount: number;
  totalMarks: number;
  theoryMarks: number;
  practicalMarks: number;
  description: string;
  worldTheme?: "geometry" | "physics_orbital" | "chemistry_molecular" | "biology_helix";
}

export interface Chapter {
  id: string;
  subjectId: string;
  number: number;
  title: string;
  description: string;
  marksWeightage: number;
  estimatedHours: number;
  topics: Topic[];
  keyFormulas?: string[];
  keyDefinitions?: { term: string; definition: string }[];
  mnemonics?: { title: string; trick: string; explanation: string }[];
  summary?: string;
}

export interface Topic {
  id: string;
  chapterId: string;
  title: string;
  importance: "high" | "medium" | "low";
  isCompleted?: boolean;
}

export interface StudentProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  boardId: string;
  classLevel: ClassLevel;
  stream?: StreamType;
  academicSession: string;
  selectedSubjectIds: string[];
  preferredLanguage: "english" | "hinglish" | "hindi" | "punjabi";
  targetExamDate: string;
  dailyGoalMinutes: number;
  streakDays: number;
  lastActiveDate: string;
  createdAt: string;
  avatarUrl?: string;
}

export type PaperType = "official_board" | "sample_paper" | "compartment" | "pre_board";

export type ContentStatus =
  | "OFFICIAL_VERIFIED"
  | "NEEDS_VERIFICATION"
  | "EXTRACTION_INCOMPLETE"
  | "LEGACY_INVALID"
  | "SOURCE_UNAVAILABLE"
  | "OCR_REVIEW_REQUIRED"
  | "DEMO"
  | "AI_GENERATED_PRACTICE"
  | "PROCESSING"
  | "REJECTED";

export interface QuestionPaper {
  id: string;
  title: string;
  boardId: string;
  classLevel: ClassLevel;
  subjectId: string;
  year: number;
  paperType: PaperType;
  setNumber?: string;
  totalMarks: number;
  durationMinutes: number;
  isVerifiedOfficial: boolean;
  verifiedBy?: string;
  pdfUrl?: string;
  downloadCount: number;
  sections: PaperSection[];
  tags: string[];
  yearAvailable: boolean;
  // Provenance & Real Document Storage Fields
  contentStatus?: ContentStatus;
  sourceDocumentId?: string;
  sourceUrl?: string;
  paperCode?: string;
  academicYear?: string;
  checksum?: string;
  // Completeness Tracking (Sections 10 & 36)
  isExtractionIncomplete?: boolean;
  totalQuestionsExpected?: number;
  verifiedQuestionsCount?: number;
  extractionNotes?: string;
}

export interface PaperSection {
  name: string;
  title: string;
  totalQuestions: number;
  marksPerQuestion: number;
  description: string;
  questions: ExamQuestion[];
}

export type QuestionType = "mcq" | "numerical" | "short_answer" | "long_answer" | "assertion_reason";

export interface QuestionOption {
  id: string;
  label: string;
  text: string;
  isCorrect?: boolean;
}

export interface ExamQuestion {
  id: string;
  paperId?: string;
  chapterId?: string;
  subjectId: string;
  sectionName?: string;
  questionNumber: number;
  type: QuestionType;
  text: string;
  options?: QuestionOption[];
  correctAnswer?: string;
  marks: number;
  negativeMarks?: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  hint?: string;
  stepByStepSolution?: string[];
  rubricCriteria?: { criteria: string; marks: number }[];
  // Provenance & Real Document Fields
  contentStatus?: ContentStatus;
  sourceDocumentId?: string;
  sourcePageNumber?: number;
  officialAnswer?: string;
  markingScheme?: string;
  aiExplanation?: string;
  related3DModelId?: string;
  chapterName?: string;
  topicName?: string;
  subtopic?: string;
  answerSource?: "OFFICIAL_MARKING_SCHEME" | "OFFICIAL_MODEL_ANSWER" | "AI_EXPLANATION" | "NOT_AVAILABLE";
}

export interface MockExam {
  id: string;
  title: string;
  subjectId: string;
  boardId: string;
  classLevel: ClassLevel;
  chapterIds?: string[];
  durationMinutes: number;
  totalMarks: number;
  isFullLength: boolean;
  questionCount: number;
  description: string;
  questions: ExamQuestion[];
  instructions: string[];
}

export interface ExamAttempt {
  id: string;
  examId: string;
  examTitle: string;
  studentId: string;
  subjectId: string;
  subjectName: string;
  startedAt: string;
  completedAt?: string;
  score: number;
  totalMarks: number;
  percentage: number;
  timeSpentSeconds: number;
  accuracyRate: number;
  status: "in_progress" | "completed" | "abandoned";
  responses: Record<string, StudentResponse>;
  feedbackSummary?: string;
  topicBreakdown?: { topic: string; correct: number; total: number; accuracy: number }[];
}

export interface StudentResponse {
  questionId: string;
  answer: string;
  isCorrect?: boolean;
  isMarkedForReview?: boolean;
  marksAwarded?: number;
  aiEvaluationFeedback?: string;
  timeSpentSeconds?: number;
}

export interface AITutorMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  isStepByStep?: boolean;
  suggestedFollowUps?: string[];
  groundingChapter?: string;
  detectedSubject?: string;
  confidence?: "HIGH" | "MEDIUM" | "LOW";
  isTopicSwitched?: boolean;
  topicSwitchReason?: string;
  is3DGrounded?: boolean;
  grounded3DPartName?: string;
  feedbackRating?: "correct" | "incorrect" | "irrelevant";
}

export interface AIConversation {
  id: string;
  studentId: string;
  subjectId?: string;
  chapterId?: string;
  title: string;
  mode: "explain" | "step_by_step" | "hint_first" | "quiz" | "homework_helper";
  messages: AITutorMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface SavedNote {
  id: string;
  studentId: string;
  title: string;
  subjectId: string;
  chapterId: string;
  content: string;
  noteType: "ai_generated" | "handwritten_typed" | "formula_sheet" | "mnemonic";
  createdAt: string;
}

export interface Flashcard {
  id: string;
  chapterId: string;
  front: string;
  back: string;
  tip?: string;
  tag: string;
  easeFactor?: number;
  intervalDays?: number;
  nextReviewDate?: string;
  status?: "learning" | "review" | "mastered";
}

export interface StudyActivity {
  id: string;
  studentId: string;
  type: "test_taken" | "tutor_chat" | "paper_viewed" | "notes_reviewed" | "flashcards_practiced";
  title: string;
  timestamp: string;
  durationMinutes: number;
  metadata?: Record<string, any>;
}

export interface SubjectProgress {
  subjectId: string;
  subjectName: string;
  completedChapters: number;
  totalChapters: number;
  percentage: number;
  averageScore: number;
  testsTaken: number;
  weakChapters: string[];
}

// ==========================================
// STAGE 2 EXPANDED SCHEMAS & INTERFACES
// ==========================================

export type TaskType =
  | "concept_learning"
  | "practice_questions"
  | "revision_session"
  | "mock_exam"
  | "pyq_drill"
  | "formula_mastery";

export interface StudyTask {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  chapterTitle: string;
  taskType: TaskType;
  estimatedMinutes: number;
  isCompleted: boolean;
  scheduledDate: string;
  priority: "high" | "medium" | "low";
  reasonRecommended: string;
  actionUrl: string;
}

export type TrophyModelType = "gold_medal" | "prism" | "atom" | "crystal" | "flame" | "shield";

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  category: "streak" | "exam_mastery" | "tutor_explorer" | "revision_champion" | "perfectionist";
  iconName: string;
  trophyModel: TrophyModelType;
  xpReward: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  progressPercentage: number;
  criteriaRequirement: string;
}

export interface StudentGamificationState {
  currentXp: number;
  currentLevel: number;
  levelTitle: string;
  nextLevelXp: number;
  totalTrophiesUnlocked: number;
  streakDays: number;
  leaderboardRank?: number;
  recentXpGains: { reason: string; xp: number; timestamp: string }[];
}

export type GraphicIntensity = "full_3d" | "minimal_3d" | "fast_2d";
export type CompanionAvatarType = "nebula_core" | "quantum_pulse" | "cyber_star" | "solar_flare";
export type ThemeAccent = "cyan" | "violet" | "emerald" | "amber";

export interface UserSettings {
  graphicIntensity: GraphicIntensity;
  companionAvatar: CompanionAvatarType;
  themeAccent: ThemeAccent;
  voiceEnabled: boolean;
  soundEffectsEnabled: boolean;
  reducedMotion: boolean;
  dailyGoalHours: number;
  gamificationVisible: boolean;
}

// ==========================================
// STAGE 3B 3D LEARNING UNIVERSE SCHEMAS
// ==========================================

export type SubjectWorldId =
  | "biology"
  | "chemistry"
  | "physics"
  | "mathematics"
  | "geography"
  | "history"
  | "english"
  | "computer_science";

export interface SubjectWorldPortal {
  id: SubjectWorldId;
  name: string;
  tagline: string;
  description: string;
  themeColor: "emerald" | "cyan" | "violet" | "amber" | "blue" | "rose" | "teal" | "indigo";
  iconName: string;
  progressPct: number;
  currentChapter: string;
  recommendedLesson: string;
  mockExamCount: number;
  xpEarned: number;
  lessonsCompleted: number;
  totalLessons: number;
  primaryFormulaOrFact: string;
  route: string;
  modelType: "lab" | "molecules" | "orbital" | "geometry" | "earth" | "timeline" | "cyber" | "literature";
}

export interface LearningPathNode {
  id: string;
  subjectId: SubjectWorldId;
  chapterId: string;
  title: string;
  status: "completed" | "current" | "recommended" | "locked";
  marksWeightage: number;
  order: number;
  description: string;
  estimatedMinutes: number;
  iconName?: string;
  has3DModel: boolean;
}

export interface RevisionItem {
  id: string;
  title: string;
  subjectId: SubjectWorldId;
  chapterId: string;
  objectName: string;
  systemOrBranch: string;
  modelType: string;
  formulaOrSummary: string;
  examTip: string;
  dateSaved: string;
  nextReviewDate: string;
  intervalDays: number;
  easeFactor: number;
  repetitionCount: number;
  lastGrade?: "easy" | "medium" | "hard";
  samplePyqId?: string;
  pyqSnippet?: {
    year: number;
    board: string;
    marks: number;
    question: string;
  };
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  category: "3d_explore" | "pyq_practice" | "weak_topic_revision" | "quiz_mastery";
  xpReward: number;
  isCompleted: boolean;
  progress: number;
  maxProgress: number;
  targetSubject: SubjectWorldId;
  targetTopic: string;
  actionUrl: string;
}

export interface Interactive3DLessonStep {
  stepNumber: number;
  title: string;
  description: string;
  focusObjectId: string;
  cameraTarget?: { x: number; y: number; z: number };
  telemetry?: Record<string, string | number>;
  actionPrompt: string;
  keyTakeaway: string;
}

export interface Interactive3DLesson {
  id: string;
  subjectId: SubjectWorldId;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  xpReward: number;
  steps: Interactive3DLessonStep[];
  quizQuestion: {
    question: string;
    targetObjectId: string;
    options: { id: string; text: string; isCorrect: boolean }[];
    hint: string;
    explanation: string;
  };
}

export interface ThreeDModelMetadata {
  id: string;
  title: string;
  subject: SubjectWorldId;
  classLevel: ClassLevel;
  boardId: string;
  chapterId: string;
  topic: string;
  modelUrl: string;
  thumbnail?: string;
  description: string;
  difficulty: "foundation" | "intermediate" | "advanced";
  examRelevance: string;
  tags: string[];
  license: string;
  creator: string;
  source: string;
}

export * from "./content-engine";
