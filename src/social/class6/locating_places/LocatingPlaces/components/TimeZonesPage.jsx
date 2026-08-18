import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle2, Maximize2, X, BookOpen } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, useTexture, Line, Html, Cone, Cylinder, Box } from '@react-three/drei';
import * as THREE from 'three';
import './CoordinatesPageBook.css';
import worldMapUrl from './world-map.jpg';

const Airplane = () => {
  return (
    <group scale={0.06}>
      <Cylinder args={[0.2, 0.2, 2, 16]} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#ffffff" />
      </Cylinder>
      <Cone args={[0.2, 0.5, 16]} position={[0, 0, 1.25]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#38bdf8" />
      </Cone>
      <Box args={[3, 0.05, 0.5]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#38bdf8" />
      </Box>
      <Box args={[1, 0.05, 0.3]} position={[0, 0, -0.8]}>
        <meshStandardMaterial color="#38bdf8" />
      </Box>
      <Box args={[0.05, 0.6, 0.4]} position={[0, 0.3, -0.8]} rotation={[-0.2, 0, 0]}>
        <meshStandardMaterial color="#38bdf8" />
      </Box>
    </group>
  );
};

const SunDialGlobe = ({ hour, autoRotate }) => {
  const colorMap = useTexture(worldMapUrl);
  const groupRef = useRef();
  const autoRotRef = useRef(-(hour - 12) * 15 * (Math.PI / 180));
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      if (autoRotate) {
        autoRotRef.current -= delta * 0.2;
        groupRef.current.rotation.y = autoRotRef.current;
      } else {
        const targetRot = -(hour - 12) * 15 * (Math.PI / 180);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRot, 0.1);
        autoRotRef.current = groupRef.current.rotation.y;
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.02} />
      <directionalLight position={[10, 0, 0]} intensity={3.5} color="#FDB813" />
      
      <group position={[4.5, 0, 0]}>
        {/* Core */}
        <mesh>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Inner Glow */}
        <mesh>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshBasicMaterial color="#fef08a" transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        {/* Mid Glow */}
        <mesh>
          <sphereGeometry args={[0.9, 32, 32]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        {/* Outer Corona */}
        <mesh>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshBasicMaterial color="#ea580c" transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>

      <group ref={groupRef}>
        <Sphere args={[2.2, 64, 64]}>
          <meshStandardMaterial map={colorMap} roughness={0.8} />
        </Sphere>
        <Line 
           points={Array.from({length: 31}).map((_,i) => {
              const lat = 90 - (i * 6);
              const p = (90 - lat) * (Math.PI / 180);
              const t = 90 * (Math.PI / 180);
              return [2.21 * Math.sin(p) * Math.sin(t), 2.21 * Math.cos(p), 2.21 * Math.sin(p) * Math.cos(t)];
           })} 
           color="#ef4444" 
           lineWidth={3} 
        />
      </group>
    </>
  );
};

const WorldClockGlobe = ({ highlight }) => {
  const colorMap = useTexture(worldMapUrl);
  const groupRef = useRef();
  
  useFrame(() => {
    if (groupRef.current) {
      let targetRot = -90 * (Math.PI / 180); // Default global view (Africa front)
      if (highlight === 'usa') targetRot = 0; // USA is at front naturally
      if (highlight === 'russia') targetRot = 180 * (Math.PI / 180); // Russia is at back naturally
      
      let diff = targetRot - groupRef.current.rotation.y;
      while(diff < -Math.PI) diff += 2*Math.PI;
      while(diff > Math.PI) diff -= 2*Math.PI;
      groupRef.current.rotation.y += diff * 0.05;
    }
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 3, 5]} intensity={1} />
      <group ref={groupRef}>
        <Sphere args={[2.2, 64, 64]}>
          <meshStandardMaterial map={colorMap} />
        </Sphere>
        {Array.from({length: 24}).map((_, i) => {
          let lon = i * 15;
          if (lon > 180) lon -= 360;

          const fullPoints = [];
          for (let lat = 90; lat >= -90; lat -= 5) {
            const p = (90 - lat) * (Math.PI / 180);
            const t = (lon + 90) * (Math.PI / 180);
            fullPoints.push([2.21 * Math.sin(p) * Math.sin(t), 2.21 * Math.cos(p), 2.21 * Math.sin(p) * Math.cos(t)]);
          }

          let highlightPoints = null;
          let color = "rgba(255,255,255,0.3)";
          let width = 1;
          let label = null;
          let labelLat = 0;
          
          if (lon === 0) {
            highlightPoints = fullPoints;
            color = "#ef4444";
            width = 3;
          }
          
          if (highlight === 'usa' && [-75, -90, -105, -120, -135, -150].includes(lon)) {
            color = "#38bdf8";
            width = 4;
            label = `UTC${lon/15}`;
            labelLat = 18;
            highlightPoints = [];
            for (let lat = 72; lat >= 20; lat -= 2) {
              const p = (90 - lat) * (Math.PI / 180);
              const t = (lon + 90) * (Math.PI / 180);
              highlightPoints.push([2.212 * Math.sin(p) * Math.sin(t), 2.212 * Math.cos(p), 2.212 * Math.sin(p) * Math.cos(t)]);
            }
          }
          
          if (highlight === 'russia' && [30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180].includes(lon)) {
            color = "#22c55e";
            width = 4;
            label = `UTC+${lon/15}`;
            labelLat = 38;
            highlightPoints = [];
            for (let lat = 82; lat >= 40; lat -= 2) {
              const p = (90 - lat) * (Math.PI / 180);
              const t = (lon + 90) * (Math.PI / 180);
              highlightPoints.push([2.212 * Math.sin(p) * Math.sin(t), 2.212 * Math.cos(p), 2.212 * Math.sin(p) * Math.cos(t)]);
            }
          }

          let labelPos = [0,0,0];
          if (label) {
             const labelP = (90 - labelLat) * (Math.PI / 180);
             const labelT = (lon + 90) * (Math.PI / 180);
             labelPos = [2.22 * Math.sin(labelP) * Math.sin(labelT), 2.22 * Math.cos(labelP), 2.22 * Math.sin(labelP) * Math.cos(labelT)];
          }

          return (
            <group key={i}>
              <Line points={fullPoints} color="rgba(255,255,255,0.3)" lineWidth={1} transparent />
              {highlightPoints && (
                <Line points={highlightPoints} color={color} lineWidth={width} transparent />
              )}
              {label && (
                <Html position={labelPos} center zIndexRange={[100, 0]}>
                  <div style={{ background: color, color: '#0f172a', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', border: '1px solid #fff', whiteSpace: 'nowrap' }}>
                    {label}
                  </div>
                </Html>
              )}
            </group>
          );
        })}
      </group>
    </>
  );
};

const IDLGlobe = ({ progress, direction }) => {
  const colorMap = useTexture(worldMapUrl);
  const groupRef = useRef();
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = -90 * (Math.PI / 180); // Center on Pacific (lon=180 is at -X, rotate to +Z)
    }
  });

  const tokyo = { lat: 35, lon: 140, name: "Tokyo" };
  const sf = { lat: 38, lon: -122, name: "San Francisco" };

  const startCity = direction === 'east' ? tokyo : sf;
  const endCity = direction === 'east' ? sf : tokyo;
  
  const startLonContinuous = direction === 'east' ? 140 : 238;
  const endLonContinuous = direction === 'east' ? 238 : 140;
  
  const currentLonContinuous = startLonContinuous + (endLonContinuous - startLonContinuous) * progress;
  let currentLon = currentLonContinuous;
  if (currentLon > 180) currentLon -= 360;

  const currentLat = startCity.lat + (endCity.lat - startCity.lat) * progress;

  const getPoint = (lat, lon, r) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 90) * (Math.PI / 180);
    return new THREE.Vector3(
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.cos(theta)
    );
  };

  const pos = getPoint(currentLat, currentLon, 2.25);
  
  const nextProgress = Math.min(1, progress + 0.02);
  const nextLonContinuous = startLonContinuous + (endLonContinuous - startLonContinuous) * nextProgress;
  let nextLon = nextLonContinuous;
  if (nextLon > 180) nextLon -= 360;
  const nextLat = startCity.lat + (endCity.lat - startCity.lat) * nextProgress;
  
  const nextPos = getPoint(nextLat, nextLon, 2.25);

  const planeRef = useRef();

  useFrame(() => {
    if (planeRef.current && groupRef.current) {
      planeRef.current.position.copy(pos);
      
      const upWorld = pos.clone().normalize().applyQuaternion(groupRef.current.quaternion);
      planeRef.current.up.copy(upWorld);
      
      if (pos.distanceTo(nextPos) > 0.001) {
        const targetWorld = nextPos.clone();
        groupRef.current.localToWorld(targetWorld);
        planeRef.current.lookAt(targetWorld);
      }
    }
  });

  const tokyoPos = getPoint(tokyo.lat, tokyo.lon, 2.21);
  const sfPos = getPoint(sf.lat, sf.lon, 2.21);

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <group ref={groupRef}>
        <Sphere args={[2.2, 64, 64]}>
          <meshStandardMaterial map={colorMap} />
        </Sphere>
        <Line 
          points={Array.from({length: 31}).map((_,i) => {
            const latL = 90 - (i * 6);
            const p = (90 - latL) * (Math.PI / 180);
            const t = (180 + 90) * (Math.PI / 180);
            return [2.21 * Math.sin(p) * Math.sin(t), 2.21 * Math.cos(p), 2.21 * Math.sin(p) * Math.cos(t)];
          })} 
          color="#fbbf24" 
          lineWidth={4} 
        />
        <group ref={planeRef}>
          {/* Rotate plane so nose (+Z in Airplane) points correctly. If it flies backward, we will rotate it Math.PI */}
          <group rotation={[0, Math.PI, 0]}>
            <Airplane />
          </group>
        </group>

        {/* City Markers */}
        <group>
          <mesh position={tokyoPos}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          <Html position={tokyoPos} center zIndexRange={[100, 0]}>
            <div style={{ background: 'rgba(15, 23, 42, 0.8)', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', border: '1px solid #38bdf8', whiteSpace: 'nowrap', marginTop: '16px' }}>
              Tokyo
            </div>
          </Html>

          <mesh position={sfPos}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          <Html position={sfPos} center zIndexRange={[100, 0]}>
            <div style={{ background: 'rgba(15, 23, 42, 0.8)', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', border: '1px solid #38bdf8', whiteSpace: 'nowrap', marginTop: '16px' }}>
              San Francisco
            </div>
          </Html>
        </group>
      </group>
    </>
  );
};

const SunsetVisual = ({ time, useIST }) => {
  const shadowPct = Math.max(0, Math.min(100, ((time - 15) / 6) * 100));
  
  const formatTimeStr = (t) => {
    let hr = Math.floor(t);
    let mn = Math.round((t - hr) * 60);
    if (mn === 60) { mn = 0; hr++; }
    const ap = hr < 12 ? 'AM' : 'PM';
    let h = hr % 12;
    if (h === 0) h = 12;
    return `${h}:${mn.toString().padStart(2, '0')} ${ap}`;
  };

  const tinsukiaTime = useIST ? time : time + 1;
  const porbandarTime = useIST ? time : time - 1;

  const mapLonToX = (lon) => ((lon - 60) / 40) * 100;
  const mapLatToY = (lat) => 100 - ((lat - 5) / 35) * 100;

  const porbLon = 69.6;
  const porbLat = 21.6;
  const tinLon = 95.3;
  const tinLat = 27.5;

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#08213a', overflow: 'hidden', borderRadius: '12px' }}>
      <img src={worldMapUrl} alt="Map" style={{ position: 'absolute', width: '900%', height: '514.285%', left: '-600%', top: '-142.857%', opacity: 0.6 }} />
      <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: `${shadowPct}%`, background: 'rgba(0,0,0,0.6)', backdropFilter: 'brightness(0.5)', transition: 'width 0.2s linear' }} />
      
      <div style={{ position: 'absolute', left: `${mapLonToX(tinLon)}%`, top: `${mapLatToY(tinLat)}%`, transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
        <div style={{ width: '16px', height: '16px', background: '#ef4444', borderRadius: '50%', border: '3px solid #fff', boxShadow: '0 0 10px rgba(0,0,0,0.5)' }} />
        <div style={{ background: '#fff', padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', marginTop: '8px', color: '#0f172a', whiteSpace: 'nowrap' }}>Tinsukia (Assam)</div>
        <div style={{ background: '#0f172a', color: '#fff', padding: '4px 8px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', marginTop: '4px' }}>
          {formatTimeStr(tinsukiaTime)}
        </div>
      </div>

      <div style={{ position: 'absolute', left: `${mapLonToX(porbLon)}%`, top: `${mapLatToY(porbLat)}%`, transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
        <div style={{ width: '16px', height: '16px', background: '#eab308', borderRadius: '50%', border: '3px solid #fff', boxShadow: '0 0 10px rgba(0,0,0,0.5)' }} />
        <div style={{ background: '#fff', padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', marginTop: '8px', color: '#0f172a', whiteSpace: 'nowrap' }}>Porbandar (Gujarat)</div>
        <div style={{ background: '#0f172a', color: '#fff', padding: '4px 8px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', marginTop: '4px' }}>
          {formatTimeStr(porbandarTime)}
        </div>
      </div>
    </div>
  );
};

export default function TimeZonesPage({ onNextActivity, onBack }) {
  const [currentStep, setCurrentStep] = useState(0); 
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // States
  const [sunHour, setSunHour] = useState(12);
  const [sunsetTime, setSunsetTime] = useState(15);
  const [useIST, setUseIST] = useState(false);
  const [wcHighlight, setWcHighlight] = useState('none');
  
  const [idlDirection, setIdlDirection] = useState('east');
  const [idlProgress, setIdlProgress] = useState(0);
  const [idlQuestionVisible, setIdlQuestionVisible] = useState(false);
  const [idlFeedback, setIdlFeedback] = useState(null);

  const startFlight = (dir) => {
    setIdlDirection(dir);
    setIdlProgress(0);
    setIdlQuestionVisible(false);
    setIdlFeedback(null);
    let p = 0;
    const interval = setInterval(() => {
      p += 0.02;
      if (p >= 0.5) {
        clearInterval(interval);
        setIdlProgress(0.5);
        setIdlQuestionVisible(true);
      } else {
        setIdlProgress(p);
      }
    }, 50);
  };

  const handleIDLAnswer = (action) => {
    const isCorrect = (idlDirection === 'east' && action === 'subtract') || (idlDirection === 'west' && action === 'add');
    if (isCorrect) {
      setIdlQuestionVisible(false);
      setIdlFeedback({ type: 'success', title: 'Correct!', message: `Travelling ${idlDirection.toUpperCase()} means you ${action} a day!` });
      let p = 0.5;
      const interval = setInterval(() => {
        p += 0.02;
        if (p >= 1) {
          clearInterval(interval);
          setIdlProgress(1);
        } else {
          setIdlProgress(p);
        }
      }, 50);
    } else {
      setIdlFeedback({ type: 'error', title: 'Not quite!', message: `Remember: Cross East ➡ Subtract a day. Cross West ⬅ Add a day.` });
    }
  };

  const renderVisual = () => (
    <>
      {currentStep <= 1 && (
        <div style={{ position: 'absolute', inset: 0 }}>
          <Canvas camera={{ position: [0, 0, 9], fov: 45 }}>
            <SunDialGlobe hour={sunHour} autoRotate={currentStep === 0} />
            <OrbitControls enableZoom={true} enablePan={false} />
          </Canvas>
        </div>
      )}
      {currentStep >= 2 && currentStep <= 3 && (
        <div style={{ position: 'absolute', inset: 0 }}>
          <SunsetVisual time={sunsetTime} useIST={useIST} />
        </div>
      )}
      {currentStep >= 4 && currentStep <= 5 && (
        <div style={{ position: 'absolute', inset: 0 }}>
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
            <WorldClockGlobe highlight={wcHighlight} />
            <OrbitControls enableZoom={true} enablePan={false} />
          </Canvas>
        </div>
      )}
      {currentStep >= 6 && currentStep <= 7 && (
        <div style={{ position: 'absolute', inset: 0 }}>
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
            <IDLGlobe progress={idlProgress} direction={idlDirection} />
            <OrbitControls enableZoom={true} enablePan={false} />
          </Canvas>
        </div>
      )}
      {currentStep === 8 && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '120px' }}>🌍</div>
        </div>
      )}
    </>
  );

  const renderFullScreenControls = () => {
    switch (currentStep) {
      case 1:
        return (
          <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', width: '400px', zIndex: 10, color: '#fff' }}>
            <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '18px', color: '#f59e0b', marginBottom: '8px' }}>
              Hour of Day: {sunHour}:00
            </div>
            <div style={{ textAlign: 'center', fontSize: '14px', color: '#94a3b8', marginBottom: '16px' }}>
              Earth has rotated {sunHour * 15}°
            </div>
            <input type="range" style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer', height: '6px' }} min="1" max="24" value={sunHour} onChange={e => setSunHour(Number(e.target.value))} />
          </div>
        );
      case 3:
        return (
          <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', width: '400px', zIndex: 10, color: '#fff' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Scrub Time of Day</label>
            <input type="range" style={{ width: '100%', accentColor: '#ef4444', cursor: 'pointer', height: '6px', marginBottom: '24px' }} min="15" max="21" step="0.5" value={sunsetTime} onChange={e => setSunsetTime(Number(e.target.value))} />
            <button 
              onClick={() => setUseIST(!useIST)}
              style={{ width: '100%', background: useIST ? 'var(--green)' : 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', fontWeight: 'bold', transition: 'all 0.2s' }}
            >
              {useIST ? 'Using Indian Standard Time (IST)' : 'Using Local Solar Time'}
            </button>
          </div>
        );
      case 4:
      case 5:
        return (
          <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', width: '400px', zIndex: 10, display: 'flex', gap: '12px' }}>
             <button onClick={() => setWcHighlight('none')} style={{ flex: 1, background: wcHighlight === 'none' ? 'var(--blue)' : 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}>Global</button>
             <button onClick={() => setWcHighlight('usa')} style={{ flex: 1, background: wcHighlight === 'usa' ? 'var(--blue)' : 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}>USA (6)</button>
             <button onClick={() => setWcHighlight('russia')} style={{ flex: 1, background: wcHighlight === 'russia' ? 'var(--blue)' : 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}>Russia (11)</button>
          </div>
        );
      case 7:
        return (
          <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', width: '400px', zIndex: 10, display: 'flex', gap: '12px' }}>
            <button onClick={() => startFlight('east')} disabled={idlProgress > 0 && idlProgress < 1} style={{ flex: 1, background: 'var(--blue)', color: '#fff', border: 'none', padding: '16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', opacity: (idlProgress > 0 && idlProgress < 1) ? 0.5 : 1 }}>Fly East ➡</button>
            <button onClick={() => startFlight('west')} disabled={idlProgress > 0 && idlProgress < 1} style={{ flex: 1, background: 'var(--navy)', color: '#fff', border: 'none', padding: '16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', opacity: (idlProgress > 0 && idlProgress < 1) ? 0.5 : 1 }}>⬅ Fly West</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="coords-page">
      <div className="coords-book">
        
        {/* ============ MAIN CONTENT AREA ============ */}
        <div className="coords-main-content">
          
          {/* LEFT PAGE */}
          <div className="coords-left">
            <div className="coords-eyebrow">CHAPTER 1 • CLASS 6 SOCIAL SCIENCE</div>
            <h1 className="coords-chtitle">Time Zones<br/>&amp; Standard Time</h1>
            
            <div className="coords-illus" style={{ position: 'relative' }}>
              {renderVisual()}
              <button 
                onClick={() => setIsFullScreen(true)}
                title="View Fullscreen"
                style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', backdropFilter: 'blur(4px)', zIndex: 10, transition: 'all 0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              >
                <Maximize2 size={20} />
              </button>
            </div>
          </div>

          {/* RIGHT PAGE */}
          <div className="coords-right">
            <div className="coords-rhead">
              {currentStep < 8 ? (
                <>
                  <BookOpen size={32} color="var(--navy)" style={{ flexShrink: 0 }} />
                  <span style={{ minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {currentStep <= 1 && 'THE 15° SUN DIAL'}
                    {currentStep >= 2 && currentStep <= 3 && 'THE SUNSET MYSTERY'}
                    {currentStep >= 4 && currentStep <= 5 && 'GLOBAL WORLD CLOCK'}
                    {currentStep >= 6 && currentStep <= 7 && 'THE TIME TRAVELER'}
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={32} color="var(--green)" style={{ flexShrink: 0 }} />
                  <span style={{ minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    CHAPTER COMPLETE
                  </span>
                </>
              )}
            </div>

            <div className="coords-content">
              <AnimatePresence mode="wait">
                
                {currentStep === 0 && (
                  <motion.div key="book0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="coords-card">
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--navy)', marginBottom: '16px' }}>Earth&apos;s Rotation</h3>
                    <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.6, marginBottom: '12px', fontWeight: 600 }}>The Earth is a sphere, so it has <strong>360° of longitude</strong>. It completes one full spin on its axis every <strong>24 hours</strong>.</p>
                    <div style={{ background: '#FFF9F0', padding: '16px', borderRadius: '12px', marginTop: '16px', border: '1.5px solid #F2DFBC', borderLeft: '5px solid #D97706' }}>
                      <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>The Math</div>
                      <div style={{ fontSize: '19px', fontWeight: 900, color: 'var(--navy)', marginTop: '4px' }}>360° ÷ 24 hours = 15° per hour</div>
                    </div>
                    <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.6, marginTop: '16px', fontWeight: 600 }}>This means that for every 15° you move East or West, the local time changes by exactly one hour!</p>
                  </motion.div>
                )}

                {currentStep === 1 && (
                  <motion.div key="book1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="coords-card">
                    <div className="coords-task-header">
                      <div className="coords-task-badge" style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A', fontWeight: 800 }}>INTERACTIVE</div>
                      <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--navy)' }}>Prove it yourself!</h3>
                    </div>
                    <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.6, marginBottom: '24px', fontWeight: 600 }}>Use the slider below to control the hours of the day. Watch how the Earth rotates from West to East, moving 15° of longitude into the sunlight every hour.</p>
                    
                    <div style={{ background: '#FFF9F0', padding: '24px', borderRadius: '14px', border: '1.5px solid #F2DFBC' }}>
                      <div style={{ textAlign: 'center', fontWeight: 800, fontSize: '18px', color: 'var(--navy)', marginBottom: '6px' }}>
                        Hour of Day: {sunHour}:00
                      </div>
                      <div style={{ textAlign: 'center', fontSize: '13.5px', color: '#92400E', fontWeight: 700, marginBottom: '16px' }}>
                        Earth has rotated {sunHour * 15}°
                      </div>
                      <input type="range" style={{ width: '100%', accentColor: '#D97706', cursor: 'pointer', height: '6px' }} min="1" max="24" value={sunHour} onChange={e => setSunHour(Number(e.target.value))} />
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div key="book2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="coords-card">
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--navy)', marginBottom: '16px' }}>Local Time vs Standard Time</h3>
                    <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.6, marginBottom: '12px', fontWeight: 600 }}>Imagine two friends calling each other in the late afternoon. One is in <strong>Porbandar (Gujarat)</strong> in the west. The other is in <strong>Tinsukia (Assam)</strong> in the east.</p>
                    <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.6, marginBottom: '12px', fontWeight: 600 }}>Because Tinsukia is much further east, the sun sets there almost <strong>2 hours earlier</strong> than in Porbandar!</p>
                    <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.6, fontWeight: 600 }}>If every city used its own local time based on the sun, train schedules and school times would be a mess.</p>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div key="book3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="coords-card">
                    <div className="coords-task-header">
                      <div className="coords-task-badge" style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A', fontWeight: 800 }}>INTERACTIVE</div>
                      <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--navy)' }}>Indian Standard Time (IST)</h3>
                    </div>
                    <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.6, marginBottom: '20px', fontWeight: 600 }}>To avoid confusion, India chose the <strong>82.5° E longitude</strong> as the central meridian. Everyone follows this time, called <strong>Indian Standard Time (IST)</strong>.</p>
                    
                    <div style={{ background: '#FFF9F0', padding: '20px', borderRadius: '14px', border: '1.5px solid #F2DFBC' }}>
                      <label style={{ display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: 800, color: 'var(--navy)', textAlign: 'center' }}>Scrub Time of Day</label>
                      <input type="range" style={{ width: '100%', accentColor: '#D97706', cursor: 'pointer', height: '6px', marginBottom: '20px' }} min="15" max="21" step="0.5" value={sunsetTime} onChange={e => setSunsetTime(Number(e.target.value))} />
                      
                      <button 
                        onClick={() => setUseIST(!useIST)}
                        style={{ width: '100%', background: useIST ? 'var(--green)' : '#D97706', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', textAlign: 'center', fontWeight: 800, transition: 'all 0.2s', fontFamily: '"Space Grotesk", sans-serif' }}
                      >
                        {useIST ? '✓ Using Indian Standard Time (IST)' : 'Switch to Indian Standard Time (IST)'}
                      </button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div key="book4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="coords-card">
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--navy)', marginBottom: '16px' }}>Time Zones Around the World</h3>
                    <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.6, marginBottom: '12px', fontWeight: 600 }}>Most countries are small enough to have just one standard time. But what about massive countries that stretch across many meridians?</p>
                    <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.6, marginBottom: '20px', fontWeight: 600 }}>
                      The <button onClick={() => setWcHighlight('usa')} style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#92400E', fontWeight: 800, cursor: 'pointer', padding: '2px 6px', borderRadius: '6px', fontSize: '14.5px' }}>USA</button> is so wide it has to use 6 different time zones. 
                      <button onClick={() => setWcHighlight('russia')} style={{ background: '#DCFCE7', border: '1px solid #86EFAC', color: '#166534', fontWeight: 800, cursor: 'pointer', padding: '2px 6px', borderRadius: '6px', fontSize: '14.5px', marginLeft: '6px' }}>Russia</button> is even wider and uses 11 time zones!
                    </p>
                    
                    <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                      <button onClick={() => setWcHighlight('none')} style={{ flex: 1, background: wcHighlight === 'none' ? '#D97706' : '#FFF9F0', color: wcHighlight === 'none' ? '#fff' : '#78350F', border: '1.5px solid #F2DFBC', padding: '12px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', fontFamily: '"Space Grotesk", sans-serif' }}>Global</button>
                      <button onClick={() => setWcHighlight('usa')} style={{ flex: 1, background: wcHighlight === 'usa' ? '#D97706' : '#FFF9F0', color: wcHighlight === 'usa' ? '#fff' : '#78350F', border: '1.5px solid #F2DFBC', padding: '12px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', fontFamily: '"Space Grotesk", sans-serif' }}>USA (6)</button>
                      <button onClick={() => setWcHighlight('russia')} style={{ flex: 1, background: wcHighlight === 'russia' ? '#D97706' : '#FFF9F0', color: wcHighlight === 'russia' ? '#fff' : '#78350F', border: '1.5px solid #F2DFBC', padding: '12px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', fontFamily: '"Space Grotesk", sans-serif' }}>Russia (11)</button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 5 && (
                  <motion.div key="book5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="coords-card">
                    <div className="coords-task-header">
                      <div className="coords-task-badge" style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A', fontWeight: 800 }}>INTERACTIVE</div>
                      <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--navy)' }}>Explore the World Clock</h3>
                    </div>
                    <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.6, marginBottom: '20px', fontWeight: 600 }}>Highlight the USA or Russia on the globe to visualize why they need multiple standard times.</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <button onClick={() => setWcHighlight('none')} style={{ background: wcHighlight === 'none' ? '#D97706' : '#FFF9F0', color: wcHighlight === 'none' ? '#fff' : '#78350F', border: '1.5px solid #F2DFBC', padding: '12px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', fontFamily: '"Space Grotesk", sans-serif' }}>Global View</button>
                      <button onClick={() => setWcHighlight('usa')} style={{ background: wcHighlight === 'usa' ? '#D97706' : '#FFF9F0', color: wcHighlight === 'usa' ? '#fff' : '#78350F', border: '1.5px solid #F2DFBC', padding: '12px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', fontFamily: '"Space Grotesk", sans-serif' }}>USA (6 Zones)</button>
                      <button onClick={() => setWcHighlight('russia')} style={{ background: wcHighlight === 'russia' ? '#D97706' : '#FFF9F0', color: wcHighlight === 'russia' ? '#fff' : '#78350F', border: '1.5px solid #F2DFBC', padding: '12px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', fontFamily: '"Space Grotesk", sans-serif' }}>Russia (11 Zones)</button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 6 && (
                  <motion.div key="book6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="coords-card">
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--navy)', marginBottom: '16px' }}>The International Date Line</h3>
                    <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.6, marginBottom: '12px', fontWeight: 600 }}>What happens when you travel halfway around the world? Opposite the Prime Meridian is the <strong>180° longitude</strong> line.</p>
                    <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.6, fontWeight: 600 }}>This line is called the <strong>International Date Line</strong>. Because you add hours travelling East and subtract hours travelling West, crossing this line means you must change your calendar date!</p>
                  </motion.div>
                )}

                {currentStep === 7 && (
                  <motion.div key="book7" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="coords-card">
                    <div className="coords-task-header">
                      <div className="coords-task-badge" style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A', fontWeight: 800 }}>MISSION</div>
                      <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--navy)' }}>Pacific Flight</h3>
                    </div>
                    <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.6, marginBottom: '16px', fontWeight: 600 }}>You are piloting a plane across the Pacific Ocean. When you cross the International Date Line, you must adjust your calendar.</p>
                    <ul style={{ padding: '16px', background: '#FEF3C7', borderRadius: '12px', border: '1.5px solid #FDE68A', borderLeft: '5px solid #D97706', listStyle: 'none', margin: '0 0 20px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <li style={{ fontSize: '14.5px', color: '#92400E', fontWeight: 700 }}><strong>Cross East ➡:</strong> Subtract a day</li>
                      <li style={{ fontSize: '14.5px', color: '#92400E', fontWeight: 700 }}><strong>Cross West ⬅:</strong> Add a day</li>
                    </ul>
                    
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={() => startFlight('east')} disabled={idlProgress > 0 && idlProgress < 1} style={{ flex: 1, background: '#D97706', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', fontFamily: '"Space Grotesk", sans-serif' }}>Fly East ➡</button>
                      <button onClick={() => startFlight('west')} disabled={idlProgress > 0 && idlProgress < 1} style={{ flex: 1, background: 'var(--navy)', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', fontFamily: '"Space Grotesk", sans-serif' }}>⬅ Fly West</button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 8 && (
                  <motion.div key="book8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="coords-card">
                    <div style={{ textAlign: 'center', padding: '24px 0' }}>
                      <CheckCircle2 size={56} color="var(--green)" style={{ margin: '0 auto 14px' }} />
                      <h2 style={{ fontSize: '26px', color: 'var(--navy)', marginBottom: '12px' }}>Chapter Complete!</h2>
                      <p style={{ fontSize: '16px', color: 'var(--ink)', lineHeight: 1.6, fontWeight: 600 }}>You&apos;ve mastered Time Zones, the Earth&apos;s rotation, and the International Date Line!</p>
                    </div>
                  </motion.div>
                )}
                
              </AnimatePresence>
            </div>

            <div className="coords-btm-bar">
              <div className="coords-page-ind">
                <BookOpen size={16} />
                Page {currentStep + 1} of 9
              </div>
              <div className="coords-nav-btns">
                <button 
                  className="coords-btn-ghost" 
                  onClick={() => {
                    if (currentStep === 0 && onBack) {
                      onBack();
                    } else {
                      setCurrentStep(Math.max(0, currentStep - 1));
                    }
                  }} 
                  disabled={currentStep === 0 && !onBack}
                  style={{ opacity: (currentStep === 0 && !onBack) ? 0.5 : 1, cursor: (currentStep === 0 && !onBack) ? 'not-allowed' : 'pointer' }}
                >
                  <ArrowLeft size={16} /> Previous
                </button>
                {currentStep < 8 ? (
                  <button className="coords-btn-fill" onClick={() => setCurrentStep(currentStep + 1)}>
                    Next Page <ArrowRight size={16} />
                  </button>
                ) : (
                  <button className="coords-btn-fill" onClick={onNextActivity} style={{ background: 'var(--green)' }}>
                    Finish <CheckCircle2 size={16} />
                  </button>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* IDL QUESTION MODAL */}
      <AnimatePresence>
        {idlQuestionVisible && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              style={{ background: '#fff', padding: '32px', borderRadius: '16px', maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
            >
              <h3 style={{ margin: '0 0 12px 0', color: '#0f172a', fontSize: '24px', fontFamily: 'var(--serif)' }}>Calendar Check!</h3>
              <p style={{ margin: '0 0 24px 0', color: '#475569', fontSize: '16px', lineHeight: 1.5 }}>You are crossing the International Date Line flying <strong>{idlDirection.toUpperCase()}</strong>. What should you do to your calendar?</p>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => handleIDLAnswer('add')}
                  style={{ flex: 1, padding: '12px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Add a day
                </button>
                <button 
                  onClick={() => handleIDLAnswer('subtract')}
                  style={{ flex: 1, padding: '12px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Subtract a day
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* IDL FEEDBACK MODAL */}
      <AnimatePresence>
        {idlFeedback && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              style={{ background: '#fff', padding: '32px', borderRadius: '16px', maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
            >
              {idlFeedback.type === 'success' ? (
                <div style={{ background: '#dcfce7', width: '64px', height: '64px', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle2 size={32} color="#16a34a" />
                </div>
              ) : (
                <div style={{ background: '#fee2e2', width: '64px', height: '64px', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <X size={32} color="#dc2626" />
                </div>
              )}
              <h3 style={{ margin: '0 0 12px 0', color: '#0f172a', fontSize: '24px', fontFamily: 'var(--serif)' }}>{idlFeedback.title}</h3>
              <p style={{ margin: '0 0 24px 0', color: '#475569', fontSize: '16px', lineHeight: 1.5 }}>{idlFeedback.message}</p>
              <button 
                onClick={() => setIdlFeedback(null)}
                style={{ width: '100%', padding: '12px', background: idlFeedback.type === 'success' ? '#16a34a' : '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {idlFeedback.type === 'success' ? 'Continue Flight' : 'Try Again'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN MODAL */}
      {isFullScreen && (
        <div style={{ position: 'fixed', inset: 0, background: '#0f172a', zIndex: 9999 }}>
          <button 
            onClick={() => setIsFullScreen(false)}
            style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '12px', borderRadius: '12px', cursor: 'pointer', zIndex: 10 }}
          >
            <X size={24} />
          </button>
          {renderVisual()}
          {renderFullScreenControls()}
        </div>
      )}
    </div>
  );
}
