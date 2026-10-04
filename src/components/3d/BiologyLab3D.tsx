"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  BodySystemType,
  LabViewMode,
  CellType,
  ANATOMICAL_STRUCTURES,
  CELL_ORGANELLES,
  BLOOD_FLOW_SEQUENCE,
  AnatomicalStructure,
  CellOrganelle,
} from "@/lib/data/biology-data";

interface BiologyLab3DProps {
  system: BodySystemType;
  selectedStructureId: string | null;
  onSelectStructure: (id: string) => void;
  showLabels: boolean;
  viewMode: LabViewMode;
  cellType: CellType;
  bloodFlowActive: boolean;
  bloodFlowStep: number;
  breathingActive: boolean;
  foodJourneyActive: boolean;
  foodJourneyStep: number;
  graphicIntensity: "full_3d" | "minimal_3d" | "fast_2d";
  onWebGLFallback?: () => void;
}

export function BiologyLab3D({
  system,
  selectedStructureId,
  onSelectStructure,
  showLabels,
  viewMode,
  cellType,
  bloodFlowActive,
  bloodFlowStep,
  breathingActive,
  foodJourneyActive,
  foodJourneyStep,
  graphicIntensity,
  onWebGLFallback,
}: BiologyLab3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredStructure, setHoveredStructure] = useState<string | null>(null);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshMapRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const labelSpritesRef = useRef<THREE.Group | null>(null);
  const bloodParticlesRef = useRef<THREE.Points | null>(null);
  const breathingGroupRef = useRef<THREE.Group | null>(null);
  const heartGroupRef = useRef<THREE.Group | null>(null);
  const foodParticlesRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // 1. SCENE CREATION
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x060914, 0.04);

    // 2. CAMERA SETUP
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 7.5);
    cameraRef.current = camera;

    // 3. RENDERER SETUP
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: graphicIntensity !== "minimal_3d",
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, graphicIntensity === "full_3d" ? 2 : 1));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      rendererRef.current = renderer;
      container.appendChild(renderer.domElement);
    } catch (err) {
      console.warn("WebGL initialization failed in BiologyLab3D:", err);
      onWebGLFallback?.();
      return;
    }

    // 4. LIGHTING SYSTEM
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const primaryLight = new THREE.DirectionalLight(0x00f0ff, 2.0);
    primaryLight.position.set(5, 8, 6);
    scene.add(primaryLight);

    const rimLight = new THREE.DirectionalLight(0x8b5cf6, 2.2);
    rimLight.position.set(-6, -4, -5);
    scene.add(rimLight);

    const frontFillLight = new THREE.PointLight(0xffffff, 1.2, 20);
    frontFillLight.position.set(0, 2, 4);
    scene.add(frontFillLight);

    // 5. SCIENTIFIC DIGITAL LAB ENVIRONMENT (Holographic grid & ambient particles)
    const gridHelper = new THREE.GridHelper(16, 24, 0x00f0ff, 0x1e293b);
    gridHelper.position.y = -2.5;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.25;
    scene.add(gridHelper);

    // Ambient floating bio-particles
    const particleCount = graphicIntensity === "full_3d" ? 180 : 60;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 14;
      particlePositions[i + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i + 2] = (Math.random() - 0.5) * 10;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.04,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const backgroundParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(backgroundParticles);

    // 6. BUILD ANATOMY MESH HIERARCHY
    const anatomyGroup = new THREE.Group();
    scene.add(anatomyGroup);
    meshMapRef.current.clear();

    const labelGroup = new THREE.Group();
    labelSpritesRef.current = labelGroup;
    scene.add(labelGroup);

    if (viewMode === "cell_lab") {
      buildCellLab(anatomyGroup, cellType, meshMapRef.current);
    } else {
      buildHumanBodyAnatomy(
        anatomyGroup,
        system,
        meshMapRef.current,
        breathingGroupRef,
        heartGroupRef,
        bloodParticlesRef,
        foodParticlesRef
      );
    }

    // 7. BUILD 3D HOTSPOT LABELS
    buildHotspotLabels(labelGroup, viewMode, cellType, system);

    // 8. INTERACTIVE POINTER RAYCASTING & ORBIT DRAG
    let isDragging = false;
    let previousPointerX = 0;
    let previousPointerY = 0;
    let rotationVelocityX = 0;
    let rotationVelocityY = 0;
    let touchDistance = 0;
    let touchStartTime = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let lastTapTime = 0;

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      previousPointerX = clientX;
      previousPointerY = clientY;
      touchStartX = clientX;
      touchStartY = clientY;
      touchStartTime = Date.now();

      if ("touches" in e && e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchDistance = Math.sqrt(dx * dx + dy * dy);
      }
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      // Pinch zoom on mobile
      if ("touches" in e && e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDistance = Math.sqrt(dx * dx + dy * dy);
        const diff = currentDistance - touchDistance;
        touchDistance = currentDistance;
        camera.position.z = Math.max(3.5, Math.min(11, camera.position.z - diff * 0.02));
        return;
      }

      if (isDragging) {
        const deltaX = clientX - previousPointerX;
        const deltaY = clientY - previousPointerY;
        rotationVelocityY = deltaX * 0.005;
        rotationVelocityX = deltaY * 0.005;
        previousPointerX = clientX;
        previousPointerY = clientY;
      } else {
        // Raycast for hover detection
        raycaster.setFromCamera(pointer, camera);
        const interactableMeshes: THREE.Object3D[] = [];
        meshMapRef.current.forEach((obj) => interactableMeshes.push(obj));
        const intersects = raycaster.intersectObjects(interactableMeshes, true);

        if (intersects.length > 0) {
          let topObj = intersects[0].object;
          while (topObj.parent && topObj.parent !== anatomyGroup && !topObj.userData.structureId) {
            topObj = topObj.parent;
          }
          const structId = topObj.userData?.structureId;
          if (structId && structId !== hoveredStructure) {
            setHoveredStructure(structId);
            container.style.cursor = "pointer";
          }
        } else {
          setHoveredStructure(null);
          container.style.cursor = "grab";
        }
      }
    };

    const handlePointerUp = (e?: MouseEvent | TouchEvent) => {
      isDragging = false;
      const now = Date.now();
      const elapsed = now - touchStartTime;

      let clientX = previousPointerX;
      let clientY = previousPointerY;
      if (e && "changedTouches" in e && e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      } else if (e && "clientX" in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      const movedDist = Math.sqrt(
        (clientX - touchStartX) * (clientX - touchStartX) +
        (clientY - touchStartY) * (clientY - touchStartY)
      );

      // Tap detection (under 300ms and under 12px drag movement)
      if (elapsed < 300 && movedDist < 12) {
        // Check for double tap to reset view
        if (now - lastTapTime < 300) {
          camera.position.set(0, 1.5, 7.5);
          anatomyGroup.rotation.set(0, 0, 0);
          lastTapTime = 0;
          return;
        }
        lastTapTime = now;

        const rect = container.getBoundingClientRect();
        pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);
        const interactableMeshes: THREE.Object3D[] = [];
        meshMapRef.current.forEach((obj) => interactableMeshes.push(obj));
        const intersects = raycaster.intersectObjects(interactableMeshes, true);

        if (intersects.length > 0) {
          let topObj = intersects[0].object;
          while (topObj.parent && topObj.parent !== anatomyGroup && !topObj.userData.structureId) {
            topObj = topObj.parent;
          }
          const structId = topObj.userData?.structureId;
          if (structId) {
            onSelectStructure(structId);
          }
        }
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Handled in handlePointerUp for unified touch + mouse support
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(3.2, Math.min(11.5, camera.position.z + e.deltaY * 0.005));
    };

    container.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    container.addEventListener("click", handleClick);
    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handlePointerDown, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("touchend", handlePointerUp, { passive: true });

    // 9. ANIMATION LOOP
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Inertial rotational damping
      if (anatomyGroup) {
        anatomyGroup.rotation.y += rotationVelocityY;
        anatomyGroup.rotation.x = Math.max(-0.5, Math.min(0.5, anatomyGroup.rotation.x + rotationVelocityX));
        rotationVelocityX *= 0.92;
        rotationVelocityY *= 0.92;
      }

      // Background particle gentle drift
      backgroundParticles.rotation.y = elapsedTime * 0.02;

      // Real-time Heart Pulsation & Blood Flow Animation
      if (heartGroupRef.current && (system === "circulatory" || viewMode === "human_body")) {
        const beatScale = 1.0 + Math.sin(elapsedTime * 4.5) * 0.06;
        heartGroupRef.current.scale.set(beatScale, beatScale, beatScale);
      }

      // Thoracic Breathing Expansion Animation
      if (breathingGroupRef.current && (system === "respiratory" || breathingActive)) {
        const breathCycle = Math.sin(elapsedTime * 1.8);
        const breathExpansion = 1.0 + (breathCycle > 0 ? breathCycle * 0.08 : 0);
        breathingGroupRef.current.scale.set(breathExpansion, breathExpansion, 1.0 + breathExpansion * 0.05);
      }

      // Blood flow particle circuit animation
      if (bloodParticlesRef.current && bloodFlowActive) {
        const positions = bloodParticlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] += Math.sin(elapsedTime * 2 + i) * 0.003;
        }
        bloodParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Highlight active / selected mesh
      meshMapRef.current.forEach((mesh, id) => {
        const isSelected = selectedStructureId === id;
        const isHovered = hoveredStructure === id;

        mesh.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            const mat = child.material as THREE.MeshStandardMaterial;
            if (isSelected) {
              mat.emissive = new THREE.Color(0x00f0ff);
              mat.emissiveIntensity = 0.65;
            } else if (isHovered) {
              mat.emissive = new THREE.Color(0x8b5cf6);
              mat.emissiveIntensity = 0.45;
            } else {
              mat.emissive = new THREE.Color(0x000000);
              mat.emissiveIntensity = 0;
            }
          }
        });
      });

      // Label visibility
      if (labelSpritesRef.current) {
        labelSpritesRef.current.visible = showLabels;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      container.removeEventListener("click", handleClick);
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [system, viewMode, cellType, graphicIntensity]);

  // Smooth camera zoom to selected structure
  useEffect(() => {
    if (!selectedStructureId || !cameraRef.current) return;
    const struct =
      ANATOMICAL_STRUCTURES.find((s) => s.id === selectedStructureId) ||
      CELL_ORGANELLES.find((o) => o.id === selectedStructureId);

    if (struct && cameraRef.current) {
      const [tx, ty, tz] = struct.coordinates;
      // Animate camera focus smoothly
      cameraRef.current.position.set(tx * 0.4, ty * 0.8 + 0.3, Math.max(3.8, cameraRef.current.position.z * 0.85));
    }
  }, [selectedStructureId]);

  return (
    <div className="relative w-full h-full min-h-[520px] select-none rounded-3xl overflow-hidden glass-panel border border-cyan-500/20 shadow-2xl">
      {/* 3D Canvas Anchor */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D HUD Indicators */}
      <div className="absolute top-4 left-4 pointer-events-none flex items-center gap-2">
        <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold backdrop-blur-md flex items-center gap-1.5 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          {viewMode === "cell_lab"
            ? `🔬 Microscopic View: ${cellType === "animal_cell" ? "Animal Cell" : "Plant Cell"}`
            : `🧬 System: ${system.toUpperCase()}`}
        </span>

        {hoveredStructure && (
          <span className="px-3 py-1 rounded-full bg-violet-950/80 border border-violet-500/40 text-violet-200 font-mono text-xs font-bold backdrop-blur-md animate-in fade-in">
            Hover: {hoveredStructure.replace("_", " ").toUpperCase()}
          </span>
        )}
      </div>

      {/* Touch/Mouse Instructions Hint */}
      <div className="absolute bottom-4 left-4 pointer-events-none text-[11px] font-mono text-slate-400 bg-slate-950/70 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md">
        🖱️ Left Drag: Rotate • Scroll / Pinch: Zoom • Click Structure: Inspect &amp; Quiz
      </div>
    </div>
  );
}

// =========================================================================
// PROCEDURAL HUMAN BODY & SKELETON ANATOMY BUILDER
// =========================================================================

function buildHumanBodyAnatomy(
  parent: THREE.Group,
  system: BodySystemType,
  meshMap: Map<string, THREE.Object3D>,
  breathingRef: React.MutableRefObject<THREE.Group | null>,
  heartRef: React.MutableRefObject<THREE.Group | null>,
  bloodRef: React.MutableRefObject<THREE.Points | null>,
  foodRef: React.MutableRefObject<THREE.Points | null>
) {
  // 1. Translucent Holographic Body Silhouette (Reference Layer)
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x0ea5e9,
    transparent: true,
    opacity: system === "skeletal" ? 0.12 : 0.22,
    roughness: 0.3,
    metalness: 0.2,
    wireframe: false,
  });

  const torsoGeo = new THREE.CylinderGeometry(0.8, 0.65, 2.2, 16);
  const torsoMesh = new THREE.Mesh(torsoGeo, bodyMat);
  torsoMesh.position.set(0, 1.8, 0);
  parent.add(torsoMesh);

  // 2. SKELETAL SYSTEM MESHES
  const boneMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.4,
    metalness: 0.15,
  });

  // Skull & Cranium
  const skullGeo = new THREE.SphereGeometry(0.55, 20, 16);
  const skullMesh = new THREE.Mesh(skullGeo, boneMat.clone());
  skullMesh.position.set(0, 3.4, 0);
  skullMesh.userData = { structureId: "skull" };
  parent.add(skullMesh);
  meshMap.set("skull", skullMesh);

  // Mandible (Jaw)
  const mandibleGeo = new THREE.BoxGeometry(0.45, 0.25, 0.35);
  const mandibleMesh = new THREE.Mesh(mandibleGeo, boneMat.clone());
  mandibleMesh.position.set(0, 3.05, 0.25);
  mandibleMesh.userData = { structureId: "mandible" };
  parent.add(mandibleMesh);
  meshMap.set("mandible", mandibleMesh);

  // Clavicles
  [-1, 1].forEach((side) => {
    const clavicleGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.75, 8);
    const clavicleMesh = new THREE.Mesh(clavicleGeo, boneMat.clone());
    clavicleMesh.rotation.z = side * 1.25;
    clavicleMesh.position.set(side * 0.45, 2.75, 0.15);
    clavicleMesh.userData = { structureId: "clavicle" };
    parent.add(clavicleMesh);
    if (side === 1) meshMap.set("clavicle", clavicleMesh);
  });

  // Scapula (Shoulder Blades)
  [-1, 1].forEach((side) => {
    const scapulaGeo = new THREE.BoxGeometry(0.35, 0.5, 0.06);
    const scapulaMesh = new THREE.Mesh(scapulaGeo, boneMat.clone());
    scapulaMesh.position.set(side * 0.65, 2.5, -0.35);
    scapulaMesh.userData = { structureId: "scapula" };
    parent.add(scapulaMesh);
    if (side === 1) meshMap.set("scapula", scapulaMesh);
  });

  // Sternum (Breastbone)
  const sternumGeo = new THREE.BoxGeometry(0.18, 0.9, 0.08);
  const sternumMesh = new THREE.Mesh(sternumGeo, boneMat.clone());
  sternumMesh.position.set(0, 2.3, 0.4);
  sternumMesh.userData = { structureId: "sternum" };
  parent.add(sternumMesh);
  meshMap.set("sternum", sternumMesh);

  // Rib Cage
  const ribGroup = new THREE.Group();
  for (let i = 0; i < 7; i++) {
    const radius = 0.55 - i * 0.03;
    const ringGeo = new THREE.TorusGeometry(radius, 0.03, 8, 24, Math.PI * 1.8);
    const ribMesh = new THREE.Mesh(ringGeo, boneMat.clone());
    ribMesh.rotation.x = Math.PI / 2;
    ribMesh.position.set(0, 2.6 - i * 0.12, 0.05);
    ribGroup.add(ribMesh);
  }
  ribGroup.userData = { structureId: "ribs" };
  parent.add(ribGroup);
  meshMap.set("ribs", ribGroup);

  // Vertebral Column (Spine)
  const spineGroup = new THREE.Group();
  for (let i = 0; i < 18; i++) {
    const vertGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.07, 8);
    const vertMesh = new THREE.Mesh(vertGeo, boneMat.clone());
    vertMesh.position.set(0, 2.9 - i * 0.11, -0.28);
    spineGroup.add(vertMesh);
  }
  spineGroup.userData = { structureId: "vertebral_column" };
  parent.add(spineGroup);
  meshMap.set("vertebral_column", spineGroup);

  // Humerus (Arms)
  [-1, 1].forEach((side) => {
    const humerusGeo = new THREE.CylinderGeometry(0.08, 0.07, 1.1, 8);
    const humerusMesh = new THREE.Mesh(humerusGeo, boneMat.clone());
    humerusMesh.position.set(side * 1.25, 2.1, 0.05);
    humerusMesh.userData = { structureId: "humerus" };
    parent.add(humerusMesh);
    if (side === 1) meshMap.set("humerus", humerusMesh);

    // Radius & Ulna
    const forearmGeo = new THREE.CylinderGeometry(0.06, 0.05, 1.0, 8);
    const forearmMesh = new THREE.Mesh(forearmGeo, boneMat.clone());
    forearmMesh.position.set(side * 1.45, 1.1, 0.15);
    forearmMesh.userData = { structureId: "radius_ulna" };
    parent.add(forearmMesh);
    if (side === 1) meshMap.set("radius_ulna", forearmMesh);
  });

  // Pelvis Girdle
  const pelvisGeo = new THREE.TorusGeometry(0.55, 0.2, 8, 16, Math.PI);
  const pelvisMesh = new THREE.Mesh(pelvisGeo, boneMat.clone());
  pelvisMesh.rotation.x = Math.PI / 2;
  pelvisMesh.position.set(0, 0.85, 0);
  pelvisMesh.userData = { structureId: "pelvis" };
  parent.add(pelvisMesh);
  meshMap.set("pelvis", pelvisMesh);

  // Femur (Thigh Bones)
  [-1, 1].forEach((side) => {
    const femurGeo = new THREE.CylinderGeometry(0.12, 0.1, 1.4, 10);
    const femurMesh = new THREE.Mesh(femurGeo, boneMat.clone());
    femurMesh.position.set(side * 0.45, -0.1, 0.05);
    femurMesh.userData = { structureId: "femur" };
    parent.add(femurMesh);
    if (side === 1) meshMap.set("femur", femurMesh);

    // Patella (Kneecap)
    const patellaGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const patellaMesh = new THREE.Mesh(patellaGeo, boneMat.clone());
    patellaMesh.position.set(side * 0.45, -0.85, 0.18);
    patellaMesh.userData = { structureId: "patella" };
    parent.add(patellaMesh);
    if (side === 1) meshMap.set("patella", patellaMesh);

    // Tibia & Fibula (Lower Leg)
    const tibiaGeo = new THREE.CylinderGeometry(0.1, 0.08, 1.3, 8);
    const tibiaMesh = new THREE.Mesh(tibiaGeo, boneMat.clone());
    tibiaMesh.position.set(side * 0.45, -1.6, 0.05);
    tibiaMesh.userData = { structureId: "tibia_fibula" };
    parent.add(tibiaMesh);
    if (side === 1) meshMap.set("tibia_fibula", tibiaMesh);
  });

  // 3. CIRCULATORY SYSTEM & HEART (4 Chambers & Great Vessels)
  if (system === "circulatory" || system === "muscular") {
    const heartGroup = new THREE.Group();
    heartRef.current = heartGroup;

    // Left Ventricle (Thick Myocardium)
    const lvGeo = new THREE.ConeGeometry(0.28, 0.45, 12);
    const lvMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.3 });
    const lvMesh = new THREE.Mesh(lvGeo, lvMat);
    lvMesh.rotation.z = 0.2;
    lvMesh.position.set(-0.15, -0.1, 0);
    lvMesh.userData = { structureId: "left_ventricle" };
    heartGroup.add(lvMesh);
    meshMap.set("left_ventricle", lvMesh);

    // Right Ventricle
    const rvGeo = new THREE.ConeGeometry(0.24, 0.4, 12);
    const rvMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.3 });
    const rvMesh = new THREE.Mesh(rvGeo, rvMat);
    rvMesh.rotation.z = -0.15;
    rvMesh.position.set(0.15, -0.08, 0.05);
    rvMesh.userData = { structureId: "right_ventricle" };
    heartGroup.add(rvMesh);
    meshMap.set("right_ventricle", rvMesh);

    // Right Atrium
    const raGeo = new THREE.SphereGeometry(0.2, 12, 12);
    const raMesh = new THREE.Mesh(raGeo, rvMat);
    raMesh.position.set(0.22, 0.2, 0.05);
    raMesh.userData = { structureId: "right_atrium" };
    heartGroup.add(raMesh);
    meshMap.set("right_atrium", raMesh);

    // Left Atrium
    const laGeo = new THREE.SphereGeometry(0.2, 12, 12);
    const laMesh = new THREE.Mesh(laGeo, lvMat);
    laMesh.position.set(-0.2, 0.2, 0);
    laMesh.userData = { structureId: "left_atrium" };
    heartGroup.add(laMesh);
    meshMap.set("left_atrium", laMesh);

    // Systemic Aorta Arch
    const aortaGeo = new THREE.TorusGeometry(0.25, 0.07, 8, 16, Math.PI);
    const aortaMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.2 });
    const aortaMesh = new THREE.Mesh(aortaGeo, aortaMat);
    aortaMesh.rotation.y = Math.PI / 6;
    aortaMesh.position.set(0, 0.35, 0);
    aortaMesh.userData = { structureId: "aorta" };
    heartGroup.add(aortaMesh);
    meshMap.set("aorta", aortaMesh);

    heartGroup.position.set(-0.1, 2.2, 0.25);
    heartGroup.userData = { structureId: "heart" };
    parent.add(heartGroup);
    meshMap.set("heart", heartGroup);
  }

  // 4. RESPIRATORY SYSTEM & LUNGS
  if (system === "respiratory") {
    const lungGroup = new THREE.Group();
    breathingRef.current = lungGroup;

    const lungMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.85,
      roughness: 0.4,
    });

    [-1, 1].forEach((side) => {
      const lungGeo = new THREE.CapsuleGeometry(0.35, 0.7, 12, 12);
      const lungMesh = new THREE.Mesh(lungGeo, lungMat);
      lungMesh.position.set(side * 0.48, 0, 0);
      lungGroup.add(lungMesh);
    });

    // Trachea with Cartilaginous Rings
    const tracheaGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.7, 12);
    const tracheaMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3 });
    const tracheaMesh = new THREE.Mesh(tracheaGeo, tracheaMat);
    tracheaMesh.position.set(0, 0.6, 0);
    lungGroup.add(tracheaMesh);

    lungGroup.position.set(0, 2.2, 0.1);
    lungGroup.userData = { structureId: "lungs" };
    parent.add(lungGroup);
    meshMap.set("lungs", lungGroup);
  }

  // 5. DIGESTIVE SYSTEM & STOMACH
  if (system === "digestive") {
    const digestiveGroup = new THREE.Group();

    // Stomach (J-Shape)
    const stomachGeo = new THREE.TorusGeometry(0.3, 0.15, 8, 16, Math.PI * 1.3);
    const stomachMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 });
    const stomachMesh = new THREE.Mesh(stomachGeo, stomachMat);
    stomachMesh.position.set(-0.25, 1.4, 0.25);
    stomachMesh.userData = { structureId: "stomach" };
    digestiveGroup.add(stomachMesh);
    meshMap.set("stomach", stomachMesh);

    // Liver
    const liverGeo = new THREE.BoxGeometry(0.65, 0.4, 0.3);
    const liverMat = new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.5 });
    const liverMesh = new THREE.Mesh(liverGeo, liverMat);
    liverMesh.position.set(0.4, 1.45, 0.25);
    liverMesh.userData = { structureId: "liver" };
    digestiveGroup.add(liverMesh);
    meshMap.set("liver", liverMesh);

    // Small Intestine Convolutions
    const intestineGeo = new THREE.TorusKnotGeometry(0.35, 0.08, 48, 8);
    const intestineMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.5 });
    const intestineMesh = new THREE.Mesh(intestineGeo, intestineMat);
    intestineMesh.position.set(0, 0.8, 0.3);
    intestineMesh.userData = { structureId: "small_intestine" };
    digestiveGroup.add(intestineMesh);
    meshMap.set("small_intestine", intestineMesh);

    parent.add(digestiveGroup);
  }

  // 6. NERVOUS SYSTEM & BRAIN LOBES
  if (system === "nervous") {
    const brainGroup = new THREE.Group();

    // Cerebrum (Hemispheres)
    const cerebrumGeo = new THREE.SphereGeometry(0.48, 16, 16);
    const cerebrumMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.35 });
    const cerebrumMesh = new THREE.Mesh(cerebrumGeo, cerebrumMat);
    cerebrumMesh.scale.set(1.0, 0.85, 1.15);
    cerebrumMesh.position.set(0, 3.5, 0.05);
    cerebrumMesh.userData = { structureId: "brain_cerebrum" };
    brainGroup.add(cerebrumMesh);
    meshMap.set("brain_cerebrum", cerebrumMesh);

    // Cerebellum
    const cerebellumGeo = new THREE.SphereGeometry(0.24, 12, 12);
    const cerebellumMat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.4 });
    const cerebellumMesh = new THREE.Mesh(cerebellumGeo, cerebellumMat);
    cerebellumMesh.position.set(0, 3.15, -0.28);
    cerebellumMesh.userData = { structureId: "brain_cerebellum" };
    brainGroup.add(cerebellumMesh);
    meshMap.set("brain_cerebellum", cerebellumMesh);

    // Brainstem & Spinal Cord
    const brainstemGeo = new THREE.CylinderGeometry(0.08, 0.06, 1.8, 8);
    const brainstemMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.3 });
    const brainstemMesh = new THREE.Mesh(brainstemGeo, brainstemMat);
    brainstemMesh.position.set(0, 2.5, -0.2);
    brainstemMesh.userData = { structureId: "brainstem" };
    brainGroup.add(brainstemMesh);
    meshMap.set("brainstem", brainstemMesh);

    parent.add(brainGroup);
  }
}

// =========================================================================
// PROCEDURAL MICROSCOPIC CELL LAB BUILDER
// =========================================================================

function buildCellLab(
  parent: THREE.Group,
  cellType: CellType,
  meshMap: Map<string, THREE.Object3D>
) {
  // 1. Cell Membrane / Outer Shell
  const membraneGeo =
    cellType === "plant_cell"
      ? new THREE.BoxGeometry(3.2, 2.4, 2.2)
      : new THREE.SphereGeometry(1.7, 24, 24);

  const membraneMat = new THREE.MeshStandardMaterial({
    color: cellType === "plant_cell" ? 0x10b981 : 0x06b6d4,
    transparent: true,
    opacity: 0.28,
    roughness: 0.2,
    metalness: 0.1,
  });

  const membraneMesh = new THREE.Mesh(membraneGeo, membraneMat);
  membraneMesh.userData = { structureId: "plasma_membrane" };
  parent.add(membraneMesh);
  meshMap.set("plasma_membrane", membraneMesh);

  // Plant Cell Wall
  if (cellType === "plant_cell") {
    const wallGeo = new THREE.BoxGeometry(3.5, 2.7, 2.5);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x059669,
      transparent: true,
      opacity: 0.2,
      wireframe: true,
    });
    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    wallMesh.userData = { structureId: "cell_wall" };
    parent.add(wallMesh);
    meshMap.set("cell_wall", wallMesh);
  }

  // 2. Nucleus (Genetic Core)
  const nucleusGeo = new THREE.SphereGeometry(0.55, 16, 16);
  const nucleusMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.35 });
  const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
  nucleusMesh.position.set(0, 0, 0);
  nucleusMesh.userData = { structureId: "nucleus" };
  parent.add(nucleusMesh);
  meshMap.set("nucleus", nucleusMesh);

  // 3. Mitochondria (Powerhouses)
  [-1, 1].forEach((side, idx) => {
    const mitoGeo = new THREE.CapsuleGeometry(0.18, 0.45, 8, 8);
    const mitoMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.3 });
    const mitoMesh = new THREE.Mesh(mitoGeo, mitoMat);
    mitoMesh.rotation.z = side * 0.8;
    mitoMesh.position.set(side * 1.1, 0.5 + idx * 0.2, 0.3);
    mitoMesh.userData = { structureId: "mitochondria" };
    parent.add(mitoMesh);
    if (idx === 0) meshMap.set("mitochondria", mitoMesh);
  });

  // 4. Chloroplasts (Plant cell only)
  if (cellType === "plant_cell") {
    for (let i = 0; i < 3; i++) {
      const chloroGeo = new THREE.SphereGeometry(0.24, 12, 12);
      const chloroMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.3 });
      const chloroMesh = new THREE.Mesh(chloroGeo, chloroMat);
      chloroMesh.scale.set(1.2, 0.8, 1.0);
      chloroMesh.position.set(-1.1 + i * 0.7, 0.7 - i * 0.3, -0.4);
      chloroMesh.userData = { structureId: "chloroplast" };
      parent.add(chloroMesh);
      if (i === 0) meshMap.set("chloroplast", chloroMesh);
    }

    // Large Central Vacuole
    const vacuoleGeo = new THREE.SphereGeometry(0.7, 16, 16);
    const vacuoleMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
    });
    const vacuoleMesh = new THREE.Mesh(vacuoleGeo, vacuoleMat);
    vacuoleMesh.position.set(0.3, -0.5, 0.2);
    vacuoleMesh.userData = { structureId: "vacuole" };
    parent.add(vacuoleMesh);
    meshMap.set("vacuole", vacuoleMesh);
  }

  // 5. Endoplasmic Reticulum (Curved Ribbons)
  const erGeo = new THREE.TorusGeometry(0.8, 0.1, 8, 16, Math.PI * 1.2);
  const erMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.4 });
  const erMesh = new THREE.Mesh(erGeo, erMat);
  erMesh.position.set(-0.4, -0.4, 0.3);
  erMesh.userData = { structureId: "endoplasmic_reticulum" };
  parent.add(erMesh);
  meshMap.set("endoplasmic_reticulum", erMesh);

  // 6. Golgi Apparatus
  const golgiGeo = new THREE.TorusGeometry(0.45, 0.08, 8, 16, Math.PI);
  const golgiMat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.3 });
  const golgiMesh = new THREE.Mesh(golgiGeo, golgiMat);
  golgiMesh.position.set(0.8, -0.7, -0.3);
  golgiMesh.userData = { structureId: "golgi_apparatus" };
  parent.add(golgiMesh);
  meshMap.set("golgi_apparatus", golgiMesh);
}

// =========================================================================
// 3D BILLBOARD HOTSPOT LABELS
// =========================================================================

function buildHotspotLabels(
  parent: THREE.Group,
  viewMode: LabViewMode,
  cellType: CellType,
  system: BodySystemType
) {
  while (parent.children.length > 0) {
    parent.remove(parent.children[0]);
  }

  const items =
    viewMode === "cell_lab"
      ? CELL_ORGANELLES.filter(
          (o) => o.cellType === "both" || o.cellType === (cellType === "animal_cell" ? "animal" : "plant")
        )
      : ANATOMICAL_STRUCTURES.filter((s) => s.system === system);

  items.forEach((item) => {
    const [x, y, z] = item.coordinates;

    // Glowing anchor marker sphere
    const markerGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const markerMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const markerMesh = new THREE.Mesh(markerGeo, markerMat);
    markerMesh.position.set(x, y, z);
    parent.add(markerMesh);

    // Glowing pulsing outer ring
    const ringGeo = new THREE.RingGeometry(0.08, 0.12, 16);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.set(x, y, z);
    parent.add(ringMesh);
  });
}
