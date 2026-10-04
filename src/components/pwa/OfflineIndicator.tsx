"use client";

import React, { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsOffline(!navigator.onLine);

    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnected(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3500);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (showReconnected) {
    return (
      <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-1.5 shadow-xl animate-in fade-in">
        <Wifi className="w-3.5 h-3.5 text-emerald-400" />
        <span>Back online. Syncing with EduVerse cloud.</span>
      </div>
    );
  }

  if (!isOffline) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-1.5 rounded-full bg-amber-950/90 border border-amber-500/40 text-amber-200 text-xs font-semibold flex items-center gap-1.5 shadow-xl animate-in fade-in">
      <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
      <span>You are offline. Cached study materials are accessible.</span>
    </div>
  );
}
