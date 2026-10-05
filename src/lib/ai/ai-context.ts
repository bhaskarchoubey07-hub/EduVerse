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
    const qLower = (userQuery || "").toLowerCase();
    
    // 1. High-priority query-based match across definitions, topics, key points, and chapter titles
    let matchedChapter = EXPANDED_CHAPTERS_REGISTRY.find((c) => {
      // Check definitions
      if (c.definitions && c.definitions.some((d) => 
        qLower.includes(d.term.toLowerCase()) || d.term.toLowerCase().split(" ").some(w => w.length > 3 && qLower.includes(w))
      )) return true;

      // Check topics and key points
      if (c.topics && c.topics.some((t) => 
        qLower.includes(t.title.toLowerCase()) || 
        t.title.toLowerCase().split(" ").some(w => w.length > 4 && qLower.includes(w)) ||
        t.keyPoints.some((kp) => kp.toLowerCase().split(" ").some(w => w.length > 5 && qLower.includes(w)))
      )) return true;

      // Check chapter title
      if (qLower.includes(c.title.toLowerCase())) return true;
      return false;
    });

    // 2. If no direct topic match, match by explicitly requested chapter (if not "General")
    const requestedChapter = context.chapter;
    if (!matchedChapter && requestedChapter && requestedChapter.toLowerCase() !== "general") {
      matchedChapter = EXPANDED_CHAPTERS_REGISTRY.find(
        (c) => c.title.toLowerCase().includes(requestedChapter.toLowerCase()) ||
               requestedChapter.toLowerCase().includes(c.title.toLowerCase())
      );
    }

    // 3. Fallback to subject-based chapter
    if (!matchedChapter) {
      matchedChapter = EXPANDED_CHAPTERS_REGISTRY.find(
        (c) => c.subjectId.toLowerCase().includes((context.subject || "").toLowerCase())
      ) || EXPANDED_CHAPTERS_REGISTRY[0];
    }

    // Build verified syllabus grounding summary
    const definitionsText = matchedChapter.definitions
      ? matchedChapter.definitions
          .slice(0, 4)
          .map((d) => `• ${d.term}: ${d.definition}`)
          .join("\n")
      : "";

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
[VERIFIED SYLLABUS REFERENCE: ${matchedChapter.boardCode.toUpperCase()} Class ${matchedChapter.classLevel} - Chapter ${matchedChapter.chapterNumber}: ${matchedChapter.title}]
Weightage: ${matchedChapter.marksWeightage} Marks

CORE DEFINITIONS:
${definitionsText || "Standard NCERT concepts."}

${formulaText ? `KEY FORMULAS:\n${formulaText}\n` : ""}${misconceptionsText ? `EXAM PITFALLS:\n${misconceptionsText}` : ""}
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
              `[Year ${p.year} Board Exam, ${p.marks}M]: "${p.questionText}" -> Official Answer Key: ${p.officialAnswerKey?.slice(0, 160)}...`
          )
          .join("\n\n")
      : "Standard Board marking rubrics apply.";

    // 4. EXACT QUESTION GROUNDING (Sections 19, 20 & 21)
    let questionGroundingText: string | undefined = undefined;
    const qMatch = qLower.match(/\b(?:q|question)\s*#?(\d+)\b/i);

    if (context.questionId || qMatch) {
      const targetQNum = qMatch ? parseInt(qMatch[1], 10) : undefined;
      const { QUESTION_PAPERS } = require("@/lib/data/mock-db");
      
      // Look across question papers
      for (const p of QUESTION_PAPERS) {
        if (context.paperId && p.id !== context.paperId) continue;
        for (const sec of p.sections || []) {
          for (const q of sec.questions || []) {
            if ((context.questionId && q.id === context.questionId) || (targetQNum && q.questionNumber === targetQNum)) {
              questionGroundingText = `
[AUTHENTIC VERIFIED QUESTION: ${p.title}]
Question Number: Q${q.questionNumber} [Marks: ${q.marks}]
Source Page: Page ${q.sourcePageNumber || 1}
Question Text: "${q.text}"
${q.options ? `Options:\n${q.options.map((o: any) => `(${o.label}) ${o.text} ${o.isCorrect ? '[CORRECT]' : ''}`).join('\n')}` : ""}
OFFICIAL ANSWER KEY: ${q.officialAnswer || q.correctAnswer || "Refer to marking rubric"}
OFFICIAL MARKING SCHEME: ${q.markingScheme || q.explanation}
SYLLABUS CHAPTER: ${q.chapterName || matchedChapter.title} • Topic: ${q.topicName || "Curriculum Unit"}
`.trim();
              break;
            }
          }
          if (questionGroundingText) break;
        }
        if (questionGroundingText) break;
      }
    }

    // 5. Anti-Fabrication Notice for 2021 Cancelled Exams (Section 11)
    if (qLower.includes("2021") && (qLower.includes("paper") || qLower.includes("board exam") || qLower.includes("pyq"))) {
      questionGroundingText = `[OFFICIAL VERIFIED RECORD: CBSE officially cancelled Class 10 Board Examinations in 2021 due to COVID-19 pandemic. No official board examination question paper was conducted. Tabulation was performed via internal assessment.]`;
    }

    return {
      ...context,
      chapter: context.chapter && context.chapter !== "General" ? context.chapter : matchedChapter.title,
      verifiedSyllabusSummary: syllabusSummary,
      recentPYQSample: pyqExcerpts,
      specificQuestionGrounding: questionGroundingText,
    };
  }

  /**
   * Constructs the structured system instruction for the AI tutor
   */
  public static buildSystemPrompt(context: EducationalContext, mode: string): string {
    return `
You are EduVerse AI Tutor, an empathetic, encouraging, and syllabus-grounded master educator preparing Indian students for their ${context.board.toUpperCase()} Class ${context.classLevel} Board Examinations.
Target Subject: ${context.subject || "Academic"}
${context.chapter ? `Current Chapter/Topic Focus: ${context.chapter}` : ""}
${context.bookTitle ? `Textbook in View: ${context.bookTitle} (Page ${context.bookPage || 1})` : ""}
${context.current3DObject ? `Interactive 3D Visual in View: ${context.current3DObject}` : ""}
Teaching Mode: "${mode}"

PEDAGOGICAL TEACHING GUIDELINES:
1. Always answer the student's question accurately, clearly, and enthusiastically at the appropriate level for ${context.board.toUpperCase()} Class ${context.classLevel}.
2. Whenever verified syllabus definitions, formulas, or PYQs are provided in the reference section below, prioritize and incorporate them into your response.
3. If an exact Question is grounded below, directly address that specific question. Distinctly label:
   - "Official Answer Key:"
   - "Official Marking Scheme:"
   - "AI Conceptual Explanation:"
4. Structure your response cleanly with markdown headings, bullet points, bold keywords, and concise explanations.
5. Format mathematical equations and chemical formulas using LaTeX or clear notation (e.g., $V = IR$, $6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\to \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$).
6. If the teaching mode is "hint_first", provide a smart clue/intuition to help the student think before revealing the full answer.
7. If the teaching mode is "step_by_step", break down the derivation/calculation into numbered steps with marking scheme tips.
8. End your response with 2-3 engaging, relevant follow-up questions to test the student's mastery.

${context.specificQuestionGrounding ? `
EXACT GROUNDED SOURCE QUESTION:
${context.specificQuestionGrounding}
` : ""}

VERIFIED REFERENCE CURRICULUM:
${context.verifiedSyllabusSummary || "Standard NCERT curriculum benchmarks."}

GENUINE PREVIOUS-YEAR BOARD EXAM EXCERPTS:
${context.recentPYQSample || "Refer to standard Board marking rubrics."}
`.trim();
  }
}
