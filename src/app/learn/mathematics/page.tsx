"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import * as THREE from "three";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Calculator, ArrowLeft, ChevronRight, Bot, BookOpen, CheckCircle2, Star, Info, Sparkles, RotateCcw, Sliders } from "lucide-react";

const SOLIDS = [
  {
    id: "cylinder", name: "Cylinder", icon: "\u23f3",
    formulaV: "V = \u03c0r\u00b2h", formulaCSA: "CSA = 2\u03c0rh", formulaTSA: "TSA = 2\u03c0r(h+r)",
    color: 0x06b6d4,
    desc: "A cylinder has two circular bases. Volume = \u03c0r\u00b2h. Curved Surface Area = 2\u03c0rh. Total SA = 2\u03c0r(r+h).",
    boardFact: "Cylinder is a right circular solid. Very common in board exam mensuration problems.",
    quiz: { q: "Volume of a cylinder with r=7, h=10 is:", opts: ["1540 cm\u00b3", "154 cm\u00b3", "770 cm\u00b3", "308 cm\u00b3"], ans: 0 },
  },
  {
    id: "cone", name: "Cone", icon: "\ud83d\udce2",
    formulaV: "V = (1/3)\u03c0r\u00b2h", formulaCSA: "CSA = \u03c0rl", formulaTSA: "TSA = \u03c0r(l+r)",
    color: 0xf59e0b,
    desc: "A cone has one circular base and an apex. Volume is 1/3 of cylinder. Slant height l = \u221a(r\u00b2 + h\u00b2).",
    boardFact: "Cone:Cylinder volume ratio = 1:3 when base and height are equal. Key board exam theorem!",
    quiz: { q: "Slant height of cone with r=3, h=4 is:", opts: ["5 cm", "7 cm", "3 cm", "4.5 cm"], ans: 0 },
  },
  {
    id: "sphere", name: "Sphere", icon: "\ud83c\udf10",
    formulaV: "V = (4/3)\u03c0r\u00b3", formulaCSA: "CSA = 4\u03c0r\u00b2", formulaTSA: "TSA = 4\u03c0r\u00b2",
    color: 0x10b981,
    desc: "A sphere is perfectly round. All surface area formulas give 4\u03c0r\u00b2. Volume = (4/3)\u03c0r\u00b3.",
    boardFact: "Sphere SA:Volume ratio = 3/r. Important: hemisphere TSA = 3\u03c0r\u00b2.",
    quiz: { q: "Surface area of sphere with r=7 is:", opts: ["616 cm\u00b2", "154 cm\u00b2", "308 cm\u00b2", "1232 cm\u00b2"], ans: 0 },
  },
  {
    id: "pyramid", name: "Square Pyramid", icon: "\u26b3",
    formulaV: "V = (1/3) \u00d7 base\u00b2 \u00d7 h", formulaCSA: "CSA = 2 \u00d7 base \u00d7 l", formulaTSA: "TSA = base\u00b2 + 2 \u00d7 base \u00d7 l",
    color: 0x8b5cf6,
    desc: "A square pyramid has a square base and 4 triangular faces meeting at an apex. Euler\u2019s Formula: V \u2212 E + F = 2.",
    boardFact: "Euler\u2019s Formula V \u2212 E + F = 2 applies to all convex polyhedra. Square pyramid: 5 \u2212 8 + 5 = 2.",
    quiz: { q: "Euler\u2019s formula gives V \u2212 E + F =", opts: ["2", "0", "1", "4"], ans: 0 },
  },
];

const CHAPTERS = [
  { id: 1, name: "Real Numbers", done: true, xp: 80 },
  { id: 2, name: "Polynomials", done: true, xp: 75 },
  { id: 3, name: "Pair of Linear Equations", done: true, xp: 85 },
  { id: 4, name: "Quadratic Equations", done: false, xp: 0 },
  { id: 5, name: "Arithmetic Progressions", done: false, xp: 0 },
  { id: 6, name: "Triangles", done: false, xp: 0 },
  { id: 7, name: "Coordinate Geometry", done: false, xp: 0 },
  { id: 8, name: "Surface Areas & Volumes", done: false, xp: 0 },
  { id: 9, name: "Statistics & Probability", done: false, xp: 0 },
];

function SolidViewer3D({ solid, radius, height }: { solid: typeof SOLIDS[0]; radius: number; height: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const w = c.clientWidth || 400, h2 = c.clientHeight || 300;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch { return; }
    renderer.setSize(w, h2); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); c.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h2, 0.1, 100);
    camera.position.set(0, 2, 8);
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const pl = new THREE.PointLight(solid.color, 5, 20); pl.position.set(4, 4, 4); scene.add(pl);
    scene.add(new THREE.PointLight(0xffffff, 1.5, 20));
    const group = new THREE.Group(); scene.add(group);
    const mat = new THREE.MeshStandardMaterial({ color: solid.color, roughness: 0.2, metalness: 0.6, emissive: solid.color, emissiveIntensity: 0.1 });
    const wireMat = new THREE.MeshStandardMaterial({ color: solid.color, wireframe: true, transparent: true, opacity: 0.25, emissive: solid.color, emissiveIntensity: 0.5 });
    const r = Math.max(radius / 10, 0.3), ht = Math.max(height / 10, 0.4);
    let geo: THREE.BufferGeometry;
    if (solid.id === "cylinder") geo = new THREE.CylinderGeometry(r, r, ht, 32);
    else if (solid.id === "cone") geo = new THREE.ConeGeometry(r, ht, 32);
    else if (solid.id === "sphere") geo = new THREE.SphereGeometry(r, 32, 32);
    else geo = new THREE.ConeGeometry(r, ht, 4);
    group.add(new THREE.Mesh(geo, mat));
    group.add(new THREE.Mesh(geo.clone(), wireMat));
    let drag = false, prev = { x: 0, y: 0 };
    const onDown = (e: MouseEvent) => { drag = true; prev = { x: e.clientX, y: e.clientY }; };
    const onMove = (e: MouseEvent) => { if (!drag) return; group.rotation.y += (e.clientX - prev.x) * 0.01; group.rotation.x += (e.clientY - prev.y) * 0.01; prev = { x: e.clientX, y: e.clientY }; };
    const onUp = () => { drag = false; };
    renderer.domElement.addEventListener("mousedown", onDown); window.addEventListener("mousemove", onMove); window.addEventListener("mouseup", onUp);
    let id: number;
    const animate = () => { id = requestAnimationFrame(animate); if (!drag) group.rotation.y += 0.006; renderer.render(scene, camera); }; animate();
    return () => { cancelAnimationFrame(id); renderer.domElement.removeEventListener("mousedown", onDown); window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); renderer.dispose(); if (c.contains(renderer.domElement)) c.removeChild(renderer.domElement); };
  }, [solid, radius, height]);
  return <div ref={ref} className="w-full h-full" />;
}

function calcValues(solid: typeof SOLIDS[0], r: number, h: number) {
  const pi = Math.PI;
  if (solid.id === "cylinder") return { V: (pi * r * r * h).toFixed(2), CSA: (2 * pi * r * h).toFixed(2), TSA: (2 * pi * r * (r + h)).toFixed(2) };
  if (solid.id === "cone") { const l = Math.sqrt(r * r + h * h); return { V: ((1 / 3) * pi * r * r * h).toFixed(2), CSA: (pi * r * l).toFixed(2), TSA: (pi * r * (r + l)).toFixed(2) }; }
  if (solid.id === "sphere") return { V: ((4 / 3) * pi * r * r * r).toFixed(2), CSA: (4 * pi * r * r).toFixed(2), TSA: (4 * pi * r * r).toFixed(2) };
  const l = Math.sqrt((r / 2) * (r / 2) + h * h); return { V: ((1 / 3) * r * r * h).toFixed(2), CSA: (2 * r * l).toFixed(2), TSA: (r * r + 2 * r * l).toFixed(2) };
}

export default function MathematicsLabPage() {
  const [tab, setTab] = useState<"geometry" | "syllabus">("geometry");
  const [solid, setSolid] = useState(SOLIDS[0]);
  const [radius, setRadius] = useState(7);
  const [height, setHeight] = useState(10);
  const [xp, setXp] = useState(0);
  const [done, setDone] = useState<string[]>([]);
  const [quiz, setQuiz] = useState<"idle" | "q" | "right" | "wrong">("idle");
  const [aiText, setAiText] = useState(""); const [aiLoading, setAiLoading] = useState(false);

  const vals = calcValues(solid, radius, height);

  const selectSolid = (s: typeof SOLIDS[0]) => { setSolid(s); setQuiz("idle"); setAiText(""); };
  const markStudied = () => { if (!done.includes(solid.id)) { setDone(p => [...p, solid.id]); setXp(p => p + 50); setQuiz("q"); } };
  const answer = (i: number) => { if (i === solid.quiz.ans) { setXp(p => p + 20); setQuiz("right"); } else setQuiz("wrong"); };
  const askAI = async () => {
    setAiLoading(true); setAiText("");
    try {
      const r = await fetch("/api/tutor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: `Explain ${solid.name} formulas: Volume = ${solid.formulaV}, CSA = ${solid.formulaCSA}, TSA = ${solid.formulaTSA}. For Class 10/12 board exam in under 80 words.`, context: "mathematics" }) });
      const d = await r.json(); setAiText(d.response || d.message || "See description below.");
    } catch { setAiText(solid.desc); }
    finally { setAiLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#060914] flex flex-col">
      <Navbar />
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-950/80 via-slate-900 to-[#060914] border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 mb-4 text-xs">
            <Link href="/worlds" className="text-slate-400 hover:text-white flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Worlds</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-amber-400 font-semibold">Mathematics 3D Lab</span>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">Mathematics 3D Geometry Lab</h1>
                <p className="text-xs text-amber-300 font-semibold">Class 10 & 12 \u2022 CBSE/ICSE Board Aligned</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-white font-bold text-lg">{860 + xp} XP</span>
              <span className="text-[10px] text-slate-400">+{xp} this session</span>
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            {(["geometry", "syllabus"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all ${tab === t ? "bg-amber-500/20 text-amber-300 border-b-2 border-amber-400" : "text-slate-400 hover:text-white"}`}>
                {t === "geometry" ? "\ud83d\udcd0 3D Mensuration" : "\ud83d\udcda Syllabus"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {tab === "geometry" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Select 3D Solid</h3>
              {SOLIDS.map(s => (
                <button key={s.id} onClick={() => selectSolid(s)} className={`w-full text-left p-3 rounded-xl border transition-all ${solid.id === s.id ? "bg-amber-950/50 border-amber-400 shadow-lg shadow-amber-500/10" : "bg-slate-900/60 border-white/10 hover:border-white/25"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{s.icon}</span>
                      <div><div className="text-xs font-bold text-white">{s.name}</div><div className="font-mono text-[10px] text-amber-400">{s.formulaV}</div></div>
                    </div>
                    {done.includes(s.id) && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </div>
                </button>
              ))}
            </div>
            <div className="lg:col-span-9 space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                <div className="lg:col-span-3 h-72 rounded-2xl bg-slate-900/80 border border-amber-500/20 overflow-hidden relative">
                  <SolidViewer3D solid={solid} radius={radius} height={height} />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2 py-1 rounded-lg bg-black/60 text-amber-300 text-[10px] font-mono font-bold">{solid.name}</span>
                    <span className="px-2 py-1 rounded-lg bg-black/60 text-slate-300 text-[10px]">Drag to rotate</span>
                  </div>
                </div>
                <div className="lg:col-span-2 space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
                    <h3 className="text-base font-black text-white">{solid.name} Formulas</h3>
                    {[["Volume", solid.formulaV], ["Curved SA", solid.formulaCSA], ["Total SA", solid.formulaTSA]].map(([l, v]) => (
                      <div key={l} className="space-y-0.5"><div className="text-[10px] text-slate-400">{l}</div><div className="text-xs font-bold text-amber-300 font-mono">{v}</div></div>
                    ))}
                    <div className="pt-2 border-t border-white/10"><p className="text-[10px] text-amber-200 leading-relaxed">{solid.boardFact}</p></div>
                  </div>
                  <button onClick={markStudied} disabled={done.includes(solid.id)} className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${done.includes(solid.id) ? "bg-emerald-900/40 text-emerald-400 border border-emerald-500/30 cursor-default" : "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-lg shadow-amber-500/20"}`}>
                    {done.includes(solid.id) ? <><CheckCircle2 className="w-3.5 h-3.5" /> Studied! +50 XP</> : <><BookOpen className="w-3.5 h-3.5" /> Mark Studied +50 XP</>}
                  </button>
                  <button onClick={askAI} disabled={aiLoading} className="w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 bg-violet-900/40 hover:bg-violet-900/60 text-violet-300 border border-violet-500/30">
                    <Bot className="w-3.5 h-3.5" />{aiLoading ? "AI thinking..." : "Ask AI Tutor"}
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
                <div className="flex items-center gap-2 mb-4"><Sliders className="w-4 h-4 text-amber-400" /><span className="text-xs font-bold text-white">Adjust Dimensions (r & h)</span></div>
                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold block mb-2">Radius: <span className="text-amber-300">{radius} cm</span></label>
                    <input type="range" min={1} max={20} value={radius} onChange={e => setRadius(Number(e.target.value))} className="w-full accent-amber-500" />
                  </div>
                  {solid.id !== "sphere" && (
                    <div>
                      <label className="text-[11px] text-slate-400 font-semibold block mb-2">Height: <span className="text-amber-300">{height} cm</span></label>
                      <input type="range" min={1} max={30} value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full accent-amber-500" />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[["Volume", `${vals.V} cm\u00b3`], ["Curved SA", `${vals.CSA} cm\u00b2`], ["Total SA", `${vals.TSA} cm\u00b2`]].map(([l, v]) => (
                    <div key={l} className="p-3 rounded-xl bg-slate-800/60 border border-white/10 text-center"><div className="text-[10px] text-slate-400 mb-1">{l}</div><div className="text-sm font-bold text-amber-300 font-mono">{v}</div></div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
                <div className="flex items-center gap-2 mb-2"><Info className="w-3.5 h-3.5 text-amber-400" /><span className="text-xs font-bold text-white">Concept</span></div>
                <p className="text-sm text-slate-300 leading-relaxed">{solid.desc}</p>
              </div>

              {aiText && <div className="p-4 rounded-2xl bg-violet-950/40 border border-violet-500/30"><div className="flex items-center gap-2 mb-2"><Bot className="w-4 h-4 text-violet-400" /><span className="text-xs font-bold text-violet-300">AI Tutor</span></div><p className="text-sm text-slate-300 leading-relaxed">{aiText}</p></div>}

              {quiz === "q" && (
                <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/30">
                  <div className="flex items-center gap-2 mb-3"><Sparkles className="w-4 h-4 text-amber-400" /><span className="text-xs font-bold text-amber-300">Quick Quiz \u2014 Earn +20 XP</span></div>
                  <p className="text-sm text-white font-semibold mb-3">{solid.quiz.q}</p>
                  <div className="grid grid-cols-2 gap-2">{solid.quiz.opts.map((o, i) => <button key={i} onClick={() => answer(i)} className="py-2 px-3 rounded-xl text-xs font-semibold text-white bg-slate-800/80 hover:bg-amber-900/50 border border-white/15 hover:border-amber-400/50 transition-all">{o}</button>)}</div>
                </div>
              )}
              {quiz === "right" && <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400" /><p className="text-sm font-bold text-emerald-300">Correct! +20 XP</p></div>}
              {quiz === "wrong" && <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center justify-between"><div><p className="text-sm font-bold text-red-300">Not quite!</p><p className="text-xs text-slate-400">Answer: {solid.quiz.opts[solid.quiz.ans]}</p></div><button onClick={() => setQuiz("q")} className="px-3 py-1.5 rounded-lg bg-red-900/50 text-red-300 text-xs font-bold flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Retry</button></div>}
            </div>
          </div>
        )}
        {tab === "syllabus" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CHAPTERS.map(ch => (
              <div key={ch.id} className={`p-4 rounded-2xl border ${ch.done ? "bg-emerald-950/30 border-emerald-500/30" : "bg-slate-900/60 border-white/10"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div><span className="text-[10px] font-mono text-slate-500">Chapter {ch.id}</span><h4 className="text-sm font-bold text-white mt-0.5">{ch.name}</h4></div>
                  {ch.done ? <div className="flex items-center gap-1 text-emerald-400 shrink-0"><CheckCircle2 className="w-4 h-4" /><span className="text-[10px] font-bold">{ch.xp} XP</span></div> : <span className="text-[10px] text-slate-500 shrink-0">Not started</span>}
                </div>
                <div className="mt-3 flex gap-2">
                  <Link href={`/tutor?prompt=${encodeURIComponent("Teach me " + ch.name + " for Class 10/12 Mathematics board exam")}`} className="flex-1 text-center py-1.5 rounded-lg bg-amber-900/30 hover:bg-amber-900/50 text-amber-300 text-[11px] font-bold border border-amber-500/20 transition-all">Study with AI</Link>
                  <Link href="/exams" className="flex-1 text-center py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 text-[11px] font-bold border border-white/10 transition-all">Test</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
