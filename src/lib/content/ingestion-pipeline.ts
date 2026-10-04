// ==============================================================================
// EDUVERSE AI — CONTENT INGESTION & QUALITY VERIFICATION PIPELINE
// Reusable architecture: Discovery -> Validation -> Extraction -> Syllabus Mapping
// Deduplication -> Quality Check -> Provenance Verification -> Search Indexing
// ==============================================================================

import {
  IngestionValidationResult,
  QuestionPaperMetadata,
  ExtractedQuestionItem,
  DetailedChapterContent,
  VerificationLevel,
  ContentProvenance,
  IngestionLogItem,
} from "@/types";
import { SOURCE_REGISTRY } from "@/lib/data/source-registry";

export class ContentIngestionPipeline {
  private static registeredHashes = new Set<string>();

  /**
   * Generates a stable deterministic hash for content deduplication
   */
  public static computeHash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return `hash-${Math.abs(hash).toString(16).padStart(8, "0")}`;
  }

  /**
   * STEP 4 & 7: Validate incoming document metadata & copyright compliance
   */
  public static validateDocument(doc: {
    title: string;
    sourceId: string;
    boardCode: string;
    classLevel: number;
    subjectId: string;
    year?: number;
    contentBody: string;
  }): IngestionValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Mandatory metadata check
    if (!doc.title || doc.title.trim().length < 5) {
      errors.push("Document title is missing or insufficient length (< 5 chars).");
    }

    // 2. Source registry lookup
    const registeredSource = SOURCE_REGISTRY.find((s) => s.sourceId === doc.sourceId);
    if (!registeredSource) {
      errors.push(`Unregistered source '${doc.sourceId}'. Content must have a valid Source Registry entry.`);
    } else {
      if (registeredSource.copyrightStatus === "RESTRICTED_OFFICIAL_COPYRIGHT") {
        warnings.push("Source has restricted copyright. Allowed actions limited to Link & Extraction under fair-use guidelines.");
      }
    }

    // 3. Class level & Board validity
    if (![10, 11, 12].includes(doc.classLevel)) {
      errors.push(`Invalid class level: ${doc.classLevel}. Must be 10, 11, or 12.`);
    }

    // 4. Year validity check
    if (doc.year) {
      const currentYear = new Date().getFullYear();
      if (doc.year < 2010 || doc.year > currentYear + 1) {
        errors.push(`Examination year ${doc.year} is outside verified historical range (2010-${currentYear + 1}).`);
      }
    }

    // 5. Body content checks
    if (!doc.contentBody || doc.contentBody.trim().length === 0) {
      errors.push("Content body is empty. Blank documents cannot be published.");
    }

    // 6. OCR Quality check: Detect corrupted OCR tokens
    const ocrScore = this.evaluateOCRQuality(doc.contentBody);
    if (ocrScore < 85) {
      warnings.push(`OCR quality confidence score is ${ocrScore}%. Manual editorial review flagged.`);
    }

    // 7. Scientific & Math notation check
    const scientificValid = this.verifyScientificFormulas(doc.contentBody);
    if (!scientificValid) {
      warnings.push("Scientific or chemical notation may have lost subscript/superscript fidelity.");
    }

    // 8. Deduplication check
    const docHash = this.computeHash(`${doc.boardCode}-${doc.classLevel}-${doc.subjectId}-${doc.title}`);
    const isDuplicate = this.registeredHashes.has(docHash);
    if (!isDuplicate && errors.length === 0) {
      this.registeredHashes.add(docHash);
    }

    return {
      isValid: errors.length === 0 && !isDuplicate,
      errors,
      warnings,
      fileHash: docHash,
      isDuplicate,
      ocrQualityScorePct: ocrScore,
      scientificNotationValid: scientificValid,
    };
  }

  /**
   * STEP 5: OCR Quality Checker
   * Scans text for classic OCR artefacts (e.g. 'l' replacing '1', 'O' replacing '0' in numbers, broken equations)
   */
  public static evaluateOCRQuality(text: string): number {
    let penalty = 0;
    if (!text || text.length === 0) return 0;

    // Detect suspect non-ASCII garbage or replacement characters
    const garbageMatches = text.match(/|[\uFFFD]/g);
    if (garbageMatches) penalty += garbageMatches.length * 5;

    // Detect malformed numbers like 1O0 (letter O in number)
    const malformedNumbers = text.match(/\b\d+[O|o]\d*\b/g);
    if (malformedNumbers) penalty += malformedNumbers.length * 8;

    // Detect broken bracket symmetry
    const openParen = (text.match(/\(/g) || []).length;
    const closeParen = (text.match(/\)/g) || []).length;
    if (Math.abs(openParen - closeParen) > 4) penalty += 10;

    const calculatedScore = Math.max(10, Math.min(100, 100 - penalty));
    return calculatedScore;
  }

  /**
   * STEP 42: Math and Science formula validator
   * Ensures subscript/superscript and chemical reaction formulas retain correct formatting
   */
  public static verifyScientificFormulas(text: string): boolean {
    // Check that chemical notations like H2O are represented properly or in LaTeX
    // If text has corrupted symbols like "H 2 O" or "?H" it flags warning
    const corruptedChems = /\bH\s+2\s*O\b|\bCO\s+2\b/i.test(text);
    return !corruptedChems;
  }

  /**
   * STEP 20: Map an extracted question to Syllabus Chapter & Topic with confidence check
   */
  public static mapQuestionToSyllabus(
    questionText: string,
    chapters: DetailedChapterContent[]
  ): { chapterId: string; topicId?: string; confidence: "HIGH" | "NEEDS_REVIEW" } {
    let bestChapterId = chapters[0]?.id || "unknown";
    let bestTopicId: string | undefined = undefined;
    let highestMatchScore = 0;

    const lowerQ = questionText.toLowerCase();

    for (const chap of chapters) {
      let score = 0;

      // Check chapter title keywords
      const titleWords = chap.title.toLowerCase().split(/\s+/);
      for (const word of titleWords) {
        if (word.length > 3 && lowerQ.includes(word)) score += 3;
      }

      // Check key definitions
      for (const def of chap.definitions) {
        if (lowerQ.includes(def.term.toLowerCase())) score += 5;
      }

      // Check topics
      for (const topic of chap.topics) {
        const topicWords = topic.title.toLowerCase().split(/\s+/);
        let topicScore = 0;
        for (const w of topicWords) {
          if (w.length > 3 && lowerQ.includes(w)) topicScore += 4;
        }
        if (topicScore > 0) {
          score += topicScore;
          if (!bestTopicId || topicScore > 4) {
            bestTopicId = topic.id;
          }
        }
      }

      if (score > highestMatchScore) {
        highestMatchScore = score;
        bestChapterId = chap.id;
      }
    }

    return {
      chapterId: bestChapterId,
      topicId: bestTopicId,
      confidence: highestMatchScore >= 5 ? "HIGH" : "NEEDS_REVIEW",
    };
  }

  /**
   * STEP 15 & 47: Grounding context builder for AI Tutor
   * Prepares authentic source context with strict distinction from AI explanations
   */
  public static createAIGroundedContext(
    chapter: DetailedChapterContent,
    relevantQuestions: ExtractedQuestionItem[]
  ): string {
    return `
[VERIFIED SYLLABUS GROUNDING - SOURCE: ${chapter.provenance.sourceId}]
Board: ${chapter.boardCode.toUpperCase()} | Class: ${chapter.classLevel}
Chapter ${chapter.chapterNumber}: ${chapter.title}
Syllabus Version: ${chapter.syllabusVersion} (${chapter.academicYear})
Weightage: ${chapter.marksWeightage} Marks

CORE DEFINITIONS:
${chapter.definitions.map((d) => `• ${d.term}: ${d.definition}`).join("\n")}

${chapter.formulas && chapter.formulas.length > 0 ? `FORMULAS:\n${chapter.formulas.map((f) => `• ${f.name}: ${f.formulaLatex} (${f.units})`).join("\n")}` : ""}

COMMON MISCONCEPTIONS:
${chapter.misconceptions.map((m) => `• Pitfall: "${m.misconception}" -> Scientific Fact: ${m.scientificFact}`).join("\n")}

OFFICIALLY TESTED PYQ EXCERPTS (${relevantQuestions.length} Analyzed):
${relevantQuestions.slice(0, 4).map((q) => `[Year ${q.year}, Q${q.questionNumber}, ${q.marks}M]: ${q.questionText}`).join("\n")}

STRICT INSTRUCTION FOR AI TUTOR:
1. Label all responses with: [AI-GENERATED STUDY EXPLANATION - GROUNDED IN CBSE/NCERT OFFICIAL SYLLABUS].
2. Do not invent any historical question numbers or exam years.
3. If a student asks for something outside this verified chapter syllabus, state: "I couldn't find this in the verified EduVerse syllabus."
`.trim();
  }
}
