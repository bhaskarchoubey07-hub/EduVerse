"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Compass,
  FileText,
  Clock,
  Dna,
  Atom,
  Zap,
  Calculator,
  Globe2,
  Hourglass,
  ArrowRight,
  BookOpen,
  Sparkles,
  History,
} from "lucide-react";
import { CHAPTERS, SUBJECTS, QUESTION_PAPERS, MOCK_EXAMS } from "@/lib/data/mock-db";
import { SUBJECT_WORLD_PORTALS } from "@/lib/data/universe-data";

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSearchModal({ isOpen, onClose }: MobileSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      try {
        const stored = localStorage.getItem("eduverse_recent_searches");
        if (stored) setRecentSearches(JSON.parse(stored));
      } catch (e) {
        // ignore
      }
    }
  }, [isOpen]);

  const saveSearch = (text: string) => {
    if (!text.trim()) return;
    const updated = [text.trim(), ...recentSearches.filter((s) => s.toLowerCase() !== text.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem("eduverse_recent_searches", JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  };

  const results = useMemo(() => {
    if (!query.trim()) return { worlds: [], chapters: [], papers: [], exams: [] };
    const q = query.toLowerCase();

    const worlds = SUBJECT_WORLD_PORTALS.filter(
      (w) => w.name.toLowerCase().includes(q) || w.tagline.toLowerCase().includes(q)
    ).slice(0, 3);

    const chapters = CHAPTERS.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.topics.some((t) => t.title.toLowerCase().includes(q))
    ).slice(0, 4);

    const papers = QUESTION_PAPERS.filter(
      (p) => p.title.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q))
    ).slice(0, 3);

    const exams = MOCK_EXAMS.filter((e) => e.title.toLowerCase().includes(q)).slice(0, 3);

    return { worlds, chapters, papers, exams };
  }, [query]);

  const hasResults =
    results.worlds.length > 0 ||
    results.chapters.length > 0 ||
    results.papers.length > 0 ||
    results.exams.length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-start animate-in fade-in">
      {/* Top Search Header */}
      <div className="w-full bg-[#080d22] border-b border-white/10 px-4 pt-safe pb-3 shadow-xl">
        <div className="flex items-center gap-3 pt-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 3D worlds, chapters, formulas, papers..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-900 border border-cyan-500/30 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl touch-target"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Results / Suggestions Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 max-w-2xl mx-auto w-full pb-safe">
        {/* Recent Searches if Query is Empty */}
        {!query.trim() && (
          <div className="space-y-4">
            {recentSearches.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-cyan-400" /> Recent Searches
                  </span>
                  <button
                    onClick={() => {
                      setRecentSearches([]);
                      localStorage.removeItem("eduverse_recent_searches");
                    }}
                    className="text-[10px] text-slate-500 hover:text-slate-300"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term, i) => (
                    <button
                      key={i}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs text-slate-200 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Explore Suggestions */}
            <div className="space-y-2 pt-2">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
                Popular 3D Topics
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => {
                    saveSearch("Human Skeletal & Heart 3D");
                    router.push("/learn/biology");
                    onClose();
                  }}
                  className="p-3 rounded-xl glass-panel text-left hover:border-emerald-400/50 space-y-1"
                >
                  <div className="font-bold text-emerald-400 flex items-center gap-1">
                    <Dna className="w-3.5 h-3.5" /> Biology 3D Lab
                  </div>
                  <div className="text-[11px] text-slate-400">Heart, Femur &amp; Cells</div>
                </button>

                <button
                  onClick={() => {
                    saveSearch("Molecular Bonds & Orbitals");
                    router.push("/learn/chemistry");
                    onClose();
                  }}
                  className="p-3 rounded-xl glass-panel text-left hover:border-cyan-400/50 space-y-1"
                >
                  <div className="font-bold text-cyan-400 flex items-center gap-1">
                    <Atom className="w-3.5 h-3.5" /> Chemistry 3D
                  </div>
                  <div className="text-[11px] text-slate-400">Methane &amp; Carbon Bonds</div>
                </button>

                <button
                  onClick={() => {
                    saveSearch("Kinematics & Optics Prism");
                    router.push("/learn/physics");
                    onClose();
                  }}
                  className="p-3 rounded-xl glass-panel text-left hover:border-violet-400/50 space-y-1"
                >
                  <div className="font-bold text-violet-400 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" /> Physics 3D
                  </div>
                  <div className="text-[11px] text-slate-400">Ray Optics &amp; Trajectory</div>
                </button>

                <button
                  onClick={() => {
                    saveSearch("3D Mensuration & Solids");
                    router.push("/learn/mathematics");
                    onClose();
                  }}
                  className="p-3 rounded-xl glass-panel text-left hover:border-amber-400/50 space-y-1"
                >
                  <div className="font-bold text-amber-400 flex items-center gap-1">
                    <Calculator className="w-3.5 h-3.5" /> Math Geometry
                  </div>
                  <div className="text-[11px] text-slate-400">Cylinders &amp; Spheres</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Live Search Results */}
        {query.trim() && (
          <div className="space-y-5">
            {/* 3D Worlds */}
            {results.worlds.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5" /> 3D Subject Worlds
                </span>
                <div className="space-y-2">
                  {results.worlds.map((w) => (
                    <Link
                      key={w.id}
                      href={w.route}
                      onClick={() => {
                        saveSearch(query);
                        onClose();
                      }}
                      className="p-3 rounded-xl glass-panel hover:border-cyan-400/50 flex items-center justify-between group"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-cyan-300">{w.name}</h4>
                        <p className="text-[11px] text-slate-400">{w.tagline}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Chapters & Notes */}
            {results.chapters.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> Chapters &amp; Notes
                </span>
                <div className="space-y-2">
                  {results.chapters.map((ch) => (
                    <Link
                      key={ch.id}
                      href={`/notes/${ch.id}`}
                      onClick={() => {
                        saveSearch(query);
                        onClose();
                      }}
                      className="p-3 rounded-xl glass-panel hover:border-violet-400/50 flex items-center justify-between group"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-violet-300">{ch.title}</h4>
                        <p className="text-[11px] text-slate-400">Chapter {ch.number} • {ch.marksWeightage} Marks</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-violet-400 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Question Papers */}
            {results.papers.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" /> 10-Year Verified Papers
                </span>
                <div className="space-y-2">
                  {results.papers.map((p) => (
                    <Link
                      key={p.id}
                      href="/papers"
                      onClick={() => {
                        saveSearch(query);
                        onClose();
                      }}
                      className="p-3 rounded-xl glass-panel hover:border-amber-400/50 flex items-center justify-between group"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-amber-300">{p.title}</h4>
                        <p className="text-[11px] text-slate-400">
                          {p.boardId.toUpperCase()} • Class {p.classLevel} • Year {p.year}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Mock Exams */}
            {results.exams.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Mock Examinations
                </span>
                <div className="space-y-2">
                  {results.exams.map((ex) => (
                    <Link
                      key={ex.id}
                      href={`/exams/${ex.id}`}
                      onClick={() => {
                        saveSearch(query);
                        onClose();
                      }}
                      className="p-3 rounded-xl glass-panel hover:border-emerald-400/50 flex items-center justify-between group"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-emerald-300">{ex.title}</h4>
                        <p className="text-[11px] text-slate-400">
                          {ex.durationMinutes} Mins • {ex.totalMarks} Marks
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {!hasResults && (
              <div className="text-center py-12 space-y-2">
                <Sparkles className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-sm font-semibold text-slate-300">No exact match for &quot;{query}&quot;</p>
                <p className="text-xs text-slate-500">
                  Try asking your AI Companion:{" "}
                  <button
                    onClick={() => {
                      router.push(`/tutor?prompt=${encodeURIComponent(query)}`);
                      onClose();
                    }}
                    className="text-cyan-400 underline font-semibold"
                  >
                    Ask AI Tutor
                  </button>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
