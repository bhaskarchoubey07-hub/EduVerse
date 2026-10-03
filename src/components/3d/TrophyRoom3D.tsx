"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { TrophyModelType } from "@/types";

interface TrophyRoom3DProps {
  modelType: TrophyModelType;
  isUnlocked?: boolean;
}

export function TrophyRoom3D({ modelType, isUnlocked = true }: TrophyRoom3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }

    const width = container.clientWidth || 240;
    const height = container.clientHeight || 240;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.z = 4.2;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, isUnlocked ? 1.0 : 0.3);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(isUnlocked ? 0xf59e0b : 0x64748b, 3, 20);
    pointLight.position.set(3, 4, 3);
    scene.add(pointLight);

    const trophyGroup = new THREE.Group();
    scene.add(trophyGroup);

    // Pedestal Base
    const baseGeo = new THREE.CylinderGeometry(1.1, 1.2, 0.2, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.9,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -1.2;
    trophyGroup.add(baseMesh);

    // BUILD TROPHY ARTIFACT
    const goldColor = isUnlocked ? 0xfbbf24 : 0x475569;
    const cyanColor = isUnlocked ? 0x06b6d4 : 0x334155;
    const violetColor = isUnlocked ? 0x8b5cf6 : 0x334155;

    if (modelType === "gold_medal") {
      const medalGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.15, 32);
      const medalMat = new THREE.MeshStandardMaterial({
        color: goldColor,
        metalness: 0.9,
        roughness: 0.15,
      });
      const medal = new THREE.Mesh(medalGeo, medalMat);
      medal.rotation.x = Math.PI / 2;
      trophyGroup.add(medal);

      const starGeo = new THREE.OctahedronGeometry(0.35, 0);
      const starMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9 });
      const star = new THREE.Mesh(starGeo, starMat);
      star.position.z = 0.12;
      trophyGroup.add(star);
    } else if (modelType === "prism") {
      const prismGeo = new THREE.ConeGeometry(0.9, 1.4, 3);
      const prismMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.85,
        opacity: 1,
        transparent: true,
        roughness: 0.05,
        ior: 1.5,
      });
      const prism = new THREE.Mesh(prismGeo, prismMat);
      trophyGroup.add(prism);
    } else if (modelType === "atom") {
      const nucleusGeo = new THREE.SphereGeometry(0.35, 24, 24);
      const nucleusMat = new THREE.MeshStandardMaterial({ color: goldColor, emissive: goldColor, emissiveIntensity: 0.4 });
      const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
      trophyGroup.add(nucleus);

      // 3 Electron Shell Rings
      for (let i = 0; i < 3; i++) {
        const ringGeo = new THREE.TorusGeometry(0.95, 0.03, 16, 64);
        const ringMat = new THREE.MeshStandardMaterial({ color: cyanColor });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = (i * Math.PI) / 3;
        ring.rotation.y = (i * Math.PI) / 4;
        trophyGroup.add(ring);
      }
    } else if (modelType === "crystal") {
      const crystalGeo = new THREE.IcosahedronGeometry(0.85, 0);
      const crystalMat = new THREE.MeshPhysicalMaterial({
        color: violetColor,
        roughness: 0.1,
        metalness: 0.8,
        wireframe: false,
      });
      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      trophyGroup.add(crystal);
    } else {
      // Flame / Default
      const flameGeo = new THREE.ConeGeometry(0.7, 1.5, 16);
      const flameMat = new THREE.MeshStandardMaterial({
        color: isUnlocked ? 0xf43f5e : 0x475569,
        emissive: isUnlocked ? 0xf59e0b : 0x000000,
        emissiveIntensity: 0.6,
      });
      const flame = new THREE.Mesh(flameGeo, flameMat);
      trophyGroup.add(flame);
    }

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      trophyGroup.rotation.y += 0.012;
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
  }, [modelType, isUnlocked]);

  return <div ref={mountRef} className="w-full h-full min-h-[160px] flex items-center justify-center" />;
}
