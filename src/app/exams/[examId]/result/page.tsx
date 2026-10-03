"use client";

import React, { useState, useEffect, use, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Sparkles,
  Bot,
  TrendingUp,
} from "lucide-react";
import { MOCK_EXAMS } from "@/lib/data/mock-db";
import { useDataStore } from "@/lib/store/data-store";

function ExamResultContent({ examId }: { examId: string }) {
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attemptId");

  const { attempts, allExams } = useDataStore();
  const exam = allExams.find((e) => e.id === examId) || MOCK_EXAMS[0];
  const attempt = attempts.find((a) => a.id === attemptId) || attempts[0];

  const [evaluatingSubjectiveId, setEvaluatingSubjectiveId] = useState<string | null>(null);
  const [aiEvaluations, setAiEvaluations] = useState<Record<string, any>>({});

  useEffect(() => {
    if (attempt && attempt.percentage >= 70) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [attempt]);

  const handleRequestAIEvaluation = async (qId: string, qText: string, studentAns: string, modelAns: string, maxMarks: number) => {
    setEvaluatingSubjectiveId(qId);
    try {
      const res = await fetch("/api/evaluate-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionText: qText,
          studentAnswer: studentAns,
          modelAnswer: modelAns,
          maxMarks,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiEvaluations((prev) => ({ ...prev, [qId]: data }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEvaluatingSubjectiveId(null);
    }
  };

  if (!attempt) {
    return (
      <div className="flex-1 flex items-center justify-center text-center p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">No Exam Attempt Found</h2>
          <Link href="/exams" className="px-5 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-semibold">
            Return to Exams Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* SCORE BANNER */}
      <div className="rounded-3xl glass-panel-glow p-6 sm:p-10 border border-white/10 space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Examination Assessment Completed
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white">{attempt.examTitle}</h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Subject: {attempt.subjectName} • Time Taken: {Math.round(attempt.timeSpentSeconds / 60)} minutes
            </p>
          </div>

          {/* Score Ring */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-center min-w-[140px]">
            <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300 font-mono">
              {attempt.score} / {attempt.totalMarks}
            </div>
            <div className="text-xs font-bold text-slate-400 mt-1 uppercase">
              {attempt.percentage}% Score (Grade: {attempt.percentage >= 80 ? "A1" : attempt.percentage >= 70 ? "A2" : "B1"})
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
            <div className="text-slate-400 text-[11px]">Accuracy Rate</div>
            <div className="text-base font-bold text-cyan-400">{attempt.accuracyRate}%</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
            <div className="text-slate-400 text-[11px]">Total Questions</div>
            <div className="text-base font-bold text-white">{exam.questions.length}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
            <div className="text-slate-400 text-[11px]">Board Benchmark</div>
            <div className="text-base font-bold text-emerald-400">Above 85th Percentile</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
            <div className="text-slate-400 text-[11px]">Next Step</div>
            <div className="text-base font-bold text-amber-400">Review Mistakes</div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href={`/exams/${exam.id}`}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-violet-500/20"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Retake This Exam
          </Link>

          <Link
            href={`/tutor?prompt=${encodeURIComponent(
              `I just took the "${exam.title}" exam and scored ${attempt.score}/${attempt.totalMarks}. Can you help me revise my weak topics?`
            )}`}
            className="px-5 py-2.5 rounded-xl glass-panel text-cyan-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-cyan-500/30"
          >
            <Bot className="w-3.5 h-3.5" /> Discuss Errors with AI Tutor
          </Link>
        </div>
      </div>

      {/* TOPIC BREAKDOWN DIAGNOSTICS */}
      {attempt.topicBreakdown && attempt.topicBreakdown.length > 0 && (
        <div className="p-6 rounded-2xl glass-panel space-y-4 border border-white/10">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" /> Topic-Level Competency Breakdown
          </h3>
          <div className="space-y-3">
            {attempt.topicBreakdown.map((top, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{top.topic}</span>
                  <span className="text-cyan-400 font-mono font-bold">{top.accuracy}% Accuracy</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${
                      top.accuracy >= 80 ? "bg-emerald-400" : top.accuracy >= 60 ? "bg-amber-400" : "bg-rose-400"
                    }`}
                    style={{ width: `${top.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUESTION-BY-QUESTION COMPREHENSIVE REVIEW */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Question-by-Question Marking &amp; Official Solutions
          </h3>
          <span className="text-xs text-slate-400">Review answers and scoring rubrics</span>
        </div>

        <div className="space-y-4">
          {exam.questions.map((q, idx) => {
            const resp = attempt.responses[q.id];
            const isCorrect = resp?.isCorrect;
            const studentAnswer = resp?.answer || "No response submitted";
            const aiEval = aiEvaluations[q.id];

            return (
              <div
                key={q.id}
                className={`p-5 sm:p-6 rounded-2xl glass-panel border transition-all space-y-4 ${
                  isCorrect ? "border-emerald-500/30" : "border-rose-500/30"
                }`}
              >
                {/* Top Bar */}
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-300">
                      Q{idx + 1}
                    </span>
                    <span
                      className={`text-xs font-bold flex items-center gap-1 ${
                        isCorrect ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+{q.marks} Marks)
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" /> Incorrect (0 Marks)
                        </>
                      )}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-slate-400">Max Marks: {q.marks}</span>
                </div>

                {/* Question Text */}
                <div className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                  {q.text}
                </div>

                {/* Student Answer vs Key */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-white/5 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Your Submitted Response:</div>
                    <div className="font-mono text-white break-words">{studentAnswer}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-emerald-400">Official Correct Key / Answer:</div>
                    <div className="font-mono text-emerald-200 break-words">
                      {q.options
                        ? `${q.correctAnswer?.toUpperCase()} — ${
                            q.options.find((o) => o.id === q.correctAnswer)?.text || ""
                          }`
                        : q.correctAnswer || "See Step Breakdown Below"}
                    </div>
                  </div>
                </div>

                {/* Explanation Box */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 text-xs space-y-1.5">
                  <span className="font-bold text-amber-300 text-[11px] block">
                    💡 Official Board Explanation:
                  </span>
                  <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
                </div>

                {/* AI Evaluation for Subjective answers */}
                {(q.type === "short_answer" || q.type === "long_answer") && (
                  <div className="space-y-3 pt-1">
                    {!aiEval ? (
                      <button
                        onClick={() =>
                          handleRequestAIEvaluation(
                            q.id,
                            q.text,
                            studentAnswer,
                            q.correctAnswer || q.explanation,
                            q.marks
                          )
                        }
                        disabled={evaluatingSubjectiveId === q.id}
                        className="px-4 py-2 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 text-violet-300 text-xs font-semibold flex items-center gap-2 border border-violet-500/30 cursor-pointer"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        {evaluatingSubjectiveId === q.id
                          ? "AI is evaluating marking rubric..."
                          : "Run Detailed AI Rubric Feedback on My Answer"}
                      </button>
                    ) : (
                      <div className="p-4 rounded-xl bg-violet-950/40 border border-violet-500/30 space-y-2 text-xs animate-in fade-in">
                        <div className="flex items-center justify-between font-bold text-cyan-300">
                          <span>🤖 AI Board Rubric Evaluation</span>
                          <span>Score: {aiEval.marksAwarded} / {q.marks} Marks</span>
                        </div>
                        <p className="text-slate-200">{aiEval.feedback}</p>
                        {aiEval.modelImprovement && (
                          <p className="text-amber-300 text-[11px]">
                            <strong>Examiner Tip: </strong>{aiEval.modelImprovement}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default function ExamResultPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const resolvedParams = use(params);
  const examId = resolvedParams.examId;

  return (
    <div className="min-h-screen bg-[#070a14] bg-grid-pattern flex flex-col">
      <Navbar />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center p-12 text-slate-400 text-xs">
            <Sparkles className="w-6 h-6 animate-pulse text-cyan-400 mr-2" />
            Loading exam assessment analysis...
          </div>
        }
      >
        <ExamResultContent examId={examId} />
      </Suspense>
      <Footer />
    </div>
  );
}
