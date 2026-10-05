"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  BookOpen,
  Search,
  Filter,
  ShieldCheck,
  ExternalLink,
  Layers,
  ArrowRight,
  Bookmark,
  Sparkles,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { NCERT_CLASS10_SCIENCE_BOOK, TextbookMetadata } from "@/lib/data/documents-registry";

// Additional authentic textbook definitions
const TEXTBOOKS: TextbookMetadata[] = [
  NCERT_CLASS10_SCIENCE_BOOK,
  {
    id: "ncert-class10-math",
    title: "NCERT Class 10 Mathematics (Rationalized Edition)",
    board: "cbse",
    classLevel: 10,
    subject: "cbse-10-math",
    edition: "2025-2026 Academic Session",
    academicYear: "2025-2026",
    publisher: "NCERT (Government of India)",
    totalPages: 218,
    officialUrl: "https://ncert.nic.in/textbook.php?jemh1=0-14",
    sourceDocumentId: "doc-ncert-class10-math-book",
    chapters: [
      {
        chapterNumber: 1,
        title: "Real Numbers",
        startPage: 1,
        endPage: 14,
        weightageMarks: 6,
        sections: [
          {
            sectionId: "sec-m10-1",
            sectionNumber: "1.1",
            title: "The Fundamental Theorem of Arithmetic",
            startPage: 1,
            endPage: 7,
            ncertSummary: "Every composite number can be expressed as a product of primes uniquely, apart from the order in which prime factors occur.",
            keyPoints: [
              "HCF(a, b) * LCM(a, b) = a * b for any two positive integers.",
              "Revisiting irrational numbers: Proof of √2, √3, √5 as irrational by contradiction.",
            ],
            formulas: [{ name: "Product of integers", formula: "HCF(a, b) \\times LCM(a, b) = a \\times b" }],
          },
        ],
      },
      {
        chapterNumber: 8,
        title: "Introduction to Trigonometry",
        startPage: 120,
        endPage: 138,
        weightageMarks: 8,
        sections: [
          {
            sectionId: "sec-m10-8",
            sectionNumber: "8.1",
            title: "Trigonometric Ratios and Identities",
            startPage: 120,
            endPage: 128,
            ncertSummary: "Trigonometric ratios of acute angles in a right triangle: sin θ = opp/hyp, cos θ = adj/hyp, tan θ = opp/adj.",
            keyPoints: [
              "Standard angle values for 0°, 30°, 45°, 60°, and 90°.",
              "Core Identity: sin²θ + cos²θ = 1, 1 + tan²θ = sec²θ.",
            ],
            formulas: [{ name: "Pythagorean Identity", formula: "\\sin^2\\theta + \\cos^2\\theta = 1" }],
          },
        ],
      },
    ],
  },
  {
    id: "ncert-class12-physics-1",
    title: "NCERT Class 12 Physics Part I (Rationalized Edition)",
    board: "cbse",
    classLevel: 12,
    subject: "cbse-12-phy",
    edition: "2025-2026 Academic Session",
    academicYear: "2025-2026",
    publisher: "NCERT (Government of India)",
    totalPages: 240,
    officialUrl: "https://ncert.nic.in/textbook.php?leph1=0-8",
    sourceDocumentId: "doc-ncert-class12-physics-book",
    chapters: [
      {
        chapterNumber: 1,
        title: "Electric Charges and Fields",
        startPage: 1,
        endPage: 48,
        weightageMarks: 8,
        sections: [
          {
            sectionId: "sec-p12-1",
            sectionNumber: "1.1",
            title: "Coulomb's Law and Superposition",
            startPage: 1,
            endPage: 16,
            ncertSummary: "Coulomb's Law quantifies the electrostatic force between two point charges: F = (1 / 4πε₀) * (|q₁q₂| / r²).",
            keyPoints: [
              "Electrostatic forces obey inverse-square law.",
              "Permittivity of free space ε₀ = 8.854 × 10⁻¹² C²·N⁻¹·m⁻².",
            ],
            formulas: [{ name: "Coulomb's Law", formula: "F = \\frac{1}{4\\pi\\varepsilon_0} \\frac{|q_1 q_2|}{r^2}" }],
            related3DRoute: "/worlds/physics",
          },
        ],
      },
    ],
  },
];

export default function BooksLibraryPage() {
  const [selectedBoard, setSelectedBoard] = useState<string>("all");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredBooks = useMemo(() => {
    return TEXTBOOKS.filter((b) => {
      if (selectedBoard !== "all" && b.board !== selectedBoard) return false;
      if (selectedClass !== "all" && b.classLevel.toString() !== selectedClass) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          b.title.toLowerCase().includes(q) ||
          b.publisher.toLowerCase().includes(q) ||
          b.chapters.some((c) => c.title.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [selectedBoard, selectedClass, searchQuery]);

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* HERO TITLE & ZERO-FABRICATION BANNER */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Official Government &amp; Board Approved Textbooks</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Authentic Textbook Reader &amp; Curriculum Library
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
            Read authentic textbook editions with preserved page numbers (&quot;Source: Page 42&quot;), syllabus units, and verified formulas. Zero fake text or AI hallucinated textbook pages.
          </p>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="p-4 sm:p-5 rounded-2xl glass-panel space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chapters, concepts, or textbook titles (e.g. Life Processes, Trigonometry)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedBoard}
                onChange={(e) => setSelectedBoard(e.target.value)}
                className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Boards</option>
                <option value="cbse">CBSE (NCERT)</option>
                <option value="icse">CISCE / ICSE</option>
                <option value="state_board">State Boards</option>
              </select>

              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Classes</option>
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>
            </div>
          </div>
        </div>

        {/* TEXTBOOKS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="p-6 rounded-2xl glass-panel border border-white/10 hover:border-cyan-500/50 transition-all flex flex-col justify-between group space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                    {book.board.toUpperCase()} • Class {book.classLevel}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5" /> OFFICIALLY PUBLISHED
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                  {book.title}
                </h3>

                <p className="text-xs text-slate-400">
                  Publisher: <span className="text-slate-300 font-semibold">{book.publisher}</span> • Edition:{" "}
                  <span className="text-slate-300 font-semibold">{book.edition}</span>
                </p>

                {/* Chapter Previews */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    Curriculum Units Included:
                  </span>
                  <div className="space-y-1">
                    {book.chapters.slice(0, 3).map((ch) => (
                      <div key={ch.chapterNumber} className="flex items-center justify-between text-xs text-slate-300">
                        <span className="truncate">
                          Ch {ch.chapterNumber}: {ch.title}
                        </span>
                        <span className="text-[10px] font-mono text-cyan-400 shrink-0 ml-2">
                          pp. {ch.startPage}–{ch.endPage}
                        </span>
                      </div>
                    ))}
                    {book.chapters.length > 3 && (
                      <span className="text-[11px] text-slate-500 block pt-1">
                        + {book.chapters.length - 3} more chapters in volume
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Specs & Action Buttons */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-slate-400">
                  {book.totalPages} Total Pages
                </span>

                <div className="flex items-center gap-2">
                  {book.officialUrl && (
                    <a
                      href={book.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Open Official NCERT Portal"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  <Link
                    href={`/books/${book.id}`}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-900/30"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Book</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
