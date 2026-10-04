// ==============================================================================
// EDUVERSE AI — AI PROVIDER INTERFACE
// Decouples the application from a single model provider (Section 2 & 29)
// ==============================================================================

import { AICompletionRequest, AICompletionResponse } from "./ai-types";

export interface AIProvider {
  readonly name: string;
  readonly isAvailable: boolean;

  /**
   * Generates a syllabus-grounded educational explanation or diagnostic response
   */
  generateExplanation(request: AICompletionRequest): Promise<AICompletionResponse>;
}
