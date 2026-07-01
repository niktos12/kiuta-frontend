"use client";

import { useRef, useMemo, useEffect, Suspense, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";

/* ─── Custom bipyramidal crystal geometry (7 segments) ─── */
function createCrystalGeometry(scale = 1) {
  const segments = 7;
  const vertices: number[] = [];
  const indices: number[] = [];
  const normals: number[] = [];

  const topApexY = 1.7 * scale;
  const girdleY = 0.1 * scale;
  const bottomApexY = -1.2 * scale;
  const girdleRadius = 0.78 * scale;

  const girdleTop: THREE.Vector3[] = [];
  const girdleBot: THREE.Vector3[] = [];

  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const x = Math.cos(angle) * girdleRadius;
    const z = Math.sin(angle) * girdleRadius;
    girdleTop.push(new THREE.Vector3(x, girdleY + 0.04 * scale, z));
    girdleBot.push(new THREE.Vector3(x, girdleY - 0.04 * scale, z));
  }

  const topApex = new THREE.Vector3(0, topApexY, 0);
  const bottomApex = new THREE.Vector3(0, bottomApexY, 0);

  const addTriangle = (
    a: THREE.Vector3,
    b: THREE.Vector3,
    c: THREE.Vector3,
  ) => {
    const idx = vertices.length / 3;
    vertices.push(a.x, a.y, a.z);
    vertices.push(b.x, b.y, b.z);
    vertices.push(c.x, c.y, c.z);

    const normal = new THREE.Vector3()
      .crossVectors(
        new THREE.Vector3().subVectors(b, a),
        new THREE.Vector3().subVectors(c, a),
      )
      .normalize();
    normals.push(normal.x, normal.y, normal.z);
    normals.push(normal.x, normal.y, normal.z);
    normals.push(normal.x, normal.y, normal.z);

    indices.push(idx, idx + 1, idx + 2);
  };

  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    addTriangle(topApex, girdleTop[i], girdleTop[next]);
  }

  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    addTriangle(girdleBot[i], bottomApex, girdleBot[next]);
  }

  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    addTriangle(girdleTop[i], girdleTop[next], girdleBot[next]);
    addTriangle(girdleTop[i], girdleBot[next], girdleBot[i]);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  );
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

/* ─── Inner tinted layer — gives depth + visible color ─── */
function CrystalInner() {
  const ref = useRef<THREE.Mesh>(null!);
  const geo = useMemo(() => createCrystalGeometry(0.85), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.y = Math.sin(t * 0.3) * 0.08;
    const pulse = 0.18 + Math.sin(t * 0.6) * 0.06;
    (ref.current.material as THREE.MeshPhysicalMaterial).opacity = pulse;
  });

  return (
    <mesh ref={ref} geometry={geo}>
      <meshPhysicalMaterial
        color="#c8d0e8"
        transparent
        opacity={0.18}
        roughness={0.15}
        metalness={0.05}
        transmission={0.3}
        thickness={1.5}
        ior={1.8}
        iridescence={1.0}
        iridescenceIOR={1.6}
        iridescenceThicknessRange={[100, 600]}
        envMapIntensity={2}
        side={THREE.FrontSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* ─── Inner glow core ─── */
function CrystalCore() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.scale.setScalar(0.5 + Math.sin(t * 0.9) * 0.06);
    (meshRef.current.material as THREE.MeshBasicMaterial).opacity =
      0.12 + Math.sin(t * 0.5) * 0.05;
  });

  return (
    <mesh ref={meshRef} scale={0.5}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial
        color="#d8c8f0"
        transparent
        opacity={0.12}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ─── Edge highlights ─── */
function CrystalEdges({ geometry }: { geometry: THREE.BufferGeometry }) {
  const ref = useRef<THREE.LineSegments>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    (ref.current.material as THREE.LineBasicMaterial).opacity =
      0.18 + Math.sin(t * 0.7) * 0.06;
  });

  return (
    <lineSegments ref={ref}>
      <edgesGeometry args={[geometry]} />
      <lineBasicMaterial
        color="#e0d8f0"
        transparent
        opacity={0.18}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

/* ─── Main crystal — visible body with strong iridescence ─── */
function CrystalMesh() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const geo = useMemo(() => createCrystalGeometry(1), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const s = 1 + Math.sin(t * 0.45) * 0.008;
    meshRef.current.scale.set(1, s, 1);
    meshRef.current.rotation.y += 0.003;
  });

  return (
    <group>
      <mesh ref={meshRef} geometry={geo}>
        <meshPhysicalMaterial
          color="#dce0ec"
          transmission={0.45}
          roughness={0.08}
          metalness={0.05}
          thickness={3.0}
          ior={2.4}
          reflectivity={1.0}
          iridescence={1.0}
          iridescenceIOR={1.5}
          iridescenceThicknessRange={[80, 500]}
          envMapIntensity={6}
          attenuationColor="#b0a8c8"
          attenuationDistance={0.8}
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
          specularIntensity={1.0}
          specularColor="#f0ecff"
          clearcoat={0.5}
          clearcoatRoughness={0.05}
        />
      </mesh>
      <CrystalInner />
      <CrystalEdges geometry={geo} />
      <CrystalCore />
    </group>
  );
}

/* ─── Camera rig ─── */
function CameraRig({
  mouse,
}: {
  mouse: React.MutableRefObject<[number, number]>;
}) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0.3, 5.2));
  const targetLook = useRef(new THREE.Vector3(0, 0.2, 0));

  useFrame(() => {
    targetPos.current.x +=
      (mouse.current[0] * 1.2 - targetPos.current.x) * 0.04;
    targetPos.current.y +=
      (0.3 + mouse.current[1] * 0.7 - targetPos.current.y) * 0.04;
    camera.position.lerp(targetPos.current, 0.06);
    camera.lookAt(targetLook.current);
  });

  return null;
}

/* ─── Floating particles ─── */
function DustParticles() {
  const count = 24;
  const ref = useRef<THREE.Points>(null!);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 1.0 + Math.random() * 1.4;
      pos[i * 3] = Math.cos(theta) * r;
      pos[i * 3 + 1] = (Math.random() - 0.3) * 3.0;
      pos[i * 3 + 2] = Math.sin(theta) * r;
    }
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const posArr = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      posArr[i * 3 + 1] += Math.sin(t * 0.35 + i * 1.7) * 0.001;
    }
    geo.attributes.position.needsUpdate = true;
    (ref.current.material as THREE.PointsMaterial).opacity =
      0.25 + Math.sin(t * 0.25) * 0.1;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        color="#e0d8f8"
        size={0.03}
        transparent
        opacity={0.25}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/* ─── Full scene ─── */
function CrystalScene({
  mouse,
}: {
  mouse: React.MutableRefObject<[number, number]>;
}) {
  return (
    <>
      <CameraRig mouse={mouse} />
      {/* Low ambient — force contrast */}
      <ambientLight intensity={0.15} color="#c8c0d8" />
      {/* Strong key — warm white from top-right */}
      <directionalLight position={[5, 8, 4]} intensity={14} color="#fff5eb" />
      {/* Cool blue fill from opposite */}
      <directionalLight position={[-5, 3, -3]} intensity={5} color="#b0c0e0" />
      {/* Warm rim light — right side */}
      <pointLight
        position={[3, 2, 3]}
        intensity={18}
        color="#ffe0c0"
        decay={2}
      />
      {/* Cool accent — left low */}
      <pointLight
        position={[-3, -1.5, 2]}
        intensity={8}
        color="#c0c8f0"
        decay={2}
      />
      {/* Purple under-glow */}
      <pointLight
        position={[0, -2.5, 0.5]}
        intensity={4}
        color="#c0a0e0"
        decay={1.5}
      />
      <Suspense fallback={null}>
        <Environment preset="city" />
        <Float speed={0.5} rotationIntensity={0.08} floatIntensity={0.15}>
          <CrystalMesh />
        </Float>
        <DustParticles />
      </Suspense>
    </>
  );
}

/* ═══════════════════════════════════════════════════
   Exported component
   ═══════════════════════════════════════════════════ */
export function Crystal3D({
  size = 350,
  className = "",
  color = "rgba(255,255,255,",
  speed = 20,
  interactive = true,
}: {
  size?: number;
  className?: string;
  color?: string;
  speed?: number;
  interactive?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse = useRef<[number, number]>([0, 0]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!interactive || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouse.current = [
        ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        ((e.clientY - rect.top) / rect.height - 0.5) * 2,
      ];
    },
    [interactive],
  );

  const handleMouseLeave = useCallback(() => {
    mouse.current = [0, 0];
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <div
      ref={containerRef}
      className={`crystal-container ${className}`}
      style={{ width: size, height: size * 1.4 }}
    >
      <Canvas
        camera={{ position: [0, 0.3, 5.2], fov: 40 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
        dpr={[1, 2]}
      >
        <CrystalScene mouse={mouse} />
      </Canvas>
    </div>
  );
}

/* ─── Mini Crystal (for badges, icons) ─── */
/* ─── Mini Crystal (for badges, icons) ─── */
export function CrystalIcon({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {/* Верхняя часть (корона) */}
      <path
        d="M12 2L4 10L12 12L20 10Z"
        fill="rgba(200,192,224,0.1)"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      {/* Нижняя часть (павильон) */}
      <path
        d="M4 10L12 12L20 10L12 22Z"
        fill="rgba(180,172,216,0.05)"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      {/* Горизонтальная линия пояса */}
      <line
        x1="4"
        y1="10"
        x2="20"
        y2="10"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.4"
      />
      {/* Вертикальная ось (лёгкая тень) */}
      <line
        x1="12"
        y1="2"
        x2="12"
        y2="22"
        stroke="currentColor"
        strokeWidth="0.4"
        opacity="0.2"
      />
    </svg>
  );
}

/* ─── Crystal Section Wrapper ─── */
export function CrystalSection({
  children,
  className = "",
  crystalPosition = "right",
}: {
  children: React.ReactNode;
  className?: string;
  crystalPosition?: "left" | "right" | "center";
}) {
  return (
    <section className={`relative overflow-hidden ${className}`}>
      <div
        className={`absolute top-1/2 -translate-y-1/2 pointer-events-none opacity-50 ${
          crystalPosition === "left"
            ? "-left-32 md:left-8"
            : crystalPosition === "right"
              ? "-right-32 md:right-8"
              : "left-1/2 -translate-x-1/2 opacity-30"
        }`}
      >
        <Crystal3D size={280} interactive={true} speed={30} />
      </div>
      {children}
    </section>
  );
}
