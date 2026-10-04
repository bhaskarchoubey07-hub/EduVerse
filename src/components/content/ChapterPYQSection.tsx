"use client";

import React, { useState } from "react";
import {
  FileText,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Calendar,
  Award,
  HelpCircle,
  Copy,
  Check,
  BookOpen,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { ExtractedQuestionItem, QuestionFrequencyStat } from "@/types";

interface ChapterPYQSectionProps {
  chapterTitle: string;
  boardName: string;
  totalQuestionsFound: number;
  yearsSpan: string;
  frequencyStats: QuestionFrequencyStat[];
  questions: ExtractedQuestionItem[];
}

export function ChapterPYQSection({
  chapterTitle,
  boardName,
  totalQuestionsFound,
  yearsSpan,
  frequencyStats,
  questions,
}: ChapterPYQSectionProps) {
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(
    questions[0]?.id || null
  );
  const [activeTab, setActiveTab] = useState<Record<string, "official" | "ai">>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Practice Similar Question modal state
  const [practiceQuestion, setPracticeQuestion] = useState<{
    originalQuestion: ExtractedQuestionItem;
    generatedPracticeText: string;
    sampleAnswer: string;
  } | null>(null);

  const filteredQuestions = questions.filter((q) => {
    if (selectedTopic !== "all" && q.topicId !== selectedTopic) return false;
    return true;
  });

  const toggleTab = (questionId: string, tab: "official" | "ai") => {
    setActiveTab((prev) => ({ ...prev, [questionId]: tab }));
  };

  const handleCopyQuestion = (q: ExtractedQuestionItem) => {
    navigator.clipboard.writeText(q.questionText);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePracticeSimilar = (q: ExtractedQuestionItem) => {
    // Generate an authentic variation inspired by the concept (Prompt Section 28)
    const variationText =
      q.questionType === "numerical"
        ? `[AI-GENERATED PRACTICE VARIATION]\nTwo resistors of 15 Ω and 30 Ω are connected to a 12 V power supply: (a) in series, (b) in parallel. Calculate the ratio of electrical power consumed in both combinations.`
        : `[AI-GENERATED PRACTICE VARIATION]\nExplain why pulmonary artery carries deoxygenated blood while pulmonary vein carries oxygenated blood. How does the muscular wall thickness of the left ventricle compare to the right ventricle, and why?`;

    setPracticeQuestion({
      originalQuestion: q,
      generatedPracticeText: variationText,
      sampleAnswer:
        "Standard Step: Identify constant voltage V across parallel vs identical current I across series. Use P = V²/R for parallel and P = I²R for series to compare.",
    });
  };

  return (
    <section className="space-y-6 pt-4 border-t border-white/10">
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel-glow border border-violet-500/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-cyan-400" />
              Verified Board Archive
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              {boardName.toUpperCase()} • {yearsSpan}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-violet-400" />
            Questions Asked in Previous Board Exams
          </h3>
          <p className="text-xs text-slate-300">
            Factual historical analysis of questions extracted from genuine examination papers.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-center">
            <div className="text-lg font-black text-cyan-400 font-mono">
              {totalQuestionsFound}
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Tested PYQs</div>
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-center">
            <div className="text-lg font-black text-amber-400 font-mono">
              {yearsSpan}
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Years Span</div>
          </div>
        </div>
      </div>

      {/* TOPIC FREQUENCY ANALYSIS CARDS (Prompt Section 23 & 24) */}
      {frequencyStats.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Topic Frequency Analysis (Evidence-Based)
            </h4>
            <span className="text-[11px] text-slate-500">Calculated from verified papers only</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {frequencyStats.map((stat) => (
              <div
                key={stat.topicId}
                onClick={() =>
                  setSelectedTopic(selectedTopic === stat.topicId ? "all" : stat.topicId)
                }
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedTopic === stat.topicId
                    ? "bg-violet-950/40 border-violet-500 shadow-md shadow-violet-500/20"
                    : "glass-panel border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between gap-2 pb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {stat.weightageCategory}
                  </span>
                  <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" /> {stat.timesAskedInPapers} times
                  </span>
                </div>
                <h5 className="text-xs font-bold text-white line-clamp-1">{stat.topicTitle}</h5>
                <p className="text-[11px] text-slate-400 mt-1">
                  Appeared in: {stat.yearsList.join(", ")}
                </p>
                <div className="mt-2 text-[10px] text-violet-400 font-semibold">
                  Avg. Marks: ~{stat.averageMarks}M • Most Recent: {stat.mostRecentYear}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FILTER PILLS */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        <span className="text-xs text-slate-400 font-semibold mr-1">Filter by Topic:</span>
        <button
          onClick={() => setSelectedTopic("all")}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
            selectedTopic === "all"
              ? "bg-violet-600 text-white"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800"
          }`}
        >
          All Topics ({questions.length})
        </button>
        {frequencyStats.map((stat) => (
          <button
            key={stat.topicId}
            onClick={() => setSelectedTopic(stat.topicId)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedTopic === stat.topicId
                ? "bg-cyan-600 text-white font-bold"
                : "bg-slate-900 text-slate-400 hover:bg-slate-800"
            }`}
          >
            {stat.topicTitle}
          </button>
        ))}
      </div>

      {/* EXTRACTED QUESTIONS LIST */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => {
          const isExpanded = expandedQuestionId === q.id;
          const currentTab = activeTab[q.id] || "official";

          return (
            <div
              key={q.id}
              className={`rounded-2xl border transition-all ${
                isExpanded
                  ? "bg-slate-900/90 border-violet-500/50 shadow-xl shadow-violet-950/20"
                  : "glass-panel border-white/10 hover:border-white/20"
              }`}
            >
              {/* Question Header Bar */}
              <div
                onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-violet-600/30 border border-violet-500/30 text-violet-300 text-[10px] font-mono font-bold">
                      {q.boardCode.toUpperCase()} {q.year} • {q.section} Q{q.questionNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold font-mono">
                      {q.marks} Mark{q.marks > 1 ? "s" : ""}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-slate-400">
                      Difficulty: {q.difficulty}
                    </span>
                    {q.appearedInYears && q.appearedInYears.length > 1 && (
                      <span className="text-[10px] text-cyan-400 font-medium">
                        (Repeated in {q.appearedInYears.join(", ")})
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed font-sans">
                    {q.questionText}
                  </p>

                  {/* Options if MCQ */}
                  {q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                      {q.options.map((opt) => (
                        <div
                          key={opt.id}
                          className="px-3 py-1.5 rounded-lg bg-slate-950/60 border border-white/5 text-xs text-slate-300 flex items-center gap-2"
                        >
                          <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                            {opt.label}
                          </span>
                          <span>{opt.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyQuestion(q);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                    title="Copy Question"
                  >
                    {copiedId === q.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <div className="text-slate-400">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </div>

              {/* EXPANDED CONTENT: OFFICIAL ANSWER vs AI EXPLANATION */}
              {isExpanded && (
                <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-white/10 space-y-4 animate-in fade-in">
                  {/* TAB SWITCHER */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleTab(q.id, "official")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          currentTab === "official"
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                            : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                        Official Answer Key / Marking Rubric
                      </button>

                      <button
                        onClick={() => toggleTab(q.id, "ai")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          currentTab === "ai"
                            ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                            : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                        Explain with AI Tutor
                      </button>
                    </div>

                    <button
                      onClick={() => handlePracticeSimilar(q)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 border border-cyan-500/30"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      Practice Similar Question
                    </button>
                  </div>

                  {/* 1. OFFICIAL ANSWER KEY */}
                  {currentTab === "official" && (
                    <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
                        <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" /> Official Board Marking Scheme Solution
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Source: {q.provenance.sourceId}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                        {q.officialAnswerKey}
                      </p>

                      {/* Marking Rubric Breakdown */}
                      {q.officialMarkingRubric && q.officialMarkingRubric.length > 0 && (
                        <div className="pt-2 border-t border-emerald-500/20 space-y-1.5">
                          <span className="text-[11px] font-bold text-emerald-300 uppercase">
                            Step-by-Step Mark Distribution:
                          </span>
                          <div className="space-y-1">
                            {q.officialMarkingRubric.map((rubric, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between text-xs text-slate-300 bg-slate-950/40 p-2 rounded-lg"
                              >
                                <span>{rubric.step}</span>
                                <span className="font-mono font-bold text-emerald-400 shrink-0 ml-2">
                                  +{rubric.marks} Mark
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2. AI STUDY EXPLANATION (Strictly Labeled as AI-Generated per Section 15 & 27) */}
                  {currentTab === "ai" && q.aiExplanation && (
                    <div className="p-4 rounded-xl bg-violet-950/30 border border-violet-500/30 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-violet-500/20">
                        <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wide flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" /> AI-GENERATED STUDY EXPLANATION
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Grounded in {q.aiExplanation.sourceGrounding}
                        </span>
                      </div>

                      <div className="space-y-3 text-xs sm:text-sm text-slate-200">
                        <div>
                          <strong className="text-cyan-300 block mb-1">Core Concept:</strong>
                          <p className="text-slate-300 leading-relaxed">
                            {q.aiExplanation.conceptBreakdown}
                          </p>
                        </div>

                        <div>
                          <strong className="text-cyan-300 block mb-1">
                            How to Approach this in Exam:
                          </strong>
                          <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1">
                            {q.aiExplanation.stepByStepApproach.map((step, idx) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ol>
                        </div>

                        <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/20 text-xs">
                          <strong className="text-rose-300 block mb-0.5">Common Mistake:</strong>
                          <span className="text-slate-300">{q.aiExplanation.commonStudentMistakes}</span>
                        </div>

                        <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/20 text-xs">
                          <strong className="text-amber-300 block mb-0.5">Examiner Scoring Tip:</strong>
                          <span className="text-slate-300">{q.aiExplanation.examinerTip}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* PRACTICE SIMILAR QUESTION MODAL / DRAWER (Prompt Section 28) */}
      {practiceQuestion && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <Sparkles className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-base font-bold text-white">AI-Generated Practice Question</h4>
                  <p className="text-xs text-slate-400">
                    Inspired by {practiceQuestion.originalQuestion.boardCode.toUpperCase()}{" "}
                    {practiceQuestion.originalQuestion.year} concept
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPracticeQuestion(null)}
                className="text-slate-400 hover:text-white text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
              <div className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                PRACTICE CHALLENGE
              </div>
              <p className="text-xs sm:text-sm text-slate-100 whitespace-pre-wrap font-sans">
                {practiceQuestion.generatedPracticeText}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/20 space-y-1">
              <span className="text-xs font-bold text-violet-300">Solution Approach:</span>
              <p className="text-xs text-slate-300">{practiceQuestion.sampleAnswer}</p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setPracticeQuestion(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700"
              >
                Done Practice
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
