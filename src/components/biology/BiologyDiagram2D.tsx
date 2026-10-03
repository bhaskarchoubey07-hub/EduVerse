"use client";

import React from "react";
import { BodySystemType, LabViewMode, CellType, ANATOMICAL_STRUCTURES, CELL_ORGANELLES } from "@/lib/data/biology-data";
import { Heart, Activity, Wind, Utensils, Brain, Shield, Info, Check, Sparkles } from "lucide-react";

interface BiologyDiagram2DProps {
  system: BodySystemType;
  selectedStructureId: string | null;
  onSelectStructure: (id: string) => void;
  viewMode: LabViewMode;
  cellType: CellType;
}

export function BiologyDiagram2D({
  system,
  selectedStructureId,
  onSelectStructure,
  viewMode,
  cellType,
}: BiologyDiagram2DProps) {
  if (viewMode === "cell_lab") {
    return (
      <div className="w-full h-full p-6 flex flex-col items-center justify-center text-white space-y-6 animate-in fade-in">
        <div className="text-center space-y-1">
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            2D Schematic • {cellType === "animal_cell" ? "Animal Cell Ultrastructure" : "Plant Cell Ultrastructure"}
          </span>
          <h3 className="text-xl font-bold text-white">Interactive Organelle Map</h3>
          <p className="text-xs text-slate-400">
            Click any organelle badge to inspect biological function, enzymes, and NCERT exam significance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl w-full">
          {CELL_ORGANELLES.filter(
            (org) => org.cellType === "both" || org.cellType === (cellType === "animal_cell" ? "animal" : "plant")
          ).map((org) => {
            const isSelected = selectedStructureId === org.id;
            return (
              <button
                key={org.id}
                onClick={() => onSelectStructure(org.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? "bg-emerald-600/30 border-emerald-400 shadow-lg shadow-emerald-500/20 scale-[1.02]"
                    : "glass-panel border-white/10 hover:border-emerald-500/40"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{org.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-2 mt-1">{org.function}</p>
                </div>
                <div className="text-[10px] font-mono text-emerald-300/80 bg-emerald-950/50 p-1.5 rounded-lg border border-emerald-900/40">
                  💡 {org.analogy}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // HUMAN BODY 2D SYSTEM MAPS
  const currentStructures = ANATOMICAL_STRUCTURES.filter((s) => s.system === system);

  return (
    <div className="w-full h-full p-6 flex flex-col items-center justify-center text-white space-y-6 animate-in fade-in overflow-y-auto">
      <div className="text-center space-y-1">
        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
          2D Anatomical Blueprint • {system.toUpperCase()} SYSTEM
        </span>
        <h3 className="text-xl font-bold text-white">Anatomical System Diagram &amp; Key Structures</h3>
        <p className="text-xs text-slate-400">
          Accessible 2D schematic with complete NCERT marking rubrics and high-yield board exam tips.
        </p>
      </div>

      {/* System Schematic Representation */}
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {currentStructures.map((struct) => {
          const isSelected = selectedStructureId === struct.id;
          return (
            <div
              key={struct.id}
              onClick={() => onSelectStructure(struct.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? "bg-violet-600/30 border-violet-400 shadow-xl shadow-violet-500/20 scale-[1.02]"
                  : "glass-panel border-white/10 hover:border-cyan-400/40"
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                    {struct.category}
                  </span>
                  {isSelected && <span className="text-xs text-emerald-400 font-bold">✓ Active Focus</span>}
                </div>

                <h4 className="font-bold text-sm text-white">{struct.name}</h4>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{struct.function}</p>
              </div>

              <div className="pt-2 border-t border-white/5 space-y-1">
                <div className="text-[10px] text-slate-400 font-mono">
                  📍 <strong>Location:</strong> {struct.location}
                </div>
                <div className="text-[10px] text-amber-300/90 font-medium">
                  ⭐ <strong>Board Tip:</strong> {struct.boardExamTips}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
