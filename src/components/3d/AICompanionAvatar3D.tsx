"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Volume2, VolumeX, Sparkles } from "lucide-react";
import { CompanionAvatarType } from "@/types";

interface AICompanionAvatar3DProps {
  mood?: "idle" | "thinking" | "explaining" | "celebrating";
  avatarType?: CompanionAvatarType;
  lastMessageText?: string;
  isSpeaking?: boolean;
  onToggleSpeech?: () => void;
}

export function AICompanionAvatar3D({
  mood = "idle",
  avatarType = "nebula_core",
  lastMessageText,
  isSpeaking = false,
  onToggleSpeech,
}: AICompanionAvatar3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [speechActive, setSpeechActive] = useState(false);

  const handleSpeak = () => {
    if (!lastMessageText || typeof window === "undefined") return;

    if (speechActive) {
      window.speechSynthesis.cancel();
      setSpeechActive(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      lastMessageText.replace(/[*#$`]/g, "").slice(0, 300)
    );
    utterance.rate = 1.0;
    utterance.pitch = 1.05;
    utterance.onend = () => setSpeechActive(false);
    utterance.onerror = () => setSpeechActive(false);

    window.speechSynthesis.speak(utterance);
    setSpeechActive(true);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }

    const width = container.clientWidth || 180;
    const height = container.clientHeight || 180;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.2;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const group = new THREE.Group();
    scene.add(group);

    // Color theme based on avatarType
    let primaryHex = 0x06b6d4; // Cyan
    let secondaryHex = 0x8b5cf6; // Violet

    if (avatarType === "solar_flare") {
      primaryHex = 0xf59e0b;
      secondaryHex = 0xf43f5e;
    } else if (avatarType === "quantum_pulse") {
      primaryHex = 0x10b981;
      secondaryHex = 0x06b6d4;
    } else if (avatarType === "cyber_star") {
      primaryHex = 0x38bdf8;
      secondaryHex = 0xa855f7;
    }

    // Core Orb
    const coreGeo = new THREE.IcosahedronGeometry(0.8, 4);
    const coreMat = new THREE.MeshStandardMaterial({
      color: primaryHex,
      emissive: secondaryHex,
      emissiveIntensity: mood === "explaining" || speechActive ? 0.9 : 0.4,
      roughness: 0.1,
      metalness: 0.8,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Halo Rings
    const ringGeo = new THREE.TorusGeometry(1.2, 0.02, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: secondaryHex,
      transparent: true,
      opacity: 0.7,
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    group.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.x = -Math.PI / 3;
    group.add(ring2);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      const speedMultiplier = mood === "thinking" ? 3.0 : mood === "explaining" ? 1.8 : 1.0;

      group.rotation.y += 0.01 * speedMultiplier;
      group.position.y = Math.sin(elapsed * 2) * 0.08;

      ring1.rotation.z += 0.015 * speedMultiplier;
      ring2.rotation.z -= 0.012 * speedMultiplier;

      // Pulsing scale if speaking
      if (speechActive) {
        const pulse = 1 + Math.sin(elapsed * 10) * 0.08;
        core.scale.set(pulse, pulse, pulse);
      } else {
        core.scale.set(1, 1, 1);
      }

      renderer.render(scene, camera);
    };

    animate();

    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [avatarType, mood, speechActive]);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div ref={mountRef} className="w-28 h-28 cursor-pointer" onClick={handleSpeak} />
      {lastMessageText && (
        <button
          onClick={handleSpeak}
          className={`absolute -bottom-2 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 border transition-all ${
            speechActive
              ? "bg-cyan-500 text-slate-950 border-cyan-400 animate-pulse"
              : "bg-slate-900 text-slate-300 border-white/10 hover:border-cyan-400"
          }`}
          title="Listen to AI explanation aloud"
        >
          {speechActive ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-cyan-400" />}
          {speechActive ? "Mute" : "Read Aloud"}
        </button>
      )}
    </div>
  );
}
