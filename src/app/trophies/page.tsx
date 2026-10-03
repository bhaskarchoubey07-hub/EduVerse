"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Award,
  Sparkles,
  Flame,
  CheckCircle2,
  Lock,
  Trophy,
  Users,
  ShieldCheck,
  Star,
  Zap,
} from "lucide-react";
import { useAuth } from "@/lib/store/auth-context";
import { useDataStore } from "@/lib/store/data-store";
import { TrophyRoom3D } from "@/components/3d/TrophyRoom3D";
import { TrophyModelType } from "@/types";

export default function TrophyRoomPage() {
  const { user } = useAuth();
  const { achievements, gamificationState } = useDataStore();
  const [selectedTrophy, setSelectedTrophy] = useState<TrophyModelType>("gold_medal");
  const [activeLeaderboardTab, setActiveLeaderboardTab] = useState(false);

  const selectedAch = achievements.find((a) => a.trophyModel === selectedTrophy) || achievements[0];

  const dummyLeaderboard = [
    { rank: 1, name: "Prisha Kapoor", board: "CBSE Class 10", xp: 3450, level: 9 },
    { rank: 2, name: "Arjun Verma", board: "ICSE Class 10", xp: 3120, level: 8 },
    { rank: 3, name: "Simran Kaur", board: "PSEB Class 12", xp: 2890, level: 7 },
    { rank: 4, name: "Rohan Nair", board: "CBSE Class 12", xp: 2600, level: 7 },
    { rank: 14, name: user?.fullName || "You (Aarav Sharma)", board: `Class ${user?.classLevel || 10}`, xp: gamificationState.currentXp, level: gamificationState.currentLevel, isSelf: true },
  ];

  return (
    <div className="min-h-screen bg-[#070a14] bg-grid-pattern flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Banner */}
        <div className="rounded-3xl glass-panel-glow p-6 sm:p-8 border border-white/10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  3D Achievement &amp; XP Showcase
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Level {gamificationState.currentLevel} • {gamificationState.levelTitle}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
                Cosmic Trophy Room
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Collect interactive 3D artifacts for consistent study habits, timed mock exam excellence, and curriculum mastery.
              </p>
            </div>

            {/* XP Level Box */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-center min-w-[140px]">
              <div className="text-3xl font-black text-amber-400 font-mono">
                {gamificationState.currentXp} <span className="text-sm">XP</span>
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">
                Level {gamificationState.currentLevel} ({gamificationState.totalTrophiesUnlocked}/{achievements.length} Trophies)
              </div>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="pt-2 space-y-1.5">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>{gamificationState.levelTitle}</span>
              <span>Next Level at {gamificationState.nextLevelXp} XP</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 via-violet-500 to-cyan-400 h-2.5 rounded-full"
                style={{ width: `${Math.min(100, (gamificationState.currentXp / gamificationState.nextLevelXp) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3D TROPHY SPOTLIGHT & COLLECTIBLES SHOWCASE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left 3D Canvas (5 cols) */}
          <div className="lg:col-span-5 h-[340px] rounded-2xl glass-panel-glow border border-amber-500/30 p-4 flex flex-col justify-between items-center shadow-2xl">
            <div className="w-full flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                {selectedAch.title}
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  selectedAch.isUnlocked ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-slate-400"
                }`}
              >
                {selectedAch.isUnlocked ? "UNLOCKED" : "LOCKED"}
              </span>
            </div>

            <div className="w-full flex-1 flex items-center justify-center">
              <TrophyRoom3D modelType={selectedTrophy} isUnlocked={selectedAch.isUnlocked} />
            </div>

            <div className="text-[11px] text-slate-400 text-center font-mono">
              Reward: +{selectedAch.xpReward} XP • Drag to rotate 3D artifact
            </div>
          </div>

          {/* Right Collectibles Grid (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Select 3D Trophy Artifact:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {achievements.map((ach) => {
                const isSelected = selectedTrophy === ach.trophyModel;
                return (
                  <div
                    key={ach.id}
                    onClick={() => setSelectedTrophy(ach.trophyModel)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-amber-950/40 border-amber-400 shadow-md shadow-amber-500/10"
                        : "bg-slate-900/60 border-white/10 hover:border-white/20 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                        {ach.isUnlocked ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Lock className="w-4 h-4 text-slate-500" />
                        )}
                        {ach.title}
                      </span>
                      <span className="text-[10px] font-mono text-amber-400 font-bold">
                        +{ach.xpReward} XP
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2">{ach.description}</p>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">
                      Criteria: {ach.criteriaRequirement}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* OPTIONAL PRIVACY-CONSCIOUS LEADERBOARD */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" /> Peer Study Discipline Benchmark
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Anonymous and respectful leaderboard rewarding consistency and practice.
              </p>
            </div>

            <button
              onClick={() => setActiveLeaderboardTab(!activeLeaderboardTab)}
              className="px-3.5 py-1.5 rounded-xl glass-panel text-xs text-slate-300 hover:text-white"
            >
              {activeLeaderboardTab ? "Hide Leaderboard" : "Show Leaderboard"}
            </button>
          </div>

          {activeLeaderboardTab && (
            <div className="overflow-x-auto pt-2 animate-in fade-in">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-[11px] uppercase font-bold text-slate-400 border-b border-white/10">
                  <tr>
                    <th className="p-3">Rank</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Curriculum Track</th>
                    <th className="p-3">Level</th>
                    <th className="p-3 text-right">Total XP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {dummyLeaderboard.map((row) => (
                    <tr
                      key={row.rank}
                      className={row.isSelf ? "bg-violet-950/40 font-bold text-cyan-300" : "hover:bg-white/5"}
                    >
                      <td className="p-3 font-mono">#{row.rank}</td>
                      <td className="p-3">{row.name} {row.isSelf ? "(You)" : ""}</td>
                      <td className="p-3 text-slate-400">{row.board}</td>
                      <td className="p-3 font-mono">Level {row.level}</td>
                      <td className="p-3 text-right font-mono font-bold text-amber-400">{row.xp} XP</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
