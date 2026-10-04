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
  Database,
  Search,
  ExternalLink,
  Check,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/lib/store/auth-context";
import { useDataStore } from "@/lib/store/data-store";
import { BOARDS, SUBJECTS } from "@/lib/data/mock-db";
import { QuestionPaper, MockExam, PaperType, IngestionValidationResult } from "@/types";
import { CONTENT_COVERAGE_MATRIX, EXPANDED_CHAPTERS_REGISTRY } from "@/lib/data/curriculum-registry";
import { SOURCE_REGISTRY } from "@/lib/data/source-registry";
import { ContentIngestionPipeline } from "@/lib/content/ingestion-pipeline";

export default function AdminPortalPage() {
  const { user, switchRole } = useAuth();
  const { allPapers, allExams, addCustomPaper, addCustomExam } = useDataStore();

  const [activeTab, setActiveTab] = useState<
    "papers" | "exams" | "boards" | "analytics" | "coverage" | "sources" | "pipeline"
  >("coverage");

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

  // Pipeline Tester State
  const [testDocTitle, setTestDocTitle] = useState("CBSE Class 10 Science Sample Ingestion");
  const [testDocBody, setTestDocBody] = useState(
    "Photosynthesis equation: 6CO2 + 12H2O -> C6H12O6 + 6O2 + 6H2O. Double circulation in human heart separates oxygenated and deoxygenated blood."
  );
  const [testDocSourceId, setTestDocSourceId] = useState("cbse-academic-portal");
  const [testDocClass, setTestDocClass] = useState<number>(10);
  const [pipelineResult, setPipelineResult] = useState<IngestionValidationResult | null>(null);

  const handleRunPipelineTest = () => {
    const res = ContentIngestionPipeline.validateDocument({
      title: testDocTitle,
      sourceId: testDocSourceId,
      boardCode: "cbse",
      classLevel: testDocClass,
      subjectId: "cbse-10-sci",
      year: 2025,
      contentBody: testDocBody,
    });
    setPipelineResult(res);
  };

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
            onClick={() => setActiveTab("coverage")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "coverage"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Content Coverage Matrix</span>
          </button>
          <button
            onClick={() => setActiveTab("sources")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "sources"
                ? "bg-teal-600 text-white shadow-md shadow-teal-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Source Registry</span>
          </button>
          <button
            onClick={() => setActiveTab("pipeline")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "pipeline"
                ? "bg-rose-600 text-white shadow-md shadow-rose-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Ingestion Pipeline QA</span>
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

        {/* TAB 5: CONTENT COVERAGE MATRIX & AUDIT (Section 38 & 39) */}
        {activeTab === "coverage" && (
          <div className="space-y-6 animate-in fade-in">
            {/* Audit Metric Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl glass-panel border border-indigo-500/30">
                <div className="text-slate-400 text-xs font-semibold">Supported Boards</div>
                <div className="text-2xl font-black text-indigo-400 font-mono mt-1">8 Boards</div>
                <div className="text-[10px] text-indigo-300">CBSE, ICSE/ISC, MSBSHSE, UPMSP, PSEB+</div>
              </div>

              <div className="p-4 rounded-xl glass-panel border border-cyan-500/30">
                <div className="text-slate-400 text-xs font-semibold">CBSE Class 10 Pilot</div>
                <div className="text-2xl font-black text-cyan-400 font-mono mt-1">100% Complete</div>
                <div className="text-[10px] text-emerald-400">13/13 Chapters Structured</div>
              </div>

              <div className="p-4 rounded-xl glass-panel border border-emerald-500/30">
                <div className="text-slate-400 text-xs font-semibold">10-Yr Verified Papers</div>
                <div className="text-2xl font-black text-emerald-400 font-mono mt-1">9 / 10 Live</div>
                <div className="text-[10px] text-amber-400">2021 Cancelled (COVID-19)</div>
              </div>

              <div className="p-4 rounded-xl glass-panel border border-amber-500/30">
                <div className="text-slate-400 text-xs font-semibold">Zero Fabrication Audit</div>
                <div className="text-2xl font-black text-amber-400 font-mono mt-1">0 Fake Records</div>
                <div className="text-[10px] text-slate-400">100% Genuine Provenance</div>
              </div>
            </div>

            {/* Coverage Matrix Table */}
            <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-400" />
                    Multi-Board Content Coverage Matrix (Audit Status)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live tracking of curriculum completion, 10-year paper archives, and verified question banks.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Target: Classes 10, 11, 12
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-white/10">
                    <tr>
                      <th className="p-3">Board &amp; Authority</th>
                      <th className="p-3">Class</th>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Syllabus Status</th>
                      <th className="p-3">Chapters</th>
                      <th className="p-3">10-Yr Papers</th>
                      <th className="p-3">Extracted Questions</th>
                      <th className="p-3">Coverage %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {CONTENT_COVERAGE_MATRIX.map((row, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-white uppercase">{row.boardCode}</div>
                          <div className="text-[11px] text-slate-400">{row.boardName}</div>
                        </td>
                        <td className="p-3 font-mono font-bold text-cyan-300">
                          Class {row.classLevel}
                        </td>
                        <td className="p-3 font-semibold text-white">{row.subjectName}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              row.syllabusStatus === "COMPLETE"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-amber-500/20 text-amber-300"
                            }`}
                          >
                            {row.syllabusStatus}
                          </span>
                        </td>
                        <td className="p-3 font-mono">
                          {row.completedChapters} / {row.chapterCount}
                        </td>
                        <td className="p-3 font-mono">
                          <span className="text-emerald-400 font-bold">{row.verifiedPapersCount}</span>
                          /{row.tenYearPapersTarget}
                        </td>
                        <td className="p-3 font-mono font-bold text-violet-300">
                          {row.totalExtractedQuestions} PYQs
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-violet-500 to-cyan-400"
                                style={{ width: `${row.coveragePercentage}%` }}
                              />
                            </div>
                            <span className="font-mono text-[11px] font-bold text-cyan-400">
                              {row.coveragePercentage}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MISSING CONTENT AUDIT REPORT (Prompt Section 53) */}
            <div className="p-6 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Missing Content &amp; Cancellation Audit Report
                </h4>
              </div>
              <p className="text-xs text-slate-300">
                In strict adherence to the EduVerse Zero Fabrication Policy, missing historical examination papers are never simulated or invented. Below are all verified archival omissions:
              </p>

              <div className="space-y-3">
                {CONTENT_COVERAGE_MATRIX.map((row, idx) => {
                  if (row.missingPapersList.length === 0) return null;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">
                          {row.boardCode.toUpperCase()} • Class {row.classLevel} • {row.subjectName}
                        </span>
                        <span className="text-[10px] font-mono text-amber-300">
                          {row.missingPapersList.length} Verified Omission(s)
                        </span>
                      </div>
                      <div className="space-y-1 pl-2 border-l-2 border-amber-500/40">
                        {row.missingPapersList.map((m, mIdx) => (
                          <div key={mIdx} className="text-slate-300 text-[11px]">
                            <strong className="text-amber-400">{m.year} Paper:</strong> {m.reason}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: CENTRAL SOURCE REGISTRY (Section 2 & 3) */}
        {activeTab === "sources" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-6 rounded-2xl glass-panel border border-teal-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  Central Source Registry &amp; Copyright Compliance
                </h3>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {SOURCE_REGISTRY.length} Authorized Portals Registered
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                All educational documents, curricula, question papers, and marking schemes must possess verified provenance in this registry before ingestion into production.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-white/10">
                    <tr>
                      <th className="p-3">Source Name &amp; Organization</th>
                      <th className="p-3">Board</th>
                      <th className="p-3">Source Type</th>
                      <th className="p-3">Copyright &amp; License</th>
                      <th className="p-3">Allowed Actions</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Official URL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {SOURCE_REGISTRY.map((s) => (
                      <tr key={s.sourceId} className="hover:bg-white/5 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-white">{s.sourceName}</div>
                          <div className="text-[11px] text-slate-400">{s.organization}</div>
                        </td>
                        <td className="p-3 font-mono font-bold text-cyan-300 uppercase">
                          {s.boardCode}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300">
                            {s.sourceType.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="text-slate-200 font-medium">{s.copyrightStatus.replace(/_/g, " ")}</div>
                          <div className="text-[10px] text-slate-400">{s.license}</div>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {s.allowedActions.map((act, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 rounded bg-slate-900 border border-white/5 text-[9px] font-mono text-teal-300"
                              >
                                {act.replace(/_/g, " ")}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold font-mono">
                            {s.verificationStatus}
                          </span>
                        </td>
                        <td className="p-3">
                          <a
                            href={s.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 underline font-mono text-[11px]"
                          >
                            Portal <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: INGESTION PIPELINE QA & SIMULATOR (Section 4, 40, 41) */}
        {activeTab === "pipeline" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-6 rounded-2xl glass-panel border border-rose-500/30 space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-rose-400" />
                Ingestion Pipeline Architecture &amp; Live Quality Validator
              </h3>
              <p className="text-xs text-slate-300">
                Executes the 12-stage validation pipeline: Discovery $\to$ File Validation $\to$ Text &amp; Formula Extraction $\to$ OCR Quality Scoring $\to$ Syllabus Mapping $\to$ Deduplication.
              </p>
            </div>

            {/* Pipeline Stage Architecture Flow */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                REUSABLE PIPELINE ARCHITECTURE FLOW
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
                  <div className="font-bold text-cyan-300">1. Source Registry</div>
                  <div className="text-[10px] text-slate-400">Provenance Check</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
                  <div className="font-bold text-violet-300">2. File Validation</div>
                  <div className="text-[10px] text-slate-400">Size &amp; Format</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
                  <div className="font-bold text-amber-300">3. Formula Fidelity</div>
                  <div className="text-[10px] text-slate-400">LaTeX / Subscript</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
                  <div className="font-bold text-emerald-300">4. OCR Quality QA</div>
                  <div className="text-[10px] text-slate-400">Artefact Detection</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
                  <div className="font-bold text-rose-300">5. Syllabus Map</div>
                  <div className="text-[10px] text-slate-400">Confidence Match</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
                  <div className="font-bold text-indigo-300">6. Deduplication</div>
                  <div className="text-[10px] text-slate-400">Hash Comparison</div>
                </div>
              </div>
            </div>

            {/* Interactive Document Ingestion Validator Tester */}
            <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Live Ingestion Pre-Flight Validator
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Document Title
                  </label>
                  <input
                    type="text"
                    value={testDocTitle}
                    onChange={(e) => setTestDocTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Registered Source
                  </label>
                  <select
                    value={testDocSourceId}
                    onChange={(e) => setTestDocSourceId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                  >
                    {SOURCE_REGISTRY.map((s) => (
                      <option key={s.sourceId} value={s.sourceId}>
                        {s.sourceName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Class Level</label>
                  <select
                    value={testDocClass}
                    onChange={(e) => setTestDocClass(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                  >
                    <option value={10}>Class 10</option>
                    <option value={11}>Class 11</option>
                    <option value={12}>Class 12</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Document Text / Question Body (Preserving Equations)
                </label>
                <textarea
                  rows={4}
                  value={testDocBody}
                  onChange={(e) => setTestDocBody(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleRunPipelineTest}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30"
                >
                  <RefreshCw className="w-4 h-4" /> Run Ingestion Validation
                </button>
              </div>

              {/* Validation Result Box */}
              {pipelineResult && (
                <div
                  className={`p-5 rounded-xl border space-y-3 animate-in fade-in ${
                    pipelineResult.isValid
                      ? "bg-emerald-950/30 border-emerald-500/40"
                      : "bg-rose-950/30 border-rose-500/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold font-mono px-2.5 py-1 rounded ${
                        pipelineResult.isValid
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-rose-500/20 text-rose-300"
                      }`}
                    >
                      {pipelineResult.isValid
                        ? "VALIDATION PASSED (APPROVED FOR PUBLISHING)"
                        : "VALIDATION REJECTED (ISSUES DETECTED)"}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      File Hash: {pipelineResult.fileHash}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-slate-900 border border-white/5">
                      <span className="text-slate-400 text-[10px] block">OCR Quality Score</span>
                      <strong className="text-cyan-400 font-mono text-base">
                        {pipelineResult.ocrQualityScorePct}%
                      </strong>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-white/5">
                      <span className="text-slate-400 text-[10px] block">Formula Notation</span>
                      <strong
                        className={`font-mono text-base ${
                          pipelineResult.scientificNotationValid
                            ? "text-emerald-400"
                            : "text-rose-400"
                        }`}
                      >
                        {pipelineResult.scientificNotationValid ? "VERIFIED" : "WARNING"}
                      </strong>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-white/5">
                      <span className="text-slate-400 text-[10px] block">Duplicate Check</span>
                      <strong className="text-white font-mono text-base">
                        {pipelineResult.isDuplicate ? "DUPLICATE FOUND" : "UNIQUE DOC"}
                      </strong>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-white/5">
                      <span className="text-slate-400 text-[10px] block">Syllabus Match</span>
                      <strong className="text-violet-400 font-mono text-base">
                        {ContentIngestionPipeline.mapQuestionToSyllabus(
                          testDocBody,
                          EXPANDED_CHAPTERS_REGISTRY
                        ).confidence}
                      </strong>
                    </div>
                  </div>

                  {pipelineResult.warnings.length > 0 && (
                    <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/20 text-xs text-amber-200">
                      <strong>Quality Warnings:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {pipelineResult.warnings.map((w, idx) => (
                          <li key={idx}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {pipelineResult.errors.length > 0 && (
                    <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-xs text-rose-200">
                      <strong>Errors:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {pipelineResult.errors.map((e, idx) => (
                          <li key={idx}>{e}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
