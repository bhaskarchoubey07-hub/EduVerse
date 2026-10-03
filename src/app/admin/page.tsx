"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  ShieldAlert,
  ShieldCheck,
  Plus,
  Layers,
  FileText,
  Clock,
  Users,
  CheckCircle2,
  Upload,
  Bot,
  AlertTriangle,
  Sparkles,
  BarChart2,
  Trash2,
  Edit3,
  Award,
} from "lucide-react";
import { useAuth } from "@/lib/store/auth-context";
import { useDataStore } from "@/lib/store/data-store";
import { BOARDS, SUBJECTS } from "@/lib/data/mock-db";
import { QuestionPaper, MockExam, PaperType } from "@/types";

export default function AdminPortalPage() {
  const { user, switchRole } = useAuth();
  const { allPapers, allExams, addCustomPaper, addCustomExam } = useDataStore();

  const [activeTab, setActiveTab] = useState<"papers" | "exams" | "boards" | "analytics">("papers");

  // Paper Upload Form State
  const [paperTitle, setPaperTitle] = useState("");
  const [paperBoard, setPaperBoard] = useState("cbse");
  const [paperClass, setPaperClass] = useState<10 | 11 | 12>(10);
  const [paperSubject, setPaperSubject] = useState("cbse-10-sci");
  const [paperYear, setPaperYear] = useState(2025);
  const [paperType, setPaperType] = useState<PaperType>("official_board");
  const [paperSet, setPaperSet] = useState("Set 1");
  const [paperMarks, setPaperMarks] = useState(80);
  const [paperDuration, setPaperDuration] = useState(180);
  const [paperVerified, setPaperVerified] = useState(true);
  const [paperUploadSuccess, setPaperUploadSuccess] = useState(false);

  // Mock Exam Create State
  const [examTitle, setExamTitle] = useState("");
  const [examDuration, setExamDuration] = useState(45);
  const [examMarks, setExamMarks] = useState(30);
  const [examQuestionCount, setExamQuestionCount] = useState(10);
  const [examSuccess, setExamSuccess] = useState(false);

  const handleUploadPaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paperTitle.trim()) return;

    const newPaper: QuestionPaper = {
      id: `admin-pyq-${Date.now()}`,
      title: paperTitle.trim(),
      boardId: paperBoard,
      classLevel: paperClass,
      subjectId: paperSubject,
      year: paperYear,
      paperType,
      setNumber: paperSet,
      totalMarks: paperMarks,
      durationMinutes: paperDuration,
      isVerifiedOfficial: paperVerified,
      verifiedBy: "Admin Academic Officer",
      downloadCount: 1,
      tags: ["Admin Uploaded", "Verified", `${paperYear} Board`],
      yearAvailable: true,
      sections: [],
    };

    addCustomPaper(newPaper);
    setPaperUploadSuccess(true);
    setPaperTitle("");
    setTimeout(() => setPaperUploadSuccess(false), 3000);
  };

  const handleCreateMockExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTitle.trim()) return;

    const newExam: MockExam = {
      id: `custom-exam-${Date.now()}`,
      title: examTitle.trim(),
      subjectId: "cbse-10-sci",
      boardId: "cbse",
      classLevel: 10,
      durationMinutes: examDuration,
      totalMarks: examMarks,
      isFullLength: examDuration >= 90,
      questionCount: examQuestionCount,
      description: "Custom administrator configured mock examination for student diagnostic.",
      instructions: [
        "All questions are compulsory.",
        "Exam is evaluated automatically upon submission or timer expiration.",
      ],
      questions: [
        {
          id: `admin-q-${Date.now()}-1`,
          questionNumber: 1,
          subjectId: "cbse-10-sci",
          type: "mcq",
          text: "What is the unit of electric potential difference?",
          options: [
            { id: "a", label: "A", text: "Ampere" },
            { id: "b", label: "B", text: "Volt", isCorrect: true },
            { id: "c", label: "C", text: "Ohm" },
            { id: "d", label: "D", text: "Joule" },
          ],
          correctAnswer: "b",
          marks: 1,
          explanation: "Potential difference V = W / Q = Joules / Coulomb = Volt.",
          difficulty: "easy",
        },
      ],
    };

    addCustomExam(newExam);
    setExamSuccess(true);
    setExamTitle("");
    setTimeout(() => setExamSuccess(false), 3000);
  };

  // Role Gate
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#070a14] bg-grid-pattern flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full glass-panel-glow rounded-2xl p-8 text-center space-y-4 border border-rose-500/30">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Administrator Access Protected</h2>
            <p className="text-xs text-slate-300">
              You are currently signed in as a <strong className="text-cyan-300">Student</strong>. Only authorized academic administrators can manage boards, syllabus, and verify question papers.
            </p>
            <div className="pt-2">
              <button
                onClick={() => switchRole("admin")}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold text-xs shadow-lg shadow-violet-600/30"
              >
                Switch to Demo Admin Role (1-Click)
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070a14] bg-grid-pattern flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Header */}
        <div className="rounded-2xl glass-panel-glow p-6 sm:p-8 border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Academic Administrator Portal
                </span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Full Authorization Active
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Platform Management &amp; Content Control
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => switchRole("student")}
                className="px-4 py-2 rounded-xl glass-panel text-xs text-slate-300 hover:text-white"
              >
                Switch Back to Student View
              </button>
            </div>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl glass-panel border border-white/10">
            <div className="text-slate-400 text-xs font-semibold">Total PYQ Papers</div>
            <div className="text-2xl font-black text-cyan-400 font-mono mt-1">{allPapers.length}</div>
            <div className="text-[10px] text-emerald-400">10-Year Archive Live</div>
          </div>

          <div className="p-4 rounded-xl glass-panel border border-white/10">
            <div className="text-slate-400 text-xs font-semibold">Active Mock Exams</div>
            <div className="text-2xl font-black text-violet-400 font-mono mt-1">{allExams.length}</div>
            <div className="text-[10px] text-slate-400">Timed Engine Configured</div>
          </div>

          <div className="p-4 rounded-xl glass-panel border border-white/10">
            <div className="text-slate-400 text-xs font-semibold">Supported Boards</div>
            <div className="text-2xl font-black text-amber-400 font-mono mt-1">{BOARDS.length}</div>
            <div className="text-[10px] text-slate-400">CBSE, ICSE, PSEB, States</div>
          </div>

          <div className="p-4 rounded-xl glass-panel border border-white/10">
            <div className="text-slate-400 text-xs font-semibold">AI Quality Audits</div>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-1">100%</div>
            <div className="text-[10px] text-emerald-400">Zero Critical Reports</div>
          </div>
        </div>

        {/* ADMIN SECTION TABS */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2 flex-wrap">
          <button
            onClick={() => setActiveTab("papers")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "papers"
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Upload &amp; Verify Question Papers
          </button>
          <button
            onClick={() => setActiveTab("exams")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "exams"
                ? "bg-violet-600 text-white shadow-md shadow-violet-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Configure Mock Tests
          </button>
          <button
            onClick={() => setActiveTab("boards")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "boards"
                ? "bg-amber-600 text-white shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Manage Boards &amp; Syllabus
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "analytics"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>3D Worlds, Gamification &amp; Feature Flags</span>
          </button>
        </div>

        {/* TAB 1: UPLOAD & VERIFY PAPERS */}
        {activeTab === "papers" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in">
            {/* Upload Form */}
            <div className="lg:col-span-1 glass-panel rounded-2xl p-6 border border-white/10 space-y-4 h-fit">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-cyan-400" /> Upload &amp; Verify New Paper
              </h3>

              {paperUploadSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Paper successfully verified &amp; added to catalog!
                </div>
              )}

              <form onSubmit={handleUploadPaper} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Paper Title</label>
                  <input
                    type="text"
                    required
                    value={paperTitle}
                    onChange={(e) => setPaperTitle(e.target.value)}
                    placeholder="e.g. CBSE Class 10 Science 2026 Model Set 1"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Board</label>
                    <select
                      value={paperBoard}
                      onChange={(e) => setPaperBoard(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-white/10 text-white"
                    >
                      {BOARDS.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.shortName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Class</label>
                    <select
                      value={paperClass}
                      onChange={(e) => setPaperClass(Number(e.target.value) as any)}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-white/10 text-white"
                    >
                      <option value="10">Class 10</option>
                      <option value="11">Class 11</option>
                      <option value="12">Class 12</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Year</label>
                    <input
                      type="number"
                      value={paperYear}
                      onChange={(e) => setPaperYear(Number(e.target.value))}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Set Number</label>
                    <input
                      type="text"
                      value={paperSet}
                      onChange={(e) => setPaperSet(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isVer"
                    checked={paperVerified}
                    onChange={(e) => setPaperVerified(e.target.checked)}
                    className="rounded text-cyan-500"
                  />
                  <label htmlFor="isVer" className="text-slate-300 font-semibold">
                    Mark as Verified Official Board Material
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/25 mt-2 cursor-pointer"
                >
                  Publish &amp; Verify Paper
                </button>
              </form>
            </div>

            {/* Existing Catalog List */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="font-bold text-sm text-white">Verified Papers In Archive ({allPapers.length})</h3>
              <div className="space-y-2.5">
                {allPapers.map((paper) => (
                  <div
                    key={paper.id}
                    className="p-4 rounded-xl glass-panel border border-white/10 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{paper.title}</span>
                        {paper.isVerifiedOfficial && (
                          <span className="text-[10px] font-bold text-emerald-400">✓ Verified Official</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {paper.boardId.toUpperCase()} • Class {paper.classLevel} • {paper.year} • {paper.totalMarks} Marks
                      </p>
                    </div>

                    <span className="text-xs font-mono text-cyan-400 font-semibold">
                      {paper.downloadCount} Downloads
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONFIGURE MOCK TESTS */}
        {activeTab === "exams" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in">
            {/* Create Exam Form */}
            <div className="lg:col-span-1 glass-panel rounded-2xl p-6 border border-white/10 space-y-4 h-fit">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-violet-400" /> Create Mock Examination
              </h3>

              {examSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Mock test published to student portal!
                </div>
              )}

              <form onSubmit={handleCreateMockExam} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Exam Title</label>
                  <input
                    type="text"
                    required
                    value={examTitle}
                    onChange={(e) => setExamTitle(e.target.value)}
                    placeholder="e.g. CBSE Class 10 Science Pre-Board Grand Mock"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-violet-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Duration (Mins)</label>
                    <input
                      type="number"
                      value={examDuration}
                      onChange={(e) => setExamDuration(Number(e.target.value))}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Total Marks</label>
                    <input
                      type="number"
                      value={examMarks}
                      onChange={(e) => setExamMarks(Number(e.target.value))}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-white/10 text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-violet-600/25 mt-2 cursor-pointer"
                >
                  Publish Timed Exam
                </button>
              </form>
            </div>

            {/* Existing Mock Exams */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="font-bold text-sm text-white">Active Tests ({allExams.length})</h3>
              <div className="space-y-2.5">
                {allExams.map((ex) => (
                  <div
                    key={ex.id}
                    className="p-4 rounded-xl glass-panel border border-white/10 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{ex.title}</div>
                      <p className="text-[11px] text-slate-400">
                        {ex.boardId.toUpperCase()} • Class {ex.classLevel} • {ex.durationMinutes} Mins • {ex.totalMarks} Marks
                      </p>
                    </div>

                    <Link
                      href={`/exams/${ex.id}`}
                      className="text-xs text-violet-400 hover:underline font-semibold"
                    >
                      Preview Test →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MANAGE BOARDS & SYLLABUS */}
        {activeTab === "boards" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BOARDS.map((b) => (
                <div key={b.id} className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{b.name}</span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-violet-500/20 text-violet-300">
                      {b.shortName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{b.description}</p>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Classes: {b.availableClasses.join(", ")} • Active Sessions: {b.activeSessions.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: STAGE 2 3D ENGINE, GAMIFICATION & FEATURE FLAGS */}
        {activeTab === "analytics" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Feature Flags */}
              <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" /> Platform Feature Flags &amp; 3D Toggles
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">3D Interactive Subject Worlds (`/worlds`)</div>
                      <div className="text-[11px] text-slate-400">Mathematics, Physics, Chemistry, Biology 3D simulations</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold font-mono text-[10px]">
                      ENABLED
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Adaptive AI Study Planner (`/planner`)</div>
                      <div className="text-[11px] text-slate-400">Dynamic rescheduling and exam-day pacing calculations</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold font-mono text-[10px]">
                      ENABLED
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">3D Trophy Room &amp; Gamification (`/trophies`)</div>
                      <div className="text-[11px] text-slate-400">XP leveling, 3D collectible objects &amp; discipline leaderboard</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold font-mono text-[10px]">
                      ENABLED
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">AI Companion Voice Audio Synthesis</div>
                      <div className="text-[11px] text-slate-400">Web Speech API browser voice readout for explanations</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold font-mono text-[10px]">
                      ENABLED
                    </span>
                  </div>
                </div>
              </div>

              {/* Gamification Rules & Multipliers */}
              <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" /> Gamification XP &amp; Level Rules
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between">
                    <span className="text-slate-300 font-medium">Full Mock Examination Completion</span>
                    <span className="font-mono font-bold text-cyan-400">+150 XP</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between">
                    <span className="text-slate-300 font-medium">Daily Study Task Complete</span>
                    <span className="font-mono font-bold text-emerald-400">+50 XP / task</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between">
                    <span className="text-slate-300 font-medium">7-Day Study Streak Bonus</span>
                    <span className="font-mono font-bold text-amber-400">+300 XP</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between">
                    <span className="text-slate-300 font-medium">Trophy Achievement Unlock</span>
                    <span className="font-mono font-bold text-violet-400">+250 XP / trophy</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between">
                    <span className="text-slate-300 font-medium">Level Progression Scale</span>
                    <span className="font-mono font-bold text-white">400 XP / Level</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
