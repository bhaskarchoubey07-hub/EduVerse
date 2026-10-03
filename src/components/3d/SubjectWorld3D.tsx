"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface SubjectWorld3DProps {
  worldType: "geometry" | "physics_orbital" | "chemistry_molecular" | "biology_helix";
  activeFormula?: string;
}

export function SubjectWorld3D({
  worldType,
  activeFormula,
}: SubjectWorld3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotationSpeed, setRotationSpeed] = useState(1.0);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [selectedElement, setSelectedElement] = useState<string>("Core Structure");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
    } catch {
      return;
    }

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 6;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x06b6d4, 2.0);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x8b5cf6, 1.5);
    dirLight2.position.set(-5, -5, 2);
    scene.add(dirLight2);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // BUILD SCENE BASED ON WORLD TYPE
    if (worldType === "geometry") {
      // 1. MATHEMATICS: Platonic Icosahedron + Inner Golden Ratio Octahedron
      const icoGeo = new THREE.IcosahedronGeometry(1.6, 0);
      const icoMat = new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        roughness: 0.2,
        metalness: 0.8,
        wireframe: wireframeMode,
      });
      const ico = new THREE.Mesh(icoGeo, icoMat);
      mainGroup.add(ico);

      // Inner Core
      const innerGeo = new THREE.OctahedronGeometry(0.8, 0);
      const innerMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        wireframe: true,
        emissive: 0x06b6d4,
        emissiveIntensity: 0.5,
      });
      const inner = new THREE.Mesh(innerGeo, innerMat);
      mainGroup.add(inner);
    } else if (worldType === "physics_orbital") {
      // 2. PHYSICS: Star + Multiple Orbital Gravity Paths + Prism Ray
      const starGeo = new THREE.SphereGeometry(0.7, 32, 32);
      const starMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.8,
      });
      const star = new THREE.Mesh(starGeo, starMat);
      mainGroup.add(star);

      // Orbit 1
      const p1Geo = new THREE.SphereGeometry(0.2, 16, 16);
      const p1Mat = new THREE.MeshStandardMaterial({ color: 0x06b6d4 });
      const p1 = new THREE.Mesh(p1Geo, p1Mat);
      p1.position.x = 2.2;
      mainGroup.add(p1);

      // Orbit Track Ring
      const track1 = new THREE.Mesh(
        new THREE.TorusGeometry(2.2, 0.015, 16, 80),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.4 })
      );
      track1.rotation.x = Math.PI / 2;
      mainGroup.add(track1);

      // Orbit 2
      const p2Geo = new THREE.SphereGeometry(0.28, 16, 16);
      const p2Mat = new THREE.MeshStandardMaterial({ color: 0x10b981 });
      const p2 = new THREE.Mesh(p2Geo, p2Mat);
      p2.position.set(-3.2, 0.5, 0);
      mainGroup.add(p2);

      const track2 = new THREE.Mesh(
        new THREE.TorusGeometry(3.2, 0.015, 16, 80),
        new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.3 })
      );
      track2.rotation.x = Math.PI / 2.3;
      mainGroup.add(track2);
    } else if (worldType === "chemistry_molecular") {
      // 3. CHEMISTRY: Methane (CH4) / Water (H2O) Molecule with Bond Cylinders
      // Central Carbon Atom (Black/Slate)
      const cGeo = new THREE.SphereGeometry(0.65, 32, 32);
      const cMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3 });
      const centralAtom = new THREE.Mesh(cGeo, cMat);
      mainGroup.add(centralAtom);

      // 4 Hydrogen Atoms (Cyan/White) positioned tetrahedrally
      const hCoords = [
        new THREE.Vector3(1.2, 1.2, 1.2),
        new THREE.Vector3(-1.2, -1.2, 1.2),
        new THREE.Vector3(-1.2, 1.2, -1.2),
        new THREE.Vector3(1.2, -1.2, -1.2),
      ];

      hCoords.forEach((pos) => {
        const hGeo = new THREE.SphereGeometry(0.35, 24, 24);
        const hMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.3 });
        const hMesh = new THREE.Mesh(hGeo, hMat);
        hMesh.position.copy(pos);
        mainGroup.add(hMesh);

        // Bond Cylinder
        const bondGeo = new THREE.CylinderGeometry(0.06, 0.06, pos.length(), 16);
        const bondMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8 });
        const bond = new THREE.Mesh(bondGeo, bondMat);

        bond.position.copy(pos.clone().multiplyScalar(0.5));
        bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
        mainGroup.add(bond);
      });
    } else if (worldType === "biology_helix") {
      // 4. BIOLOGY: 3D DNA Double Helix with Base Pairs
      const strandPoints = 30;
      for (let i = 0; i < strandPoints; i++) {
        const t = (i / strandPoints) * Math.PI * 4;
        const y = (i / strandPoints) * 3.6 - 1.8;
        const radius = 1.0;

        // Backbone Strand 1 (Violet)
        const p1 = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0x8b5cf6, emissive: 0x8b5cf6, emissiveIntensity: 0.4 })
        );
        p1.position.set(Math.cos(t) * radius, y, Math.sin(t) * radius);
        mainGroup.add(p1);

        // Backbone Strand 2 (Cyan)
        const p2 = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x06b6d4, emissiveIntensity: 0.4 })
        );
        p2.position.set(Math.cos(t + Math.PI) * radius, y, Math.sin(t + Math.PI) * radius);
        mainGroup.add(p2);

        // Base Pair Rung
        if (i % 2 === 0) {
          const rungGeo = new THREE.CylinderGeometry(0.03, 0.03, radius * 2, 8);
          const isAT = i % 4 === 0;
          const rungMat = new THREE.MeshStandardMaterial({
            color: isAT ? 0x10b981 : 0xf59e0b,
          });
          const rung = new THREE.Mesh(rungGeo, rungMat);
          rung.position.set(0, y, 0);
          rung.rotation.z = Math.PI / 2;
          rung.rotation.y = -t;
          mainGroup.add(rung);
        }
      }
    }

    // Pointer Drag & Hover
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y,
      };
      mainGroup.rotation.y += deltaMove.x * 0.01;
      mainGroup.rotation.x += deltaMove.y * 0.01;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Animation Loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (!isDragging) {
        mainGroup.rotation.y += 0.008 * rotationSpeed;
        mainGroup.rotation.x += 0.002 * rotationSpeed;
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
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [worldType, rotationSpeed, wireframeMode]);

  return (
    <div className="relative w-full h-full min-h-[380px] rounded-2xl glass-panel border border-white/10 overflow-hidden flex flex-col justify-between">
      {/* 3D Canvas Mount Point */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing flex-1" />

      {/* Floating 3D Controls Strip */}
      <div className="p-4 border-t border-white/10 bg-slate-900/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold">Speed:</span>
          {[0.5, 1.0, 2.0].map((s) => (
            <button
              key={s}
              onClick={() => setRotationSpeed(s)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                rotationSpeed === s ? "bg-cyan-500 text-slate-950" : "bg-white/5 text-slate-400"
              }`}
            >
              {s}x
            </button>
          ))}
          <button
            onClick={() => setWireframeMode(!wireframeMode)}
            className={`px-2.5 py-0.5 rounded text-[11px] font-semibold border ${
              wireframeMode ? "bg-violet-600 text-white border-violet-500" : "border-white/10 text-slate-400"
            }`}
          >
            Wireframe
          </button>
        </div>

        {activeFormula && (
          <div className="px-3 py-1 rounded-lg bg-slate-950 border border-cyan-500/30 text-cyan-300 font-mono text-[11px]">
            {activeFormula}
          </div>
        )}

        <div className="text-[10px] text-slate-500 font-mono">
          Drag to inspect 360°
        </div>
      </div>
    </div>
  );
}
