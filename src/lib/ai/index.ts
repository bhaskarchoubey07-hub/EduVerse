// ==============================================================================
// EDUVERSE AI — AI FACTORY & PROVIDER REGISTRY
// ==============================================================================

import { AIProvider } from "./ai-provider";
import { GeminiProvider } from "./gemini-provider";
import { FallbackEducationalProvider } from "./fallback-provider";

export * from "./ai-types";
export * from "./ai-provider";
export * from "./gemini-provider";
export * from "./fallback-provider";
export * from "./ai-context";
export * from "./ai-rate-limit";

/**
 * Returns the active AI provider based on environment credentials
 */
export function getAIProvider(): AIProvider {
  const gemini = new GeminiProvider();
  if (gemini.isAvailable) {
    return gemini;
  }
  return new FallbackEducationalProvider();
}
