import React, { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Center, Text, Billboard } from '@react-three/drei';

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
const CompassModel = ({ compassPosition = "below", onToggleCompassPosition }) => {
  const needleRef = useRef();
  const groupRef = useRef();
  const currentDeflection = useRef(Math.PI / 3);
  const [hovered, setHovered] = React.useState(false);
  
  React.useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => { document.body.style.cursor = 'auto' };
  }, [hovered]);
  
  useFrame((state, delta) => {
    if (needleRef.current) {
      // Smoothly animate the needle deflection
      const targetDeflection = compassPosition === "above" ? -Math.PI / 3 : Math.PI / 3;
      currentDeflection.current = THREE.MathUtils.lerp(currentDeflection.current, targetDeflection, delta * 1.5);
      needleRef.current.rotation.y = currentDeflection.current + Math.sin(state.clock.elapsedTime * 3) * 0.02;
    }
    
    // Smoothly animate the compass height
    if (groupRef.current) {
      const targetY = compassPosition === "above" ? 1.3 : 0.12;
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 2.5);
    }
  });

  // Generate degree tick marks
  const ticks = Array.from({ length: 72 }).map((_, i) => {
    const angle = (i * Math.PI * 2) / 72;
    const isMajor = i % 18 === 0;
    const isMedium = i % 9 === 0 && !isMajor;
    const length = isMajor ? 0.15 : isMedium ? 0.1 : 0.05;
    const thickness = isMajor ? 0.02 : 0.01;
    return (
      <mesh key={i} position={[Math.sin(angle) * 1.05, 0.01, Math.cos(angle) * 1.05]} rotation={[0, angle, 0]}>
        <boxGeometry args={[thickness, 0.01, length]} />
        <meshBasicMaterial color="#111827" />
      </mesh>
    );
  });

  return (
    <group 
      ref={groupRef} 
      position={[0, 0.12, 0]}
      onClick={(e) => {
        e.stopPropagation();
        if (onToggleCompassPosition) onToggleCompassPosition();
      }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
    >
      <group scale={[1.2, 1.2, 1.2]}>
      {/* Brass Base Body */}
      <mesh castShadow position={[0, -0.15, 0]}>
        <cylinderGeometry args={[1.25, 1.25, 0.2, 64]} />
        <meshStandardMaterial color="#b5a642" roughness={0.2} metalness={0.9} />
      </mesh>
      
      {/* Beveled Bottom Edge */}
      <mesh position={[0, -0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.05, 16, 64]} />
        <meshStandardMaterial color="#b5a642" roughness={0.3} metalness={0.8} />
      </mesh>
      
      {/* Beveled Top Rim */}
      <mesh position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.22, 0.05, 16, 64]} />
        <meshStandardMaterial color="#b5a642" roughness={0.15} metalness={0.95} />
      </mesh>

      {/* Inner Wall */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[1.22, 1.22, 0.2, 64]} />
        <meshStandardMaterial color="#d4af37" roughness={0.4} metalness={0.7} side={THREE.BackSide} />
      </mesh>

      {/* Dial Face */}
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry args={[1.21, 1.21, 0.02, 64]} />
        <meshStandardMaterial color="#fdfbf7" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Degree Ticks */}
      <group position={[0, -0.02, 0]}>
        {ticks}
      </group>

      {/* Markings */}
      <group position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        {/* Major directions */}
        <Text position={[0, 0.85, 0]} fontSize={0.25} color="#111827">N</Text>
        <Text position={[0, -0.85, 0]} fontSize={0.25} color="#111827">S</Text>
        <Text position={[0.85, 0, 0]} fontSize={0.25} color="#111827">E</Text>
        <Text position={[-0.85, 0, 0]} fontSize={0.25} color="#111827">W</Text>
        
        {/* Minor directions */}
        <Text position={[0.6, 0.6, 0]} fontSize={0.12} color="#4b5563">NE</Text>
        <Text position={[-0.6, 0.6, 0]} fontSize={0.12} color="#4b5563">NW</Text>
        <Text position={[0.6, -0.6, 0]} fontSize={0.12} color="#4b5563">SE</Text>
        <Text position={[-0.6, -0.6, 0]} fontSize={0.12} color="#4b5563">SW</Text>
      </group>

      {/* Central Pivot */}
      <mesh position={[0, 0.02, 0]}>
        <coneGeometry args={[0.04, 0.15, 16]} />
        <meshStandardMaterial color="#d4af37" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Compass Needle Group */}
      <group ref={needleRef} position={[0, 0.12, 0]}>
        {/* Pivot Cap */}
        <mesh position={[0, 0.02, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#9ca3af" roughness={0.3} metalness={0.8} />
        </mesh>
        
        {/* North (Red) Needle */}
        <mesh position={[0, 0, -0.45]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.12, 0.9, 32]} />
          <meshStandardMaterial color="#dc2626" roughness={0.2} metalness={0.4} />
        </mesh>
        
        {/* South (Black) Needle */}
        <mesh position={[0, 0, 0.45]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.12, 0.9, 32]} />
          <meshStandardMaterial color="#111827" roughness={0.2} metalness={0.5} />
        </mesh>
      </group>

      {/* Glass Cover */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[1.21, 1.21, 0.02, 64]} />
        <meshStandardMaterial color="#ffffff" opacity={0.15} transparent roughness={0} metalness={1} />
      </mesh>
      
      {/* Top Glass Rim Retainer */}
      <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.02, 16, 64]} />
        <meshStandardMaterial color="#b5a642" roughness={0.2} metalness={0.9} />
      </mesh>
      </group>
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

// --- Battery 3D Model ---
const BatteryModel = () => (
  <group rotation={[0, 0, -Math.PI / 2]} scale={[1.1, 1.1, 1.1]}>
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
    
    {/* Labels (rotated by +90deg around Z so they are upright in world space) */}
    <Text position={[0, 0.5, 0.44]} rotation={[0, 0, Math.PI / 2]} fontSize={0.25} color="#111827">+</Text>
    <Text position={[0, -0.5, 0.44]} rotation={[0, 0, Math.PI / 2]} fontSize={0.3} color="#111827">-</Text>
    <Text position={[0, 0, 0.44]} rotation={[0, 0, Math.PI / 2]} fontSize={0.12} color="#fef08a" letterSpacing={0.1}>CELL 1.5V</Text>
  </group>
);

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

const WiresModel = () => {
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
    <group rotation={[0.1, 0.2, 0]}>
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
};

const FlowingElectrons = ({ curve, speed = 0.3, direction = 1, color = "#3b82f6", radius = 0.08 }) => {
  // Lower density so they look like individual particles rather than a dotted line
  const count = Math.max(2, Math.floor(curve.getLength() * 1.5));
  const particles = React.useRef([]);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    particles.current.forEach((particle, i) => {
      if (!particle) return;
      let t = ((time * speed) + (i / count)) % 1;
      if (direction < 0) t = 1 - t;
      const pos = curve.getPointAt(t);
      particle.position.copy(pos);
    });
  });

  return (
    <group>
      {Array.from({ length: count }).map((_, i) => (
        <group key={i} ref={el => particles.current[i] = el}>
          {/* Electron Sphere */}
          <mesh>
            <sphereGeometry args={[radius, 16, 16]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} emissive={color} emissiveIntensity={0.2} />
          </mesh>
          {/* e- Label */}
          <Billboard follow={true}>
            <Text position={[0, 0, radius + 0.01]} fontSize={0.12} color="#ffffff" fontWeight="bold">
              e⁻
            </Text>
          </Billboard>
        </group>
      ))}
    </group>
  );
};

const SafetyPinFlow = () => {
  const curve = React.useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(3.0, 0.12, 0.2),
      new THREE.Vector3(3.0, 0.12, 1.8)
    ]);
  }, []);
  
  return <FlowingElectrons curve={curve} />;
};

const MagneticFieldLine = ({ radius = 0.5, speed = 1, color = "#10b981", direction = -1 }) => {
  const groupRef = React.useRef();
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += speed * delta * direction;
    }
  });

  const arrows = [0, 1, 2, 3].map(i => {
    const angle = (i * Math.PI) / 2;
    return (
      <group key={i} rotation={[angle, 0, 0]}>
         <group position={[0, 0, radius]}>
            <mesh rotation={[direction > 0 ? Math.PI : 0, 0, 0]}>
              <coneGeometry args={[0.12, 0.36, 8]} />
              <meshBasicMaterial color={color} />
            </mesh>
         </group>
      </group>
    );
  });

  return (
    <group>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[radius, 0.025, 16, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
      <group ref={groupRef}>
        {arrows}
      </group>
    </group>
  );
};



const CurvedWire = ({ p1, p2, controlPoints, radius, color, animateFlow = true }) => {
  const curve = React.useMemo(() => {
    const points = [
      new THREE.Vector3(...p1),
      ...(controlPoints || []).map(p => new THREE.Vector3(...p)),
      new THREE.Vector3(...p2)
    ];
    return new THREE.CatmullRomCurve3(points);
  }, [p1, p2, controlPoints]);

  return (
    <group>
      <mesh castShadow>
        <tubeGeometry args={[curve, 32, radius, 8, false]} />
        <meshStandardMaterial 
          color={color} 
          roughness={color === '#ca8a04' ? 0.15 : 0.3} 
          metalness={color === '#ca8a04' ? 0.95 : 0.1} 
        />
      </mesh>
      {animateFlow && <FlowingElectrons curve={curve} radius={radius + 0.015} />}
    </group>
  );
};

// --- Full Circuit 3D Model ---
const FullCircuitModel = ({ compassPosition = "below", onToggleCompassPosition }) => {
  return (
    <group position={[0, -0.2, 0]}>
      {/* Battery */}
      <group position={[-3.0, 0.4, 2.0]} rotation={[0, 0, 0]}>
        <BatteryModel />
      </group>

      {/* Switch Board */}
      <group position={[3.0, 0, 1.0]} rotation={[0, Math.PI / 2, 0]}>
        <SwitchBoardModel />
        {/* Top Pin (Pin 1) */}
        <group position={[0.8, 0.12, 0]}>
          <DrawingPinModel />
          <group position={[0, 0.05, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <group position={[0, 0, 1.08]}>
              <SafetyPinModel />
            </group>
          </group>
        </group>
        {/* Bottom Pin (Pin 2) */}
        <group position={[-0.8, 0.12, 0]}>
          <DrawingPinModel />
        </group>
      </group>

      {/* Compass Bench */}
      <group position={[-1.0, 0, -1.5]}>
        <CompassBoardModel />
        <CompassModel compassPosition={compassPosition} onToggleCompassPosition={onToggleCompassPosition} />
      </group>

      {/* Wires */}
      <group>
        {/* Black wire (Battery - to Compass Left Nail) */}
        <CurvedWire 
          p1={[-3.77, 0.4, 2.0]} 
          p2={[-2.6, 0.7, -1.5]} 
          controlPoints={[[-4.0, 0.35, 0.5], [-3.0, 0.5, -1.0]]} 
          radius={0.045} color="#374151" 
        />
        
        {/* Red wire (Compass Right Nail to Switch Top Pin) */}
        <CurvedWire 
          p1={[0.6, 0.7, -1.5]} 
          p2={[3.0, 0.12, 0.2]} 
          controlPoints={[[1.5, 0.5, -1.0], [2.2, 0.2, -0.5]]} 
          radius={0.045} color="#ef4444" 
        />

        {/* Yellow wire (Switch Bottom Pin to Battery +) */}
        <CurvedWire 
          p1={[3.0, 0.12, 1.8]} 
          p2={[-2.23, 0.4, 2.0]} 
          controlPoints={[[2.0, 0.2, 2.5], [0, 0.2, 3.0]]} 
          radius={0.045} color="#ca8a04" 
        />

        {/* Copper wire (Straight over compass, Nail 1 to Nail 2) */}
        <CurvedWire p1={[-2.6, 0.7, -1.5]} p2={[0.6, 0.7, -1.5]} radius={0.025} color="#ca8a04" />

        {/* Safety Pin connection flow */}
        <SafetyPinFlow />

        {/* Magnetic Field around copper wire */}
        <group position={[-1.0, 0.7, -1.5]}>
          <MagneticFieldLine radius={0.6} speed={1.5} color="#10b981" />
          <MagneticFieldLine radius={1.2} speed={1.1} color="#10b981" />
          <MagneticFieldLine radius={1.8} speed={0.8} color="#10b981" />
        </group>
      </group>
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

export default function ThreeDViewer({ componentId, compassPosition, onToggleCompassPosition }) {
  const renderModel = () => {
    switch (componentId) {
      case 'switchBoard': return <SwitchBoardModel />;
      case 'compassBoard': return <CompassBoardModel />;
      case 'pin1':
      case 'pin2': return <DrawingPinModel />;
      case 'safetyPin': return <SafetyPinModel />;
      case 'battery': return <BatteryModel />;
      case 'compass': return <CompassModel />;
      case 'wires': return <WiresModel />;
      case 'fullCircuit': return <FullCircuitModel compassPosition={compassPosition} onToggleCompassPosition={onToggleCompassPosition} />;
      default: return null;
    }
  };

  const isFullCircuit = componentId === 'fullCircuit';
  const initialCameraPos = isFullCircuit ? [0, 6, 8.5] : [0, 1.8, 2.5];
  const maxDist = isFullCircuit ? 15 : 4.5;

  return (
    <div style={{ width: '100%', height: '100%', outline: 'none', background: 'var(--canvas-bg)' }}>
      <ErrorBoundary>
        <Canvas shadows camera={{ position: initialCameraPos, fov: 45 }} gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true }}>
          <ambientLight intensity={1.1} />
          <pointLight position={[10, 10, 10]} intensity={1.8} castShadow />
          <pointLight position={[-10, 5, -10]} intensity={0.6} />
          <directionalLight position={[0, 5, 2]} intensity={1.2} />
          <Center>{renderModel()}</Center>
          <OrbitControls enableDamping={true} dampingFactor={0.06} minDistance={1.5} maxDistance={maxDist} makeDefault />
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}
