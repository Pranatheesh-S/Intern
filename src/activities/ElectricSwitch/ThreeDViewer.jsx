import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import * as THREE from 'three';

// Sleek, Proportional Cardboard Base
const CardboardModel = () => (
  <mesh position={[0, -0.03, 0]} receiveShadow castShadow>
    <boxGeometry args={[3.0, 0.06, 2.6]} />
    <meshStandardMaterial color="#b89968" roughness={0.85} />
  </mesh>
);

// Sleek Compact Drawing Pin
const DrawingPinModel = () => (
  <group>
    {/* Brass cap */}
    <mesh position={[0, 0.04, 0]} castShadow>
      <cylinderGeometry args={[0.11, 0.11, 0.035, 32]} />
      <meshStandardMaterial color="#eab308" metalness={0.85} roughness={0.2} />
    </mesh>
    {/* Center pin point */}
    <mesh position={[0, 0.06, 0]}>
      <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
      <meshStandardMaterial color="#ca8a04" metalness={0.9} roughness={0.1} />
    </mesh>
    {/* Pin needle stem extending downward into cardboard */}
    <mesh position={[0, -0.04, 0]}>
      <cylinderGeometry args={[0.012, 0.004, 0.14, 16]} />
      <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.1} />
    </mesh>
  </group>
);

// Sleek Metallic Safety Pin
const SafetyPinModel = ({ isOpen = false }) => (
  <group rotation={[0, 0, 0]}>
    {/* Coil spring end */}
    <mesh position={[-0.4, 0.03, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <torusGeometry args={[0.05, 0.015, 16, 32]} />
      <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
    </mesh>

    {/* Fixed arm */}
    <mesh position={[0, 0.03, -0.05]} rotation={[0, 0, Math.PI / 2]} castShadow>
      <cylinderGeometry args={[0.014, 0.014, 0.8, 16]} />
      <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} />
    </mesh>

    {/* Movable arm (rotated open or closed) */}
    <group position={[-0.4, 0.03, 0]} rotation={[0, isOpen ? -0.55 : 0, 0]}>
      <mesh position={[0.4, 0, 0.05]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.012, 0.006, 0.8, 16]} />
        <meshStandardMaterial color="#f1f5f9" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Clasp Head / Shield */}
      <mesh position={[0.8, 0, 0.025]} castShadow>
        <boxGeometry args={[0.12, 0.06, 0.1]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.25} />
      </mesh>
    </group>
  </group>
);

// Realistic Sleek Cell Battery
const BatteryModel = () => (
  <group rotation={[0, 0, Math.PI / 2]}>
    {/* Main Cylinder Body (Red Casing) */}
    <mesh castShadow>
      <cylinderGeometry args={[0.26, 0.26, 1.1, 32]} />
      <meshStandardMaterial color="#dc2626" roughness={0.35} metalness={0.1} />
    </mesh>
    {/* Black Stripe Label Accent */}
    <mesh position={[0, 0.05, 0]}>
      <cylinderGeometry args={[0.265, 0.265, 0.5, 32]} />
      <meshStandardMaterial color="#1e293b" roughness={0.4} />
    </mesh>
    {/* Metal Base (-) */}
    <mesh position={[0, -0.56, 0]}>
      <cylinderGeometry args={[0.25, 0.25, 0.03, 32]} />
      <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
    </mesh>
    {/* Metal Top Cap (+) */}
    <mesh position={[0, 0.56, 0]}>
      <cylinderGeometry args={[0.25, 0.25, 0.03, 32]} />
      <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
    </mesh>
    {/* Positive Terminal Pip */}
    <mesh position={[0, 0.61, 0]}>
      <cylinderGeometry args={[0.1, 0.1, 0.07, 32]} />
      <meshStandardMaterial color="#f1f5f9" metalness={0.95} roughness={0.1} />
    </mesh>
  </group>
);

// Sleek Compact Electric Bulb
const BulbModel = () => (
  <group>
    {/* Blue Plastic Socket Base */}
    <mesh position={[0, 0.07, 0]} castShadow>
      <boxGeometry args={[0.55, 0.14, 0.45]} />
      <meshStandardMaterial color="#1d4ed8" roughness={0.4} />
    </mesh>
    {/* Screw Terminals */}
    <mesh position={[-0.2, 0.15, 0]}>
      <cylinderGeometry args={[0.04, 0.04, 0.04, 16]} />
      <meshStandardMaterial color="#ca8a04" metalness={0.8} />
    </mesh>
    <mesh position={[0.2, 0.15, 0]}>
      <cylinderGeometry args={[0.04, 0.04, 0.04, 16]} />
      <meshStandardMaterial color="#ca8a04" metalness={0.8} />
    </mesh>

    {/* Metallic Brass Sleeve */}
    <mesh position={[0, 0.18, 0]}>
      <cylinderGeometry args={[0.16, 0.16, 0.12, 32]} />
      <meshStandardMaterial color="#a16207" metalness={0.85} roughness={0.25} />
    </mesh>

    {/* Glass Globe */}
    <mesh position={[0, 0.42, 0]} castShadow>
      <sphereGeometry args={[0.24, 32, 32]} />
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
    <mesh position={[0, 0.38, 0]}>
      <torusGeometry args={[0.07, 0.008, 16, 32, Math.PI]} />
      <meshStandardMaterial color="#ea580c" emissive="#f97316" emissiveIntensity={0.6} />
    </mesh>
  </group>
);

// 3D Tube Wire using CatmullRom Curve
const CurvedWire = ({ points, color, radius = 0.014 }) => {
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

const WireSegment = ({ p1, p2, radius = 0.014, color = "#ef4444" }) => {
  const midY = Math.max(p1[1], p2[1]) + 0.08;
  const midX = (p1[0] + p2[0]) / 2;
  const midZ = (p1[2] + p2[2]) / 2;
  const points = [p1, [midX, midY, midZ], p2];
  return <CurvedWire points={points} color={color} radius={radius} />;
};


// --- Wires Standalone Model ---
const WiresModel = () => {
  const wire1Points = [[-0.4, 0.2, -0.5], [-0.7, 0.08, -0.5], [-0.85, 0.15, -0.5]];
  const wire2Points = [[0.6, 0.2, -0.5], [0.7, 0.06, -0.1], [0.4, 0.03, 0.4]];
  const wire3Points = [[-0.4, 0.03, 0.4], [-0.5, 0.06, -0.1], [-0.35, 0.15, -0.5]];

  return (
    <group scale={[0.9, 0.9, 0.9]}>
      <CardboardModel />
      <group position={[0.25, 0.2, -0.5]} scale={[0.7, 0.7, 0.7]}>
        <BatteryModel />
      </group>
      <group position={[-0.6, 0.01, -0.5]} scale={[0.75, 0.75, 0.75]}>
        <BulbModel />
      </group>
      <group position={[-0.4, 0.01, 0.4]}>
        <DrawingPinModel />
      </group>
      <group position={[0.4, 0.01, 0.4]}>
        <DrawingPinModel />
      </group>

      <CurvedWire points={wire1Points} color="#dc2626" radius={0.014} />
      <CurvedWire points={wire2Points} color="#ca8a04" radius={0.014} />
      <CurvedWire points={wire3Points} color="#f97316" radius={0.014} />
    </group>
  );
};

// --- Completed Switch 3D Model ---
const CompletedSwitchModel = () => (
  <group scale={[0.85, 0.85, 0.85]} position={[0, -0.05, 0]}>
    {/* Cardboard Base */}
    <CardboardModel />
    
    {/* Battery lying flat on cardboard */}
    <group position={[0.45, 0.24, -0.4]} scale={[0.85, 0.85, 0.85]}>
      <BatteryModel />
    </group>
    
    {/* Bulb standing upright on cardboard */}
    <group position={[-0.65, 0.01, -0.4]} scale={[0.85, 0.85, 0.85]}>
      <BulbModel />
    </group>
    
    {/* Drawing Pin 1 (pivot) */}
    <group position={[-0.4, 0.01, 0.5]}>
      <DrawingPinModel />
    </group>
    
    {/* Drawing Pin 2 (contact) */}
    <group position={[0.4, 0.01, 0.5]}>
      <DrawingPinModel />
    </group>
    
    {/* Safety Pin (closed switch, connecting Pin 1 to Pin 2) */}
    <group position={[0, 0.03, 0.5]} rotation={[0, 0, 0]}>
      <SafetyPinModel isOpen={false} />
    </group>
    
    {/* Circuit Wires */}
    <group>
      <WireSegment p1={[-0.05, 0.24, -0.4]} p2={[-0.82, 0.16, -0.4]} radius={0.014} color="#dc2626" />
      <WireSegment p1={[0.95, 0.24, -0.4]} p2={[0.4, 0.03, 0.5]} radius={0.014} color="#ca8a04" />
      <WireSegment p1={[-0.4, 0.03, 0.5]} p2={[-0.48, 0.16, -0.4]} radius={0.014} color="#f97316" />
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
        camera={{ position: isCompleted ? [0, 3.2, 3.8] : [0, 2.0, 2.8], fov: 35 }}
        gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true }}
      >
        <ambientLight intensity={1.3} />
        <pointLight position={[10, 10, 10]} intensity={1.8} castShadow />
        <pointLight position={[-10, 5, -10]} intensity={0.6} />
        <directionalLight position={[0, 6, 3]} intensity={1.4} />

        <Center>
          {renderModel()}
        </Center>

        <OrbitControls
          enableDamping={true}
          dampingFactor={0.06}
          minDistance={1.5}
          maxDistance={6.0}
          makeDefault
        />
      </Canvas>
    </div>
  );
}
