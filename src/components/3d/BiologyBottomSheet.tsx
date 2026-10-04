"use client";

import React, { useState } from "react";
import {
  X,
  Bot,
  Award,
  BookOpen,
  ChevronDown,
  Sparkles,
  Check,
  Flame,
} from "lucide-react";
import { AnatomicalStructure, CellOrganelle } from "@/lib/data/biology-data";

interface BiologyBottomSheetProps {
  structure: AnatomicalStructure | CellOrganelle | null;
  isOpen: boolean;
  onClose: () => void;
  onAskAI: () => void;
  onQuizMe: () => void;
  onSaveToNotes: () => void;
  noteSaved: boolean;
}

export function BiologyBottomSheet({
  structure,
  isOpen,
  onClose,
  onAskAI,
  onQuizMe,
  onSaveToNotes,
  noteSaved,
}: BiologyBottomSheetProps) {
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  if (!isOpen || !structure) return null;

  const isOrganelle = !("category" in structure);
  const categoryLabel = isOrganelle ? "Cell Organelle" : (structure as AnatomicalStructure).category;
  const locationLabel = "location" in structure ? (structure as AnatomicalStructure).location : null;
  const boardTips = "boardExamTips" in structure ? (structure as AnatomicalStructure).boardExamTips : null;

  // Touch gesture to swipe down and dismiss
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const currentY = e.touches[0].clientY;
    if (currentY - touchStartY > 60) {
      onClose();
      setTouchStartY(null);
    }
  };

  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#080d22]/98 backdrop-blur-2xl border-t border-cyan-500/30 rounded-t-3xl shadow-[0_-12px_40px_rgba(0,0,0,0.8)] pb-safe animate-slide-up transition-all"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Drag Handle */}
      <div className="w-full flex items-center justify-center pt-2 pb-1 cursor-grab">
        <div className="w-12 h-1.5 rounded-full bg-white/20" />
      </div>

      <div className="px-5 pt-1 pb-4 space-y-3 max-h-[75vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                {categoryLabel}
              </span>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> 3D Selected
              </span>
            </div>
            <h3 className="text-lg font-black text-white">{structure.name}</h3>
            {locationLabel && (
              <p className="text-[11px] text-slate-400 font-mono">{locationLabel}</p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white touch-target flex items-center justify-center"
            aria-label="Close bottom sheet"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* Function Description */}
        <div className="bg-slate-950/70 p-3 rounded-2xl border border-white/5 text-xs text-slate-200 leading-relaxed">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
            Biological Function:
          </span>
          {structure.function}
        </div>

        {/* Board Exam High Yield Tip */}
        {boardTips && (
          <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200/90 leading-snug space-y-1">
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
              ⭐ NCERT Board Exam Focus:
            </span>
            <p className="text-[11px]">{boardTips}</p>
          </div>
        )}

        {/* Quick Action Touch Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={onAskAI}
            className="py-3 px-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-md shadow-violet-500/20 touch-target"
          >
            <Bot className="w-4 h-4" />
            <span>ASK AI</span>
          </button>

          <button
            onClick={onQuizMe}
            className="py-3 px-2 rounded-xl bg-slate-900 border border-white/15 text-slate-200 hover:bg-white/10 font-bold text-xs flex flex-col items-center justify-center gap-1 touch-target"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>QUIZ ME</span>
          </button>

          <button
            onClick={onSaveToNotes}
            className="py-3 px-2 rounded-xl bg-slate-900 border border-white/15 text-slate-200 hover:bg-white/10 font-bold text-xs flex flex-col items-center justify-center gap-1 touch-target"
          >
            {noteSaved ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <BookOpen className="w-4 h-4 text-cyan-400" />
            )}
            <span>{noteSaved ? "SAVED" : "SAVE"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
