"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import * as THREE from "three";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Zap, ArrowLeft, ChevronRight, Play, RotateCcw, Sliders, Bot, BookOpen, CheckCircle2, Star, Info, Sparkles, Award } from "lucide-react";

const TOPICS = [
  { id: "projectile", name: "Projectile Motion", icon: "\ud83d\ude80", formula: "R = v\u00b2 sin2\u03b8 / g", desc: "Analyze parabolic trajectories with adjustable launch angle and initial velocity." },
  { id: "optics", name: "Light & Refraction", icon: "\ud83d\udd26", formula: "n\u2081 sin\u03b8\u2081 = n\u2082 sin\u03b8\u2082", desc: "Simulate Snell\u2019s Law and refraction of light through glass prisms." },
  { id: "gravity", name: "Gravitational Force", icon: "\ud83c\udf0e", formula: "F = Gm\u2081m\u2082 / r\u00b2", desc: "Visualize inverse-square gravitational attraction between planetary bodies." },
  { id: "waves", name: "Sound Waves", icon: "\ud83c\udfb5", formula: "v = f \u00d7 \u03bb", desc: "Explore longitudinal waves, frequency, wavelength, and speed of sound." },
];

const CHAPTERS = [
  { id: 1, name: "Motion", done: true, xp: 90 },
  { id: 2, name: "Force & Laws of Motion", done: true, xp: 85 },
  { id: 3, name: "Gravitation", done: false, xp: 0 },
  { id: 4, name: "Work & Energy", done: false, xp: 0 },
  { id: 5, name: "Sound", done: false, xp: 0 },
  { id: 6, name: "Light \u2013 Reflection & Refraction", done: false, xp: 0 },
  { id: 7, name: "Human Eye & Colourful World", done: false, xp: 0 },
  { id: 8, name: "Electricity", done: false, xp: 0 },
  { id: 9, name: "Magnetic Effects of Current", done: false, xp: 0 },
];

const PROJECTILE_QUIZ = { q: "At what angle is projectile range maximum?", opts: ["30\u00b0", "45\u00b0", "60\u00b0", "90\u00b0"], ans: 1 };
const OPTICS_QUIZ = { q: "When light goes from denser to rarer medium, it bends:", opts: ["Towards normal", "Away from normal", "No bending", "Reflects back"], ans: 1 };

function ProjectileSim({ velocity, angle }: { velocity: number; angle: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const draw = useCallback(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0f172a"; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.strokeStyle = "#22d3ee"; ctx.lineWidth = 2.5; ctx.beginPath();
    const g = 9.8, rad = (angle * Math.PI) / 180;
    const vx = velocity * Math.cos(rad), vy = velocity * Math.sin(rad);
    const T = (2 * vy) / g;
    const R = (velocity * velocity * Math.sin(2 * rad)) / g;
    const scale = Math.min((W - 60) / Math.max(R, 1), 12);
    let first = true;
    for (let t = 0; t <= T; t += T / 200) {
      const x = 30 + vx * t * scale;
      const y = H - 30 - (vy * t - 0.5 * g * t * t) * scale;
      if (first) { ctx.moveTo(x, y); first = false; } else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = "#f97316"; ctx.beginPath(); ctx.arc(30, H - 30, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#22d3ee"; ctx.beginPath(); ctx.arc(30 + R * scale, H - 30, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#94a3b8"; ctx.font = "11px monospace";
    ctx.fillText(`\u03b8 = ${angle}\u00b0`, 10, 20);
    ctx.fillText(`v\u2080 = ${velocity} m/s`, 10, 34);
    ctx.fillText(`R = ${R.toFixed(1)} m`, 10, 48);
    ctx.fillText(`T = ${T.toFixed(2)} s`, 10, 62);
  }, [velocity, angle]);
  useEffect(() => { draw(); }, [draw]);
  return <canvas ref={ref} width={560} height={300} className="w-full h-full rounded-xl" />;
}

function OpticsScene() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const w = c.clientWidth || 500, h = c.clientHeight || 280;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch { return; }
    renderer.setSize(w, h); c.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.set(0, 2, 8);
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    scene.add(new THREE.DirectionalLight(0x8b5cf6, 2));
    const prismGeo = new THREE.CylinderGeometry(0, 1.5, 2.5, 3);
    const prismMat = new THREE.MeshStandardMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.5, wireframe: false });
    const prism = new THREE.Mesh(prismGeo, prismMat);
    prism.rotation.y = Math.PI / 6; scene.add(prism);
    const rayColors = [0xff0000, 0xff7700, 0xffff00, 0x00ff00, 0x0000ff, 0x8b00ff];
    rayColors.forEach((col, i) => {
      const points = [new THREE.Vector3(-4, 0, 0), new THREE.Vector3(0, 0, 0), new THREE.Vector3(3.5, -0.3 * (i - 2.5), 0)];
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({ color: col, linewidth: 2 });
      scene.add(new THREE.Line(geo, mat));
    });
    let id: number;
    const animate = () => { id = requestAnimationFrame(animate); prism.rotation.y += 0.005; renderer.render(scene, camera); }; animate();
    return () => { cancelAnimationFrame(id); renderer.dispose(); if (c.contains(renderer.domElement)) c.removeChild(renderer.domElement); };
  }, []);
  return <div ref={ref} className="w-full h-full" />;
}

function GravityScene() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const w = c.clientWidth || 500, h = c.clientHeight || 280;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch { return; }
    renderer.setSize(w, h); c.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.set(0, 5, 12);
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const sunLight = new THREE.PointLight(0xfbbf24, 6, 30); sunLight.position.set(0, 0, 0); scene.add(sunLight);
    const sun = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 1 })); scene.add(sun);
    const planets = [
      { r: 0.3, orbitR: 3, speed: 0.02, color: 0x06b6d4 },
      { r: 0.5, orbitR: 5, speed: 0.012, color: 0x10b981 },
      { r: 0.2, orbitR: 7, speed: 0.007, color: 0xef4444 },
    ];
    const planetMeshes = planets.map(p => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(p.r, 16, 16), new THREE.MeshStandardMaterial({ color: p.color }));
      scene.add(m);
      const ring = new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 65 }, (_, i) => new THREE.Vector3(Math.cos(i / 64 * Math.PI * 2) * p.orbitR, 0, Math.sin(i / 64 * Math.PI * 2) * p.orbitR))), new THREE.LineBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.5 }));
      scene.add(ring);
      return { mesh: m, ...p, angle: Math.random() * Math.PI * 2 };
    });
    let id: number; const clock = new THREE.Clock();
    const animate = () => {
      id = requestAnimationFrame(animate); const dt = clock.getDelta();
      planetMeshes.forEach(p => { p.angle += p.speed; p.mesh.position.set(Math.cos(p.angle) * p.orbitR, 0, Math.sin(p.angle) * p.orbitR); });
      renderer.render(scene, camera);
    }; animate();
    return () => { cancelAnimationFrame(id); renderer.dispose(); if (c.contains(renderer.domElement)) c.removeChild(renderer.domElement); };
  }, []);
  return <div ref={ref} className="w-full h-full" />;
}

export default function PhysicsLabPage() {
  const [tab, setTab] = useState<"simulate" | "syllabus">("simulate");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [velocity, setVelocity] = useState(25);
  const [angle, setAngle] = useState(45);
  const [xp, setXp] = useState(0);
  const [done, setDone] = useState<string[]>([]);
  const [quiz, setQuiz] = useState<"idle" | "q" | "right" | "wrong">("idle");
  const [aiText, setAiText] = useState(""); const [aiLoading, setAiLoading] = useState(false);

  const q = topic.id === "projectile" ? PROJECTILE_QUIZ : topic.id === "optics" ? OPTICS_QUIZ : null;

  const markStudied = () => { if (!done.includes(topic.id)) { setDone(p => [...p, topic.id]); setXp(p => p + 50); if (q) setQuiz("q"); } };
  const answer = (i: number) => { if (!q) return; if (i === q.ans) { setXp(p => p + 20); setQuiz("right"); } else setQuiz("wrong"); };
  const askAI = async () => {
    setAiLoading(true); setAiText("");
    try {
      const r = await fetch("/api/tutor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: `Explain ${topic.name} (formula: ${topic.formula}) for Class 10/12 board exam in under 80 words.`, context: "physics" }) });
      const d = await r.json(); setAiText(d.response || d.message || "See description below.");
    } catch { setAiText(topic.desc); }
    finally { setAiLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#060914] flex flex-col">
      <Navbar />
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-950/80 via-slate-900 to-[#060914] border-b border-violet-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 mb-4 text-xs">
            <Link href="/worlds" className="text-slate-400 hover:text-white flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Worlds</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-violet-400 font-semibold">Physics Simulation Lab</span>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-violet-400 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">Physics Simulation Lab</h1>
                <p className="text-xs text-violet-300 font-semibold">Class 10 & 12 \u2022 CBSE/ICSE Board Aligned</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500/10 border border-violet-500/30">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-white font-bold text-lg">{1220 + xp} XP</span>
              <span className="text-[10px] text-slate-400">+{xp} this session</span>
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            {(["simulate", "syllabus"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all ${tab === t ? "bg-violet-500/20 text-violet-300 border-b-2 border-violet-400" : "text-slate-400 hover:text-white"}`}>
                {t === "simulate" ? "\ud83d\udd2d Simulations" : "\ud83d\udcda Syllabus"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {tab === "simulate" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Select Simulation</h3>
              {TOPICS.map(t => (
                <button key={t.id} onClick={() => { setTopic(t); setQuiz("idle"); setAiText(""); }} className={`w-full text-left p-3 rounded-xl border transition-all ${topic.id === t.id ? "bg-violet-950/50 border-violet-400 shadow-lg shadow-violet-500/10" : "bg-slate-900/60 border-white/10 hover:border-white/25"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{t.icon}</span>
                      <div><div className="text-xs font-bold text-white">{t.name}</div><div className="font-mono text-[10px] text-violet-400">{t.formula}</div></div>
                    </div>
                    {done.includes(t.id) && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </div>
                </button>
              ))}
            </div>
            <div className="lg:col-span-9 space-y-5">
              <div className="h-72 rounded-2xl bg-slate-900/80 border border-violet-500/20 overflow-hidden relative">
                {topic.id === "projectile" && <ProjectileSim velocity={velocity} angle={angle} />}
                {topic.id === "optics" && <OpticsScene />}
                {topic.id === "gravity" && <GravityScene />}
                {topic.id === "waves" && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="text-4xl">\ud83c\udfb5</div>
                      <div className="font-mono text-violet-400 text-sm">v = f \u00d7 \u03bb</div>
                      <div className="text-xs text-slate-400">Speed = Frequency \u00d7 Wavelength</div>
                      <div className="text-[10px] text-slate-500">Speed of sound in air \u2248 343 m/s at 20\u00b0C</div>
                    </div>
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2 py-1 rounded-lg bg-black/60 text-violet-300 text-[10px] font-mono font-bold">{topic.name}</span>
                </div>
                <div className="absolute bottom-3 right-3 text-[10px] font-mono text-violet-400 bg-black/60 px-2 py-1 rounded">{topic.formula}</div>
              </div>

              {topic.id === "projectile" && (
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
                  <div className="flex items-center gap-2 mb-4"><Sliders className="w-4 h-4 text-violet-400" /><span className="text-xs font-bold text-white">Adjust Parameters</span></div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[11px] text-slate-400 font-semibold block mb-2">Launch Angle: <span className="text-violet-300">{angle}\u00b0</span></label>
                      <input type="range" min={5} max={85} value={angle} onChange={e => setAngle(Number(e.target.value))} className="w-full accent-violet-500" />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 font-semibold block mb-2">Initial Velocity: <span className="text-violet-300">{velocity} m/s</span></label>
                      <input type="range" min={5} max={50} value={velocity} onChange={e => setVelocity(Number(e.target.value))} className="w-full accent-violet-500" />
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {[["Range", `${((velocity * velocity * Math.sin(2 * angle * Math.PI / 180)) / 9.8).toFixed(1)} m`], ["Max Height", `${((velocity * Math.sin(angle * Math.PI / 180)) ** 2 / (2 * 9.8)).toFixed(1)} m`], ["Time", `${(2 * velocity * Math.sin(angle * Math.PI / 180) / 9.8).toFixed(2)} s`]].map(([l, v]) => (
                      <div key={l} className="p-3 rounded-xl bg-slate-800/60 border border-white/10 text-center"><div className="text-[10px] text-slate-400 mb-1">{l}</div><div className="text-sm font-bold text-violet-300 font-mono">{v}</div></div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
                <div className="flex items-center gap-2 mb-2"><Info className="w-3.5 h-3.5 text-violet-400" /><span className="text-xs font-bold text-white">Concept</span></div>
                <p className="text-sm text-slate-300 leading-relaxed">{topic.desc}</p>
              </div>

              <div className="flex gap-3">
                <button onClick={markStudied} disabled={done.includes(topic.id)} className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${done.includes(topic.id) ? "bg-emerald-900/40 text-emerald-400 border border-emerald-500/30 cursor-default" : "bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white shadow-lg shadow-violet-500/20"}`}>
                  {done.includes(topic.id) ? <><CheckCircle2 className="w-3.5 h-3.5" /> Studied! +50 XP</> : <><BookOpen className="w-3.5 h-3.5" /> Mark Studied +50 XP</>}
                </button>
                <button onClick={askAI} disabled={aiLoading} className="flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 bg-blue-900/40 hover:bg-blue-900/60 text-blue-300 border border-blue-500/30">
                  <Bot className="w-3.5 h-3.5" />{aiLoading ? "AI thinking..." : "Ask AI Tutor"}
                </button>
              </div>

              {aiText && <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30"><div className="flex items-center gap-2 mb-2"><Bot className="w-4 h-4 text-blue-400" /><span className="text-xs font-bold text-blue-300">AI Tutor</span></div><p className="text-sm text-slate-300 leading-relaxed">{aiText}</p></div>}

              {quiz === "q" && q && (
                <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/30">
                  <div className="flex items-center gap-2 mb-3"><Sparkles className="w-4 h-4 text-amber-400" /><span className="text-xs font-bold text-amber-300">Quick Quiz \u2014 Earn +20 XP</span></div>
                  <p className="text-sm text-white font-semibold mb-3">{q.q}</p>
                  <div className="grid grid-cols-2 gap-2">{q.opts.map((o, i) => <button key={i} onClick={() => answer(i)} className="py-2 px-3 rounded-xl text-xs font-semibold text-white bg-slate-800/80 hover:bg-amber-900/50 border border-white/15 hover:border-amber-400/50 transition-all">{o}</button>)}</div>
                </div>
              )}
              {quiz === "right" && <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400" /><div><p className="text-sm font-bold text-emerald-300">Correct! +20 XP</p></div></div>}
              {quiz === "wrong" && <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center justify-between"><div><p className="text-sm font-bold text-red-300">Not quite!</p><p className="text-xs text-slate-400">Answer: {q?.opts[q.ans]}</p></div><button onClick={() => setQuiz("q")} className="px-3 py-1.5 rounded-lg bg-red-900/50 text-red-300 text-xs font-bold flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Retry</button></div>}
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
                    <Link href={`/tutor?prompt=${encodeURIComponent("Teach me " + ch.name + " for Class 10/12 Physics board exam")}`} className="flex-1 text-center py-1.5 rounded-lg bg-violet-900/30 hover:bg-violet-900/50 text-violet-300 text-[11px] font-bold border border-violet-500/20 transition-all">Study with AI</Link>
                    <Link href="/exams" className="flex-1 text-center py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 text-[11px] font-bold border border-white/10 transition-all">Test</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
