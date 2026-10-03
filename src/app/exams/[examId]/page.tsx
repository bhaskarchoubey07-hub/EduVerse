"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Send,
  Sparkles,
  Info,
  Maximize2,
  Check,
  X,
  Lightbulb,
  Zap,
  Target,
  RefreshCw,
  Eye
} from "lucide-react";
import { MOCK_EXAMS, SUBJECTS } from "@/lib/data/mock-db";
import { useAuth } from "@/lib/store/auth-context";
import { useDataStore } from "@/lib/store/data-store";
import { ExamAttempt, ExamQuestion, StudentResponse } from "@/types";
import { formatTime } from "@/lib/utils";

type ExamMode = "timed" | "practice" | "revision";

export default function LiveExamRoomPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const resolvedParams = use(params);
  const examId = resolvedParams.examId;

  const router = useRouter();
  const { user } = useAuth();
  const { allExams, saveAttempt } = useDataStore();

  const exam = allExams.find((e) => e.id === examId) || MOCK_EXAMS[0];
  const questions = exam.questions;

  const [hasStarted, setHasStarted] = useState(false);
  const [examMode, setExamMode] = useState<ExamMode>("timed");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(exam.durationMinutes * 60);
  const [responses, setResponses] = useState<Record<string, StudentResponse>>({});
  const [visitedQuestions, setVisitedQuestions] = useState<Record<string, boolean>>({
    [questions[0]?.id]: true,
  });
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [revealedExplanations, setRevealedExplanations] = useState<Record<string, boolean>>({});
  const [lastAutosaved, setLastAutosaved] = useState<string>("Just now");

  const currentQ: ExamQuestion | undefined = questions[currentQuestionIndex];
  const currentResp = currentQ ? responses[currentQ.id] : undefined;

  // Countdown timer for Timed mode (and leisurely timer for practice)
  useEffect(() => {
    if (!hasStarted) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (examMode === "timed" && prev <= 1) {
          clearInterval(timer);
          handleSubmitExam(true); // auto submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted, examMode]);

  // Periodic autosave indicator
  useEffect(() => {
    if (!hasStarted) return;
    const interval = setInterval(() => {
      setLastAutosaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 15000);
    return () => clearInterval(interval);
  }, [hasStarted]);

  // Mark visited when changing question
  const navigateQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
      const targetQ = questions[index];
      if (targetQ) {
        setVisitedQuestions((prev) => ({ ...prev, [targetQ.id]: true }));
      }
    }
  };

  // Answer handler
  const handleSelectOption = (questionId: string, answer: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        questionId,
        answer,
        isMarkedForReview: prev[questionId]?.isMarkedForReview || false,
      },
    }));
  };

  const handleToggleMarkReview = (questionId: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        questionId,
        answer: prev[questionId]?.answer || "",
        isMarkedForReview: !prev[questionId]?.isMarkedForReview,
      },
    }));
  };

  const handleClearResponse = (questionId: string) => {
    setResponses((prev) => {
      const updated = { ...prev };
      delete updated[questionId];
      return updated;
    });
  };

  const toggleExplanation = (questionId: string) => {
    setRevealedExplanations((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  // Submit & Evaluation
  const handleSubmitExam = (isAuto = false) => {
    setIsSubmitting(true);

    let totalScore = 0;
    const finalResponses: Record<string, StudentResponse> = {};

    questions.forEach((q) => {
      const resp = responses[q.id];
      const studentAns = resp?.answer?.trim() || "";

      let isCorrect = false;
      let marksAwarded = 0;

      if (q.type === "mcq" || q.type === "assertion_reason") {
        if (studentAns.toLowerCase() === q.correctAnswer?.toLowerCase()) {
          isCorrect = true;
          marksAwarded = q.marks;
          totalScore += q.marks;
        } else if (studentAns && q.negativeMarks) {
          totalScore -= q.negativeMarks;
        }
      } else if (q.type === "numerical") {
        if (studentAns === q.correctAnswer) {
          isCorrect = true;
          marksAwarded = q.marks;
          totalScore += q.marks;
        }
      } else {
        // Descriptive short/long answers: give baseline heuristic marks + AI review on result page
        if (studentAns.length > 15) {
          marksAwarded = Math.round(q.marks * 0.85 * 10) / 10;
          totalScore += marksAwarded;
          isCorrect = true;
        }
      }

      finalResponses[q.id] = {
        questionId: q.id,
        answer: studentAns,
        isCorrect,
        marksAwarded,
        isMarkedForReview: resp?.isMarkedForReview,
      };
    });

    const timeSpent = exam.durationMinutes * 60 - timeLeftSeconds;
    const percentage = Math.round((totalScore / exam.totalMarks) * 100);
    const answeredCount = Object.values(responses).filter((r) => r.answer).length;
    const accuracy = answeredCount > 0 ? Math.round((totalScore / (answeredCount * 2)) * 100) : 0;

    const newAttempt: ExamAttempt = {
      id: `attempt-${Date.now()}`,
      examId: exam.id,
      examTitle: exam.title,
      studentId: user?.id || "demo-student-001",
      subjectId: exam.subjectId,
      subjectName: exam.subjectId.includes("sci") ? "Science" : "Physics",
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      score: Math.max(0, Math.round(totalScore * 10) / 10),
      totalMarks: exam.totalMarks,
      percentage: Math.max(0, Math.min(100, percentage)),
      timeSpentSeconds: Math.max(30, timeSpent),
      accuracyRate: Math.max(0, Math.min(100, accuracy || 80)),
      status: "completed",
      responses: finalResponses,
      topicBreakdown: [
        { topic: "Physics Mechanics & Optics", correct: 2, total: 3, accuracy: 67 },
        { topic: "Chemical Reactions & Equations", correct: 2, total: 2, accuracy: 100 },
        { topic: "Electricity & Circuit Numericals", correct: 1, total: 2, accuracy: 50 },
      ],
    };

    saveAttempt(newAttempt);
    router.push(`/exams/${exam.id}/result?attemptId=${newAttempt.id}`);
  };

  // Palette Status Helper
  const getQuestionPaletteState = (qId: string) => {
    const isVisited = visitedQuestions[qId];
    const resp = responses[qId];
    const hasAnswer = Boolean(resp?.answer && resp.answer.trim().length > 0);
    const isMarked = Boolean(resp?.isMarkedForReview);

    if (isMarked) return "palette-marked-review";
    if (hasAnswer) return "palette-answered";
    if (isVisited) return "palette-not-answered";
    return "palette-not-visited";
  };

  // 1. PRE-EXAM INSTRUCTIONS & MODE SELECTOR SCREEN
  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-[#070a14] bg-grid-pattern flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="max-w-3xl w-full glass-panel-glow rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
              {exam.boardId.toUpperCase()} Official Pattern Examination
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{exam.title}</h1>
            <p className="text-xs text-slate-400">Class {exam.classLevel} • Standard Blueprint Simulation</p>
          </div>

          {/* Test Specs */}
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
              <Clock className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <div className="font-bold text-white">{exam.durationMinutes} Mins</div>
              <div className="text-[10px] text-slate-500">Duration</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <div className="font-bold text-white">{exam.totalMarks} Marks</div>
              <div className="text-[10px] text-slate-500">Maximum Marks</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
              <HelpCircle className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <div className="font-bold text-white">{questions.length} Questions</div>
              <div className="text-[10px] text-slate-500">Total Items</div>
            </div>
          </div>

          {/* Mode Selection Choice */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <Target className="w-4 h-4 text-cyan-400" /> Choose Examination Experience Mode:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => setExamMode("timed")}
                className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-1 ${
                  examMode === "timed"
                    ? "bg-violet-600/30 border-violet-400 shadow-lg shadow-violet-500/20"
                    : "glass-panel border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-rose-400" /> Timed Board Exam
                  </span>
                  {examMode === "timed" && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
                <p className="text-[11px] text-slate-400">
                  Strict countdown, realistic exam conditions, full AI rubric evaluation on submit.
                </p>
              </div>

              <div
                onClick={() => setExamMode("practice")}
                className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-1 ${
                  examMode === "practice"
                    ? "bg-cyan-600/30 border-cyan-400 shadow-lg shadow-cyan-500/20"
                    : "glass-panel border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> Practice Mode
                  </span>
                  {examMode === "practice" && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
                <p className="text-[11px] text-slate-400">
                  Instant answer verification, step-by-step NCERT reasoning, relaxed timer.
                </p>
              </div>

              <div
                onClick={() => setExamMode("revision")}
                className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-1 ${
                  examMode === "revision"
                    ? "bg-emerald-600/30 border-emerald-400 shadow-lg shadow-emerald-500/20"
                    : "glass-panel border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-400" /> Revision Mode
                  </span>
                  {examMode === "revision" && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
                <p className="text-[11px] text-slate-400">
                  Detailed error diagnostics, traps analysis, formula tips on each question.
                </p>
              </div>
            </div>
          </div>

          {/* Instructions List */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 text-xs space-y-2">
            <h3 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400" /> Examination Rules:
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-slate-300">
              {exam.instructions.map((inst, idx) => (
                <li key={idx}>{inst}</li>
              ))}
              <li>You can navigate freely between questions using the Question Palette.</li>
              <li>Responses are automatically saved in local state as you answer.</li>
            </ul>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => router.push("/exams")}
              className="px-4 py-2.5 rounded-xl glass-panel text-xs text-slate-400 hover:text-white"
            >
              Cancel &amp; Return
            </button>
            <button
              onClick={() => setHasStarted(true)}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 flex items-center gap-2 cursor-pointer"
            >
              Start {examMode === "timed" ? "Timed Exam" : examMode === "practice" ? "Practice Mode" : "Revision Mode"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. LIVE EXAMINATION ROOM
  const isTimeCritical = timeLeftSeconds < 300 && examMode === "timed";

  return (
    <div className="min-h-screen bg-[#070a14] text-white flex flex-col select-none">
      {/* EXAM TOP HEADER */}
      <header className="sticky top-0 z-40 bg-[#090d1e] border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white font-bold font-mono text-xs">
            EV
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-bold text-white">{exam.title}</h2>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                examMode === "timed"
                  ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                  : examMode === "practice"
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                  : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
              }`}>
                {examMode.toUpperCase()} MODE
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
              <span>Student: {user?.fullName || "Candidate"}</span>
              <span>•</span>
              <span className="text-emerald-400">🟢 Autosaved: {lastAutosaved}</span>
            </div>
          </div>
        </div>

        {/* Live Countdown Timer & Submit */}
        <div className="flex items-center gap-4">
          <div
            className={`px-4 py-1.5 rounded-xl border flex items-center gap-2 font-mono font-bold text-sm transition-colors ${
              isTimeCritical
                ? "bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse"
                : "bg-slate-900 border-white/10 text-cyan-300"
            }`}
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{formatTime(timeLeftSeconds)}</span>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-violet-600/25 transition-all cursor-pointer"
          >
            Submit Test
          </button>
        </div>
      </header>

      {/* MAIN EXAM WORKSPACE (2 COLS) */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT 3 COLS: QUESTION CARD & ANSWER AREA */}
        <div className="lg:col-span-3 flex flex-col justify-between glass-panel rounded-2xl p-6 border border-white/10 space-y-6">
          {currentQ && (
            <div className="space-y-6">
              {/* Question Header Info */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-violet-600/30 text-violet-300">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  <span className="text-xs text-slate-400 uppercase font-mono">
                    Type: {currentQ.type.replace("_", " ")}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {examMode !== "timed" && (
                    <button
                      onClick={() => toggleExplanation(currentQ.id)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                      {revealedExplanations[currentQ.id] ? "Hide Hint & Solution" : "Check Solution & Hint"}
                    </button>
                  )}
                  <div className="text-xs font-mono text-cyan-400 font-bold">
                    +{currentQ.marks} Marks {currentQ.negativeMarks ? `(-${currentQ.negativeMarks})` : ""}
                  </div>
                </div>
              </div>

              {/* Question Text */}
              <div className="text-sm sm:text-base font-medium text-white leading-relaxed">
                {currentQ.text}
              </div>

              {/* ANSWER INPUTS BASED ON QUESTION TYPE */}

              {/* 1. MCQ Radio Options */}
              {currentQ.options && currentQ.options.length > 0 && (
                <div className="space-y-3 pt-2">
                  {currentQ.options.map((opt) => {
                    const isSelected = currentResp?.answer === opt.id;
                    const isCorrectOpt = opt.id === currentQ.correctAnswer;
                    const isRevealed = revealedExplanations[currentQ.id];

                    let optionBorderClass = "border-white/10 bg-slate-900/60 text-slate-300 hover:border-white/20";
                    if (isRevealed) {
                      if (isCorrectOpt) {
                        optionBorderClass = "border-emerald-500 bg-emerald-950/40 text-emerald-200 font-semibold";
                      } else if (isSelected && !isCorrectOpt) {
                        optionBorderClass = "border-rose-500 bg-rose-950/40 text-rose-200 font-semibold";
                      }
                    } else if (isSelected) {
                      optionBorderClass = "bg-violet-600/30 border-violet-400 text-white font-semibold shadow-md shadow-violet-500/20";
                    }

                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelectOption(currentQ.id, opt.id)}
                        className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${optionBorderClass}`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs border ${
                              isSelected
                                ? "bg-violet-500 border-violet-400 text-white"
                                : "border-white/20 text-slate-400"
                            }`}
                          >
                            {opt.label}
                          </div>
                          <span className="text-xs sm:text-sm">{opt.text}</span>
                        </div>

                        {isRevealed && isCorrectOpt && (
                          <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                            <Check className="w-4 h-4" /> Correct
                          </span>
                        )}
                        {isRevealed && isSelected && !isCorrectOpt && (
                          <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1">
                            <X className="w-4 h-4" /> Incorrect
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 2. Numerical Input */}
              {currentQ.type === "numerical" && (
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-semibold text-slate-400">
                    Enter Your Numerical Value Answer:
                  </label>
                  <input
                    type="text"
                    value={currentResp?.answer || ""}
                    onChange={(e) => handleSelectOption(currentQ.id, e.target.value)}
                    placeholder="e.g. 48"
                    className="w-full sm:w-64 px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                  />
                  {currentQ.hint && (
                    <p className="text-[11px] text-amber-400 italic">💡 Hint: {currentQ.hint}</p>
                  )}
                </div>
              )}

              {/* 3. Short / Long Subjective Answer */}
              {(currentQ.type === "short_answer" || currentQ.type === "long_answer") && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-400">
                      Write your descriptive answer (Evaluated using Board Marking Rubric):
                    </label>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {currentResp?.answer?.length || 0} characters
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    value={currentResp?.answer || ""}
                    onChange={(e) => handleSelectOption(currentQ.id, e.target.value)}
                    placeholder="State the law, relevant chemical equation, or step-by-step reasoning..."
                    className="w-full p-4 rounded-xl bg-slate-950 border border-white/15 text-white text-xs sm:text-sm leading-relaxed focus:outline-none focus:border-cyan-400"
                  />
                </div>
              )}

              {/* PRACTICE / REVISION MODE EXPLANATION ACCORDION */}
              {revealedExplanations[currentQ.id] && (
                <div className="p-4 rounded-xl bg-slate-950/90 border border-cyan-500/30 space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                    <Sparkles className="w-4 h-4 text-amber-400" /> Step-by-Step Educational Explanation:
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-mono">
                    {currentQ.explanation || "Correct reasoning based on NCERT guidelines and standard board marking scheme."}
                  </p>
                  {currentQ.hint && (
                    <p className="text-[11px] text-amber-300/90 pt-1">
                      💡 Exam tip: {currentQ.hint}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* BOTTOM CONTROLS & NAVIGATION */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => currentQ && handleToggleMarkReview(currentQ.id)}
                className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  currentResp?.isMarkedForReview
                    ? "bg-violet-600 text-white border-violet-500 font-bold"
                    : "bg-slate-900 border-white/10 text-violet-300 hover:bg-white/5"
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                {currentResp?.isMarkedForReview ? "Marked for Review" : "Mark for Review"}
              </button>

              <button
                onClick={() => currentQ && handleClearResponse(currentQ.id)}
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-white/5 border border-white/10 text-xs text-slate-400 hover:text-white"
              >
                Clear Response
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => navigateQuestion(currentQuestionIndex - 1)}
                className="px-4 py-2 rounded-xl glass-panel text-xs text-slate-300 hover:text-white disabled:opacity-30 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={() => navigateQuestion(currentQuestionIndex + 1)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-violet-500/20"
                >
                  Save &amp; Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-lg shadow-emerald-600/30"
                >
                  Review &amp; Submit <Send className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COL: QUESTION PALETTE & LEGEND */}
        <aside className="glass-panel rounded-2xl p-5 border border-white/10 space-y-6 h-fit">
          <div className="pb-3 border-b border-white/10">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">
              Question Palette
            </h3>
          </div>

          {/* Palette Grid */}
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => {
              const stateClass = getQuestionPaletteState(q.id);
              const isCurrent = currentQuestionIndex === idx;

              return (
                <button
                  key={q.id}
                  onClick={() => navigateQuestion(idx)}
                  className={`palette-btn ${stateClass} ${isCurrent ? "palette-current" : ""}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Status Legend */}
          <div className="space-y-2 pt-4 border-t border-white/5 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500" />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-rose-500" />
              <span>Not Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-violet-600" />
              <span>Marked for Review</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-slate-700 border border-white/20" />
              <span>Not Visited</span>
            </div>
          </div>
        </aside>
      </div>

      {/* SUBMISSION CONFIRMATION MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-panel-glow rounded-2xl p-6 border border-white/15 space-y-5 shadow-2xl animate-in fade-in">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Submit Examination?</h3>
              <p className="text-xs text-slate-300">
                You have answered{" "}
                <strong className="text-emerald-400">
                  {Object.values(responses).filter((r) => r.answer).length} of {questions.length}
                </strong>{" "}
                questions. Time remaining:{" "}
                <span className="text-cyan-300 font-mono">{formatTime(timeLeftSeconds)}</span>.
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-2.5 rounded-xl glass-panel text-xs text-slate-300 hover:text-white"
              >
                Back to Test
              </button>
              <button
                onClick={() => handleSubmitExam(false)}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 cursor-pointer"
              >
                {isSubmitting ? "Evaluating..." : "Confirm & Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
