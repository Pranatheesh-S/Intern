import React from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';

const PotatoModel = ({ colorOverride }) => (
  <mesh castShadow scale={[1, 0.75, 0.85]}>
    <sphereGeometry args={[1.2, 32, 32]} />
    <meshStandardMaterial color={colorOverride || "#d4a373"} roughness={0.9} metalness={0.1} />
  </mesh>
);

const CucumberModel = ({ colorOverride }) => (
  <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
    <cylinderGeometry args={[0.5, 0.5, 2.2, 32]} />
    <meshStandardMaterial color={colorOverride || "#a7c957"} roughness={0.7} metalness={0.1} />
  </mesh>
);

const BreadModel = ({ colorOverride }) => (
  <group>
    {/* Bread Slice Base (Crumb) */}
    <mesh castShadow position={[0, -0.2, 0]}>
      <boxGeometry args={[1.7, 1.3, 0.4]} />
      <meshStandardMaterial color={colorOverride || "#fef08a"} roughness={0.9} />
    </mesh>
    {/* Bread Slice Crust (Slightly larger in X/Y but thinner in Z) */}
    <mesh castShadow position={[0, -0.2, 0]}>
      <boxGeometry args={[1.8, 1.4, 0.3]} />
      <meshStandardMaterial color={colorOverride || "#c2410c"} roughness={0.9} />
    </mesh>
    
    {/* Bread Crust Top */}
    <mesh castShadow position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.9, 0.9, 0.3, 32, 1, false, 0, Math.PI]} />
      <meshStandardMaterial color={colorOverride || "#c2410c"} roughness={0.9} />
    </mesh>
    {/* Bread Crumb Top */}
    <mesh castShadow position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.85, 0.85, 0.4, 32, 1, false, 0, Math.PI]} />
      <meshStandardMaterial color={colorOverride || "#fef08a"} roughness={0.9} />
    </mesh>
  </group>
);

const RiceModel = ({ colorOverride }) => (
  <group>
    <mesh castShadow position={[-0.3, 0, 0.2]} rotation={[0.2, 0.5, 0]}>
      <capsuleGeometry args={[0.2, 0.8, 16, 16]} />
      <meshStandardMaterial color={colorOverride || "#ffffff"} roughness={0.5} />
    </mesh>
    <mesh castShadow position={[0.2, 0.1, -0.1]} rotation={[-0.3, -0.4, 0.2]}>
      <capsuleGeometry args={[0.2, 0.8, 16, 16]} />
      <meshStandardMaterial color={colorOverride || "#ffffff"} roughness={0.5} />
    </mesh>
    <mesh castShadow position={[0, -0.2, 0.1]} rotation={[0.5, 0.1, 0.5]}>
      <capsuleGeometry args={[0.2, 0.8, 16, 16]} />
      <meshStandardMaterial color={colorOverride || "#ffffff"} roughness={0.5} />
    </mesh>
  </group>
);

const GramModel = ({ colorOverride }) => (
  <mesh castShadow>
    <sphereGeometry args={[0.8, 32, 32]} />
    <meshStandardMaterial color={colorOverride || "#ca8a04"} roughness={0.8} />
  </mesh>
);

const PeanutModel = ({ colorOverride }) => (
  <group>
    {/* Several small crushed peanut pieces */}
    <mesh castShadow position={[-0.3, 0.2, 0.1]} rotation={[0.2, 0.1, 0]}>
      <boxGeometry args={[0.4, 0.3, 0.5]} />
      <meshStandardMaterial color={colorOverride || "#d4a373"} roughness={0.9} />
    </mesh>
    <mesh castShadow position={[0.2, -0.1, 0.3]} rotation={[0.5, 0.4, 0.1]}>
      <boxGeometry args={[0.5, 0.4, 0.3]} />
      <meshStandardMaterial color={colorOverride || "#d4a373"} roughness={0.9} />
    </mesh>
    <mesh castShadow position={[0.1, 0.3, -0.2]} rotation={[0.1, 0.8, 0.5]}>
      <boxGeometry args={[0.3, 0.5, 0.4]} />
      <meshStandardMaterial color={colorOverride || "#d4a373"} roughness={0.9} />
    </mesh>
    <mesh castShadow position={[-0.2, -0.2, -0.1]} rotation={[0.9, 0.1, 0.2]}>
      <boxGeometry args={[0.4, 0.4, 0.4]} />
      <meshStandardMaterial color={colorOverride || "#d4a373"} roughness={0.9} />
    </mesh>
  </group>
);

const OilModel = ({ colorOverride }) => (
  <mesh castShadow scale={[1, 0.3, 1]}>
    <sphereGeometry args={[1.2, 32, 32]} />
    <meshStandardMaterial color={colorOverride || "#fef08a"} roughness={0.1} metalness={0.2} transparent opacity={0.8} />
  </mesh>
);

const ButterModel = ({ colorOverride }) => (
  <mesh castShadow>
    <boxGeometry args={[1.5, 0.8, 1.2]} />
    <meshStandardMaterial color={colorOverride || "#fef3c7"} roughness={0.4} />
  </mesh>
);

const CoconutModel = ({ colorOverride }) => (
  <group rotation={[-Math.PI / 3, 0, 0]} position={[0, 0.2, 0]}>
    {/* Outer Shell */}
    <mesh castShadow>
      <sphereGeometry args={[1.2, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color="#5c4033" roughness={1} />
    </mesh>
    {/* Inner White Meat */}
    <mesh castShadow position={[0, -0.05, 0]}>
      <sphereGeometry args={[1.15, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color={colorOverride || "#f8fafc"} roughness={0.9} />
    </mesh>
    {/* Flat top surface to cap the meat */}
    <mesh castShadow rotation={[Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
      <cylinderGeometry args={[1.15, 1.15, 0.05, 32]} />
      <meshStandardMaterial color={colorOverride || "#f8fafc"} roughness={0.9} />
    </mesh>
  </group>
);

export default function ThreeDFoodViewer({ foodId, colorOverride }) {
  const renderModel = () => {
    switch (foodId) {
      case 'potato': return <PotatoModel colorOverride={colorOverride} />;
      case 'cucumber': return <CucumberModel colorOverride={colorOverride} />;
      case 'bread': return <BreadModel colorOverride={colorOverride} />;
      case 'rice': return <RiceModel colorOverride={colorOverride} />;
      case 'gram': return <GramModel colorOverride={colorOverride} />;
      case 'peanuts': return <PeanutModel colorOverride={colorOverride} />;
      case 'oil': return <OilModel colorOverride={colorOverride} />;
      case 'butter': return <ButterModel colorOverride={colorOverride} />;
      case 'coconut': return <CoconutModel colorOverride={colorOverride} />;
      default: return null;
    }
  };

  return (
    <div style={{ width: '100%', height: '100%' }} className="three-d-food">
      <Canvas
        shadows
        camera={{ position: [0, 2, 3.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.5} />
        <pointLight position={[5, 5, 5]} intensity={1.5} castShadow />
        <directionalLight position={[-5, 5, 2]} intensity={1} />
        <Center>
          {renderModel()}
        </Center>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={true} autoRotateSpeed={2} />
      </Canvas>
    </div>
  );
}
