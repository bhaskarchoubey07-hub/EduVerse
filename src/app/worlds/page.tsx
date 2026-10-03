"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Compass,
  Sparkles,
  Atom,
  Zap,
  Dna,
  Calculator,
  ArrowRight,
  Layers,
  CheckCircle2,
  Maximize2,
} from "lucide-react";
import { SubjectWorld3D } from "@/components/3d/SubjectWorld3D";

export default function SubjectWorldsHubPage() {
  const [activePreview, setActivePreview] = useState<
    "geometry" | "physics_orbital" | "chemistry_molecular" | "biology_helix"
  >("chemistry_molecular");

  const worlds = [
    {
      id: "chemistry_molecular",
      subjectName: "Chemistry 3D Molecular Lab",
      curriculum: "Class 10 & 12 • Chemical Bonding & Organic Chemistry",
      description: "Explore 3D tetrahedral structures, covalent molecular bonds (CH4, H2O, CO2), valence electron orbitals, and bond angle measurements.",
      icon: Atom,
      color: "cyan",
      formula: "Bond Angle (CH₄): 109.5° • Tetrahedral Sp³",
      route: "/worlds/chemistry",
    },
    {
      id: "physics_orbital",
      subjectName: "Physics Orbital & Optics Lab",
      curriculum: "Class 10 & 12 • Gravitation, Light & Planetary Dynamics",
      description: "Simulate gravitational central forces, Kepler's orbital velocity, and refraction ray paths through optical triangular glass prisms.",
      icon: Zap,
      color: "violet",
      formula: "F = G(m₁m₂)/r² • Snell's Law n = sin(i)/sin(r)",
      route: "/worlds/physics",
    },
    {
      id: "geometry",
      subjectName: "Mathematics Spatial Geometry",
      curriculum: "Class 10 & 12 • 3D Mensuration & Platonic Solids",
      description: "Inspect 3D Icosahedrons, Dodecahedrons, and vector coordinate systems with interactive vertices, wireframes, and volume equations.",
      icon: Calculator,
      color: "blue",
      formula: "Euler's Formula: V - E + F = 2",
      route: "/worlds/mathematics",
    },
    {
      id: "biology_helix",
      subjectName: "Biology 3D DNA & Cellular Helix",
      curriculum: "Class 10 & 12 • Genetics & Molecular Basis of Inheritance",
      description: "Rotate the double helix structure, explore Watson-Crick base pairs (Adenine-Thymine, Guanine-Cytosine), and cellular organelles.",
      icon: Dna,
      color: "emerald",
      formula: "Chargaff's Rule: [A] = [T], [G] = [C]",
      route: "/worlds/biology",
    },
  ];

  return (
    <div className="min-h-screen bg-[#070a14] bg-grid-pattern flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            Interactive 3D Educational Subject Environments
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Explore 3D Subject Worlds
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Build conceptual intuition through interactive 3D simulations. Rotate molecules, inspect ray paths, and explore spatial geometry.
          </p>
        </div>

        {/* FLAGSHIP 3D BIOLOGY LAB HERO BANNER */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950/70 via-teal-950/40 to-slate-900 border border-emerald-500/40 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-emerald-950/50">
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ⭐ Flagship 3D Laboratory
              </span>
              <span className="text-xs text-slate-400">Class 10 &amp; 12 Biology</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Dna className="w-6 h-6 text-emerald-400" /> Interactive 3D Biology Lab &amp; Human Anatomy
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Dissect and isolate the 9 human body systems in 3D, simulate 4-chambered cardiac blood flow, observe alveolar gas exchange, and zoom down to microscopic Animal vs Plant cells with AI Tutor integration.
            </p>
          </div>
          <Link
            href="/learn/biology"
            className="shrink-0 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-xl shadow-emerald-500/30 flex items-center gap-2 transition-all hover:scale-105"
          >
            Launch 3D Biology Lab <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 2-COLUMN FEATURED 3D LAB WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: World Selector Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {worlds.map((w) => {
              const Icon = w.icon;
              const isSelected = activePreview === w.id;
              return (
                <div
                  key={w.id}
                  onClick={() => setActivePreview(w.id as any)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-violet-950/40 border-cyan-400 shadow-lg shadow-cyan-500/10"
                      : "bg-slate-900/60 border-white/10 hover:border-white/20 text-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 text-cyan-300 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xs sm:text-sm text-white">{w.subjectName}</h3>
                        <p className="text-[10px] text-slate-400">{w.curriculum}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                        ACTIVE 3D
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {w.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Live Interactive 3D Canvas (7 cols) */}
          <div className="lg:col-span-7 h-[420px] rounded-2xl glass-panel-glow border border-white/15 p-1 relative overflow-hidden shadow-2xl">
            <SubjectWorld3D
              worldType={activePreview}
              activeFormula={worlds.find((w) => w.id === activePreview)?.formula}
            />
          </div>
        </div>

        {/* BOTTOM LEARNING JUMP TILES */}
        <div className="pt-4 border-t border-white/10">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">
            Curriculum Aligned 3D Topic Modules:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/notes/ch-sci10-01"
              className="p-4 rounded-xl glass-panel hover:border-cyan-400/50 transition-all space-y-2 group"
            >
              <div className="text-[10px] font-mono text-cyan-400 font-bold">CHEMISTRY</div>
              <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                Chemical Reactions &amp; Molecular Bonds
              </h4>
              <p className="text-[11px] text-slate-400">Balancing redox and exothermic bonding.</p>
              <span className="text-[11px] text-cyan-400 font-semibold inline-flex items-center gap-1">
                Open Chapter Notes <ArrowRight className="w-3 h-3" />
              </span>
            </Link>

            <Link
              href="/notes/ch-sci10-09"
              className="p-4 rounded-xl glass-panel hover:border-violet-400/50 transition-all space-y-2 group"
            >
              <div className="text-[10px] font-mono text-violet-400 font-bold">PHYSICS</div>
              <h4 className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors">
                Light Refraction &amp; Spherical Mirrors
              </h4>
              <p className="text-[11px] text-slate-400">Ray diagram mechanics and lens equations.</p>
              <span className="text-[11px] text-violet-400 font-semibold inline-flex items-center gap-1">
                Open Chapter Notes <ArrowRight className="w-3 h-3" />
              </span>
            </Link>

            <Link
              href="/tutor?prompt=Explain%20Platonic%20solids%20and%20Euler%20formula%20in%203D%20geometry"
              className="p-4 rounded-xl glass-panel hover:border-amber-400/50 transition-all space-y-2 group"
            >
              <div className="text-[10px] font-mono text-amber-400 font-bold">MATHEMATICS</div>
              <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                3D Mensuration &amp; Coordinate Geometry
              </h4>
              <p className="text-[11px] text-slate-400">Surface areas and polyhedral relations.</p>
              <span className="text-[11px] text-amber-400 font-semibold inline-flex items-center gap-1">
                Ask AI Tutor <ArrowRight className="w-3 h-3" />
              </span>
            </Link>

            <Link
              href="/tutor?prompt=Explain%20DNA%20double%20helix%20structure%20and%20base%20pairs%20for%20board%20exams"
              className="p-4 rounded-xl glass-panel hover:border-emerald-400/50 transition-all space-y-2 group"
            >
              <div className="text-[10px] font-mono text-emerald-400 font-bold">BIOLOGY</div>
              <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                DNA Double Helix &amp; Cell Genetics
              </h4>
              <p className="text-[11px] text-slate-400">Nucleotide pairing and gene replication.</p>
              <span className="text-[11px] text-emerald-400 font-semibold inline-flex items-center gap-1">
                Ask AI Tutor <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
