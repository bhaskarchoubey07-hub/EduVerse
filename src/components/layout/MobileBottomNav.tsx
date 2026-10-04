"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  Compass,
  Bot,
  Clock,
  User,
  Sparkles,
} from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();

  // If in active fullscreen exam mode (/exams/[examId]), hide bottom nav for distraction-free test taking
  const isExamRoom = /^\/exams\/[^/]+$/.test(pathname);
  if (isExamRoom) {
    return null;
  }

  const navItems = [
    {
      name: "Home",
      href: "/dashboard",
      icon: GraduationCap,
      isActive: pathname === "/dashboard" || pathname === "/",
    },
    {
      name: "Learn 3D",
      href: "/learn/universe",
      icon: Compass,
      isActive: pathname.startsWith("/learn") || pathname.startsWith("/worlds") || pathname.startsWith("/notes"),
    },
    {
      name: "AI Tutor",
      href: "/tutor",
      icon: Bot,
      isSpecial: true,
      isActive: pathname === "/tutor",
    },
    {
      name: "Practice",
      href: "/exams",
      icon: Clock,
      isActive: pathname.startsWith("/exams") || pathname.startsWith("/papers"),
    },
    {
      name: "Profile",
      href: "/settings",
      icon: User,
      isActive: pathname === "/settings" || pathname === "/trophies" || pathname === "/performance",
    },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070a14]/92 backdrop-blur-xl border-t border-white/10 pb-safe transition-all shadow-[0_-8px_30px_rgba(0,0,0,0.5)]"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          if (item.isSpecial) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="relative -top-3 flex flex-col items-center group touch-target focus:outline-none"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                    active
                      ? "bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 text-white shadow-violet-500/40 scale-105"
                      : "bg-gradient-to-tr from-violet-700/80 to-cyan-500/80 text-white/90 hover:scale-105 shadow-violet-900/30"
                  }`}
                >
                  <Icon className="w-6 h-6 animate-pulse" />
                </div>
                <span
                  className={`text-[10px] mt-1 font-bold tracking-tight ${
                    active ? "text-cyan-300" : "text-slate-400 group-hover:text-slate-200"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 touch-target rounded-xl transition-all relative ${
                active
                  ? "text-cyan-400 font-semibold"
                  : "text-slate-400 hover:text-slate-200 active:scale-95"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${active ? "scale-110 text-cyan-400" : ""}`} />
                {active && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight truncate max-w-[56px] text-center">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
