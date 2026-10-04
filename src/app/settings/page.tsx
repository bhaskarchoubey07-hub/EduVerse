"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Settings,
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  Eye,
  CheckCircle2,
  Sliders,
  Bot,
  Layers,
  Palette,
  Check,
} from "lucide-react";
import { useAuth } from "@/lib/store/auth-context";
import { useDataStore } from "@/lib/store/data-store";
import { GraphicIntensity, CompanionAvatarType, ThemeAccent } from "@/types";

export default function SettingsPage() {
  const { user } = useAuth();
  const { userSettings, updateSettings } = useDataStore();

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#070a14] bg-grid-pattern flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 pb-28 lg:pb-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold border border-violet-500/30">
            <Settings className="w-3.5 h-3.5 text-cyan-400" />
            Student Preferences &amp; 3D Engine Settings
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            Personalize Your Learning Universe
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Configure 3D graphics fidelity, AI Companion avatar style, voice synthesis, and accessibility preferences.
          </p>
        </div>

        {/* SETTINGS PANELS */}
        <div className="space-y-6">
          {/* 1. 3D GRAPHICS & PERFORMANCE */}
          <div className="p-5 sm:p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <Zap className="w-4 h-4" /> 3D Rendering Fidelity &amp; Device Performance
            </h3>
            <p className="text-xs text-slate-400">
              Select rendering quality based on your device hardware (laptop vs phone battery saver).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {[
                { id: "full_3d", label: "Full 3D Universe", desc: "Interactive shaders, planets & spatial models" },
                { id: "minimal_3d", label: "Minimal / Balanced 3D", desc: "Optimized for mobile battery and smooth framerates" },
                { id: "fast_2d", label: "High-Speed 2D Mode", desc: "Pure 2D canvas for maximum battery & low-end devices" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => updateSettings({ graphicIntensity: item.id as GraphicIntensity })}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer touch-target ${
                    userSettings.graphicIntensity === item.id
                      ? "bg-cyan-950/40 border-cyan-400 text-white shadow-md shadow-cyan-500/20"
                      : "bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/20"
                  }`}
                >
                  <div className="font-bold text-xs text-white">{item.label}</div>
                  <div className="text-[11px] text-slate-400 mt-1">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. AI COMPANION AVATAR SELECTION */}
          <div className="p-5 sm:p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-violet-400 flex items-center gap-2">
              <Bot className="w-4 h-4" /> AI Personal Companion Style
            </h3>
            <p className="text-xs text-slate-400">
              Customize the visual orb aesthetic of your 3D personal tutor.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              {[
                { id: "nebula_core", label: "Nebula Core", color: "Cyan + Violet", preview: "🌌" },
                { id: "quantum_pulse", label: "Quantum Pulse", color: "Emerald + Cyan", preview: "⚡" },
                { id: "cyber_star", label: "Cyber Star", color: "Sky Blue + Purple", preview: "⭐" },
                { id: "solar_flare", label: "Solar Flare", color: "Amber + Rose", preview: "☀️" },
              ].map((av) => (
                <button
                  key={av.id}
                  onClick={() => updateSettings({ companionAvatar: av.id as CompanionAvatarType })}
                  className={`p-4 rounded-xl border text-center transition-all cursor-pointer touch-target ${
                    userSettings.companionAvatar === av.id
                      ? "bg-violet-950/40 border-violet-400 text-white shadow-md shadow-violet-500/20"
                      : "bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/20"
                  }`}
                >
                  <div className="text-2xl mb-1">{av.preview}</div>
                  <div className="font-bold text-xs text-white">{av.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{av.color}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. VOICE & AUDIO PREFERENCES */}
          <div className="p-5 sm:p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Volume2 className="w-4 h-4" /> Audio &amp; Voice Synthesis
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
                <div>
                  <div className="text-xs font-bold text-white">AI Companion Text-to-Speech (Voice Audio)</div>
                  <div className="text-[11px] text-slate-400">
                    Reads out formulas and answers aloud with speech synthesis.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={userSettings.voiceEnabled}
                  onChange={(e) => updateSettings({ voiceEnabled: e.target.checked })}
                  className="w-6 h-6 rounded text-cyan-500 cursor-pointer touch-target"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
                <div>
                  <div className="text-xs font-bold text-white">Sound Effects &amp; Confetti Audio</div>
                  <div className="text-[11px] text-slate-400">
                    Play celebratory sounds on test completion and XP achievements.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={userSettings.soundEffectsEnabled}
                  onChange={(e) => updateSettings({ soundEffectsEnabled: e.target.checked })}
                  className="w-6 h-6 rounded text-cyan-500 cursor-pointer touch-target"
                />
              </div>
            </div>
          </div>

          {/* 4. ACCESSIBILITY & REDUCED MOTION */}
          <div className="p-5 sm:p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <Eye className="w-4 h-4" /> Accessibility &amp; Motion Controls
            </h3>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
              <div>
                <div className="text-xs font-bold text-white">Reduced Motion Mode</div>
                <div className="text-[11px] text-slate-400">
                  Minimizes continuous spatial rotations and rapid UI transitions.
                </div>
              </div>
              <input
                type="checkbox"
                checked={userSettings.reducedMotion}
                onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
                className="w-6 h-6 rounded text-cyan-500 cursor-pointer touch-target"
              />
            </div>
          </div>

          {/* SAVE BUTTON */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSave}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-xs shadow-xl shadow-violet-600/30 flex items-center justify-center gap-2 cursor-pointer touch-target min-h-[48px]"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" /> Preferences Saved Successfully!
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Save Preferences
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
