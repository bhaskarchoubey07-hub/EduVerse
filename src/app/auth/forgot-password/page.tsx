"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Sparkles, ArrowLeft, Mail, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/store/auth-context";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await forgotPassword(email.trim().toLowerCase());
      if (res.success) {
        setSubmitted(true);
      } else {
        setError(res.error || "Failed to send reset link. Please verify your email.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a14] bg-grid-pattern flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6">
          <div className="glass-panel-glow rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 p-[1px] mb-2">
                <div className="w-full h-full bg-[#080c18] rounded-[11px] flex items-center justify-center">
                  <Mail className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Reset Your Password
              </h1>
              <p className="text-xs text-slate-400">
                Enter your registered email to receive secure password reset instructions.
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {submitted ? (
              <div className="p-5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-center space-y-3 animate-in fade-in">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h3 className="text-sm font-bold text-white">Reset Link Sent</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  If an account exists for <strong className="text-cyan-300">{email}</strong>, you
                  will receive a password reset link shortly. Please check your spam folder as well.
                </p>
                <div className="pt-2">
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-semibold hover:underline"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                  </Link>
                </div>
              </div>
            ) : (
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Sending Reset Link..." : "Send Reset Link"}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center pt-2">
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Return to Sign In
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
