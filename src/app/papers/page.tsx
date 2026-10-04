"use client";

import React, { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  FileText,
  Search,
  Filter,
  Download,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Eye,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Layers,
  ArrowRight,
  Printer,
  ChevronRight,
  BookOpen,
  Info,
} from "lucide-react";
import { useDataStore } from "@/lib/store/data-store";
import { BOARDS, SUBJECTS } from "@/lib/data/mock-db";
import { QuestionPaper, ClassLevel, PaperType } from "@/types";

export default function PapersLibraryPage() {
  const { allPapers, bookmarks, toggleBookmark } = useDataStore();

  const [selectedBoard, setSelectedBoard] = useState<string>("all");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Paper Viewer Modal State
  const [activePreviewPaper, setActivePreviewPaper] = useState<QuestionPaper | null>(null);
  const [showOfficialSolutions, setShowOfficialSolutions] = useState(true);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState(false);

  // Available Years for filter
  const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016];

  // Filtered papers
  const filteredPapers = useMemo(() => {
    return allPapers.filter((paper) => {
      if (selectedBoard !== "all" && paper.boardId !== selectedBoard) return false;
      if (selectedClass !== "all" && paper.classLevel.toString() !== selectedClass) return false;
      if (selectedSubject !== "all" && paper.subjectId !== selectedSubject) return false;
      if (selectedYear !== "all" && paper.year.toString() !== selectedYear) return false;
      if (selectedType !== "all" && paper.paperType !== selectedType) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = paper.title.toLowerCase().includes(q);
        const matchesTags = paper.tags.some((t) => t.toLowerCase().includes(q));
        const matchesQuestions = paper.sections?.some((s) =>
          s.questions?.some((qu) => qu.text.toLowerCase().includes(q))
        );
        if (!matchesTitle && !matchesTags && !matchesQuestions) return false;
      }

      return true;
    });
  }, [allPapers, selectedBoard, selectedClass, selectedSubject, selectedYear, selectedType, searchQuery]);

  const handleDownload = (paper: QuestionPaper) => {
    // Generate text/markdown export or initiate simulated printable view
    setDownloadSuccessToast(true);
    setTimeout(() => setDownloadSuccessToast(false), 3000);

    const blob = new Blob(
      [
        `==============================================================\n` +
        `EDUVERSE AI - VERIFIED BOARD QUESTION PAPER ARCHIVE\n` +
        `Title: ${paper.title}\n` +
        `Board: ${paper.boardId.toUpperCase()} | Class: ${paper.classLevel} | Year: ${paper.year}\n` +
        `Total Marks: ${paper.totalMarks} | Duration: ${paper.durationMinutes} Mins\n` +
        `Verification Status: ${paper.isVerifiedOfficial ? "VERIFIED OFFICIAL BOARD PAPER" : "MODEL PRACTICE"}\n` +
        `==============================================================\n\n` +
        paper.sections
          ?.map(
            (sec) =>
              `\n--- ${sec.name}: ${sec.title} ---\n` +
              sec.questions
                ?.map(
                  (q) =>
                    `Q${q.questionNumber} [${q.marks} Mark${q.marks > 1 ? "s" : ""}]: ${q.text}\n` +
                    (q.options ? q.options.map((o) => `   (${o.label}) ${o.text}`).join("\n") + "\n" : "") +
                    `Official Solution / Key: ${q.correctAnswer || "See Marking Rubric"}\n` +
                    `Detailed Marking Explanation: ${q.explanation}\n`
                )
                .join("\n")
          )
          .join("\n")
      ],
      { type: "text/plain;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${paper.boardId}-class${paper.classLevel}-${paper.year}-paper.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#070a14] bg-grid-pattern flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 pb-28 lg:pb-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            10-Year Verified Question Paper Library (2016 – 2025)
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Official Previous-Year Question Papers (PYQs)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Browse verified board papers with official marking schemes, blueprints, step-by-step solutions, and in-browser preview.
          </p>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, keyword (e.g. Snell's law, Ohm's law, Trigonometry, 2024 Set 1)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Filter Dropdowns Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            {/* Board Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Board</label>
              <select
                value={selectedBoard}
                onChange={(e) => setSelectedBoard(e.target.value)}
                className="w-full p-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Boards</option>
                {BOARDS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.shortName}
                  </option>
                ))}
              </select>
            </div>

            {/* Class Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full p-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Classes</option>
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>
            </div>

            {/* Subject Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full p-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Subjects</option>
                {SUBJECTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (Cl {s.classLevel})
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full p-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Years (10-Yr)</option>
                {years.map((yr) => (
                  <option key={yr} value={yr.toString()}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Paper Type Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Paper Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Types</option>
                <option value="official_board">Verified Official Board</option>
                <option value="sample_paper">Official Sample Paper</option>
                <option value="compartment">Compartment / Supplementary</option>
              </select>
            </div>
          </div>
        </div>

        {/* PAPERS CATALOG LISTING */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Showing {filteredPapers.length} Available Question Papers
            </span>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Official Board Paper
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> Sample Paper
              </span>
            </div>
          </div>

          {filteredPapers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPapers.map((paper) => {
                const isBookmarked = bookmarks.includes(paper.id);
                return (
                  <div
                    key={paper.id}
                    className="p-5 rounded-2xl glass-panel hover:border-violet-500/50 transition-all space-y-4 flex flex-col justify-between"
                  >
                    {/* Top Row: Year, Code & Verification */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            {paper.year}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/10 text-slate-300">
                            {paper.boardId.toUpperCase()} • Class {paper.classLevel}
                          </span>
                          {paper.setNumber && (
                            <span className="text-[10px] font-mono text-slate-400">
                              {paper.setNumber}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => toggleBookmark(paper.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-white/5 transition-colors"
                          title={isBookmarked ? "Remove bookmark" : "Save paper"}
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="w-4 h-4 text-amber-400 fill-amber-400" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      <h3 className="font-bold text-sm sm:text-base text-white leading-snug">
                        {paper.title}
                      </h3>

                      {/* Verification Badge */}
                      <div className="flex items-center gap-2 text-xs">
                        {paper.isVerifiedOfficial ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Verified Official Board Paper ({paper.verifiedBy || "Academic Archive"})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400">
                            <Info className="w-3.5 h-3.5" />
                            Practice / Sample Paper
                          </span>
                        )}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {paper.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-white/5 text-slate-400 font-mono"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Specs & Action Buttons */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                      <div className="text-[11px] text-slate-400">
                        <span>{paper.totalMarks} Marks</span> • <span>{paper.durationMinutes} Mins</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActivePreviewPaper(paper)}
                          className="px-3.5 py-1.5 rounded-lg bg-violet-600/30 hover:bg-violet-600/50 text-violet-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-violet-400" /> Preview &amp; Solutions
                        </button>
                        <button
                          onClick={() => handleDownload(paper)}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Download printable version"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 rounded-2xl glass-panel text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-500 mx-auto" />
              <h4 className="text-base font-bold text-white">No Papers Found For This Filter</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Try selecting &quot;All Boards&quot; or &quot;All Years&quot; above to view verified question papers across our complete 10-year archive.
              </p>
            </div>
          )}
        </div>

        {/* IN-APP HIGH-FIDELITY PAPER VIEWER MODAL */}
        {activePreviewPaper && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
            <div className="bg-[#0b1022] border border-white/15 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/80">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                      {activePreviewPaper.year} Official Board Paper
                    </span>
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified Blueprint
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{activePreviewPaper.title}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowOfficialSolutions(!showOfficialSolutions)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      showOfficialSolutions
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-white/10 text-slate-300"
                    }`}
                  >
                    {showOfficialSolutions ? "Solutions ON" : "Solutions OFF"}
                  </button>

                  <button
                    onClick={() => handleDownload(activePreviewPaper)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActivePreviewPaper(null)}
                    className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-bold"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Modal Paper Content (Simulated Official Question Paper Format) */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-200">
                {/* General Instructions Box */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 text-xs space-y-2">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
                    General Instructions:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    <li>Time Allowed: {activePreviewPaper.durationMinutes} Minutes. Maximum Marks: {activePreviewPaper.totalMarks}.</li>
                    <li>This question paper contains multiple sections. All questions are compulsory.</li>
                    <li>Section A comprises objective questions of 1 mark each.</li>
                    <li>Use of calculators is not permitted in standard board examinations.</li>
                  </ul>
                </div>

                {/* Sections and Questions */}
                {activePreviewPaper.sections && activePreviewPaper.sections.length > 0 ? (
                  activePreviewPaper.sections.map((section, sIdx) => (
                    <div key={sIdx} className="space-y-4">
                      <div className="p-2.5 rounded-lg bg-violet-950/40 border border-violet-500/20 text-xs font-bold text-violet-300 flex items-center justify-between">
                        <span>{section.name}: {section.title}</span>
                        <span className="font-mono text-[11px] text-slate-400">{section.description}</span>
                      </div>

                      <div className="space-y-4">
                        {section.questions.map((q) => (
                          <div
                            key={q.id}
                            className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-3"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <span className="font-bold text-xs text-white">
                                Q{q.questionNumber}. {q.text}
                              </span>
                              <span className="text-[11px] font-mono font-bold text-cyan-400 shrink-0">
                                [{q.marks} Mark{q.marks > 1 ? "s" : ""}]
                              </span>
                            </div>

                            {/* Options if MCQ */}
                            {q.options && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                {q.options.map((opt) => (
                                  <div
                                    key={opt.id}
                                    className={`p-2.5 rounded-lg border ${
                                      showOfficialSolutions && opt.isCorrect
                                        ? "bg-emerald-950/50 border-emerald-500/50 text-emerald-200 font-semibold"
                                        : "bg-slate-950/40 border-white/5 text-slate-300"
                                    }`}
                                  >
                                    <span className="font-bold mr-2">({opt.label})</span>
                                    {opt.text}
                                    {showOfficialSolutions && opt.isCorrect && (
                                      <span className="ml-2 text-[10px] text-emerald-400">✓ Correct</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Step-by-Step Marking & Solution if enabled */}
                            {showOfficialSolutions && (
                              <div className="p-3 rounded-lg bg-slate-950/90 border border-emerald-500/20 space-y-1.5 text-xs">
                                <span className="font-bold text-emerald-400 flex items-center gap-1 text-[11px]">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Official Marking Scheme &amp; Explanation:
                                </span>
                                <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
                                {q.rubricCriteria && (
                                  <div className="pt-2 border-t border-white/5">
                                    <span className="text-[10px] font-bold text-amber-400 uppercase">
                                      Step-by-Step Marks Distribution:
                                    </span>
                                    <ul className="list-disc list-inside text-[11px] text-slate-400 mt-1">
                                      {q.rubricCriteria.map((r, rIdx) => (
                                        <li key={rIdx}>
                                          {r.criteria} — <strong className="text-cyan-300">{r.marks} Marks</strong>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 rounded-xl bg-slate-900/60 text-center space-y-2">
                    <p className="text-xs text-slate-300">
                      Standard official archive preview loaded. You can download the full text blueprint using the top action button.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Download Toast */}
        {downloadSuccessToast && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-5">
            <CheckCircle2 className="w-4 h-4" />
            Verified Board Question Paper Generated &amp; Downloaded!
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
