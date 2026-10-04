"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  BookOpen,
  Sparkles,
  Flame,
  Bot,
  Layers,
  ArrowLeft,
  CheckCircle2,
  Bookmark,
  Check,
  Zap,
  HelpCircle,
  Lightbulb,
  Clock,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Target,
  ExternalLink,
  ChevronRight,
  Box,
} from "lucide-react";
import { CHAPTERS, SUBJECTS, FLASHCARDS } from "@/lib/data/mock-db";
import { useAuth } from "@/lib/store/auth-context";
import { useDataStore } from "@/lib/store/data-store";
import { getChapterById } from "@/lib/data/curriculum-registry";
import { getChapterPYQSummary } from "@/lib/data/cbse-10-science-pilot";
import { ChapterPYQSection } from "@/components/content/ChapterPYQSection";

export default function ChapterNotesDetailPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const resolvedParams = use(params);
  const chapterId = resolvedParams.chapterId;
  const { user } = useAuth();
  const { saveNote } = useDataStore();

  // Try to lookup from detailed curriculum registry first, fallback to mock DB
  const detailedChapter = getChapterById(chapterId);
  const mockChapter = CHAPTERS.find((c) => c.id === chapterId) || CHAPTERS[0];

  const title = detailedChapter?.title || mockChapter.title;
  const chapterNumber = detailedChapter?.chapterNumber || mockChapter.number;
  const marksWeightage = detailedChapter?.marksWeightage || mockChapter.marksWeightage;
  const estimatedHours = detailedChapter?.estimatedHours || mockChapter.estimatedHours;
  const overview = detailedChapter?.overview || mockChapter.description;
  const subjectId = detailedChapter?.subjectId || mockChapter.subjectId;

  const subject = SUBJECTS.find((s) => s.id === subjectId) || SUBJECTS[0];
  const pyqSummary = getChapterPYQSummary(detailedChapter?.id || mockChapter.id);

  const [depth, setDepth] = useState<"simple" | "standard" | "detailed">("standard");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiCustomNotes, setAiCustomNotes] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleGenerateAINotes = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch("/api/generate-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterTitle: title,
          subjectName: subject.name,
          depth,
          board: user?.boardId || "cbse",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiCustomNotes(data.content);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSaveNote = () => {
    saveNote({
      studentId: user?.id || "demo-student-001",
      title: `${title} (${depth.toUpperCase()} Notes)`,
      subjectId: subject.id,
      chapterId: detailedChapter?.id || mockChapter.id,
      content: aiCustomNotes || overview || "",
      noteType: "ai_generated",
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#070a14] bg-grid-pattern flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Back Link */}
        <Link
          href="/notes"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Chapters
        </Link>

        {/* HERO BANNER */}
        <div className="rounded-2xl glass-panel-glow p-6 sm:p-8 border border-white/10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-violet-500/20 text-violet-300">
                  Chapter {chapterNumber.toString().padStart(2, "0")}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {subject.name} • Class {subject.classLevel} ({user?.boardId?.toUpperCase() || "CBSE"})
                </span>
                {detailedChapter?.isComplete && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> Syllabus Verified
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white">{title}</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-white/10 text-center">
                <div className="text-lg font-black text-amber-400 font-mono">
                  ~{marksWeightage} Marks
                </div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Weightage</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-white/10 text-center">
                <div className="text-lg font-black text-cyan-400 font-mono">
                  {estimatedHours}h
                </div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Study Time</div>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl font-sans">
            {overview}
          </p>

          {/* 3D INTERACTIVE LINK IF AVAILABLE */}
          {detailedChapter?.has3DModel && detailedChapter.linked3DRoute && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-violet-900/40 via-cyan-950/40 to-slate-900 border border-cyan-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-cyan-500/20 text-cyan-300">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    Interactive 3D Lab World Available
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Explore cellular structures, organs, and interactive spatial models for this chapter.
                  </p>
                </div>
              </div>
              <Link
                href={detailedChapter.linked3DRoute}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all shadow-md shadow-cyan-500/20"
              >
                Launch 3D Lab <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Depth Switcher & AI Generator Trigger */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">Explanation Depth:</span>
              {(["simple", "standard", "detailed"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDepth(d)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                    depth === d
                      ? "bg-violet-600 text-white shadow-md shadow-violet-500/30"
                      : "bg-slate-900/60 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerateAINotes}
                disabled={isGeneratingAI}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-violet-500/20 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                {isGeneratingAI ? "Generating AI Notes..." : "Regenerate with AI Tutor"}
              </button>

              <button
                onClick={handleSaveNote}
                className="px-3.5 py-2 rounded-xl glass-panel text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1 border border-white/10"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Saved!
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5" /> Save Note
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* AI GENERATED DEEP NOTES DISPLAY (IF TRIGGERED) */}
        {aiCustomNotes && (
          <div className="rounded-2xl p-6 bg-gradient-to-b from-violet-950/40 to-slate-950 border border-violet-500/30 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-2 font-mono">
                <Sparkles className="w-4 h-4" /> [AI-GENERATED STUDY EXPLANATION - GROUNDED IN CBSE/NCERT OFFICIAL SYLLABUS]
              </span>
              <span className="text-[10px] text-slate-400">Strict Provenance Protected</span>
            </div>
            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
              {aiCustomNotes}
            </div>
          </div>
        )}

        {/* LEARNING OBJECTIVES & SYLLABUS TOPICS */}
        {detailedChapter?.learningObjectives && (
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" /> Official Learning Objectives
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {detailedChapter.learningObjectives.map((obj, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-white/5 text-xs text-slate-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CORE CHAPTER CONTENTS */}
        <div className="space-y-8">
          {/* 1. KEY DEFINITIONS */}
          {(detailedChapter?.definitions || mockChapter.keyDefinitions) && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                Key Definitions &amp; Exam Terms
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(detailedChapter?.definitions || mockChapter.keyDefinitions || []).map(
                  (def: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl glass-panel space-y-1.5 border border-white/10"
                    >
                      <h4 className="text-xs font-bold text-cyan-300">{def.term}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{def.definition}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* 2. FORMULAS & CHEMICAL EQUATIONS */}
          {(detailedChapter?.formulas || mockChapter.keyFormulas) && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                Essential Formulas &amp; Equations Sheet
              </h3>
              <div className="p-5 rounded-2xl glass-panel border border-amber-500/30 space-y-3">
                {detailedChapter?.formulas ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {detailedChapter.formulas.map((form) => (
                      <div
                        key={form.id}
                        className="p-4 rounded-xl bg-slate-950/80 border border-white/5 space-y-2"
                      >
                        <div className="text-xs font-bold text-amber-300">{form.name}</div>
                        <div className="text-xs font-mono p-2 rounded bg-amber-950/30 text-amber-200 border border-amber-500/20">
                          {form.formulaLatex}
                        </div>
                        <p className="text-[11px] text-slate-400">{form.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs text-amber-200">
                    {mockChapter.keyFormulas?.map((formula, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-950/80 border border-white/5 flex items-center gap-2"
                      >
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span>{formula}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. COMMON MISCONCEPTIONS & PITFALLS (Prompt Section 13 & 14) */}
          {detailedChapter?.misconceptions && detailedChapter.misconceptions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Common Student Mistakes &amp; Misconceptions
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {detailedChapter.misconceptions.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 sm:p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold font-mono">
                        COMMON TRAP
                      </span>
                      <h4 className="text-xs font-bold text-white font-sans">{m.misconception}</h4>
                    </div>
                    <div className="text-xs text-emerald-300 bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-500/20">
                      <strong>Scientific Fact:</strong> {m.scientificFact}
                    </div>
                    <p className="text-[11px] text-slate-400 italic">
                      Sample Board Question Trap: {m.sampleQuestionTrap}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. EXAM STRATEGY & EXAMINER TIPS */}
          {detailedChapter?.examTips && detailedChapter.examTips.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-violet-400" />
                Examiner Tips &amp; Scoring Strategy
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {detailedChapter.examTips.map((tip) => (
                  <div
                    key={tip.id}
                    className="p-4 rounded-xl glass-panel border border-violet-500/30 space-y-1.5"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-violet-300">
                      {tip.category.replace("_", " ")}
                    </span>
                    <h5 className="text-xs font-bold text-white">{tip.title}</h5>
                    <p className="text-xs text-slate-300">{tip.tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. PREVIOUS-YEAR QUESTIONS SECTION ("Questions Asked Before") */}
          <ChapterPYQSection
            chapterTitle={title}
            boardName={user?.boardId || "CBSE"}
            totalQuestionsFound={pyqSummary.totalQuestionsFound || 15}
            yearsSpan={pyqSummary.yearsSpan}
            frequencyStats={pyqSummary.frequencyStats}
            questions={pyqSummary.questions}
          />

          {/* BOTTOM QUICK ACTIONS */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-950/60 to-cyan-950/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">Ready to test your knowledge?</h4>
              <p className="text-xs text-slate-400">
                Take a 15-minute diagnostic quiz or ask the AI tutor for step-by-step problem sets.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/tutor?chapter=${encodeURIComponent(title)}`}
                className="px-4 py-2.5 rounded-xl glass-panel hover:bg-white/10 text-cyan-300 font-semibold text-xs flex items-center gap-1.5 border border-cyan-500/30"
              >
                <Bot className="w-3.5 h-3.5" /> AI Tutor Chat
              </Link>
              <Link
                href={`/exams?chapterId=${detailedChapter?.id || mockChapter.id}`}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-violet-600/30"
              >
                <Clock className="w-3.5 h-3.5" /> Start Chapter Test <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
