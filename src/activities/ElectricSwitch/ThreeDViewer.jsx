import React from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';

// --- Cardboard 3D Model ---
const CardboardModel = () => (
  <group>
    {/* Cardboard Plate */}
    <mesh castShadow receiveShadow>
      <boxGeometry args={[3.2, 0.12, 2.4]} />
      <meshStandardMaterial color="#c2a67a" roughness={0.85} metalness={0.05} />
    </mesh>
    {/* Inner boundary lines (etched effect) */}
    <mesh position={[0, 0.065, 0]}>
      <boxGeometry args={[3.0, 0.01, 2.2]} />
      <meshStandardMaterial color="#ab8e5f" roughness={0.9} wireframe={true} />
    </mesh>
  </group>
);

// --- Drawing Pin 3D Model ---
const DrawingPinModel = () => (
  <group>
    {/* Flange Disc */}
    <mesh castShadow position={[0, 0.05, 0]}>
      <cylinderGeometry args={[0.6, 0.6, 0.06, 32]} />
      <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.15} />
    </mesh>
    {/* Inner Cap Dome */}
    <mesh castShadow position={[0, 0.12, 0]}>
      <cylinderGeometry args={[0.35, 0.35, 0.08, 32]} />
      <meshStandardMaterial color="var(--warning)" metalness={0.95} roughness={0.1} />
    </mesh>
    {/* Center Tip Pin reflection sphere */}
    <mesh position={[-0.1, 0.17, -0.1]}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial color="#fef9c3" roughness={0.1} opacity={0.6} transparent />
    </mesh>
    {/* Needle (Pointing Down) */}
    <mesh position={[0, -0.3, 0]}>
      <cylinderGeometry args={[0.03, 0.01, 0.6, 16]} />
      <meshStandardMaterial color="var(--text-faint)" metalness={0.8} roughness={0.2} />
    </mesh>
  </group>
);

// --- Safety Pin 3D Model ---
const SafetyPinModel = () => (
  <group rotation={[Math.PI / 2, 0, 0]} scale={[1.2, 1.2, 1.2]}>
    {/* Main wire loop - side A */}
    <mesh castShadow position={[-0.15, 0, 0]}>
      <cylinderGeometry args={[0.035, 0.035, 1.8, 16]} />
      <meshStandardMaterial color="var(--text-faint)" metalness={0.95} roughness={0.1} />
    </mesh>
    {/* Main wire loop - side B (angled arm) */}
    <mesh castShadow position={[0.15, -0.1, 0]} rotation={[0, 0, -Math.PI / 10]}>
      <cylinderGeometry args={[0.03, 0.03, 1.6, 16]} />
      <meshStandardMaterial color="var(--text-faint)" metalness={0.95} roughness={0.1} />
    </mesh>
    {/* Bottom Coil Spring */}
    <mesh castShadow position={[0, -0.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.15, 0.04, 16, 32]} />
      <meshStandardMaterial color="var(--text-faint)" metalness={0.95} roughness={0.1} />
    </mesh>
    {/* Clasp Guard/Shield (Top head) */}
    <mesh castShadow position={[-0.05, 0.9, 0]}>
      <boxGeometry args={[0.32, 0.28, 0.16]} />
      <meshStandardMaterial color="var(--text-faint)" metalness={0.8} roughness={0.3} />
    </mesh>
  </group>
);

// --- Battery 3D Model ---
const BatteryModel = () => (
  <group rotation={[0, 0, Math.PI / 2]} scale={[1.1, 1.1, 1.1]}>
    {/* Main Red/Black Cylinder Body */}
    <mesh castShadow position={[0, 0, 0]}>
      <cylinderGeometry args={[0.42, 0.42, 1.3, 32]} />
      <meshStandardMaterial color="var(--danger)" roughness={0.3} metalness={0.1} />
    </mesh>
    {/* Black casing jacket label wrapper */}
    <mesh position={[0, 0.1, 0]}>
      <cylinderGeometry args={[0.43, 0.43, 0.6, 32]} />
      <meshStandardMaterial color="var(--text-primary)" roughness={0.4} metalness={0.05} />
    </mesh>
    {/* Negative Terminal Cap (Bottom Silver) */}
    <mesh position={[0, -0.68, 0]}>
      <cylinderGeometry args={[0.41, 0.41, 0.06, 32]} />
      <meshStandardMaterial color="var(--text-faint)" metalness={0.9} roughness={0.2} />
    </mesh>
    {/* Positive Terminal Cap (Top Silver) */}
    <mesh position={[0, 0.68, 0]}>
      <cylinderGeometry args={[0.41, 0.41, 0.06, 32]} />
      <meshStandardMaterial color="var(--text-faint)" metalness={0.9} roughness={0.2} />
    </mesh>
    {/* Positive terminal Pip */}
    <mesh position={[0, 0.74, 0]}>
      <cylinderGeometry args={[0.14, 0.14, 0.08, 16]} />
      <meshStandardMaterial color="var(--border)" metalness={0.95} roughness={0.1} />
    </mesh>
  </group>
);

// --- Bulb 3D Model ---
const BulbModel = () => (
  <group scale={[1.1, 1.1, 1.1]}>
    {/* Holder Base */}
    <mesh castShadow position={[0, -0.5, 0]}>
      <cylinderGeometry args={[0.7, 0.7, 0.25, 32]} />
      <meshStandardMaterial color="#1e3a8a" roughness={0.5} metalness={0.2} />
    </mesh>
    {/* Terminal Screws */}
    <mesh position={[-0.45, -0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.08, 0.08, 0.12, 16]} />
      <meshStandardMaterial color="var(--warning)" metalness={0.8} roughness={0.2} />
    </mesh>
    <mesh position={[0.45, -0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.08, 0.08, 0.12, 16]} />
      <meshStandardMaterial color="var(--warning)" metalness={0.8} roughness={0.2} />
    </mesh>
    {/* Screw Brass Sleeve */}
    <mesh castShadow position={[0, -0.22, 0]}>
      <cylinderGeometry args={[0.34, 0.34, 0.32, 32]} />
      <meshStandardMaterial color="#ca8a04" metalness={0.85} roughness={0.25} />
    </mesh>
    {/* Glass Globe */}
    <mesh castShadow position={[0, 0.24, 0]}>
      <sphereGeometry args={[0.42, 32, 32]} />
      <meshStandardMaterial color="#fef08a" opacity={0.65} transparent roughness={0.1} metalness={0.1} />
    </mesh>
    {/* Inner Filament wires */}
    <mesh position={[-0.08, 0.12, 0]}>
      <cylinderGeometry args={[0.015, 0.015, 0.24, 8]} />
      <meshStandardMaterial color="var(--text-faint)" metalness={0.9} />
    </mesh>
    <mesh position={[0.08, 0.12, 0]}>
      <cylinderGeometry args={[0.015, 0.015, 0.24, 8]} />
      <meshStandardMaterial color="var(--text-faint)" metalness={0.9} />
    </mesh>
    {/* Filament Loop */}
    <mesh position={[0, 0.24, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.08, 0.01, 8, 16, Math.PI]} />
      <meshStandardMaterial color="var(--text-secondary)" roughness={0.2} />
    </mesh>
  </group>
);

// --- Wires 3D Model (Simple Wavy Wire) ---
const WireSegment = ({ p1, p2, radius, color }) => {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const dz = p2[2] - p1[2];
  const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
  if (len === 0) return null;

  const pos = [p1[0] + dx / 2, p1[1] + dy / 2, p1[2] + dz / 2];
  
  // Align cylinder along the vector p2 - p1
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

const WiresModel = () => {
  const points = [
    [-1.0, -0.3, 0.2],       // 0: Left copper tip start
    [-0.85, -0.25, 0.15],    // 1: Left copper tip end / insulation start
    [-0.6, -0.05, 0.05],     // 2
    [-0.3, 0.15, -0.05],     // 3
    [0.0, 0.2, -0.1],        // 4
    [0.3, 0.1, -0.05],       // 5
    [0.6, -0.1, 0.05],       // 6
    [0.8, -0.22, 0.1],       // 7
    [0.9, -0.25, 0.12],      // 8: Insulation end / right copper tip start
    [1.0, -0.3, 0.15]        // 9: Right copper tip end
  ];

  return (
    <group rotation={[0.1, 0.2, 0]}>
      {points.map((p, i) => {
        if (i === points.length - 1) return null;
        const isCopper = i === 0 || i === points.length - 2;
        const color = isCopper ? '#ca8a04' : 'var(--danger)';
        const radius = isCopper ? 0.025 : 0.045;
        return (
          <WireSegment 
            key={i} 
            p1={p} 
            p2={points[i + 1]} 
            radius={radius} 
            color={color} 
          />
        );
      })}
    </group>
  );
};

// --- Completed Switch 3D Model ---
const CompletedSwitchModel = () => (
  <group scale={[0.85, 0.85, 0.85]} position={[0, -0.15, 0]}>
    {/* Cardboard Base */}
    <group position={[0, 0, 0]}>
      <CardboardModel />
    </group>
    
    {/* Battery */}
    <group position={[0, 0.39, -0.6]} scale={[0.8, 0.8, 0.8]}>
      <BatteryModel />
    </group>
    
    {/* Bulb */}
    <group position={[-0.7, 0.685, -0.6]} scale={[0.85, 0.85, 0.85]}>
      <BulbModel />
    </group>
    
    {/* Drawing Pin 1 (pivot) */}
    <group position={[-0.5, 0.06, 0.4]}>
      <DrawingPinModel />
    </group>
    
    {/* Drawing Pin 2 (contact) */}
    <group position={[0.5, 0.06, 0.4]}>
      <DrawingPinModel />
    </group>
    
    {/* Safety Pin (closed switch, connecting Pin 1 to Pin 2) */}
    <group position={[-0.5, 0.12, 0.4]} rotation={[0, Math.PI / 2, 0]}>
      <SafetyPinModel />
    </group>
    
    {/* Wires */}
    <group>
      {/* Wire 1: Battery Neg -> Bulb Left */}
      <WireSegment p1={[-0.6, 0.39, -0.6]} p2={[-1.15, 0.335, -0.6]} radius={0.025} color="var(--danger)" />
      {/* Wire 2: Battery Pos -> Pin 2 */}
      <WireSegment p1={[0.6, 0.39, -0.6]} p2={[0.5, 0.06, 0.4]} radius={0.025} color="#ca8a04" />
      {/* Wire 3: Pin 1 -> Bulb Right */}
      <WireSegment p1={[-0.5, 0.06, 0.4]} p2={[-0.25, 0.335, -0.6]} radius={0.025} color="#f97316" />
    </group>
  </group>
);

export default function ThreeDViewer({ componentId }) {
  const renderModel = () => {
    switch (componentId) {
      case 'completed_switch':
        return <CompletedSwitchModel />;
      case 'cardboard':
        return <CardboardModel />;
      case 'pin1':
      case 'pin2':
        return <DrawingPinModel />;
      case 'safetyPin':
        return <SafetyPinModel />;
      case 'battery':
        return <BatteryModel />;
      case 'bulb':
        return <BulbModel />;
      case 'wires':
        return <WiresModel />;
      default:
        return null;
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', outline: 'none', background: 'var(--canvas-bg)' }}>
      <Canvas
        shadows
        camera={{ position: [0, 1.8, 2.5], fov: 45 }}
        gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true }}
      >
        
        {/* Lights */}
        <ambientLight intensity={1.1} />
        <pointLight position={[10, 10, 10]} intensity={1.8} castShadow />
        <pointLight position={[-10, 5, -10]} intensity={0.6} />
        <directionalLight position={[0, 5, 2]} intensity={1.2} />

        <Center>
          {renderModel()}
        </Center>

        {/* Orbit Controls (Full Orbit Rotation, Zoom, Touch support) */}
        <OrbitControls
          enableDamping={true}
          dampingFactor={0.06}
          minDistance={1.5}
          maxDistance={4.5}
          makeDefault
        />
      </Canvas>
    </div>
  );
}
