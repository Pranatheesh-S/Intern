import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { ContactShadows, Cylinder, Text } from '@react-three/drei';
import * as THREE from 'three';

const WireSegment = ({ p1, p2, radius, color }) => {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const dz = p2[2] - p1[2];
  const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
  if (len === 0) return null;
  const pos = [p1[0] + dx / 2, p1[1] + dy / 2, p1[2] + dz / 2];
  const dir = new THREE.Vector3(dx, dy, dz).normalize();
  const alignAxis = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(alignAxis, dir);
  return (
    <mesh position={pos} quaternion={quaternion} castShadow>
      <cylinderGeometry args={[radius, radius, len, 16]} />
      <meshStandardMaterial color={color} roughness={color === '#ca8a04' ? 0.15 : 0.3} metalness={color === '#ca8a04' ? 0.95 : 0.1} />
    </mesh>
  );
};

const WavyWire = ({ start, end, color = "var(--danger)" }) => {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const dz = end[2] - start[2];
  const points = [start, [start[0] + dx * 0.2, start[1] + dy * 0.2 - 0.3, start[2] + dz * 0.2], [start[0] + dx * 0.5, start[1] + dy * 0.5 - 0.5, start[2] + dz * 0.5], [start[0] + dx * 0.8, start[1] + dy * 0.8 - 0.3, start[2] + dz * 0.8], end];
  return (
    <group>
      {points.map((p, i) => i !== points.length - 1 ? <WireSegment key={i} p1={p} p2={points[i + 1]} radius={0.03} color={color} /> : null)}
    </group>
  );
};



const Compass = ({ position, rotationY }) => {
  const needleRef = useRef();
  useFrame((state, delta) => {
    if (needleRef.current) {
      needleRef.current.rotation.y = THREE.MathUtils.lerp(needleRef.current.rotation.y, rotationY, delta * 5);
    }
  });
  return (
    <group position={position} scale={0.6}>
      <Cylinder args={[1, 1, 0.2, 32]}>
        <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.5} />
      </Cylinder>
      <Cylinder args={[0.9, 0.9, 0.22, 32]}>
        <meshStandardMaterial color="#f8fafc" />
      </Cylinder>
      
      {/* Markings */}
      <group position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <Text position={[0, 0.65, 0]} fontSize={0.25} color="#ef4444" anchorX="center" anchorY="middle" fontWeight="bold">N</Text>
        <Text position={[0, -0.65, 0]} fontSize={0.25} color="#64748b" anchorX="center" anchorY="middle" fontWeight="bold">S</Text>
        <Text position={[0.65, 0, 0]} fontSize={0.25} color="#64748b" anchorX="center" anchorY="middle" fontWeight="bold">E</Text>
        <Text position={[-0.65, 0, 0]} fontSize={0.25} color="#64748b" anchorX="center" anchorY="middle" fontWeight="bold">W</Text>
      </group>

      <group ref={needleRef} position={[0, 0.15, 0]}>
        <mesh position={[0, 0, -0.4]}>
          <boxGeometry args={[0.1, 0.02, 0.8]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        <mesh position={[0, 0, 0.4]}>
          <boxGeometry args={[0.1, 0.02, 0.8]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
        <mesh position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>
    </group>
  );
}

export default function Electromagnet3D({ 
  switchOn = false, 
  turns = 50, 
  cells = 1, 
  material = 'iron',
  showCompass = false,
  reverseBattery = false,
  showFieldLines = false,
  strength = 0
}) {
  const fieldRef = useRef();

  useFrame((state) => {
    if (fieldRef.current && showFieldLines) {
      fieldRef.current.rotation.y += 0.01;
      fieldRef.current.rotation.z += 0.005;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.03;
      fieldRef.current.scale.set(scale, scale, scale);
    }
  });

  const basePermeability = material === 'iron' ? 1.0 : 0.0;
  
  // Compute internal strength if not provided by sandbox (fallback for stage 2)
  const actualStrength = strength > 0 ? strength : switchOn ? (turns / 50) * (cells / 1) * basePermeability : 0;
  
  // Calculate compass needle rotation
  // Neutral: points North (0)
  // If magnetic, points towards/away from poles
  let compass1Rot = 0; // Left end (End A)
  let compass2Rot = 0; // Right end (End B)
  if (switchOn && turns > 0 && cells > 0) {
     const polarity = reverseBattery ? -1 : 1;
     // Base deflection for air core
     const deflection = material === 'iron' ? 1.4 : 0.6; // Radians
     compass1Rot = -deflection * polarity;
     compass2Rot = deflection * polarity;
  }

  // Calculate paper clips actual distance


  // Key Coordinates
  const nailLeft = [-1.4, 1.5, 0];
  const nailRight = [1.2, 1.5, 0];
  
  const batteryCenter = [-0.5, 0, 2.5];
  const batteryNeg = [batteryCenter[0] - (cells - 1) * 0.8 - 0.35, 0, 2.5];
  const batteryPos = [batteryCenter[0] + 0.45, 0, 2.5];
  
  const switchCenter = [2.5, 0, 1.5];
  const switchPin1 = [switchCenter[0], 0.1, switchCenter[2] - 0.6];
  const switchPin2 = [switchCenter[0], 0.1, switchCenter[2] + 0.6];

  const wireColor1 = reverseBattery ? "#eab308" : "#1f2937"; // Left wire
  const wireColor2 = reverseBattery ? "#1f2937" : "#eab308"; // Right wire

  return (
    <group position={[-0.5, -0.5, -1]}>
      {/* Core Assembly */}
      <group position={[0, 1.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        {/* Chart Paper Cylinder (Always) */}
        <Cylinder args={[0.15, 0.15, 3.2, 32]} position={[0, 0, 0]}>
           <meshStandardMaterial color="#fef3c7" roughness={0.9} />
        </Cylinder>

        {/* Iron Nail (Only if material is iron) */}
        {material === 'iron' && (
          <group>
            <Cylinder args={[0.3, 0.3, 0.1, 16]} position={[0, 1.6, 0]}>
              <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
            </Cylinder>
            <Cylinder args={[0.1, 0.1, 3.2, 16]} position={[0, 0, 0]}>
              <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
            </Cylinder>
            <Cylinder args={[0.1, 0.0, 0.3, 16]} position={[0, -1.75, 0]}>
              <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
            </Cylinder>
          </group>
        )}

        {/* Coil Winding */}
        <group position={[0, 0, 0]}>
          {Array.from({ length: turns }).map((_, i) => {
            const yPos = -1.3 + (i * (2.6 / Math.max(1, turns - 1)));
            return (
              <mesh key={i} position={[0, yPos, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.17, 0.03, 8, 24]} />
                <meshStandardMaterial color="#b45309" roughness={0.4} metalness={0.6} />
              </mesh>
            );
          })}
        </group>
      </group>

      {/* Battery (1, 2, or 3 cells) */}
      <group position={batteryCenter}>
        {Array.from({ length: cells }).map((_, i) => {
          // If reversed, the red positive tip faces left instead of right
          const rot = reverseBattery ? Math.PI / 2 : -Math.PI / 2;
          return (
            <group key={i} position={[-i * 0.8, 0, 0]} rotation={[0, 0, rot]}>
              <Cylinder args={[0.3, 0.3, 0.7, 16]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#ef4444" />
              </Cylinder>
              <Cylinder args={[0.31, 0.31, 0.2, 16]} position={[0, -0.25, 0]}>
                <meshStandardMaterial color="#111827" />
              </Cylinder>
              <Cylinder args={[0.1, 0.1, 0.1, 16]} position={[0, 0.4, 0]}>
                <meshStandardMaterial color="#94a3b8" metalness={0.8} />
              </Cylinder>
            </group>
          );
        })}
      </group>

      {/* Switch */}
      <group position={switchCenter}>
        <mesh receiveShadow>
          <boxGeometry args={[1.6, 0.12, 2.4]} />
          <meshStandardMaterial color="#c2a67a" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.1, -0.6]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
          <meshStandardMaterial color="#eab308" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.1, 0.6]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
          <meshStandardMaterial color="#eab308" metalness={0.9} />
        </mesh>
        <group position={[0, 0.2, -0.6]} rotation={[0, switchOn ? 0 : -Math.PI / 4, 0]}>
          <mesh position={[0, 0, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 1.2, 16]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.95} />
          </mesh>
        </group>
      </group>

      {/* Wires connecting circuit */}
      <group>
        <WavyWire start={nailLeft} end={batteryNeg} color={wireColor1} />
        <WavyWire start={nailRight} end={switchPin1} color="#ef4444" />
        <WavyWire start={batteryPos} end={switchPin2} color={wireColor2} />
      </group>

      {/* Compasses and Labels */}
      {showCompass && (
        <>
          <Compass position={[-2.5, 0, 0]} rotationY={compass1Rot} />
          <Text position={[-2.5, 0.1, -1.2]} rotation={[-Math.PI / 4, 0, 0]} fontSize={0.4} color="#1e293b" fontWeight="bold" anchorX="center" anchorY="middle">End A</Text>
          
          <Compass position={[2.5, 0, 0]} rotationY={compass2Rot} />
          <Text position={[2.5, 0.1, -1.2]} rotation={[-Math.PI / 4, 0, 0]} fontSize={0.4} color="#1e293b" fontWeight="bold" anchorX="center" anchorY="middle">End B</Text>
        </>
      )}



      <ContactShadows position={[0, -0.15, 0]} opacity={0.4} scale={10} blur={2} far={4} />
      
      {/* Magnetic Field Visualization */}
      {showFieldLines && actualStrength > 0 && switchOn && (
        <mesh ref={fieldRef} position={[0, 1.5, 0]}>
          <sphereGeometry args={[2.5 + (actualStrength * 0.5), 32, 32]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.15 + (actualStrength * 0.1)} wireframe />
        </mesh>
      )}
    </group>
  );
}
