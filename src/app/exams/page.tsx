"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Clock,
  Sparkles,
  Award,
  Play,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  BookOpen,
  Layers,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/lib/store/auth-context";
import { useDataStore } from "@/lib/store/data-store";
import { MOCK_EXAMS, SUBJECTS } from "@/lib/data/mock-db";
import { formatDate } from "@/lib/utils";

export default function MockExamsCatalogPage() {
  const { user } = useAuth();
  const { allExams, attempts } = useDataStore();
  const [filterType, setFilterType] = useState<"all" | "full" | "chapter">("all");

  const filteredExams = allExams.filter((exam) => {
    if (filterType === "full") return exam.isFullLength;
    if (filterType === "chapter") return !exam.isFullLength;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#070a14] bg-grid-pattern flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 pb-28 lg:pb-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            Official Pattern Mock Examination Engine
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            Timed Mock Exams &amp; Chapter Tests
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Simulate real board examination conditions with countdown timers, question palettes, auto-evaluation, and AI rubric grading.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setFilterType("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap touch-target ${
              filterType === "all"
                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                : "glass-panel text-slate-400 hover:text-white"
            }`}
          >
            All Tests ({allExams.length})
          </button>
          <button
            onClick={() => setFilterType("full")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === "full"
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/25"
                : "glass-panel text-slate-400 hover:text-white"
            }`}
          >
            🎯 Full-Length Grand Mocks
          </button>
          <button
            onClick={() => setFilterType("chapter")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === "chapter"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                : "glass-panel text-slate-400 hover:text-white"
            }`}
          >
            ⚡ Chapter Diagnostics &amp; Unit Quizzes
          </button>
        </div>

        {/* EXAM CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredExams.map((exam) => {
            const previousAttempt = attempts.find((a) => a.examId === exam.id);
            const subject = SUBJECTS.find((s) => s.id === exam.subjectId);

            return (
              <div
                key={exam.id}
                className="p-6 rounded-2xl glass-panel hover:border-violet-500/50 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-violet-500/20 text-violet-300 border border-violet-500/30">
                        {exam.boardId.toUpperCase()} • Class {exam.classLevel}
                      </span>
                      {exam.isFullLength && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                          Full Grand Mock
                        </span>
                      )}
                    </div>

                    {previousAttempt && (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Score: {previousAttempt.percentage}%
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white leading-snug">{exam.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{exam.description}</p>

                  {/* Test Specs */}
                  <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-slate-900 border border-white/5">
                      <div className="font-bold text-cyan-400">{exam.durationMinutes} Mins</div>
                      <div className="text-[10px] text-slate-500">Duration</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-white/5">
                      <div className="font-bold text-amber-400">{exam.totalMarks} Marks</div>
                      <div className="text-[10px] text-slate-500">Total Marks</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-white/5">
                      <div className="font-bold text-violet-400">{exam.questions.length} Questions</div>
                      <div className="text-[10px] text-slate-500">Questions</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {previousAttempt ? `Last taken: ${formatDate(previousAttempt.startedAt)}` : "Not attempted yet"}
                  </span>

                  <div className="flex items-center gap-2">
                    {previousAttempt && (
                      <Link
                        href={`/exams/${exam.id}/result?attemptId=${previousAttempt.id}`}
                        className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
                      >
                        Review Score
                      </Link>
                    )}
                    <Link
                      href={`/exams/${exam.id}`}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-violet-600/30 flex items-center gap-1.5 transition-all"
                    >
                      <Play className="w-3.5 h-3.5" />
                      {previousAttempt ? "Retake Exam" : "Start Test Now"}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
