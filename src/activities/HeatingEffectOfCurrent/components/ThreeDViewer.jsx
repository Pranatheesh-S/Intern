import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function CardboardBaseModel() {
  return (
    <group scale={3}>
      <mesh receiveShadow castShadow>
        <boxGeometry args={[3, 0.1, 1.5]} />
        <meshStandardMaterial color="#d2b48c" roughness={0.9} />
      </mesh>
    </group>
  );
}

function NailModel() {
  return (
    <group scale={6} rotation={[Math.PI / 2, 0, 0]}>
      {/* Head */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.05, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Tip */}
      <mesh position={[0, -0.45, 0]} castShadow>
        <coneGeometry args={[0.05, 0.1, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function NichromeWireModel() {
  return (
    <group scale={4}>
      <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 2, 16]} />
        <meshStandardMaterial color="#6b7280" metalness={0.9} roughness={0.4} />
      </mesh>
    </group>
  );
}

function CardboardSwitchModel() {
  return (
    <group scale={3}>
      <mesh position={[0, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.5, 0.1, 1.5]} />
        <meshStandardMaterial color="#d2b48c" roughness={0.9} />
      </mesh>
      <mesh position={[-0.8, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.8, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function DrawingPinModel() {
  return (
    <group scale={8}>
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.05, 16]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function SafetyPinModel() {
  return (
    <group scale={6}>
      <mesh castShadow position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.03, 1.5, 8, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh castShadow position={[-0.75, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.1, 0.03, 8, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

function BatteryModel() {
  return (
    <group scale={5} rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.25, 0.25, 1, 32]} />
        <meshStandardMaterial color="#ef4444" metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.52, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function AutoRotateGroup({ children }) {
  const groupRef = useRef();
  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.01;
  });
  return <group ref={groupRef}>{children}</group>;
}

export default function ThreeDViewer({ modelId }) {
  const getModel = () => {
    switch (modelId) {
      case "base": return <CardboardBaseModel />;
      case "nail1": case "nail2": return <NailModel />;
      case "nichrome": return <NichromeWireModel />;
      case "switchBoard": return <CardboardSwitchModel />;
      case "pin1": case "pin2": return <DrawingPinModel />;
      case "safetyPin": return <SafetyPinModel />;
      case "battery": return <BatteryModel />;
      default: return null;
    }
  };

  return (
    <Canvas camera={{ position: [0, 2, 5], fov: 45 }} shadows>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow shadow-mapSize={1024} />
      <Environment preset="city" />
      <AutoRotateGroup>
        {getModel()}
      </AutoRotateGroup>
      <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={10} blur={2} far={4} />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
