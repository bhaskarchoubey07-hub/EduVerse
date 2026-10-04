"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hourglass, ArrowLeft, ChevronRight, Bot, BookOpen, CheckCircle2, Star, Info, Sparkles, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";

const TIMELINE_EVENTS = [
  {
    year: "2300 BCE", era: "Ancient", name: "Indus Valley Civilisation",
    desc: "One of the world\u2019s earliest urban civilisations in the Indian subcontinent. Key cities: Mohenjo-daro, Harappa. Known for town planning, drainage systems, standardised weights.",
    keyFacts: ["Grid city layout with brick houses", "Advanced drainage & sanitation", "Script undeciphered to date", "Trade with Mesopotamia"],
    color: "#f59e0b",
    quiz: { q: "Which Indus Valley city had the largest known granary?", opts: ["Harappa", "Mohenjo-daro", "Dholavira", "Lothal"], ans: 0 },
    xpReward: 40,
  },
  {
    year: "322 BCE", era: "Ancient", name: "Maurya Empire",
    desc: "Founded by Chandragupta Maurya, the Maurya Empire became the largest empire in Indian history under Ashoka. Ashoka promoted Buddhism after the Kalinga War.",
    keyFacts: ["Chandragupta founded with Chanakya\u2019s guidance", "Ashoka\u2019s edicts on pillars", "Kalinga War shocked Ashoka to adopt Buddhism", "Arthashastra \u2014 treatise on statecraft"],
    color: "#8b5cf6",
    quiz: { q: "After which battle did Ashoka convert to Buddhism?", opts: ["Battle of Buxar", "Kalinga War", "Battle of Plassey", "Battle of Panipat"], ans: 1 },
    xpReward: 45,
  },
  {
    year: "1206 CE", era: "Medieval", name: "Delhi Sultanate",
    desc: "A series of five dynasties (Slave, Khalji, Tughlaq, Sayyid, Lodi) ruling from Delhi. Lasted 1206\u20131526 CE. Introduced Persian-Islamic culture, architecture, and administrative systems.",
    keyFacts: ["Qutub Minar built by Qutb ud-Din Aibak", "Alauddin Khalji repelled Mongols", "Ibn Battuta visited during Muhammad bin Tughluq\u2019s reign", "Ibrahim Lodi defeated at 1st Battle of Panipat (1526)"],
    color: "#ef4444",
    quiz: { q: "Who defeated Ibrahim Lodi to end the Delhi Sultanate?", opts: ["Akbar", "Babur", "Humayun", "Sher Shah Suri"], ans: 1 },
    xpReward: 45,
  },
  {
    year: "1526 CE", era: "Medieval", name: "Mughal Empire",
    desc: "Founded by Babur after the First Battle of Panipat. Reached peak under Akbar (policy of Sulh-i-kul). Aurangzeb\u2019s religious policies led to decline. Taj Mahal built by Shah Jahan.",
    keyFacts: ["Akbar\u2019s Din-i-Ilahi \u2014 religious tolerance", "Taj Mahal built 1631\u20131653", "Mansabdari system for administration", "Aurangzeb \u2014 largest but unstable empire"],
    color: "#10b981",
    quiz: { q: "Who built the Taj Mahal?", opts: ["Akbar", "Humayun", "Shah Jahan", "Aurangzeb"], ans: 2 },
    xpReward: 40,
  },
  {
    year: "1757 CE", era: "Modern", name: "British Colonial Era",
    desc: "Battle of Plassey (1757) gave British East India Company control over Bengal. 1857 uprising led to Crown rule. Indian independence achieved on 15 August 1947 under Mahatma Gandhi\u2019s leadership.",
    keyFacts: ["1757: Battle of Plassey \u2014 British defeat Siraj ud-Daula", "1857: First War of Independence (Sepoy Mutiny)", "1885: Indian National Congress founded", "1947: Indian Independence & Partition"],
    color: "#06b6d4",
    quiz: { q: "In which year did India gain independence?", opts: ["1945", "1947", "1950", "1946"], ans: 1 },
    xpReward: 40,
  },
  {
    year: "1947 CE", era: "Modern", name: "Republic of India",
    desc: "India became a sovereign republic on 26 January 1950 with adoption of the Constitution. Dr B.R. Ambedkar chaired the drafting committee. India became the world\u2019s largest democracy.",
    keyFacts: ["26 Jan 1950: Indian Constitution adopted", "Dr Rajendra Prasad: First President", "Jawaharlal Nehru: First Prime Minister", "Fundamental Rights & DPSP enshrined"],
    color: "#f97316",
    quiz: { q: "Who was the chairman of the Constitution Drafting Committee?", opts: ["Nehru", "Gandhi", "Ambedkar", "Patel"], ans: 2 },
    xpReward: 50,
  },
];

const CHAPTERS = [
  { id: 1, name: "The Rise of Nationalism in Europe", done: true, xp: 80 },
  { id: 2, name: "Nationalism in India", done: true, xp: 85 },
  { id: 3, name: "The Making of a Global World", done: false, xp: 0 },
  { id: 4, name: "The Age of Industrialisation", done: false, xp: 0 },
  { id: 5, name: "Print Culture and the Modern World", done: false, xp: 0 },
];

const ERA_COLORS: Record<string, string> = { Ancient: "text-amber-400", Medieval: "text-violet-400", Modern: "text-cyan-400" };

export default function HistoryLabPage() {
  const [tab, setTab] = useState<"timeline" | "syllabus">("timeline");
  const [event, setEvent] = useState(TIMELINE_EVENTS[0]);
  const [expanded, setExpanded] = useState<string | null>(TIMELINE_EVENTS[0].year);
  const [xp, setXp] = useState(0);
  const [done, setDone] = useState<string[]>([]);
  const [quiz, setQuiz] = useState<"idle" | "q" | "right" | "wrong">("idle");
  const [aiText, setAiText] = useState(""); const [aiLoading, setAiLoading] = useState(false);

  const selectEvent = (e: typeof TIMELINE_EVENTS[0]) => { setEvent(e); setExpanded(e.year); setQuiz("idle"); setAiText(""); };
  const markStudied = () => { if (!done.includes(event.year)) { setDone(p => [...p, event.year]); setXp(p => p + event.xpReward); setQuiz("q"); } };
  const answer = (i: number) => { if (i === event.quiz.ans) { setXp(p => p + 20); setQuiz("right"); } else setQuiz("wrong"); };
  const askAI = async () => {
    setAiLoading(true); setAiText("");
    try {
      const r = await fetch("/api/tutor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: `Explain ${event.name} (${event.year}) for Class 10 History/Social Science board exam in under 80 words.`, context: "history" }) });
      const d = await r.json(); setAiText(d.response || d.message || event.desc);
    } catch { setAiText(event.desc); }
    finally { setAiLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#060914] flex flex-col">
      <Navbar />
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-950/80 via-slate-900 to-[#060914] border-b border-orange-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 mb-4 text-xs">
            <Link href="/worlds" className="text-slate-400 hover:text-white flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Worlds</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-orange-400 font-semibold">History Timeline</span>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-600 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Hourglass className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">History Interactive Timeline</h1>
                <p className="text-xs text-orange-300 font-semibold">Class 10 Social Science \u2022 CBSE/ICSE Board Aligned</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/30">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-white font-bold text-lg">{520 + xp} XP</span>
              <span className="text-[10px] text-slate-400">+{xp} this session</span>
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            {(["timeline", "syllabus"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all ${tab === t ? "bg-orange-500/20 text-orange-300 border-b-2 border-orange-400" : "text-slate-400 hover:text-white"}`}>
                {t === "timeline" ? "\ud83d\udcdc Interactive Timeline" : "\ud83d\udcda Syllabus"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {tab === "timeline" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Timeline Column */}
            <div className="lg:col-span-5 space-y-0">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Indian History Timeline</h3>
              <div className="relative">
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 via-violet-500 to-cyan-500 opacity-40" />
                <div className="space-y-2">
                  {TIMELINE_EVENTS.map((e) => (
                    <div key={e.year} className="relative pl-12">
                      <div className="absolute left-3.5 top-4 w-3 h-3 rounded-full border-2 border-current" style={{ color: e.color, borderColor: e.color, backgroundColor: expanded === e.year ? e.color : "transparent" }} />
                      <button onClick={() => { selectEvent(e); setExpanded(expanded === e.year ? null : e.year); }} className={`w-full text-left p-3 rounded-xl border transition-all ${event.year === e.year ? "bg-slate-800/80 border-white/25 shadow-lg" : "bg-slate-900/60 border-white/10 hover:border-white/20"}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className={`text-[10px] font-mono font-bold ${ERA_COLORS[e.era] || "text-slate-400"}`}>{e.era} \u2022 {e.year}</span>
                            <div className="text-xs font-bold text-white mt-0.5">{e.name}</div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {done.includes(e.year) && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                            {expanded === e.year ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                          </div>
                        </div>
                        {expanded === e.year && (
                          <div className="mt-2 space-y-1 border-t border-white/10 pt-2">
                            {e.keyFacts.map((f, i) => <div key={i} className="flex items-start gap-1.5"><span className="text-orange-400 shrink-0 text-[10px] mt-0.5">\u2023</span><span className="text-[11px] text-slate-300">{f}</span></div>)}
                          </div>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detail Panel */}
            <div className="lg:col-span-7 space-y-5">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4">
                <div>
                  <span className={`text-[10px] font-mono font-bold ${ERA_COLORS[event.era] || "text-slate-400"}`}>{event.era} Era \u2022 {event.year}</span>
                  <h2 className="text-xl font-black text-white mt-1">{event.name}</h2>
                </div>

                {/* Period Visual */}
                <div className="h-24 rounded-xl flex items-center justify-center text-6xl" style={{ background: `linear-gradient(135deg, ${event.color}20, ${event.color}08)`, border: `1px solid ${event.color}30` }}>
                  <span className="text-5xl">\ud83d\udcdc</span>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">{event.desc}</p>

                <div className="grid grid-cols-2 gap-3">
                  {event.keyFacts.map((f, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-800/60 border border-white/10 flex items-start gap-2">
                      <span className="text-orange-400 shrink-0 mt-0.5">\u2023</span>
                      <span className="text-[11px] text-slate-300 leading-relaxed">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={markStudied} disabled={done.includes(event.year)} className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${done.includes(event.year) ? "bg-emerald-900/40 text-emerald-400 border border-emerald-500/30 cursor-default" : "bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white shadow-lg shadow-orange-500/20"}`}>
                    {done.includes(event.year) ? <><CheckCircle2 className="w-3.5 h-3.5" /> Studied! +{event.xpReward} XP</> : <><BookOpen className="w-3.5 h-3.5" /> Mark Studied +{event.xpReward} XP</>}
                  </button>
                  <button onClick={askAI} disabled={aiLoading} className="flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 bg-violet-900/40 hover:bg-violet-900/60 text-violet-300 border border-violet-500/30">
                    <Bot className="w-3.5 h-3.5" />{aiLoading ? "AI thinking..." : "Ask AI Tutor"}
                  </button>
                </div>
              </div>

              {aiText && <div className="p-4 rounded-2xl bg-violet-950/40 border border-violet-500/30"><div className="flex items-center gap-2 mb-2"><Bot className="w-4 h-4 text-violet-400" /><span className="text-xs font-bold text-violet-300">AI Tutor</span></div><p className="text-sm text-slate-300 leading-relaxed">{aiText}</p></div>}

              {quiz === "q" && (
                <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/30">
                  <div className="flex items-center gap-2 mb-3"><Sparkles className="w-4 h-4 text-amber-400" /><span className="text-xs font-bold text-amber-300">Quick Quiz \u2014 Earn +20 XP</span></div>
                  <p className="text-sm text-white font-semibold mb-3">{event.quiz.q}</p>
                  <div className="grid grid-cols-2 gap-2">{event.quiz.opts.map((o, i) => <button key={i} onClick={() => answer(i)} className="py-2 px-3 rounded-xl text-xs font-semibold text-white bg-slate-800/80 hover:bg-amber-900/50 border border-white/15 hover:border-amber-400/50 transition-all">{o}</button>)}</div>
                </div>
              )}
              {quiz === "right" && <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400" /><p className="text-sm font-bold text-emerald-300">Correct! +20 XP</p></div>}
              {quiz === "wrong" && <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center justify-between"><div><p className="text-sm font-bold text-red-300">Not quite!</p><p className="text-xs text-slate-400">Answer: {event.quiz.opts[event.quiz.ans]}</p></div><button onClick={() => setQuiz("q")} className="px-3 py-1.5 rounded-lg bg-red-900/50 text-red-300 text-xs font-bold flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Retry</button></div>}
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
                  <Link href={`/tutor?prompt=${encodeURIComponent("Teach me " + ch.name + " for Class 10 Social Science History board exam")}`} className="flex-1 text-center py-1.5 rounded-lg bg-orange-900/30 hover:bg-orange-900/50 text-orange-300 text-[11px] font-bold border border-orange-500/20 transition-all">Study with AI</Link>
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
