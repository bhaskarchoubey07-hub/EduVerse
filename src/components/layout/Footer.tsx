import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, BookOpen, Layers, Award } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#050811] border-t border-white/10 pt-12 pb-24 lg:pb-8 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-400 p-[1px]">
                <div className="w-full h-full bg-[#080c18] rounded-[7px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-bold text-lg text-white">
                EduVerse <span className="text-gradient-primary">AI</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              &quot;Learn Smarter. Prepare Better. Achieve More.&quot;
            </p>
            <p className="text-[11px] text-slate-500">
              The AI-powered board exam preparation engine for CBSE, ICSE/ISC, PSEB, and State Board students in Classes 10, 11 & 12.
            </p>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Learning Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/tutor" className="hover:text-cyan-400 transition-colors">
                  AI Personal Tutor
                </Link>
              </li>
              <li>
                <Link href="/papers" className="hover:text-cyan-400 transition-colors">
                  10-Year Verified Papers
                </Link>
              </li>
              <li>
                <Link href="/exams" className="hover:text-cyan-400 transition-colors">
                  Timed Mock Examination Engine
                </Link>
              </li>
              <li>
                <Link href="/notes" className="hover:text-cyan-400 transition-colors">
                  Chapter Summaries & Mnemonics
                </Link>
              </li>
              <li>
                <Link href="/syllabus" className="hover:text-cyan-400 transition-colors">
                  Board Syllabus Explorer
                </Link>
              </li>
            </ul>
          </div>

          {/* Supported Boards */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Supported Boards
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/syllabus?board=cbse" className="hover:text-violet-400 transition-colors">
                  CBSE (Central Board)
                </Link>
              </li>
              <li>
                <Link href="/syllabus?board=icse" className="hover:text-violet-400 transition-colors">
                  ICSE & ISC (CISCE)
                </Link>
              </li>
              <li>
                <Link href="/syllabus?board=pseb" className="hover:text-violet-400 transition-colors">
                  Punjab School Education Board (PSEB)
                </Link>
              </li>
              <li>
                <Link href="/syllabus?board=state_board" className="hover:text-violet-400 transition-colors">
                  State Secondary Boards (UP, Maharashtra, etc.)
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Transparency */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Fair Use & Policy
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Historical Papers</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Competency Aligned Marking</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>NCERT & Official Blueprints</span>
              </li>
              <li className="pt-2 text-[11px] text-slate-500">
                Privacy Policy • Terms of Service • Contact Support
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-6 border-t border-white/5 space-y-3">
          <div className="bg-slate-900/60 rounded-xl p-3 border border-white/5 text-[11px] text-slate-400 leading-relaxed">
            <span className="text-amber-400 font-semibold">Academic Disclaimer: </span>
            EduVerse AI is an independent AI learning platform. We do not claim official endorsement, certification, or commercial affiliation with the Central Board of Secondary Education (CBSE), Council for the Indian School Certificate Examinations (CISCE), Punjab School Education Board (PSEB), or any State Ministry of Education. All question papers, marks blueprints, and syllabus references are provided strictly for student practice, self-assessment, and educational guidance.
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
            <p>© {new Date().getFullYear()} EduVerse AI. All rights reserved.</p>
            <p className="mt-1 sm:mt-0">Built with Next.js, Supabase, and Modern AI.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
