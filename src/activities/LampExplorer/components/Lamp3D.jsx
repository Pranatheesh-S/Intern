import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import { Html } from '@react-three/drei';

export default function Lamp3D({ exploded, onPartSelect, selectedPart, isGlowing, isLED, isolatePart }) {
  const groupRef = useRef();

  // Parts offset logic
  const bulbTarget = (exploded && !isolatePart) ? 2.5 : 0;
  const filamentTarget = (exploded && !isolatePart) ? 1.2 : 0;
  const supportTarget = (exploded && !isolatePart) ? 0 : 0;
  const baseTarget = (exploded && !isolatePart) ? -1.5 : 0;
  const tipTarget = (exploded && !isolatePart) ? -2.8 : 0;

  const bulbRef = useRef();
  const filamentRef = useRef();
  const supportRef = useRef();
  const baseRef = useRef();
  const tipRef = useRef();

  useFrame((state, delta) => {
    // Smooth lerping to exploded positions
    if (bulbRef.current) bulbRef.current.position.y = MathUtils.lerp(bulbRef.current.position.y, bulbTarget, 5 * delta);
    if (filamentRef.current) filamentRef.current.position.y = MathUtils.lerp(filamentRef.current.position.y, filamentTarget, 5 * delta);
    if (supportRef.current) supportRef.current.position.y = MathUtils.lerp(supportRef.current.position.y, supportTarget, 5 * delta);
    if (baseRef.current) baseRef.current.position.y = MathUtils.lerp(baseRef.current.position.y, baseTarget, 5 * delta);
    if (tipRef.current) tipRef.current.position.y = MathUtils.lerp(tipRef.current.position.y, tipTarget, 5 * delta);
    
    // Rotate slowly if not exploded
    if (!exploded && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    } else if (exploded && groupRef.current) {
      // Lerp rotation back to 0 when exploded for clear view
      groupRef.current.rotation.y = MathUtils.lerp(groupRef.current.rotation.y, 0, 5 * delta);
    }
  });

  const Label = ({ partId, label, offset = [1.5, 0, 0] }) => {
    if (!exploded || isolatePart) return null;
    return (
      <Html position={offset} center>
        <div 
          onClick={(e) => { e.stopPropagation(); onPartSelect(partId); }}
          style={{
            background: selectedPart === partId ? 'var(--accent)' : 'rgba(15, 23, 42, 0.8)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            border: `1px solid ${selectedPart === partId ? 'white' : 'transparent'}`,
            transition: 'all 0.2s',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          {label}
        </div>
      </Html>
    );
  };

  if (isLED) {
    return (
      <group ref={groupRef} position={[0, -0.5, 0]}>
        {/* LED Lens */}
        <mesh position={[0, 1.5, 0]} onClick={(e) => { e.stopPropagation(); onPartSelect('lens'); }}>
          <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
          <meshPhysicalMaterial color={isGlowing ? "#ef4444" : "#f87171"} transmission={0.9} transparent opacity={0.8} roughness={0.1} />
        </mesh>
        <mesh position={[0, 2, 0]}>
          <sphereGeometry args={[0.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial color={isGlowing ? "#ef4444" : "#f87171"} transmission={0.9} transparent opacity={0.8} roughness={0.1} />
        </mesh>

        {/* LED Legs */}
        {/* Positive (Long) */}
        <mesh position={[-0.25, 0, 0]} onClick={(e) => { e.stopPropagation(); onPartSelect('positive'); }}>
          <cylinderGeometry args={[0.05, 0.05, 3]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
          {exploded && <Label partId="positive" label="Positive Terminal (Long)" offset={[-1.2, -1, 0]} />}
          {/* Red indicator tip */}
          <mesh position={[0, -1.45, 0]}>
            <cylinderGeometry args={[0.055, 0.055, 0.1]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
        </mesh>
        {/* Negative (Short) */}
        <mesh position={[0.25, 0.25, 0]} onClick={(e) => { e.stopPropagation(); onPartSelect('negative'); }}>
          <cylinderGeometry args={[0.05, 0.05, 2.5]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
          {exploded && <Label partId="negative" label="Negative Terminal (Short)" offset={[1.2, -0.5, 0]} />}
          {/* Blue indicator tip */}
          <mesh position={[0, -1.2, 0]}>
            <cylinderGeometry args={[0.055, 0.055, 0.1]} />
            <meshStandardMaterial color="#3b82f6" />
          </mesh>
        </mesh>

        {/* Inner Anvil and Post (Semiconductor Body) */}
        <mesh position={[0.2, 1.2, 0]} onClick={(e) => { e.stopPropagation(); onPartSelect('semiconductor'); }}>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshStandardMaterial color="#475569" metalness={0.5} />
        </mesh>
        <mesh position={[-0.1, 1.3, 0]}>
          <boxGeometry args={[0.3, 0.2, 0.1]} />
          <meshStandardMaterial color="#475569" metalness={0.5} />
          {exploded && <Label partId="semiconductor" label="Semiconductor Body" offset={[-1.2, 0, 0]} />}
        </mesh>
        
        {isGlowing && (
          <pointLight position={[0, 1.5, 0]} color="#ef4444" intensity={2} distance={5} />
        )}
      </group>
    );
  }

  let globalOffset = [0, 0, 0];
  let globalScale = 1;
  if (isolatePart) {
     if (isolatePart === 'bulb') { globalOffset = [0, -1.2, 0]; globalScale = 1.2; }
     if (isolatePart === 'filament') { globalOffset = [0, -1.2, 0]; globalScale = 3; }
     if (isolatePart === 'support') { globalOffset = [0, -0.4, 0]; globalScale = 1.8; }
     if (isolatePart === 'case') { globalOffset = [0, 0.5, 0]; globalScale = 1.5; }
     if (isolatePart === 'tip') { globalOffset = [0, 1.05, 0]; globalScale = 2.5; }
     if (isolatePart === 'insulator') { globalOffset = [0, 0.9, 0]; globalScale = 2.5; }
  }

  const isVisible = (partId) => !isolatePart || isolatePart === partId;

  return (
    <group ref={groupRef} position={globalOffset} scale={globalScale}>
      
      {/* Glass Bulb */}
      <group ref={bulbRef} visible={isVisible('bulb')} onClick={(e) => { e.stopPropagation(); onPartSelect('bulb'); }}>
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshPhysicalMaterial 
            color={isGlowing ? "#fef08a" : "#ffffff"} 
            transmission={0.95} 
            transparent 
            opacity={0.3} 
            roughness={0.1} 
            clearcoat={1} 
            emissive={isGlowing ? "#fef08a" : "#000000"} 
            emissiveIntensity={isGlowing ? 1 : 0}
          />
        </mesh>
        <Label partId="bulb" label="Glass Bulb" offset={[-1.2, 1.5, 0]} />
      </group>

      {/* Filament */}
      <group ref={filamentRef} visible={isVisible('filament')} onClick={(e) => { e.stopPropagation(); onPartSelect('filament'); }}>
        <mesh position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.2, 0.02, 16, 100, Math.PI]} />
          <meshStandardMaterial 
            color={isGlowing ? "#ffffff" : "#475569"} 
            emissive={isGlowing ? "#fef08a" : "#000000"} 
            emissiveIntensity={isGlowing ? 20 : 0} 
            metalness={isGlowing ? 0 : 0.8}
            roughness={0.2}
          />
        </mesh>
        {isGlowing && (
          <>
            <pointLight position={[0, 1.2, 0]} color="#fef08a" intensity={5} distance={10} decay={2} />
            {/* Fake Glow Sprites (Spheres) */}
            <mesh position={[0, 1.2, 0]}>
              <sphereGeometry args={[1.5, 32, 32]} />
              <meshBasicMaterial color="#fef08a" transparent opacity={0.3} depthWrite={false} />
            </mesh>
            <mesh position={[0, 1.2, 0]}>
              <sphereGeometry args={[3, 32, 32]} />
              <meshBasicMaterial color="#fef08a" transparent opacity={0.1} depthWrite={false} />
            </mesh>
          </>
        )}
        <Label partId="filament" label="Filament" offset={[1.2, 1.2, 0]} />
      </group>

      {/* Support Wires */}
      <group ref={supportRef} visible={isVisible('support')} onClick={(e) => { e.stopPropagation(); onPartSelect('support'); }}>
        {/* Left Support */}
        <mesh position={[-0.2, 0.6, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1.2]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Right Support */}
        <mesh position={[0.2, 0.6, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1.2]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Glass Mount (Insulator) */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.15, 0.3, 0.4]} />
          <meshPhysicalMaterial color="#38bdf8" transmission={0.8} transparent opacity={0.6} />
        </mesh>
        <Label partId="support" label="Thick Support Wires" offset={[-1.2, 0.6, 0]} />
      </group>

      {/* Metal Case */}
      <group ref={baseRef} visible={isVisible('case')} onClick={(e) => { e.stopPropagation(); onPartSelect('case'); }}>
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.5, 0.4, 0.8, 32]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Threads */}
        {[...Array(3)].map((_, i) => (
          <mesh key={i} position={[0, -0.2 - (i * 0.2), 0]}>
            <torusGeometry args={[0.45 - (i * 0.02), 0.05, 16, 32]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.3} />
          </mesh>
        ))}
        <Label partId="case" label="Metal Case (Terminal)" offset={[1.2, -0.4, 0]} />
      </group>

      {/* Metal Tip & Base Insulator */}
      <group ref={tipRef} visible={isVisible('tip') || isVisible('insulator')} onClick={(e) => { e.stopPropagation(); onPartSelect('tip'); }}>
        {/* Black Insulator */}
        <mesh position={[0, -0.9, 0]} visible={isVisible('insulator')}>
          <cylinderGeometry args={[0.4, 0.2, 0.2, 32]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        <Label partId="insulator" label="Insulator" offset={[-1.2, -0.9, 0]} />
        
        {/* Metal Tip */}
        <mesh position={[0, -1.05, 0]} visible={isVisible('tip')}>
          <sphereGeometry args={[0.15, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.4} />
        </mesh>
        <Label partId="tip" label="Metal Tip (Terminal)" offset={[1.2, -1.05, 0]} />
      </group>

    </group>
  );
}
