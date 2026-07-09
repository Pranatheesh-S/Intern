import React from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';

const SpoonModel = () => (
  <group rotation={[0.2, 0.5, 0.4]}>
    {/* Handle */}
    <mesh castShadow position={[0, 0.6, 0]}>
      <cylinderGeometry args={[0.04, 0.04, 1.4, 16]} />
      <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.8} />
    </mesh>
    {/* Head connection */}
    <mesh castShadow position={[0, -0.15, 0]}>
      <boxGeometry args={[0.08, 0.15, 0.04]} />
      <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.8} />
    </mesh>
    {/* Bowl of Spoon */}
    <mesh castShadow position={[0, -0.45, 0.06]} scale={[1, 1.3, 0.4]}>
      <sphereGeometry args={[0.25, 32, 16]} />
      <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.8} />
    </mesh>
  </group>
);

const ChairModel = () => (
  <group position={[0, -0.4, 0]}>
    {/* Seat */}
    <mesh castShadow position={[0, 0.4, 0]}>
      <boxGeometry args={[0.9, 0.08, 0.9]} />
      <meshStandardMaterial color="#78350f" roughness={0.7} />
    </mesh>
    {/* Legs */}
    <mesh castShadow position={[-0.38, 0.18, -0.38]}>
      <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
      <meshStandardMaterial color="#78350f" roughness={0.7} />
    </mesh>
    <mesh castShadow position={[0.38, 0.18, -0.38]}>
      <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
      <meshStandardMaterial color="#78350f" roughness={0.7} />
    </mesh>
    <mesh castShadow position={[-0.38, 0.18, 0.38]}>
      <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
      <meshStandardMaterial color="#78350f" roughness={0.7} />
    </mesh>
    <mesh castShadow position={[0.38, 0.18, 0.38]}>
      <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
      <meshStandardMaterial color="#78350f" roughness={0.7} />
    </mesh>
    {/* Backrest Spindles */}
    <mesh castShadow position={[-0.35, 0.75, -0.35]}>
      <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
      <meshStandardMaterial color="#78350f" roughness={0.7} />
    </mesh>
    <mesh castShadow position={[0.35, 0.75, -0.35]}>
      <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
      <meshStandardMaterial color="#78350f" roughness={0.7} />
    </mesh>
    {/* Backrest Top panel */}
    <mesh castShadow position={[0, 1.05, -0.35]}>
      <boxGeometry args={[0.8, 0.12, 0.06]} />
      <meshStandardMaterial color="#78350f" roughness={0.7} />
    </mesh>
  </group>
);

const TumblerModel = () => (
  <group position={[0, -0.2, 0]}>
    {/* Cylinder Glass Base */}
    <mesh castShadow>
      <cylinderGeometry args={[0.45, 0.35, 1.1, 32, 1, true]} />
      <meshStandardMaterial color="#bae6fd" roughness={0.1} metalness={0.1} transparent opacity={0.6} side={THREE.DoubleSide} />
    </mesh>
    {/* Glass Bottom cap */}
    <mesh castShadow position={[0, -0.54, 0]}>
      <cylinderGeometry args={[0.35, 0.35, 0.04, 32]} />
      <meshStandardMaterial color="#bae6fd" roughness={0.1} metalness={0.1} transparent opacity={0.7} />
    </mesh>
    {/* Water Inside */}
    <mesh position={[0, -0.1, 0]}>
      <cylinderGeometry args={[0.4, 0.36, 0.8, 32]} />
      <meshStandardMaterial color="#0284c7" roughness={0.1} transparent opacity={0.55} />
    </mesh>
  </group>
);

const RulerModel = () => (
  <group rotation={[0.4, -0.6, 0.1]}>
    <mesh castShadow>
      <boxGeometry args={[1.5, 0.25, 0.03]} />
      <meshStandardMaterial color="#2563eb" roughness={0.2} transparent opacity={0.7} />
    </mesh>
    {/* Tick marks representation */}
    <mesh position={[0, 0.11, 0.018]}>
      <boxGeometry args={[1.3, 0.02, 0.005]} />
      <meshStandardMaterial color="#ffffff" roughness={0.5} />
    </mesh>
  </group>
);

const BootModel = () => (
  <group position={[0, -0.35, 0]} rotation={[0, 0.4, 0]}>
    {/* Boot Sole */}
    <mesh castShadow position={[0, 0.05, 0.1]}>
      <boxGeometry args={[0.45, 0.08, 0.95]} />
      <meshStandardMaterial color="#1e293b" roughness={0.9} />
    </mesh>
    {/* Boot Foot */}
    <mesh castShadow position={[0, 0.2, 0.15]} scale={[1, 0.8, 1.2]}>
      <sphereGeometry args={[0.22, 16, 16]} />
      <meshStandardMaterial color="#7c2d12" roughness={0.8} />
    </mesh>
    {/* Boot Shaft (Leg) */}
    <mesh castShadow position={[0, 0.45, 0]}>
      <cylinderGeometry args={[0.2, 0.22, 0.6, 16]} />
      <meshStandardMaterial color="#7c2d12" roughness={0.8} />
    </mesh>
  </group>
);

const ShirtModel = () => (
  <group position={[0, -0.15, 0]} rotation={[0, 0.2, 0]}>
    {/* Torso */}
    <mesh castShadow position={[0, 0.1, 0]}>
      <boxGeometry args={[0.75, 0.9, 0.18]} />
      <meshStandardMaterial color="#bae6fd" roughness={0.9} />
    </mesh>
    {/* Left Sleeve */}
    <mesh castShadow position={[-0.48, 0.35, 0]} rotation={[0, 0, Math.PI / 4]}>
      <boxGeometry args={[0.3, 0.2, 0.18]} />
      <meshStandardMaterial color="#bae6fd" roughness={0.9} />
    </mesh>
    {/* Right Sleeve */}
    <mesh castShadow position={[0.48, 0.35, 0]} rotation={[0, 0, -Math.PI / 4]}>
      <boxGeometry args={[0.3, 0.2, 0.18]} />
      <meshStandardMaterial color="#bae6fd" roughness={0.9} />
    </mesh>
  </group>
);

export default function ThreeDObjectViewer({ objectId }) {
  const renderModel = () => {
    switch (objectId) {
      case 'spoon': return <SpoonModel />;
      case 'chair': return <ChairModel />;
      case 'tumbler': return <TumblerModel />;
      case 'ruler': return <RulerModel />;
      case 'boot': return <BootModel />;
      case 'shirt': return <ShirtModel />;
      default: return null;
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '140px', position: 'relative' }}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 2.0], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.6} />
        <pointLight position={[4, 4, 4]} intensity={1.5} castShadow />
        <directionalLight position={[-4, 4, 2]} intensity={1.2} />
        <Center>
          {renderModel()}
        </Center>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={true} autoRotateSpeed={1.8} />
      </Canvas>
    </div>
  );
}
