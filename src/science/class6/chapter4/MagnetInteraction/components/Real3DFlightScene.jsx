import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, Html } from "@react-three/drei";
import * as THREE from "three";

// Realistic 3D Airliner Component
function RealisticAirliner({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0],
  poleLeft = "N", 
  poleRight = "S",
  isNitro = false,
  isColliding = false,
  engineGlowColor = "#60A5FA"
}) {
  const groupRef = useRef();

  const leftColor = poleLeft === "N" ? "#DC2626" : "#2563EB";
  const rightColor = poleRight === "N" ? "#DC2626" : "#2563EB";

  // Shared Realistic PBR Materials
  const materials = useMemo(() => {
    return {
      fuselage: new THREE.MeshStandardMaterial({
        color: "#F8FAFC",
        metalness: 0.75,
        roughness: 0.22,
        clearcoat: 0.5,
        clearcoatRoughness: 0.1
      }),
      cockpit: new THREE.MeshStandardMaterial({
        color: "#090D16",
        metalness: 0.95,
        roughness: 0.05
      }),
      chrome: new THREE.MeshStandardMaterial({
        color: "#CBD5E1",
        metalness: 0.98,
        roughness: 0.1
      }),
      engineIntake: new THREE.MeshStandardMaterial({
        color: "#0F172A",
        metalness: 0.8,
        roughness: 0.4
      }),
      exhaustGlow: new THREE.MeshBasicMaterial({
        color: isNitro ? "#F97316" : "#38BDF8"
      }),
      leftWingMat: new THREE.MeshStandardMaterial({
        color: leftColor,
        metalness: 0.5,
        roughness: 0.35,
        emissive: leftColor,
        emissiveIntensity: 0.25
      }),
      rightWingMat: new THREE.MeshStandardMaterial({
        color: rightColor,
        metalness: 0.5,
        roughness: 0.35,
        emissive: rightColor,
        emissiveIntensity: 0.25
      }),
      wingTrim: new THREE.MeshStandardMaterial({
        color: "#E2E8F0",
        metalness: 0.8,
        roughness: 0.2
      })
    };
  }, [leftColor, rightColor, isNitro]);

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={0.75}>
      {/* 1. FUSELAGE MAIN BODY */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.fuselage} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.45, 6.2, 32]} />
      </mesh>

      {/* Nose Cone */}
      <mesh position={[0, 0, 3.8]} rotation={[Math.PI / 2, 0, 0]} material={materials.fuselage} castShadow>
        <coneGeometry args={[0.5, 1.4, 32]} />
      </mesh>

      {/* Cockpit Windshield */}
      <mesh position={[0, 0.35, 3.2]} rotation={[Math.PI / 3.5, 0, 0]} material={materials.cockpit}>
        <boxGeometry args={[0.62, 0.28, 0.55]} />
      </mesh>

      {/* Passenger Window Strips */}
      <mesh position={[0.51, 0.1, 0.4]} material={materials.cockpit}>
        <boxGeometry args={[0.02, 0.08, 4.2]} />
      </mesh>
      <mesh position={[-0.51, 0.1, 0.4]} material={materials.cockpit}>
        <boxGeometry args={[0.02, 0.08, 4.2]} />
      </mesh>

      {/* APU Tail Cone */}
      <mesh position={[0, 0.05, -3.4]} rotation={[-Math.PI / 2, 0, 0]} material={materials.chrome}>
        <coneGeometry args={[0.42, 0.7, 32]} />
      </mesh>

      {/* 2. LEFT MAIN WING (Swept Aerodynamic Airliner Wing) */}
      <group position={[-1.9, -0.05, 0.2]} rotation={[0.04, -0.28, -0.05]}>
        <mesh material={materials.leftWingMat} castShadow>
          <boxGeometry args={[3.2, 0.08, 1.3]} />
        </mesh>
        {/* Left Winglet Tip */}
        <mesh position={[-1.6, 0.3, -0.1]} rotation={[0, 0, Math.PI / 2.8]} material={materials.leftWingMat}>
          <boxGeometry args={[0.65, 0.06, 0.5]} />
        </mesh>
        {/* Left Wing Pole Label */}
        <Html position={[0, 0.15, 0]} transform rotation={[-Math.PI / 2, 0, 0]} center>
          <div style={{
            background: "#FFFFFF",
            color: leftColor,
            fontWeight: 900,
            fontSize: "14px",
            padding: "2px 8px",
            borderRadius: "6px",
            border: `2px solid ${leftColor}`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            userSelect: "none"
          }}>
            {poleLeft} POLE
          </div>
        </Html>
      </group>

      {/* 3. RIGHT MAIN WING (Swept Aerodynamic Airliner Wing) */}
      <group position={[1.9, -0.05, 0.2]} rotation={[0.04, 0.28, 0.05]}>
        <mesh material={materials.rightWingMat} castShadow>
          <boxGeometry args={[3.2, 0.08, 1.3]} />
        </mesh>
        {/* Right Winglet Tip */}
        <mesh position={[1.6, 0.3, -0.1]} rotation={[0, 0, -Math.PI / 2.8]} material={materials.rightWingMat}>
          <boxGeometry args={[0.65, 0.06, 0.5]} />
        </mesh>
        {/* Right Wing Pole Label */}
        <Html position={[0, 0.15, 0]} transform rotation={[-Math.PI / 2, 0, 0]} center>
          <div style={{
            background: "#FFFFFF",
            color: rightColor,
            fontWeight: 900,
            fontSize: "14px",
            padding: "2px 8px",
            borderRadius: "6px",
            border: `2px solid ${rightColor}`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            userSelect: "none"
          }}>
            {poleRight} POLE
          </div>
        </Html>
      </group>

      {/* 4. JET TURBOFAN ENGINES */}
      {/* Left Engine */}
      <group position={[-1.4, -0.42, 0.6]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.chrome} castShadow>
          <cylinderGeometry args={[0.3, 0.28, 1.4, 24]} />
        </mesh>
        {/* Fan Intake */}
        <mesh position={[0, 0, 0.72]} rotation={[Math.PI / 2, 0, 0]} material={materials.engineIntake}>
          <circleGeometry args={[0.27, 24]} />
        </mesh>
        {/* Exhaust Afterburner Glow */}
        <mesh position={[0, 0, -0.72]} rotation={[-Math.PI / 2, 0, 0]} material={materials.exhaustGlow}>
          <circleGeometry args={[0.24, 24]} />
        </mesh>
      </group>

      {/* Right Engine */}
      <group position={[1.4, -0.42, 0.6]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.chrome} castShadow>
          <cylinderGeometry args={[0.3, 0.28, 1.4, 24]} />
        </mesh>
        {/* Fan Intake */}
        <mesh position={[0, 0, 0.72]} rotation={[Math.PI / 2, 0, 0]} material={materials.engineIntake}>
          <circleGeometry args={[0.27, 24]} />
        </mesh>
        {/* Exhaust Afterburner Glow */}
        <mesh position={[0, 0, -0.72]} rotation={[-Math.PI / 2, 0, 0]} material={materials.exhaustGlow}>
          <circleGeometry args={[0.24, 24]} />
        </mesh>
      </group>

      {/* 5. HORIZONTAL TAIL ELEVATORS */}
      <group position={[0, 0.35, -2.9]}>
        {/* Left Elevator */}
        <mesh position={[-1.1, 0, 0]} rotation={[0, -0.22, 0]} material={materials.wingTrim}>
          <boxGeometry args={[1.5, 0.05, 0.7]} />
        </mesh>
        {/* Right Elevator */}
        <mesh position={[1.1, 0, 0]} rotation={[0, 0.22, 0]} material={materials.wingTrim}>
          <boxGeometry args={[1.5, 0.05, 0.7]} />
        </mesh>
      </group>

      {/* 6. VERTICAL STABILIZER (Tail Fin) */}
      <group position={[0, 1.1, -2.6]} rotation={[-0.45, 0, 0]}>
        <mesh material={materials.fuselage} castShadow>
          <boxGeometry args={[0.08, 1.5, 0.9]} />
        </mesh>
        {/* Tail Fin Strobe Beacon */}
        <mesh position={[0, 0.8, -0.2]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial color="#EF4444" />
        </mesh>
      </group>
    </group>
  );
}

// 3D Moving Cloud Carpet Environment
function CloudCarpet({ isNitro }) {
  const cloudsRef = useRef();

  useFrame((_, delta) => {
    if (cloudsRef.current) {
      cloudsRef.current.position.z += (isNitro ? 18 : 6) * delta;
      if (cloudsRef.current.position.z > 20) {
        cloudsRef.current.position.z = -20;
      }
    }
  });

  const cloudPuffs = useMemo(() => {
    return Array.from({ length: 35 }, (_, i) => ({
      x: (Math.random() - 0.5) * 45,
      y: -4.5 + Math.random() * 1.5,
      z: (Math.random() - 0.5) * 60,
      scale: 2.2 + Math.random() * 3.5,
      opacity: 0.45 + Math.random() * 0.4
    }));
  }, []);

  return (
    <group ref={cloudsRef}>
      {cloudPuffs.map((c, i) => (
        <mesh key={i} position={[c.x, c.y, c.z]} scale={c.scale}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial 
            color="#FFFFFF" 
            transparent 
            opacity={c.opacity} 
            roughness={0.9} 
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

// 3D Flight Arena Manager
function FlightArena({ interactionMode, isAutoFastRace, polesMatch }) {
  const planeAGroup = useRef();
  const planeBGroup = useRef();

  const facingWingA = "S";
  const facingWingB = interactionMode === "same" ? "S" : "N";

  const planeAPoleLeft = "N";
  const planeAPoleRight = "S";
  const planeBPoleLeft = interactionMode === "same" ? "S" : "N";
  const planeBPoleRight = planeBPoleLeft === "N" ? "S" : "N";

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const speedMult = isAutoFastRace ? 2.5 : 1.0;

    // Atmospheric micro floating
    const floatA = Math.sin(time * 1.8) * 0.15;
    const floatB = Math.cos(time * 1.6) * 0.15;

    if (planeAGroup.current && planeBGroup.current) {
      if (polesMatch) {
        // SAME POLES (REPEL): Wide corridor separation & outward banking
        const targetAX = -4.2;
        const targetBX = 4.2;
        const targetRollA = -0.22; // Bank left
        const targetRollB = 0.22;  // Bank right

        planeAGroup.current.position.x = THREE.MathUtils.damp(planeAGroup.current.position.x, targetAX, 3.5, delta);
        planeBGroup.current.position.x = THREE.MathUtils.damp(planeBGroup.current.position.x, targetBX, 3.5, delta);

        planeAGroup.current.rotation.z = THREE.MathUtils.damp(planeAGroup.current.rotation.z, targetRollA, 4, delta);
        planeBGroup.current.rotation.z = THREE.MathUtils.damp(planeBGroup.current.rotation.z, targetRollB, 4, delta);

        planeAGroup.current.position.y = floatA;
        planeBGroup.current.position.y = floatB;
      } else {
        // DIFFERENT POLES (ATTRACT & COLLIDE): Pull inward & contact at center
        const targetAX = -1.35;
        const targetBX = 1.35;
        const targetRollA = 0.18;  // Bank inward
        const targetRollB = -0.18; // Bank inward

        // Impact shudder
        const shudder = (Math.random() - 0.5) * 0.08;

        planeAGroup.current.position.x = THREE.MathUtils.damp(planeAGroup.current.position.x, targetAX, 4, delta) + shudder;
        planeBGroup.current.position.x = THREE.MathUtils.damp(planeBGroup.current.position.x, targetBX, 4, delta) - shudder;

        planeAGroup.current.rotation.z = THREE.MathUtils.damp(planeAGroup.current.rotation.z, targetRollA, 4, delta);
        planeBGroup.current.rotation.z = THREE.MathUtils.damp(planeBGroup.current.rotation.z, targetRollB, 4, delta);

        planeAGroup.current.position.y = floatA + shudder;
        planeBGroup.current.position.y = floatB - shudder;
      }
    }
  });

  return (
    <>
      {/* Dynamic Lighting Setup */}
      <ambientLight intensity={0.65} color="#E0F2FE" />
      <directionalLight 
        position={[8, 14, 10]} 
        intensity={1.8} 
        color="#FEF08A" 
        castShadow 
      />
      <directionalLight 
        position={[-10, 5, -8]} 
        intensity={0.7} 
        color="#FB923C" 
      />
      <pointLight position={[0, -2, 2]} intensity={0.5} color="#38BDF8" />

      {/* Cloud Carpet underneath */}
      <CloudCarpet isNitro={isAutoFastRace} />

      {/* Collision Sparks at Wingtip contact point */}
      {!polesMatch && (
        <group position={[0, 0, 0]}>
          <Sparkles 
            count={60} 
            scale={[2, 1.5, 2]} 
            size={4} 
            speed={3} 
            color="#F59E0B" 
          />
          <Sparkles 
            count={35} 
            scale={[1.5, 1, 1.5]} 
            size={6} 
            speed={4} 
            color="#EF4444" 
          />
        </group>
      )}

      {/* Airplane A (Left Airliner) */}
      <group ref={planeAGroup} position={[-4.2, 0, 0]}>
        <RealisticAirliner 
          poleLeft={planeAPoleLeft} 
          poleRight={planeAPoleRight} 
          isNitro={isAutoFastRace}
          isColliding={!polesMatch}
        />
      </group>

      {/* Airplane B (Right Airliner) */}
      <group ref={planeBGroup} position={[4.2, 0, 0]}>
        <RealisticAirliner 
          poleLeft={planeBPoleLeft} 
          poleRight={planeBPoleRight} 
          isNitro={isAutoFastRace}
          isColliding={!polesMatch}
        />
      </group>
    </>
  );
}

export default function Real3DFlightScene({ interactionMode = "same", isAutoFastRace = false, polesMatch = true }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", borderRadius: "24px" }}>
      <Canvas
        camera={{ position: [0, 6.5, 11], fov: 42 }}
        shadows
        style={{
          background: "linear-gradient(180deg, #0284C7 0%, #0369A1 40%, #0C4A6E 80%, #020617 100%)",
          position: "absolute",
          inset: 0
        }}
      >
        <FlightArena 
          interactionMode={interactionMode} 
          isAutoFastRace={isAutoFastRace} 
          polesMatch={polesMatch} 
        />
      </Canvas>

      {/* Cinematic Vignette */}
      <div 
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: "radial-gradient(ellipse at 50% 35%, transparent 50%, rgba(15, 23, 42, 0.35) 85%, rgba(2, 6, 23, 0.65) 100%)",
          zIndex: 10
        }}
      />
    </div>
  );
}
