"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Layers,
  BookOpen,
  Sparkles,
  Bot,
  FileText,
  Clock,
  ArrowRight,
  ChevronDown,
  Award,
  BookMarked,
  Flame,
} from "lucide-react";
import { BOARDS, SUBJECTS, CHAPTERS } from "@/lib/data/mock-db";
import { ClassLevel } from "@/types";

export default function SyllabusPage() {
  const [selectedBoardId, setSelectedBoardId] = useState("cbse");
  const [selectedClass, setSelectedClass] = useState<ClassLevel>(10);
  const [selectedSubjectId, setSelectedSubjectId] = useState("cbse-10-sci");
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>("ch-sci10-01");

  const board = BOARDS.find((b) => b.id === selectedBoardId) || BOARDS[0];
  const filteredSubjects = SUBJECTS.filter(
    (s) => s.boardId === selectedBoardId && s.classLevel === selectedClass
  );

  // If filtered subjects don't have selectedSubjectId, default to first available
  const activeSubject =
    filteredSubjects.find((s) => s.id === selectedSubjectId) || filteredSubjects[0] || SUBJECTS[0];

  const chapters = CHAPTERS.filter((c) => c.subjectId === activeSubject.id);

  return (
    <div className="min-h-screen bg-[#070a14] bg-grid-pattern flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold border border-violet-500/30">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Official Curriculum &amp; Blueprint Explorer
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Board Syllabus &amp; Marks Weightage
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Explore Chapter-wise weightage, blueprint distribution, key definitions, and practice questions.
          </p>
        </div>

        {/* Board & Class Selectors */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Boards Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              {BOARDS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setSelectedBoardId(b.id);
                    const newSubs = SUBJECTS.filter((s) => s.boardId === b.id && s.classLevel === selectedClass);
                    if (newSubs.length > 0) setSelectedSubjectId(newSubs[0].id);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    selectedBoardId === b.id
                      ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-500/20"
                      : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-white/5 border border-white/5"
                  }`}
                >
                  {b.name} ({b.shortName})
                </button>
              ))}
            </div>

            {/* Class Level Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Class:</span>
              {([10, 11, 12] as ClassLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    setSelectedClass(lvl);
                    const newSubs = SUBJECTS.filter((s) => s.boardId === selectedBoardId && s.classLevel === lvl);
                    if (newSubs.length > 0) setSelectedSubjectId(newSubs[0].id);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedClass === lvl
                      ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                      : "bg-slate-900/80 text-slate-400 hover:bg-white/10 border border-white/10"
                  }`}
                >
                  Class {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Pills */}
          <div className="pt-3 border-t border-white/5 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs text-slate-400 font-semibold shrink-0">Subjects:</span>
            {filteredSubjects.length > 0 ? (
              filteredSubjects.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => {
                    setSelectedSubjectId(sub.id);
                    const subChaps = CHAPTERS.filter((c) => c.subjectId === sub.id);
                    if (subChaps.length > 0) setExpandedChapterId(subChaps[0].id);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    activeSubject.id === sub.id
                      ? "bg-violet-600/30 border border-violet-400 text-violet-200"
                      : "bg-slate-900/40 text-slate-400 hover:bg-white/5 border border-white/5"
                  }`}
                >
                  {sub.name}
                </button>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">No specific subjects configured yet for this selection.</span>
            )}
          </div>
        </div>

        {/* ACTIVE SUBJECT OVERVIEW BANNER */}
        {activeSubject && (
          <div className="rounded-2xl glass-card p-6 border border-violet-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-violet-500/20 text-violet-300">
                  Code: {activeSubject.code}
                </span>
                <span className="text-xs text-slate-400">
                  {board.name} • Class {activeSubject.classLevel}
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-white">{activeSubject.name}</h2>
              <p className="text-xs text-slate-300 max-w-2xl">{activeSubject.description}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-white/10 text-center min-w-[90px]">
                <div className="text-lg font-bold text-cyan-400">{activeSubject.theoryMarks}</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Theory</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-white/10 text-center min-w-[90px]">
                <div className="text-lg font-bold text-amber-400">{activeSubject.practicalMarks}</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Internal/Lab</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-white/10 text-center min-w-[90px]">
                <div className="text-lg font-bold text-emerald-400">{activeSubject.totalMarks}</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Marks</div>
              </div>
            </div>
          </div>
        )}

        {/* CHAPTERS BREAKDOWN LIST */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-cyan-400" />
              Syllabus Chapters ({chapters.length > 0 ? chapters.length : "Full Standard Syllabus"})
            </h3>
            <span className="text-xs text-slate-400">Click any chapter to view topics &amp; study actions</span>
          </div>

          {chapters.length > 0 ? (
            <div className="space-y-4">
              {chapters.map((ch) => {
                const isExpanded = expandedChapterId === ch.id;
                return (
                  <div
                    key={ch.id}
                    className={`rounded-2xl glass-panel border transition-all overflow-hidden ${
                      isExpanded ? "border-violet-500/50 bg-[#0c1228]" : "border-white/10"
                    }`}
                  >
                    {/* Chapter Bar */}
                    <div
                      onClick={() => setExpandedChapterId(isExpanded ? null : ch.id)}
                      className="p-5 flex items-center justify-between cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-300 font-bold font-mono text-sm flex items-center justify-center shrink-0">
                          {ch.number.toString().padStart(2, "0")}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm sm:text-base text-white">{ch.title}</h4>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              ~{ch.marksWeightage} Marks
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{ch.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 hidden sm:inline">
                          ⏱ {ch.estimatedHours} hrs
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-400 transition-transform ${
                            isExpanded ? "rotate-180 text-violet-400" : ""
                          }`}
                        />
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="px-5 pb-6 border-t border-white/5 pt-4 space-y-5 animate-in fade-in">
                        {/* Topics List */}
                        <div>
                          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                            Key Topics Aligned with Blueprint:
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {ch.topics.map((top) => (
                              <div
                                key={top.id}
                                className="p-2.5 rounded-lg bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs"
                              >
                                <span className="text-slate-200">{top.title}</span>
                                <span
                                  className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                    top.importance === "high"
                                      ? "bg-rose-500/20 text-rose-300"
                                      : "bg-amber-500/20 text-amber-300"
                                  }`}
                                >
                                  {top.importance} Priority
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Quick Formulas / Definitions if available */}
                        {ch.keyFormulas && (
                          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/5 space-y-2">
                            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                              <Flame className="w-3.5 h-3.5" /> High-Yield Formula Sheet:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-cyan-300">
                              {ch.keyFormulas.map((f, idx) => (
                                <div key={idx} className="p-1.5 rounded bg-slate-900/80 border border-white/5">
                                  {f}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Chapter Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                          <Link
                            href={`/notes/${ch.id}`}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-violet-600/20"
                          >
                            <BookOpen className="w-3.5 h-3.5" /> Read Full Chapter Notes &amp; Mnemonics
                          </Link>

                          <Link
                            href={`/tutor?chapter=${encodeURIComponent(ch.title)}&subject=${encodeURIComponent(
                              activeSubject.name
                            )}`}
                            className="px-4 py-2 rounded-xl glass-panel hover:bg-white/10 text-cyan-300 font-semibold text-xs flex items-center gap-1.5 border border-cyan-500/30"
                          >
                            <Bot className="w-3.5 h-3.5" /> Ask AI Tutor About This Chapter
                          </Link>

                          <Link
                            href={`/exams?chapterId=${ch.id}`}
                            className="px-4 py-2 rounded-xl glass-panel hover:bg-white/10 text-emerald-300 font-semibold text-xs flex items-center gap-1.5 border border-emerald-500/30"
                          >
                            <Clock className="w-3.5 h-3.5" /> Take Chapter Quiz
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-10 rounded-2xl glass-panel text-center space-y-3">
              <Layers className="w-10 h-10 text-slate-500 mx-auto" />
              <h4 className="text-sm font-bold text-white">Full Syllabus Matrix Loaded</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Detailed chapter blueprints for this combination are currently in the active catalog. You can practice with past papers or prompt the AI tutor.
              </p>
              <Link
                href={`/tutor?subject=${encodeURIComponent(activeSubject.name)}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-semibold"
              >
                <Bot className="w-4 h-4" /> Ask AI Tutor for {activeSubject.name} Blueprint
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
