import { useState, useEffect, useRef, useMemo } from 'react';
import { CheckCircle, Play, Pause, RotateCcw } from 'lucide-react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Smoother, lower frequency noise for rolling hills
const smoothNoise = (x, z) => {
  return (
    Math.sin(x * 0.12 + z * 0.1) * 1.5 +
    Math.sin(x * 0.2 - z * 0.25) * 1.0 +
    Math.sin(x * 0.4 + z * 0.5) * 0.5
  );
};

// Layout: z goes from -35 (mountains back) to +35 (ocean front)
const getTerrainHeight = (x, z) => {
  const riverX = Math.sin(z * 0.08) * 6 + Math.sin(z * 0.04) * 3;
  const distToRiver = Math.abs(x - riverX);
  
  const coastlineZ = 8;

  if (z >= coastlineZ) {
    return -0.4 - (z - coastlineZ) * 0.1; // Slope down into the ocean
  }

  const distFromCoast = (coastlineZ - z);
  let y = Math.pow(distFromCoast * 0.18, 1.3); 
  
  const n = smoothNoise(x, z);
  y += n * 1.5;

  if (distFromCoast < 6) {
    y *= (distFromCoast / 6);
  }

  // Carve river valley
  const valleyWidth = 10 + Math.pow(Math.max(0, 20 - distFromCoast) / 20, 2) * 14;
  if (distToRiver < valleyWidth) {
    const valleyFactor = Math.pow(distToRiver / valleyWidth, 2.5); 
    const valleyFloor = distFromCoast * 0.04; 
    y = y * valleyFactor + valleyFloor * (1 - valleyFactor);
  }
  
  if (y < -3) y = -3;
  return y;
};

// --- TERRAIN ---
const Terrain = () => {
  const geom = useMemo(() => {
    const geo = new THREE.PlaneGeometry(90, 70, 256, 200); 
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    const colors = [];
    
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = getTerrainHeight(x, z);
      let color = new THREE.Color();
      
      // Increased contrast colors
      if (y > 10) {
         color.set('#ffffff'); // Pure Snow
      } else if (y > 6.0) {
         color.set('#44403c').lerp(new THREE.Color('#ffffff'), (y-6.0)/4.0); // Dark Rock to Snow
      } else if (y > 1.5) {
         color.set('#15803d').lerp(new THREE.Color('#44403c'), (y-1.5)/4.5); // Deep Grass to Rock
      } else if (y > 0.2) {
         color.set('#22c55e').lerp(new THREE.Color('#15803d'), (y-0.2)/1.3); // Bright grass to Deep Grass
      } else if (y > -0.6) {
         color.set('#fde047').lerp(new THREE.Color('#22c55e'), (y+0.6)/0.8); // Sand to grass
      } else {
         color.set('#0284c7').lerp(new THREE.Color('#fde047'), Math.max(0, (y+2.5)/1.9)); // Ocean depths
      }
      
      pos.setY(i, y);
      colors.push(color.r, color.g, color.b);
    }
    
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    
    const normals = geo.attributes.normal;
    for (let i = 0; i < pos.count; i++) {
       const ny = normals.getY(i);
       const y = pos.getY(i);
       if (y > 7 && ny > 0.7) {
          geo.attributes.color.setXYZ(i, 1.0, 1.0, 1.0);
       }
    }

    return geo;
  }, []);
  
  return (
    <mesh geometry={geom} receiveShadow position={[0, -0.5, 0]}>
      <meshStandardMaterial vertexColors roughness={0.8} metalness={0.05} />
    </mesh>
  );
};

// --- VEGETATION (Pine Trees) ---
const Vegetation = () => {
  const leaves1Ref = useRef();
  const leaves2Ref = useRef();
  const leaves3Ref = useRef();
  const trunkRef = useRef();
  const count = 350;
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const treeData = useMemo(() => [], []);
  
  useEffect(() => {
     let i = 0;
     let attempts = 0;
     while (i < count && attempts < 5000) {
        attempts++;
        const x = (Math.random() - 0.5) * 80;
        const z = -35 + Math.random() * 40; 
        
        const y = getTerrainHeight(x, z);
        
        const riverX = Math.sin(z * 0.08) * 6 + Math.sin(z * 0.04) * 3;
        const distToRiver = Math.abs(x - riverX);
        const coastlineZ = 8;
        const distFromCoast = (coastlineZ - z);
        const valleyWidth = 10 + Math.pow(Math.max(0, 20 - distFromCoast) / 20, 2) * 14;
        
        if (y > 0.5 && y < 7.0 && distToRiver > valleyWidth - 2.5) {
           const scale = 0.5 + Math.random() * 0.7; // more variation
           const rotY = Math.random() * Math.PI * 2;
           treeData.push({ x, y: y - 0.5, z, scale, rotY, swayPhase: Math.random() * Math.PI * 2 });
           
           dummy.position.set(x, y - 0.5 + scale * 0.4, z);
           dummy.scale.set(scale * 0.25, scale * 1.0, scale * 0.25);
           dummy.rotation.set(0, rotY, 0);
           dummy.updateMatrix();
           if(trunkRef.current) trunkRef.current.setMatrixAt(i, dummy.matrix);
           
           i++;
        }
     }
     if(trunkRef.current) trunkRef.current.instanceMatrix.needsUpdate = true;
  }, [treeData, dummy]);

  useFrame((state) => {
     const time = state.clock.elapsedTime;
     for (let i = 0; i < treeData.length; i++) {
        const t = treeData[i];
        const swayX = Math.sin(time * 0.8 + t.swayPhase) * 0.04;
        const swayZ = Math.cos(time * 0.6 + t.swayPhase) * 0.04;

        dummy.position.set(t.x + swayX*0.2, t.y + t.scale * 1.0, t.z + swayZ*0.2);
        dummy.scale.set(t.scale * 1.4, t.scale * 1.6, t.scale * 1.4);
        dummy.rotation.set(swayX, t.rotY, swayZ);
        dummy.updateMatrix();
        if (leaves1Ref.current) leaves1Ref.current.setMatrixAt(i, dummy.matrix);

        dummy.position.set(t.x + swayX*0.6, t.y + t.scale * 1.8, t.z + swayZ*0.6);
        dummy.scale.set(t.scale * 1.1, t.scale * 1.4, t.scale * 1.1);
        dummy.rotation.set(swayX * 1.2, t.rotY + 1, swayZ * 1.2);
        dummy.updateMatrix();
        if (leaves2Ref.current) leaves2Ref.current.setMatrixAt(i, dummy.matrix);
        
        dummy.position.set(t.x + swayX*1.0, t.y + t.scale * 2.5, t.z + swayZ*1.0);
        dummy.scale.set(t.scale * 0.8, t.scale * 1.2, t.scale * 0.8);
        dummy.rotation.set(swayX * 1.5, t.rotY + 2, swayZ * 1.5);
        dummy.updateMatrix();
        if (leaves3Ref.current) leaves3Ref.current.setMatrixAt(i, dummy.matrix);
     }
     if (leaves1Ref.current) leaves1Ref.current.instanceMatrix.needsUpdate = true;
     if (leaves2Ref.current) leaves2Ref.current.instanceMatrix.needsUpdate = true;
     if (leaves3Ref.current) leaves3Ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={leaves1Ref} args={[null, null, treeData.length]} castShadow receiveShadow>
        <coneGeometry args={[1, 2, 6]} />
        <meshStandardMaterial color="#064e3b" roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={leaves2Ref} args={[null, null, treeData.length]} castShadow receiveShadow>
        <coneGeometry args={[1, 2, 6]} />
        <meshStandardMaterial color="#065f46" roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={leaves3Ref} args={[null, null, treeData.length]} castShadow receiveShadow>
        <coneGeometry args={[1, 2, 6]} />
        <meshStandardMaterial color="#047857" roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={trunkRef} args={[null, null, treeData.length]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.6, 1, 5]} />
        <meshStandardMaterial color="#451a03" roughness={1} />
      </instancedMesh>
    </group>
  );
};

// --- OCEAN ---
const Ocean = () => {
  const meshRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const pos = meshRef.current.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = Math.sin(x * 0.8 + time * 1.5) * 0.2 
              + Math.cos(z * 1.0 + time * 1.2) * 0.25 
              + Math.sin((x+z) * 1.5 + time) * 0.15;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
  });
  
  return (
    <mesh ref={meshRef} position={[0, -0.9, 25]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[90, 40, 128, 64]} />
      {/* PhysicalMaterial makes water look much more realistic */}
      <meshPhysicalMaterial 
        color="#0284c7" 
        transparent 
        opacity={0.9} 
        roughness={0.05} 
        metalness={0.8} 
        clearcoat={1.0}
        depthWrite={false} 
      />
    </mesh>
  );
};

// --- RIVER ---
const RiverSurface = ({ cycleState }) => {
   const geom = useMemo(() => {
      const widthSegments = 24;
      const lengthSegments = 150;
      const geo = new THREE.PlaneGeometry(1, 1, widthSegments, lengthSegments);
      geo.rotateX(-Math.PI / 2);
      const pos = geo.attributes.position;
      
      for (let i = 0; i < pos.count; i++) {
         const u = (i % (widthSegments + 1)) / widthSegments; 
         const v = Math.floor(i / (widthSegments + 1)) / lengthSegments; 
         
         const z = -35 + (v * 45); 
         const riverX = Math.sin(z * 0.08) * 6 + Math.sin(z * 0.04) * 3;
         
         const coastlineZ = 8;
         const distFromCoast = (coastlineZ - z);
         
         // Visibly wider river
         const width = 2.5 + Math.pow(Math.max(0, (z + 20) / 28), 2.5) * 14;
         const xOffset = (u - 0.5) * width;
         const x = riverX + xOffset;
         
         let y = distFromCoast * 0.04 - 0.75; 
         if (z > coastlineZ) y = -0.9; 
         
         pos.setX(i, x);
         pos.setY(i, y);
         pos.setZ(i, z);
      }
      geo.computeVertexNormals();
      return geo;
   }, []);

   const meshRef = useRef();

   useFrame((state) => {
      const time = state.clock.elapsedTime;
      const pos = meshRef.current.geometry.attributes.position;
      const widthSegments = 24;
      
      const speed = cycleState === 'river' ? 5.0 : 2.0;

      for (let i = 0; i < pos.count; i++) {
         const u = (i % (widthSegments + 1)) / widthSegments; 
         const z = pos.getZ(i);
         const x = pos.getX(i);
         
         const ripple = Math.sin(z * 4 + time * 2 * speed) * 0.08 * Math.sin(u * Math.PI);
         
         const coastlineZ = 8;
         const distFromCoast = (coastlineZ - z);
         let y = distFromCoast * 0.04 - 0.75 + ripple;
         
         if (z > coastlineZ) {
             y = -0.9 + Math.sin(x * 0.8 + time * 1.5) * 0.2 + Math.cos(z * 1.0 + time * 1.2) * 0.25; 
         }
         pos.setY(i, y);
      }
      pos.needsUpdate = true;
      meshRef.current.geometry.computeVertexNormals();
   });
   
   return (
     <mesh ref={meshRef} geometry={geom} receiveShadow>
        <meshPhysicalMaterial 
          color="#38bdf8" 
          transparent 
          opacity={0.95} 
          roughness={0.05} 
          metalness={0.6} 
          clearcoat={1.0}
          depthWrite={false} 
        />
     </mesh>
   );
};

// --- CLOUD ---
const Cloud = ({ cycleState, cloudPosRef }) => {
  const groupRef = useRef();
  
  // Custom material properties to blend spheres better
  const material = useMemo(() => new THREE.MeshLambertMaterial({ 
    color: '#ffffff', 
    transparent: true, 
    opacity: 0.9,
    depthWrite: false, // Prevents Z-fighting and hard edges between spheres
  }), []);
  
  const targetZ = (cycleState === 'drift' || cycleState === 'rain' || cycleState === 'river') ? -15 : 10;
  const targetColor = useMemo(() => new THREE.Color(), []);
  
  const blobs = useMemo(() => {
     return [
       { p: [0, 0, 0], s: 3.8 },
       { p: [-2.0, -0.3, 1.2], s: 2.8 },
       { p: [2.2, -0.4, -0.8], s: 2.6 },
       { p: [-1.5, 1.5, -1.5], s: 3.0 },
       { p: [1.8, 1.2, 1.8], s: 2.8 },
       { p: [-3.5, -0.6, -0.4], s: 2.2 },
       { p: [3.5, -0.7, 0.6], s: 2.0 },
       { p: [1.0, -0.8, 2.8], s: 2.4 },
       { p: [-1.0, -0.9, -2.8], s: 2.6 },
       { p: [0, 2.5, 0.5], s: 2.5 },
     ]
  }, []);

  useFrame((state, delta) => {
    groupRef.current.position.z += (targetZ - groupRef.current.position.z) * delta * 0.4;
    groupRef.current.position.y = 14 + Math.sin(state.clock.elapsedTime * 0.8) * 0.5;
    groupRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 1.5;
    
    cloudPosRef.current.copy(groupRef.current.position);
    
    if (cycleState === 'rain') {
        targetColor.set('#475569'); 
    } else if (cycleState === 'drift') {
        targetColor.set('#94a3b8'); 
    } else {
        targetColor.set('#ffffff'); 
    }
    
    material.color.lerp(targetColor, delta * 0.6);
    
    let targetScale = 1.0;
    if (cycleState === 'rain') targetScale = 1.5;
    else if (cycleState === 'drift') targetScale = 1.3;
    else if (cycleState === 'river') targetScale = 1.2;
    
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 0.5);
  });
  
  return (
    <group ref={groupRef} position={[0, 14, 10]}>
       {blobs.map((b, i) => (
         <mesh key={i} position={b.p} material={material} castShadow={false} receiveShadow={false}>
           <sphereGeometry args={[b.s, 32, 32]} />
         </mesh>
       ))}
    </group>
  );
};

// --- PARTICLES ---
const Rain = ({ cycleState, cloudPosRef }) => {
  const rainRef = useRef();
  const splashRef = useRef();
  
  const count = 2000; 
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    return Array.from({length: count}, () => ({
      x: (Math.random() - 0.5) * 16,
      y: Math.random() * 15,
      z: (Math.random() - 0.5) * 16,
      vy: Math.random() * 0.8 + 0.5, 
      length: 6 + Math.random() * 6,
      active: false,
      isSplash: false,
      splashLife: 0
    }))
  }, []);
  
  const [intensity, setIntensity] = useState(0);

  useFrame((state, delta) => {
     let currentIntensity = intensity;
     if (cycleState === 'rain') {
        currentIntensity = Math.min(currentIntensity + delta * 0.5, 1);
     } else {
        currentIntensity = Math.max(currentIntensity - delta * 1.5, 0);
     }
     setIntensity(currentIntensity);

     const activeCount = Math.floor(count * currentIntensity);
     
     for (let i = 0; i < count; i++) {
        const p = particles[i];
        
        if (p.isSplash) {
           p.splashLife -= delta * 4;
           if (p.splashLife <= 0) {
              p.isSplash = false;
              if (i >= activeCount) p.active = false;
           } else {
              dummy.position.set(p.x, p.y, p.z);
              dummy.scale.setScalar((1 - p.splashLife) * 2.5);
              dummy.updateMatrix();
              if (splashRef.current) splashRef.current.setMatrixAt(i, dummy.matrix);
              if (rainRef.current) rainRef.current.setMatrixAt(i, new THREE.Matrix4().makeScale(0,0,0));
           }
           continue;
        }

        if (i < activeCount || p.active) {
           if (!p.active) {
             p.active = true;
             p.y = cloudPosRef.current.y - 3;
             const radius = Math.random() * Math.random() * 8;
             const angle = Math.random() * Math.PI * 2;
             p.x = cloudPosRef.current.x + Math.cos(angle) * radius;
             p.z = cloudPosRef.current.z + Math.sin(angle) * radius;
           }
           p.y -= p.vy * delta * 75; 
           p.z -= delta * 6; // Diagonal wind
           p.x += delta * 3;
           
           const terrainY = getTerrainHeight(p.x, p.z) - 0.5; 
           
           if (p.y < terrainY || p.y < -0.9) { 
              p.isSplash = true;
              p.splashLife = 1.0;
              p.y = Math.max(terrainY, -0.9);
              
              if (i >= activeCount && Math.random() > 0.05) {
                  p.active = false;
                  p.isSplash = false;
              }
           } else {
              dummy.position.set(p.x, p.y, p.z);
              dummy.scale.set(0.15, p.length, 0.15); 
              dummy.rotation.set(0.08, 0, -0.04); 
              dummy.updateMatrix();
              if(rainRef.current) rainRef.current.setMatrixAt(i, dummy.matrix);
              if(splashRef.current) splashRef.current.setMatrixAt(i, new THREE.Matrix4().makeScale(0,0,0));
           }
        } else {
           p.active = false;
           dummy.position.set(0, -100, 0);
           dummy.updateMatrix();
           if(rainRef.current) rainRef.current.setMatrixAt(i, dummy.matrix);
           if(splashRef.current) splashRef.current.setMatrixAt(i, dummy.matrix);
        }
     }
     if(rainRef.current) rainRef.current.instanceMatrix.needsUpdate = true;
     if(splashRef.current) splashRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={rainRef} args={[null, null, count]}>
        <cylinderGeometry args={[0.03, 0.03, 1, 4]} />
        <meshBasicMaterial color="#bae6fd" transparent opacity={0.7} />
      </instancedMesh>
      <instancedMesh ref={splashRef} args={[null, null, count]}>
        <ringGeometry args={[0.2, 0.3, 8]} />
        <meshBasicMaterial color="#bae6fd" transparent opacity={0.8} side={THREE.DoubleSide} />
      </instancedMesh>
    </group>
  );
};

const Vapor = ({ cycleState }) => {
  const meshRef = useRef();
  const count = 600;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    return Array.from({length: count}, () => ({
      x: (Math.random() - 0.5) * 40, 
      y: -0.9,
      z: 10 + Math.random() * 25, 
      vy: Math.random() * 2.5 + 1.5, 
      vz: -(Math.random() * 2.5 + 1.5), 
      life: Math.random(),
      active: false
    }))
  }, []);

  const [intensity, setIntensity] = useState(0);

  useFrame((state, delta) => {
     let currentIntensity = intensity;
     if (cycleState === 'evaporation' || cycleState === 'idle') {
        currentIntensity = Math.min(currentIntensity + delta * 0.8, 1);
     } else {
        currentIntensity = Math.max(currentIntensity - delta, 0);
     }
     setIntensity(currentIntensity);
     
     const activeCount = Math.floor(count * currentIntensity);

     for (let i = 0; i < count; i++) {
        const p = particles[i];
        if (i < activeCount) {
           p.life += delta * 0.15;
           if (p.life > 1) {
              p.life = 0;
              p.x = (Math.random() - 0.5) * 40;
              p.y = -0.9;
              p.z = 10 + Math.random() * 25;
           }
           p.y += p.vy * delta;
           p.z += p.vz * delta; 
           
           const swirl = Math.sin(p.y * 1.5 + state.clock.elapsedTime) * 1.5;
           
           dummy.position.set(p.x + swirl, p.y, p.z);
           const lifeCurve = Math.sin(p.life * Math.PI);
           const scale = lifeCurve * 2.5;
           dummy.scale.setScalar(scale);
           dummy.updateMatrix();
           if(meshRef.current) meshRef.current.setMatrixAt(i, dummy.matrix);
        } else {
           dummy.position.set(0, -100, 0);
           dummy.updateMatrix();
           if(meshRef.current) meshRef.current.setMatrixAt(i, dummy.matrix);
        }
     }
     if(meshRef.current) meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[0.5, 8, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
    </instancedMesh>
  );
};

const Runoff = ({ cycleState }) => {
  const meshRef = useRef();
  const count = 800;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    return Array.from({length: count}, () => ({
      x: (Math.random() - 0.5) * 50, 
      z: -35 + Math.random() * 35, 
      active: false
    }))
  }, []);
  
  useFrame((state, delta) => {
     for (let i = 0; i < count; i++) {
        const p = particles[i];
        if (cycleState === 'river' || cycleState === 'rain') {
           p.z += delta * 7; 
           const riverX = Math.sin(p.z * 0.08) * 6 + Math.sin(p.z * 0.04) * 3;
           if (p.x > riverX) p.x -= delta * 7;
           if (p.x < riverX) p.x += delta * 7;
           
           let y = getTerrainHeight(p.x, p.z) - 0.45;
           
           if (p.z > 8) { 
              p.x = (Math.random() - 0.5) * 50;
              p.z = -35 + Math.random() * 35;
           }

           dummy.position.set(p.x, y + 0.1, p.z);
           dummy.scale.setScalar(1.2);
           dummy.updateMatrix();
           if(meshRef.current) meshRef.current.setMatrixAt(i, dummy.matrix);
        } else {
           dummy.position.set(0, -100, 0);
           dummy.updateMatrix();
           if(meshRef.current) meshRef.current.setMatrixAt(i, dummy.matrix);
        }
     }
     if(meshRef.current) meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[0.15, 4, 4]} />
      <meshBasicMaterial color="#38bdf8" transparent opacity={0.9} />
    </instancedMesh>
  );
};

// --- MAIN WRAPPER ---
const FogAndAtmos = () => {
   const { scene } = useThree();
   useEffect(() => {
      // Reduced fog density drastically to eliminate washed-out haze
      scene.fog = new THREE.FogExp2('#e0f2fe', 0.006); 
      scene.background = new THREE.Color('#e0f2fe');
      return () => { 
         scene.fog = null; 
         scene.background = null; 
      }
   }, [scene]);
   return null;
}

const WaterCycleScene3D = ({ cycleState }) => {
  const cloudPosRef = useRef(new THREE.Vector3(0, 14, 10));

  return (
    <Canvas shadows camera={{ position: [0, 18, 45], fov: 42 }}>
      <FogAndAtmos />
      
      {/* Lower ambient light for much better shadows and contrast */}
      <ambientLight intensity={0.4} color="#ffffff" />
      <directionalLight 
         position={[-25, 40, 20]} 
         intensity={1.5} 
         color="#ffffff"
         castShadow 
         shadow-mapSize={[2048, 2048]} 
         shadow-camera-left={-45} 
         shadow-camera-right={45} 
         shadow-camera-top={45} 
         shadow-camera-bottom={-45} 
         shadow-bias={-0.001}
      />
      
      <mesh position={[-35, 45, -25]}>
         <sphereGeometry args={[4, 32, 32]} />
         <meshBasicMaterial color="#fef08a" />
      </mesh>

      <Terrain />
      <Vegetation />
      
      <RiverSurface cycleState={cycleState} />
      <Ocean />
      
      <Cloud cycleState={cycleState} cloudPosRef={cloudPosRef} />
      <Rain cycleState={cycleState} cloudPosRef={cloudPosRef} />
      <Vapor cycleState={cycleState} />
      <Runoff cycleState={cycleState} />
      
      <OrbitControls 
        makeDefault 
        minPolarAngle={Math.PI / 8} 
        maxPolarAngle={Math.PI / 2.2} 
        minDistance={20} 
        maxDistance={80} 
        target={[0, 0, -2]} 
        enablePan={false}
      />
    </Canvas>
  );
};

export default function WaterCycleActivity({ onNext }) {
  const [cycleState, setCycleState] = useState('idle');
  const [isRunning, setIsRunning] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  
  useEffect(() => {
    let timeout;
    if (isRunning) {
      if (cycleState === 'idle') {
        setCycleState('evaporation');
      } else if (cycleState === 'evaporation') {
        timeout = setTimeout(() => setCycleState('drift'), 4000);
      } else if (cycleState === 'drift') {
        timeout = setTimeout(() => setCycleState('rain'), 4000);
      } else if (cycleState === 'rain') {
        timeout = setTimeout(() => setCycleState('river'), 7000);
      } else if (cycleState === 'river') {
        timeout = setTimeout(() => setCycleState('evaporation'), 6000); 
      }
    }
    return () => clearTimeout(timeout);
  }, [cycleState, isRunning]);

  const toggleSimulation = () => {
    if (!isRunning) {
      setIsRunning(true);
      if (cycleState === 'idle') setCycleState('evaporation');
    } else {
      setIsRunning(false);
    }
  };

  const getStatusText = () => {
    switch (cycleState) {
      case 'idle': return "Ready to start the cycle.";
      case 'evaporation': return "1 • Heat from the sun causes water to evaporate into the air.";
      case 'drift': return "2 • Winds push the cloud toward the hills — it grows heavier and darker.";
      case 'rain': return "3 • The heavy cloud releases rain over the mountains (precipitation).";
      case 'river': return "4 • The river collects the water and flows back to the sea.";
      default: return "";
    }
  };

  return (
    <div className="dark-coords-main-content" style={{ minHeight: '100vh', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="dark-coords-left" style={{ position: 'relative', overflow: 'hidden', padding: 0, display: 'flex', flexDirection: 'column', background: '#0a0f1d' }}>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: '500px' }}>
          <WaterCycleScene3D cycleState={cycleState} />
        </div>
      </div>

      <div className="dark-coords-right" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '40px' }}>
        <div>
          <div className="dark-top-title" style={{ fontSize: '14px', marginBottom: '8px', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '8px' }}>
            ACTIVITY 4 OF 4
            <span style={{ background: '#fef3c7', color: '#b45309', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '800' }}>
              LIVING PICTURE
            </span>
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px', color: '#f8fafc' }}>
            The Water Cycle Never Stops
          </h2>
          <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: '1.6' }}>
            The rain that falls on the hills once rose from the sea — and it will rise again. Watch the whole journey: shimmering evaporation, a cloud that darkens as it drifts, real rain on the slopes, and the river carrying every drop home.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={toggleSimulation}
              style={{
                flex: 1,
                background: isRunning ? '#3b82f6' : '#22c55e',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: isRunning ? '0 4px 15px rgba(59, 130, 246, 0.3)' : '0 4px 15px rgba(34, 197, 94, 0.3)',
              }}
            >
              {isRunning ? <><Pause size={20} /> Pause Cycle</> : cycleState === 'river' ? <><RotateCcw size={20} /> Restart Cycle</> : <><Play size={20} /> Play Cycle</>}
            </button>
          </div>
          <div style={{ 
            minHeight: '60px', 
            background: '#0f172a', 
            padding: '16px', 
            borderRadius: '8px', 
            border: '1px solid #1e293b',
            color: '#e2e8f0',
            fontSize: '15px',
            fontWeight: '500',
            lineHeight: 1.5,
            display: 'flex',
            alignItems: 'center'
          }}>
            {getStatusText()}
          </div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '24px',
          borderRadius: '16px',
        }}>
          <h3 style={{ fontSize: '18px', marginBottom: '20px', color: '#e2e8f0', lineHeight: 1.5 }}>
            Because the water cycle is a continuous pattern, the water in your glass today is:
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              "Brand new water made by the factory.",
              "The exact same water dinosaurs drank.",
              "Water that comes from outer space daily."
            ].map((ans, idx) => {
              const isSelected = selectedAnswer === ans;
              const isCorrect = idx === 1;
              const showResult = selectedAnswer !== null;

              let btnBg = 'rgba(255,255,255,0.05)';
              let btnBorder = 'rgba(255,255,255,0.1)';
              
              if (showResult && isSelected) {
                if (isCorrect) {
                  btnBg = 'rgba(34, 197, 94, 0.2)'; btnBorder = '#22c55e';
                } else {
                  btnBg = 'rgba(239, 68, 68, 0.2)'; btnBorder = '#ef4444';
                }
              } else if (showResult && isCorrect) {
                btnBorder = '#22c55e';
              }

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedAnswer(ans)}
                  disabled={showResult}
                  style={{
                    padding: '16px', borderRadius: '12px',
                    background: btnBg, border: `2px solid ${btnBorder}`,
                    color: '#fff', fontSize: '15px', fontWeight: '600',
                    cursor: showResult ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                    opacity: showResult && !isSelected && !isCorrect ? 0.5 : 1,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ flex: 1 }}>{ans}</span>
                  {showResult && isCorrect && <CheckCircle size={20} color="#4ade80" />}
                </button>
              );
            })}
          </div>

          {selectedAnswer && (
            <div style={{ marginTop: '20px', fontSize: '15px', color: selectedAnswer.includes("dinosaurs") ? '#4ade80' : '#f87171', fontWeight: '500', lineHeight: 1.5 }}>
              {selectedAnswer.includes("dinosaurs") 
                ? "Correct! The water cycle never loses or gains water; it just loops perfectly forever!" 
                : 'Not quite. Think about what a "cycle" means—nothing is ever added or destroyed!'}
            </div>
          )}

          {selectedAnswer && selectedAnswer.includes("dinosaurs") && (
            <button
              onClick={onNext}
              style={{
                marginTop: '24px',
                width: '100%',
                background: '#22c55e',
                color: 'white',
                border: 'none',
                padding: '16px',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)'
              }}
            >
              Finish Chapter <CheckCircle size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
