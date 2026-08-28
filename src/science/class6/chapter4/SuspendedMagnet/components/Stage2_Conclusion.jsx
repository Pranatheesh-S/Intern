import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, ContactShadows, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import { RotateCw, Compass, Sparkles, ArrowRight, Maximize2, Minimize2, Sun, Plus, Minus, RotateCcw } from 'lucide-react';
import * as THREE from 'three';

// -------------------------------------------------------------------
// 1. 3D Precision Marine Compass Scene Components
// -------------------------------------------------------------------

// 3D Vintage Antique Brass Pocket Compass Casing & Dial
function BrassCompass3D({ needleAngle, isSpinning }) {
  const needleGroupRef = useRef();
  const currentAngleRef = useRef(0);

  useFrame((state, delta) => {
    if (!needleGroupRef.current) return;
    const dt = Math.min(delta, 0.1);
    currentAngleRef.current = THREE.MathUtils.lerp(
      currentAngleRef.current,
      (needleAngle * Math.PI) / 180,
      dt * 7
    );
    needleGroupRef.current.rotation.y = -currentAngleRef.current;
  });

  return (
    <group position={[0, -0.2, 0]}>
      {/* 1. Heavy Polished Wood / Brass Navigator Table Base */}
      <mesh position={[0, -1.8, 0]} receiveShadow>
        <cylinderGeometry args={[7.2, 7.5, 0.4, 48]} />
        <meshStandardMaterial color="#5C2D12" roughness={0.7} metalness={0.08} />
      </mesh>

      {/* 2. Heavy Antique Brass Outer Compass Casing */}
      <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[5.2, 5.4, 1.8, 48]} />
        <meshStandardMaterial color="#D97706" roughness={0.3} metalness={0.88} />
      </mesh>

      {/* Stepped Upper Bezel with Knurled Texture */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[5.4, 5.2, 0.35, 48]} />
        <meshStandardMaterial color="#F59E0B" roughness={0.25} metalness={0.9} />
      </mesh>

      {/* Top Lanyard Brass Hanging Loop */}
      <mesh position={[0, 0.35, -5.7]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.9, 0.18, 16, 32]} />
        <meshStandardMaterial color="#D97706" roughness={0.3} metalness={0.88} />
      </mesh>

      {/* 3. Aged Parchment / Porcelain Dial Face */}
      <mesh position={[0, 0.32, 0]} receiveShadow>
        <cylinderGeometry args={[4.6, 4.6, 0.1, 48]} />
        <meshStandardMaterial color="#FDF8EC" roughness={0.85} metalness={0.02} />
      </mesh>

      {/* Concentric Calibration Rings */}
      <mesh position={[0, 0.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.2, 4.25, 64]} />
        <meshBasicMaterial color="#78350F" opacity={0.7} transparent />
      </mesh>
      <mesh position={[0, 0.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.2, 3.24, 64]} />
        <meshBasicMaterial color="#B45309" opacity={0.5} transparent />
      </mesh>
      <mesh position={[0, 0.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.54, 64]} />
        <meshBasicMaterial color="#D97706" opacity={0.4} transparent />
      </mesh>

      {/* 4. Cardinal & Degree Markings on Dial */}
      {/* North Indicator (Red Arrow Crown + N) */}
      <group position={[0, 0.39, -3.4]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.38, 0.7, 3]} />
          <meshStandardMaterial color="#DC2626" roughness={0.3} />
        </mesh>
        <Text
          position={[0, 0.02, -0.6]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.75}
          color="#DC2626"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          N
        </Text>
      </group>

      {/* South Indicator (Blue Arrow + S) */}
      <group position={[0, 0.39, 3.4]}>
        <mesh rotation={[-Math.PI / 2, 0, Math.PI]}>
          <coneGeometry args={[0.38, 0.7, 3]} />
          <meshStandardMaterial color="#2563EB" roughness={0.3} />
        </mesh>
        <Text
          position={[0, 0.02, 0.6]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.75}
          color="#2563EB"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          S
        </Text>
      </group>

      {/* East Indicator (Amber Arrow + E) */}
      <group position={[3.4, 0.39, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.32, 0.6, 3]} />
          <meshStandardMaterial color="#92400E" roughness={0.3} />
        </mesh>
        <Text
          position={[0.55, 0.02, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.68}
          color="#92400E"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          E
        </Text>
      </group>

      {/* West Indicator (Amber Arrow + W) */}
      <group position={[-3.4, 0.39, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <coneGeometry args={[0.32, 0.6, 3]} />
          <meshStandardMaterial color="#92400E" roughness={0.3} />
        </mesh>
        <Text
          position={[-0.55, 0.02, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.68}
          color="#92400E"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          W
        </Text>
      </group>

      {/* 5. 3D Magnetic Needle Floating on Jeweled Pivot */}
      <group ref={needleGroupRef} position={[0, 0.55, 0]}>
        {/* North Pointer Half (Carmine Red Diamond) */}
        <mesh position={[0, 0, -1.8]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
          <coneGeometry args={[0.35, 3.4, 4]} />
          <meshStandardMaterial
            color="#DC2626"
            roughness={0.35}
            metalness={0.25}
            emissive="#7F1D1D"
            emissiveIntensity={0.25}
          />
        </mesh>

        {/* North Needle Phosphorescent Tip Pip */}
        <mesh position={[0, 0.05, -3.3]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color="#FDE047" emissive="#FACC15" emissiveIntensity={0.8} />
        </mesh>

        {/* South Pointer Half (Cobalt Blue Diamond) */}
        <mesh position={[0, 0, 1.8]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <coneGeometry args={[0.35, 3.4, 4]} />
          <meshStandardMaterial
            color="#1D4ED8"
            roughness={0.35}
            metalness={0.25}
            emissive="#1E3A8A"
            emissiveIntensity={0.25}
          />
        </mesh>

        {/* Central Brass Cap & Ruby Pivot Jewel */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.48, 0.48, 0.28, 24]} />
          <meshStandardMaterial color="#F59E0B" roughness={0.2} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.26, 0]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#E11D48" roughness={0.15} metalness={0.6} />
        </mesh>
      </group>

      {/* 6. Convex Glass Crystal Cover Dome */}
      <mesh position={[0, 0.65, 0]}>
        <sphereGeometry args={[4.8, 32, 16, 0, Math.PI * 2, 0, 0.45]} />
        <meshPhysicalMaterial
          color="#FFFFFF"
          transparent
          opacity={0.22}
          roughness={0.05}
          transmission={0.9}
          thickness={0.5}
        />
      </mesh>
    </group>
  );
}

// Interactive 3D Bar Magnet Nearby to Test Needle Deflection
function NearbyInfluencingMagnet({ position }) {
  return (
    <group position={position}>
      {/* North Pole Half */}
      <mesh position={[0, 0, -1.2]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.8, 2.4]} />
        <meshStandardMaterial color="#DC2626" roughness={0.4} metalness={0.2} />
      </mesh>
      <Text
        position={[0, 0.42, -1.2]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.45}
        color="#FFFFFF"
        fontWeight="bold"
      >
        N
      </Text>

      {/* South Pole Half */}
      <mesh position={[0, 0, 1.2]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.8, 2.4]} />
        <meshStandardMaterial color="#1D4ED8" roughness={0.4} metalness={0.2} />
      </mesh>
      <Text
        position={[0, 0.42, 1.2]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.45}
        color="#FFFFFF"
        fontWeight="bold"
      >
        S
      </Text>

      {/* Center Brass Collar */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.94, 0.84, 0.4]} />
        <meshStandardMaterial color="#F59E0B" roughness={0.25} metalness={0.88} />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------------
// 2. 3D Sun & Shadow Horizon Simulation (Ancient Direction Finding)
// -------------------------------------------------------------------
function SunShadowHorizon3D({ timeOfDay }) {
  const sunAngle = (timeOfDay - 0.5) * Math.PI; 
  const sunElevation = Math.sin((timeOfDay * Math.PI)); 

  const sunX = -Math.sin(sunAngle) * 14;
  const sunY = Math.max(1.2, sunElevation * 12);
  const sunZ = -Math.cos(sunAngle) * 3; 

  return (
    <group position={[0, 0, 0]}>
      <ambientLight intensity={0.45 + sunElevation * 0.4} />
      <directionalLight
        position={[sunX, sunY, sunZ]}
        intensity={1.8 + sunElevation * 0.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />

      <group position={[sunX, sunY, sunZ]}>
        <mesh>
          <sphereGeometry args={[1.4, 24, 24]} />
          <meshBasicMaterial color="#FDE047" />
        </mesh>
        <mesh>
          <sphereGeometry args={[2.2, 24, 24]} />
          <meshBasicMaterial color="#F59E0B" transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>

      <mesh receiveShadow position={[0, -2.0, 0]}>
        <boxGeometry args={[22, 0.4, 16]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.9} />
      </mesh>

      <mesh position={[0, -1.78, 0]}>
        <boxGeometry args={[16, 0.02, 0.12]} />
        <meshBasicMaterial color="#D97706" />
      </mesh>
      <mesh position={[0, -1.78, 0]}>
        <boxGeometry args={[0.12, 0.02, 12]} />
        <meshBasicMaterial color="#059669" />
      </mesh>

      <Text position={[7.5, -1.75, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.7} color="#D97706" fontWeight="bold">
        EAST ☀️ (Sunrise)
      </Text>
      <Text position={[-7.5, -1.75, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.7} color="#D97706" fontWeight="bold">
        WEST 🌅 (Sunset)
      </Text>
      <Text position={[0, -1.75, -5.5]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.75} color="#DC2626" fontWeight="bold">
        NORTH (N)
      </Text>
      <Text position={[0, -1.75, 5.5]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.75} color="#2563EB" fontWeight="bold">
        SOUTH (S)
      </Text>

      <group position={[0, -1.8, 0]}>
        <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.2, 1.4, 0.1, 32]} />
          <meshStandardMaterial color="#6B7280" roughness={0.7} />
        </mesh>

        <mesh position={[0, 2.2, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.18, 4.4, 16]} />
          <meshStandardMaterial color="#0F172A" roughness={0.4} metalness={0.6} />
        </mesh>

        <mesh position={[0, 4.4, 0]} castShadow>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#F59E0B" roughness={0.2} metalness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

// -------------------------------------------------------------------
// 3. Main Stage 2 Component
// -------------------------------------------------------------------
export default function Stage2_Conclusion({ onComplete }) {
  const [activeMode, setActiveMode] = useState('compass'); 
  const [needleAngle, setNeedleAngle] = useState(0); 
  const [isSpinning, setIsSpinning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1.0);
  const [hasMagnetNearby, setHasMagnetNearby] = useState(false);
  const [magnetPos] = useState([6.5, 0.2, 0]);
  const [timeOfDay, setTimeOfDay] = useState(0.5); 

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  };

  const handleZoomIn = () => setZoomScale((z) => Math.min(1.8, +(z + 0.15).toFixed(2)));
  const handleZoomOut = () => setZoomScale((z) => Math.max(0.5, +(z - 0.15).toFixed(2)));
  const handleResetZoom = () => setZoomScale(1.0);

  const handleDeflect = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const randomImpulse = (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 360);
    setNeedleAngle(randomImpulse);

    setTimeout(() => {
      setNeedleAngle(hasMagnetNearby ? 58 : 0); 
      setIsSpinning(false);
    }, 2200);
  };

  const handleToggleMagnet = () => {
    const nextState = !hasMagnetNearby;
    setHasMagnetNearby(nextState);
    setNeedleAngle(nextState ? 64 : 0);
  };

  return (
    <div style={{ padding: '0.5rem', display: 'flex', gap: '1.25rem', height: '100%', minHeight: 0, overflow: 'hidden', boxSizing: 'border-box', position: 'relative', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ flex: '1.8', display: 'flex', flexDirection: 'column', minWidth: 0, height: '100%', boxSizing: 'border-box' }}>
        <div style={{ position: 'relative', width: '100%', flex: 1, minHeight: '380px', borderRadius: '24px', border: '1.5px solid #A7F3D0', overflow: 'hidden', boxShadow: '0 12px 30px rgba(6, 78, 59, 0.12)', backgroundImage: `url('/SuspendedMagnet/wooden_stand_lab_bg.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div style={{ position: 'absolute', top: '14px', left: '16px', zIndex: 30, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={() => setActiveMode('compass')} style={{ background: activeMode === 'compass' ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : 'rgba(15, 23, 42, 0.78)', border: activeMode === 'compass' ? '1.5px solid #FDE68A' : '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '16px', padding: '7px 14px', fontSize: '0.82rem', fontWeight: 900, color: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(8px)', transition: 'all 0.2s ease' }}><Compass size={16} /> 3D Magnetic Compass</button>
            <button onClick={() => setActiveMode('sun')} style={{ background: activeMode === 'sun' ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : 'rgba(15, 23, 42, 0.78)', border: activeMode === 'sun' ? '1.5px solid #FDE68A' : '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '16px', padding: '7px 14px', fontSize: '0.82rem', fontWeight: 900, color: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(8px)', transition: 'all 0.2s ease' }}><Sun size={16} /> 3D Sun & Shadow Finder</button>
          </div>
          <div style={{ position: 'absolute', top: '14px', right: '16px', zIndex: 30, display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(15, 23, 42, 0.78)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '16px', padding: '4px 8px', backdropFilter: 'blur(12px)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.22)' }}>
            <button onClick={handleZoomOut} style={{ background: 'rgba(255, 255, 255, 0.12)', border: 'none', borderRadius: '10px', width: '32px', height: '32px', color: '#FFFFFF', cursor: 'pointer' }}><Minus size={16} /></button>
            <button onClick={handleResetZoom} style={{ background: 'transparent', border: 'none', color: '#F8FAFC', fontSize: '0.82rem', fontWeight: 800, padding: '0 6px', minWidth: '52px', cursor: 'pointer' }}>{Math.round(zoomScale * 100)}%</button>
            <button onClick={handleZoomIn} style={{ background: 'rgba(255, 255, 255, 0.12)', border: 'none', borderRadius: '10px', width: '32px', height: '32px', color: '#FFFFFF', cursor: 'pointer' }}><Plus size={16} /></button>
            <button onClick={handleResetZoom} style={{ background: 'rgba(255, 255, 255, 0.12)', border: 'none', borderRadius: '10px', width: '32px', height: '32px', color: '#FFFFFF', cursor: 'pointer' }}><RotateCcw size={14} /></button>
            <div style={{ width: '1px', height: '18px', background: 'rgba(255, 255, 255, 0.22)', margin: '0 2px' }} />
            <button onClick={toggleFullscreen} style={{ background: 'rgba(255, 255, 255, 0.12)', border: 'none', borderRadius: '10px', padding: '6px 10px', color: '#FFFFFF', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}>{isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}</button>
          </div>
          <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', zIndex: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none' }}>
            {activeMode === 'compass' ? (
              <div style={{ display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
                <button onClick={handleDeflect} disabled={isSpinning} style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255, 255, 255, 0.25)', borderRadius: '12px', padding: '8px 14px', color: '#FFFFFF', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(8px)' }}><RotateCw size={14} className={isSpinning ? 'spin-anim' : ''} /> <span>Deflect</span></button>
                <button onClick={handleToggleMagnet} style={{ background: hasMagnetNearby ? 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)' : 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255, 255, 255, 0.25)', borderRadius: '12px', padding: '8px 14px', color: '#FFFFFF', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(8px)' }}><span>🧲 {hasMagnetNearby ? 'Remove Magnet' : 'Bring Magnet'}</span></button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(15, 23, 42, 0.88)', border: '1px solid rgba(255, 255, 255, 0.25)', borderRadius: '16px', padding: '8px 16px', backdropFilter: 'blur(10px)', pointerEvents: 'auto' }}>
                <span style={{ color: '#FDE047', fontSize: '0.82rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '4px' }}><Sun size={15} /> Time:</span>
                <input type="range" min="0.05" max="0.95" step="0.01" value={timeOfDay} onChange={(e) => setTimeOfDay(parseFloat(e.target.value))} style={{ width: '140px', accentColor: '#F59E0B', cursor: 'pointer' }} />
                <span style={{ color: '#FFFFFF', fontSize: '0.8rem', fontWeight: 800, minWidth: '95px' }}>{timeOfDay < 0.35 ? '🌅 Sunrise' : timeOfDay > 0.65 ? '🌇 Sunset' : '☀️ Solar Noon'}</span>
              </div>
            )}
          </div>
          <Canvas shadows gl={{ alpha: true, antialias: true }} camera={{ position: [0, 8.5, 14], fov: 45 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.9} />
              <directionalLight position={[10, 20, 10]} intensity={1.8} castShadow shadow-mapSize={[2048, 2048]} />
              <group scale={[zoomScale * 0.95, zoomScale * 0.95, zoomScale * 0.95]}>
                {activeMode === 'compass' ? (
                  <>
                    <BrassCompass3D needleAngle={needleAngle} isSpinning={isSpinning} />
                    {hasMagnetNearby && <NearbyInfluencingMagnet position={magnetPos} />}
                    <ContactShadows position={[0, -2.0, 0]} opacity={0.65} scale={18} blur={2.4} far={8} />
                  </>
                ) : (
                  <SunShadowHorizon3D timeOfDay={timeOfDay} />
                )}
              </group>
              <OrbitControls makeDefault enablePan={false} maxPolarAngle={Math.PI / 2.1} minPolarAngle={0.15} minDistance={6} maxDistance={35} />
            </Suspense>
          </Canvas>
        </div>
      </div>
      <div style={{ flex: '1.15', background: '#FFFDD0', border: '1.5px solid #EFE4B0', borderRadius: '24px', padding: '1.6rem 1.6rem', boxShadow: '0 4px 20px rgba(180, 160, 100, 0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.2rem', minWidth: 0, height: '100%', boxSizing: 'border-box', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: '#D1FAE5', padding: '0.4rem 0.9rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 800, color: '#065F46', alignSelf: 'flex-start' }}><Sparkles size={16} color="#059669" /> EXPERIMENT CONCLUSION</div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#064E3B', margin: 0, lineHeight: 1.25, letterSpacing: '-0.02em' }}>How a Compass Works</h2>
          <p style={{ fontSize: '1.05rem', color: '#334155', lineHeight: 1.65, fontWeight: 600, margin: 0 }}>A freely suspended bar magnet or compass needle always comes to rest pointing in the <strong style={{ color: '#D97706' }}>North-South direction</strong>. This fundamental property has guided navigators, explorers, and travelers across the globe for centuries!</p>
          
          <div style={{ background: '#FFFBEB', border: '2px solid #FDE68A', borderRadius: '20px', padding: '1.15rem 1.35rem', display: 'flex', alignItems: 'flex-start', gap: '0.85rem', boxShadow: '0 4px 14px rgba(217, 119, 6, 0.08)' }}>
            <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>☀️</span>
            <p style={{ margin: 0, fontSize: '0.98rem', color: '#92400E', lineHeight: 1.6, fontWeight: 600 }}>Using the Sun's sunrise (East) and sunset (West) positions provides an astronomical East-West reference line, verifying that the magnetic needle points precisely along the North-South axis.</p>
          </div>

          <div style={{ background: '#F0FDF4', border: '2px solid #A7F3D0', borderRadius: '20px', padding: '1.25rem 1.35rem', boxShadow: '0 4px 14px rgba(6, 78, 59, 0.05)' }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#047857', letterSpacing: '0.5px', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Compass size={18} color="#047857" /> COMPASS CONTROLS
            </div>
            <p style={{ fontSize: '0.98rem', color: '#1E293B', fontWeight: 600, margin: '0 0 0.9rem 0', lineHeight: 1.5 }}>
              Tap below to deflect the needle or bring a secondary magnet close:
            </p>
            <button
              onClick={handleDeflect}
              disabled={isSpinning}
              style={{
                width: '100%',
                padding: '1.05rem 1.2rem',
                fontSize: '1.08rem',
                fontWeight: 900,
                borderRadius: '16px',
                background: isSpinning ? '#CBD5E1' : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                color: '#FFFFFF',
                border: 'none',
                cursor: isSpinning ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                boxShadow: isSpinning ? 'none' : '0 4px 16px rgba(217, 119, 6, 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              <RotateCw size={20} className={isSpinning ? 'spin-anim' : ''} /> {isSpinning ? 'Deflecting Needle...' : 'Deflect Compass Needle'}
            </button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '2px solid #F1F5F9',
          paddingTop: '1rem'
        }}>
          <span style={{ fontSize: '0.95rem', color: '#047857', fontWeight: 800 }}>
            Stage 2 of 2 ● ●
          </span>

          <button
            onClick={onComplete}
            style={{
              padding: '0.95rem 2.2rem',
              fontSize: '1.05rem',
              fontWeight: 900,
              borderRadius: '25px',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              boxShadow: '0 4px 16px rgba(217, 119, 6, 0.4)',
              transition: 'all 0.2s ease'
            }}
          >
            Proceed to Quiz <ArrowRight size={20} color="#FFFFFF" />
          </button>
        </div>
      </div>
    </div>
  );
}
