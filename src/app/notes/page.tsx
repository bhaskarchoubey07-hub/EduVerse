"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  BookOpen,
  Sparkles,
  Layers,
  Flame,
  Bot,
  Brain,
  FileText,
  Bookmark,
  Trash2,
  ArrowRight,
  Plus,
  Zap,
  CheckCircle2,
  Clock,
  RotateCw,
  Filter,
  Check,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/lib/store/auth-context";
import { useDataStore } from "@/lib/store/data-store";
import { CHAPTERS, SUBJECTS } from "@/lib/data/mock-db";
import { formatDate } from "@/lib/utils";
import { Flashcard } from "@/types";

export default function NotesIndexPage() {
  const { user } = useAuth();
  const { notes, deleteNote, flashcardDeck, rateFlashcard } = useDataStore();
  const [activeTab, setActiveTab] = useState<"chapters" | "flashcards" | "saved">("chapters");
  const [flashcardFilter, setFlashcardFilter] = useState<"all" | "learning" | "review" | "mastered">("all");

  const filteredFlashcards = flashcardDeck.filter((card) => {
    if (flashcardFilter === "all") return true;
    return (card.status || "learning") === flashcardFilter;
  });

  const masteredCount = flashcardDeck.filter(c => c.status === "mastered").length;
  const reviewCount = flashcardDeck.filter(c => c.status === "review").length;
  const learningCount = flashcardDeck.filter(c => !c.status || c.status === "learning").length;

  return (
    <div className="min-h-screen bg-[#070a14] bg-grid-pattern flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            Chapter Revision, Formulas &amp; SM-2 Spaced Repetition
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Smart Revision Notes &amp; Memory Decks
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Concise 1-page summaries, high-yield formula sheets, adaptive SM-2 spaced repetition flashcards, and mnemonic memory tricks.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab("chapters")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "chapters"
                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30"
                : "glass-panel text-slate-400 hover:text-white"
            }`}
          >
            📚 Chapter Summaries &amp; Formulas
          </button>
          <button
            onClick={() => setActiveTab("flashcards")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "flashcards"
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/30"
                : "glass-panel text-slate-400 hover:text-white"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Spaced Repetition Decks ({flashcardDeck.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "saved"
                ? "bg-amber-600 text-white shadow-lg shadow-amber-500/30"
                : "glass-panel text-slate-400 hover:text-white"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved AI Notes ({notes.length})</span>
          </button>
        </div>

        {/* TAB 1: CHAPTER REVISION SUMMARIES */}
        {activeTab === "chapters" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
            {CHAPTERS.map((chapter) => (
              <div
                key={chapter.id}
                className="p-6 rounded-2xl glass-panel hover:border-violet-500/50 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-violet-500/20 text-violet-300">
                      Chapter {chapter.number.toString().padStart(2, "0")}
                    </span>
                    <span className="text-xs font-bold text-amber-400">
                      ~{chapter.marksWeightage} Marks
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white">{chapter.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{chapter.description}</p>

                  {/* Highlights tag */}
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {chapter.keyFormulas && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800">
                        ⚡ {chapter.keyFormulas.length} Core Formulas
                      </span>
                    )}
                    {chapter.mnemonics && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800">
                        🧠 {chapter.mnemonics.length} Mnemonics
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">⏱ {chapter.estimatedHours} hrs study</span>
                  <Link
                    href={`/notes/${chapter.id}`}
                    className="px-4 py-2 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 text-violet-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    Open Notes <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: FLASHCARDS INTERACTIVE DECK WITH SM-2 SPACED REPETITION */}
        {activeTab === "flashcards" && (
          <div className="space-y-6 animate-in fade-in">
            {/* Spaced repetition metrics strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl glass-panel border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Total Cards</div>
                  <div className="text-lg font-bold text-white">{flashcardDeck.length}</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl glass-panel border border-rose-500/20 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Learning</div>
                  <div className="text-lg font-bold text-rose-400">{learningCount}</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl glass-panel border border-amber-500/20 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <RotateCw className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">In Review</div>
                  <div className="text-lg font-bold text-amber-400">{reviewCount}</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl glass-panel border border-emerald-500/20 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Mastered</div>
                  <div className="text-lg font-bold text-emerald-400">{masteredCount}</div>
                </div>
              </div>
            </div>

            {/* Filter pills */}
            <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Filter by Memory Status:
                </span>
                <div className="flex gap-1.5">
                  {(["all", "learning", "review", "mastered"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setFlashcardFilter(mode)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        flashcardFilter === mode
                          ? "bg-cyan-500 text-slate-950 font-bold"
                          : "bg-white/5 text-slate-400 hover:text-white"
                      }`}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Showing {filteredFlashcards.length} cards
              </div>
            </div>

            {/* Grid of 3D Spaced Repetition Flashcards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFlashcards.map((fc) => (
                <FlashcardItem
                  key={fc.id}
                  flashcard={fc}
                  onRate={(rating) => rateFlashcard(fc.id, rating)}
                />
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SAVED STUDENT NOTES */}
        {activeTab === "saved" && (
          <div className="space-y-4 animate-in fade-in">
            {notes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                          {note.noteType.toUpperCase()}
                        </span>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="p-1 rounded text-slate-500 hover:text-rose-400"
                          title="Delete note"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <h4 className="font-bold text-sm text-white">{note.title}</h4>
                      <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-white/5 font-mono">
                        {note.content}
                      </p>
                    </div>

                    <div className="text-[10px] text-slate-500 font-mono">
                      Created: {formatDate(note.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 rounded-2xl glass-panel text-center space-y-3">
                <Bookmark className="w-10 h-10 text-slate-500 mx-auto" />
                <h4 className="text-sm font-bold text-white">No Saved Notes Yet</h4>
                <p className="text-xs text-slate-400">
                  When you chat with the AI Tutor, click &quot;Save Note&quot; on any useful explanation to pin it here.
                </p>
                <Link
                  href="/tutor"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold"
                >
                  <Bot className="w-4 h-4" /> Go to AI Tutor
                </Link>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

// Subcomponent for interactive 3D flip flashcard with SuperMemo-2 Spaced Repetition Rating
function FlashcardItem({
  flashcard,
  onRate,
}: {
  flashcard: Flashcard;
  onRate: (rating: "again" | "good" | "easy") => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const [ratedFeedback, setRatedFeedback] = useState<string | null>(null);

  const handleRate = (e: React.MouseEvent, rating: "again" | "good" | "easy") => {
    e.stopPropagation();
    onRate(rating);
    const text = rating === "again" ? "Review in 1 day" : rating === "good" ? "Review in ~3 days" : "Mastered! ~6+ days";
    setRatedFeedback(text);
    setTimeout(() => {
      setRatedFeedback(null);
      setFlipped(false);
    }, 1200);
  };

  const statusBadgeColor =
    flashcard.status === "mastered"
      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
      : flashcard.status === "review"
      ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
      : "bg-rose-500/20 text-rose-300 border-rose-500/30";

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className={`min-h-[260px] p-6 rounded-2xl glass-panel border transition-all duration-300 flex flex-col justify-between cursor-pointer select-none relative group ${
        flipped
          ? "border-cyan-500/50 bg-slate-900/90 shadow-2xl shadow-cyan-950/40"
          : "border-white/10 hover:border-violet-500/40 hover:scale-[1.01]"
      }`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
            {flashcard.tag}
          </span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${statusBadgeColor}`}>
            {flashcard.status ? flashcard.status.toUpperCase() : "LEARNING"}
          </span>
        </div>

        <span className="text-[10px] text-slate-400 group-hover:text-cyan-300 flex items-center gap-1 transition-colors">
          <Zap className="w-3 h-3 text-amber-400" />
          {flipped ? "Question View" : "Flip Answer"}
        </span>
      </div>

      {/* Card Core Content */}
      <div className="my-auto py-4 text-center px-2">
        {!flipped ? (
          <div className="space-y-3">
            <p className="text-sm font-bold text-white leading-relaxed">{flashcard.front}</p>
            <div className="text-[11px] text-slate-500 font-mono">
              Interval: {flashcard.intervalDays || 1}d • Next: {flashcard.nextReviewDate || "Today"}
            </div>
          </div>
        ) : (
          <div className="space-y-3 animate-in fade-in">
            <p className="text-sm font-bold text-emerald-300 leading-relaxed">{flashcard.back}</p>
            {flashcard.tip && (
              <p className="text-[11px] text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-white/5 italic">
                💡 {flashcard.tip}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Card Footer / Spaced Repetition Ratings */}
      <div className="pt-3 border-t border-white/5">
        {ratedFeedback ? (
          <div className="text-center text-xs font-bold text-cyan-400 flex items-center justify-center gap-1.5 py-1 animate-in zoom-in">
            <Check className="w-4 h-4 text-emerald-400" /> {ratedFeedback}
          </div>
        ) : flipped ? (
          <div className="space-y-2">
            <div className="text-[10px] text-slate-400 text-center font-semibold">
              Rate your recall difficulty (SM-2):
            </div>
            <div className="grid grid-cols-3 gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={(e) => handleRate(e, "again")}
                className="py-1.5 px-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-[10px] font-bold transition-all text-center cursor-pointer"
                title="Forgot or difficult (Reset interval to 1 day)"
              >
                Hard (1d)
              </button>
              <button
                onClick={(e) => handleRate(e, "good")}
                className="py-1.5 px-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold transition-all text-center cursor-pointer"
                title="Recalled with moderate effort"
              >
                Good (~3d)
              </button>
              <button
                onClick={(e) => handleRate(e, "easy")}
                className="py-1.5 px-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold transition-all text-center cursor-pointer"
                title="Instant effortless recall"
              >
                Easy (6d+)
              </button>
            </div>
          </div>
        ) : (
          <div className="text-[10px] text-slate-500 text-center font-mono flex items-center justify-center gap-1">
            <span>Tap card to reveal answer &amp; memory rating</span>
          </div>
        )}
      </div>
    </div>
  );
}
