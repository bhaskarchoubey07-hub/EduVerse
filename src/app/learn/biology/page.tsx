"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Heart,
  Activity,
  Wind,
  Utensils,
  Brain,
  Shield,
  Layers,
  Sparkles,
  Bot,
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff,
  CheckCircle2,
  HelpCircle,
  Award,
  Search,
  BookOpen,
  ArrowRight,
  Maximize2,
  Settings,
  Flame,
  Check,
  X,
  Volume2,
  RefreshCw,
  Info,
  ChevronRight,
  Compass
} from "lucide-react";
import { useAuth } from "@/lib/store/auth-context";
import { useDataStore } from "@/lib/store/data-store";
import {
  BodySystemType,
  LabViewMode,
  CellType,
  ANATOMICAL_STRUCTURES,
  CELL_ORGANELLES,
  BLOOD_FLOW_SEQUENCE,
  BIOLOGY_3D_QUIZZES,
  BIOLOGY_CHAPTER_MAPPINGS,
  AnatomicalStructure,
  CellOrganelle,
  Biology3DQuiz,
} from "@/lib/data/biology-data";
import { BiologyLab3D } from "@/components/3d/BiologyLab3D";
import { BiologyDiagram2D } from "@/components/biology/BiologyDiagram2D";

export default function BiologyLabPage() {
  const { user } = useAuth();
  const { unlockAchievement, userSettings, saveNote } = useDataStore();

  // Lab Navigation States
  const [viewMode, setViewMode] = useState<LabViewMode>("human_body");
  const [system, setSystem] = useState<BodySystemType>("skeletal");
  const [cellType, setCellType] = useState<CellType>("animal_cell");
  const [selectedStructureId, setSelectedStructureId] = useState<string | null>("femur");
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [use2DDiagram, setUse2DDiagram] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Blood Flow Animation States (Heart Circuit)
  const [bloodFlowActive, setBloodFlowActive] = useState<boolean>(false);
  const [bloodFlowStep, setBloodFlowStep] = useState<number>(1);

  // Respiratory & Digestive Animation States
  const [breathingActive, setBreathingActive] = useState<boolean>(true);
  const [foodJourneyActive, setFoodJourneyActive] = useState<boolean>(false);
  const [foodJourneyStep, setFoodJourneyStep] = useState<number>(1);

  // 3D In-Scene Quiz States
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  // Context-Aware AI Tutor Drawer State
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [aiContextPrompt, setAiContextPrompt] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [noteSaved, setNoteSaved] = useState<boolean>(false);

  // Explored structures counter for achievement
  const [exploredCount, setExploredCount] = useState<number>(1);

  // Active Selected Structure Object
  const currentStructure =
    ANATOMICAL_STRUCTURES.find((s) => s.id === selectedStructureId) ||
    CELL_ORGANELLES.find((o) => o.id === selectedStructureId) ||
    ANATOMICAL_STRUCTURES[10]; // Femur default

  const currentQuiz: Biology3DQuiz = BIOLOGY_3D_QUIZZES[currentQuizIndex] || BIOLOGY_3D_QUIZZES[0];

  // Auto-progress blood flow animation if active
  useEffect(() => {
    if (!bloodFlowActive) return;
    const timer = setInterval(() => {
      setBloodFlowStep((prev) => (prev >= 10 ? 1 : prev + 1));
    }, 2800);
    return () => clearInterval(timer);
  }, [bloodFlowActive]);

  // Handle user structure selection
  const handleSelectStructure = (structId: string) => {
    setSelectedStructureId(structId);
    setExploredCount((prev) => {
      const next = prev + 1;
      if (next >= 10) {
        unlockAchievement("ANATOMY_EXPLORER");
      }
      return next;
    });

    // In Quiz Mode, check if the clicked structure matches the quiz target
    if (viewMode === "quiz_mode") {
      if (structId === currentQuiz.targetStructureId) {
        setQuizScore((prev) => prev + currentQuiz.marks);
        setQuizFeedback({
          isCorrect: true,
          message: `✓ Correct! You identified the ${currentQuiz.targetName}. (+${currentQuiz.marks} Marks)`,
        });
      } else {
        setQuizFeedback({
          isCorrect: false,
          message: `Try again! That is not the ${currentQuiz.targetName}. Hint: ${currentQuiz.hint}`,
        });
      }
    }
  };

  // Trigger Context-Aware AI Tutor Request
  const handleAskAI = async (customPrompt?: string) => {
    setIsAiDrawerOpen(true);
    setAiLoading(true);
    setNoteSaved(false);

    const promptText =
      customPrompt ||
      `Explain the ${currentStructure.name} in the human ${system} system for class 10/12 board exams, its biological function, and high-yield NCERT exam questions.`;

    setAiContextPrompt(promptText);

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          mode: "explain",
          subjectId: "cbse-10-sci",
          chapterId: "life_processes",
          context: `Human Biology 3D Lab: System=${system}, Selected=${currentStructure.name}`,
        }),
      });
      const data = await res.json();
      setAiResponse(data.reply || data.response || "No response received.");
    } catch (err) {
      setAiResponse(
        `### ${currentStructure.name} (NCERT High-Yield Focus)\n\n**Location:** ${"location" in currentStructure ? currentStructure.location : "Cellular Organelle"}\n\n**Primary Biological Function:** ${currentStructure.function}\n\n**Board Exam Key Takeaway:** This structure is essential for physiological balance and appears frequently in 2-mark reasoning and diagram identification questions.`
      );
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveToNotes = () => {
    saveNote({
      studentId: user?.id || "demo-student-001",
      title: `3D Biology: ${currentStructure.name}`,
      subjectId: "cbse-10-sci",
      chapterId: "life_processes",
      content: `${currentStructure.name}\nFunction: ${currentStructure.function}\n\nAI Insights:\n${aiResponse}`,
      noteType: "ai_generated",
    });
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2500);
  };

  // Filter bones or structures by search term
  const filteredBones = ANATOMICAL_STRUCTURES.filter(
    (s) =>
      s.system === system &&
      (s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#050711] text-white flex flex-col select-none overflow-x-hidden">
      <Navbar />

      {/* TOP LAB NAVIGATION & CONTROLS HEADER */}
      <header className="sticky top-16 z-30 bg-[#070b1b]/95 backdrop-blur-md border-b border-cyan-500/20 px-4 sm:px-8 py-3 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Left Title & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
                  3D Futuristic Biology Laboratory
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  FLAGSHIP 3D WORLD
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                <span>Subject: Biology</span>
                <span>•</span>
                <span className="text-cyan-400">
                  AI Context: {system.toUpperCase()} → {currentStructure.name.split(" ")[0]}
                </span>
              </div>
            </div>
          </div>

          {/* Center Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => setViewMode("human_body")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "human_body"
                  ? "bg-gradient-to-r from-cyan-600 to-teal-500 text-white shadow-lg shadow-cyan-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> Human Body 3D
            </button>
            <button
              onClick={() => setViewMode("cell_lab")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "cell_lab"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Microscopic Cell Lab
            </button>
            <button
              onClick={() => setViewMode("quiz_mode")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "quiz_mode"
                  ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Award className="w-3.5 h-3.5" /> 3D Quiz Challenge
            </button>
          </div>

          {/* Right Tools & 2D Fallback */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                showLabels
                  ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                  : "glass-panel border-white/10 text-slate-400 hover:text-white"
              }`}
              title="Toggle 3D Labels"
            >
              {showLabels ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{showLabels ? "Labels ON" : "Labels OFF"}</span>
            </button>

            <button
              onClick={() => setUse2DDiagram(!use2DDiagram)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                use2DDiagram
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                  : "glass-panel border-white/10 text-slate-400 hover:text-white"
              }`}
              title="Toggle 2D Accessible Diagram"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>{use2DDiagram ? "3D Mode" : "2D Diagram"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN LAB WORKSPACE */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: HOLOGRAPHIC SYSTEM SELECTOR & BONE SEARCH (3 COLS) */}
        <aside className="lg:col-span-3 space-y-4">
          {viewMode === "human_body" ? (
            <div className="glass-panel rounded-2xl p-4 border border-cyan-500/20 space-y-3 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" /> Body Systems
                </span>
                <span className="text-[10px] text-slate-400 font-mono">6 Layers</span>
              </div>

              {/* System Buttons */}
              <div className="space-y-1.5">
                {[
                  { id: "skeletal", label: "Skeletal System", icon: Shield, color: "text-slate-200" },
                  { id: "circulatory", label: "Circulatory & Heart", icon: Heart, color: "text-rose-400" },
                  { id: "respiratory", label: "Respiratory System", icon: Wind, color: "text-cyan-400" },
                  { id: "digestive", label: "Digestive System", icon: Utensils, color: "text-amber-400" },
                  { id: "nervous", label: "Nervous & Brain", icon: Brain, color: "text-violet-400" },
                  { id: "muscular", label: "Muscular Silhouette", icon: Activity, color: "text-emerald-400" },
                ].map((sys) => {
                  const Icon = sys.icon;
                  const isActive = system === sys.id;
                  return (
                    <button
                      key={sys.id}
                      onClick={() => {
                        setSystem(sys.id as BodySystemType);
                        const firstStruct = ANATOMICAL_STRUCTURES.find((s) => s.system === sys.id);
                        if (firstStruct) setSelectedStructureId(firstStruct.id);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                        isActive
                          ? "bg-gradient-to-r from-cyan-600/40 to-teal-600/30 border border-cyan-400 text-white shadow-md shadow-cyan-500/20"
                          : "bg-slate-900/60 border border-white/5 text-slate-300 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${sys.color}`} />
                        <span>{sys.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Bone Search for Skeletal */}
              {system === "skeletal" && (
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search Bone e.g. Femur..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                    {filteredBones.map((bone) => (
                      <button
                        key={bone.id}
                        onClick={() => handleSelectStructure(bone.id)}
                        className={`w-full p-2 rounded-lg text-left text-[11px] transition-all flex items-center justify-between cursor-pointer ${
                          selectedStructureId === bone.id
                            ? "bg-violet-600/40 border border-violet-400 text-white font-bold"
                            : "hover:bg-white/5 text-slate-300"
                        }`}
                      >
                        <span className="truncate">{bone.name.split(" ")[0]}</span>
                        <span className="text-[9px] font-mono text-slate-500">{bone.category.split(" ")[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : viewMode === "cell_lab" ? (
            <div className="glass-panel rounded-2xl p-4 border border-emerald-500/20 space-y-3 shadow-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5 pb-2 border-b border-white/10">
                <Sparkles className="w-3.5 h-3.5" /> Cell Specimen Type
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setCellType("animal_cell")}
                  className={`p-3 rounded-xl text-center text-xs font-bold transition-all cursor-pointer ${
                    cellType === "animal_cell"
                      ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/30"
                      : "glass-panel text-slate-400 hover:text-white"
                  }`}
                >
                  Animal Cell
                </button>
                <button
                  onClick={() => setCellType("plant_cell")}
                  className={`p-3 rounded-xl text-center text-xs font-bold transition-all cursor-pointer ${
                    cellType === "plant_cell"
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                      : "glass-panel text-slate-400 hover:text-white"
                  }`}
                >
                  Plant Cell
                </button>
              </div>

              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] text-slate-400 font-semibold">Cell Organelles:</span>
                {CELL_ORGANELLES.filter(
                  (o) => o.cellType === "both" || o.cellType === (cellType === "animal_cell" ? "animal" : "plant")
                ).map((org) => (
                  <button
                    key={org.id}
                    onClick={() => handleSelectStructure(org.id)}
                    className={`w-full p-2 rounded-xl text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                      selectedStructureId === org.id
                        ? "bg-emerald-600/40 border border-emerald-400 text-white font-bold"
                        : "glass-panel text-slate-300 hover:text-white"
                    }`}
                  >
                    <span>{org.name.split(" ")[0]}</span>
                    {selectedStructureId === org.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* QUIZ CHALLENGE CONTROL CARD */
            <div className="glass-panel rounded-2xl p-4 border border-violet-500/20 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-300 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> 3D Quiz Target
                </span>
                <span className="text-xs font-mono font-bold text-amber-400">Score: {quizScore} XP</span>
              </div>

              <div className="p-3.5 rounded-xl bg-violet-950/40 border border-violet-500/30 space-y-2">
                <div className="text-[10px] font-mono text-cyan-300 font-bold">
                  Question {currentQuizIndex + 1} of {BIOLOGY_3D_QUIZZES.length}
                </div>
                <h4 className="text-xs font-bold text-white leading-relaxed">{currentQuiz.question}</h4>
                <p className="text-[10px] text-slate-400 italic">💡 Hint: {currentQuiz.hint}</p>
              </div>

              {quizFeedback && (
                <div
                  className={`p-3 rounded-xl border text-xs font-medium animate-in zoom-in ${
                    quizFeedback.isCorrect
                      ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                      : "bg-rose-950/60 border-rose-500/40 text-rose-300"
                  }`}
                >
                  {quizFeedback.message}
                </div>
              )}

              <div className="flex items-center justify-between gap-2 pt-2">
                <button
                  disabled={currentQuizIndex === 0}
                  onClick={() => {
                    setCurrentQuizIndex((prev) => prev - 1);
                    setQuizFeedback(null);
                  }}
                  className="px-3 py-1.5 rounded-xl glass-panel text-xs text-slate-300 hover:text-white disabled:opacity-30"
                >
                  Previous
                </button>
                <button
                  disabled={currentQuizIndex >= BIOLOGY_3D_QUIZZES.length - 1}
                  onClick={() => {
                    setCurrentQuizIndex((prev) => prev + 1);
                    setQuizFeedback(null);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 disabled:opacity-30"
                >
                  Next Target →
                </button>
              </div>
            </div>
          )}

          {/* NCERT Board Chapter Linker */}
          <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-2 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-cyan-400" /> NCERT Chapter Syllabus:
            </span>
            <div className="font-semibold text-white">Class 10: Life Processes (~9 Marks)</div>
            <p className="text-[11px] text-slate-400">
              Covers double circulation in humans, alveolar gas exchange, and nephron filtration.
            </p>
          </div>
        </aside>

        {/* CENTER/MAIN 3D VIEWPORT (6 COLS) */}
        <section className="lg:col-span-6 flex flex-col space-y-4">
          <div className="h-[540px] w-full relative">
            {use2DDiagram ? (
              <div className="w-full h-full rounded-3xl glass-panel border border-cyan-500/20 overflow-hidden shadow-2xl">
                <BiologyDiagram2D
                  system={system}
                  selectedStructureId={selectedStructureId}
                  onSelectStructure={handleSelectStructure}
                  viewMode={viewMode}
                  cellType={cellType}
                />
              </div>
            ) : (
              <BiologyLab3D
                system={system}
                selectedStructureId={selectedStructureId}
                onSelectStructure={handleSelectStructure}
                showLabels={showLabels}
                viewMode={viewMode}
                cellType={cellType}
                bloodFlowActive={bloodFlowActive}
                bloodFlowStep={bloodFlowStep}
                breathingActive={breathingActive}
                foodJourneyActive={foodJourneyActive}
                foodJourneyStep={foodJourneyStep}
                graphicIntensity={userSettings.graphicIntensity}
                onWebGLFallback={() => setUse2DDiagram(true)}
              />
            )}
          </div>

          {/* DYNAMIC SYSTEM ANIMATION CONTROLS */}
          {system === "circulatory" && viewMode === "human_body" && (
            <div className="p-4 rounded-2xl glass-panel-glow border border-rose-500/30 space-y-3 shadow-xl animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-400 animate-pulse" />
                  <span className="font-bold text-xs text-white uppercase tracking-wider">
                    Double Blood Flow Circuit Simulation
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setBloodFlowActive(!bloodFlowActive)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      bloodFlowActive
                        ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30"
                        : "bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
                    }`}
                  >
                    {bloodFlowActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>{bloodFlowActive ? "Pause Flow" : "Play Blood Flow"}</span>
                  </button>
                  <button
                    onClick={() => setBloodFlowStep(1)}
                    className="p-1.5 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white"
                    title="Restart flow sequence"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Active Step Telemetry */}
              {BLOOD_FLOW_SEQUENCE[bloodFlowStep - 1] && (
                <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-cyan-300 text-[11px]">
                      Step {bloodFlowStep} of 10: {BLOOD_FLOW_SEQUENCE[bloodFlowStep - 1].from} →{" "}
                      {BLOOD_FLOW_SEQUENCE[bloodFlowStep - 1].to}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        BLOOD_FLOW_SEQUENCE[bloodFlowStep - 1].bloodType === "oxygenated"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      }`}
                    >
                      {BLOOD_FLOW_SEQUENCE[bloodFlowStep - 1].bloodType.toUpperCase()} BLOOD
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {BLOOD_FLOW_SEQUENCE[bloodFlowStep - 1].description}
                  </p>
                  <div className="text-[10px] text-slate-400 font-mono flex items-center gap-3 pt-1">
                    <span>⚡ Pressure: {BLOOD_FLOW_SEQUENCE[bloodFlowStep - 1].pressure}</span>
                    <span>•</span>
                    <span>🚪 Valve: {BLOOD_FLOW_SEQUENCE[bloodFlowStep - 1].valveAction}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {system === "respiratory" && viewMode === "human_body" && (
            <div className="p-4 rounded-2xl glass-panel border border-cyan-500/30 space-y-2 text-xs animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Wind className="w-4 h-4" /> Alveolar Gas Exchange Dynamics
                </span>
                <button
                  onClick={() => setBreathingActive(!breathingActive)}
                  className="px-3 py-1 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 font-semibold text-[11px]"
                >
                  {breathingActive ? "Pause Respiration" : "Resume Respiration"}
                </button>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Inhalation: Diaphragm flattens + Intercostal muscles contract $\rightarrow$ Thoracic cage expands $\rightarrow$
                Pressure drops $\rightarrow$ $O_2$ diffuses across thin squamous alveolar epithelium (~0.2 µm) into blood hemoglobin.
              </p>
            </div>
          )}
        </section>

        {/* RIGHT COLUMN: STRUCTURE INFO PANEL & AI TUTOR ACCESS (3 COLS) */}
        <aside className="lg:col-span-3 space-y-4">
          {/* Active Structure Card */}
          <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 space-y-4 shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                  {"category" in currentStructure ? currentStructure.category : "Organelle"}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">3D Verified</span>
              </div>
              <h3 className="text-base font-extrabold text-white">{currentStructure.name}</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                  Biological Function:
                </span>
                <p className="text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-white/5">
                  {currentStructure.function}
                </p>
              </div>

              {"location" in currentStructure && (
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">
                    Anatomical Location:
                  </span>
                  <p className="text-slate-300 text-[11px] font-mono">{currentStructure.location}</p>
                </div>
              )}

              {"boardExamTips" in currentStructure && (
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-1">
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                    ⭐ Board Exam Focus:
                  </span>
                  <p className="text-[11px] text-amber-200/90 leading-snug">{currentStructure.boardExamTips}</p>
                </div>
              )}
            </div>

            {/* Quick Action Triggers */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => handleAskAI()}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-violet-500/20 cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5" /> Ask AI Tutor
              </button>

              <button
                onClick={() => {
                  setViewMode("quiz_mode");
                  const qIdx = BIOLOGY_3D_QUIZZES.findIndex((q) => q.targetStructureId === currentStructure.id);
                  if (qIdx !== -1) setCurrentQuizIndex(qIdx);
                }}
                className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-white/10 border border-white/10 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" /> Quiz Me
              </button>
            </div>
          </div>

          {/* Gamification Progress Widget */}
          <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-300 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-500" /> Anatomy Mastery
              </span>
              <span className="text-cyan-400 font-mono font-bold">{exploredCount}/10 Explored</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (exploredCount / 10) * 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400">
              Explore 10 anatomical structures in 3D to unlock the <strong>Anatomy Explorer</strong> achievement (+300 XP).
            </p>
          </div>
        </aside>
      </main>

      {/* CONTEXT-AWARE AI TUTOR SIDE DRAWER */}
      {isAiDrawerOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-[#080d22]/98 backdrop-blur-2xl border-l border-cyan-500/30 p-6 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          <div className="space-y-4">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">AI Biology Companion</h3>
                  <div className="text-[10px] font-mono text-cyan-300">
                    Context: {system.toUpperCase()} → {currentStructure.name}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsAiDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Contextual Response */}
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-mono text-slate-300">
                💬 <strong>Inquiry:</strong> {aiContextPrompt}
              </div>

              <div className="max-h-[360px] overflow-y-auto p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/20 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans space-y-2 custom-scrollbar">
                {aiLoading ? (
                  <div className="py-8 flex flex-col items-center justify-center space-y-3 text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
                    <span>Analyzing 3D anatomical context &amp; NCERT syllabus...</span>
                  </div>
                ) : (
                  aiResponse
                )}
              </div>
            </div>
          </div>

          {/* Drawer Actions */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <button
              onClick={handleSaveToNotes}
              className="w-full py-2.5 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/40 text-amber-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {noteSaved ? <Check className="w-4 h-4 text-emerald-400" /> : <BookOpen className="w-4 h-4" />}
              <span>{noteSaved ? "Saved to Revision Notes!" : "Save Explanation to Notes"}</span>
            </button>

            <button
              onClick={() => handleAskAI(`Give me 3 high-yield NCERT board exam questions on ${currentStructure.name}`)}
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-white/10 border border-white/10 text-xs text-cyan-300 font-semibold"
            >
              ⭐ Generate 3 High-Yield Board Questions
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
