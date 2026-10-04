"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Compass,
  Sparkles,
  Dna,
  Atom,
  Zap,
  Calculator,
  Globe2,
  Hourglass,
  BookOpen,
  Binary,
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Bot,
  Layers,
  Play,
  Pause,
  RotateCcw,
  Search,
  Bookmark,
  ChevronRight,
  ChevronLeft,
  X,
  Sliders,
  HelpCircle,
  TrendingUp,
  RefreshCw,
  Eye,
  Check,
  Target,
} from "lucide-react";
import { useAuth } from "@/lib/store/auth-context";
import { useDataStore } from "@/lib/store/data-store";
import {
  SubjectWorldId,
  SubjectWorldPortal,
  LearningPathNode,
  RevisionItem,
  DailyMission,
  Interactive3DLesson,
} from "@/types";
import {
  SUBJECT_WORLD_PORTALS,
  PERSONAL_LEARNING_PATHS,
  GUIDED_3D_LESSONS,
  CHEMISTRY_MOLECULES,
  PERIODIC_ELEMENTS_SAMPLE,
  PeriodicElement,
} from "@/lib/data/universe-data";
import { UniverseCosmos3D } from "@/components/3d/UniverseCosmos3D";

export default function EduVerse3DUniversePage() {
  const { user } = useAuth();
  const {
    gamificationState,
    savedRevisions,
    dailyMissions,
    completedLessons3D,
    saveForRevision,
    updateRevisionSchedule,
    completeDailyMission,
    recordCompleted3DLesson,
    userSettings,
    saveNote,
  } = useDataStore();

  // Active Selected World & View Mode
  const [activeWorldId, setActiveWorldId] = useState<SubjectWorldId>("biology");
  const [activeTab, setActiveTab] = useState<"cosmos" | "learning_path" | "daily_quests" | "revisions">("cosmos");
  const [exploreMode, setExploreMode] = useState<"universe_overview" | "focused_world">("universe_overview");

  // Sub-simulators states
  const [selectedMoleculeId, setSelectedMoleculeId] = useState<string>("mol-ch4");
  const [selectedElement, setSelectedElement] = useState<PeriodicElement>(PERIODIC_ELEMENTS_SAMPLE[2]); // Carbon
  const [projectileParams, setProjectileParams] = useState({ velocity: 20, angle: 45, gravity: 9.8 });
  const [mathSolidParams, setMathSolidParams] = useState<{ type: "cylinder" | "cone" | "sphere" | "pyramid"; radius: number; height: number }>({
    type: "cylinder",
    radius: 5,
    height: 12,
  });

  // Guided Lesson Mode State
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [lessonStepIndex, setLessonStepIndex] = useState<number>(0);
  const [isGuidedMode, setIsGuidedMode] = useState<boolean>(true);
  const [lessonQuizSubmitted, setLessonQuizSubmitted] = useState<boolean>(false);
  const [lessonQuizSelectedOption, setLessonQuizSelectedOption] = useState<string | null>(null);

  // AI Study Guide & Inspector Drawer State
  const [isAiGuideOpen, setIsAiGuideOpen] = useState<boolean>(false);
  const [aiPromptInput, setAiPromptInput] = useState<string>("");
  const [aiGuideResponse, setAiGuideResponse] = useState<string>("");
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  // Revision card flipped state
  const [activeRevisionCardId, setActiveRevisionCardId] = useState<string | null>(null);
  const [revisionFlipped, setRevisionFlipped] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const activePortal = SUBJECT_WORLD_PORTALS.find((p) => p.id === activeWorldId) || SUBJECT_WORLD_PORTALS[0];
  const activeLearningPath = PERSONAL_LEARNING_PATHS[activeWorldId] || PERSONAL_LEARNING_PATHS.biology;
  const currentLesson = GUIDED_3D_LESSONS.find((l) => l.id === activeLessonId) || GUIDED_3D_LESSONS[0];

  // Calculate projectile metrics
  const rad = (projectileParams.angle * Math.PI) / 180;
  const projTime = ((2 * projectileParams.velocity * Math.sin(rad)) / projectileParams.gravity).toFixed(2);
  const projRange = (((projectileParams.velocity ** 2) * Math.sin(2 * rad)) / projectileParams.gravity).toFixed(2);
  const projApex = (((projectileParams.velocity ** 2) * (Math.sin(rad) ** 2)) / (2 * projectileParams.gravity)).toFixed(2);

  // Calculate math solid volume & area
  const r = mathSolidParams.radius;
  const h = mathSolidParams.height;
  let mathVolume = 0;
  let mathArea = 0;
  if (mathSolidParams.type === "cylinder") {
    mathVolume = Math.PI * r * r * h;
    mathArea = 2 * Math.PI * r * h + 2 * Math.PI * r * r;
  } else if (mathSolidParams.type === "cone") {
    mathVolume = (1 / 3) * Math.PI * r * r * h;
    const l = Math.sqrt(r * r + h * h);
    mathArea = Math.PI * r * l + Math.PI * r * r;
  } else if (mathSolidParams.type === "sphere") {
    mathVolume = (4 / 3) * Math.PI * Math.pow(r, 3);
    mathArea = 4 * Math.PI * r * r;
  } else if (mathSolidParams.type === "pyramid") {
    mathVolume = (1 / 3) * (4 * r * r) * h;
    mathArea = 4 * r * r + 2 * (2 * r) * Math.sqrt(r * r + h * h);
  }

  // Handle Asking AI Guide
  const handleAskAIGuide = async (customPrompt?: string) => {
    setIsAiGuideOpen(true);
    setAiLoading(true);

    const promptText =
      customPrompt ||
      `I am exploring the ${activePortal.name} world in the 3D Learning Universe for ${user?.boardId?.toUpperCase() || "CBSE"} Class ${user?.classLevel || 10}. Explain the core concepts of ${activePortal.currentChapter} and high-yield board exam questions.`;

    setAiPromptInput(promptText);

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          mode: "explain",
          subjectId: `cbse-${user?.classLevel || 10}-sci`,
          context: `EduVerse 3D Universe: World=${activePortal.name}, Chapter=${activePortal.currentChapter}, Formula=${activePortal.primaryFormulaOrFact}`,
        }),
      });
      const data = await res.json();
      setAiGuideResponse(data.reply || data.response || "No response received.");
    } catch (e) {
      setAiGuideResponse(
        `### ${activePortal.name} — AI Study Guide Insight\n\n**Current Chapter:** ${activePortal.currentChapter}\n\n**Key Formula / Principle:** ${activePortal.primaryFormulaOrFact}\n\n**Board Exam Strategy:** This topic carries substantial weightage (${activePortal.mockExamCount} mock tests available). Focus on 3D spatial orientation and 3-mark diagrammatic questions.`
      );
    } finally {
      setAiLoading(false);
    }
  };

  // Quick Save Object for Spaced Repetition Revision
  const handleSaveCurrentToRevision = () => {
    saveForRevision({
      title: `${activePortal.name}: ${activePortal.currentChapter}`,
      subjectId: activeWorldId,
      chapterId: `ch-${activeWorldId}`,
      objectName: activePortal.name,
      systemOrBranch: activePortal.currentChapter,
      modelType: activePortal.modelType,
      formulaOrSummary: activePortal.primaryFormulaOrFact,
      examTip: `Essential high-yield topic in ${activePortal.name} for Class 10/12 exams.`,
    });
    setSaveSuccessMsg("✓ Saved to My Revisions (Spaced Repetition)");
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#050711] text-white flex flex-col select-none overflow-x-hidden">
      <Navbar />

      {/* TOP UNIVERSE TELEMETRY HEADER */}
      <header className="sticky top-16 z-30 bg-[#070b1b]/95 backdrop-blur-md border-b border-cyan-500/20 px-4 sm:px-8 py-3 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-violet-500 flex items-center justify-center p-0.5 shadow-lg shadow-cyan-500/30">
              <div className="w-full h-full bg-[#070a16] rounded-[14px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-cyan-400 animate-spin-slow" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  EduVerse <span className="text-gradient-primary">3D Universe</span>
                </h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  8 Celestial Worlds
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Class {user?.classLevel || 10} • {user?.boardId?.toUpperCase() || "CBSE"} Board • Spatial Learning Cosmos
              </p>
            </div>
          </div>

          {/* VIEW MODE TABS */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-2xl border border-white/10 flex-wrap">
            <button
              onClick={() => { setActiveTab("cosmos"); setExploreMode("universe_overview"); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "cosmos"
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🌌 3D Cosmos
            </button>
            <button
              onClick={() => setActiveTab("learning_path")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "learning_path"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🗺️ Syllabus Path
            </button>
            <button
              onClick={() => setActiveTab("daily_quests")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "daily_quests"
                  ? "bg-amber-600 text-white shadow-md shadow-amber-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🎯 Daily Quests ({dailyMissions.filter(m => !m.isCompleted).length})
            </button>
            <button
              onClick={() => setActiveTab("revisions")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "revisions"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🧠 My Revisions ({savedRevisions.length})
            </button>
          </div>

          {/* AI Guide Trigger & Level Badge */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAskAIGuide()}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-violet-600/40 to-cyan-600/40 hover:from-violet-600 hover:to-cyan-600 border border-cyan-400/40 text-xs font-bold text-cyan-200 flex items-center gap-1.5 shadow-lg shadow-cyan-500/10 cursor-pointer transition-all"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>AI Study Guide</span>
            </button>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-amber-400 font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>Lvl {gamificationState.currentLevel}</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN LEARNING UNIVERSE WORKSPACE */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 1. COSMOS & SUBJECT WORLDS VIEW */}
        {activeTab === "cosmos" && (
          <div className="space-y-6 animate-in fade-in">
            {/* 8-PORTAL HORIZONTAL SELECTOR STRIP */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 custom-scrollbar">
              {SUBJECT_WORLD_PORTALS.map((portal) => {
                const isSelected = activeWorldId === portal.id;
                return (
                  <button
                    key={portal.id}
                    onClick={() => {
                      setActiveWorldId(portal.id);
                      setExploreMode("focused_world");
                    }}
                    className={`shrink-0 px-4 py-2.5 rounded-2xl border flex items-center gap-2.5 text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-slate-900/90 border-cyan-400 text-white shadow-lg shadow-cyan-500/20 scale-105"
                        : "glass-panel border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        portal.themeColor === "emerald"
                          ? "bg-emerald-400 shadow-emerald-500/50 shadow-sm"
                          : portal.themeColor === "cyan"
                          ? "bg-cyan-400 shadow-cyan-500/50 shadow-sm"
                          : portal.themeColor === "violet"
                          ? "bg-violet-400 shadow-violet-500/50 shadow-sm"
                          : portal.themeColor === "amber"
                          ? "bg-amber-400 shadow-amber-500/50 shadow-sm"
                          : "bg-blue-400"
                      }`}
                    />
                    <span>{portal.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                      {portal.progressPct}%
                    </span>
                  </button>
                );
              })}
            </div>

            {/* CENTRAL 3D UNIVERSE CANVAS + SUBJECT DOSSIER GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left 3D WebGL Canvas (7 cols) */}
              <div className="lg:col-span-7 h-[460px] sm:h-[500px] relative rounded-3xl overflow-hidden shadow-2xl">
                <UniverseCosmos3D
                  activeWorldId={activeWorldId}
                  onSelectWorld={(wId) => {
                    setActiveWorldId(wId);
                    setExploreMode("focused_world");
                  }}
                  exploreMode={exploreMode}
                  graphicIntensity={userSettings.graphicIntensity}
                  selectedMoleculeId={selectedMoleculeId}
                  projectileParams={projectileParams}
                  mathSolidParams={mathSolidParams}
                />

                {/* Sub-Simulator Controls Overlay (When Focused on Chem/Phys/Math) */}
                {exploreMode === "focused_world" && activeWorldId === "chemistry" && (
                  <div className="absolute bottom-4 left-4 right-4 z-20 bg-slate-950/90 backdrop-blur-md p-3 rounded-2xl border border-cyan-500/30 flex items-center justify-between gap-2 overflow-x-auto">
                    <span className="text-xs font-bold text-cyan-300 shrink-0">Molecule:</span>
                    <div className="flex items-center gap-1.5">
                      {CHEMISTRY_MOLECULES.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setSelectedMoleculeId(m.id)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                            selectedMoleculeId === m.id
                              ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                              : "bg-slate-900 border border-white/10 text-slate-400 hover:text-white"
                          }`}
                        >
                          {m.formula}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {exploreMode === "focused_world" && activeWorldId === "physics" && (
                  <div className="absolute bottom-4 left-4 right-4 z-20 bg-slate-950/90 backdrop-blur-md p-3 rounded-2xl border border-violet-500/30 grid grid-cols-3 gap-2 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400">Angle: {projectileParams.angle}°</span>
                      <input
                        type="range"
                        min="15"
                        max="85"
                        value={projectileParams.angle}
                        onChange={(e) => setProjectileParams({ ...projectileParams, angle: Number(e.target.value) })}
                        className="w-full accent-violet-500 h-1"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">Speed: {projectileParams.velocity} m/s</span>
                      <input
                        type="range"
                        min="5"
                        max="40"
                        value={projectileParams.velocity}
                        onChange={(e) => setProjectileParams({ ...projectileParams, velocity: Number(e.target.value) })}
                        className="w-full accent-violet-500 h-1"
                      />
                    </div>
                    <div className="text-right flex flex-col justify-center">
                      <span className="text-violet-300 font-bold">R = {projRange}m</span>
                      <span className="text-[9px] text-slate-400">Apex = {projApex}m</span>
                    </div>
                  </div>
                )}

                {exploreMode === "focused_world" && activeWorldId === "mathematics" && (
                  <div className="absolute bottom-4 left-4 right-4 z-20 bg-slate-950/90 backdrop-blur-md p-3 rounded-2xl border border-amber-500/30 flex items-center justify-between gap-3 text-xs font-mono">
                    <div className="flex gap-1">
                      {(["cylinder", "cone", "sphere", "pyramid"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setMathSolidParams({ ...mathSolidParams, type: t })}
                          className={`px-2 py-1 rounded capitalize text-[11px] ${
                            mathSolidParams.type === t ? "bg-amber-600 text-white font-bold" : "bg-slate-900 text-slate-400"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <div className="text-amber-300 font-bold">
                      Vol: {mathVolume.toFixed(1)} cm³
                    </div>
                  </div>
                )}
              </div>

              {/* Right Subject Dossier & Actions (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                {/* Active Portal Dossier Card */}
                <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4 shadow-xl relative overflow-hidden">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          {activePortal.id.toUpperCase()} WORLD
                        </span>
                        <span className="text-xs text-slate-400 font-mono">Syllabus: {activePortal.progressPct}%</span>
                      </div>
                      <h2 className="text-xl font-black text-white">{activePortal.name}</h2>
                      <p className="text-xs text-slate-300 leading-relaxed">{activePortal.description}</p>
                    </div>
                  </div>

                  {/* Telemetry Matrix */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                        Current Chapter
                      </span>
                      <p className="text-xs font-bold text-white truncate">{activePortal.currentChapter}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                        XP Earned
                      </span>
                      <p className="text-xs font-bold text-amber-400 font-mono">+{activePortal.xpEarned} XP</p>
                    </div>
                  </div>

                  {/* High-Yield NCERT Fact / Formula Callout */}
                  <div className="p-3.5 rounded-2xl bg-violet-950/30 border border-violet-500/30 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-violet-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Core Law / Exam Formula:
                    </span>
                    <p className="text-xs font-mono text-cyan-200 font-semibold">{activePortal.primaryFormulaOrFact}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    {activeWorldId === "biology" ? (
                      <Link
                        href="/learn/biology"
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                      >
                        <Dna className="w-4 h-4" /> Enter Flagship 3D Biology Lab →
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          const matchingLesson = GUIDED_3D_LESSONS.find((l) => l.subjectId === activeWorldId);
                          if (matchingLesson) {
                            setActiveLessonId(matchingLesson.id);
                            setLessonStepIndex(0);
                            setLessonQuizSubmitted(false);
                          }
                        }}
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white font-bold text-xs shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
                      >
                        <Play className="w-4 h-4" /> Start 3D Guided Lesson ({activePortal.recommendedLesson.split(" ")[0]}...)
                      </button>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleAskAIGuide()}
                        className="py-2.5 rounded-xl glass-panel hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Bot className="w-3.5 h-3.5 text-cyan-400" /> Ask AI Tutor
                      </button>
                      <button
                        onClick={handleSaveCurrentToRevision}
                        className="py-2.5 rounded-xl glass-panel hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-amber-400" /> Save for Revision
                      </button>
                    </div>

                    {saveSuccessMsg && (
                      <p className="text-center text-[11px] text-emerald-400 font-mono animate-in fade-in">
                        {saveSuccessMsg}
                      </p>
                    )}
                  </div>
                </div>

                {/* 3D Guided Lesson Mode Box (If a lesson is activated) */}
                {activeLessonId && (
                  <div className="glass-panel-glow rounded-3xl p-5 border border-cyan-500/40 space-y-3 shadow-2xl animate-in fade-in">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                          3D LESSON
                        </span>
                        <h4 className="text-xs font-bold text-white truncate max-w-[200px]">
                          {currentLesson.title}
                        </h4>
                      </div>
                      <button
                        onClick={() => setActiveLessonId(null)}
                        className="text-slate-400 hover:text-white p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Step Card */}
                    <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-cyan-300">
                          Step {lessonStepIndex + 1} of {currentLesson.steps.length}: {currentLesson.steps[lessonStepIndex]?.title}
                        </span>
                        <span className="text-[10px] text-amber-400 font-mono">+{currentLesson.xpReward} XP</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {currentLesson.steps[lessonStepIndex]?.description}
                      </p>
                      <div className="p-2.5 rounded-xl bg-violet-950/40 border border-violet-500/20 text-[11px] text-violet-200">
                        💡 <strong>Action:</strong> {currentLesson.steps[lessonStepIndex]?.actionPrompt}
                      </div>
                    </div>

                    {/* Step Navigation */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        disabled={lessonStepIndex === 0}
                        onClick={() => setLessonStepIndex((prev) => Math.max(0, prev - 1))}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-xs font-semibold text-slate-300"
                      >
                        ← Previous
                      </button>
                      <div className="flex gap-1">
                        {currentLesson.steps.map((_, i) => (
                          <span
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i === lessonStepIndex ? "bg-cyan-400" : i < lessonStepIndex ? "bg-emerald-400" : "bg-white/20"
                            }`}
                          />
                        ))}
                      </div>
                      {lessonStepIndex < currentLesson.steps.length - 1 ? (
                        <button
                          onClick={() => setLessonStepIndex((prev) => prev + 1)}
                          className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white shadow-md shadow-cyan-600/30"
                        >
                          Next Step →
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            recordCompleted3DLesson(currentLesson.id);
                            alert(`🎉 Lesson Completed! You earned +${currentLesson.xpReward} XP!`);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md shadow-emerald-600/30"
                        >
                          Complete Lesson ✓
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. SYLLABUS LEARNING JOURNEY PATH */}
        {activeTab === "learning_path" && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 shadow-2xl animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-extrabold text-white">
                    {activePortal.name} Syllabus Learning Journey
                  </h2>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    CBSE / ICSE Board
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Step-by-step 3D visual learning progression mapped to board weightage.
                </p>
              </div>

              {/* Subject Switcher in Learning Path */}
              <div className="flex items-center gap-2 overflow-x-auto">
                {SUBJECT_WORLD_PORTALS.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActiveWorldId(p.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeWorldId === p.id
                        ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                        : "glass-panel text-slate-400 hover:text-white"
                    }`}
                  >
                    {p.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Path Nodes Timeline */}
            <div className="space-y-4">
              {activeLearningPath.map((node, index) => (
                <div
                  key={node.id}
                  className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    node.status === "completed"
                      ? "bg-emerald-950/20 border-emerald-500/30"
                      : node.status === "current"
                      ? "bg-cyan-950/30 border-cyan-400 shadow-lg shadow-cyan-500/10"
                      : node.status === "recommended"
                      ? "bg-amber-950/20 border-amber-500/30"
                      : "bg-slate-900/40 border-white/5 opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        node.status === "completed"
                          ? "bg-emerald-500 text-white"
                          : node.status === "current"
                          ? "bg-cyan-500 text-white animate-pulse"
                          : node.status === "recommended"
                          ? "bg-amber-500 text-slate-900"
                          : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      {node.status === "completed" ? "✓" : index + 1}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-white">{node.title}</h4>
                        <span
                          className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                            node.status === "completed"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : node.status === "current"
                              ? "bg-cyan-500/20 text-cyan-300"
                              : node.status === "recommended"
                              ? "bg-amber-500/20 text-amber-300"
                              : "bg-slate-800 text-slate-500"
                          }`}
                        >
                          {node.status}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          Weightage: {node.marksWeightage} Marks
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">{node.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {node.has3DModel && (
                      <span className="text-[10px] font-mono px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-cyan-300">
                        3D Model Active
                      </span>
                    )}
                    {activeWorldId === "biology" ? (
                      <Link
                        href="/learn/biology"
                        className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/30"
                      >
                        Explore 3D →
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveTab("cosmos");
                          setExploreMode("focused_world");
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-md shadow-violet-600/30"
                      >
                        Inspect Node →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. DAILY QUESTS & MISSIONS VIEW */}
        {activeTab === "daily_quests" && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 shadow-2xl animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-400" /> Daily Learning Quests &amp; Missions
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Complete personalized daily study missions to earn bonus XP and maintain your 7-day streak.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/30">
                <Flame className="w-4 h-4 text-rose-500" />
                <span>7-Day Active Streak</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dailyMissions.map((mission) => (
                <div
                  key={mission.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all ${
                    mission.isCompleted
                      ? "bg-emerald-950/20 border-emerald-500/30"
                      : "bg-slate-900/70 border-white/10 hover:border-amber-500/40"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        +{mission.xpReward} XP Reward
                      </span>
                      {mission.isCompleted ? (
                        <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-mono">
                          {mission.progress}/{mission.maxProgress}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-white">{mission.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{mission.description}</p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-cyan-400 font-mono uppercase">{mission.targetTopic}</span>
                    {mission.isCompleted ? (
                      <span className="text-xs font-bold text-emerald-400">XP Claimed ✓</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Link
                          href={mission.actionUrl}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md shadow-amber-600/30"
                        >
                          Start Quest →
                        </Link>
                        <button
                          onClick={() => completeDailyMission(mission.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300"
                          title="Mark test completed"
                        >
                          ✓
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. MY REVISIONS & SPACED REPETITION FLASHCARDS */}
        {activeTab === "revisions" && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 shadow-2xl animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-emerald-400" /> My Saved 3D Revisions &amp; Spaced Repetition
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Saved 3D objects and formulas scheduled for review via SM-2 spaced repetition intervals.
                </p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {savedRevisions.length} Concepts Scheduled
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedRevisions.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl glass-card border border-white/10 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        {rev.subjectId.toUpperCase()} • {rev.systemOrBranch}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Interval: {rev.intervalDays}d
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white">{rev.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-white/5">
                      {rev.formulaOrSummary}
                    </p>
                    <p className="text-[11px] text-amber-300 italic font-sans">
                      ⭐ {rev.examTip}
                    </p>
                  </div>

                  {/* SM-2 Spaced Repetition Rating Buttons */}
                  <div className="pt-2 border-t border-white/10 space-y-2">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block text-center">
                      Rate Recall Difficulty:
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => updateRevisionSchedule(rev.id, "hard")}
                        className="py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-300 text-xs font-semibold"
                      >
                        Hard (1d)
                      </button>
                      <button
                        onClick={() => updateRevisionSchedule(rev.id, "medium")}
                        className="py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900 border border-amber-500/30 text-amber-300 text-xs font-semibold"
                      >
                        Good ({Math.round(rev.intervalDays * 1.6)}d)
                      </button>
                      <button
                        onClick={() => updateRevisionSchedule(rev.id, "easy")}
                        className="py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 text-xs font-semibold"
                      >
                        Easy ({Math.round(rev.intervalDays * 2.5)}d)
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* AI STUDY GUIDE SLIDE-OUT DRAWER */}
      {isAiGuideOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-[#070b1b] border-l border-cyan-500/30 h-full flex flex-col p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-600/30 flex items-center justify-center border border-cyan-400/40">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">AI Study Guide Companion</h3>
                  <p className="text-[10px] text-cyan-400 font-mono">
                    Context: {activePortal.name} • {activePortal.currentChapter}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAiGuideOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
              {aiLoading ? (
                <div className="p-8 text-center space-y-2">
                  <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-slate-400">Synthesizing 3D context &amp; NCERT syllabus...</p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 text-xs leading-relaxed text-slate-200 whitespace-pre-wrap">
                  {aiGuideResponse || "Ask any question regarding the active 3D world, formulas, or board exam questions!"}
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10">
              <input
                type="text"
                placeholder="Ask AI Guide (e.g., 'Give me a 3-mark question on this')..."
                value={aiPromptInput}
                onChange={(e) => setAiPromptInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAskAIGuide(aiPromptInput)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={() => handleAskAIGuide(aiPromptInput)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 text-white font-bold text-xs shadow-lg shadow-cyan-600/30"
              >
                Send Question to AI
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
