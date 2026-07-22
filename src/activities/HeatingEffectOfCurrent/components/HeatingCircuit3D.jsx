import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Text } from "@react-three/drei";
import * as THREE from "three";

function Battery({ position, rotation, index = 0 }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow position={[index * 1.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.25, 0.25, 1, 32]} />
        <meshStandardMaterial color="#ef4444" metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[index * 1.05 + 0.52, 0, 0]} castShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Switch({ position, isClosed }) {
  const pinRef = useRef();
  
  useFrame(() => {
    if (pinRef.current) {
      const targetRotation = isClosed ? 0 : -Math.PI / 6;
      pinRef.current.rotation.y += (targetRotation - pinRef.current.rotation.y) * 0.2;
    }
  });

  return (
    <group position={position}>
      <mesh receiveShadow castShadow position={[0, 0.05, 0]}>
        <boxGeometry args={[1.5, 0.1, 1]} />
        <meshStandardMaterial color="#d2b48c" roughness={0.9} />
      </mesh>
      {/* Pin 1 */}
      <mesh position={[-0.5, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Pin 2 */}
      <mesh position={[0.5, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Safety Pin */}
      <group position={[-0.5, 0.2, 0]} ref={pinRef}>
        <mesh castShadow position={[0.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.02, 0.8, 8, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}

function NichromeSetup({ position, temperature, lengthFactor = 1, thicknessFactor = 1, materialType = "nichrome" }) {
  const wireRef = useRef();
  const glowRef = useRef();
  
  const baseColorMap = React.useMemo(() => ({
    copper: new THREE.Color("#b87333"),
    aluminium: new THREE.Color("#d1d5db"),
    iron: new THREE.Color("#4b5563"),
    nichrome: new THREE.Color("#6b7280")
  }), []);
  
  const glowColor = React.useMemo(() => new THREE.Color("#ff3300"), []);

  useFrame(() => {
    if (wireRef.current && glowRef.current) {
      const normalizedTemp = Math.max(0, Math.min(1, (temperature - 20) / 1000));
      const baseColor = baseColorMap[materialType] || baseColorMap.nichrome;
      
      if (normalizedTemp > 0.3) { // Start glowing red
        const lerpFactor = (normalizedTemp - 0.3) / 0.7;
        wireRef.current.material.color.lerpColors(baseColor, glowColor, lerpFactor);
        wireRef.current.material.emissive.copy(glowColor).multiplyScalar(lerpFactor * 2);
        
        glowRef.current.material.opacity = lerpFactor * 0.5;
      } else {
        wireRef.current.material.color.copy(baseColor);
        wireRef.current.material.emissive.setHex(0x000000);
        glowRef.current.material.opacity = 0;
      }
    }
  });

  return (
    <group position={position}>
      {/* Cardboard base */}
      <mesh receiveShadow castShadow position={[0, 0.05, 0]}>
        <boxGeometry args={[lengthFactor * 3 + 1, 0.1, 1.5]} />
        <meshStandardMaterial color="#d2b48c" roughness={0.9} />
      </mesh>
      
      {/* Nails */}
      <group position={[-lengthFactor * 1.5, 0.4, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.8, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh castShadow position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.04, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.3} />
        </mesh>
      </group>
      <group position={[lengthFactor * 1.5, 0.4, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.8, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh castShadow position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.04, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.3} />
        </mesh>
      </group>

      {/* Wire */}
      <mesh position={[0, 0.6, 0]} castShadow rotation={[0, 0, Math.PI / 2]} ref={wireRef}>
        <cylinderGeometry args={[0.02 * thicknessFactor, 0.02 * thicknessFactor, lengthFactor * 3, 16]} />
        <meshStandardMaterial color="#6b7280" metalness={0.8} roughness={0.4} />
      </mesh>
      
      {/* Glow effect */}
      <mesh position={[0, 0.6, 0]} rotation={[0, 0, Math.PI / 2]} ref={glowRef}>
        <cylinderGeometry args={[0.04 * thicknessFactor, 0.04 * thicknessFactor, lengthFactor * 3, 16]} />
        <meshBasicMaterial color="#ff3300" transparent opacity={0} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

function ConnectingWires({ numCells, lengthFactor = 1 }) {
  const curves = React.useMemo(() => {
    const batteryNeg = new THREE.Vector3(-0.5, 0.25, 2);
    const batteryPos = new THREE.Vector3(-1.52 - (numCells - 1) * 1.05, 0.25, 2);
    const switchLeft = new THREE.Vector3(0.5, 0.15, 2);
    const switchRight = new THREE.Vector3(1.5, 0.15, 2);
    const nailLeft = new THREE.Vector3(-lengthFactor * 1.5, 0.35, 0);
    const nailRight = new THREE.Vector3(lengthFactor * 1.5, 0.35, 0);

    return {
      black: new THREE.CatmullRomCurve3([
        batteryNeg,
        new THREE.Vector3(-0.1, 0.05, 2.0),
        new THREE.Vector3(0.2, 0.2, 2.0),
        switchLeft
      ], false, 'chordal', 0.5),
      yellow: new THREE.CatmullRomCurve3([
        switchRight,
        new THREE.Vector3(1.5, 0.2, 1.4),
        new THREE.Vector3(1.5, 0.05, 1.1),
        new THREE.Vector3(nailRight.x + 0.1, 0.2, 0.7),
        nailRight
      ], false, 'chordal', 0.5),
      red: new THREE.CatmullRomCurve3([
        nailLeft,
        new THREE.Vector3(nailLeft.x - 0.1, 0.2, 0.7),
        new THREE.Vector3(batteryPos.x, 0.05, 1.2),
        batteryPos
      ], false, 'chordal', 0.5)
    };
  }, [numCells, lengthFactor]);

  return (
    <group>
      {/* Battery Neg to Switch Left (Black) */}
      <mesh>
        <tubeGeometry args={[curves.black, 64, 0.035, 12, false]} />
        <meshStandardMaterial color="#1f2937" roughness={0.8} />
      </mesh>
      
      {/* Switch Right to Nail Right (Yellow) */}
      <mesh>
        <tubeGeometry args={[curves.yellow, 64, 0.035, 12, false]} />
        <meshStandardMaterial color="#eab308" roughness={0.8} />
      </mesh>
      
      {/* Nail Left to Battery Pos (Red) */}
      <mesh>
        <tubeGeometry args={[curves.red, 64, 0.035, 12, false]} />
        <meshStandardMaterial color="#ef4444" roughness={0.8} />
      </mesh>
    </group>
  );
}

export default function HeatingCircuit3D({ 
  switchOn = false, 
  numCells = 1,
  wireLength = 1,
  wireThickness = 1,
  material = "nichrome",
  temperature = 25
}) {
  return (
    <Canvas camera={{ position: [0, 4, 6], fov: 45 }} shadows>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow shadow-mapSize={2048} />
      
      <Environment preset="apartment" />

      <group position={[0, -0.5, 0]}>
        {/* Render multiple cells if needed */}
        {[...Array(numCells)].map((_, i) => (
          <Battery key={i} position={[-1 - i * 1.05, 0.25, 2]} rotation={[0, Math.PI, 0]} />
        ))}
        
        <Switch position={[1, 0, 2]} isClosed={switchOn} />
        
        <NichromeSetup 
          position={[0, 0, 0]} 
          temperature={temperature} 
          lengthFactor={wireLength}
          thicknessFactor={wireThickness}
          materialType={material}
        />
        
        <ConnectingWires numCells={numCells} lengthFactor={wireLength} />
      </group>

      <ContactShadows position={[0, -0.5, 0]} opacity={0.5} scale={15} blur={2} far={4} />
      <OrbitControls 
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 2.1} 
        minDistance={3} 
        maxDistance={10} 
      />
    </Canvas>
  );
}
