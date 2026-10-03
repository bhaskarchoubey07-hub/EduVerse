"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  RotateCcw,
  Plus,
  ArrowRight,
  HelpCircle,
  TrendingUp,
  Target,
  Bot,
  Layers,
  AlertCircle,
  CalendarCheck,
} from "lucide-react";
import { useAuth } from "@/lib/store/auth-context";
import { useDataStore } from "@/lib/store/data-store";
import { StudyTask, TaskType } from "@/types";
import { getDaysUntil, formatDate } from "@/lib/utils";

export default function AdaptiveStudyPlannerPage() {
  const { user } = useAuth();
  const { tasks, toggleTaskCompleted, addCustomTask, rescheduleTask } = useDataStore();

  const [availableDailyHours, setAvailableDailyHours] = useState(2.5);
  const [selectedDayFilter, setSelectedDayFilter] = useState<"today" | "week" | "all">("today");
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("Science");
  const [newDuration, setNewDuration] = useState(30);
  const [newTaskType, setNewTaskType] = useState<TaskType>("concept_learning");

  const todayStr = new Date().toISOString().split("T")[0];
  const daysLeft = user?.targetExamDate ? getDaysUntil(user.targetExamDate) : 130;

  const filteredTasks = tasks.filter((t) => {
    if (selectedDayFilter === "today") return t.scheduledDate === todayStr;
    return true;
  });

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const totalMinutesPlanned = tasks.reduce((acc, t) => acc + (t.isCompleted ? 0 : t.estimatedMinutes), 0);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addCustomTask({
      title: newTitle.trim(),
      subjectId: "cbse-10-sci",
      subjectName: newSubject,
      chapterTitle: "Custom Study Session",
      taskType: newTaskType,
      estimatedMinutes: newDuration,
      isCompleted: false,
      scheduledDate: todayStr,
      priority: "medium",
      reasonRecommended: "Student custom scheduled goal.",
      actionUrl: "/tutor",
    });

    setNewTitle("");
    setShowAddTaskModal(false);
  };

  return (
    <div className="min-h-screen bg-[#070a14] bg-grid-pattern flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* TOP HERO BANNER */}
        <div className="rounded-3xl glass-panel-glow p-6 sm:p-8 border border-white/10 space-y-4 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Adaptive AI Study Engine
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {daysLeft} Days to {user?.boardId?.toUpperCase() || "CBSE"} Board Exams
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
                Personalized Adaptive Study Roadmap
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Dynamically adjusted based on your target exam date, chapter completion pace, and diagnostic mock test weak spots.
              </p>
            </div>

            {/* Quick Summary Pill */}
            <div className="flex items-center gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-center min-w-[110px]">
                <div className="text-2xl font-black text-cyan-400 font-mono">
                  {completedCount} / {tasks.length}
                </div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Tasks Completed</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-center min-w-[110px]">
                <div className="text-2xl font-black text-amber-400 font-mono">
                  {Math.round(totalMinutesPlanned / 60 * 10) / 10}h
                </div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Time Pending</div>
              </div>
            </div>
          </div>

          {/* Daily Availability Slider */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-400 font-semibold">Available Daily Study Hours:</span>
              <input
                type="range"
                min="1.0"
                max="6.0"
                step="0.5"
                value={availableDailyHours}
                onChange={(e) => setAvailableDailyHours(parseFloat(e.target.value))}
                className="accent-cyan-400 cursor-pointer"
              />
              <span className="font-mono font-bold text-cyan-300">{availableDailyHours} hrs / day</span>
            </div>

            <button
              onClick={() => setShowAddTaskModal(true)}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-violet-600/25 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Custom Goal
            </button>
          </div>
        </div>

        {/* TASK VIEW FILTER TABS */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedDayFilter("today")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedDayFilter === "today"
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-500/25"
                  : "glass-panel text-slate-400 hover:text-white"
              }`}
            >
              Today&apos;s Focus Schedule
            </button>
            <button
              onClick={() => setSelectedDayFilter("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedDayFilter === "all"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                  : "glass-panel text-slate-400 hover:text-white"
              }`}
            >
              All Scheduled Tasks ({tasks.length})
            </button>
          </div>

          <span className="text-xs text-slate-400 hidden sm:inline">
            💡 Tap checkbox to mark task as done and earn +50 XP
          </span>
        </div>

        {/* ADAPTIVE TASKS LIST */}
        <div className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`p-5 rounded-2xl glass-panel border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  task.isCompleted
                    ? "border-emerald-500/30 bg-emerald-950/10 opacity-75"
                    : task.priority === "high"
                    ? "border-amber-500/40 bg-[#0d132b]"
                    : "border-white/10"
                }`}
              >
                {/* Left: Checkbox & Info */}
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleTaskCompleted(task.id)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-1 border transition-all cursor-pointer ${
                      task.isCompleted
                        ? "bg-emerald-500 border-emerald-400 text-white shadow-md shadow-emerald-500/30"
                        : "border-white/20 hover:border-cyan-400 text-transparent"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-cyan-300">
                        {task.subjectName}
                      </span>
                      <span className="text-xs font-bold text-white leading-tight">
                        {task.title}
                      </span>
                      {task.priority === "high" && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
                          HIGH PRIORITY
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-amber-300/90 italic flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                      <strong>AI Reason:</strong> {task.reasonRecommended}
                    </p>
                  </div>
                </div>

                {/* Right: Duration & Action button */}
                <div className="flex items-center gap-3 shrink-0 ml-10 sm:ml-0">
                  <div className="text-right text-xs font-mono text-slate-400">
                    ⏱ {task.estimatedMinutes} mins
                  </div>

                  <Link
                    href={task.actionUrl}
                    className="px-4 py-2 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <span>Start Activity</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 rounded-2xl glass-panel text-center space-y-3">
              <CalendarCheck className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white">All Tasks Completed For Today!</h3>
              <p className="text-xs text-slate-400">
                You have finished your planned study sessions. Great discipline!
              </p>
            </div>
          )}
        </div>

        {/* ADD TASK MODAL */}
        {showAddTaskModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="max-w-md w-full glass-panel-glow rounded-2xl p-6 border border-white/15 space-y-4 shadow-2xl animate-in fade-in">
              <h3 className="text-base font-bold text-white">Schedule Custom Study Goal</h3>

              <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Goal Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Optics Ray Diagrams Practice"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Subject</label>
                    <select
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-white/10 text-white"
                    >
                      <option value="Science">Science</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Duration (Mins)</label>
                    <input
                      type="number"
                      value={newDuration}
                      onChange={(e) => setNewDuration(Number(e.target.value))}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddTaskModal(false)}
                    className="px-4 py-2 rounded-xl glass-panel text-slate-400 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-cyan-600 text-white font-bold text-xs shadow-md shadow-cyan-600/30"
                  >
                    Add Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
