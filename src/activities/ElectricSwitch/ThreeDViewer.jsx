import React from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';

// --- Smooth Curved 3D Wire Component ---
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

// --- Cardboard 3D Model ---
const CardboardModel = () => (
  <group>
    {/* Cardboard Plate */}
    <mesh castShadow receiveShadow position={[0, 0, 0]}>
      <boxGeometry args={[3.2, 0.1, 2.2]} />
      <meshStandardMaterial color="#d4b583" roughness={0.85} metalness={0.02} />
    </mesh>
    {/* Clean Beveled Border Overlay */}
    <mesh position={[0, 0.052, 0]}>
      <boxGeometry args={[3.05, 0.002, 2.05]} />
      <meshStandardMaterial color="#b89762" roughness={0.9} />
    </mesh>
  </group>
);

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
  const wirePoints = [
    [-0.8, -0.15, 0.1],
    [-0.5, -0.08, 0.05],
    [-0.2, 0.08, -0.05],
    [0.1, 0.12, -0.08],
    [0.4, 0.02, -0.02],
    [0.7, -0.12, 0.08],
  ];

  return (
    <group rotation={[0.1, 0.2, 0]}>
      <CurvedWire points={wirePoints} color="#dc2626" radius={0.025} />
    </group>
  );
};

// --- Completed Switch Assembly 3D Model ---
const CompletedSwitchModel = () => {
  // Wire 1: Battery Neg (-) to Bulb Left terminal
  const wire1Points = [
    [0.18, 0.2, -0.4],       // Battery Neg (-)
    [-0.1, 0.08, -0.55],     // Curve midpoint
    [-0.5, 0.08, -0.55],     // Curve approach
    [-0.7, 0.15, -0.4]       // Bulb Left terminal
  ];

  // Wire 2: Battery Pos (+) to Drawing Pin 2
  const wire2Points = [
    [0.82, 0.2, -0.4],       // Battery Pos (+)
    [1.0, 0.08, -0.1],       // Curve outer loop
    [0.75, 0.08, 0.35],      // Curve approach
    [0.4, 0.07, 0.4]         // Drawing Pin 2
  ];

  // Wire 3: Drawing Pin 1 to Bulb Right terminal
  const wire3Points = [
    [-0.5, 0.07, 0.4],       // Drawing Pin 1
    [-0.8, 0.08, 0.2],       // Curve outer loop
    [-0.75, 0.08, -0.2],     // Curve approach
    [-0.7, 0.15, -0.4]       // Bulb Right terminal
  ];

  return (
    <group position={[0, -0.05, 0]}>
      {/* Cardboard Base */}
      <CardboardModel />

      {/* Battery (lying flat upper right) */}
      <group position={[0.5, 0.2, -0.4]}>
        <BatteryModel />
      </group>

      {/* Bulb (upper left) */}
      <group position={[-0.7, 0.25, -0.4]}>
        <BulbModel />
      </group>

      {/* Drawing Pin 1 (pivot terminal) */}
      <group position={[-0.5, 0.05, 0.4]}>
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
        camera={{ position: isCompleted ? [0, 2.5, 3.4] : [0, 1.8, 2.5], fov: 40 }}
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
