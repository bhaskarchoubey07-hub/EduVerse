"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/store/auth-context";
import { Sparkles } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "student" | "admin";
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        const redirectParam = pathname ? `?redirect=${encodeURIComponent(pathname)}` : "";
        router.push(`/auth/login${redirectParam}`);
      } else if (requiredRole && user.role !== requiredRole && user.role !== "admin") {
        router.push("/dashboard");
      }
    }
  }, [user, isLoading, router, pathname, requiredRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070a14] flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-400 p-[1px] animate-pulse">
            <div className="w-full h-full bg-[#080c18] rounded-[15px] flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-cyan-400" />
            </div>
          </div>
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs font-mono font-bold text-cyan-300">EduVerse AI Security</p>
          <p className="text-[11px] text-slate-400">Authenticating secure academic session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
