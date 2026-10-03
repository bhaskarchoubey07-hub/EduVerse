"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  BookOpen,
  FileText,
  Bot,
  Layers,
  GraduationCap,
  BarChart3,
  ShieldAlert,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Clock,
  Compass,
  Calendar,
  Award,
  Settings,
  Flame,
} from "lucide-react";
import { useAuth } from "@/lib/store/auth-context";
import { useDataStore } from "@/lib/store/data-store";
import { getDaysUntil } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout, switchRole } = useAuth();
  const { gamificationState } = useDataStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const daysLeft = user?.targetExamDate ? getDaysUntil(user.targetExamDate) : 130;

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: GraduationCap },
    { name: "3D Worlds", href: "/worlds", icon: Compass, is3D: true },
    { name: "AI Planner", href: "/planner", icon: Calendar },
    { name: "10-Yr Papers", href: "/papers", icon: FileText },
    { name: "AI Companion", href: "/tutor", icon: Bot, isHighlight: true },
    { name: "Mock Exams", href: "/exams", icon: Clock },
    { name: "Trophies & XP", href: "/trophies", icon: Award },
    { name: "Performance", href: "/performance", icon: BarChart3 },
  ];

  if (user?.role === "admin") {
    navLinks.push({ name: "Admin Portal", href: "/admin", icon: ShieldAlert });
  }

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#080c18] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-white font-sans">
                  EduVerse <span className="text-gradient-primary">AI</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                  3D v2.0
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block -mt-1 hidden sm:block">
                Learning Universe • Classes 10–12
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-violet-600/25 text-violet-300 border border-violet-500/40 shadow-sm shadow-violet-500/10"
                      : link.isHighlight
                      ? "text-cyan-300 hover:bg-cyan-500/10 hover:text-cyan-200 border border-cyan-500/20"
                      : link.is3D
                      ? "text-amber-300 hover:bg-amber-500/10 hover:text-amber-200"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${link.isHighlight ? "text-cyan-400" : link.is3D ? "text-amber-400" : ""}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Center */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Gamification Level Chip */}
            {user && (
              <Link
                href="/trophies"
                className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-violet-950 to-indigo-950 border border-violet-500/30 hover:border-violet-500 text-xs font-mono text-violet-300 transition-colors"
                title={`Level ${gamificationState.currentLevel}: ${gamificationState.levelTitle}`}
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold text-white">Lvl {gamificationState.currentLevel}</span>
                <span className="text-[10px] text-cyan-300">({gamificationState.currentXp} XP)</span>
              </Link>
            )}

            {/* Exam Countdown */}
            {user && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-xs text-slate-300 font-mono">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  <strong className="text-amber-300">{daysLeft}d</strong> to Exams
                </span>
              </div>
            )}

            {user ? (
              /* User Dropdown */
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-[10px]">
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="hidden sm:inline-block max-w-[100px] truncate text-slate-200 font-medium">
                    {user.fullName}
                  </span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-800">
                    {user.role}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-60 rounded-xl glass-panel-glow py-2 z-50 shadow-2xl animate-in fade-in slide-in-from-top-2"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-xs font-semibold text-white">{user.fullName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <p className="text-[10px] text-cyan-400 mt-1 font-mono">
                        Class {user.classLevel} • {user.boardId.toUpperCase()} • Level {gamificationState.currentLevel}
                      </p>
                    </div>

                    <Link
                      href="/planner"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white"
                    >
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      Adaptive AI Study Plan
                    </Link>

                    <Link
                      href="/trophies"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      3D Trophy Showcase &amp; XP
                    </Link>

                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white"
                    >
                      <Settings className="w-3.5 h-3.5 text-violet-400" />
                      3D Graphics &amp; Preferences
                    </Link>

                    {/* Role Switcher */}
                    <div className="px-4 py-1.5 border-t border-white/5">
                      <p className="text-[10px] uppercase text-slate-500 font-semibold mb-1">
                        Test Role Switcher
                      </p>
                      <div className="flex gap-1">
                        <button
                          onClick={() => switchRole("student")}
                          className={`flex-1 text-[11px] py-1 rounded ${
                            user.role === "student"
                              ? "bg-violet-600 text-white font-semibold"
                              : "bg-white/5 text-slate-400 hover:bg-white/10"
                          }`}
                        >
                          Student
                        </button>
                        <button
                          onClick={() => switchRole("admin")}
                          className={`flex-1 text-[11px] py-1 rounded ${
                            user.role === "admin"
                              ? "bg-cyan-600 text-white font-semibold"
                              : "bg-white/5 text-slate-400 hover:bg-white/10"
                          }`}
                        >
                          Admin
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-white/10 mt-2 pt-1">
                      <button
                        onClick={logout}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="text-xs text-slate-300 hover:text-white px-3 py-2 rounded-lg font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/onboarding"
                  className="text-xs font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white shadow-lg shadow-violet-500/25 transition-all"
                >
                  Get Started Free
                </Link>
              </div>
            )}

            {/* Mobile Drawer Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden glass-panel border-b border-white/10 px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5 text-violet-400" />
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
