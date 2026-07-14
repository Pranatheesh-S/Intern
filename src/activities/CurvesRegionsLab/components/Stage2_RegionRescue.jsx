import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Sparkles, CheckSquare, Shield, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

const createGableShape = () => {
  const shape = new THREE.Shape();
  shape.moveTo(-1.12, 1.0);
  shape.lineTo(1.12, 1.0);
  shape.lineTo(0, 1.65);
  shape.closePath();
  return shape;
};
const gableShape = createGableShape();

// 3D Voxel/Primitive Puppy Companion Model
function VoxelPuppy({ happy }) {
  const tailRef = useRef();

  useFrame((state) => {
    if (happy && tailRef.current) {
      // Wag tail rapidly when happy
      tailRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 15) * 0.6;
    }
  });

  return (
    <group position={[0.5, -0.15, -0.2]}>
      {/* Little Red Rug underneath */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.01, 32]} />
        <meshStandardMaterial color="#991b1b" roughness={0.9} />
      </mesh>

      {/* Puppy Body */}
      <mesh position={[0, 0.12, 0]} castShadow>
        <boxGeometry args={[0.22, 0.18, 0.32]} />
        <meshStandardMaterial color="#d97706" roughness={0.85} /> {/* Golden Brown */}
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.28, 0.1]} castShadow>
        <boxGeometry args={[0.18, 0.16, 0.18]} />
        <meshStandardMaterial color="#d97706" roughness={0.85} />
      </mesh>

      {/* Snout/Mouth */}
      <mesh position={[0, 0.24, 0.2]} castShadow>
        <boxGeometry args={[0.1, 0.07, 0.08]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.8} /> {/* Cream snout */}
      </mesh>

      {/* Nose */}
      <mesh position={[0, 0.28, 0.23]}>
        <boxGeometry args={[0.04, 0.03, 0.03]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.06, 0.3, 0.18]}>
        <boxGeometry args={[0.02, 0.04, 0.02]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.06, 0.3, 0.18]}>
        <boxGeometry args={[0.02, 0.04, 0.02]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Flappy Ears */}
      <mesh position={[-0.1, 0.28, 0.08]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.04, 0.14, 0.08]} />
        <meshStandardMaterial color="#b45309" roughness={0.85} /> {/* Darker brown ears */}
      </mesh>
      <mesh position={[0.1, 0.28, 0.08]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.04, 0.14, 0.08]} />
        <meshStandardMaterial color="#b45309" roughness={0.85} />
      </mesh>

      {/* Front Paws */}
      <mesh position={[-0.07, 0.04, 0.1]} castShadow>
        <boxGeometry args={[0.06, 0.08, 0.06]} />
        <meshStandardMaterial color="#d97706" />
      </mesh>
      <mesh position={[0.07, 0.04, 0.1]} castShadow>
        <boxGeometry args={[0.06, 0.08, 0.06]} />
        <meshStandardMaterial color="#d97706" />
      </mesh>

      {/* Back Legs */}
      <mesh position={[-0.08, 0.04, -0.1]} castShadow>
        <boxGeometry args={[0.06, 0.08, 0.06]} />
        <meshStandardMaterial color="#b45309" />
      </mesh>
      <mesh position={[0.08, 0.04, -0.1]} castShadow>
        <boxGeometry args={[0.06, 0.08, 0.06]} />
        <meshStandardMaterial color="#b45309" />
      </mesh>

      {/* Tail */}
      <group ref={tailRef} position={[0, 0.18, -0.16]}>
        <mesh rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.03, 0.03, 0.12]} />
          <meshStandardMaterial color="#d97706" />
        </mesh>
      </group>
    </group>
  );
}

// 3D Furniture to populate the Interior
function VoxelFurniture() {
  return (
    <group position={[0, -0.15, 0]}>
      {/* Cozy Rug */}
      <mesh position={[-0.4, 0.005, -0.4]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[0.4, 0.005, 0.4]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.9} />
      </mesh>

      {/* Small Cozy Side-Drawer */}
      <mesh position={[-0.8, 0.15, -0.7]} castShadow>
        <boxGeometry args={[0.2, 0.3, 0.2]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>
      {/* Knobs */}
      <mesh position={[-0.69, 0.22, -0.7]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>
      <mesh position={[-0.69, 0.1, -0.7]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>

      {/* Decorative flower pot */}
      <mesh position={[-0.8, 0.34, -0.7]}>
        <cylinderGeometry args={[0.06, 0.04, 0.08, 12]} />
        <meshStandardMaterial color="#d97706" />
      </mesh>
      <mesh position={[-0.8, 0.42, -0.7]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#22c55e" roughness={0.9} />
      </mesh>
    </group>
  );
}

// Pulse-glowing Holographic Ring Component
function PulsingTargetRing({ position, rotation, color, visible }) {
  const ringRef = useRef();

  useFrame((state) => {
    if (ringRef.current && visible) {
      const t = state.clock.getElapsedTime();
      const scale = 1 + Math.sin(t * 8) * 0.12;
      const opacity = 0.4 + Math.sin(t * 8) * 0.25;
      ringRef.current.scale.set(scale, scale, scale);
      ringRef.current.material.opacity = opacity;
    }
  });

  if (!visible) return null;

  return (
    <mesh ref={ringRef} position={position} rotation={rotation}>
      <torusGeometry args={[0.24, 0.025, 8, 24]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} depthWrite={false} />
    </mesh>
  );
}

// Main 3D Scene Wrapper
function HouseLabScene({
  boneInInterior,
  sensorOnBoundary,
  puddleInExterior,
  selectedItem,
  onZoneClick,
  allClear,
  isDarkMode,
  bonePos,
  sensorPos,
  puddlePos,
  setBonePos,
  setSensorPos,
  setPuddlePos,
  draggedItem,
  setDraggedItem,
  draggedItemRef,
  setControlsEnabled,
  handleDrop
}) {
  return (
    <group>
      {/* Atmospheric lighting based on Day/Night theme */}
      <ambientLight intensity={isDarkMode ? 0.32 : 0.72} />
      <directionalLight 
        position={[5, 12, 5]} 
        intensity={isDarkMode ? 0.48 : 1.1} 
        color={isDarkMode ? "#93c5fd" : "#fffbeb"}
        castShadow 
        shadow-mapSize={[1024, 1024]}
      />
      {/* Warm internal house lighting */}
      <pointLight 
        position={[0, 0.8, 0]} 
        intensity={isDarkMode ? 1.25 : 0.25} 
        color="#fef08a" 
        distance={2.5}
      />

      {/* EXTERIOR (Yard Base Lawn & Drag Plane) */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.16, 0]} 
        receiveShadow
        onPointerMove={(e) => {
          const activeDrag = draggedItemRef.current;
          if (!activeDrag) return;
          e.stopPropagation();
          const targetCoords = [e.point.x, -0.05, e.point.z];
          if (activeDrag === 'bone') setBonePos(targetCoords);
          else if (activeDrag === 'sensor') setSensorPos(targetCoords);
          else if (activeDrag === 'puddle') setPuddlePos([e.point.x, -0.14, e.point.z]);
        }}
        onPointerUp={(e) => {
          const activeDrag = draggedItemRef.current;
          if (!activeDrag) return;
          e.stopPropagation();
          handleDrop(activeDrag);
        }}
      >
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color={isDarkMode ? "#0b3c20" : "#15803d"} roughness={0.9} />
      </mesh>

      {/* Decorative outdoor flowers/bushes */}
      <group>
        <mesh position={[2.5, -0.15, -1.8]}><boxGeometry args={[0.2, 0.2, 0.2]} /><meshStandardMaterial color="#22c55e" /></mesh>
        <mesh position={[-2.4, -0.15, 1.8]}><boxGeometry args={[0.2, 0.2, 0.2]} /><meshStandardMaterial color="#22c55e" /></mesh>
      </group>

      {/* SUPPLY PLATFORM (Wooden Deck where items sit initially) */}
      <mesh position={[-2.1, -0.12, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.7, 0.08, 1.3]} />
        <meshStandardMaterial color="#4b5563" roughness={0.7} /> {/* Gray metal/wood platform */}
      </mesh>

      {/* Street Lamp 1 (near supply platform) */}
      <group position={[-2.6, -0.16, 1.2]}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.03, 0.9, 8]} />
          <meshStandardMaterial color="#1f2937" roughness={0.5} />
        </mesh>
        <mesh position={[0.05, 0.9, 0]} castShadow>
          <boxGeometry args={[0.12, 0.02, 0.04]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh position={[0.1, 0.82, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.035, 0.1, 6]} />
          <meshStandardMaterial color="#374151" roughness={0.3} />
        </mesh>
        <mesh position={[0.1, 0.75, 0]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color={isDarkMode ? "#fef08a" : "#9ca3af"} />
        </mesh>
        {isDarkMode && (
          <pointLight
            position={[0.1, 0.72, 0]}
            intensity={2.8}
            distance={5.0}
            color="#fef08a"
            castShadow
            shadow-bias={-0.002}
          />
        )}
      </group>

      {/* Street Lamp 2 (near sprinkler zone) */}
      <group position={[2.6, -0.16, 1.2]}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.03, 0.9, 8]} />
          <meshStandardMaterial color="#1f2937" roughness={0.5} />
        </mesh>
        <mesh position={[-0.05, 0.9, 0]} castShadow>
          <boxGeometry args={[0.12, 0.02, 0.04]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh position={[-0.1, 0.82, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.035, 0.1, 6]} />
          <meshStandardMaterial color="#374151" roughness={0.3} />
        </mesh>
        <mesh position={[-0.1, 0.75, 0]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color={isDarkMode ? "#fef08a" : "#9ca3af"} />
        </mesh>
        {isDarkMode && (
          <pointLight
            position={[-0.1, 0.72, 0]}
            intensity={2.8}
            distance={5.0}
            color="#fef08a"
            castShadow
            shadow-bias={-0.002}
          />
        )}
      </group>

      {/* 3D HOUSE FRAME (CLOSED BOUNDARY STRUCTURE) */}
      {/* Wood floor representing the interior footprint */}
      <mesh position={[0, -0.1, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.4, 0.1, 2.0]} />
        <meshStandardMaterial color="#854d0e" roughness={0.8} />
      </mesh>

      {/* Corner Pillars */}
      <mesh position={[-1.15, 0.5, -0.95]} castShadow>
        <boxGeometry args={[0.08, 1.1, 0.08]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.5} />
      </mesh>
      <mesh position={[1.15, 0.5, -0.95]} castShadow>
        <boxGeometry args={[0.08, 1.1, 0.08]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.5} />
      </mesh>
      <mesh position={[-1.15, 0.5, 0.95]} castShadow>
        <boxGeometry args={[0.08, 1.1, 0.08]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.5} />
      </mesh>
      <mesh position={[1.15, 0.5, 0.95]} castShadow>
        <boxGeometry args={[0.08, 1.1, 0.08]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.5} />
      </mesh>

      {/* Transparent Glass Walls */}
      <mesh position={[-1.15, 0.5, 0]}>
        <boxGeometry args={[0.02, 1.0, 1.84]} />
        <meshStandardMaterial color="#bfdbfe" transparent opacity={0.12} roughness={0.05} metalness={0.95} />
      </mesh>
      <mesh position={[1.15, 0.5, 0]}>
        <boxGeometry args={[0.02, 1.0, 1.84]} />
        <meshStandardMaterial color="#bfdbfe" transparent opacity={0.12} roughness={0.05} metalness={0.95} />
      </mesh>
      <mesh position={[0, 0.5, -0.95]}>
        <boxGeometry args={[2.22, 1.0, 0.02]} />
        <meshStandardMaterial color="#bfdbfe" transparent opacity={0.12} roughness={0.05} metalness={0.95} />
      </mesh>
      {/* Front glass segments beside entrance */}
      <mesh position={[-0.8, 0.5, 0.95]}>
        <boxGeometry args={[0.62, 1.0, 0.02]} />
        <meshStandardMaterial color="#bfdbfe" transparent opacity={0.12} roughness={0.05} metalness={0.95} />
      </mesh>
      <mesh position={[0.8, 0.5, 0.95]}>
        <boxGeometry args={[0.62, 1.0, 0.02]} />
        <meshStandardMaterial color="#bfdbfe" transparent opacity={0.12} roughness={0.05} metalness={0.95} />
      </mesh>

      {/* Front Gable Glass */}
      <mesh position={[0, 0, 0.95]}>
        <shapeGeometry args={[gableShape]} />
        <meshStandardMaterial color="#bfdbfe" transparent opacity={0.15} roughness={0.05} metalness={0.95} side={THREE.DoubleSide} />
      </mesh>

      {/* Back Gable Glass */}
      <mesh position={[0, 0, -0.95]}>
        <shapeGeometry args={[gableShape]} />
        <meshStandardMaterial color="#bfdbfe" transparent opacity={0.15} roughness={0.05} metalness={0.95} side={THREE.DoubleSide} />
      </mesh>

      {/* Door frame */}
      <mesh position={[-0.45, 0.45, 0.95]} castShadow>
        <boxGeometry args={[0.06, 1.0, 0.06]} />
        <meshStandardMaterial color="#451a03" roughness={0.7} />
      </mesh>
      <mesh position={[0.45, 0.45, 0.95]} castShadow>
        <boxGeometry args={[0.06, 1.0, 0.06]} />
        <meshStandardMaterial color="#451a03" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.92, 0.95]}>
        <boxGeometry args={[0.96, 0.06, 0.06]} />
        <meshStandardMaterial color="#451a03" roughness={0.7} />
      </mesh>

      {/* Slanted Roof Panels */}
      <mesh position={[-0.606, 1.35, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
        <boxGeometry args={[1.4, 0.06, 2.1]} />
        <meshStandardMaterial color="#d84315" roughness={0.6} /> {/* Terracotta tiles */}
      </mesh>
      <mesh position={[0.606, 1.35, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
        <boxGeometry args={[1.4, 0.06, 2.1]} />
        <meshStandardMaterial color="#d84315" roughness={0.6} />
      </mesh>
      {/* Ridge beam */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <boxGeometry args={[0.08, 0.08, 2.1]} />
        <meshStandardMaterial color="#451a03" roughness={0.8} />
      </mesh>

      {/* BOUNDARY WIRE LOOP */}
      {/* Back Wire */}
      <mesh position={[0, -0.04, -0.94]}>
        <boxGeometry args={[2.25, 0.03, 0.03]} />
        <meshStandardMaterial 
          color={sensorOnBoundary ? "#10b981" : "#8b5cf6"} 
          emissive={sensorOnBoundary ? "#10b981" : "#8b5cf6"} 
          emissiveIntensity={0.6} 
        />
      </mesh>
      {/* Left Wire */}
      <mesh position={[-1.12, -0.04, 0]}>
        <boxGeometry args={[0.03, 0.03, 1.86]} />
        <meshStandardMaterial 
          color={sensorOnBoundary ? "#10b981" : "#8b5cf6"} 
          emissive={sensorOnBoundary ? "#10b981" : "#8b5cf6"} 
          emissiveIntensity={0.6} 
        />
      </mesh>
      {/* Right Wire */}
      <mesh position={[1.12, -0.04, 0]}>
        <boxGeometry args={[0.03, 0.03, 1.86]} />
        <meshStandardMaterial 
          color={sensorOnBoundary ? "#10b981" : "#8b5cf6"} 
          emissive={sensorOnBoundary ? "#10b981" : "#8b5cf6"} 
          emissiveIntensity={0.6} 
        />
      </mesh>
      {/* Front Wires beside the door */}
      <mesh position={[-0.8, -0.04, 0.94]}>
        <boxGeometry args={[0.7, 0.03, 0.03]} />
        <meshStandardMaterial 
          color={sensorOnBoundary ? "#10b981" : "#8b5cf6"} 
          emissive={sensorOnBoundary ? "#10b981" : "#8b5cf6"} 
          emissiveIntensity={0.6} 
        />
      </mesh>
      <mesh position={[0.8, -0.04, 0.94]}>
        <boxGeometry args={[0.7, 0.03, 0.03]} />
        <meshStandardMaterial 
          color={sensorOnBoundary ? "#10b981" : "#8b5cf6"} 
          emissive={sensorOnBoundary ? "#10b981" : "#8b5cf6"} 
          emissiveIntensity={0.6} 
        />
      </mesh>

      {/* COMPANION PUPPY & FURNITURE */}
      <VoxelPuppy happy={allClear} />
      <VoxelFurniture />

      {/* INTERIOR DROP SLOT: DOG BOWL */}
      <group position={[-0.45, -0.05, 0.35]}>
        {/* Physical Bowl */}
        <mesh castShadow>
          <cylinderGeometry args={[0.13, 0.16, 0.05, 16]} />
          <meshStandardMaterial color="#ef4444" roughness={0.4} />
        </mesh>

        {/* Pulsing Holographic Glow */}
        <PulsingTargetRing 
          position={[0, 0.12, 0]} 
          rotation={[Math.PI / 2, 0, 0]} 
          color="#34d399" 
          visible={selectedItem === 'bone' && !boneInInterior} 
        />

        {/* Invisible hitbox (Click/Raycast target - very easy to click) */}
        {selectedItem === 'bone' && !boneInInterior && (
          <mesh 
            position={[0, 0.1, 0]} 
            onClick={(e) => { e.stopPropagation(); onZoneClick('interior'); }}
          >
            <cylinderGeometry args={[0.42, 0.42, 0.25, 16]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        )}
      </group>

      {/* BOUNDARY DROP SLOT: WIRE CLIP */}
      <group position={[1.12, 0.32, 0.1]}>
        {/* Pulsing Holographic Glow */}
        <PulsingTargetRing 
          position={[0, 0, 0]} 
          rotation={[0, Math.PI / 2, 0]} 
          color="#a78bfa" 
          visible={selectedItem === 'sensor' && !sensorOnBoundary} 
        />

        {/* Invisible hitbox (Click/Raycast target) */}
        {selectedItem === 'sensor' && !sensorOnBoundary && (
          <mesh 
            rotation={[0, Math.PI / 2, 0]} 
            onClick={(e) => { e.stopPropagation(); onZoneClick('boundary'); }}
          >
            <cylinderGeometry args={[0.42, 0.42, 0.25, 16]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        )}
      </group>

      {/* EXTERIOR DROP SLOT: SPRINKLER AREA */}
      <group position={[2.2, -0.15, 0.8]}>
        {/* Pulsing Holographic Glow */}
        <PulsingTargetRing 
          position={[0, 0.15, 0]} 
          rotation={[Math.PI / 2, 0, 0]} 
          color="#60a5fa" 
          visible={selectedItem === 'puddle' && !puddleInExterior} 
        />

        {/* Invisible hitbox (Click/Raycast target) */}
        {selectedItem === 'puddle' && !puddleInExterior && (
          <mesh 
            position={[0, 0.1, 0]} 
            onClick={(e) => { e.stopPropagation(); onZoneClick('exterior'); }}
          >
            <cylinderGeometry args={[0.48, 0.48, 0.25, 16]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        )}
      </group>

      {/* Decorative Stone Circle for Puddle Drop Area */}
      <group position={[2.2, -0.15, 0.8]}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const angle = (i * Math.PI) / 4;
          const r = 0.36;
          const x = r * Math.cos(angle);
          const z = r * Math.sin(angle);
          const scaleY = 0.6 + (i % 3) * 0.25;
          const size = 0.06 + (i % 2) * 0.02;
          return (
            <mesh 
              key={i} 
              position={[x, size * scaleY / 2, z]} 
              rotation={[0.1 * (i % 3), angle, 0.2 * (i % 2)]}
              castShadow
            >
              <boxGeometry args={[size * 1.2, size * scaleY, size]} />
              <meshStandardMaterial color="#6b7280" roughness={0.9} />
            </mesh>
          );
        })}
      </group>

      {/* DRAGGABLE MESHES */}
      {/* 1. Bone */}
      <group 
        position={bonePos}
        onPointerDown={(e) => {
          if (boneInInterior) return;
          e.stopPropagation();
          e.target.setPointerCapture(e.pointerId);
          draggedItemRef.current = 'bone';
          setDraggedItem('bone');
          setControlsEnabled(false);
        }}
        onPointerUp={(e) => {
          if (boneInInterior) return;
          e.stopPropagation();
          e.target.releasePointerCapture(e.pointerId);
          setControlsEnabled(true);
          handleDrop('bone');
        }}
      >
        {/* Outer glowing shield/ring when selected or dragged */}
        {(selectedItem === 'bone' || draggedItem === 'bone') && !boneInInterior && (
          <mesh position={[0, 0.12, 0]}>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshBasicMaterial color="#34d399" transparent opacity={0.2} wireframe />
          </mesh>
        )}

        {/* Visual 3D Bone - Stylized Cartoon Voxel Bone */}
        <group rotation={[0, Math.PI / 4, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.22, 0.05, 0.05]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} metalness={0.1} />
          </mesh>
          <mesh position={[-0.11, 0.02, 0.025]} castShadow><sphereGeometry args={[0.042, 10, 10]} /><meshStandardMaterial color="#f8fafc" roughness={0.4} /></mesh>
          <mesh position={[-0.11, -0.02, -0.025]} castShadow><sphereGeometry args={[0.042, 10, 10]} /><meshStandardMaterial color="#f8fafc" roughness={0.4} /></mesh>
          <mesh position={[-0.11, 0.02, -0.025]} castShadow><sphereGeometry args={[0.042, 10, 10]} /><meshStandardMaterial color="#f8fafc" roughness={0.4} /></mesh>
          <mesh position={[-0.11, -0.02, 0.025]} castShadow><sphereGeometry args={[0.042, 10, 10]} /><meshStandardMaterial color="#f8fafc" roughness={0.4} /></mesh>
          <mesh position={[0.11, 0.02, 0.025]} castShadow><sphereGeometry args={[0.042, 10, 10]} /><meshStandardMaterial color="#f8fafc" roughness={0.4} /></mesh>
          <mesh position={[0.11, -0.02, -0.025]} castShadow><sphereGeometry args={[0.042, 10, 10]} /><meshStandardMaterial color="#f8fafc" roughness={0.4} /></mesh>
          <mesh position={[0.11, 0.02, -0.025]} castShadow><sphereGeometry args={[0.042, 10, 10]} /><meshStandardMaterial color="#f8fafc" roughness={0.4} /></mesh>
          <mesh position={[0.11, -0.02, 0.025]} castShadow><sphereGeometry args={[0.042, 10, 10]} /><meshStandardMaterial color="#f8fafc" roughness={0.4} /></mesh>
        </group>
      </group>

      {/* 2. Sensor */}
      <group 
        position={sensorPos}
        onPointerDown={(e) => {
          if (sensorOnBoundary) return;
          e.stopPropagation();
          e.target.setPointerCapture(e.pointerId);
          draggedItemRef.current = 'sensor';
          setDraggedItem('sensor');
          setControlsEnabled(false);
        }}
        onPointerUp={(e) => {
          if (sensorOnBoundary) return;
          e.stopPropagation();
          e.target.releasePointerCapture(e.pointerId);
          setControlsEnabled(true);
          handleDrop('sensor');
        }}
      >
        {(selectedItem === 'sensor' || draggedItem === 'sensor') && !sensorOnBoundary && (
          <mesh position={[0, 0.12, 0]}>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshBasicMaterial color="#a78bfa" transparent opacity={0.2} wireframe />
          </mesh>
        )}

        {/* Visual 3D Sensor */}
        <mesh castShadow>
          <boxGeometry args={[0.05, 0.18, 0.12]} />
          <meshStandardMaterial color="#374151" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.03, 0.06, 0]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color={sensorOnBoundary ? "#10b981" : "#a78bfa"} />
        </mesh>
      </group>

      {/* 3. Puddle */}
      <group 
        position={puddlePos}
        onPointerDown={(e) => {
          if (puddleInExterior) return;
          e.stopPropagation();
          e.target.setPointerCapture(e.pointerId);
          draggedItemRef.current = 'puddle';
          setDraggedItem('puddle');
          setControlsEnabled(false);
        }}
        onPointerUp={(e) => {
          if (puddleInExterior) return;
          e.stopPropagation();
          e.target.releasePointerCapture(e.pointerId);
          setControlsEnabled(true);
          handleDrop('puddle');
        }}
      >
        {(selectedItem === 'puddle' || draggedItem === 'puddle') && !puddleInExterior && (
          <mesh position={[0, 0.08, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial color="#60a5fa" transparent opacity={0.2} wireframe />
          </mesh>
        )}

        {/* Visual 3D Puddle */}
        <mesh>
          <cylinderGeometry args={[0.24, 0.26, 0.012, 16]} />
          <meshStandardMaterial color="#2563eb" roughness={0.1} metalness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

export default function Stage2_RegionRescue({ onComplete, addXp }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // 'bone' | 'sensor' | 'puddle' | null
  const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', text: string }

  // Placed State
  const [boneInInterior, setBoneInInterior] = useState(false);
  const [sensorOnBoundary, setSensorOnBoundary] = useState(false);
  const [puddleInExterior, setPuddleInExterior] = useState(false);

  // 3D Positions in space
  const [bonePos, setBonePos] = useState([-2.1, -0.05, 0.4]);
  const [sensorPos, setSensorPos] = useState([-2.1, -0.05, -0.4]);
  const [puddlePos, setPuddlePos] = useState([-2.1, -0.075, 0.0]);

  // Drag state
  const [draggedItem, setDraggedItem] = useState(null);
  const draggedItemRef = useRef(null);
  const [controlsEnabled, setControlsEnabled] = useState(true);

  // Detect Dark Mode attribute changes
  useEffect(() => {
    const checkTheme = () => {
      const themeAttr = document.documentElement.getAttribute('data-theme');
      setIsDarkMode(themeAttr === 'dark');
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // Check if everything is successfully cleared
  const allClear = boneInInterior && sensorOnBoundary && puddleInExterior;

  useEffect(() => {
    if (allClear) {
      setFeedback({ type: 'success', text: '🎉 Brilliant! All items are placed in their mathematically correct zones!' });
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.75 } });
    }
  }, [allClear]);

  // Raycast drop handler (checking proximity coordinates)
  const handleDrop = (itemType) => {
    draggedItemRef.current = null;
    setDraggedItem(null);

    if (itemType === 'bone') {
      const distToBowl = Math.sqrt(Math.pow(bonePos[0] - (-0.45), 2) + Math.pow(bonePos[2] - 0.35, 2));
      if (distToBowl < 0.5) {
        setBonePos([-0.45, -0.05, 0.35]); // snap
        setBoneInInterior(true);
        setSelectedItem(null);
        addXp(50);
        setFeedback({ type: 'success', text: '🦴 Bone placed inside the dog bowl (Interior)!' });
      } else {
        setBonePos([-2.1, -0.05, 0.4]); // bounce
        setFeedback({ type: 'error', text: '❌ Wrong zone! Drop the bone inside the house dog bowl (Interior).' });
      }
    } else if (itemType === 'sensor') {
      const distToWire = Math.sqrt(Math.pow(sensorPos[0] - 1.12, 2) + Math.pow(sensorPos[2] - 0.1, 2));
      if (distToWire < 0.5) {
        setSensorPos([1.12, 0.32, 0.1]); // snap
        setSensorOnBoundary(true);
        setSelectedItem(null);
        addXp(50);
        setFeedback({ type: 'success', text: '📡 Security sensor attached to the perimeter wire loop (Boundary)!' });
      } else {
        setSensorPos([-2.1, -0.05, -0.4]); // bounce
        setFeedback({ type: 'error', text: '❌ Wrong zone! Drop the sensor directly onto the outer wall perimeter wire (Boundary).' });
      }
    } else if (itemType === 'puddle') {
      const distToSpot = Math.sqrt(Math.pow(puddlePos[0] - 2.2, 2) + Math.pow(puddlePos[2] - 0.8, 2));
      if (distToSpot < 0.6) {
        setPuddlePos([2.2, -0.14, 0.8]); // snap
        setPuddleInExterior(true);
        setSelectedItem(null);
        addXp(50);
        setFeedback({ type: 'success', text: '💧 Sprinkler water puddle released in the green yard (Exterior)!' });
      } else {
        setPuddlePos([-2.1, -0.075, 0.0]); // bounce
        setFeedback({ type: 'error', text: '❌ Wrong zone! Drop the puddle outside the house structure in the yard (Exterior).' });
      }
    }
  };

  // Click-to-place zone handler (fallback for touchscreens)
  const handleZonePlacement = (zone) => {
    if (!selectedItem) return;

    if (selectedItem === 'bone') {
      if (zone === 'interior') {
        setBonePos([-0.45, -0.05, 0.35]);
        setBoneInInterior(true);
        setSelectedItem(null);
        addXp(50);
        setFeedback({ type: 'success', text: '🦴 Bone placed inside the dog bowl (Interior)!' });
      } else {
        setFeedback({ type: 'error', text: '❌ Wrong zone! The dog food bone belongs inside the house (Interior).' });
      }
    } else if (selectedItem === 'sensor') {
      if (zone === 'boundary') {
        setSensorPos([1.12, 0.32, 0.1]);
        setSensorOnBoundary(true);
        setSelectedItem(null);
        addXp(50);
        setFeedback({ type: 'success', text: '📡 Security sensor attached to the perimeter wire loop (Boundary)!' });
      } else {
        setFeedback({ type: 'error', text: '❌ Wrong zone! The boundary sensor belongs on the outer wall outline (Boundary).' });
      }
    } else if (selectedItem === 'puddle') {
      if (zone === 'exterior') {
        setPuddlePos([2.2, -0.14, 0.8]);
        setPuddleInExterior(true);
        setSelectedItem(null);
        addXp(50);
        setFeedback({ type: 'success', text: '💧 Sprinkler water puddle released in the green yard (Exterior)!' });
      } else {
        setFeedback({ type: 'error', text: '❌ Wrong zone! The puddle belongs outside the house structure (Exterior).' });
      }
    }
  };

  const handleSelectTrayItem = (item) => {
    if (
      (item === 'bone' && boneInInterior) ||
      (item === 'sensor' && sensorOnBoundary) ||
      (item === 'puddle' && puddleInExterior)
    ) {
      setFeedback({ type: 'info', text: 'This item is already placed correctly!' });
      return;
    }
    setSelectedItem(item);
    setFeedback({ type: 'info', text: `📍 Drag it directly in 3D, or click the glowing pulsing ring inside the 3D canvas!` });
  };

  const handleReset = () => {
    setBonePos([-2.1, -0.05, 0.4]);
    setSensorPos([-2.1, -0.05, -0.4]);
    setPuddlePos([-2.1, -0.075, 0.0]);
    setBoneInInterior(false);
    setSensorOnBoundary(false);
    setPuddleInExterior(false);
    setSelectedItem(null);
    setFeedback(null);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.5rem', alignItems: 'stretch' }}>
      {/* LEFT PANEL */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        
        {/* Concept Card */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', background: 'var(--neutral-bg)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <Info style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} size={18} />
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-heading)', textTransform: 'uppercase' }}>Core Concept:</span>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              A closed boundary shape (like the house structure) splits space into three regions:
              <br />1. <strong>Interior:</strong> Inside the house space.
              <br />2. <strong>Boundary:</strong> Directly on the walls/electric outline.
              <br />3. <strong>Exterior:</strong> Outside in the surrounding yard.
            </p>
          </div>
        </div>

        {/* Selectable Tool Tray */}
        <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
            Select Item to Place:
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {/* Bone Select Button */}
            <button
              onClick={() => handleSelectTrayItem('bone')}
              className={boneInInterior ? 'outline' : selectedItem === 'bone' ? 'primary' : 'outline'}
              style={{
                justifyContent: 'flex-start',
                padding: '0.75rem',
                gap: '0.6rem',
                opacity: boneInInterior ? 0.65 : 1,
                border: selectedItem === 'bone' ? '2px solid #34d399' : '1px solid var(--border)'
              }}
              disabled={boneInInterior}
            >
              <span style={{ fontSize: '1.25rem' }}>🦴</span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>Dog Food Bone</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Target: Interior (Bowl)</span>
              </div>
            </button>

            {/* Sensor Select Button */}
            <button
              onClick={() => handleSelectTrayItem('sensor')}
              className={sensorOnBoundary ? 'outline' : selectedItem === 'sensor' ? 'primary' : 'outline'}
              style={{
                justifyContent: 'flex-start',
                padding: '0.75rem',
                gap: '0.6rem',
                opacity: sensorOnBoundary ? 0.65 : 1,
                border: selectedItem === 'sensor' ? '2px solid #a78bfa' : '1px solid var(--border)'
              }}
              disabled={sensorOnBoundary}
            >
              <span style={{ fontSize: '1.25rem' }}>📡</span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>Boundary Sensor</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Target: Boundary (Wire)</span>
              </div>
            </button>

            {/* Puddle Select Button */}
            <button
              onClick={() => handleSelectTrayItem('puddle')}
              className={puddleInExterior ? 'outline' : selectedItem === 'puddle' ? 'primary' : 'outline'}
              style={{
                justifyContent: 'flex-start',
                padding: '0.75rem',
                gap: '0.6rem',
                opacity: puddleInExterior ? 0.65 : 1,
                border: selectedItem === 'puddle' ? '2px solid #60a5fa' : '1px solid var(--border)'
              }}
              disabled={puddleInExterior}
            >
              <span style={{ fontSize: '1.25rem' }}>💧</span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>Water Puddle</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Target: Exterior (Yard)</span>
              </div>
            </button>
          </div>
        </div>

        {/* Reset Items Button */}
        <button 
          onClick={handleReset}
          className="outline"
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', padding: '0.5rem', fontSize: '0.75rem' }}
        >
          <RefreshCw size={12} />
          <span>Reset Placements</span>
        </button>

        {/* Feedback / Guidance Cards */}
        <AnimatePresence mode="wait">
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                background: feedback.type === 'success' ? 'var(--success-bg)' : feedback.type === 'error' ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.03)',
                border: `1px dashed ${feedback.type === 'success' ? 'var(--success-border)' : feedback.type === 'error' ? '#ef4444' : 'var(--border)'}`,
                borderRadius: '8px',
                padding: '0.8rem',
                fontSize: '0.75rem',
                color: feedback.type === 'success' ? 'var(--success)' : feedback.type === 'error' ? '#f87171' : 'var(--text-muted)',
                lineHeight: '1.4'
              }}
            >
              {feedback.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Proceed button */}
        <div style={{ marginTop: 'auto' }}>
          {allClear ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ background: 'var(--success-bg)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--success-border)', marginBottom: '0.5rem' }}>
                <h4 style={{ margin: '0 0 0.2rem 0', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                  <Sparkles size={14} /> Mission Clear!
                </h4>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  All items correctly assigned. Proceed to the checkup quiz.
                </p>
              </div>
              <button onClick={onComplete} className="primary" style={{ width: '100%' }}>
                Next: Take Concept Quiz
              </button>
            </motion.div>
          ) : (
            <div style={{ background: 'var(--surface)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--border)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Drag items off the supply deck and drop them in their correct slots.</span>
            </div>
          )}
        </div>

      </div>

      {/* RIGHT PANEL: 3D INTERACTIVE HOUSE VIEWPORT */}
      <div 
        className="glass-panel" 
        style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: '520px', background: isDarkMode ? '#090d16' : '#bfdbfe', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', transition: 'background 0.5s ease' }}
      >
        <div style={{ 
          position: 'absolute', 
          top: '15px', 
          left: '15px', 
          background: 'rgba(9, 13, 22, 0.85)', 
          border: '1px solid rgba(255,255,255,0.1)', 
          borderRadius: '8px', 
          padding: '0.5rem 0.8rem', 
          zIndex: 10,
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.75rem',
          color: '#f8fafc'
        }}>
          <Shield size={14} style={{ color: 'var(--accent)' }} />
          <span>🏠 Interactive 3D Boundary Lab (Drag to Rotate)</span>
        </div>

        <div style={{ flex: 1, position: 'relative', width: '100%', height: '520px', minHeight: '480px' }}>
          <Canvas camera={{ position: [3.3, 2.5, 3.3], fov: 40 }} shadows>
            {/* Background color of scene matching Day/Night theme */}
            <color attach="background" args={[isDarkMode ? "#090d16" : "#bfdbfe"]} />

            {/* Fog for atmospheric depth */}
            <fog attach="fog" args={[isDarkMode ? "#090d16" : "#bfdbfe", 7.5, 18]} />

            {/* OrbitControls to steer camera */}
            <OrbitControls 
              enabled={controlsEnabled}
              enableZoom={true} 
              minDistance={2} 
              maxDistance={8} 
              maxPolarAngle={Math.PI / 2 - 0.05} // prevent camera going under lawn
            />

            {/* The 3D Interactive House Model */}
            <HouseLabScene
              boneInInterior={boneInInterior}
              sensorOnBoundary={sensorOnBoundary}
              puddleInExterior={puddleInExterior}
              selectedItem={selectedItem}
              onZoneClick={handleZonePlacement}
              allClear={allClear}
              isDarkMode={isDarkMode}
              bonePos={bonePos}
              sensorPos={sensorPos}
              puddlePos={puddlePos}
              setBonePos={setBonePos}
              setSensorPos={setSensorPos}
              setPuddlePos={setPuddlePos}
              draggedItem={draggedItem}
              setDraggedItem={setDraggedItem}
              draggedItemRef={draggedItemRef}
              setControlsEnabled={setControlsEnabled}
              handleDrop={handleDrop}
            />
          </Canvas>
        </div>

        {/* 3D Scene Controls Hint Overlay */}
        <div style={{ position: 'absolute', bottom: '15px', right: '15px', pointerEvents: 'none', background: 'rgba(9, 13, 22, 0.8)', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.7rem', color: '#cbd5e1' }}>
          🖱️ Drag items directly to dropzones, or select item and click glowing ring.
        </div>
      </div>
    </div>
  );
}
