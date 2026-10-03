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
