import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';

// Component Geometries
const CardboardModel = () => (
  <mesh position={[0, -0.04, 0]} receiveShadow castShadow>
    <boxGeometry args={[2.2, 0.08, 2.4]} />
    <meshStandardMaterial color="#c2a67a" roughness={0.8} />
  </mesh>
);

const DrawingPinModel = () => (
  <group>
    {/* Brass cap */}
    <mesh position={[0, 0.06, 0]} castShadow>
      <cylinderGeometry args={[0.18, 0.18, 0.05, 32]} />
      <meshStandardMaterial color="#eab308" metalness={0.8} roughness={0.2} />
    </mesh>
    {/* Center pin point */}
    <mesh position={[0, 0.09, 0]}>
      <cylinderGeometry args={[0.07, 0.07, 0.03, 16]} />
      <meshStandardMaterial color="#ca8a04" metalness={0.9} roughness={0.1} />
    </mesh>
    {/* Pin needle stem extending downward into cardboard */}
    <mesh position={[0, -0.06, 0]}>
      <cylinderGeometry args={[0.018, 0.005, 0.18, 16]} />
      <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.1} />
    </mesh>
  </group>
);

const SafetyPinModel = ({ isOpen = false }) => (
  <group rotation={[0, 0, 0]}>
    {/* Coil spring end */}
    <mesh position={[-0.4, 0.04, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <torusGeometry args={[0.07, 0.02, 16, 32]} />
      <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
    </mesh>

    {/* Fixed arm */}
    <mesh position={[0, 0.04, -0.07]} rotation={[0, 0, Math.PI / 2]} castShadow>
      <cylinderGeometry args={[0.02, 0.02, 0.8, 16]} />
      <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
    </mesh>

    {/* Movable arm (rotated open or closed) */}
    <group position={[-0.4, 0.04, 0]} rotation={[0, isOpen ? -0.55 : 0, 0]}>
      <mesh position={[0.4, 0, 0.07]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.018, 0.009, 0.8, 16]} />
        <meshStandardMaterial color="#f1f5f9" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Clasp Head / Shield */}
      <mesh position={[0.8, 0, 0.035]} castShadow>
        <boxGeometry args={[0.16, 0.08, 0.14]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  </group>
);

const BatteryModel = () => (
  <group rotation={[0, 0, Math.PI / 2]}>
    {/* Main Cylinder Body */}
    <mesh castShadow>
      <cylinderGeometry args={[0.45, 0.45, 1.4, 32]} />
      <meshStandardMaterial color="#ef4444" roughness={0.3} />
    </mesh>
    {/* Metal Base (-) */}
    <mesh position={[0, -0.71, 0]}>
      <cylinderGeometry args={[0.43, 0.43, 0.04, 32]} />
      <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
    </mesh>
    {/* Metal Top Cap (+) */}
    <mesh position={[0, 0.71, 0]}>
      <cylinderGeometry args={[0.43, 0.43, 0.04, 32]} />
      <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
    </mesh>
    {/* Positive Terminal Pip */}
    <mesh position={[0, 0.77, 0]}>
      <cylinderGeometry args={[0.16, 0.16, 0.08, 32]} />
      <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
    </mesh>
  </group>
);

const BulbModel = () => (
  <group>
    {/* Blue Plastic Socket Base */}
    <mesh position={[0, 0.1, 0]} castShadow>
      <boxGeometry args={[0.8, 0.2, 0.65]} />
      <meshStandardMaterial color="#1d4ed8" roughness={0.4} />
    </mesh>
    {/* Screw Terminals */}
    <mesh position={[-0.28, 0.21, 0]}>
      <cylinderGeometry args={[0.06, 0.06, 0.05, 16]} />
      <meshStandardMaterial color="#ca8a04" metalness={0.8} />
    </mesh>
    <mesh position={[0.28, 0.21, 0]}>
      <cylinderGeometry args={[0.06, 0.06, 0.05, 16]} />
      <meshStandardMaterial color="#ca8a04" metalness={0.8} />
    </mesh>

    {/* Metallic Brass Sleeve */}
    <mesh position={[0, 0.26, 0]}>
      <cylinderGeometry args={[0.24, 0.24, 0.16, 32]} />
      <meshStandardMaterial color="#a16207" metalness={0.8} roughness={0.3} />
    </mesh>

    {/* Glass Globe */}
    <mesh position={[0, 0.58, 0]} castShadow>
      <sphereGeometry args={[0.35, 32, 32]} />
      <meshPhysicalMaterial
        color="#fef08a"
        transmission={0.85}
        opacity={1}
        transparent={true}
        roughness={0.1}
        ior={1.5}
      />
    </mesh>

    {/* Inner Filament Loop */}
    <mesh position={[0, 0.52, 0]}>
      <torusGeometry args={[0.1, 0.012, 16, 32, Math.PI]} />
      <meshStandardMaterial color="#ea580c" emissive="#f97316" emissiveIntensity={0.5} />
    </mesh>
  </group>
);

// 3D Tube Wire using CatmullRom Curve
const CurvedWire = ({ points, color, radius = 0.02 }) => {
  const curve = React.useMemo(() => {
    const vecPoints = points.map((p) => new THREE.Vector3(...p));
    return new THREE.CatmullRomCurve3(vecPoints);
  }, [points]);

  return (
    <mesh castShadow receiveShadow>
      <tubeGeometry args={[curve, 32, radius, 8, false]} />
      <meshStandardMaterial color={color} roughness={0.35} metalness={0.25} />
    </mesh>
  );
};

const WireSegment = ({ p1, p2, radius = 0.02, color = "#ef4444" }) => {
  const midY = Math.max(p1[1], p2[1]) + 0.12;
  const midX = (p1[0] + p2[0]) / 2;
  const midZ = (p1[2] + p2[2]) / 2;
  const points = [p1, [midX, midY, midZ], p2];
  return <CurvedWire points={points} color={color} radius={radius} />;
};

// --- Drawing Pin 3D Model ---
const DrawingPinModel = () => (
  <group>
    {/* Flange Disc */}
    <mesh castShadow position={[0, 0.02, 0]}>
      <cylinderGeometry args={[0.18, 0.18, 0.03, 32]} />
      <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.2} />
    </mesh>
    {/* Metallic Dome Cap */}
    <mesh castShadow position={[0, 0.05, 0]}>
      <sphereGeometry args={[0.12, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.1} />
    </mesh>
    {/* Needle (Hidden in cardboard) */}
    <mesh position={[0, -0.1, 0]}>
      <cylinderGeometry args={[0.012, 0.004, 0.2, 16]} />
      <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.2} />
    </mesh>
  </group>
);

// --- Safety Pin 3D Model ---
const SafetyPinModel = ({ isOpen = false }) => (
  <group rotation={[Math.PI / 2, 0, 0]} scale={[0.7, 0.7, 0.7]}>
    {/* Fixed Main Arm */}
    <mesh castShadow position={[-0.05, 0, 0]}>
      <cylinderGeometry args={[0.018, 0.018, 1.3, 16]} />
      <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
    </mesh>

    {/* Movable Arm */}
    <mesh
      castShadow
      position={isOpen ? [0.1, -0.04, 0] : [0.05, 0, 0]}
      rotation={isOpen ? [0, 0, -Math.PI / 12] : [0, 0, 0]}
    >
      <cylinderGeometry args={[0.016, 0.016, 1.2, 16]} />
      <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
    </mesh>

    {/* Bottom Spring Coil */}
    <mesh castShadow position={[0, -0.65, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.08, 0.02, 16, 32]} />
      <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
    </mesh>

    {/* Clasp Shield Head */}
    <mesh castShadow position={[0, 0.65, 0]}>
      <boxGeometry args={[0.18, 0.14, 0.08]} />
      <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
    </mesh>
  </group>
);

// --- Battery 3D Model ---
const BatteryModel = () => (
  <group rotation={[0, 0, Math.PI / 2]} scale={[0.6, 0.6, 0.6]}>
    {/* Main Red Body */}
    <mesh castShadow position={[0, 0, 0]}>
      <cylinderGeometry args={[0.28, 0.28, 1.0, 32]} />
      <meshStandardMaterial color="#dc2626" roughness={0.35} metalness={0.1} />
    </mesh>
    {/* Black Jacket Label */}
    <mesh position={[0, 0.06, 0]}>
      <cylinderGeometry args={[0.285, 0.285, 0.45, 32]} />
      <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.05} />
    </mesh>
    {/* Negative Terminal Cap */}
    <mesh position={[0, -0.51, 0]}>
      <cylinderGeometry args={[0.27, 0.27, 0.04, 32]} />
      <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
    </mesh>
    {/* Positive Terminal Cap */}
    <mesh position={[0, 0.51, 0]}>
      <cylinderGeometry args={[0.27, 0.27, 0.04, 32]} />
      <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
    </mesh>
    {/* Positive Terminal Pip */}
    <mesh position={[0, 0.55, 0]}>
      <cylinderGeometry args={[0.09, 0.09, 0.05, 16]} />
      <meshStandardMaterial color="#f8fafc" metalness={0.95} roughness={0.1} />
    </mesh>
  </group>
);

// --- Bulb 3D Model ---
const BulbModel = () => (
  <group scale={[0.6, 0.6, 0.6]}>
    {/* Blue Holder Base */}
    <mesh castShadow position={[0, -0.3, 0]}>
      <cylinderGeometry args={[0.4, 0.4, 0.16, 32]} />
      <meshStandardMaterial color="#1d4ed8" roughness={0.4} metalness={0.2} />
    </mesh>
    {/* Terminal Screws */}
    <mesh position={[-0.28, -0.22, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.04, 0.04, 0.07, 16]} />
      <meshStandardMaterial color="#eab308" metalness={0.85} roughness={0.2} />
    </mesh>
    <mesh position={[0.28, -0.22, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.04, 0.04, 0.07, 16]} />
      <meshStandardMaterial color="#eab308" metalness={0.85} roughness={0.2} />
    </mesh>
    {/* Screw Brass Sleeve */}
    <mesh castShadow position={[0, -0.12, 0]}>
      <cylinderGeometry args={[0.2, 0.2, 0.2, 32]} />
      <meshStandardMaterial color="#ca8a04" metalness={0.85} roughness={0.2} />
    </mesh>
    {/* Glowing Translucent Glass Globe */}
    <mesh castShadow position={[0, 0.18, 0]}>
      <sphereGeometry args={[0.28, 32, 32]} />
      <meshStandardMaterial color="#fef08a" opacity={0.75} transparent roughness={0.1} metalness={0.1} />
    </mesh>
    {/* Inner Filament Wires */}
    <mesh position={[-0.04, 0.08, 0]}>
      <cylinderGeometry args={[0.008, 0.008, 0.16, 8]} />
      <meshStandardMaterial color="#64748b" metalness={0.9} />
    </mesh>
    <mesh position={[0.04, 0.08, 0]}>
      <cylinderGeometry args={[0.008, 0.008, 0.16, 8]} />
      <meshStandardMaterial color="#64748b" metalness={0.9} />
    </mesh>
    {/* Filament Loop */}
    <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.04, 0.006, 8, 16, Math.PI]} />
      <meshStandardMaterial color="#334155" roughness={0.2} />
    </mesh>
  </group>
);

// --- Wires Standalone Model ---
const WiresModel = () => {
  const wire1Points = [[-0.4, 0.3, -0.5], [-0.7, 0.12, -0.5], [-0.85, 0.2, -0.5]];
  const wire2Points = [[0.6, 0.3, -0.5], [0.7, 0.1, -0.1], [0.4, 0.04, 0.4]];
  const wire3Points = [[-0.4, 0.04, 0.4], [-0.5, 0.1, -0.1], [-0.35, 0.2, -0.5]];

  return (
    <group scale={[0.9, 0.9, 0.9]}>
      <CardboardModel />
      <group position={[0.25, 0.3, -0.5]} scale={[0.7, 0.7, 0.7]}>
        <BatteryModel />
      </group>
      <group position={[-0.6, 0.02, -0.5]} scale={[0.75, 0.75, 0.75]}>
        <BulbModel />
      </group>
      <group position={[-0.4, 0.02, 0.4]}>
        <DrawingPinModel />
      </group>
      <group position={[0.4, 0.02, 0.4]}>
        <DrawingPinModel />
      </group>

      {/* Drawing Pin 2 (contact terminal) */}
      <group position={[0.4, 0.05, 0.4]}>
        <DrawingPinModel />
      </group>

      {/* Safety Pin (CLOSED switch bridging Pin 1 to Pin 2) */}
      <group position={[-0.05, 0.08, 0.4]} rotation={[0, Math.PI / 2, 0]}>
        <SafetyPinModel isOpen={false} />
      </group>

      {/* Smooth Curved Wires saged gracefully onto cardboard */}
      <CurvedWire points={wire1Points} color="#dc2626" radius={0.018} />
      <CurvedWire points={wire2Points} color="#ca8a04" radius={0.018} />
      <CurvedWire points={wire3Points} color="#f97316" radius={0.018} />
    </group>
  );
};

// --- Completed Switch 3D Model ---
const CompletedSwitchModel = () => (
  <group scale={[0.95, 0.95, 0.95]} position={[0, -0.05, 0]}>
    {/* Cardboard Base */}
    <CardboardModel />
    
    {/* Battery lying flat on cardboard */}
    <group position={[0.3, 0.3, -0.5]} scale={[0.7, 0.7, 0.7]}>
      <BatteryModel />
    </group>
    
    {/* Bulb standing upright on cardboard */}
    <group position={[-0.6, 0.02, -0.5]} scale={[0.75, 0.75, 0.75]}>
      <BulbModel />
    </group>
    
    {/* Drawing Pin 1 (pivot) */}
    <group position={[-0.4, 0.02, 0.4]}>
      <DrawingPinModel />
    </group>
    
    {/* Drawing Pin 2 (contact) */}
    <group position={[0.4, 0.02, 0.4]}>
      <DrawingPinModel />
    </group>
    
    {/* Safety Pin (closed switch, connecting Pin 1 to Pin 2) */}
    <group position={[-0.4, 0.06, 0.4]} rotation={[0, Math.PI / 2, 0]}>
      <SafetyPinModel isOpen={false} />
    </group>
    
    {/* Circuit Wires */}
    <group>
      <WireSegment p1={[-0.2, 0.3, -0.5]} p2={[-0.8, 0.2, -0.5]} radius={0.02} color="#dc2626" />
      <WireSegment p1={[0.8, 0.3, -0.5]} p2={[0.4, 0.06, 0.4]} radius={0.02} color="#ca8a04" />
      <WireSegment p1={[-0.4, 0.06, 0.4]} p2={[-0.4, 0.2, -0.5]} radius={0.02} color="#f97316" />
    </group>
  </group>
);

export default function ThreeDViewer({ componentId }) {
  const renderModel = () => {
    switch (componentId) {
      case "completed_switch":
        return <CompletedSwitchModel />;
      case "cardboard":
        return <CardboardModel />;
      case "pin1":
      case "pin2":
        return <DrawingPinModel />;
      case "safetyPin":
        return <SafetyPinModel isOpen={true} />;
      case "battery":
        return <BatteryModel />;
      case "bulb":
        return <BulbModel />;
      case "wires":
        return <WiresModel />;
      default:
        return null;
    }
  };

  const isCompleted = componentId === "completed_switch";

  return (
    <div style={{ width: "100%", height: "100%", outline: "none", background: "var(--canvas-bg)" }}>
      <Canvas
        shadows
        camera={{ position: isCompleted ? [0, 2.2, 2.8] : [0, 1.8, 2.5], fov: 40 }}
        gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true }}
      >
        <ambientLight intensity={1.2} />
        <pointLight position={[10, 10, 10]} intensity={1.8} castShadow />
        <pointLight position={[-10, 5, -10]} intensity={0.6} />
        <directionalLight position={[0, 6, 3]} intensity={1.3} />

        <Center>
          {renderModel()}
        </Center>

        <OrbitControls
          enableDamping={true}
          dampingFactor={0.06}
          minDistance={1.2}
          maxDistance={5.0}
          makeDefault
        />
      </Canvas>
    </div>
  );
}
