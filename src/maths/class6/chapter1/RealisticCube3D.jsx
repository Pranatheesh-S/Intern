import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Environment } from '@react-three/drei';

export default function RealisticCube3D() {
  const sequence = [1, 2, 3, 4];
  const spacingX = [ -5.5, -2, 2.5, 8.5 ]; 
  const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '24px', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 8, 22], fov: 35 }} style={{ width: '100%', height: '100%' }}>
        <ambientLight intensity={1.5} color="#ffffff" />
        <directionalLight position={[10, 15, 10]} intensity={3.5} castShadow />
        <spotLight position={[-5, 10, 10]} intensity={1.5} color="#e2e8f0" penumbra={1} />
        
        {/* Subtle ground plane */}
        <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>

        {sequence.map((n, i) => {
          const color = colors[i % colors.length];
          const blocks = [];
          const offset = spacingX[i];
          const blockSize = 0.95; // 0.05 gap for no overlapping
          
          for(let x=0; x<n; x++) {
            for(let y=0; y<n; y++) {
              for(let z=0; z<n; z++) {
                // center the cube block around local origin
                const px = x - (n-1)/2;
                const py = y - (n-1)/2;
                const pz = z - (n-1)/2;
                
                blocks.push(
                  <mesh key={`b-${x}-${y}-${z}`} position={[px, py, pz]} castShadow receiveShadow>
                    <boxGeometry args={[blockSize, blockSize, blockSize]} />
                    <meshPhysicalMaterial 
                      color={color} 
                      roughness={0.15} 
                      metalness={0.1} 
                      clearcoat={1.0}
                      clearcoatRoughness={0.1}
                    />
                  </mesh>
                );
              }
            }
          }
          
          return (
            <group key={`cube-${i}`} position={[offset, 0, 0]}>
              <group position={[0, (n-1)/2, 0]}>
                 {blocks}
              </group>
              <Text 
                position={[0, -1.2, 2]} 
                fontSize={1.2} 
                color={color} 
                fontWeight="900"
                anchorX="center"
              >
                {n*n*n}
              </Text>
            </group>
          );
        })}
        <OrbitControls enableZoom={true} enablePan={true} autoRotate={false} />
      </Canvas>
    </div>
  );
}
