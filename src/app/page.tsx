"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Sparkles,
  Bot,
  FileText,
  Clock,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Brain,
  Zap,
  Award,
  Compass,
  Calendar,
  Layers,
} from "lucide-react";
import { BOARDS } from "@/lib/data/mock-db";
import { LearningUniversePlanet } from "@/components/3d/LearningUniversePlanet";

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Which boards and classes does EduVerse AI support?",
      a: "EduVerse AI is purpose-built for Class 10, 11, and 12 students preparing for CBSE, ICSE / ISC, Punjab School Education Board (PSEB), and major State Secondary Boards.",
    },
    {
      q: "What is the 3D Learning Universe?",
      a: "EduVerse AI integrates interactive 3D spatial environments for mathematics (geometry), physics (orbital & ray optics simulations), chemistry (3D molecular bond builders), and biology (DNA helix). It enhances conceptual intuition while offering accessible 2D alternatives for any device.",
    },
    {
      q: "How does the Adaptive AI Study Planner work?",
      a: "The planner dynamically analyzes your exam date, daily available hours, syllabus completion, and mock test diagnostic errors to generate actionable daily study tasks with intelligent spaced repetition.",
    },
    {
      q: "Are the Previous-Year Question Papers (PYQs) verified?",
      a: "Yes. Our 10-year archive (2016–2025) contains verified official board examination papers with step-by-step solutions, marking schemes, and simulated in-browser previews.",
    },
    {
      q: "Can I use EduVerse AI on mobile or disable 3D animations?",
      a: "Yes! EduVerse AI includes low-power 2D modes and reduced-motion toggles in Settings to ensure rapid, distraction-free performance on all phones and laptops.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#070a14] bg-grid-pattern flex flex-col selection:bg-violet-500 selection:text-white">
      <Navbar />

      {/* 3D CINEMATIC HERO SECTION */}
      <section className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden bg-radial-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Headline & CTA (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-950/80 border border-violet-500/30 text-violet-300 text-xs font-medium backdrop-blur-md shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Next-Gen 3D Learning Universe</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                Your Learning <br />
                <span className="text-gradient-primary">Universe</span> Starts Here.
              </h1>

              {/* Subheading */}
              <p className="text-xs sm:text-base lg:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                The all-in-one immersive board preparation platform for **Classes 10, 11 &amp; 12**. Master **CBSE, ICSE/ISC &amp; State Boards** with interactive 3D simulations, adaptive AI study planners, verified 10-year papers, and timed mock exams.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2 w-full">
                <Link
                  href="/onboarding"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-violet-600/30 hover:scale-[1.02] transition-all min-h-[48px] touch-target"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/worlds"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 rounded-xl glass-panel hover:bg-white/10 text-cyan-300 font-semibold text-xs sm:text-sm border border-cyan-500/30 transition-all min-h-[48px] touch-target"
                >
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span>Explore 3D Subject Worlds</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-2 sm:pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 text-[11px] sm:text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> CBSE • ICSE • PSEB • State Boards
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" /> 10-Year Verified Papers
                </span>
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" /> 3D Trophy Gamification
                </span>
              </div>
            </div>

            {/* Right Column: 3D Educational Planet (5 cols) */}
            <div className="lg:col-span-5 h-[280px] sm:h-[360px] md:h-[440px] flex items-center justify-center relative">
              <div className="w-full h-full rounded-3xl p-1 bg-gradient-to-b from-violet-500/20 via-cyan-500/10 to-transparent border border-white/10 backdrop-blur-xl shadow-2xl">
                <LearningUniversePlanet size={360} badgeText="Interactive 3D Learning Planet" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE PILLARS WITH 3D UPGRADE */}
      <section className="py-16 bg-[#060913] border-t border-b border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
              Stage 2 Intelligent Learning Architecture
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">
              Smarter Preparation. Proven Mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1: 3D Subject Worlds */}
            <div className="p-6 rounded-2xl glass-card space-y-4">
              <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Interactive 3D Worlds</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Explore molecular structures, gravitational orbits, and 3D platonic geometry directly in your browser.
              </p>
              <Link href="/worlds" className="text-xs font-semibold text-violet-400 hover:text-violet-300 inline-flex items-center gap-1">
                Enter Worlds <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Pillar 2: Adaptive AI Study Planner */}
            <div className="p-6 rounded-2xl glass-card space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Adaptive AI Study Plan</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dynamic daily tasks tailored to your exam target date, weak diagnostics, and spaced repetition schedules.
              </p>
              <Link href="/planner" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1">
                Open My Schedule <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Pillar 3: AI Learning Companion */}
            <div className="p-6 rounded-2xl glass-card space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">AI Companion &amp; Voice</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                24/7 syllabus-grounded tutor with step-by-step problem derivations, hints, and optional voice audio.
              </p>
              <Link href="/tutor" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1">
                Chat with Companion <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Pillar 4: 3D Trophies & Gamification */}
            <div className="p-6 rounded-2xl glass-card space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">3D Trophy Room &amp; XP</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Earn XP points, unlock levels, and collect rotating 3D trophies in your personalized achievement showcase.
              </p>
              <Link href="/trophies" className="text-xs font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1">
                View Trophies <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SUPPORTED BOARDS */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h3 className="text-2xl font-bold text-white">Curriculum Coverage</h3>
            <p className="text-xs text-slate-400">
              Complete syllabus architecture for Classes 10, 11 &amp; 12.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BOARDS.map((board) => (
              <div key={board.id} className="p-4 rounded-xl glass-panel space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-violet-500/20 text-violet-300">
                    {board.logoText}
                  </span>
                  <span className="text-[10px] text-slate-400">Classes 10–12</span>
                </div>
                <h4 className="font-bold text-sm text-white">{board.name}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2">{board.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 bg-[#060913] border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 space-y-2">
            <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-400">
              Clear answers about 3D simulations, adaptive planners, and board preparation.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-xl glass-panel border border-white/10 overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-slate-200 hover:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-violet-400 transition-transform ${
                      activeFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
