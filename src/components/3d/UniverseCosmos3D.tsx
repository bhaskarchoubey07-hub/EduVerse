"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  SubjectWorldId,
  SubjectWorldPortal,
} from "@/types";
import {
  SUBJECT_WORLD_PORTALS,
  CHEMISTRY_MOLECULES,
  MoleculeDefinition,
} from "@/lib/data/universe-data";

interface UniverseCosmos3DProps {
  activeWorldId: SubjectWorldId;
  onSelectWorld: (worldId: SubjectWorldId) => void;
  exploreMode: "universe_overview" | "focused_world";
  graphicIntensity?: "full_3d" | "minimal_3d" | "fast_2d";
  // Sub-simulators parameters
  selectedMoleculeId?: string;
  projectileParams?: { velocity: number; angle: number; gravity: number };
  mathSolidParams?: { type: "cylinder" | "cone" | "sphere" | "pyramid"; radius: number; height: number };
  onWebGLFallback?: () => void;
}

export function UniverseCosmos3D({
  activeWorldId,
  onSelectWorld,
  exploreMode,
  graphicIntensity = "full_3d",
  selectedMoleculeId = "mol-ch4",
  projectileParams = { velocity: 20, angle: 45, gravity: 9.8 },
  mathSolidParams = { type: "cylinder", radius: 5, height: 10 },
  onWebGLFallback,
}: UniverseCosmos3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isWebGLSupported, setIsWebGLSupported] = useState<boolean>(true);
  const [hoveredWorld, setHoveredWorld] = useState<SubjectWorldId | null>(null);

  // Refs for Three.js scene instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const planetMeshesRef = useRef<Map<SubjectWorldId, THREE.Group>>(new Map());
  const animationFrameRef = useRef<number>(0);
  const focusedGroupRef = useRef<THREE.Group | null>(null);

  // Target camera positions for smooth interpolation
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 24, 46));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  // Pointer dragging state
  const isDragging = useRef<boolean>(false);
  const previousMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchStartDist = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL Support
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) throw new Error("WebGL Not Supported");
    } catch (e) {
      setIsWebGLSupported(false);
      onWebGLFallback?.();
      return;
    }

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050711);
    scene.fog = new THREE.FogExp2(0x050711, 0.012);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 24, 46);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: graphicIntensity !== "fast_2d", alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, graphicIntensity === "full_3d" ? 2 : 1));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const coreLight = new THREE.PointLight(0x38bdf8, 3.5, 90, 1.2);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    const secondaryLight = new THREE.DirectionalLight(0xa855f7, 1.2);
    secondaryLight.position.set(20, 30, 20);
    scene.add(secondaryLight);

    // ==========================================
    // 1. STARFIELD PARTICLES
    // ==========================================
    const starCount = graphicIntensity === "full_3d" ? 1800 : 700;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const r = 40 + Math.random() * 120;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);

      const tint = Math.random();
      if (tint > 0.6) {
        starColors[i * 3] = 0.4;
        starColors[i * 3 + 1] = 0.8;
        starColors[i * 3 + 2] = 1.0;
      } else if (tint > 0.3) {
        starColors[i * 3] = 0.75;
        starColors[i * 3 + 1] = 0.45;
        starColors[i * 3 + 2] = 1.0;
      } else {
        starColors[i * 3] = 0.95;
        starColors[i * 3 + 1] = 0.95;
        starColors[i * 3 + 2] = 1.0;
      }
    }

    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.85,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // ==========================================
    // 2. CENTRAL LEARNING CORE (SUN)
    // ==========================================
    const coreGroup = new THREE.Group();
    const coreGeo = new THREE.IcosahedronGeometry(2.4, 3);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.5,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);

    // Core pulsing glow shell
    const glowGeo = new THREE.SphereGeometry(3.2, 24, 24);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.15,
      wireframe: true,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    coreGroup.add(glowMesh);
    scene.add(coreGroup);

    // ==========================================
    // 3. 8 SUBJECT WORLDS / CELESTIAL PORTALS
    // ==========================================
    const planetsMap = new Map<SubjectWorldId, THREE.Group>();
    const radiusOrbits = [10, 15, 20, 25, 30, 35, 40, 45];

    SUBJECT_WORLD_PORTALS.forEach((portal, index) => {
      const pGroup = new THREE.Group();
      const orbitRadius = radiusOrbits[index] || 12 + index * 4.5;
      const angle = (index / SUBJECT_WORLD_PORTALS.length) * Math.PI * 2;

      pGroup.position.set(Math.cos(angle) * orbitRadius, (index % 2 === 0 ? 1 : -1) * (1.2 + Math.sin(index)), Math.sin(angle) * orbitRadius);
      pGroup.userData = { worldId: portal.id, orbitRadius, angle, speed: 0.002 + index * 0.0005 };

      // Orbital Ring
      const ringGeo = new THREE.BufferGeometry();
      const ringSegments = 64;
      const ringPositions = new Float32Array((ringSegments + 1) * 3);
      for (let j = 0; j <= ringSegments; j++) {
        const theta = (j / ringSegments) * Math.PI * 2;
        ringPositions[j * 3] = Math.cos(theta) * orbitRadius;
        ringPositions[j * 3 + 1] = 0;
        ringPositions[j * 3 + 2] = Math.sin(theta) * orbitRadius;
      }
      ringGeo.setAttribute("position", new THREE.BufferAttribute(ringPositions, 3));
      const ringMat = new THREE.LineBasicMaterial({
        color: portal.themeColor === "emerald" ? 0x10b981 : portal.themeColor === "cyan" ? 0x06b6d4 : portal.themeColor === "violet" ? 0x8b5cf6 : portal.themeColor === "amber" ? 0xf59e0b : 0x3b82f6,
        transparent: true,
        opacity: 0.22,
      });
      const orbitLine = new THREE.Line(ringGeo, ringMat);
      scene.add(orbitLine);

      // Planet Mesh
      const pColor =
        portal.themeColor === "emerald" ? 0x10b981 :
        portal.themeColor === "cyan" ? 0x06b6d4 :
        portal.themeColor === "violet" ? 0x8b5cf6 :
        portal.themeColor === "amber" ? 0xf59e0b :
        portal.themeColor === "blue" ? 0x3b82f6 :
        portal.themeColor === "rose" ? 0xf43f5e :
        portal.themeColor === "teal" ? 0x14b8a6 : 0x6366f1;

      const pSize = 1.3 + (portal.id === "biology" || portal.id === "chemistry" ? 0.35 : 0);
      const planetGeo = new THREE.IcosahedronGeometry(pSize, 2);
      const planetMat = new THREE.MeshStandardMaterial({
        color: pColor,
        emissive: pColor,
        emissiveIntensity: 0.45,
        roughness: 0.3,
        metalness: 0.6,
      });
      const planetMesh = new THREE.Mesh(planetGeo, planetMat);
      planetMesh.name = `planet_${portal.id}`;
      planetMesh.userData = { worldId: portal.id };
      pGroup.add(planetMesh);

      // Planetary Atmosphere Halo Ring
      const haloGeo = new THREE.TorusGeometry(pSize * 1.5, 0.06, 8, 32);
      const haloMat = new THREE.MeshBasicMaterial({ color: pColor, transparent: true, opacity: 0.6 });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.rotation.x = Math.PI / 2.5;
      pGroup.add(haloMesh);

      scene.add(pGroup);
      planetsMap.set(portal.id, pGroup);
    });

    planetMeshesRef.current = planetsMap;

    // ==========================================
    // 4. FOCUSED WORLD SPECIFIC SUB-VISUALIZER GROUP
    // ==========================================
    const focusedGroup = new THREE.Group();
    focusedGroup.position.set(0, 0, 0);
    scene.add(focusedGroup);
    focusedGroupRef.current = focusedGroup;

    // Raycaster for Hover & Click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      let hitWorld: SubjectWorldId | null = null;
      for (const hit of intersects) {
        if (hit.object.userData?.worldId) {
          hitWorld = hit.object.userData.worldId;
          break;
        }
      }
      setHoveredWorld(hitWorld);
    };

    const handlePointerDown = (e: MouseEvent) => {
      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: MouseEvent) => {
      const deltaX = Math.abs(e.clientX - previousMousePosition.current.x);
      const deltaY = Math.abs(e.clientY - previousMousePosition.current.y);
      isDragging.current = false;

      // If clicked without large drag
      if (deltaX < 5 && deltaY < 5) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);
        for (const hit of intersects) {
          if (hit.object.userData?.worldId) {
            onSelectWorld(hit.object.userData.worldId);
            break;
          }
        }
      }
    };

    const handlePointerDrag = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };

      const spherical = new THREE.Spherical();
      spherical.setFromVector3(camera.position);
      spherical.theta -= deltaX * 0.005;
      spherical.phi = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, spherical.phi - deltaY * 0.005));
      camera.position.setFromSpherical(spherical);
      camera.lookAt(currentLookAt.current);
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomSpeed = 0.05;
      const factor = e.deltaY > 0 ? 1 + zoomSpeed : 1 - zoomSpeed;
      camera.position.multiplyScalar(Math.max(0.6, Math.min(1.8, factor)));
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousemove", handlePointerMove);
    dom.addEventListener("mousedown", handlePointerDown);
    dom.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("mousemove", handlePointerDrag);
    dom.addEventListener("wheel", handleWheel, { passive: false });

    // Render loop
    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotate starfield & core
      starField.rotation.y = elapsedTime * 0.015;
      coreGroup.rotation.y = elapsedTime * 0.3;
      glowMesh.rotation.z = elapsedTime * 0.2;

      // Orbit planets
      planetsMap.forEach((pGroup, worldId) => {
        if (exploreMode === "universe_overview") {
          const u = pGroup.userData;
          const currentAngle = u.angle + elapsedTime * u.speed;
          pGroup.position.x = Math.cos(currentAngle) * u.orbitRadius;
          pGroup.position.z = Math.sin(currentAngle) * u.orbitRadius;
        }
        pGroup.rotation.y += 0.01;
      });

      // Camera smooth lerping
      camera.position.lerp(targetCamPos.current, 0.04);
      currentLookAt.current.lerp(targetLookAt.current, 0.04);
      camera.lookAt(currentLookAt.current);

      renderer.render(scene, camera);
    };

    animate();

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      resizeObserver.disconnect();
      dom.removeEventListener("mousemove", handlePointerMove);
      dom.removeEventListener("mousedown", handlePointerDown);
      dom.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("mousemove", handlePointerDrag);
      dom.removeEventListener("wheel", handleWheel);
      renderer.dispose();
    };
  }, [graphicIntensity]);

  // Adjust camera & focused visualizer when activeWorldId or exploreMode changes
  useEffect(() => {
    const pGroup = planetMeshesRef.current.get(activeWorldId);

    if (exploreMode === "focused_world" && pGroup) {
      // Zoom in towards selected world
      targetCamPos.current = new THREE.Vector3(pGroup.position.x * 0.6, pGroup.position.y + 4, pGroup.position.z * 0.6 + 8);
      targetLookAt.current = new THREE.Vector3(pGroup.position.x, pGroup.position.y, pGroup.position.z);
    } else {
      // Return to grand celestial overview
      targetCamPos.current = new THREE.Vector3(0, 24, 46);
      targetLookAt.current = new THREE.Vector3(0, 0, 0);
    }
  }, [activeWorldId, exploreMode]);

  // Render Sub-Simulator in Focused Mode (Chemistry Molecules / Physics / Math)
  useEffect(() => {
    const focusedGroup = focusedGroupRef.current;
    if (!focusedGroup) return;

    // Clear previous focused items
    while (focusedGroup.children.length > 0) {
      focusedGroup.remove(focusedGroup.children[0]);
    }

    if (exploreMode !== "focused_world") return;

    // Chemistry Molecular Visualizer
    if (activeWorldId === "chemistry") {
      const mol = CHEMISTRY_MOLECULES.find((m) => m.id === selectedMoleculeId) || CHEMISTRY_MOLECULES[0];
      const molGroup = new THREE.Group();
      molGroup.position.set(0, 0, 0);

      // Render Atoms
      mol.atoms.forEach((atom) => {
        const aGeo = new THREE.SphereGeometry(atom.size, 24, 24);
        const aMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(atom.color),
          roughness: 0.2,
          metalness: 0.3,
          emissive: new THREE.Color(atom.color),
          emissiveIntensity: 0.25,
        });
        const aMesh = new THREE.Mesh(aGeo, aMat);
        aMesh.position.set(atom.x * 2, atom.y * 2, atom.z * 2);
        molGroup.add(aMesh);
      });

      // Render Bonds
      mol.bonds.forEach((bond) => {
        const fromAtom = mol.atoms[bond.from];
        const toAtom = mol.atoms[bond.to];
        if (!fromAtom || !toAtom) return;

        const p1 = new THREE.Vector3(fromAtom.x * 2, fromAtom.y * 2, fromAtom.z * 2);
        const p2 = new THREE.Vector3(toAtom.x * 2, toAtom.y * 2, toAtom.z * 2);
        const dist = p1.distanceTo(p2);
        const dir = new THREE.Vector3().subVectors(p2, p1).normalize();

        const bondGeo = new THREE.CylinderGeometry(0.08, 0.08, dist, 12);
        const bondMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 });
        const bondMesh = new THREE.Mesh(bondGeo, bondMat);

        bondMesh.position.copy(p1).add(p2).multiplyScalar(0.5);
        bondMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        molGroup.add(bondMesh);
      });

      focusedGroup.add(molGroup);
    }

    // Physics Projectile Simulator
    if (activeWorldId === "physics") {
      const physGroup = new THREE.Group();
      const { velocity, angle, gravity } = projectileParams;
      const rad = (angle * Math.PI) / 180;
      const totalTime = (2 * velocity * Math.sin(rad)) / gravity;
      const points: THREE.Vector3[] = [];

      for (let t = 0; t <= totalTime; t += totalTime / 40) {
        const x = velocity * Math.cos(rad) * t * 0.4;
        const y = (velocity * Math.sin(rad) * t - 0.5 * gravity * t * t) * 0.4;
        points.push(new THREE.Vector3(x - 6, y, 0));
      }

      const pathGeo = new THREE.BufferGeometry().setFromPoints(points);
      const pathMat = new THREE.LineBasicMaterial({ color: 0xa855f7, linewidth: 3 });
      const pathLine = new THREE.Line(pathGeo, pathMat);
      physGroup.add(pathLine);

      // Launch Cannon Base
      const baseGeo = new THREE.CylinderGeometry(0.8, 1.2, 0.6, 16);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x64748b });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.set(-6, -0.3, 0);
      physGroup.add(baseMesh);

      focusedGroup.add(physGroup);
    }

    // Mathematics Spatial Solid Visualizer
    if (activeWorldId === "mathematics") {
      const mathGroup = new THREE.Group();
      const { type, radius, height } = mathSolidParams;
      const scaleR = radius * 0.3;
      const scaleH = height * 0.3;

      let solidGeo: THREE.BufferGeometry;
      if (type === "cone") {
        solidGeo = new THREE.ConeGeometry(scaleR, scaleH, 32);
      } else if (type === "sphere") {
        solidGeo = new THREE.SphereGeometry(scaleR, 32, 32);
      } else if (type === "pyramid") {
        solidGeo = new THREE.ConeGeometry(scaleR, scaleH, 4);
      } else {
        solidGeo = new THREE.CylinderGeometry(scaleR, scaleR, scaleH, 32);
      }

      const solidMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.35,
        wireframe: false,
        roughness: 0.25,
        metalness: 0.5,
      });
      const solidMesh = new THREE.Mesh(solidGeo, solidMat);
      mathGroup.add(solidMesh);

      // Wireframe overlay
      const wireGeo = new THREE.WireframeGeometry(solidGeo);
      const wireMat = new THREE.LineBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.4 });
      const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
      mathGroup.add(wireMesh);

      focusedGroup.add(mathGroup);
    }
  }, [activeWorldId, exploreMode, selectedMoleculeId, projectileParams, mathSolidParams]);

  const activePortal = SUBJECT_WORLD_PORTALS.find((p) => p.id === activeWorldId) || SUBJECT_WORLD_PORTALS[0];

  return (
    <div className="relative w-full h-full min-h-[440px] rounded-3xl overflow-hidden glass-panel border border-white/15 shadow-2xl">
      {/* Three.js Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Universe Compass HUD */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#070a18]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-xl">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>3D UNIVERSE: {activePortal.name.toUpperCase()}</span>
      </div>

      {/* Hovered World Floating Tooltip */}
      {hoveredWorld && hoveredWorld !== activeWorldId && (
        <div className="absolute bottom-4 left-4 z-10 bg-slate-900/95 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-xs text-white shadow-2xl animate-in fade-in">
          <p className="font-bold text-cyan-300">
            {SUBJECT_WORLD_PORTALS.find((p) => p.id === hoveredWorld)?.name}
          </p>
          <p className="text-[10px] text-slate-400">Click planet to focus &amp; enter world</p>
        </div>
      )}

      {/* Quick Camera Reset Button */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() => {
            targetCamPos.current = new THREE.Vector3(0, 24, 46);
            targetLookAt.current = new THREE.Vector3(0, 0, 0);
          }}
          className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/15 text-xs text-slate-300 hover:text-white font-mono transition-all shadow-lg cursor-pointer"
        >
          Reset Orbit View
        </button>
      </div>
    </div>
  );
}
