// ==============================================================================
// EDUVERSE AI — TOPIC & SUBJECT SWITCH DETECTOR (PHASE 18)
// Automatically recognizes when a student changes topics/subjects and purges stale context
// ==============================================================================

import { EducationalSubject } from "@/types/education-hierarchy";
import { SubjectClassifier, ClassificationResult } from "./subject-classifier";

export interface TopicSwitchDetection {
  hasSwitched: boolean;
  previousSubject: string;
  newSubject: EducationalSubject;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  reason: string;
  shouldPurgeChatHistory: boolean;
  shouldResetChapterContext: boolean;
}

export class TopicSwitchDetector {
  /**
   * Detects whether user query represents a switch from current subject or chapter
   */
  public static detectSwitch(
    currentSubject: string,
    currentChapter: string | undefined,
    userQuery: string
  ): TopicSwitchDetection {
    const classification: ClassificationResult = SubjectClassifier.classify(userQuery, currentSubject);
    const normalizedCurrent = (currentSubject || "biology").toLowerCase().trim();

    // If confidence is LOW or query is an ambiguous follow-up (e.g. "why?", "explain more", "give example", "what does this do?")
    const isAmbiguousFollowUp = /^(why|how|explain\s+(this|more|that)|give\s+(an?\s+)?example|what\s+(is|does)\s+(this|that|it)|help\s+me)\b/i.test(
      userQuery.trim()
    );

    if (isAmbiguousFollowUp || classification.confidence === "LOW") {
      return {
        hasSwitched: false,
        previousSubject: normalizedCurrent,
        newSubject: (normalizedCurrent as EducationalSubject) || "biology",
        confidence: "LOW",
        reason: "Query is a contextual follow-up or ambiguous inquiry continuing existing topic.",
        shouldPurgeChatHistory: false,
        shouldResetChapterContext: false,
      };
    }

    // Check if detected subject differs from current active subject
    if (classification.detectedSubject !== normalizedCurrent && classification.confidence === "HIGH") {
      return {
        hasSwitched: true,
        previousSubject: normalizedCurrent,
        newSubject: classification.detectedSubject,
        confidence: "HIGH",
        reason: `Student shifted from ${normalizedCurrent.toUpperCase()} to ${classification.detectedSubject.toUpperCase()} (keywords: ${classification.matchedKeywords.slice(0, 3).join(", ")})`,
        shouldPurgeChatHistory: true, // Do not contaminate with previous subject conversation
        shouldResetChapterContext: true, // Reset stale chapter from previous subject
      };
    }

    // Check if detected subject differs with MEDIUM confidence
    if (classification.detectedSubject !== normalizedCurrent && classification.confidence === "MEDIUM" && classification.matchedRuleScore >= 3) {
      return {
        hasSwitched: true,
        previousSubject: normalizedCurrent,
        newSubject: classification.detectedSubject,
        confidence: "MEDIUM",
        reason: `Probable subject pivot from ${normalizedCurrent} to ${classification.detectedSubject}`,
        shouldPurgeChatHistory: true,
        shouldResetChapterContext: true,
      };
    }

    // Same subject, but check if user is asking about a completely different chapter within same subject
    return {
      hasSwitched: false,
      previousSubject: normalizedCurrent,
      newSubject: (normalizedCurrent as EducationalSubject) || "biology",
      confidence: classification.confidence,
      reason: "Query remains within active subject domain.",
      shouldPurgeChatHistory: false,
      shouldResetChapterContext: false,
    };
  }
}
