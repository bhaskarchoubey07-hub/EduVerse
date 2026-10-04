// ==============================================================================
// EDUVERSE AI — EDUCATIONAL CONTEXT RETRIEVAL LAYER
// Grounds AI prompts in verified syllabus and genuine previous-year examination questions
// ==============================================================================

import { EducationalContext } from "./ai-types";
import { EXPANDED_CHAPTERS_REGISTRY } from "@/lib/data/curriculum-registry";
import { CBSE_10_SCIENCE_QUESTIONS_SAMPLE } from "@/lib/data/cbse-10-science-pilot";

export class AIContextRetriever {
  /**
   * Retrieves syllabus nodes, formulas, misconceptions, and PYQs matching student query
   */
  public static enrichContext(context: EducationalContext, userQuery: string): EducationalContext {
    const qLower = userQuery.toLowerCase();
    
    // Find matching chapter in verified curriculum
    let matchedChapter = EXPANDED_CHAPTERS_REGISTRY.find((c) => {
      if (context.chapter && c.title.toLowerCase().includes(context.chapter.toLowerCase())) return true;
      if (c.topics.some((t) => qLower.includes(t.title.toLowerCase()))) return true;
      if (c.definitions.some((d) => qLower.includes(d.term.toLowerCase()))) return true;
      return false;
    });

    if (!matchedChapter) {
      matchedChapter = EXPANDED_CHAPTERS_REGISTRY.find(
        (c) => c.subjectId.toLowerCase().includes(context.subject.toLowerCase())
      ) || EXPANDED_CHAPTERS_REGISTRY[0];
    }

    // Build verified syllabus grounding summary
    const definitionsText = matchedChapter.definitions
      .slice(0, 3)
      .map((d) => `• ${d.term}: ${d.definition}`)
      .join("\n");

    const formulaText = matchedChapter.formulas
      ? matchedChapter.formulas.map((f) => `• ${f.name}: ${f.formulaLatex}`).join("\n")
      : "";

    const misconceptionsText = matchedChapter.misconceptions
      ? matchedChapter.misconceptions
          .slice(0, 2)
          .map((m) => `• Avoid Trap: "${m.misconception}" -> Scientific Fact: ${m.scientificFact}`)
          .join("\n")
      : "";

    const syllabusSummary = `
[OFFICIAL SYLLABUS: ${matchedChapter.boardCode.toUpperCase()} Class ${matchedChapter.classLevel} - Chapter ${matchedChapter.chapterNumber}: ${matchedChapter.title}]
Weightage: ${matchedChapter.marksWeightage} Marks

CORE DEFINITIONS:
${definitionsText}

${formulaText ? `KEY FORMULAS:\n${formulaText}` : ""}

EXAM PITFALLS:
${misconceptionsText}
`.trim();

    // Find relevant genuine PYQs
    const matchedPYQs = CBSE_10_SCIENCE_QUESTIONS_SAMPLE.filter(
      (pyq) => pyq.chapterId === matchedChapter.id
    );

    const pyqExcerpts = matchedPYQs.length > 0
      ? matchedPYQs
          .slice(0, 2)
          .map(
            (p) =>
              `[Year ${p.year} Board Exam, ${p.marks}M]: "${p.questionText}" -> Solution: ${p.officialAnswerKey?.slice(0, 160)}...`
          )
          .join("\n\n")
      : "No verified PYQ mapped for this subtopic.";

    return {
      ...context,
      chapter: matchedChapter.title,
      verifiedSyllabusSummary: syllabusSummary,
      recentPYQSample: pyqExcerpts,
    };
  }

  /**
   * Constructs the structured system instruction for the AI tutor
   */
  public static buildSystemPrompt(context: EducationalContext, mode: string): string {
    return `
You are EduVerse AI Tutor, an empathetic, highly structured, syllabus-grounded teacher preparing Indian students for ${context.board.toUpperCase()} Class ${context.classLevel} Board Examinations.
Subject: ${context.subject}
${context.chapter ? `Current Chapter: ${context.chapter}` : ""}
${context.current3DObject ? `Interactive 3D Visual Context: ${context.current3DObject}` : ""}
Teaching Mode: "${mode}"

STRICT PEDAGOGICAL RULES:
1. ALWAYS ground your answers in the official curriculum below.
2. Clearly label explanations: "[AI-GENERATED STUDY EXPLANATION - GROUNDED IN OFFICIAL SYLLABUS]".
3. Keep answers concise, exam-oriented, and high-scoring. Use bullet points and bold keywords.
4. Format mathematical and chemical formulas using LaTeX notation (e.g. $V = IR$, $\\text{H}_2\\text{O}$).
5. If the mode is "hint_first", give an intuitive mental clue without solving the full question immediately.
6. If the mode is "step_by_step", break calculations into numbered steps with marks allocation advice.
7. NEVER invent historical examination papers or fake exam statistics. If something is unknown, say: "I couldn't find this in the verified EduVerse syllabus."
8. End your response with 2-3 relevant follow-up questions to test understanding.

VERIFIED SYLLABUS CONTEXT:
${context.verifiedSyllabusSummary || "Standard NCERT curriculum benchmarks."}

GENUINE PREVIOUS-YEAR BOARD EXAM PATTERNS:
${context.recentPYQSample || "Refer to standard Board marking rubrics."}
`.trim();
  }
}
