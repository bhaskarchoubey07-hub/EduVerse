"use client";

export type QualityTier = "high" | "balanced" | "performance" | "fallback_2d";
export type QualitySetting = "auto" | "high" | "balanced" | "performance" | "fast_2d";

export interface DeviceQualityProfile {
  tier: QualityTier;
  pixelRatio: number;
  particleCount: number;
  enableShadows: boolean;
  antialias: boolean;
  maxTextureSize: number;
  isMobile: boolean;
  canRenderWebGL: boolean;
  reason: string;
}

/**
 * Detects device hardware profile and WebGL capability to automatically adapt 3D scenes.
 */
export function detectDeviceQuality(userPreference: QualitySetting = "auto"): DeviceQualityProfile {
  if (typeof window === "undefined") {
    return {
      tier: "balanced",
      pixelRatio: 1,
      particleCount: 80,
      enableShadows: false,
      antialias: false,
      maxTextureSize: 2048,
      isMobile: false,
      canRenderWebGL: true,
      reason: "Server-side rendering default",
    };
  }

  // 1. Detect if touch device / mobile screen width
  const isMobile =
    window.innerWidth < 768 ||
    (typeof navigator !== "undefined" && (navigator.maxTouchPoints > 1 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)));

  // 2. Check WebGL availability
  let canRenderWebGL = false;
  let maxTextureSize = 2048;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl) {
      canRenderWebGL = true;
      const webglCtx = gl as WebGLRenderingContext;
      maxTextureSize = webglCtx.getParameter(webglCtx.MAX_TEXTURE_SIZE) || 2048;
    }
  } catch (e) {
    canRenderWebGL = false;
  }

  if (!canRenderWebGL || userPreference === "fast_2d") {
    return {
      tier: "fallback_2d",
      pixelRatio: 1,
      particleCount: 0,
      enableShadows: false,
      antialias: false,
      maxTextureSize: 1024,
      isMobile,
      canRenderWebGL,
      reason: !canRenderWebGL ? "WebGL not supported by hardware" : "User selected 2D diagram mode",
    };
  }

  // Handle explicit user overrides
  if (userPreference === "high") {
    return {
      tier: "high",
      pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      particleCount: 180,
      enableShadows: true,
      antialias: true,
      maxTextureSize,
      isMobile,
      canRenderWebGL: true,
      reason: "User selected High Quality",
    };
  }

  if (userPreference === "balanced") {
    return {
      tier: "balanced",
      pixelRatio: Math.min(window.devicePixelRatio || 1, 1.35),
      particleCount: 90,
      enableShadows: false,
      antialias: true,
      maxTextureSize,
      isMobile,
      canRenderWebGL: true,
      reason: "User selected Balanced Quality",
    };
  }

  if (userPreference === "performance") {
    return {
      tier: "performance",
      pixelRatio: 1,
      particleCount: 40,
      enableShadows: false,
      antialias: false,
      maxTextureSize: Math.min(maxTextureSize, 2048),
      isMobile,
      canRenderWebGL: true,
      reason: "User selected Performance Mode",
    };
  }

  // AUTO DETECTION
  // Check available device memory (Chrome/Edge supports navigator.deviceMemory in GB)
  const navMemory = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
  const isLowMemory = typeof navMemory === "number" && navMemory <= 4;
  const isVerySmallScreen = window.innerWidth <= 420;

  if (isMobile) {
    if (isLowMemory || isVerySmallScreen) {
      return {
        tier: "performance",
        pixelRatio: 1.0,
        particleCount: 45,
        enableShadows: false,
        antialias: false,
        maxTextureSize: 2048,
        isMobile: true,
        canRenderWebGL: true,
        reason: "Auto-detected compact mobile / low-memory device",
      };
    }

    return {
      tier: "balanced",
      pixelRatio: Math.min(window.devicePixelRatio || 1, 1.25),
      particleCount: 75,
      enableShadows: false,
      antialias: true,
      maxTextureSize: 4096,
      isMobile: true,
      canRenderWebGL: true,
      reason: "Auto-detected standard mobile device",
    };
  }

  // Desktop default
  return {
    tier: "high",
    pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
    particleCount: 180,
    enableShadows: true,
    antialias: true,
    maxTextureSize,
    isMobile: false,
    canRenderWebGL: true,
    reason: "Auto-detected desktop workstation",
  };
}
