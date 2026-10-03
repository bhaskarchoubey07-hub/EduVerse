"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface LearningUniversePlanetProps {
  size?: number;
  interactive?: boolean;
  accentColor?: string;
  badgeText?: string;
}

export function LearningUniversePlanet({
  size = 400,
  interactive = true,
  accentColor = "#06b6d4",
  badgeText = "EduVerse Core",
}: LearningUniversePlanetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch (e) {
      setHasWebGL(false);
      return;
    }

    const width = container.clientWidth || size;
    const height = container.clientHeight || size;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5.2;

    // 1. Core Sphere (Main Planet)
    const sphereGeo = new THREE.SphereGeometry(1.4, 64, 64);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color("#0c1228"),
      emissive: new THREE.Color("#180f33"),
      specular: new THREE.Color(accentColor),
      shininess: 40,
      wireframe: false,
    });
    const planet = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(planet);

    // 2. Wireframe Overlay Sphere
    const wireGeo = new THREE.SphereGeometry(1.42, 24, 24);
    const wireMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#8b5cf6"),
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const wireSphere = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireSphere);

    // 3. Orbital Rings
    const ring1Geo = new THREE.TorusGeometry(2.1, 0.02, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#06b6d4"),
      transparent: true,
      opacity: 0.6,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    scene.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.4, 0.015, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#a78bfa"),
      transparent: true,
      opacity: 0.4,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    // 4. Orbiting Educational Data Satellites (Subject Nodes)
    const satellitesGroup = new THREE.Group();
    const satCount = 4;
    const satColors = ["#06b6d4", "#8b5cf6", "#10b981", "#f59e0b"];

    for (let i = 0; i < satCount; i++) {
      const angle = (i / satCount) * Math.PI * 2;
      const satGeo = new THREE.OctahedronGeometry(0.12, 0);
      const satMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(satColors[i]),
        emissive: new THREE.Color(satColors[i]),
        emissiveIntensity: 0.5,
      });
      const sat = new THREE.Mesh(satGeo, satMat);
      sat.position.set(Math.cos(angle) * 2.1, Math.sin(angle) * 0.8, Math.sin(angle) * 1.5);
      satellitesGroup.add(sat);
    }
    scene.add(satellitesGroup);

    // 5. Starfield Particles Background
    const starCount = 180;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 12;
      starPositions[i + 1] = (Math.random() - 0.5) * 12;
      starPositions[i + 2] = (Math.random() - 0.5) * 8;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: new THREE.Color("#93c5fd"),
      size: 0.04,
      transparent: true,
      opacity: 0.7,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 6. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x06b6d4, 2.5, 50);
    pointLight1.position.set(5, 3, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8b5cf6, 2.0, 50);
    pointLight2.position.set(-5, -3, -2);
    scene.add(pointLight2);

    // Pointer interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    if (interactive) {
      container.addEventListener("mousemove", onPointerMove);
    }

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth pointer damping
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      planet.rotation.y += 0.005;
      wireSphere.rotation.y -= 0.003;

      ring1.rotation.z += 0.006;
      ring2.rotation.z -= 0.004;

      satellitesGroup.rotation.y += 0.01;
      satellitesGroup.rotation.x = Math.sin(elapsed * 0.5) * 0.1;

      // Group rotation from mouse
      scene.rotation.y = targetX * 0.4;
      scene.rotation.x = -targetY * 0.4;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (interactive) {
        container.removeEventListener("mousemove", onPointerMove);
      }
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [accentColor, interactive, size]);

  if (!hasWebGL) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6 text-center">
        <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-400 p-[2px] animate-pulse">
          <div className="w-full h-full rounded-full bg-[#080c18] flex items-center justify-center">
            <span className="text-xs font-bold text-cyan-300 font-mono">EduVerse Core 3D</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[320px] flex items-center justify-center overflow-hidden">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      {badgeText && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-[10px] text-cyan-300 font-mono pointer-events-none backdrop-blur-md shadow-lg">
          ✨ {badgeText} • Drag to Rotate Space
        </div>
      )}
    </div>
  );
}
