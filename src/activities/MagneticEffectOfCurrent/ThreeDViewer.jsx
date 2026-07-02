import React, { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Center, Text } from '@react-three/drei';

// --- Switch Board 3D Model ---
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

// --- Compass Bench 3D Model ---
const CompassBoardModel = () => (
  <group>
    <mesh castShadow receiveShadow>
      <boxGeometry args={[5.2, 0.12, 3.6]} />
      <meshStandardMaterial color="#c2a67a" roughness={0.85} metalness={0.05} />
    </mesh>
    {/* Nails on the bench */}
    <mesh position={[-1.6, 0.3, 0]}>
      <cylinderGeometry args={[0.06, 0.06, 0.6, 16]} />
      <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
    </mesh>
    <mesh position={[1.6, 0.3, 0]}>
      <cylinderGeometry args={[0.06, 0.06, 0.6, 16]} />
      <meshStandardMaterial color="var(--text-faint)" metalness={0.9} roughness={0.2} />
    </mesh>
  </group>
);

// --- Compass 3D Model ---
const CompassModel = ({ deflection = 0, isFlipped = false }) => {
  const needleRef = useRef();
  
  useFrame((state) => {
    if (needleRef.current) {
      const wiggle = deflection === 0 ? Math.sin(state.clock.elapsedTime * 2) * 0.1 : 0;
      const targetRotation = ((isFlipped ? -deflection : deflection) * Math.PI) / 180 + wiggle;
      needleRef.current.rotation.y = THREE.MathUtils.lerp(needleRef.current.rotation.y, targetRotation, 0.1);
    }
  });

  return (
    <group scale={[1.2, 1.2, 1.2]} rotation={isFlipped ? [0, 0, Math.PI] : [0, 0, 0]}>
      {/* Base Case */}
      <mesh castShadow position={[0, -0.2, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.15, 32]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Compass rim */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[1.25, 1.25, 0.2, 32]} />
        <meshStandardMaterial color="#64748b" roughness={0.6} metalness={0.8} />
      </mesh>
      {/* Markings */}
      <group position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <Text position={[0, 0.9, 0]} fontSize={0.25} color="#ffffff">N</Text>
        <Text position={[0, -0.9, 0]} fontSize={0.25} color="#ffffff">S</Text>
        <Text position={[0.9, 0, 0]} fontSize={0.25} color="#ffffff">E</Text>
        <Text position={[-0.9, 0, 0]} fontSize={0.25} color="#ffffff">W</Text>
      </group>
      {/* Compass Needle Group */}
      <group ref={needleRef} position={[0, 0.1, 0]}>
        {/* Center pin */}
        <mesh>
          <cylinderGeometry args={[0.05, 0.05, 0.2, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        {/* North (Red) Needle */}
        <mesh position={[0, 0, -0.4]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.15, 0.8, 4]} />
          <meshStandardMaterial color="#ef4444" roughness={0.3} metalness={0.2} />
        </mesh>
        {/* South (Blue) Needle */}
        <mesh position={[0, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.15, 0.8, 4]} />
          <meshStandardMaterial color="#3b82f6" roughness={0.3} metalness={0.2} />
        </mesh>
      </group>
      {/* Glass Cover */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[1.18, 1.18, 0.05, 32]} />
        <meshStandardMaterial color="#ffffff" opacity={0.3} transparent roughness={0} metalness={0.9} />
      </mesh>
    </group>
  );
};

// --- Drawing Pin 3D Model ---
const DrawingPinModel = () => (
  <group>
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

// --- Safety Pin 3D Model ---
const SafetyPinModel = ({ switchOn = false }) => {
  const groupRef = useRef();
  useFrame(() => {
    if (groupRef.current) {
       const target = switchOn ? 0 : 0.4;
       groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, target, 0.15);
    }
  });

  return (
    <group rotation={[Math.PI / 2, 0, 0]} scale={[1.2, 1.2, 1.2]}>
      <group position={[0.05, -0.9, 0]}>
        <mesh castShadow position={[-0.15, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 1.8, 16]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh castShadow position={[-0.05, 0.9, 0]}>
          <boxGeometry args={[0.32, 0.28, 0.16]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.3} />
        </mesh>
        <group position={[-0.05, 0.9, 0]} ref={groupRef}>
          <mesh castShadow position={[0.2, -1.0, 0]} rotation={[0, 0, -Math.PI / 10]}>
            <cylinderGeometry args={[0.03, 0.03, 1.6, 16]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh castShadow position={[0.05, -1.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.15, 0.04, 16, 32]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// --- Battery 3D Model ---
const BatteryModel = ({ isFlipped = false, hasExtraBattery = false }) => {
  const rotationZ = isFlipped ? Math.PI / 2 : -Math.PI / 2;
  return (
    <group rotation={[0, 0, rotationZ]} scale={[1.1, 1.1, 1.1]}>
      {/* Battery 1 */}
      <group position={[0, hasExtraBattery ? 0.7 : 0, 0]}>
        <mesh castShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 1.3, 32]} />
          <meshStandardMaterial color="#ef4444" roughness={0.3} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.43, 0.43, 0.5, 32]} />
          <meshStandardMaterial color="#111827" roughness={0.4} metalness={0.05} />
        </mesh>
        <mesh position={[0, -0.68, 0]}>
          <cylinderGeometry args={[0.41, 0.41, 0.06, 32]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.68, 0]}>
          <cylinderGeometry args={[0.41, 0.41, 0.06, 32]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.74, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.08, 16]} />
          <meshStandardMaterial color="#d1d5db" metalness={0.95} roughness={0.1} />
        </mesh>
        
        {/* Labels */}
        <Text position={[0, 0.5, 0.44]} rotation={[0, 0, Math.PI / 2]} fontSize={0.25} color="#111827">+</Text>
        <Text position={[0, -0.5, 0.44]} rotation={[0, 0, Math.PI / 2]} fontSize={0.3} color="#111827">-</Text>
        <Text position={[0, 0, 0.44]} rotation={[0, 0, Math.PI / 2]} fontSize={0.12} color="#fef08a" letterSpacing={0.1}>CELL 1.5V</Text>
      </group>

      {/* Battery 2 */}
      {hasExtraBattery && (
        <group position={[0, -0.7, 0]}>
          <mesh castShadow position={[0, 0, 0]}>
            <cylinderGeometry args={[0.42, 0.42, 1.3, 32]} />
            <meshStandardMaterial color="#ef4444" roughness={0.3} metalness={0.1} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.43, 0.43, 0.5, 32]} />
            <meshStandardMaterial color="#111827" roughness={0.4} metalness={0.05} />
          </mesh>
          <mesh position={[0, -0.68, 0]}>
            <cylinderGeometry args={[0.41, 0.41, 0.06, 32]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.68, 0]}>
            <cylinderGeometry args={[0.41, 0.41, 0.06, 32]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.74, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 0.08, 16]} />
            <meshStandardMaterial color="#d1d5db" metalness={0.95} roughness={0.1} />
          </mesh>
          <Text position={[0, 0.5, 0.44]} rotation={[0, 0, Math.PI / 2]} fontSize={0.25} color="#111827">+</Text>
          <Text position={[0, -0.5, 0.44]} rotation={[0, 0, Math.PI / 2]} fontSize={0.3} color="#111827">-</Text>
          <Text position={[0, 0, 0.44]} rotation={[0, 0, Math.PI / 2]} fontSize={0.12} color="#fef08a" letterSpacing={0.1}>CELL 1.5V</Text>
        </group>
      )}
    </group>
  );
};

// --- Wires 3D Model ---
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

const CurvedWire = ({ p1, p2, controlPoint, radius, color }) => {
  const curve = React.useMemo(() => new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(...p1),
    new THREE.Vector3(...controlPoint),
    new THREE.Vector3(...p2)
  ), [p1, p2, controlPoint]);
  
  return (
    <mesh castShadow>
      <tubeGeometry args={[curve, 20, radius, 8, false]} />
      <meshStandardMaterial 
        color={color} 
        roughness={color === '#ca8a04' ? 0.15 : 0.3} 
        metalness={color === '#ca8a04' ? 0.95 : 0.1} 
      />
    </mesh>
  );
};

const WiresModel = () => {
  const points = [
    [-1.0, -0.3, 0.2], [-0.85, -0.25, 0.15], [-0.6, -0.05, 0.05], [-0.3, 0.15, -0.05],
    [0.0, 0.2, -0.1], [0.3, 0.1, -0.05], [0.6, -0.1, 0.05], [0.8, -0.22, 0.1],
    [0.9, -0.25, 0.12], [1.0, -0.3, 0.15]
  ];

  return (
    <group rotation={[0.1, 0.2, 0]}>
      {points.map((p, i) => {
        if (i === points.length - 1) return null;
        const isCopper = i === 0 || i === points.length - 2;
        const color = isCopper ? '#ca8a04' : 'var(--danger)';
        const radius = isCopper ? 0.025 : 0.045;
        return (
          <WireSegment key={i} p1={p} p2={points[i + 1]} radius={radius} color={color} />
        );
      })}
    </group>
  );
};

const CircuitWiresModel = ({ isBatteryFlipped, hasExtraBattery }) => {
  const singlePos = 0.8;
  const singleNeg = -0.75;
  const doublePos = 1.57;
  const doubleNeg = -1.52;

  let posEnd = hasExtraBattery ? doublePos : singlePos;
  let negEnd = hasExtraBattery ? doubleNeg : singleNeg;

  if (isBatteryFlipped) {
    const temp = posEnd;
    posEnd = -negEnd;
    negEnd = -temp;
  }

  const batteryPosEnd = [posEnd, 0.46, 3];
  const batteryNegEnd = [negEnd, 0.46, 3];

  return (
    <group>
      <CurvedWire p1={batteryPosEnd} p2={[4.9, 0.1, 0.0]} controlPoint={[(posEnd+4.9)/2, 0.0, 1.8]} radius={0.04} color="#ef4444" />
      <CurvedWire p1={[1.8, 0.1, 0]} p2={[-1.9, 0.3, 0]} controlPoint={[0, 0.0, -0.5]} radius={0.04} color="#ef4444" />
      <CurvedWire p1={[-5.1, 0.3, 0]} p2={batteryNegEnd} controlPoint={[(-5.1+negEnd)/2, 0.0, 1.5]} radius={0.04} color="#374151" />
      {/* Copper wire across nails */}
      <mesh position={[-3.5, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 3.2, 16]} />
        <meshStandardMaterial color="#ca8a04" metalness={0.95} roughness={0.15} />
      </mesh>
    </group>
  );
};

const CircuitModel = ({ switchOn, isBatteryFlipped, hasExtraBattery, deflection, isCompassFlipped }) => {
  const fieldLinesRef = useRef();

  useFrame((state) => {
    if (fieldLinesRef.current && switchOn) {
      const speed = isBatteryFlipped ? 1.5 : -1.5;
      fieldLinesRef.current.rotation.y = state.clock.elapsedTime * speed;
    }
  });

  return (
    <group position={[0, -0.5, -0.5]} scale={[0.7, 0.7, 0.7]}>
      {/* Switch Board on Right */}
      <group position={[3.5, 0, 0]}>
        <SwitchBoardModel />
        <group position={[-1.1, 0.1, 0]}><DrawingPinModel /></group>
        <group position={[1.1, 0.1, 0]}><DrawingPinModel /></group>
        <group position={[-1.1, 0.2, 0]} rotation={[0, -Math.PI/2, 0]}>
          <SafetyPinModel switchOn={switchOn} />
        </group>
      </group>

      {/* Compass Bench on Left */}
      <group position={[-3.5, 0, 0]}>
        <CompassBoardModel />
        <group position={[0, isCompassFlipped ? -0.4 : 0.2, 0]}><CompassModel deflection={deflection} isFlipped={isCompassFlipped} /></group>
      </group>

      {/* Battery at Bottom */}
      <group position={[0, 0.46, 3]}>
        <BatteryModel isFlipped={isBatteryFlipped} hasExtraBattery={hasExtraBattery} />
      </group>

      {/* Wires connecting them */}
      <CircuitWiresModel isBatteryFlipped={isBatteryFlipped} hasExtraBattery={hasExtraBattery} />
      
      {/* Magnetic Field Lines effect when switch is ON */}
      {switchOn && (
        <group position={[-3.5, 0.35, 0]} rotation={[0, 0, Math.PI/2]}>
          <group ref={fieldLinesRef}>
           {[0.6, 1.2, 1.8].map((radius, i) => (
             <group key={i} rotation={[Math.PI/2, 0, 0]}>
               <mesh>
                 <torusGeometry args={[radius, 0.015, 16, 64]} />
                 <meshBasicMaterial color="#3b82f6" transparent opacity={0.4 - i*0.1} />
               </mesh>
               {[0, Math.PI/2, Math.PI, 3*Math.PI/2].map((angle, j) => (
                 <mesh 
                   key={j} 
                   position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]} 
                   rotation={[0, 0, angle + (isBatteryFlipped ? Math.PI : 0)]}
                 >
                   <coneGeometry args={[0.06, 0.15, 8]} />
                   <meshBasicMaterial color="#3b82f6" transparent opacity={0.6 - i*0.1} />
                 </mesh>
               ))}
             </group>
           ))}
          </group>
        </group>
      )}
    </group>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return <div style={{ color: 'red', padding: '1rem' }}>3D Viewer Error: {this.state.error?.message}</div>;
    }
    return this.props.children;
  }
}

export default function ThreeDViewer({ componentId, switchOn, isBatteryFlipped, hasExtraBattery, deflection, isCompassFlipped }) {
  const containerRef = useRef(null);

  const handleZoom = (deltaY) => {
    if (containerRef.current) {
      const canvas = containerRef.current.querySelector('canvas');
      if (canvas) {
        const event = new WheelEvent('wheel', { 
          deltaY, 
          clientX: canvas.getBoundingClientRect().width / 2, 
          clientY: canvas.getBoundingClientRect().height / 2,
          bubbles: true 
        });
        canvas.dispatchEvent(event);
      }
    }
  };

  const renderModel = () => {
    switch (componentId) {
      case 'switchBoard': return <SwitchBoardModel />;
      case 'compassBoard': return <CompassBoardModel />;
      case 'pin1':
      case 'pin2': return <DrawingPinModel />;
      case 'safetyPin': return <SafetyPinModel switchOn={switchOn} />;
      case 'battery': return <BatteryModel isFlipped={isBatteryFlipped} hasExtraBattery={hasExtraBattery} />;
      case 'compass': return <CompassModel deflection={deflection} isFlipped={isCompassFlipped} />;
      case 'wires': return <WiresModel />;
      case 'circuit': return <CircuitModel switchOn={switchOn} isBatteryFlipped={isBatteryFlipped} hasExtraBattery={hasExtraBattery} deflection={deflection} isCompassFlipped={isCompassFlipped} />;
      default: return null;
    }
  };

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', outline: 'none', background: 'var(--canvas-bg)', borderRadius: '16px', position: 'relative' }}>
      
      {/* Zoom Controls Overlay */}
      <div style={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button 
          onClick={() => handleZoom(-250)}
          style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '20px', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
          title="Zoom In"
        >
          +
        </button>
        <button 
          onClick={() => handleZoom(250)}
          style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '20px', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
          title="Zoom Out"
        >
          −
        </button>
      </div>

      <ErrorBoundary>
        <Canvas shadows camera={{ position: [0, 4.5, 5], fov: 50 }} gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true }}>
          <ambientLight intensity={1.1} />
          <pointLight position={[10, 10, 10]} intensity={1.8} castShadow />
          <pointLight position={[-10, 5, -10]} intensity={0.6} />
          <directionalLight position={[0, 5, 2]} intensity={1.2} />
          <Center>{renderModel()}</Center>
          <OrbitControls enableDamping={true} dampingFactor={0.06} minDistance={1.5} maxDistance={10.0} makeDefault />
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}

