import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { ContactShadows, Cylinder, Box } from '@react-three/drei';
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
      <meshStandardMaterial 
        color={color} 
        roughness={color === '#ca8a04' ? 0.15 : 0.3} 
        metalness={color === '#ca8a04' ? 0.95 : 0.1} 
      />
    </mesh>
  );
};

// Route a wavy wire between two endpoints
const WavyWire = ({ start, end, color = "var(--danger)" }) => {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const dz = end[2] - start[2];

  const points = [
    start,
    [start[0] + dx * 0.2, start[1] + dy * 0.2 - 0.3, start[2] + dz * 0.2],
    [start[0] + dx * 0.5, start[1] + dy * 0.5 - 0.5, start[2] + dz * 0.5],
    [start[0] + dx * 0.8, start[1] + dy * 0.8 - 0.3, start[2] + dz * 0.8],
    end
  ];

  return (
    <group>
      {points.map((p, i) => {
        if (i === points.length - 1) return null;
        return (
          <WireSegment 
            key={i} 
            p1={p} 
            p2={points[i + 1]} 
            radius={0.03} 
            color={color} 
          />
        );
      })}
    </group>
  );
};

const PaperClipsPile = ({ isMagnetic, targetY = 1.3, floorY = 0 }) => {
  const groupRef = useRef();
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      const target = isMagnetic ? targetY : floorY;
      // Smoothly animate the Y position
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, target, delta * 8);
      
      // Add a subtle magnetic rattling effect when they hit the nail
      if (isMagnetic && groupRef.current.position.y > targetY - 0.1) {
         groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 30) * 0.05;
      } else {
         groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, delta * 6);
      }
    }
  });

  return (
    <group ref={groupRef} position={[1.4, floorY, 0]}>
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0.2, 0]} scale={[1, 0.3, 1]}>
         <torusGeometry args={[0.12, 0.02, 8, 24]} />
         <meshStandardMaterial color="#9ca3af" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.1, 0.02, 0.1]} rotation={[Math.PI / 2, -0.4, 0]} scale={[1, 0.3, 1]}>
         <torusGeometry args={[0.12, 0.02, 8, 24]} />
         <meshStandardMaterial color="#9ca3af" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[-0.1, 0.01, -0.05]} rotation={[Math.PI / 2, 0.8, 0]} scale={[1, 0.3, 1]}>
         <torusGeometry args={[0.12, 0.02, 8, 24]} />
         <meshStandardMaterial color="#9ca3af" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.05, 0.03, 0.15]} rotation={[Math.PI / 2, -0.1, 0]} scale={[1, 0.3, 1]}>
         <torusGeometry args={[0.12, 0.02, 8, 24]} />
         <meshStandardMaterial color="#9ca3af" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
};

export default function Electromagnet3D({ 
  buildStep = 5, 
  switchOn = false, 
  turns = 20, 
  cells = 1, 
  material = 'iron',
  paperClipDistance = 1.0 
}) {
  const nailRef = useRef();
  const fieldRef = useRef();
  const [permanentlyMagnetized, setPermanentlyMagnetized] = useState(false);

  // Reset permanent magnetism if material changes away from steel
  useEffect(() => {
    if (material !== 'steel') {
      setPermanentlyMagnetized(false);
    }
  }, [material]);

  // Steel becomes permanently magnetized when exposed to strong magnetic field
  useEffect(() => {
    if (material === 'steel' && switchOn && turns > 0 && cells > 0) {
      setPermanentlyMagnetized(true);
    }
  }, [material, switchOn, turns, cells]);
  
  useFrame((state) => {
    if (fieldRef.current) {
      fieldRef.current.rotation.y += 0.01;
      fieldRef.current.rotation.z += 0.005;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.03;
      fieldRef.current.scale.set(scale, scale, scale);
    }
  });

  const basePermeability = material === 'iron' ? 1.0 : material === 'steel' ? 0.7 : 0.0;
  
  let strength = 0;
  if (switchOn) {
    strength = (turns / 40) * (cells / 3) * basePermeability;
  } else if (permanentlyMagnetized) {
    strength = 0.3; // Retains enough strength to hold paper clips (strength > 0.1)
  }
  
  const isMagnetic = strength > 0.1;

  const materialProps = {
    iron: { color: '#64748b', metalness: 0.8, roughness: 0.3 },
    steel: { color: '#94a3b8', metalness: 0.9, roughness: 0.1 },
    wood: { color: '#8b5a2b', metalness: 0.1, roughness: 0.9 },
    plastic: { color: '#ef4444', metalness: 0.2, roughness: 0.4 }
  };
  const currentMat = materialProps[material] || materialProps.iron;

  // Key Coordinates
  const nailLeft = [-1.4, 1.5, 0];
  const nailRight = [1.2, 1.5, 0];
  
  const batteryCenter = [-0.5, 0, 2.5];
  const batteryNeg = [batteryCenter[0] - (cells - 1) * 0.8 - 0.35, 0, 2.5];
  const batteryPos = [batteryCenter[0] + 0.45, 0, 2.5];
  
  const switchCenter = [2.5, 0, 1.5];
  const switchPin1 = [switchCenter[0], 0.1, switchCenter[2] - 0.6]; // Top pin
  const switchPin2 = [switchCenter[0], 0.1, switchCenter[2] + 0.6]; // Bottom pin

  return (
    <group position={[-0.5, -0.5, -1]}>
      {/* Nail (Core) */}
      <group ref={nailRef} position={[0, 1.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <Cylinder args={[0.3, 0.3, 0.1, 16]} position={[0, 1.5, 0]}>
          <meshStandardMaterial {...currentMat} />
        </Cylinder>
        <Cylinder args={[0.1, 0.1, 3, 16]} position={[0, 0, 0]}>
          <meshStandardMaterial {...currentMat} />
        </Cylinder>
        <Cylinder args={[0.1, 0.0, 0.3, 16]} position={[0, -1.65, 0]}>
          <meshStandardMaterial {...currentMat} />
        </Cylinder>

        {buildStep >= 1 && (
          <group position={[0, 0, 0]}>
            {Array.from({ length: turns }).map((_, i) => {
              const yPos = -1.2 + (i * (2.4 / Math.max(1, turns - 1)));
              return (
                <mesh key={i} position={[0, yPos, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.15, 0.03, 8, 24]} />
                  <meshStandardMaterial color="#b45309" roughness={0.4} metalness={0.6} />
                </mesh>
              );
            })}
          </group>
        )}
      </group>

      {/* Battery (1, 2, or 3 cells) */}
      {buildStep >= 2 && (
        <group position={batteryCenter}>
          {Array.from({ length: cells }).map((_, i) => (
            <group key={i} position={[-i * 0.8, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
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
          ))}
        </group>
      )}

      {/* Switch */}
      {buildStep >= 4 && (
        <group position={switchCenter}>
          {/* Base */}
          <mesh receiveShadow>
            <boxGeometry args={[1.6, 0.12, 2.4]} />
            <meshStandardMaterial color="#c2a67a" roughness={0.85} />
          </mesh>
          {/* Pin 1 (Top) */}
          <mesh position={[0, 0.1, -0.6]}>
            <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
            <meshStandardMaterial color="#eab308" metalness={0.9} />
          </mesh>
          {/* Pin 2 (Bottom) */}
          <mesh position={[0, 0.1, 0.6]}>
            <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
            <meshStandardMaterial color="#eab308" metalness={0.9} />
          </mesh>
          {/* Safety Pin */}
          <group position={[0, 0.2, -0.6]} rotation={[0, switchOn ? 0 : -Math.PI / 4, 0]}>
            <mesh position={[0, 0, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 1.2, 16]} />
              <meshStandardMaterial color="#9ca3af" metalness={0.95} />
            </mesh>
          </group>
        </group>
      )}

      {/* Wires connecting circuit */}
      {buildStep >= 5 && (
        <group>
          {/* Nail Left to Battery Negative (Black wire) */}
          <WavyWire start={nailLeft} end={batteryNeg} color="#1f2937" />
          
          {/* Nail Right to Switch Pin 1 (Red wire) */}
          <WavyWire start={nailRight} end={switchPin1} color="#ef4444" />
          
          {/* Battery Positive to Switch Pin 2 (Yellow wire) */}
          <WavyWire start={batteryPos} end={switchPin2} color="#eab308" />
        </group>
      )}

      {/* Paper Clips Pile */}
      <PaperClipsPile isMagnetic={isMagnetic} targetY={1.35} floorY={-0.1} />

      <ContactShadows position={[0, -0.15, 0]} opacity={0.4} scale={10} blur={2} far={4} />
      
      {/* Magnetic Field Visualization */}
      {isMagnetic && (
        <mesh ref={fieldRef} position={[0, 1.5, 0]}>
          <sphereGeometry args={[2.2, 32, 32]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.15} wireframe />
        </mesh>
      )}
    </group>
  );
}
