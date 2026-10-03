"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Bot,
  Send,
  Sparkles,
  Copy,
  Check,
  Lightbulb,
  Plus,
  Bookmark,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useAuth } from "@/lib/store/auth-context";
import { useDataStore } from "@/lib/store/data-store";
import { AICompanionAvatar3D } from "@/components/3d/AICompanionAvatar3D";
import { AITutorMessage } from "@/types";

type TutorMode = "explain" | "step_by_step" | "hint_first" | "quiz" | "homework_helper";

function TutorChatContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { saveNote, userSettings } = useDataStore();

  const initialPrompt = searchParams.get("prompt") || "";
  const initialChapter = searchParams.get("chapter") || "General";
  const initialSubject = searchParams.get("subject") || "Science";

  const [mode, setMode] = useState<TutorMode>("explain");
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);
  const [selectedChapter, setSelectedChapter] = useState(initialChapter);
  const [language, setLanguage] = useState(user?.preferredLanguage || "hinglish");
  const [inputMessage, setInputMessage] = useState(initialPrompt);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [companionMood, setCompanionMood] = useState<"idle" | "thinking" | "explaining" | "celebrating">("idle");

  const [messages, setMessages] = useState<AITutorMessage[]>([
    {
      id: "msg-welcome",
      role: "assistant",
      content: `Hello **${user?.fullName || "Student"}**! 👋 I am your **3D AI Personal Companion**, grounded in the **${
        user?.boardId?.toUpperCase() || "CBSE"
      } Class ${user?.classLevel || 10}** curriculum.

How can I help you today?
* 🔍 **Step-by-step problem solver** (Derivations, formulas, numericals)
* 💡 **Hint-first mode** (Gives clues without spoiling full solutions)
* 📝 **1-Page revision notes & mnemonics**
* 🧪 **Previous-year question predictions & scoring keys**`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestedFollowUps: [
        "Explain Ohm's Law and its V-I graph with a 3-mark board example",
        "How do I determine if a chemical reaction is Redox? Give a trick",
        "Explain sign conventions for concave and convex mirrors in numericals",
        "What are the top 3 high-weightage chapters in Class 10 Science?",
      ],
    },
  ]);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isLoading) return;

    const userMsg: AITutorMessage = {
      id: `msg-user-${Date.now()}`,
      role: "user",
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);
    setCompanionMood("thinking");

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          mode,
          board: user?.boardId || "cbse",
          classLevel: user?.classLevel || 10,
          subject: selectedSubject,
          chapter: selectedChapter,
          language,
        }),
      });

      if (!res.ok) throw new Error("Failed to get response");
      const data = await res.json();

      const aiMsg: AITutorMessage = {
        id: `msg-ai-${Date.now()}`,
        role: "assistant",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedFollowUps: data.suggestedFollowUps || [],
      };

      setMessages((prev) => [...prev, aiMsg]);
      setCompanionMood("explaining");
      setTimeout(() => setCompanionMood("idle"), 5000);
    } catch (err) {
      const errorMsg: AITutorMessage = {
        id: `msg-err-${Date.now()}`,
        role: "assistant",
        content: "⚠️ I encountered a temporary connection issue. Please verify your connection or try again in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
      setCompanionMood("idle");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveToNotes = (msg: AITutorMessage) => {
    saveNote({
      studentId: user?.id || "demo-student-001",
      title: `${selectedSubject}: AI Tutor Note (${new Date().toLocaleDateString()})`,
      subjectId: "cbse-10-sci",
      chapterId: "ch-sci10-01",
      content: msg.content,
      noteType: "ai_generated",
    });
    setSavedId(msg.id);
    setCompanionMood("celebrating");
    setTimeout(() => {
      setSavedId(null);
      setCompanionMood("idle");
    }, 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: "msg-welcome-new",
        role: "assistant",
        content: `New study session started! What topic or problem would you like to explore in **${selectedSubject}**?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedFollowUps: [
          "Give me a 3-minute quiz on this chapter",
          "What are the most common mistakes in board numericals here?",
        ],
      },
    ]);
  };

  const lastAssistantMessage = messages.filter((m) => m.role === "assistant").slice(-1)[0]?.content;

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
      {/* LEFT CONTROL SIDEBAR & 3D COMPANION AVATAR */}
      <aside className="w-full lg:w-80 shrink-0 space-y-4">
        {/* 3D Companion Avatar Widget */}
        <div className="glass-panel-glow rounded-3xl p-5 border border-white/10 flex flex-col items-center justify-center space-y-2 shadow-xl">
          <AICompanionAvatar3D
            mood={companionMood}
            avatarType={userSettings.companionAvatar}
            lastMessageText={lastAssistantMessage}
          />
          <div className="text-center">
            <h3 className="font-bold text-xs text-white">EduVerse AI Companion</h3>
            <span className="text-[10px] text-cyan-300 font-mono">
              Status: {companionMood === "thinking" ? "Thinking..." : companionMood === "explaining" ? "Explaining" : "Active & Listening"}
            </span>
          </div>
        </div>

        {/* Controls Card */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-400" />
              <h2 className="font-bold text-xs text-white">Instruction Mode</h2>
            </div>
            <button
              onClick={clearChat}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 text-xs flex items-center gap-1"
              title="Start new conversation"
            >
              <Plus className="w-3.5 h-3.5" /> New Chat
            </button>
          </div>

          {/* Mode Selector */}
          <div className="space-y-1.5">
            {[
              { id: "explain", label: "Concept Explanation", desc: "Clear & simple language" },
              { id: "step_by_step", label: "Step-by-Step Solver", desc: "Derivations & numericals" },
              { id: "hint_first", label: "Hint-First Clues", desc: "Clues without spoilers" },
              { id: "quiz", label: "Quiz Me On Topic", desc: "Interactive diagnostic" },
              { id: "homework_helper", label: "Homework Helper", desc: "Guided assistance" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id as TutorMode)}
                className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  mode === m.id
                    ? "bg-violet-600/30 border-violet-500 text-white font-semibold shadow-sm"
                    : "bg-slate-900/40 border-white/5 text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <div className="font-bold text-white text-xs">{m.label}</div>
                <div className="text-[10px] text-slate-400">{m.desc}</div>
              </button>
            ))}
          </div>

          {/* Subject Grounding */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-cyan-400">
              Subject Grounding
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Science">Science (Physics, Chem, Bio)</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Social Science">Social Science</option>
              <option value="Physics">Physics (Class 12)</option>
              <option value="Chemistry">Chemistry (Class 12)</option>
              <option value="Accountancy">Accountancy</option>
            </select>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="hinglish">Hinglish (Conversational)</option>
              <option value="english">English (Standard)</option>
              <option value="hindi">Hindi (हिंदी)</option>
              <option value="punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
            </select>
          </div>
        </div>
      </aside>

      {/* RIGHT CHAT WORKSPACE */}
      <section className="flex-1 flex flex-col glass-panel rounded-2xl border border-white/10 overflow-hidden h-[80vh]">
        <div className="p-4 border-b border-white/10 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 p-[1px]">
              <div className="w-full h-full bg-[#080c18] rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-white">EduVerse AI Companion</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono text-emerald-400">Online</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                Mode: <span className="text-cyan-300 font-semibold">{mode}</span> • {selectedSubject}
              </p>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 hidden sm:block font-mono">
            Class {user?.classLevel || 10} • {user?.boardId?.toUpperCase() || "CBSE"}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${
                msg.role === "user" ? "ml-auto justify-end" : "mr-auto justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-lg bg-violet-600/30 text-violet-300 flex items-center justify-center shrink-0 mt-1 border border-violet-500/30">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`rounded-2xl p-4 sm:p-5 space-y-3 ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-none shadow-lg shadow-violet-600/20"
                    : "bg-[#0c1228] border border-white/10 text-slate-200 rounded-tl-none shadow-xl"
                }`}
              >
                <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {msg.content}
                </div>

                {msg.role === "assistant" && (
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="text-[10px] font-mono">{msg.timestamp}</span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
                        title="Copy Answer"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleSaveToNotes(msg)}
                        className="px-2 py-1 rounded bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 hover:text-white flex items-center gap-1 transition-colors"
                        title="Save to My Revision Notes"
                      >
                        {savedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" /> Saved!
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-3 h-3" /> Save Note
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="pt-3 border-t border-white/5 space-y-1.5">
                    <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" /> Suggested Follow-up Questions:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedFollowUps.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(prompt)}
                          className="text-left text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-violet-950 text-slate-300 hover:text-cyan-300 border border-white/5 hover:border-cyan-500/40 transition-all cursor-pointer"
                        >
                          {prompt} →
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 max-w-md mr-auto">
              <div className="w-8 h-8 rounded-lg bg-violet-600/30 text-violet-300 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="rounded-2xl p-4 bg-[#0c1228] border border-white/10 text-slate-300 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>AI Companion is formulating syllabus explanation...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-white/10 bg-slate-900/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask any question in ${selectedSubject} (e.g. "Derive lens formula", "Explain Rusting", "3-mark numerical")...`}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />

            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-violet-600/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default function AITutorPage() {
  return (
    <div className="min-h-screen bg-[#070a14] bg-grid-pattern flex flex-col">
      <Navbar />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center p-12 text-slate-400 text-xs">
            <Bot className="w-6 h-6 animate-pulse text-cyan-400 mr-2" />
            Loading EduVerse AI Companion session...
          </div>
        }
      >
        <TutorChatContent />
      </Suspense>
      <Footer />
    </div>
  );
}
