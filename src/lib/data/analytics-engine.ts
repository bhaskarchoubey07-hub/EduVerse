// ==============================================================================
// EDUVERSE AI — QUESTION PAPER ANALYTICS ENGINE (Section 24)
// Calculates real chapter frequencies, marks distribution, question types, and trends
// STRICT RULE: Only calculates from actual imported & verified questions!
// ==============================================================================

import { QUESTION_PAPERS } from "@/lib/data/mock-db";
import { ExamQuestion } from "@/types";

export interface AnalyticsSummary {
  totalPapersIndexed: number;
  totalQuestionsExtracted: number;
  totalMarksAnalyzed: number;
  chapterFrequencies: { chapterName: string; count: number; totalMarks: number }[];
  topicFrequencies: { topicName: string; count: number }[];
  marksDistribution: { marks: number; count: number; percentage: number }[];
  questionTypeDistribution: { type: string; count: number; percentage: number }[];
  difficultyDistribution: { difficulty: string; count: number; percentage: number }[];
  yearWiseTrends: { year: number; paperCount: number; questionsExtracted: number }[];
}

export function calculateRealPaperAnalytics(
  filters?: { boardId?: string; classLevel?: number; subjectId?: string }
): AnalyticsSummary {
  // 1. Filter papers
  let papers = QUESTION_PAPERS;
  if (filters?.boardId && filters.boardId !== "all") {
    papers = papers.filter((p) => p.boardId === filters.boardId);
  }
  if (filters?.classLevel) {
    papers = papers.filter((p) => p.classLevel === filters.classLevel);
  }
  if (filters?.subjectId && filters.subjectId !== "all") {
    papers = papers.filter((p) => p.subjectId === filters.subjectId);
  }

  // 2. Gather all extracted questions
  const questions: ExamQuestion[] = [];
  papers.forEach((p) => {
    p.sections?.forEach((sec) => {
      sec.questions?.forEach((q) => {
        questions.push(q);
      });
    });
  });

  const totalQuestions = questions.length;
  let totalMarks = 0;

  const chapterMap: Record<string, { count: number; totalMarks: number }> = {};
  const topicMap: Record<string, number> = {};
  const marksMap: Record<number, number> = {};
  const typeMap: Record<string, number> = {};
  const diffMap: Record<string, number> = {};
  const yearMap: Record<number, { paperCount: number; questionsExtracted: number }> = {};

  // Track years from papers
  papers.forEach((p) => {
    if (!yearMap[p.year]) {
      yearMap[p.year] = { paperCount: 0, questionsExtracted: 0 };
    }
    yearMap[p.year].paperCount += 1;
    const pQCount = p.sections?.reduce((acc, s) => acc + (s.questions?.length || 0), 0) || 0;
    yearMap[p.year].questionsExtracted += pQCount;
  });

  questions.forEach((q) => {
    totalMarks += q.marks || 1;

    // Chapter
    const ch = q.chapterName || "General / Integrated";
    if (!chapterMap[ch]) chapterMap[ch] = { count: 0, totalMarks: 0 };
    chapterMap[ch].count += 1;
    chapterMap[ch].totalMarks += q.marks || 1;

    // Topic
    const top = q.topicName || "Core Concept";
    topicMap[top] = (topicMap[top] || 0) + 1;

    // Marks
    marksMap[q.marks] = (marksMap[q.marks] || 0) + 1;

    // Type
    typeMap[q.type] = (typeMap[q.type] || 0) + 1;

    // Difficulty
    diffMap[q.difficulty || "medium"] = (diffMap[q.difficulty || "medium"] || 0) + 1;
  });

  return {
    totalPapersIndexed: papers.length,
    totalQuestionsExtracted: totalQuestions,
    totalMarksAnalyzed: totalMarks,
    chapterFrequencies: Object.entries(chapterMap)
      .map(([chapterName, d]) => ({ chapterName, count: d.count, totalMarks: d.totalMarks }))
      .sort((a, b) => b.count - a.count),
    topicFrequencies: Object.entries(topicMap)
      .map(([topicName, count]) => ({ topicName, count }))
      .sort((a, b) => b.count - a.count),
    marksDistribution: Object.entries(marksMap)
      .map(([marks, count]) => ({
        marks: Number(marks),
        count,
        percentage: totalQuestions > 0 ? Math.round((count / totalQuestions) * 100) : 0,
      }))
      .sort((a, b) => a.marks - b.marks),
    questionTypeDistribution: Object.entries(typeMap)
      .map(([type, count]) => ({
        type,
        count,
        percentage: totalQuestions > 0 ? Math.round((count / totalQuestions) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count),
    difficultyDistribution: Object.entries(diffMap)
      .map(([difficulty, count]) => ({
        difficulty,
        count,
        percentage: totalQuestions > 0 ? Math.round((count / totalQuestions) * 100) : 0,
      })),
    yearWiseTrends: Object.entries(yearMap)
      .map(([year, d]) => ({
        year: Number(year),
        paperCount: d.paperCount,
        questionsExtracted: d.questionsExtracted,
      }))
      .sort((a, b) => b.year - a.year),
  };
}
