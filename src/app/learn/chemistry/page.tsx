"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import * as THREE from "three";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Atom, ArrowLeft, ArrowRight, Sparkles, Bot, BookOpen, FlaskConical,
  ChevronRight, RotateCcw, Info, CheckCircle2, Star, Award,
} from "lucide-react";
import { useAuth } from "@/lib/store/auth-context";

const MOLECULES = [
  {
    id: "h2o", name: "Water", formula: "H\u2082O", bondAngle: "104.5\u00b0",
    geometry: "Bent / Angular", hybridization: "sp\u00b3", color: 0x06b6d4,
    description: "Water has a bent molecular geometry due to 2 lone pairs on oxygen, reducing the bond angle from 109.5\u00b0 (tetrahedral) to 104.5\u00b0.",
    atoms: [
      { element: "O", pos: [0, 0, 0], color: 0xef4444, radius: 0.5 },
      { element: "H", pos: [-0.96, -0.56, 0], color: 0xfafafa, radius: 0.3 },
      { element: "H", pos: [0.96, -0.56, 0], color: 0xfafafa, radius: 0.3 },
    ],
    bonds: [[0, 1], [0, 2]],
    boardFact: "Polar molecule \u2022 Forms hydrogen bonds \u2022 Universal solvent",
    xpReward: 40,
  },
  {
    id: "co2", name: "Carbon Dioxide", formula: "CO\u2082", bondAngle: "180\u00b0",
    geometry: "Linear", hybridization: "sp", color: 0x8b5cf6,
    description: "CO\u2082 has a linear geometry with bond angle 180\u00b0. Despite having polar C=O bonds, the molecule is non-polar due to symmetry.",
    atoms: [
      { element: "O", pos: [-2.2, 0, 0], color: 0xef4444, radius: 0.45 },
      { element: "C", pos: [0, 0, 0], color: 0x6b7280, radius: 0.4 },
      { element: "O", pos: [2.2, 0, 0], color: 0xef4444, radius: 0.45 },
    ],
    bonds: [[0, 1], [1, 2]],
    boardFact: "Linear \u2022 Non-polar \u2022 Greenhouse gas \u2022 sp hybridization",
    xpReward: 40,
  },
  {
    id: "ch4", name: "Methane", formula: "CH\u2084", bondAngle: "109.5\u00b0",
    geometry: "Tetrahedral", hybridization: "sp\u00b3", color: 0x10b981,
    description: "Methane has perfect tetrahedral geometry with 4 equivalent C-H bonds arranged symmetrically, achieving maximum separation.",
    atoms: [
      { element: "C", pos: [0, 0, 0], color: 0x6b7280, radius: 0.45 },
      { element: "H", pos: [1.1, 1.1, 1.1], color: 0xfafafa, radius: 0.28 },
      { element: "H", pos: [-1.1, -1.1, 1.1], color: 0xfafafa, radius: 0.28 },
      { element: "H", pos: [-1.1, 1.1, -1.1], color: 0xfafafa, radius: 0.28 },
      { element: "H", pos: [1.1, -1.1, -1.1], color: 0xfafafa, radius: 0.28 },
    ],
    bonds: [[0, 1], [0, 2], [0, 3], [0, 4]],
    boardFact: "Tetrahedral \u2022 109.5\u00b0 \u2022 sp\u00b3 \u2022 Natural gas \u2022 Simplest alkane",
    xpReward: 50,
  },
  {
    id: "nh3", name: "Ammonia", formula: "NH\u2083", bondAngle: "107\u00b0",
    geometry: "Trigonal Pyramidal", hybridization: "sp\u00b3", color: 0xf59e0b,
    description: "NH\u2083 has a trigonal pyramidal shape. 1 lone pair on N reduces bond angle from 109.5\u00b0 to 107\u00b0. Acts as an electron donor (Lewis base).",
    atoms: [
      { element: "N", pos: [0, 0.4, 0], color: 0x3b82f6, radius: 0.45 },
      { element: "H", pos: [-1.1, -0.4, 0.6], color: 0xfafafa, radius: 0.28 },
      { element: "H", pos: [1.1, -0.4, 0.6], color: 0xfafafa, radius: 0.28 },
      { element: "H", pos: [0, -0.4, -1.2], color: 0xfafafa, radius: 0.28 },
    ],
    bonds: [[0, 1], [0, 2], [0, 3]],
    boardFact: "Trigonal pyramidal \u2022 107\u00b0 \u2022 sp\u00b3 \u2022 Basic nature \u2022 Fertilizer production",
    xpReward: 50,
  },
];

const REACTIONS = [
  { id: "comb", name: "Combustion of Methane", equation: "CH\u2084 + 2O\u2082 \u2192 CO\u2082 + 2H\u2082O", type: "Exothermic", topic: "Chemical Reactions", heat: "\u2212890 kJ/mol", description: "Methane burns in oxygen releasing large amounts of heat and light. Carbon is fully oxidised to CO\u2082." },
  { id: "neut", name: "Acid-Base Neutralization", equation: "HCl + NaOH \u2192 NaCl + H\u2082O", type: "Neutralization", topic: "Acids, Bases & Salts", heat: "\u221257.3 kJ/mol", description: "Strong acid reacts with strong base to form salt and water. pH moves from extreme to neutral (7)." },
  { id: "redox", name: "Iron Rusting", equation: "4Fe + 3O\u2082 \u2192 2Fe\u2082O\u2083", type: "Oxidation-Reduction", topic: "Metals & Non-Metals", heat: "Slow spontaneous", description: "Iron loses electrons (oxidised) to oxygen (reduced), forming iron oxide (rust). Slow corrosion process." },
  { id: "synth", name: "Water Synthesis", equation: "2H\u2082 + O\u2082 \u2192 2H\u2082O", type: "Synthesis / Combination", topic: "Chemical Bonding", heat: "\u2212572 kJ/mol", description: "Hydrogen and oxygen combine exothermically to form water. Reverse of electrolysis of water." },
];

const CHAPTERS = [
  { id: 1, name: "Matter in Our Surroundings", done: true, xp: 80 },
  { id: 2, name: "Atoms & Molecules", done: true, xp: 90 },
  { id: 3, name: "Structure of the Atom", done: true, xp: 85 },
  { id: 4, name: "Chemical Bonding & Molecular Structure", done: false, xp: 0 },
  { id: 5, name: "Chemical Reactions & Equations", done: false, xp: 0 },
  { id: 6, name: "Acids, Bases and Salts", done: false, xp: 0 },
  { id: 7, name: "Metals and Non-Metals", done: false, xp: 0 },
  { id: 8, name: "Carbon and its Compounds", done: false, xp: 0 },
];

function MoleculeViewer3D({ molecule }: { molecule: typeof MOLECULES[0] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const w = c.clientWidth || 400, h = c.clientHeight || 300;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch { return; }
    renderer.setSize(w, h); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    c.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.set(0, 0, 7);
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const pl = new THREE.PointLight(molecule.color, 5, 20); pl.position.set(3, 3, 3); scene.add(pl);
    scene.add(new THREE.PointLight(0xffffff, 2, 20));
    const group = new THREE.Group(); scene.add(group);
    const cx = molecule.atoms.reduce((s, a) => s + a.pos[0], 0) / molecule.atoms.length;
    const cy = molecule.atoms.reduce((s, a) => s + a.pos[1], 0) / molecule.atoms.length;
    const cz = molecule.atoms.reduce((s, a) => s + a.pos[2], 0) / molecule.atoms.length;
    const meshes: THREE.Mesh[] = molecule.atoms.map(a => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(a.radius, 32, 32), new THREE.MeshStandardMaterial({ color: a.color, roughness: 0.15, metalness: 0.6, emissive: a.color, emissiveIntensity: 0.15 }));
      m.position.set(a.pos[0] - cx, a.pos[1] - cy, a.pos[2] - cz); group.add(m); return m;
    });
    molecule.bonds.forEach(([i, j]) => {
      const a1 = meshes[i].position, a2 = meshes[j].position;
      const dir = new THREE.Vector3().subVectors(a2, a1);
      const len = dir.length(), mid = new THREE.Vector3().addVectors(a1, a2).multiplyScalar(0.5);
      const bond = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, len, 12), new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.3, metalness: 0.5 }));
      bond.position.copy(mid); bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize()); group.add(bond);
    });
    let drag = false, prev = { x: 0, y: 0 };
    const onDown = (e: MouseEvent) => { drag = true; prev = { x: e.clientX, y: e.clientY }; };
    const onMove = (e: MouseEvent) => { if (!drag) return; group.rotation.y += (e.clientX - prev.x) * 0.01; group.rotation.x += (e.clientY - prev.y) * 0.01; prev = { x: e.clientX, y: e.clientY }; };
    const onUp = () => { drag = false; };
    renderer.domElement.addEventListener("mousedown", onDown); window.addEventListener("mousemove", onMove); window.addEventListener("mouseup", onUp);
    let id: number;
    const animate = () => { id = requestAnimationFrame(animate); if (!drag) group.rotation.y += 0.005; renderer.render(scene, camera); }; animate();
    return () => { cancelAnimationFrame(id); renderer.domElement.removeEventListener("mousedown", onDown); window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); renderer.dispose(); if (c.contains(renderer.domElement)) c.removeChild(renderer.domElement); };
  }, [molecule]);
  return <div ref={ref} className="w-full h-full" />;
}

export default function ChemistryLabPage() {
  const [tab, setTab] = useState<"molecules" | "reactions" | "syllabus">("molecules");
  const [mol, setMol] = useState(MOLECULES[0]);
  const [rxn, setRxn] = useState(REACTIONS[0]);
  const [xp, setXp] = useState(0);
  const [done, setDone] = useState<string[]>([]);
  const [quiz, setQuiz] = useState<"idle" | "q" | "right" | "wrong">("idle");
  const [aiText, setAiText] = useState(""); const [aiLoading, setAiLoading] = useState(false);

  const QUIZZES: Record<string, { q: string; opts: string[]; ans: number }> = {
    h2o: { q: "What is the bond angle in H\u2082O?", opts: ["180\u00b0", "104.5\u00b0", "109.5\u00b0", "120\u00b0"], ans: 1 },
    co2: { q: "What is the molecular geometry of CO\u2082?", opts: ["Bent", "Linear", "Tetrahedral", "Trigonal"], ans: 1 },
    ch4: { q: "What hybridization does Carbon have in CH\u2084?", opts: ["sp", "sp\u00b2", "sp\u00b3", "sp\u00b3d"], ans: 2 },
    nh3: { q: "Why is the NH\u2083 bond angle 107\u00b0, not 109.5\u00b0?", opts: ["Double bond repulsion", "Lone pair repulsion", "Ionic character", "Ring strain"], ans: 1 },
  };

  const selectMol = (m: typeof MOLECULES[0]) => { setMol(m); setQuiz("idle"); setAiText(""); };
  const markStudied = () => { if (!done.includes(mol.id)) { setDone(p => [...p, mol.id]); setXp(p => p + mol.xpReward); setQuiz("q"); } };
  const answer = (i: number) => { const q = QUIZZES[mol.id]; if (!q) return; if (i === q.ans) { setXp(p => p + 20); setQuiz("right"); } else setQuiz("wrong"); };
  const askAI = async () => {
    setAiLoading(true); setAiText("");
    try {
      const r = await fetch("/api/tutor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: `Explain ${mol.name} (${mol.formula}) molecular geometry, hybridization ${mol.hybridization}, and bond angle ${mol.bondAngle} for Class 10/12 board exam in under 80 words.`, context: "chemistry" }) });
      const d = await r.json(); setAiText(d.response || d.message || "See description below.");
    } catch { setAiText(`${mol.name} has ${mol.geometry} geometry (bond angle ${mol.bondAngle}). Hybridization: ${mol.hybridization}. ${mol.description}`); }
    finally { setAiLoading(false); }
  };
  const q = QUIZZES[mol.id];

  return (
    <div className="min-h-screen bg-[#060914] flex flex-col">
      <Navbar />
      <div className="relative overflow-hidden bg-gradient-to-br from-cyan-950/80 via-slate-900 to-[#060914] border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 mb-4 text-xs">
            <Link href="/worlds" className="text-slate-400 hover:text-white flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Worlds</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-cyan-400 font-semibold">Chemistry 3D Lab</span>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Atom className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">Chemistry 3D Molecular Lab</h1>
                <p className="text-xs text-cyan-300 font-semibold">Class 10 & 12 \u2022 CBSE/ICSE Board Aligned</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-white font-bold text-lg">{980 + xp} XP</span>
              <span className="text-[10px] text-slate-400">+{xp} this session</span>
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            {(["molecules", "reactions", "syllabus"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all ${tab === t ? "bg-cyan-500/20 text-cyan-300 border-b-2 border-cyan-400" : "text-slate-400 hover:text-white"}`}>
                {t === "molecules" ? "\ud83d\udd2c 3D Molecules" : t === "reactions" ? "\u2697\ufe0f Reactions" : "\ud83d\udcda Syllabus"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {tab === "molecules" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Select Molecule</h3>
              {MOLECULES.map(m => (
                <button key={m.id} onClick={() => selectMol(m)} className={`w-full text-left p-3 rounded-xl border transition-all ${mol.id === m.id ? "bg-cyan-950/50 border-cyan-400 shadow-lg shadow-cyan-500/10" : "bg-slate-900/60 border-white/10 hover:border-white/25"}`}>
                  <div className="flex items-center justify-between">
                    <div><div className="font-mono text-sm font-black text-white">{m.formula}</div><div className="text-[11px] text-slate-400">{m.name}</div></div>
                    {done.includes(m.id) && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <div className="text-[10px] text-cyan-400 mt-1">{m.geometry}</div>
                </button>
              ))}
            </div>
            <div className="lg:col-span-9 space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                <div className="lg:col-span-3 h-72 rounded-2xl bg-slate-900/80 border border-cyan-500/20 overflow-hidden relative">
                  <MoleculeViewer3D molecule={mol} />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2 py-1 rounded-lg bg-black/60 text-cyan-300 text-[10px] font-mono font-bold">{mol.formula}</span>
                    <span className="px-2 py-1 rounded-lg bg-black/60 text-slate-300 text-[10px]">Drag to rotate</span>
                  </div>
                  <div className="absolute bottom-3 right-3 text-[10px] font-mono text-cyan-400 bg-black/60 px-2 py-1 rounded">Bond Angle: {mol.bondAngle}</div>
                </div>
                <div className="lg:col-span-2 space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
                    <h3 className="text-base font-black text-white">{mol.name}</h3>
                    {[["Formula", mol.formula], ["Geometry", mol.geometry], ["Bond Angle", mol.bondAngle], ["Hybridization", mol.hybridization]].map(([l, v]) => (
                      <div key={l} className="flex justify-between"><span className="text-[11px] text-slate-400">{l}</span><span className="text-[11px] font-bold text-white font-mono">{v}</span></div>
                    ))}
                    <div className="pt-2 border-t border-white/10"><p className="text-[10px] text-cyan-300 leading-relaxed">{mol.boardFact}</p></div>
                  </div>
                  <button onClick={markStudied} disabled={done.includes(mol.id)} className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${done.includes(mol.id) ? "bg-emerald-900/40 text-emerald-400 border border-emerald-500/30 cursor-default" : "bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white shadow-lg shadow-cyan-500/20"}`}>
                    {done.includes(mol.id) ? <><CheckCircle2 className="w-3.5 h-3.5" /> Studied! +{mol.xpReward} XP</> : <><BookOpen className="w-3.5 h-3.5" /> Mark Studied +{mol.xpReward} XP</>}
                  </button>
                  <button onClick={askAI} disabled={aiLoading} className="w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 bg-violet-900/40 hover:bg-violet-900/60 text-violet-300 border border-violet-500/30">
                    <Bot className="w-3.5 h-3.5" />{aiLoading ? "AI thinking..." : "Ask AI Tutor"}
                  </button>
                </div>
              </div>
              {aiText && <div className="p-4 rounded-2xl bg-violet-950/40 border border-violet-500/30"><div className="flex items-center gap-2 mb-2"><Bot className="w-4 h-4 text-violet-400" /><span className="text-xs font-bold text-violet-300">AI Tutor</span></div><p className="text-sm text-slate-300 leading-relaxed">{aiText}</p></div>}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10"><div className="flex items-center gap-2 mb-2"><Info className="w-3.5 h-3.5 text-cyan-400" /><span className="text-xs font-bold text-white">Concept</span></div><p className="text-sm text-slate-300 leading-relaxed">{mol.description}</p></div>
              {quiz === "q" && q && (
                <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/30">
                  <div className="flex items-center gap-2 mb-3"><Sparkles className="w-4 h-4 text-amber-400" /><span className="text-xs font-bold text-amber-300">Quick Quiz \u2014 Earn +20 XP</span></div>
                  <p className="text-sm text-white font-semibold mb-3">{q.q}</p>
                  <div className="grid grid-cols-2 gap-2">{q.opts.map((o, i) => <button key={i} onClick={() => answer(i)} className="py-2 px-3 rounded-xl text-xs font-semibold text-white bg-slate-800/80 hover:bg-amber-900/50 border border-white/15 hover:border-amber-400/50 transition-all">{o}</button>)}</div>
                </div>
              )}
              {quiz === "right" && <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400" /><div><p className="text-sm font-bold text-emerald-300">Correct! +20 XP Earned</p><p className="text-xs text-slate-400">Great understanding of {mol.name}!</p></div></div>}
              {quiz === "wrong" && <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center justify-between gap-3"><div><p className="text-sm font-bold text-red-300">Not quite!</p><p className="text-xs text-slate-400">Answer: {q?.opts[q.ans]}</p></div><button onClick={() => setQuiz("q")} className="px-3 py-1.5 rounded-lg bg-red-900/50 text-red-300 text-xs font-bold flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Retry</button></div>}
            </div>
          </div>
        )}
        {tab === "reactions" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Chemical Reactions</h3>
              {REACTIONS.map(r => (
                <button key={r.id} onClick={() => setRxn(r)} className={`w-full text-left p-4 rounded-xl border transition-all ${rxn.id === r.id ? "bg-slate-800/80 border-cyan-400 shadow-lg shadow-cyan-500/10" : "bg-slate-900/60 border-white/10 hover:border-white/25"}`}>
                  <div className="flex items-center justify-between mb-1"><span className="text-xs font-black text-white">{r.name}</span><span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">{r.type}</span></div>
                  <p className="font-mono text-xs text-cyan-400 mt-1">{r.equation}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{r.topic}</p>
                </button>
              ))}
            </div>
            <div className="lg:col-span-8 space-y-5">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-5">
                <div><span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">{rxn.type}</span><h2 className="text-xl font-black text-white mt-1">{rxn.name}</h2></div>
                <div className="p-5 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 border border-white/10 text-center">
                  <div className="font-mono text-2xl font-black text-cyan-400 tracking-wide">{rxn.equation}</div>
                  <div className="mt-2 text-xs text-slate-400">Energy: {rxn.heat}</div>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{rxn.description}</p>
                <div className="grid grid-cols-3 gap-3">
                  {[["Type", rxn.type], ["Topic", rxn.topic], ["Energy", rxn.heat]].map(([l, v]) => (
                    <div key={l} className="p-3 rounded-xl bg-slate-800/60 border border-white/10 text-center"><div className="text-[10px] text-slate-400 mb-1">{l}</div><div className="text-xs font-bold text-white">{v}</div></div>
                  ))}
                </div>
                <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20"><div className="flex items-center gap-2 mb-2"><Award className="w-3.5 h-3.5 text-cyan-400" /><span className="text-[11px] font-bold text-cyan-300">Board Exam Tip</span></div><p className="text-xs text-slate-300">Balance equations by adjusting coefficients (not subscripts). Identify oxidised and reduced species for MCQ answers.</p></div>
                <div className="flex gap-3">
                  <Link href={`/tutor?prompt=${encodeURIComponent("Explain " + rxn.name + ": " + rxn.equation + " for board exams")}`} className="flex-1 py-2.5 rounded-xl bg-violet-900/40 hover:bg-violet-900/60 text-violet-300 border border-violet-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all"><Bot className="w-3.5 h-3.5" /> Ask AI Tutor</Link>
                  <Link href="/exams" className="flex-1 py-2.5 rounded-xl bg-amber-900/40 hover:bg-amber-900/60 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all"><FlaskConical className="w-3.5 h-3.5" /> Practice MCQ</Link>
                </div>
              </div>
            </div>
          </div>
        )}
        {tab === "syllabus" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CHAPTERS.map(ch => (
                <div key={ch.id} className={`p-4 rounded-2xl border ${ch.done ? "bg-emerald-950/30 border-emerald-500/30" : "bg-slate-900/60 border-white/10"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div><span className="text-[10px] font-mono text-slate-500">Chapter {ch.id}</span><h4 className="text-sm font-bold text-white mt-0.5">{ch.name}</h4></div>
                    {ch.done ? <div className="flex items-center gap-1 text-emerald-400 shrink-0"><CheckCircle2 className="w-4 h-4" /><span className="text-[10px] font-bold">{ch.xp} XP</span></div> : <span className="text-[10px] text-slate-500 shrink-0">Not started</span>}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link href={`/tutor?prompt=${encodeURIComponent("Teach me " + ch.name + " for Class 10/12 Chemistry board exam")}`} className="flex-1 text-center py-1.5 rounded-lg bg-violet-900/30 hover:bg-violet-900/50 text-violet-300 text-[11px] font-bold border border-violet-500/20 transition-all">Study with AI</Link>
                    <Link href="/exams" className="flex-1 text-center py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 text-[11px] font-bold border border-white/10 transition-all">Test</Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/50 to-slate-900 border border-cyan-500/20">
              <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-bold text-white">Chemistry Progress</h3><span className="text-xs text-cyan-400 font-bold">{CHAPTERS.filter(c => c.done).length}/{CHAPTERS.length} Chapters</span></div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full" style={{ width: `${(CHAPTERS.filter(c => c.done).length / CHAPTERS.length) * 100}%` }} /></div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
