"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "@/lib/store/auth-context";
import { BOARDS } from "@/lib/data/mock-db";
import { ClassLevel } from "@/types";

export default function RegisterPage() {
  const router = useRouter();
  const { register, resendVerification } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [classLevel, setClassLevel] = useState<ClassLevel>(10);
  const [boardId, setBoardId] = useState("cbse");
  const [preferredLanguage, setPreferredLanguage] = useState<
    "english" | "hinglish" | "hindi" | "punjabi"
  >("english");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Email verification screen state
  const [verificationPending, setVerificationPending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !email.trim() || !password) {
      setError("Please fill in all mandatory fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    if (!agreeTerms) {
      setError("Please accept the terms of service and academic fair use policy.");
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        classLevel,
        boardId,
        preferredLanguage,
      });

      if (!result.success) {
        setError(result.error || "Failed to create account. Please try again.");
        return;
      }

      if (result.requiresEmailVerification) {
        setVerificationPending(true);
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await resendVerification(email);
      if (res.success) {
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 4000);
      } else {
        setError(res.error || "Failed to resend confirmation email.");
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a14] bg-grid-pattern flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg space-y-6">
          {verificationPending ? (
            /* EMAIL VERIFICATION REQUIRED SCREEN (Section 15) */
            <div className="glass-panel-glow rounded-2xl p-8 border border-cyan-500/40 shadow-2xl text-center space-y-5 animate-in fade-in">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/30">
                <Mail className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Check Your Inbox to Verify
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  We sent a confirmation link to <strong className="text-cyan-300">{email}</strong>.
                  Please click the link in your email to activate your EduVerse account.
                </p>
              </div>

              {resendSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Verification email resent successfully!
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl glass-panel text-xs text-slate-200 hover:text-white font-semibold flex items-center justify-center gap-2 border border-white/10"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`} />
                  {resending ? "Resending..." : "Resend Verification Link"}
                </button>

                <Link
                  href="/auth/login"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20"
                >
                  Proceed to Sign In <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            /* REGISTRATION FORM (Section 12) */
            <div className="glass-panel-glow rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 p-[1px] mb-2">
                  <div className="w-full h-full bg-[#080c18] rounded-[11px] flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-cyan-400" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Create Your EduVerse Account
                </h1>
                <p className="text-xs text-slate-400">
                  Join students preparing for Class 10, 11 &amp; 12 Board Examination success.
                </p>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Diya Sengupta"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email Address <span className="text-rose-400">*</span>
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

                {/* Class & Board Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Class</label>
                    <select
                      value={classLevel}
                      onChange={(e) => setClassLevel(Number(e.target.value) as ClassLevel)}
                      className="w-full p-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                    >
                      <option value={10}>Class 10</option>
                      <option value={11}>Class 11</option>
                      <option value={12}>Class 12</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Examination Board
                    </label>
                    <select
                      value={boardId}
                      onChange={(e) => setBoardId(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                    >
                      {BOARDS.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.shortName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Preferred Language */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Preferred AI Tutor Language
                  </label>
                  <select
                    value={preferredLanguage}
                    onChange={(e) =>
                      setPreferredLanguage(
                        e.target.value as "english" | "hinglish" | "hindi" | "punjabi"
                      )
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                  >
                    <option value="english">English (Standard)</option>
                    <option value="hinglish">Hinglish (Bilingual Conversational)</option>
                    <option value="hindi">Hindi (हिन्दी)</option>
                    <option value="punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
                  </select>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Password <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 6 chars"
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

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Confirm Password <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Terms and Academic Fair Use Checkbox */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-white/20 bg-slate-900 text-violet-600 focus:ring-violet-500"
                  />
                  <label htmlFor="terms" className="text-[11px] text-slate-400 leading-snug">
                    I agree to the{" "}
                    <span className="text-cyan-400 underline">Terms of Service</span> and{" "}
                    <span className="text-cyan-400 underline">Academic Fair Use Policy</span>.
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Creating EduVerse Account..." : "Create Account"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="text-center text-xs text-slate-400">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-cyan-400 font-semibold hover:underline">
                  Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
