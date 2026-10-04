"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import * as THREE from "three";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Globe2, ArrowLeft, ChevronRight, Bot, BookOpen, CheckCircle2, Star, Info, Sparkles, RotateCcw, Map } from "lucide-react";

const GEO_TOPICS = [
  {
    id: "earth_structure", name: "Structure of the Earth", icon: "\ud83c\udf0e",
    desc: "The Earth has 4 layers: Crust (0-30 km), Mantle (30-2900 km), Outer Core (2900-5100 km, liquid iron), Inner Core (5100-6371 km, solid iron-nickel).",
    facts: ["Crust: Thin solid layer (5-30 km)", "Mantle: Semi-molten rock, 2870 km thick", "Outer Core: Liquid iron & nickel", "Inner Core: Solid, ~1220 km radius"],
    quiz: { q: "Which layer of Earth is liquid?", opts: ["Crust", "Mantle", "Outer Core", "Inner Core"], ans: 2 },
    color: 0x10b981, xpReward: 40,
  },
  {
    id: "atmosphere", name: "Layers of the Atmosphere", icon: "\ud83c\udf2b\ufe0f",
    desc: "Earth\u2019s atmosphere has 5 layers: Troposphere (weather), Stratosphere (ozone), Mesosphere (meteors), Thermosphere (ISS), Exosphere (space boundary).",
    facts: ["Troposphere: 0-12 km, weather occurs", "Stratosphere: 12-50 km, ozone layer", "Mesosphere: 50-80 km, meteors burn", "Thermosphere: 80-700 km, auroras occur"],
    quiz: { q: "In which layer does weather occur?", opts: ["Stratosphere", "Mesosphere", "Troposphere", "Thermosphere"], ans: 2 },
    color: 0x06b6d4, xpReward: 40,
  },
  {
    id: "plate_tectonics", name: "Plate Tectonics", icon: "\ud83c\udf0b",
    desc: "Earth\u2019s lithosphere is divided into 15+ tectonic plates that move on the asthenosphere. Plate boundaries cause earthquakes, volcanoes, and mountain formation.",
    facts: ["Convergent: Plates collide (mountains)", "Divergent: Plates apart (mid-ocean ridge)", "Transform: Plates slide (San Andreas)", "Subduction: Denser plate sinks under lighter"],
    quiz: { q: "Mountains form at which plate boundary?", opts: ["Divergent", "Transform", "Convergent", "Passive"], ans: 2 },
    color: 0xf97316, xpReward: 50,
  },
  {
    id: "rivers", name: "River Systems & Drainage", icon: "\ud83c\udf0a",
    desc: "Rivers are classified by drainage patterns: Dendritic (tree-like), Radial (outward from hills), Trellis (rock layers), Parallel (same direction slope).",
    facts: ["River profile: Young (steep), Mature (meanders), Old (delta)", "Tributaries join main river", "Distributaries form at deltas", "Erosion, Transportation, Deposition"],
    quiz: { q: "Which river drainage pattern looks like a tree?", opts: ["Radial", "Trellis", "Dendritic", "Parallel"], ans: 2 },
    color: 0x3b82f6, xpReward: 45,
  },
];

const CHAPTERS = [
  { id: 1, name: "Resources and Development", done: true, xp: 80 },
  { id: 2, name: "Forest and Wildlife Resources", done: true, xp: 75 },
  { id: 3, name: "Water Resources", done: false, xp: 0 },
  { id: 4, name: "Agriculture", done: false, xp: 0 },
  { id: 5, name: "Minerals and Energy Resources", done: false, xp: 0 },
  { id: 6, name: "Manufacturing Industries", done: false, xp: 0 },
  { id: 7, name: "Lifelines of National Economy", done: false, xp: 0 },
];

function EarthGlobe() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const w = c.clientWidth || 400, h = c.clientHeight || 280;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch { return; }
    renderer.setSize(w, h); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); c.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(0, 0, 5);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const sunLight = new THREE.DirectionalLight(0xffffff, 2); sunLight.position.set(5, 3, 5); scene.add(sunLight);
    const group = new THREE.Group(); scene.add(group);

    // Inner Core
    group.add(new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32), new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.5 })));
    // Outer Core
    const outerCore = new THREE.Mesh(new THREE.SphereGeometry(1.1, 32, 32), new THREE.MeshStandardMaterial({ color: 0xef4444, transparent: true, opacity: 0.5, wireframe: false }));
    group.add(outerCore);
    // Mantle
    const mantle = new THREE.Mesh(new THREE.SphereGeometry(1.55, 32, 32), new THREE.MeshStandardMaterial({ color: 0xb45309, transparent: true, opacity: 0.4 }));
    group.add(mantle);
    // Crust
    const crust = new THREE.Mesh(new THREE.SphereGeometry(1.8, 32, 32), new THREE.MeshStandardMaterial({ color: 0x22c55e, transparent: true, opacity: 0.35, wireframe: true }));
    group.add(crust);
    // Ocean
    const ocean = new THREE.Mesh(new THREE.SphereGeometry(1.85, 64, 64), new THREE.MeshStandardMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.4 }));
    group.add(ocean);

    let drag = false, prev = { x: 0, y: 0 };
    const onDown = (e: MouseEvent) => { drag = true; prev = { x: e.clientX, y: e.clientY }; };
    const onMove = (e: MouseEvent) => { if (!drag) return; group.rotation.y += (e.clientX - prev.x) * 0.01; group.rotation.x += (e.clientY - prev.y) * 0.01; prev = { x: e.clientX, y: e.clientY }; };
    const onUp = () => { drag = false; };
    renderer.domElement.addEventListener("mousedown", onDown); window.addEventListener("mousemove", onMove); window.addEventListener("mouseup", onUp);
    let id: number;
    const animate = () => { id = requestAnimationFrame(animate); if (!drag) group.rotation.y += 0.003; renderer.render(scene, camera); }; animate();
    return () => { cancelAnimationFrame(id); renderer.domElement.removeEventListener("mousedown", onDown); window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); renderer.dispose(); if (c.contains(renderer.domElement)) c.removeChild(renderer.domElement); };
  }, []);
  return <div ref={ref} className="w-full h-full" />;
}

export default function GeographyLabPage() {
  const [tab, setTab] = useState<"explore" | "syllabus">("explore");
  const [topic, setTopic] = useState(GEO_TOPICS[0]);
  const [xp, setXp] = useState(0);
  const [done, setDone] = useState<string[]>([]);
  const [quiz, setQuiz] = useState<"idle" | "q" | "right" | "wrong">("idle");
  const [aiText, setAiText] = useState(""); const [aiLoading, setAiLoading] = useState(false);

  const selectTopic = (t: typeof GEO_TOPICS[0]) => { setTopic(t); setQuiz("idle"); setAiText(""); };
  const markStudied = () => { if (!done.includes(topic.id)) { setDone(p => [...p, topic.id]); setXp(p => p + topic.xpReward); setQuiz("q"); } };
  const answer = (i: number) => { if (i === topic.quiz.ans) { setXp(p => p + 20); setQuiz("right"); } else setQuiz("wrong"); };
  const askAI = async () => {
    setAiLoading(true); setAiText("");
    try {
      const r = await fetch("/api/tutor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: `Explain ${topic.name} for Class 10 Geography/Social Science board exam in under 80 words.`, context: "geography" }) });
      const d = await r.json(); setAiText(d.response || d.message || topic.desc);
    } catch { setAiText(topic.desc); }
    finally { setAiLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#060914] flex flex-col">
      <Navbar />
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950/80 via-slate-900 to-[#060914] border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 mb-4 text-xs">
            <Link href="/worlds" className="text-slate-400 hover:text-white flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Worlds</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-emerald-400 font-semibold">Geography & Earth Science</span>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Globe2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">Geography & Earth Science Lab</h1>
                <p className="text-xs text-emerald-300 font-semibold">Class 10 Social Science \u2022 CBSE/ICSE Board Aligned</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-white font-bold text-lg">{640 + xp} XP</span>
              <span className="text-[10px] text-slate-400">+{xp} this session</span>
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            {(["explore", "syllabus"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all ${tab === t ? "bg-emerald-500/20 text-emerald-300 border-b-2 border-emerald-400" : "text-slate-400 hover:text-white"}`}>
                {t === "explore" ? "\ud83c\udf0d Earth Explorer" : "\ud83d\udcda Syllabus"}
              </button>
            ))}
          </div>
        </div>
      </div>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {tab === "explore" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Select Topic</h3>
              {GEO_TOPICS.map(t => (
                <button key={t.id} onClick={() => selectTopic(t)} className={`w-full text-left p-3 rounded-xl border transition-all ${topic.id === t.id ? "bg-emerald-950/50 border-emerald-400 shadow-lg" : "bg-slate-900/60 border-white/10 hover:border-white/25"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><span className="text-xl">{t.icon}</span><div><div className="text-xs font-bold text-white">{t.name}</div><div className="text-[10px] text-emerald-400">+{t.xpReward} XP</div></div></div>
                    {done.includes(t.id) && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </div>
                </button>
              ))}
            </div>
            <div className="lg:col-span-9 space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                <div className="lg:col-span-3 h-72 rounded-2xl bg-slate-900/80 border border-emerald-500/20 overflow-hidden relative">
                  <EarthGlobe />
                  <div className="absolute top-3 left-3"><span className="px-2 py-1 rounded-lg bg-black/60 text-emerald-300 text-[10px] font-mono font-bold">{topic.name}</span></div>
                  <div className="absolute bottom-3 right-3 text-[10px] text-emerald-400 bg-black/60 px-2 py-1 rounded">Drag to rotate</div>
                </div>
                <div className="lg:col-span-2 space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10">
                    <h3 className="text-sm font-black text-white mb-3">{topic.name}</h3>
                    <div className="space-y-2">{topic.facts.map((f, i) => <div key={i} className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5 shrink-0">\u2022</span><span className="text-[11px] text-slate-300">{f}</span></div>)}</div>
                  </div>
                  <button onClick={markStudied} disabled={done.includes(topic.id)} className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${done.includes(topic.id) ? "bg-emerald-900/40 text-emerald-400 border border-emerald-500/30 cursor-default" : "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/20"}`}>
                    {done.includes(topic.id) ? <><CheckCircle2 className="w-3.5 h-3.5" /> Studied! +{topic.xpReward} XP</> : <><BookOpen className="w-3.5 h-3.5" /> Mark Studied +{topic.xpReward} XP</>}
                  </button>
                  <button onClick={askAI} disabled={aiLoading} className="w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 bg-violet-900/40 hover:bg-violet-900/60 text-violet-300 border border-violet-500/30">
                    <Bot className="w-3.5 h-3.5" />{aiLoading ? "AI thinking..." : "Ask AI Tutor"}
                  </button>
                </div>
              </div>
              {aiText && <div className="p-4 rounded-2xl bg-violet-950/40 border border-violet-500/30"><div className="flex items-center gap-2 mb-2"><Bot className="w-4 h-4 text-violet-400" /><span className="text-xs font-bold text-violet-300">AI Tutor</span></div><p className="text-sm text-slate-300 leading-relaxed">{aiText}</p></div>}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10"><div className="flex items-center gap-2 mb-2"><Info className="w-3.5 h-3.5 text-emerald-400" /><span className="text-xs font-bold text-white">Concept</span></div><p className="text-sm text-slate-300 leading-relaxed">{topic.desc}</p></div>
              {quiz === "q" && (
                <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/30">
                  <div className="flex items-center gap-2 mb-3"><Sparkles className="w-4 h-4 text-amber-400" /><span className="text-xs font-bold text-amber-300">Quick Quiz \u2014 Earn +20 XP</span></div>
                  <p className="text-sm text-white font-semibold mb-3">{topic.quiz.q}</p>
                  <div className="grid grid-cols-2 gap-2">{topic.quiz.opts.map((o, i) => <button key={i} onClick={() => answer(i)} className="py-2 px-3 rounded-xl text-xs font-semibold text-white bg-slate-800/80 hover:bg-amber-900/50 border border-white/15 hover:border-amber-400/50 transition-all">{o}</button>)}</div>
                </div>
              )}
              {quiz === "right" && <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400" /><p className="text-sm font-bold text-emerald-300">Correct! +20 XP</p></div>}
              {quiz === "wrong" && <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center justify-between"><div><p className="text-sm font-bold text-red-300">Not quite!</p><p className="text-xs text-slate-400">Answer: {topic.quiz.opts[topic.quiz.ans]}</p></div><button onClick={() => setQuiz("q")} className="px-3 py-1.5 rounded-lg bg-red-900/50 text-red-300 text-xs font-bold flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Retry</button></div>}
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
                  <Link href={`/tutor?prompt=${encodeURIComponent("Teach me " + ch.name + " for Class 10 Social Science Geography board exam")}`} className="flex-1 text-center py-1.5 rounded-lg bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-300 text-[11px] font-bold border border-emerald-500/20 transition-all">Study with AI</Link>
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
