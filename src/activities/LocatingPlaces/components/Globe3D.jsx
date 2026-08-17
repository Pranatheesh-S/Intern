import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import worldMapUrl from './world-map.jpg';

const Globe = ({ currentTask, latVal, lonVal, gridLat, gridLon }) => {
  const globeRef = useRef();
  const colorMap = useTexture(worldMapUrl);

  useFrame((state, delta) => {
    if (globeRef.current) {
      // Slow auto-rotation
      globeRef.current.rotation.y += delta * 0.15;
    }
  });

  const radius = 2.2;
  const segments = 64;

  const createLatitudeLine = (lat) => {
    const points = [];
    const radLat = (lat * Math.PI) / 180;
    const y = radius * Math.sin(radLat);
    const r = radius * Math.cos(radLat);
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(r * Math.sin(theta), y, r * Math.cos(theta)));
    }
    return points;
  };

  const createLongitudeLine = (lon) => {
    const points = [];
    const radLon = (lon * Math.PI) / 180;
    for (let i = 0; i <= segments; i++) {
      const phi = (i / segments) * Math.PI - Math.PI / 2;
      const x = radius * Math.cos(phi) * Math.sin(radLon);
      const y = radius * Math.sin(phi);
      const z = radius * Math.cos(phi) * Math.cos(radLon);
      points.push(new THREE.Vector3(x, y, z));
    }
    return points;
  };
  
  const parallels = [-60, -30, 30, 60].map(createLatitudeLine);
  const meridians = [-150, -120, -90, -60, -30, 30, 60, 90, 120, 150].map(createLongitudeLine);

  return (
    <group ref={globeRef}>
      {/* Base Globe */}
      <Sphere args={[radius, 64, 64]}>
        <meshStandardMaterial 
          map={colorMap}
          color="#ffffff" 
          emissive="#0f172a"
          roughness={0.6} 
          metalness={0.1} 
          transparent={true} 
          opacity={0.92} 
        />
      </Sphere>

      {/* Graticule */}
      {parallels.map((points, idx) => (
        <Line key={`p-${idx}`} points={points} color="#60a5fa" lineWidth={1} transparent opacity={0.25} />
      ))}
      {meridians.map((points, idx) => (
        <Line key={`m-${idx}`} points={points} color="#60a5fa" lineWidth={1} transparent opacity={0.25} />
      ))}
      <Line points={createLongitudeLine(180)} color="#60a5fa" lineWidth={1} transparent opacity={0.25} />

      {/* Task 1: Latitude */}
      {(currentTask === 1 || currentTask === 3) && (
        <>
          <Line points={createLatitudeLine(0)} color="#ef4444" lineWidth={3.5} />
          {Math.abs(currentTask === 1 ? latVal : gridLat) > 0 && (
            <Line points={createLatitudeLine(currentTask === 1 ? latVal : gridLat)} color="#f59e0b" lineWidth={4} />
          )}
        </>
      )}

      {/* Task 2: Longitude */}
      {(currentTask === 2 || currentTask === 3) && (
        <>
          <Line points={createLongitudeLine(0)} color="#fbbf24" lineWidth={3.5} />
          {Math.abs(currentTask === 2 ? lonVal : gridLon) > 0 && (
            <Line points={createLongitudeLine(currentTask === 2 ? lonVal : gridLon)} color="#f59e0b" lineWidth={4} />
          )}
        </>
      )}

      {/* Task 3 specific intersection point */}
      {currentTask === 3 && (
        <mesh position={new THREE.Vector3().setFromSphericalCoords(radius, Math.PI / 2 - (gridLat * Math.PI) / 180, (gridLon * Math.PI) / 180)}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
          <pointLight color="#ffffff" intensity={2} distance={2} />
        </mesh>
      )}
    </group>
  );
};

export default function Globe3D({ currentTask, latVal, lonVal, gridLat, gridLon }) {
  return (
    <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }} style={{ width: '100%', height: '100%', cursor: 'grab' }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 15, 10]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={1.0} color="#3b82f6" />
      
      <Globe 
        currentTask={currentTask} 
        latVal={latVal} 
        lonVal={lonVal} 
        gridLat={gridLat} 
        gridLon={gridLon} 
      />
      
      <OrbitControls 
        enableZoom={true} 
        enablePan={false} 
        autoRotate={false} 
        minDistance={3}
        maxDistance={10}
      />
    </Canvas>
  );
}
