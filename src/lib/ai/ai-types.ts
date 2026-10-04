// ==============================================================================
// EDUVERSE AI — AI PROVIDER ABSTRACTION TYPES
// ==============================================================================

export type AITutorMode =
  | "explain"
  | "step_by_step"
  | "hint_first"
  | "quiz"
  | "homework_helper"
  | "pyq_analysis";

export interface EducationalContext {
  board: string;
  classLevel: number;
  subject: string;
  chapter?: string;
  topic?: string;
  current3DObject?: string;
  language?: string;
  verifiedSyllabusSummary?: string;
  recentPYQSample?: string;
}

export interface AIChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AICompletionRequest {
  query: string;
  context: EducationalContext;
  mode: AITutorMode;
  history?: AIChatMessage[];
  maxTokens?: number;
}

export interface AICompletionResponse {
  content: string;
  suggestedFollowUps?: string[];
  providerName: string;
  isGroundedInVerifiedContent: boolean;
  modelUsed: string;
  generatedAt: string;
}

export interface AIRateLimitStatus {
  allowed: boolean;
  remainingToday: number;
  dailyLimit: number;
  resetTimeIso: string;
  reason?: string;
}
