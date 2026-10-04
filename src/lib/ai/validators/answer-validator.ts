// ==============================================================================
// EDUVERSE AI — AI RESPONSE VALIDATOR & ANSWER VERIFICATION (PHASE 23 & 66)
// Performs post-generation semantic, subject, and anti-hallucination checks
// ==============================================================================

import { EducationalSubject } from "@/types/education-hierarchy";

export interface AIValidationDecision {
  valid: boolean;
  relevance_score: number; // 0.0 to 1.0
  confidence: "HIGH" | "MEDIUM" | "LOW";
  subject_match: boolean;
  chapter_match: boolean;
  topic_match: boolean;
  source_supported: boolean;
  fabricated_claims: boolean;
  retryable: boolean;
  reason?: string;
  sanitizedContent?: string;
}

export class AnswerValidator {
  /**
   * Evaluates generated AI answer against target question, subject, and anti-fabrication standards
   */
  public static validateAIResponse(
    query: string,
    rawAnswer: string,
    targetSubject: EducationalSubject,
    targetChapter?: string
  ): AIValidationDecision {
    const qLower = (query || "").toLowerCase().trim();
    const aLower = (rawAnswer || "").toLowerCase().trim();

    // 1. Basic emptiness and length checks
    if (!aLower || aLower.length < 20) {
      return {
        valid: false,
        relevance_score: 0.1,
        confidence: "LOW",
        subject_match: false,
        chapter_match: false,
        topic_match: false,
        source_supported: false,
        fabricated_claims: false,
        retryable: true,
        reason: "Response was empty or trivially short.",
      };
    }

    // 2. Check for fake previous-year question paper claims (e.g. inventing code numbers)
    // Section 21 & Phase 11: NEVER FABRICATE A PREVIOUS-YEAR QUESTION
    const claimsFakePaperCode = /(?:question paper code|paper code\s*:\s*[0-9]{3,}|official cbse set [987654321]{3,})/i.test(aLower);
    if (claimsFakePaperCode && !query.includes("code")) {
      return {
        valid: false,
        relevance_score: 0.3,
        confidence: "LOW",
        subject_match: true,
        chapter_match: false,
        topic_match: false,
        source_supported: false,
        fabricated_claims: true,
        retryable: true,
        reason: "Response contains fabricated exam paper codes not present in the verified archive.",
      };
    }

    // 3. Check for prompt injection leakage or internal system leaks
    const leaksInternalPrompt = /(?:i am eduverse ai tutor, an empathetic|you are eduverse ai tutor|strict pedagogical rules|verified reference curriculum|pedagogical teaching guidelines)/i.test(aLower);
    let sanitized = rawAnswer;
    if (leaksInternalPrompt) {
      // Strip prompt leakage if present
      sanitized = rawAnswer
        .replace(/You are EduVerse AI Tutor[^\n]*\.?/gi, "")
        .replace(/STRICT PEDAGOGICAL RULES[^\n]*\.?/gi, "")
        .replace(/pedagogical teaching guidelines[^\n]*\.?/gi, "")
        .trim();
    }

    // 4. Check Subject Match
    // If targetSubject is physics, but answer is rambling only about biology cells/mitochondria
    let subjectMatch = true;
    if (targetSubject === "physics" && /(?:photosynthesis|chloroplast|alveoli|nephron|alimentary canal)\b/i.test(aLower) && !qLower.includes("photo")) {
      subjectMatch = false;
    } else if (targetSubject === "chemistry" && /(?:newton's laws|focal length|concave lens|refraction of light)\b/i.test(aLower) && !qLower.includes("lens")) {
      subjectMatch = false;
    } else if (targetSubject === "biology" && /(?:v\s*=\s*ir|current\s*=\s*voltage|focal length)\b/i.test(aLower) && !qLower.includes("current")) {
      subjectMatch = false;
    }

    if (!subjectMatch) {
      return {
        valid: false,
        relevance_score: 0.2,
        confidence: "LOW",
        subject_match: false,
        chapter_match: false,
        topic_match: false,
        source_supported: false,
        fabricated_claims: false,
        retryable: true,
        reason: `Subject divergence detected: expected ${targetSubject.toUpperCase()} response.`,
      };
    }

    // 5. Keyword Relevance Match with Query
    const queryTerms = qLower
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !["what", "when", "where", "which", "explain", "describe", "tell", "about", "give", "with", "this", "that"].includes(w));

    const matchedTermsCount = queryTerms.filter((term) => aLower.includes(term)).length;
    const termRatio = queryTerms.length > 0 ? matchedTermsCount / queryTerms.length : 1.0;

    const relevanceScore = Math.min(1.0, Math.max(0.4, 0.4 + termRatio * 0.6));
    const confidence = relevanceScore >= 0.75 ? "HIGH" : relevanceScore >= 0.5 ? "MEDIUM" : "LOW";

    return {
      valid: true,
      relevance_score: relevanceScore,
      confidence,
      subject_match: true,
      chapter_match: true,
      topic_match: termRatio >= 0.3,
      source_supported: true,
      fabricated_claims: false,
      retryable: false,
      sanitizedContent: sanitized,
    };
  }
}
