"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  GraduationCap,
  Sparkles,
  Layers,
  BookOpen,
  Calendar,
  Languages,
  ArrowRight,
  CheckCircle2,
  Check,
} from "lucide-react";
import { useAuth } from "@/lib/store/auth-context";
import { BOARDS, SUBJECTS } from "@/lib/data/mock-db";
import { ClassLevel, StreamType } from "@/types";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, completeOnboarding } = useAuth();

  const [step, setStep] = useState(1);

  // Form State
  const [selectedClass, setSelectedClass] = useState<ClassLevel>(user?.classLevel || 10);
  const [selectedBoard, setSelectedBoard] = useState(user?.boardId || "cbse");
  const [selectedStream, setSelectedStream] = useState<StreamType>(user?.stream || "general_10th");
  const [selectedSession, setSelectedSession] = useState(user?.academicSession || "2026-2027");
  const [selectedLanguage, setSelectedLanguage] = useState<"english" | "hinglish" | "hindi" | "punjabi">(
    user?.preferredLanguage || "hinglish"
  );
  const [targetExamDate, setTargetExamDate] = useState(user?.targetExamDate || "2027-02-15");
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>(
    user?.selectedSubjectIds?.length ? user.selectedSubjectIds : ["cbse-10-sci", "cbse-10-math"]
  );

  // Filter available subjects based on selected class and board
  const availableSubjects = SUBJECTS.filter(
    (s) => s.classLevel === selectedClass && (s.boardId === selectedBoard || s.boardId === "cbse")
  );

  const toggleSubject = (id: string) => {
    if (selectedSubjectIds.includes(id)) {
      setSelectedSubjectIds(selectedSubjectIds.filter((s) => s !== id));
    } else {
      setSelectedSubjectIds([...selectedSubjectIds, id]);
    }
  };

  const handleFinish = () => {
    completeOnboarding({
      classLevel: selectedClass,
      boardId: selectedBoard,
      stream: selectedClass === 10 ? "general_10th" : selectedStream,
      academicSession: selectedSession,
      selectedSubjectIds: selectedSubjectIds.length > 0 ? selectedSubjectIds : availableSubjects.map((s) => s.id),
      preferredLanguage: selectedLanguage,
      targetExamDate: targetExamDate,
    });
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#070a14] bg-grid-pattern flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold border border-violet-500/30">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Step {step} of 3: Personalize Your Curriculum
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Set Up Your Board Preparation Track
          </h1>
          <p className="text-xs text-slate-400">
            EduVerse AI uses your board, class, and subjects to tailor study materials, question papers, and AI tutor explanations.
          </p>
        </div>

        {/* Multi-step progress line */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                step === s
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30"
                  : step > s
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-white/5 text-slate-500"
              }`}
            >
              {step > s ? <Check className="w-3 h-3 text-emerald-400" /> : <span>{s}</span>}
              <span className="hidden sm:inline">
                {s === 1 ? "Class & Board" : s === 2 ? "Subjects & Stream" : "Session & Language"}
              </span>
            </div>
          ))}
        </div>

        {/* STEP 1: CLASS & BOARD */}
        {step === 1 && (
          <div className="glass-panel-glow rounded-2xl p-6 sm:p-8 space-y-8 animate-in fade-in">
            {/* Class Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" /> 1. Select Your Target Class
              </label>
              <div className="grid grid-cols-3 gap-4">
                {([10, 11, 12] as ClassLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      setSelectedClass(lvl);
                      // Auto-select common subjects for this class
                      const relevant = SUBJECTS.filter((s) => s.classLevel === lvl);
                      setSelectedSubjectIds(relevant.slice(0, 4).map((s) => s.id));
                    }}
                    className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedClass === lvl
                        ? "bg-violet-600/30 border-violet-500 text-white shadow-lg shadow-violet-500/20 font-bold"
                        : "bg-slate-900/60 border-white/10 text-slate-300 hover:border-white/20"
                    }`}
                  >
                    <span className="text-2xl font-black block">Class {lvl}</span>
                    <span className="text-[11px] text-slate-400 block mt-1">
                      {lvl === 10 ? "Secondary Board" : lvl === 12 ? "Senior Secondary Board" : "Pre-Board Foundation"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Board Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <Layers className="w-4 h-4" /> 2. Select Your Education Board
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BOARDS.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBoard(b.id)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedBoard === b.id
                        ? "bg-cyan-600/25 border-cyan-400 text-white shadow-lg shadow-cyan-500/20"
                        : "bg-slate-900/60 border-white/10 text-slate-300 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-white">{b.name}</span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/10 text-cyan-300">
                        {b.shortName}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{b.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-lg shadow-violet-600/30 flex items-center gap-2"
              >
                Continue to Subject Selection <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: STREAM & SUBJECTS */}
        {step === 2 && (
          <div className="glass-panel-glow rounded-2xl p-6 sm:p-8 space-y-8 animate-in fade-in">
            {/* Stream selection for Class 11 & 12 */}
            {selectedClass !== 10 && (
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-violet-400">
                  Academic Stream
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: "science_pcm", label: "Science (PCM)", desc: "Physics, Chem, Math" },
                    { id: "science_pcb", label: "Science (PCB)", desc: "Physics, Chem, Bio" },
                    { id: "commerce", label: "Commerce", desc: "Accountancy, Economics" },
                    { id: "arts_humanities", label: "Arts / Humanities", desc: "Social Sciences, Lit" },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSelectedStream(st.id as StreamType)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedStream === st.id
                          ? "bg-violet-600/30 border-violet-500 text-white font-semibold"
                          : "bg-slate-900/60 border-white/10 text-slate-300"
                      }`}
                    >
                      <div className="text-xs font-bold text-white">{st.label}</div>
                      <div className="text-[10px] text-slate-400">{st.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Subject Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Choose Your Subjects (Class {selectedClass})
                </label>
                <span className="text-xs text-slate-400">
                  {selectedSubjectIds.length} Selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableSubjects.map((sub) => {
                  const isSelected = selectedSubjectIds.includes(sub.id);
                  return (
                    <div
                      key={sub.id}
                      onClick={() => toggleSubject(sub.id)}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? "bg-cyan-950/40 border-cyan-400 text-white shadow-sm"
                          : "bg-slate-900/60 border-white/10 text-slate-300 hover:border-white/20"
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>{sub.name}</span>
                          <span className="text-[10px] font-mono text-slate-400">({sub.code})</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {sub.chapterCount} Chapters • {sub.theoryMarks} Theory + {sub.practicalMarks} Internal
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                          isSelected ? "bg-cyan-500 border-cyan-400 text-white" : "border-white/20"
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl glass-panel text-xs text-slate-300 hover:text-white"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-lg shadow-violet-600/30 flex items-center gap-2"
              >
                Continue to Session &amp; Language <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SESSION, LANGUAGE & TARGET EXAM DATE */}
        {step === 3 && (
          <div className="glass-panel-glow rounded-2xl p-6 sm:p-8 space-y-8 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Academic Session */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Academic Session
                </label>
                <select
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                >
                  <option value="2026-2027">2026 – 2027 (Upcoming Board Session)</option>
                  <option value="2025-2026">2025 – 2026 (Current Academic Year)</option>
                </select>
              </div>

              {/* Expected Exam Date */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Target Examination Date
                </label>
                <input
                  type="date"
                  value={targetExamDate}
                  onChange={(e) => setTargetExamDate(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                </input>
              </div>
            </div>

            {/* Preferred Language for AI Tutor */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Languages className="w-4 h-4" /> Preferred AI Tutor Instruction Language
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "english", label: "English", desc: "Formal board terminology" },
                  { id: "hinglish", label: "Hinglish (Recommended)", desc: "Conversational English + Hindi" },
                  { id: "hindi", label: "Hindi (हिंदी)", desc: "Pure Hindi medium instruction" },
                  { id: "punjabi", label: "Punjabi (ਪੰਜਾਬੀ)", desc: "PSEB regional track" },
                ].map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setSelectedLanguage(l.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedLanguage === l.id
                        ? "bg-amber-500/20 border-amber-400 text-white font-semibold"
                        : "bg-slate-900/60 border-white/10 text-slate-300"
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{l.label}</div>
                    <div className="text-[10px] text-slate-400">{l.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Summary Box */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 text-xs space-y-2">
              <div className="font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Personalized Preparation Summary:
              </div>
              <p className="text-slate-300">
                You are preparing for <strong className="text-cyan-300">Class {selectedClass} {selectedBoard.toUpperCase()}</strong> with {selectedSubjectIds.length} enrolled subjects in <strong className="text-amber-300">{selectedLanguage.toUpperCase()}</strong>.
              </p>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl glass-panel text-xs text-slate-300 hover:text-white"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 text-white font-bold text-xs shadow-xl shadow-emerald-600/30 flex items-center gap-2 cursor-pointer"
              >
                Launch My Personalized Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
