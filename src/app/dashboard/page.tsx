"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Sparkles,
  Bot,
  FileText,
  Clock,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Bookmark,
  ArrowRight,
  Flame,
  Target,
  AlertCircle,
  Zap,
  Play,
  RotateCcw,
  Compass,
  Calendar,
  Award,
  Layers,
  Dna,
} from "lucide-react";
import { useAuth } from "@/lib/store/auth-context";
import { useDataStore } from "@/lib/store/data-store";
import { SUBJECTS } from "@/lib/data/mock-db";
import { getDaysUntil, formatDate } from "@/lib/utils";
import { LearningUniversePlanet } from "@/components/3d/LearningUniversePlanet";

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const {
    attempts,
    bookmarks,
    allPapers,
    tasks,
    gamificationState,
    savedRevisions,
    dailyMissions,
    toggleTaskCompleted,
    getSubjectProgressList,
  } = useDataStore();

  const [viewMode, setViewMode] = useState<"3d_cosmos" | "classic">("3d_cosmos");

  const daysLeft = user?.targetExamDate ? getDaysUntil(user.targetExamDate) : 130;
  const userSubjectIds = user?.selectedSubjectIds || ["cbse-10-sci", "cbse-10-math", "cbse-10-sst"];
  const progressList = getSubjectProgressList(userSubjectIds);

  const bookmarkedPapers = allPapers.filter((p) => bookmarks.includes(p.id));
  const recentAttempts = attempts.slice(0, 3);
  const todaysTasks = tasks.slice(0, 3);
  const activeMissions = dailyMissions.slice(0, 2);
  const dueRevisions = savedRevisions.slice(0, 2);

  return (
    <div className="min-h-screen bg-[#070a14] bg-grid-pattern flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 pb-28 lg:pb-8">
        {/* TOP WELCOME & GOAL STRIP */}
        <div className="rounded-3xl glass-panel-glow p-5 sm:p-8 border border-white/10 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  Target: Class {user?.classLevel || 10} • {user?.boardId?.toUpperCase() || "CBSE"} Board
                </span>
                <Link
                  href="/trophies"
                  className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1"
                >
                  <Award className="w-3 h-3" /> Level {gamificationState.currentLevel}: {gamificationState.levelTitle}
                </Link>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white">
                Namaste, <span className="text-gradient-primary">{user?.fullName || "Student"}</span>!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Welcome to your 3D learning command center. Let&apos;s conquer today&apos;s study goals!
              </p>
            </div>

            {/* Quick Stats Badges */}
            <div className="grid grid-cols-3 sm:flex items-center gap-2.5 sm:gap-4 w-full md:w-auto">
              {/* Exam Countdown */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-center min-w-0 sm:min-w-[100px]">
                <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">{daysLeft}</div>
                <div className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400">Days Left</div>
              </div>

              {/* Daily Streak */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/90 border border-rose-500/30 text-center min-w-0 sm:min-w-[100px]">
                <div className="text-xl sm:text-2xl font-black text-rose-400 font-mono flex items-center justify-center gap-1">
                  <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />
                  {user?.streakDays || 7}
                </div>
                <div className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400">Day Streak</div>
              </div>

              {/* Total XP */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-center min-w-0 sm:min-w-[100px]">
                <div className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">{gamificationState.currentXp}</div>
                <div className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400">Total XP</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3D COSMOS VIEW VS CLASSIC TOGGLE BAR */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("3d_cosmos")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === "3d_cosmos"
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-500/25"
                  : "glass-panel text-slate-400 hover:text-white"
              }`}
            >
              🌌 3D Learning Cosmos
            </button>
            <button
              onClick={() => setViewMode("classic")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === "classic"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                  : "glass-panel text-slate-400 hover:text-white"
              }`}
            >
              📊 Classic Subject Matrix
            </button>
          </div>

          <Link
            href="/worlds"
            className="text-xs font-semibold text-cyan-300 hover:underline flex items-center gap-1"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" /> Open 3D Subject Worlds →
          </Link>
        </div>

        {/* 3D COSMOS CENTRAL SPOTLIGHT (IF 3D MODE ACTIVE) */}
        {viewMode === "3d_cosmos" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in">
            {/* 3D Planet Interactive Canvas (7 cols) */}
            <div className="lg:col-span-7 h-[360px] rounded-3xl glass-panel-glow border border-white/15 p-2 shadow-2xl overflow-hidden relative">
              <LearningUniversePlanet size={360} badgeText="Syllabus Mastery Orbit" />
            </div>

            {/* Today's Adaptive Plan Quick Card (5 cols) */}
            <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-white/10 space-y-4 flex flex-col justify-between h-[360px]">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-400" /> Today&apos;s Adaptive AI Plan
                  </h3>
                  <Link href="/planner" className="text-[11px] text-cyan-400 font-semibold hover:underline">
                    View Full Plan →
                  </Link>
                </div>

                <div className="space-y-2.5 pt-3">
                  {todaysTasks.map((t) => (
                    <div
                      key={t.id}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                        t.isCompleted
                          ? "bg-emerald-950/20 border-emerald-500/30 text-slate-400 line-through"
                          : "bg-slate-900/60 border-white/5 text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => toggleTaskCompleted(t.id)}
                          className={`w-4 h-4 rounded flex items-center justify-center border ${
                            t.isCompleted ? "bg-emerald-500 border-emerald-400 text-white" : "border-white/20"
                          }`}
                        >
                          {t.isCompleted && <CheckCircle2 className="w-3 h-3" />}
                        </button>
                        <span className="font-medium truncate max-w-[200px]">{t.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{t.estimatedMinutes}m</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-white/5 text-[11px] text-amber-300">
                ✨ Completing today&apos;s tasks advances your streak &amp; awards +150 XP!
              </div>
            </div>
          </div>
        )}

        {/* QUICK ACTION TILES */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <Link
            href="/learn/biology"
            className="p-4 rounded-2xl glass-card border border-emerald-500/40 hover:border-emerald-400 flex flex-col justify-between group bg-emerald-950/20 col-span-2 sm:col-span-1 shadow-lg shadow-emerald-950/40"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 text-emerald-300 flex items-center justify-center group-hover:scale-110 transition-transform border border-emerald-400/30">
              <Dna className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span className="flex items-center gap-1">3D Biology Lab <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/30 text-emerald-300 font-mono">NEW</span></span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Anatomy, Heart &amp; Cells 3D</p>
            </div>
          </Link>

          <Link
            href="/worlds"
            className="p-4 rounded-2xl glass-card border border-amber-500/30 hover:border-amber-400 flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>3D Subject Worlds</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Interactive molecular &amp; physics</p>
            </div>
          </Link>

          <Link
            href="/tutor"
            className="p-4 rounded-2xl glass-card border border-violet-500/30 hover:border-violet-500 flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>AI Companion</span>
                <ArrowRight className="w-3.5 h-3.5 text-violet-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">3D Avatar + step-by-step solver</p>
            </div>
          </Link>

          <Link
            href="/exams"
            className="p-4 rounded-2xl glass-card border border-cyan-500/30 hover:border-cyan-500 flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>Take Mock Exam</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Timed tests with AI evaluation</p>
            </div>
          </Link>

          <Link
            href="/trophies"
            className="p-4 rounded-2xl glass-card border border-amber-500/30 hover:border-amber-500 flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>3D Trophy Room</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{gamificationState.totalTrophiesUnlocked} Trophies Unlocked</p>
            </div>
          </Link>
        </div>

        {/* TWO-COLUMN SUBJECT PROGRESS & RECENT TESTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Subject Syllabus Mastery */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Enrolled Subjects &amp; Syllabus Progress
              </h2>
              <Link href="/syllabus" className="text-xs text-cyan-400 hover:underline">
                View Full Syllabus Breakdown →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {progressList.map((prog) => (
                <div key={prog.subjectId} className="p-5 rounded-2xl glass-panel space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{prog.subjectName}</span>
                    <span className="text-xs font-bold text-cyan-400">{prog.percentage}%</span>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-violet-500 to-cyan-400 h-2 rounded-full transition-all"
                      style={{ width: `${Math.max(10, prog.percentage)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{prog.completedChapters} of {prog.totalChapters} Chapters Mastered</span>
                    <span className="text-emerald-400 font-semibold">Avg: {prog.averageScore}%</span>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <Link
                      href="/worlds"
                      className="text-[11px] text-amber-300 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Compass className="w-3 h-3" /> 3D Lab
                    </Link>
                    <Link
                      href={`/exams?subject=${prog.subjectId}`}
                      className="text-[11px] text-cyan-400 font-semibold hover:underline flex items-center gap-1"
                    >
                      Practice Test <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Mock Exam Attempts */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  Recent Mock Examination Results
                </h2>
                <Link href="/performance" className="text-xs text-cyan-400 hover:underline">
                  All Scores &amp; Accuracy Charts →
                </Link>
              </div>

              {recentAttempts.length > 0 ? (
                <div className="space-y-3">
                  {recentAttempts.map((att) => (
                    <div
                      key={att.id}
                      className="p-4 rounded-xl glass-panel flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/10"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{att.examTitle}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                            {att.percentage}% Score
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Score: {att.score}/{att.totalMarks} Marks • Completed: {formatDate(att.startedAt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/exams/${att.examId}/result?attemptId=${att.id}`}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-slate-200 font-semibold transition-colors"
                        >
                          Review Analysis
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-xl glass-panel text-center space-y-3">
                  <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-400">No mock tests completed yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Col: 3D Universe Missions, Revisions & Bookmarks */}
          <div className="space-y-6">
            {/* Daily 3D Missions Card */}
            <div className="p-5 rounded-2xl glass-panel-glow border border-amber-500/30 space-y-3 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-amber-400" /> Daily 3D Missions
                </h3>
                <Link href="/learn/universe" className="text-[10px] text-amber-400 font-semibold hover:underline">
                  All Quests →
                </Link>
              </div>

              <div className="space-y-2">
                {activeMissions.map((m) => (
                  <div key={m.id} className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200 truncate max-w-[160px]">{m.title}</span>
                      <span className="text-[10px] font-mono text-amber-400">+{m.xpReward} XP</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{m.targetTopic}</span>
                      <Link href={m.actionUrl} className="text-cyan-400 hover:underline">
                        Start →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Spaced Revisions Due Card */}
            {dueRevisions.length > 0 && (
              <div className="p-5 rounded-2xl glass-panel border border-emerald-500/30 space-y-3 shadow-xl">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <h3 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5 text-emerald-400" /> 3D Revisions Due
                  </h3>
                  <Link href="/learn/universe" className="text-[10px] text-emerald-400 font-semibold hover:underline">
                    My Revisions →
                  </Link>
                </div>

                <div className="space-y-2">
                  {dueRevisions.map((rev) => (
                    <div key={rev.id} className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">{rev.objectName}</span>
                        <span className="text-[10px] font-mono text-slate-400">{rev.intervalDays}d interval</span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{rev.formulaOrSummary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Saved Question Papers */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-violet-400" />
                  Saved Question Papers
                </h2>
                <Link href="/papers" className="text-xs text-cyan-400 hover:underline">
                  Browse All →
                </Link>
              </div>

              {bookmarkedPapers.length > 0 ? (
                <div className="space-y-2.5">
                  {bookmarkedPapers.map((paper) => (
                    <div key={paper.id} className="p-3.5 rounded-2xl glass-panel space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                          {paper.year} • {paper.setNumber || "Main"}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold">✓ Verified</span>
                      </div>
                      <h4 className="text-xs font-semibold text-white truncate">{paper.title}</h4>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-400">{paper.totalMarks} Marks</span>
                        <Link
                          href={`/papers?paperId=${paper.id}`}
                          className="text-[11px] text-violet-400 hover:underline font-semibold"
                        >
                          Open Paper →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No bookmarked papers yet.</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
