import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Cylinder, Box } from '@react-three/drei';
import * as THREE from 'three';

function AutoRotateGroup({ children }) {
  const groupRef = useRef();
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });
  return <group ref={groupRef}>{children}</group>;
}

const SwitchBoardModel = () => (
  <group>
    <mesh castShadow receiveShadow>
      <boxGeometry args={[3.2, 0.12, 2.4]} />
      <meshStandardMaterial color="#c2a67a" roughness={0.85} metalness={0.05} />
    </mesh>
    <mesh position={[0, 0.065, 0]}>
      <boxGeometry args={[3.0, 0.01, 2.2]} />
      <meshStandardMaterial color="#ab8e5f" roughness={0.9} wireframe={true} />
    </mesh>
  </group>
);

const DrawingPinModel = () => (
  <group scale={1.5}>
    <mesh castShadow position={[0, 0.05, 0]}>
      <cylinderGeometry args={[0.6, 0.6, 0.06, 32]} />
      <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.15} />
    </mesh>
    <mesh castShadow position={[0, 0.12, 0]}>
      <cylinderGeometry args={[0.35, 0.35, 0.08, 32]} />
      <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.1} />
    </mesh>
    <mesh position={[-0.1, 0.17, -0.1]}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial color="#fef9c3" roughness={0.1} opacity={0.6} transparent />
    </mesh>
    <mesh position={[0, -0.3, 0]}>
      <cylinderGeometry args={[0.03, 0.01, 0.6, 16]} />
      <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.2} />
    </mesh>
  </group>
);

const SafetyPinModel = () => (
  <group rotation={[Math.PI / 2, 0, 0]} scale={[1.2, 1.2, 1.2]}>
    <mesh castShadow position={[-0.15, 0, 0]}>
      <cylinderGeometry args={[0.035, 0.035, 1.8, 16]} />
      <meshStandardMaterial color="#9ca3af" metalness={0.95} roughness={0.1} />
    </mesh>
    <mesh castShadow position={[0.15, -0.1, 0]} rotation={[0, 0, -Math.PI / 10]}>
      <cylinderGeometry args={[0.03, 0.03, 1.6, 16]} />
      <meshStandardMaterial color="#9ca3af" metalness={0.95} roughness={0.1} />
    </mesh>
    <mesh castShadow position={[0, -0.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.15, 0.04, 16, 32]} />
      <meshStandardMaterial color="#9ca3af" metalness={0.95} roughness={0.1} />
    </mesh>
    <mesh castShadow position={[-0.05, 0.9, 0]}>
      <boxGeometry args={[0.32, 0.28, 0.16]} />
      <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.3} />
    </mesh>
  </group>
);

function NailModel() {
  return (
    <group position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} scale={1.5}>
      <Cylinder args={[0.3, 0.3, 0.1, 16]} position={[0, 1.5, 0]}>
        <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
      </Cylinder>
      <Cylinder args={[0.1, 0.1, 3, 16]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
      </Cylinder>
      <Cylinder args={[0.1, 0.0, 0.3, 16]} position={[0, -1.65, 0]}>
        <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
      </Cylinder>
    </group>
  );
}

function CoilModel() {
  return (
    <group scale={2}>
      {Array.from({ length: 15 }).map((_, i) => {
        const yPos = -1.0 + (i * 0.15);
        return (
          <mesh key={i} position={[0, yPos, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.2, 0.04, 8, 24]} />
            <meshStandardMaterial color="#b45309" roughness={0.4} metalness={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}

function BatteryModel() {
  return (
    <group rotation={[0, 0, Math.PI / 2]} scale={2.5}>
      <Cylinder args={[0.3, 0.3, 0.7, 16]}>
        <meshStandardMaterial color="#ef4444" />
      </Cylinder>
      <Cylinder args={[0.1, 0.1, 0.1, 16]} position={[0, 0.4, 0]}>
        <meshStandardMaterial color="#94a3b8" metalness={0.8} />
      </Cylinder>
    </group>
  );
}

function SwitchModel() {
  return (
    <group scale={1.5}>
      <Box args={[1, 0.1, 0.5]}>
        <meshStandardMaterial color="#475569" />
      </Box>
      <Box args={[0.1, 0.2, 0.1]} position={[-0.3, 0.1, 0]}>
        <meshStandardMaterial color="#94a3b8" metalness={0.8} />
      </Box>
      <Box args={[0.1, 0.2, 0.1]} position={[0.3, 0.1, 0]}>
        <meshStandardMaterial color="#94a3b8" metalness={0.8} />
      </Box>
      <mesh position={[-0.3, 0.15, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.03, 0.03, 0.7]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} />
      </mesh>
    </group>
  );
}

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

function WiresModel() {
  const points = [
    [-1.0, -0.3, 0.2],
    [-0.85, -0.25, 0.15],
    [-0.6, -0.05, 0.05],
    [-0.3, 0.15, -0.05],
    [0.0, 0.2, -0.1],
    [0.3, 0.1, -0.05],
    [0.6, -0.1, 0.05],
    [0.8, -0.22, 0.1],
    [0.9, -0.25, 0.12],
    [1.0, -0.3, 0.15]
  ];

  return (
    <group rotation={[0.1, 0.2, 0]} scale={1.5}>
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
}

export default function ThreeDViewer({ componentId }) {
  const getModel = () => {
    switch (componentId) {
      case 'switchBoard': return <SwitchBoardModel />;
      case 'pin1':
      case 'pin2': return <DrawingPinModel />;
      case 'safetyPin': return <SafetyPinModel />;
      case 'nail': return <NailModel />;
      case 'wire': return <CoilModel />;
      case 'battery': return <BatteryModel />;
      case 'switch': return <SwitchModel />;
      case 'connect': return <WiresModel />;
      default: return null;
    }
  };

  return (
    <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Environment preset="city" />
      <AutoRotateGroup>
        {getModel()}
      </AutoRotateGroup>
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
