// ==============================================================================
// EDUVERSE AI — PRODUCTION RAG & RELEVANCE ENGINE (PHASE 15–25, 42–46, 63–67)
// End-to-end RAG orchestrator with context isolation, topic-switch detection, and verification
// ==============================================================================

import { EducationalContext, AICompletionRequest, AICompletionResponse, AITutorMode, AIChatMessage } from "../ai-types";
import { getAIProvider } from "../index";
import { SubjectClassifier, ClassificationResult } from "../taxonomy/subject-classifier";
import { TopicSwitchDetector, TopicSwitchDetection } from "../taxonomy/topic-switch-detector";
import { BoardClassIsolator, BoundaryIsolationDecision } from "../taxonomy/board-class-isolator";
import { Biology3DVerifier, Grounded3DContext } from "../validators/biology-3d-verifier";
import { MathPhysicsVerifier } from "../validators/math-physics-verifier";
import { ChemistryVerifier } from "../validators/chemistry-verifier";
import { AnswerValidator, AIValidationDecision } from "../validators/answer-validator";
import { AIContextRetriever } from "../ai-context";
import { EducationalSubject } from "@/types/education-hierarchy";

export interface RAGExecutionResult {
  content: string;
  detectedSubject: EducationalSubject;
  matchedChapter: string;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  isTopicSwitched: boolean;
  topicSwitchReason?: string;
  is3DGrounded: boolean;
  grounded3DPartName?: string;
  suggestedFollowUps: string[];
  providerName: string;
  modelUsed: string;
  verificationAudit: {
    answerValid: boolean;
    relevanceScore: number;
    numericalVerified?: boolean;
    chemistryBalanced?: boolean;
    retriesCount: number;
  };
  provenance: {
    board: string;
    classLevel: number;
    subject: string;
    verifiedSyllabusRef: string;
    sourceTrustLevel: 5 | 4;
  };
}

// In-memory LRU-style response cache for identical safe educational queries (Phase 44)
const AI_RESPONSE_CACHE = new Map<string, { result: RAGExecutionResult; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

export class ProductionRAGEngine {
  /**
   * Orchestrates the complete verified RAG pipeline
   */
  public static async executeRAG(
    userQuery: string,
    initialContext: EducationalContext,
    mode: AITutorMode = "explain",
    chatHistory: AIChatMessage[] = []
  ): Promise<RAGExecutionResult> {
    const trimmedQuery = (userQuery || "").trim();

    // 1. PHASE 42 & 67: Input validation & sanitization
    if (!trimmedQuery) {
      return this.buildSafeFallback(
        "Please provide an educational question or topic to begin our study session.",
        initialContext
      );
    }

    if (trimmedQuery.length > 2500) {
      return this.buildSafeFallback(
        "Your question exceeds the maximum length of 2,500 characters. Please break it into smaller queries for optimal exam-oriented explanations.",
        initialContext
      );
    }

    // 2. PHASE 18: Topic Switch Detection
    const switchDetection: TopicSwitchDetection = TopicSwitchDetector.detectSwitch(
      initialContext.subject,
      initialContext.chapter,
      trimmedQuery
    );

    const activeSubject: EducationalSubject = switchDetection.hasSwitched
      ? switchDetection.newSubject
      : (SubjectClassifier.classify(trimmedQuery, initialContext.subject).detectedSubject);

    // 3. PHASE 20: Board & Class Boundary Protection
    const boundaryDecision: BoundaryIsolationDecision = BoardClassIsolator.evaluateBoundary(
      initialContext.board,
      initialContext.classLevel,
      trimmedQuery
    );

    // Filter chat history: if topic switched, PURGE stale previous subject turns (Phase 16 & 18)
    const filteredHistory: AIChatMessage[] = switchDetection.hasSwitched
      ? []
      : chatHistory.slice(-4); // Limit to last 4 turns strictly to prevent history drift

    // 4. PHASE 28 & 29: 3D Visual Object Grounding
    const grounded3D: Grounded3DContext = Biology3DVerifier.resolve3DGrounding(
      trimmedQuery,
      initialContext.current3DObject
    );

    // 5. PHASE 44: AI Response Cache Check
    const cacheKey = `${boundaryDecision.targetBoard}:${boundaryDecision.targetClass}:${activeSubject}:${initialContext.chapter || "auto"}:${trimmedQuery.toLowerCase()}:${mode}`;
    const cached = AI_RESPONSE_CACHE.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.result;
    }

    // 6. PHASE 15 & 17: Build Isolated Context with Strict Priority
    const isolatedContext: EducationalContext = {
      ...initialContext,
      board: boundaryDecision.targetBoard,
      classLevel: boundaryDecision.targetClass,
      subject: activeSubject,
      chapter: switchDetection.hasSwitched ? undefined : initialContext.chapter,
      current3DObject: grounded3D.is3DReferenced ? grounded3D.objectName : initialContext.current3DObject,
    };

    // Enrich with verified syllabus definitions and PYQs
    const enrichedContext = AIContextRetriever.enrichContext(isolatedContext, trimmedQuery);

    // If 3D part was specifically matched, augment syllabus summary
    if (grounded3D.is3DReferenced && grounded3D.focusExplanationPrompt) {
      enrichedContext.verifiedSyllabusSummary = `${enrichedContext.verifiedSyllabusSummary}\n\n${grounded3D.focusExplanationPrompt}`;
    }

    // 7. Call Provider with bounded retries (Max 2 retries, Phase 23 & 42)
    const provider = getAIProvider();
    let attempts = 0;
    let finalRawResponse: AICompletionResponse | null = null;
    let validation: AIValidationDecision | null = null;

    while (attempts < 2) {
      attempts++;
      try {
        const completionRequest: AICompletionRequest = {
          query: trimmedQuery,
          context: enrichedContext,
          mode,
          history: filteredHistory,
          maxTokens: 1024,
        };

        const res = await provider.generateExplanation(completionRequest);

        // Run Phase 23 & 66 Answer Validation
        const val = AnswerValidator.validateAIResponse(
          trimmedQuery,
          res.content,
          activeSubject,
          enrichedContext.chapter
        );

        if (val.valid) {
          finalRawResponse = res;
          validation = val;
          break;
        } else if (attempts >= 2) {
          // Accept with sanitization or fall back
          finalRawResponse = res;
          validation = val;
        }
      } catch (err: any) {
        console.warn(`[RAG Engine Attempt ${attempts} Warning]:`, err?.message || err);
        if (attempts >= 2) break;
      }
    }

    // 8. If provider completely failed or response invalid, return safe fallback (Phase 67)
    if (!finalRawResponse || !validation || (!validation.valid && !validation.sanitizedContent)) {
      return this.buildSafeFallback(
        `I couldn't verify a reliable answer for "${trimmedQuery}" from the available EduVerse sources for ${boundaryDecision.targetBoard.toUpperCase()} Class ${boundaryDecision.targetClass}. Please select your subject/chapter or rephrase the question.`,
        enrichedContext,
        activeSubject
      );
    }

    // 9. PHASE 26 & 27: Domain Verification (Math, Physics, Chemistry)
    let processedContent = validation.sanitizedContent || finalRawResponse.content;

    // Check Math/Physics numericals
    const numericalCheck = MathPhysicsVerifier.verifyNumerical(trimmedQuery, processedContent);
    if (numericalCheck.discrepancyDetected && numericalCheck.correctionText) {
      processedContent += `\n\n> **[Deterministic Verification Note]**: ${numericalCheck.correctionText}`;
    }

    // Check Chemistry equations
    const chemCheck = ChemistryVerifier.verifyChemistryContent(trimmedQuery, processedContent);

    // Construct final result
    const result: RAGExecutionResult = {
      content: processedContent,
      detectedSubject: activeSubject,
      matchedChapter: enrichedContext.chapter || "Core Curriculum",
      confidence: validation.confidence,
      isTopicSwitched: switchDetection.hasSwitched,
      topicSwitchReason: switchDetection.reason,
      is3DGrounded: grounded3D.is3DReferenced,
      grounded3DPartName: grounded3D.specificPartName,
      suggestedFollowUps: finalRawResponse.suggestedFollowUps || [
        `Show me a previous-year board exam question on ${activeSubject}.`,
        `What are the most frequent student mistakes in this?`,
        `Can you provide step-by-step formula derivation?`,
      ],
      providerName: finalRawResponse.providerName,
      modelUsed: finalRawResponse.modelUsed,
      verificationAudit: {
        answerValid: validation.valid,
        relevanceScore: validation.relevance_score,
        numericalVerified: numericalCheck.verified,
        chemistryBalanced: chemCheck.isBalanced,
        retriesCount: attempts,
      },
      provenance: {
        board: boundaryDecision.targetBoard,
        classLevel: boundaryDecision.targetClass,
        subject: activeSubject,
        verifiedSyllabusRef: enrichedContext.chapter || "Official Curriculum Reference",
        sourceTrustLevel: 5,
      },
    };

    // Store in cache
    AI_RESPONSE_CACHE.set(cacheKey, { result, timestamp: Date.now() });

    return result;
  }

  /**
   * Safe pedagogical fallback builder (Phase 67)
   */
  private static buildSafeFallback(
    message: string,
    context: EducationalContext,
    subject: EducationalSubject = "biology"
  ): RAGExecutionResult {
    return {
      content: `⚠️ ${message}`,
      detectedSubject: subject,
      matchedChapter: context.chapter || "General",
      confidence: "LOW",
      isTopicSwitched: false,
      is3DGrounded: false,
      suggestedFollowUps: [
        "Browse verified 10-year question papers",
        "Review official syllabus notes",
        "Explore 3D interactive models",
      ],
      providerName: "EduVerse Safe Fallback",
      modelUsed: "deterministic-curriculum-safety",
      verificationAudit: {
        answerValid: true,
        relevanceScore: 0.5,
        retriesCount: 0,
      },
      provenance: {
        board: context.board,
        classLevel: context.classLevel,
        subject,
        verifiedSyllabusRef: "Curriculum Reference",
        sourceTrustLevel: 4,
      },
    };
  }
}
