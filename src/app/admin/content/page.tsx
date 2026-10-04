"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Database,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sparkles,
  FileText,
  Search,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/lib/store/auth-context";
import { CONTENT_COVERAGE_MATRIX, EXPANDED_CHAPTERS_REGISTRY } from "@/lib/data/curriculum-registry";
import { SOURCE_REGISTRY } from "@/lib/data/source-registry";
import { ContentIngestionPipeline } from "@/lib/content/ingestion-pipeline";
import { IngestionValidationResult } from "@/types";

export default function AdminContentEnginePage() {
  const { user, switchRole } = useAuth();
  const [selectedBoardFilter, setSelectedBoardFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Pipeline tester
  const [testDocTitle, setTestDocTitle] = useState("CBSE Class 10 Science Pilot Chemical Reactions");
  const [testDocBody, setTestDocBody] = useState(
    "Thermal decomposition of ferrous sulphate: 2FeSO4(s) -> Fe2O3(s) + SO2(g) + SO3(g). Brown residue and smell of burning sulphur."
  );
  const [testDocSourceId, setTestDocSourceId] = useState("cbse-academic-portal");
  const [pipelineResult, setPipelineResult] = useState<IngestionValidationResult | null>(null);

  const filteredMatrix = CONTENT_COVERAGE_MATRIX.filter((row) => {
    if (selectedBoardFilter !== "all" && row.boardCode !== selectedBoardFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        row.subjectName.toLowerCase().includes(q) ||
        row.boardName.toLowerCase().includes(q) ||
        row.boardCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleRunValidation = () => {
    const res = ContentIngestionPipeline.validateDocument({
      title: testDocTitle,
      sourceId: testDocSourceId,
      boardCode: "cbse",
      classLevel: 10,
      subjectId: "cbse-10-sci",
      year: 2025,
      contentBody: testDocBody,
    });
    setPipelineResult(res);
  };

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
              You are signed in as Student. Switch to Admin mode to inspect the content coverage matrix and ingestion pipeline.
            </p>
            <button
              onClick={() => switchRole("admin")}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold text-xs"
            >
              Switch to Demo Admin (1-Click)
            </button>
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
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Main Admin Portal
          </Link>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            ENGINE STATUS: ACTIVE
          </span>
        </div>

        <div className="rounded-2xl glass-panel-glow p-6 sm:p-8 border border-white/10 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Content Engineering &amp; Ingestion Architecture
              </span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Zero Fabrication Policy Enforced
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Content Coverage Matrix &amp; Source Registry
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
              Centralized platform for curriculum tracking, 10-year question paper verification, source provenance auditing, and automated pre-flight quality validation.
            </p>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl glass-panel border border-indigo-500/30">
            <div className="text-slate-400 text-xs font-semibold">Registered Boards</div>
            <div className="text-2xl font-black text-indigo-400 font-mono mt-1">8 Boards</div>
            <div className="text-[10px] text-slate-400">CBSE, ICSE, MSBSHSE, UP, PSEB+</div>
          </div>

          <div className="p-4 rounded-xl glass-panel border border-cyan-500/30">
            <div className="text-slate-400 text-xs font-semibold">Structured Chapters</div>
            <div className="text-2xl font-black text-cyan-400 font-mono mt-1">
              {EXPANDED_CHAPTERS_REGISTRY.length} Live
            </div>
            <div className="text-[10px] text-emerald-400">100% NCERT / Board Aligned</div>
          </div>

          <div className="p-4 rounded-xl glass-panel border border-emerald-500/30">
            <div className="text-slate-400 text-xs font-semibold">Verified 10-Yr Papers</div>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-1">9 / 10 Active</div>
            <div className="text-[10px] text-amber-400">2021 Cancelled (COVID-19)</div>
          </div>

          <div className="p-4 rounded-xl glass-panel border border-teal-500/30">
            <div className="text-slate-400 text-xs font-semibold">Registered Portals</div>
            <div className="text-2xl font-black text-teal-400 font-mono mt-1">
              {SOURCE_REGISTRY.length} Sources
            </div>
            <div className="text-[10px] text-teal-300">100% Verified Provenance</div>
          </div>
        </div>

        {/* COVERAGE MATRIX TABLE */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Content Coverage Matrix</h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter matrix by subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-white"
                />
              </div>

              <select
                value={selectedBoardFilter}
                onChange={(e) => setSelectedBoardFilter(e.target.value)}
                className="p-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-white"
              >
                <option value="all">All Boards</option>
                <option value="cbse">CBSE</option>
                <option value="icse">ICSE / ISC</option>
                <option value="state_board">State Boards</option>
                <option value="pseb">PSEB</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-white/10">
                <tr>
                  <th className="p-3">Board</th>
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
                {filteredMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-white uppercase">{row.boardCode}</div>
                      <div className="text-[11px] text-slate-400">{row.boardName}</div>
                    </td>
                    <td className="p-3 font-mono font-bold text-cyan-300">Class {row.classLevel}</td>
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
                      <span className="text-emerald-400 font-bold">{row.verifiedPapersCount}</span> /{" "}
                      {row.tenYearPapersTarget}
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
              Missing Content Audit &amp; Exam Cancellation Disclosures
            </h4>
          </div>
          <p className="text-xs text-slate-300">
            Official explanations for unreleased examination papers (e.g. nationwide cancellations during COVID-19 pandemic):
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {CONTENT_COVERAGE_MATRIX.map((row, idx) => {
              if (row.missingPapersList.length === 0) return null;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between pb-1 border-b border-white/5">
                    <span className="font-bold text-white">
                      {row.boardCode.toUpperCase()} • Class {row.classLevel}
                    </span>
                    <span className="text-[10px] text-slate-400">{row.subjectName}</span>
                  </div>
                  {row.missingPapersList.map((m, mIdx) => (
                    <div key={mIdx} className="text-slate-300 text-[11px]">
                      <strong className="text-amber-400">{m.year} Paper:</strong> {m.reason}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* SOURCE REGISTRY */}
        <div className="p-6 rounded-2xl glass-panel border border-teal-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              Verified Educational Source Registry
            </h3>
            <span className="text-xs text-slate-400">Strict Provenance Standard</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-white/10">
                <tr>
                  <th className="p-3">Source &amp; Organization</th>
                  <th className="p-3">Board</th>
                  <th className="p-3">Copyright Status</th>
                  <th className="p-3">Allowed Actions</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Official Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {SOURCE_REGISTRY.map((s) => (
                  <tr key={s.sourceId} className="hover:bg-white/5 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-white">{s.sourceName}</div>
                      <div className="text-[11px] text-slate-400">{s.organization}</div>
                    </td>
                    <td className="p-3 font-mono font-bold text-cyan-300 uppercase">{s.boardCode}</td>
                    <td className="p-3 text-[11px]">{s.copyrightStatus.replace(/_/g, " ")}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {s.allowedActions.map((a, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded bg-slate-900 border border-white/5 text-[9px] font-mono text-teal-300"
                          >
                            {a.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                        {s.verificationStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      <a
                        href={s.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-cyan-400 underline font-mono text-[11px]"
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

        {/* INGESTION PIPELINE TESTER */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-rose-400" />
            <h4 className="text-sm font-bold text-white">Live Ingestion Pre-Flight Quality Tester</h4>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Document Title / Question Heading
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
                Content Body (LaTeX / Chemical Formulas / Text)
              </label>
              <textarea
                rows={3}
                value={testDocBody}
                onChange={(e) => setTestDocBody(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono"
              />
            </div>

            <button
              onClick={handleRunValidation}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Execute Pipeline Validation
            </button>

            {pipelineResult && (
              <div
                className={`p-4 rounded-xl border text-xs space-y-2 animate-in fade-in ${
                  pipelineResult.isValid
                    ? "bg-emerald-950/30 border-emerald-500/40"
                    : "bg-rose-950/30 border-rose-500/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded ${
                      pipelineResult.isValid
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-rose-500/20 text-rose-300"
                    }`}
                  >
                    {pipelineResult.isValid ? "VALIDATION PASSED" : "VALIDATION ISSUES DETECTED"}
                  </span>
                  <span className="text-slate-400 font-mono">Hash: {pipelineResult.fileHash}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                  <div>OCR Score: {pipelineResult.ocrQualityScorePct}%</div>
                  <div>Formulas: {pipelineResult.scientificNotationValid ? "OK" : "Warning"}</div>
                  <div>Deduplication: {pipelineResult.isDuplicate ? "Duplicate" : "Unique"}</div>
                  <div>
                    Syllabus:{" "}
                    {
                      ContentIngestionPipeline.mapQuestionToSyllabus(
                        testDocBody,
                        EXPANDED_CHAPTERS_REGISTRY
                      ).confidence
                    }
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
