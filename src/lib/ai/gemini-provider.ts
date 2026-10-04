// ==============================================================================
// EDUVERSE AI — GOOGLE GEMINI PROVIDER (SERVER-SIDE ONLY)
// ==============================================================================

import { AIProvider } from "./ai-provider";
import { AICompletionRequest, AICompletionResponse } from "./ai-types";
import { AIContextRetriever } from "./ai-context";

export class GeminiProvider implements AIProvider {
  public readonly name = "Google Gemini";
  private apiKey: string | undefined;
  private model: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    this.model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  }

  public get isAvailable(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 5);
  }

  public async generateExplanation(request: AICompletionRequest): Promise<AICompletionResponse> {
    if (!this.apiKey) {
      throw new Error("GEMINI_API_KEY is not configured on the server.");
    }

    // Enrich context with verified syllabus definitions, formulas, and PYQs
    const enrichedContext = AIContextRetriever.enrichContext(request.context, request.query);
    const systemInstruction = AIContextRetriever.buildSystemPrompt(enrichedContext, request.mode);

    // Build chat contents including history
    const contents: any[] = [];

    // System instruction passed in user message or system parameter
    const conversationTurns: any[] = [];

    if (request.history && request.history.length > 0) {
      for (const msg of request.history.slice(-6)) {
        conversationTurns.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        });
      }
    }

    // Add current query with grounding prefix
    conversationTurns.push({
      role: "user",
      parts: [
        {
          text: `${systemInstruction}\n\n--- STUDENT QUESTION ---\n${request.query}`,
        },
      ],
    });

    // Make server-side call with 15s timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          contents: conversationTurns,
          generationConfig: {
            temperature: 0.35, // Low temperature for high academic precision
            maxOutputTokens: request.maxTokens || 1024,
          },
        }),
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Gemini API returned status ${res.status}: ${errorText.slice(0, 150)}`);
      }

      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error("Empty candidate received from Gemini API.");
      }

      // Add educational branding label if not already present
      const formattedContent = rawText.startsWith("[AI-GENERATED")
        ? rawText
        : `[AI-GENERATED STUDY EXPLANATION - GROUNDED IN ${enrichedContext.board.toUpperCase()} SYLLABUS]\n\n${rawText}`;

      return {
        content: formattedContent,
        suggestedFollowUps: [
          `Give me a previous-year board exam question on this topic.`,
          `What are the most common mistakes students make in this?`,
          `Can you explain this step-by-step with a formula?`,
        ],
        providerName: "Google Gemini 1.5 Flash",
        isGroundedInVerifiedContent: true,
        modelUsed: this.model,
        generatedAt: new Date().toISOString(),
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") {
        throw new Error("AI request timed out after 15 seconds. Please try again.");
      }
      throw err;
    }
  }
}
