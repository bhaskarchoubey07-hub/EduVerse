"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  ShieldAlert,
  CheckCircle2,
  Eye,
  EyeOff,
  UserCheck,
} from "lucide-react";
import { useAuth } from "@/lib/store/auth-context";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const { login, isSupabaseActive } = useAuth();
  const [email, setEmail] = useState("aarav.sharma@eduverse.ai");
  const [password, setPassword] = useState("password123");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await login(email.trim().toLowerCase(), password);
      if (res.success) {
        router.push(redirectUrl);
      } else {
        setError(res.error || "Invalid email or password. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoType: "student" | "admin") => {
    if (demoType === "admin") {
      login("admin.principal@eduverse.ai", "demo123", "admin");
      router.push("/admin");
    } else {
      login("aarav.sharma@eduverse.ai", "demo123", "student");
      router.push(redirectUrl);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Card */}
      <div className="glass-panel-glow rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 p-[1px] mb-2">
            <div className="w-full h-full bg-[#080c18] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Welcome Back to EduVerse AI
          </h1>
          <p className="text-xs text-slate-400">
            Sign in to resume your board examination preparation.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <Link
                href="/auth/forgot-password"
                className="text-[11px] text-violet-400 hover:text-violet-300 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-white/20 bg-slate-900 text-violet-600 focus:ring-violet-500"
              />
              <span>Remember session</span>
            </label>

            {isSupabaseActive && (
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Supabase Auth Active
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In to EduVerse"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* QUICK DEMO ROLES (FOR INSTANT EVALUATION) */}
        <div className="pt-2 border-t border-white/10 space-y-2">
          <div className="text-[11px] font-semibold text-slate-400 text-center">
            One-Click Instant Preview Accounts:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo("student")}
              className="p-2 rounded-xl glass-panel hover:bg-white/10 text-xs font-semibold text-cyan-300 flex items-center justify-center gap-1.5 border border-cyan-500/30 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" /> Demo Student
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("admin")}
              className="p-2 rounded-xl glass-panel hover:bg-white/10 text-xs font-semibold text-violet-300 flex items-center justify-center gap-1.5 border border-violet-500/30 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" /> Demo Admin
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-cyan-400 font-semibold hover:underline">
            Register Free
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#070a14] bg-grid-pattern flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="text-slate-400 text-xs">Loading authentication...</div>}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
