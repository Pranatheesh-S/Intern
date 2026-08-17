import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Compass, Crosshair, ArrowRight, ArrowLeft, CheckCircle2, BookOpen, Maximize2, X } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, useTexture, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import './CoordinatesPageBook.css';
import worldMapUrl from './world-map.jpg';
import Globe3D from './Globe3D';

const HemispheresGlobe = ({ splitMode }) => {
  const colorMap = useTexture(worldMapUrl);
  const radius = 2.2;
  const segments = 64;

  const mapTop = React.useMemo(() => { const t = colorMap.clone(); t.repeat.set(1, 0.5); t.offset.set(0, 0.5); t.needsUpdate = true; return t; }, [colorMap]);
  const mapBottom = React.useMemo(() => { const t = colorMap.clone(); t.repeat.set(1, 0.5); t.offset.set(0, 0); t.needsUpdate = true; return t; }, [colorMap]);
  const mapWest = React.useMemo(() => { const t = colorMap.clone(); t.repeat.set(0.5, 1); t.offset.set(0, 0); t.needsUpdate = true; return t; }, [colorMap]);
  const mapEast = React.useMemo(() => { const t = colorMap.clone(); t.repeat.set(0.5, 1); t.offset.set(0.5, 0); t.needsUpdate = true; return t; }, [colorMap]);

  const topHalfRef = React.useRef();
  const bottomHalfRef = React.useRef();
  const leftHalfRef = React.useRef();
  const rightHalfRef = React.useRef();
  const groupRef = React.useRef();

  const splitModeRef = React.useRef(splitMode);
  const alignRef = React.useRef(null);
  
  React.useEffect(() => { 
    splitModeRef.current = splitMode; 
    if (splitMode === 'prime') alignRef.current = null;
  }, [splitMode]);

  useFrame((state, delta) => {
    const mode = splitModeRef.current;
    
    if (groupRef.current) {
      if (mode === 'none' || mode === 'equator') {
        groupRef.current.rotation.y += delta * 0.15;
      } else if (mode === 'prime') {
        // Rotate globe so the Prime Meridian split perfectly faces the current camera position
        if (alignRef.current === null) {
          alignRef.current = Math.atan2(state.camera.position.x, state.camera.position.z);
        }
        let diff = alignRef.current - groupRef.current.rotation.y;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        groupRef.current.rotation.y += diff * 0.08;
      }
    }
    
    // Animate equator split
    const targetY = mode === 'equator' ? 0.6 : 0;
    if (topHalfRef.current) topHalfRef.current.position.y = THREE.MathUtils.lerp(topHalfRef.current.position.y, targetY, 0.08);
    if (bottomHalfRef.current) bottomHalfRef.current.position.y = THREE.MathUtils.lerp(bottomHalfRef.current.position.y, -targetY, 0.08);

    // Animate prime meridian split
    const targetX = mode === 'prime' ? 0.6 : 0;
    if (rightHalfRef.current) rightHalfRef.current.position.x = THREE.MathUtils.lerp(rightHalfRef.current.position.x, targetX, 0.08);
    if (leftHalfRef.current) leftHalfRef.current.position.x = THREE.MathUtils.lerp(leftHalfRef.current.position.x, -targetX, 0.08);
  });

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

  const parallels = React.useMemo(() => [-60, -30, 30, 60].map(createLatitudeLine), []);
  const meridians = React.useMemo(() => [-150, -120, -90, -60, -30, 30, 60, 90, 120, 150].map(createLongitudeLine), []);

  const baseMatProps = { color: "#ffffff", emissive: "#0f172a", roughness: 0.6, metalness: 0.1, transparent: true, opacity: 0.92 };
  const capMaterial = <meshStandardMaterial color="#1e293b" roughness={0.9} />;

  return (
    <group ref={groupRef}>
      
      {/* Graticule Grid */}
      <group>
        {parallels.map((points, idx) => (
          <Line key={`p-${idx}`} points={points} color="#60a5fa" lineWidth={1} transparent opacity={splitMode === 'none' ? 0.25 : 0.05} />
        ))}
        {meridians.map((points, idx) => (
          <Line key={`m-${idx}`} points={points} color="#60a5fa" lineWidth={1} transparent opacity={splitMode === 'none' ? 0.25 : 0.05} />
        ))}
        <Line points={createLongitudeLine(180)} color="#60a5fa" lineWidth={1} transparent opacity={splitMode === 'none' ? 0.25 : 0.05} />
      </group>

      {/* Default full sphere */}
      <group visible={splitMode === 'none'}>
        <Sphere args={[radius, 64, 64]}>
          <meshStandardMaterial {...baseMatProps} map={colorMap} />
        </Sphere>
      </group>

      {/* Equator Split */}
      <group visible={splitMode === 'equator'}>
        <group ref={topHalfRef}>
          <Sphere args={[radius, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]}>
            <meshStandardMaterial {...baseMatProps} map={mapTop} />
          </Sphere>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[radius, 64]} />
            {capMaterial}
          </mesh>
        </group>
        <group ref={bottomHalfRef}>
          <Sphere args={[radius, 64, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]}>
            <meshStandardMaterial {...baseMatProps} map={mapBottom} />
          </Sphere>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[radius, 64]} />
            {capMaterial}
          </mesh>
        </group>
      </group>

      {/* Prime Meridian Split */}
      <group visible={splitMode === 'prime'}>
        <group ref={rightHalfRef}>
          <Sphere args={[radius, 32, 64, Math.PI / 2, Math.PI, 0, Math.PI]}>
            <meshStandardMaterial {...baseMatProps} map={mapEast} />
          </Sphere>
          <mesh rotation={[0, -Math.PI / 2, 0]}>
            <circleGeometry args={[radius, 64]} />
            {capMaterial}
          </mesh>
        </group>
        <group ref={leftHalfRef}>
          <Sphere args={[radius, 32, 64, -Math.PI / 2, Math.PI, 0, Math.PI]}>
            <meshStandardMaterial {...baseMatProps} map={mapWest} />
          </Sphere>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <circleGeometry args={[radius, 64]} />
            {capMaterial}
          </mesh>
        </group>
      </group>
    </group>
  );
};

const HemisphereVisual = ({ splitMode }) => (
  <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }} style={{ width: '100%', height: '100%', cursor: 'grab' }}>
    <ambientLight intensity={0.7} />
    <directionalLight position={[10, 15, 10]} intensity={1.5} color="#ffffff" />
    <directionalLight position={[-10, -10, -5]} intensity={1.0} color="#3b82f6" />
    <HemispheresGlobe splitMode={splitMode} />
    <OrbitControls enableZoom={true} enablePan={false} autoRotate={false} minDistance={3} maxDistance={10} />
  </Canvas>
);

const UjjainGlobe = ({ showAncient }) => {
  const colorMap = useTexture(worldMapUrl);
  const radius = 2.2;
  const segments = 64;
  const groupRef = React.useRef();

  const createLongitudeLine = (lon) => {
    const points = [];
    const radLon = ((lon + 90) * Math.PI) / 180;
    for (let i = 0; i <= segments; i++) {
      const phi = (i / segments) * Math.PI - Math.PI / 2;
      const x = radius * Math.cos(phi) * Math.sin(radLon);
      const y = radius * Math.sin(phi);
      const z = radius * Math.cos(phi) * Math.cos(radLon);
      points.push(new THREE.Vector3(x, y, z));
    }
    return points;
  };
  
  const ujjainMeridian = React.useMemo(() => createLongitudeLine(75.8), []);
  const greenwichMeridian = React.useMemo(() => createLongitudeLine(0), []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, THREE.MathUtils.degToRad(-170), 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, THREE.MathUtils.degToRad(15), 0.05);
    }
  });

  const getPos = (lat, lon) => {
    const radLat = lat * (Math.PI / 180);
    const radLon = ((lon + 90) * Math.PI) / 180;
    const x = radius * Math.cos(radLat) * Math.sin(radLon);
    const y = radius * Math.sin(radLat);
    const z = radius * Math.cos(radLat) * Math.cos(radLon);
    return new THREE.Vector3(x, y, z);
  };

  const cities = [
    { name: 'Kurukshetra', lat: 29.9, lon: 76.8 },
    { name: 'Ujjayini', lat: 23.1, lon: 75.7 },
    { name: 'Kanyakumari', lat: 8.0, lon: 77.5 }
  ];

  return (
    <group ref={groupRef}>
      <Sphere args={[radius, 64, 64]}>
        <meshStandardMaterial map={colorMap} color={showAncient ? '#cbd5e1' : '#ffffff'} emissive="#0f172a" emissiveIntensity={showAncient ? 0.3 : 1} roughness={0.6} metalness={0.1} transparent opacity={0.92} />
      </Sphere>
      
      <Line points={greenwichMeridian} color="#ffffff" lineWidth={showAncient ? 1 : 3} transparent opacity={showAncient ? 0.2 : 0.8} />

      {showAncient && (
        <Line points={ujjainMeridian} color="#fbbf24" lineWidth={4} />
      )}

      {showAncient && cities.map(city => {
        const pos = getPos(city.lat, city.lon);
        return (
          <group key={city.name} position={pos}>
            <mesh>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshBasicMaterial color="#ef4444" />
            </mesh>
            <Html position={[0, 0.1, 0]} center zIndexRange={[100, 0]}>
              <div style={{ background: 'rgba(15, 23, 42, 0.85)', padding: '4px 8px', borderRadius: '4px', color: '#fff', fontSize: '10px', whiteSpace: 'nowrap', border: '1px solid #fbbf24' }}>
                {city.name}
              </div>
            </Html>
          </group>
        )
      })}
    </group>
  );
};

const UjjainVisual = ({ showAncient }) => (
  <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }} style={{ width: '100%', height: '100%', cursor: 'grab' }}>
    <ambientLight intensity={0.7} />
    <directionalLight position={[10, 15, 10]} intensity={1.5} color="#ffffff" />
    <directionalLight position={[-10, -10, -5]} intensity={1.0} color="#3b82f6" />
    <UjjainGlobe showAncient={showAncient} />
    <OrbitControls enableZoom={true} enablePan={false} autoRotate={false} minDistance={3} maxDistance={10} />
  </Canvas>
);

const IndiaGridVisual = ({ extN, extS, extW, extE }) => {
  const mapLonToX = (lon) => ((lon - 60) / 40) * 100;
  const mapLatToY = (lat) => 100 - ((lat - 5) / 35) * 100;

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#08213a', overflow: 'hidden', borderRadius: '12px' }}>
       <img src={worldMapUrl} alt="Map" style={{ position: 'absolute', width: '900%', height: '514.285%', left: '-600%', top: '-142.857%', opacity: 0.4 }} />
       <svg viewBox="0 0 100 100" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }} preserveAspectRatio="none">
          <line x1="0" y1={mapLatToY(extN)} x2="100" y2={mapLatToY(extN)} stroke={extN === 37 ? "#22c55e" : "#ef4444"} strokeWidth="1.5" strokeDasharray="2 2" />
          <text x="50" y={mapLatToY(extN) - 2} fill={extN === 37 ? "#22c55e" : "#ef4444"} fontSize="4" fontWeight="bold" textAnchor="middle">{extN}° N</text>
          
          <line x1="0" y1={mapLatToY(extS)} x2="100" y2={mapLatToY(extS)} stroke={extS === 8 ? "#22c55e" : "#ef4444"} strokeWidth="1.5" strokeDasharray="2 2" />
          <text x="50" y={mapLatToY(extS) + 5} fill={extS === 8 ? "#22c55e" : "#ef4444"} fontSize="4" fontWeight="bold" textAnchor="middle">{extS}° N</text>

          <line x1={mapLonToX(extW)} y1="0" x2={mapLonToX(extW)} y2="100" stroke={extW === 68 ? "#22c55e" : "#3b82f6"} strokeWidth="1.5" strokeDasharray="2 2" />
          <text x={mapLonToX(extW) - 2} y="50" fill={extW === 68 ? "#22c55e" : "#3b82f6"} fontSize="4" fontWeight="bold" transform={`rotate(-90, ${mapLonToX(extW) - 2}, 50)`} textAnchor="middle">{extW}° E</text>

          <line x1={mapLonToX(extE)} y1="0" x2={mapLonToX(extE)} y2="100" stroke={extE === 97 ? "#22c55e" : "#3b82f6"} strokeWidth="1.5" strokeDasharray="2 2" />
          <text x={mapLonToX(extE) + 2} y="50" fill={extE === 97 ? "#22c55e" : "#3b82f6"} fontSize="4" fontWeight="bold" transform={`rotate(-90, ${mapLonToX(extE) + 2}, 50)`} textAnchor="middle">{extE}° E</text>

          {extN === 37 && extS === 8 && extW === 68 && extE === 97 && (
            <rect x={mapLonToX(extW)} y={mapLatToY(extN)} width={mapLonToX(extE) - mapLonToX(extW)} height={mapLatToY(extS) - mapLatToY(extN)} fill="rgba(34, 197, 94, 0.2)" stroke="#22c55e" strokeWidth="2" />
          )}
       </svg>
    </div>
  )
};

export default function CoordinatesPage({ onNextActivity, onBack }) {
  const [currentStep, setCurrentStep] = useState(0); // 0-4: Book, 5-7: Tasks, 8-10: New Topics
  const [latVal, setLatVal] = useState(0);
  const [lonVal, setLonVal] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [splitMode, setSplitMode] = useState('none');
  
  // Task 3 (Quiz) State
  const [gridLat, setGridLat] = useState(0);
  const [gridLon, setGridLon] = useState(0);
  const [quizStage, setQuizStage] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState(null);

  const quizCities = [
    { name: 'Delhi', desc: 'Capital of India', lat: 29, lon: 77 },
    { name: 'Mumbai', desc: 'Financial capital of India', lat: 19, lon: 73 },
    { name: 'Kolkata', desc: 'Cultural capital of India', lat: 23, lon: 88 },
    { name: 'Singapore', desc: 'Island city-state in SE Asia', lat: 1, lon: 104 },
    { name: 'Paris', desc: 'Capital of France', lat: 49, lon: 2 }
  ];
  const currentCity = quizCities[quizStage] || quizCities[0];

  // New Activities State
  const [showAncient, setShowAncient] = useState(false);
  const [extN, setExtN] = useState(45);
  const [extS, setExtS] = useState(0);
  const [extW, setExtW] = useState(60);
  const [extE, setExtE] = useState(105);

  const getHemi = (val, isLat) => {
    if (val === 0) return isLat ? 'Equator' : 'Prime Meridian';
    if (isLat) return val > 0 ? 'Northern' : 'Southern';
    return val > 0 ? 'Eastern' : 'Western';
  };

  const checkAnswer = () => {
    if (Math.abs(gridLat - currentCity.lat) <= 5 && Math.abs(gridLon - currentCity.lon) <= 5) {
      if (quizStage < quizCities.length - 1) {
        setQuizFeedback({
          type: 'success',
          title: 'Correct!',
          message: `You found ${currentCity.name}. Let's find the next one!`
        });
        setQuizStage(s => s + 1);
        setGridLat(0);
        setGridLon(0);
      } else {
        setQuizCompleted(true);
      }
    } else {
      const latDir = currentCity.lat >= 0 ? 'N' : 'S';
      const lonDir = currentCity.lon >= 0 ? 'E' : 'W';
      setQuizFeedback({
        type: 'error',
        title: 'Not quite!',
        message: `${currentCity.name} is at ${Math.abs(currentCity.lat)}°${latDir}, ${Math.abs(currentCity.lon)}°${lonDir}. Adjust the sliders closer.`
      });
    }
  };

  const WorldMap2D = () => {
    const W = 360, H = 180;
    const px = ((gridLon + 180) / 360) * W;
    const py = ((90 - gridLat) / 180) * H;
    const targetPx = ((currentCity.lon + 180) / 360) * W;
    const targetPy = ((90 - currentCity.lat) / 180) * H;

    return (
      <div style={{ position: 'absolute', inset: 0, background: '#08213a', overflow: 'hidden', borderRadius: '12px' }}>
        <img src={worldMapUrl} alt="World Map" style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'fill', opacity: 0.5 }} />
        <svg viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
          {/* Grid Lines */}
          <line x1="0" y1={H / 2} x2={W} y2={H / 2} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1={W / 2} y1="0" x2={W / 2} y2={H} stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* Target Box */}
          <circle cx={targetPx} cy={targetPy} r="6" fill="rgba(239, 68, 68, 0.4)" stroke="#ef4444" strokeWidth="1.5">
            <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
          </circle>

          {/* User Selection */}
          <line x1={px} y1={0} x2={px} y2={H} stroke="#38bdf8" strokeDasharray="2 2" strokeWidth="1" />
          <line x1={0} y1={py} x2={W} y2={py} stroke="#38bdf8" strokeDasharray="2 2" strokeWidth="1" />
          <circle cx={px} cy={py} r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
        </svg>
      </div>
    );
  };

  const ChessboardVisual = () => (
    <div style={{ width: '100%', height: '100%', background: '#e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', borderRadius: '12px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px', background: '#94a3b8', padding: '4px', borderRadius: '8px', border: '4px solid #475569' }}>
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} style={{ width: '40px', height: '40px', background: (Math.floor(i/4) + i%4) % 2 === 0 ? '#fff' : '#64748b' }} />
        ))}
      </div>
      <p style={{ marginTop: '16px', fontWeight: 'bold', color: '#334155' }}>Grid Coordinate System</p>
    </div>
  );

  const renderVisual = () => (
    <>
      {currentStep === 0 && <ChessboardVisual />}
      {currentStep === 1 && <div style={{ position: 'absolute', inset: 0 }}><Globe3D currentTask={0} latVal={0} lonVal={0} gridLat={0} gridLon={0} /></div>}
      {currentStep === 2 && <div style={{ position: 'absolute', inset: 0 }}><Globe3D currentTask={1} latVal={0} lonVal={0} gridLat={0} gridLon={0} /></div>}
      {currentStep === 3 && <div style={{ position: 'absolute', inset: 0 }}><Globe3D currentTask={2} latVal={0} lonVal={0} gridLat={0} gridLon={0} /></div>}
      {currentStep === 4 && <div style={{ position: 'absolute', inset: 0 }}><Globe3D currentTask={3} latVal={0} lonVal={0} gridLat={29} gridLon={77} /></div>}
      {currentStep === 5 && <div style={{ position: 'absolute', inset: 0 }}><Globe3D currentTask={1} latVal={latVal} lonVal={0} gridLat={0} gridLon={0} /></div>}
      {currentStep === 6 && <div style={{ position: 'absolute', inset: 0 }}><Globe3D currentTask={2} latVal={0} lonVal={lonVal} gridLat={0} gridLon={0} /></div>}
      {currentStep === 7 && <WorldMap2D />}
      {currentStep === 8 && <div style={{ position: 'absolute', inset: 0 }}><HemisphereVisual splitMode={splitMode} /></div>}
      {currentStep === 9 && <div style={{ position: 'absolute', inset: 0 }}><UjjainVisual showAncient={showAncient} /></div>}
      {currentStep === 10 && <div style={{ position: 'absolute', inset: 0 }}><IndiaGridVisual extN={extN} extS={extS} extW={extW} extE={extE} /></div>}
    </>
  );

  return (
    <div className="coords-page">
      <div className="coords-book">
        
        {/* ============ MAIN CONTENT AREA ============ */}
        <div className="coords-main-content">
          
          {/* LEFT PAGE */}
          <div className="coords-left">
            <div className="coords-eyebrow">CHAPTER 1 • CLASS 6 SOCIAL SCIENCE</div>
            <h1 className="coords-chtitle">Locating Places<br/>on the Earth</h1>
            
            <div className="coords-illus" style={{ background: currentStep === 0 ? 'transparent' : undefined, position: 'relative' }}>
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
              {currentStep < 5 || currentStep >= 8 ? (
                <>
                  <BookOpen size={32} color="var(--navy)" style={{ flexShrink: 0 }} />
                  <span style={{ minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {currentStep === 0 && 'UNDERSTANDING COORDINATES'}
                    {currentStep === 1 && 'MAPPING THE EARTH'}
                    {currentStep === 2 && 'LATITUDES'}
                    {currentStep === 3 && 'LONGITUDES'}
                    {currentStep === 4 && 'LATITUDE + LONGITUDE'}
                    {currentStep === 8 && 'HEMISPHERES'}
                    {currentStep === 9 && 'UJJAYINI MERIDIAN'}
                    {currentStep === 10 && 'INDIA\'S EXTENT'}
                  </span>
                </>
              ) : (
                <>
                  <Compass size={32} color="var(--navy)" style={{ flexShrink: 0 }} />
                  <span style={{ minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {currentStep === 5 && 'TASK 1: LATITUDE'}
                    {currentStep === 6 && 'TASK 2: LONGITUDE'}
                    {currentStep === 7 && 'TASK 3: FIND THE PLACE'}
                  </span>
                </>
              )}
            </div>

            <div className="coords-content">
              <AnimatePresence mode="wait">
                
                {/* BOOK PAGE 1 */}
                {currentStep === 0 && (
                  <motion.div key="book0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="coords-task-container">
                    <div className="coords-hero">
                      <h3>Understanding Coordinates</h3>
                      <p>Imagine a big market with neat rows of shops. If you tell a friend, "Meet me at the 7th shop in the 5th row," they can find you instantly.</p>
                      <p style={{ marginTop: '12px' }}>Similarly, in a game of chess, players record their moves using letters (a-h) and numbers (1-8). By saying "d4", they pinpoint one exact square on the board.</p>
                      <p style={{ marginTop: '12px' }}>To locate a place precisely, we always need <strong>two pieces of information</strong> to form a coordinate.</p>
                    </div>
                  </motion.div>
                )}

                {/* BOOK PAGE 2 */}
                {currentStep === 1 && (
                  <motion.div key="book1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="coords-task-container">
                    <div className="coords-hero">
                      <h3>Mapping the Earth</h3>
                      <p>The Earth is approximately spherical, spinning in space. The best way to represent our planet is using a <strong>globe</strong>.</p>
                      <p style={{ marginTop: '12px' }}>Representing a curved, 3D sphere perfectly on a flat sheet of paper is very difficult because it causes the shapes and sizes of continents to distort.</p>
                      <p style={{ marginTop: '12px' }}>Because the Earth is a sphere, we need a special coordinate system that wraps around it to locate places accurately.</p>
                    </div>
                  </motion.div>
                )}

                {/* BOOK PAGE 3 */}
                {currentStep === 2 && (
                  <motion.div key="book2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="coords-task-container">
                    <div className="coords-hero">
                      <h3>Latitudes</h3>
                      <p>The <strong>Equator</strong> is an imaginary line that runs horizontally around the center of the Earth. It is at <strong>0° latitude</strong>.</p>
                      <p style={{ marginTop: '12px' }}>The circles that run parallel to the Equator are called <strong>parallels of latitude</strong>.</p>
                      <ul style={{ marginTop: '12px', paddingLeft: '20px', color: 'var(--text)', lineHeight: 1.6 }}>
                        <li>The Equator divides the Earth into the Northern and Southern Hemispheres.</li>
                        <li>Latitude increases as we move north or south.</li>
                        <li>The North Pole is at <strong>90°N</strong>.</li>
                        <li>The South Pole is at <strong>90°S</strong>.</li>
                      </ul>
                    </div>
                  </motion.div>
                )}

                {/* BOOK PAGE 4 */}
                {currentStep === 3 && (
                  <motion.div key="book3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="coords-task-container">
                    <div className="coords-hero">
                      <h3>Longitudes</h3>
                      <p>Unlike latitude, we need lines that run vertically from the North Pole to the South Pole. These are called <strong>meridians of longitude</strong>.</p>
                      <p style={{ marginTop: '12px' }}>The meridian that passes through Greenwich, England is called the <strong>Prime Meridian</strong>. It is at <strong>0° longitude</strong>.</p>
                      <ul style={{ marginTop: '12px', paddingLeft: '20px', color: 'var(--text)', lineHeight: 1.6 }}>
                        <li>The Prime Meridian divides the Earth into the Eastern and Western Hemispheres.</li>
                        <li>Longitude is measured East (E) or West (W).</li>
                        <li>The lines extend up to <strong>180°</strong> on the opposite side of the Earth.</li>
                      </ul>
                    </div>
                  </motion.div>
                )}

                {/* BOOK PAGE 5 */}
                {currentStep === 4 && (
                  <motion.div key="book4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="coords-task-container">
                    <div className="coords-hero">
                      <h3>Latitude + Longitude</h3>
                      <p>By crossing parallels of latitude and meridians of longitude, we create a <strong>global grid</strong>.</p>
                      <p style={{ marginTop: '12px' }}>Just like the market rows or the chessboard, these two pieces of information allow us to locate any place on Earth exactly!</p>
                      <div style={{ background: '#ecfdf5', border: '2px solid #a7f3d0', padding: '16px', borderRadius: '12px', marginTop: '16px' }}>
                        <h4 style={{ color: 'var(--green)', margin: '0 0 8px 0', fontSize: '15px' }}>Example: Delhi</h4>
                        <p style={{ color: '#065f46', margin: 0, fontSize: '14px', lineHeight: 1.5 }}>
                          The capital of India, Delhi, is located exactly at <strong>29°N</strong> latitude and <strong>77°E</strong> longitude. (Shown as the glowing dot on the globe).
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TASK 1: LATITUDE */}
                {currentStep === 5 && (
                  <motion.div key="task1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="coords-task-container">
                    <div className="coords-hero">
                      <h3>The Parallels of Latitude</h3>
                      <p>Latitude tells us how far North or South of the Equator a place is. These lines run east-west around the globe like belts.</p>
                    </div>
                    <div>
                      <label className="coords-control-label">Move the slider to explore Latitude:</label>
                      <input type="range" style={{ width: '100%', accentColor: 'var(--blue)', height: '10px' }} min="-90" max="90" value={latVal} onChange={e => setLatVal(Number(e.target.value))} />
                    </div>
                    <div className="coords-grid">
                      <div className="coords-fact">
                        <div className="lab l-blue">Current Latitude</div>
                        <div className="v">{Math.abs(latVal)}° {latVal > 0 ? 'N' : latVal < 0 ? 'S' : ''}</div>
                      </div>
                      <div className="coords-fact">
                        <div className="lab l-green">Hemisphere</div>
                        <div className="v">{getHemi(latVal, true)}</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TASK 2: LONGITUDE */}
                {currentStep === 6 && (
                  <motion.div key="task2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="coords-task-container">
                    <div className="coords-hero">
                      <h3>The Meridians of Longitude</h3>
                      <p>Longitude tells us how far East or West a place is. These lines run from the North Pole to the South Pole.</p>
                    </div>
                    <div>
                      <label className="coords-control-label">Move the slider to explore Longitude:</label>
                      <input type="range" style={{ width: '100%', accentColor: 'var(--blue)', height: '10px' }} min="-180" max="180" value={lonVal} onChange={e => setLonVal(Number(e.target.value))} />
                    </div>
                    <div className="coords-grid">
                      <div className="coords-fact">
                        <div className="lab l-orange">Current Longitude</div>
                        <div className="v">{Math.abs(lonVal)}° {lonVal > 0 ? 'E' : lonVal < 0 ? 'W' : ''}</div>
                      </div>
                      <div className="coords-fact">
                        <div className="lab l-violet">Hemisphere</div>
                        <div className="v">{getHemi(lonVal, false)}</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TASK 3: FIND THE PLACE */}
                {currentStep === 7 && (
                  <motion.div key="task3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="coords-task-container">
                    <div className="coords-hero" style={{ padding: 'clamp(12px, 1.5vw, 20px)' }}>
                      <h3>Pinpointing Locations</h3>
                      <p>By crossing latitude and longitude, we create a global grid. Let's practice finding coordinates.</p>
                    </div>

                    {!quizCompleted ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 1.5vw, 20px)', flex: 1 }}>
                        <div style={{ background: 'var(--navy)', color: '#fff', padding: 'clamp(12px, 1.5vw, 20px)', borderRadius: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: '900', fontFamily: 'var(--serif)' }}>Find {currentCity.name}</div>
                            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' }}>{quizStage + 1} / {quizCities.length}</div>
                          </div>
                          <div style={{ fontSize: '16px', marginTop: '4px', color: '#93c5fd' }}>
                            Target: {Math.abs(currentCity.lat)}°{currentCity.lat >= 0 ? 'N' : 'S'}, {Math.abs(currentCity.lon)}°{currentCity.lon >= 0 ? 'E' : 'W'} ({currentCity.desc})
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '16px' }}>
                          <div style={{ flex: 1 }}>
                            <label className="coords-control-label">Latitude: {gridLat}°</label>
                            <input type="range" style={{ width: '100%', accentColor: '#ef4444', height: '10px' }} min="-90" max="90" value={gridLat} onChange={e => setGridLat(Number(e.target.value))} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label className="coords-control-label">Longitude: {gridLon}°</label>
                            <input type="range" style={{ width: '100%', accentColor: '#fbbf24', height: '10px' }} min="-180" max="180" value={gridLon} onChange={e => setGridLon(Number(e.target.value))} />
                          </div>
                        </div>

                        <button 
                          onClick={checkAnswer}
                          style={{ width: '100%', background: 'var(--blue)', color: '#fff', border: 'none', padding: 'clamp(12px, 1.5vw, 16px)', borderRadius: '12px', fontSize: 'clamp(15px, 1.5vw, 18px)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: 'auto' }}
                        >
                          <Crosshair size={22} /> Confirm Coordinates
                        </button>
                      </div>
                    ) : (
                      <div style={{ background: '#ecfdf5', border: '2px solid #a7f3d0', padding: 'clamp(20px, 2.5vw, 32px)', borderRadius: '16px', textAlign: 'center', margin: 'auto 0' }}>
                        <CheckCircle2 size={56} color="var(--green)" style={{ margin: '0 auto 12px' }} />
                        <h3 style={{ color: 'var(--green)', margin: '0 0 12px 0', fontSize: 'clamp(22px, 2.5vw, 28px)', fontFamily: 'var(--serif)' }}>Excellent Job!</h3>
                        <p style={{ color: '#065f46', margin: 0, fontSize: 'clamp(15px, 1.5vw, 18px)', lineHeight: 1.5 }}>
                          You have successfully located all {quizCities.length} cities using the global grid!
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* BOOK PAGE 6 (HEMISPHERES) */}
                {currentStep === 8 && (
                  <motion.div key="book8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="coords-task-container">
                    <div className="coords-hero">
                      <h3>The Hemispheres</h3>
                      <p>A <strong>hemisphere</strong> is simply one half of a sphere. We divide the Earth into hemispheres to easily refer to large regions.</p>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                        <button 
                          onClick={() => setSplitMode(splitMode === 'equator' ? 'none' : 'equator')}
                          style={{ background: splitMode === 'equator' ? 'var(--blue)' : 'var(--navy)', color: '#fff', border: 'none', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                          <span><strong>Northern & Southern</strong> (Equator Split)</span>
                          {splitMode === 'equator' && <CheckCircle2 size={20} />}
                        </button>
                        {splitMode === 'equator' && (
                          <div style={{ padding: '0 12px', fontSize: '14px', color: 'var(--text)', lineHeight: 1.5 }}>
                            The Equator divides the Earth horizontally. The top half is the <strong>Northern Hemisphere</strong> and the bottom half is the <strong>Southern Hemisphere</strong>.
                          </div>
                        )}

                        <button 
                          onClick={() => setSplitMode(splitMode === 'prime' ? 'none' : 'prime')}
                          style={{ background: splitMode === 'prime' ? 'var(--green)' : 'var(--navy)', color: '#fff', border: 'none', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                          <span><strong>Eastern & Western</strong> (Meridian Split)</span>
                          {splitMode === 'prime' && <CheckCircle2 size={20} />}
                        </button>
                        {splitMode === 'prime' && (
                          <div style={{ padding: '0 12px', fontSize: '14px', color: 'var(--text)', lineHeight: 1.5 }}>
                            The Prime Meridian divides the Earth vertically. To the right is the <strong>Eastern Hemisphere</strong> and to the left is the <strong>Western Hemisphere</strong>.
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* BOOK PAGE 7 (UJJAYINI MERIDIAN) */}
                {currentStep === 9 && (
                  <motion.div key="book9" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="coords-task-container">
                    <div className="coords-hero">
                      <h3>The Ancient Prime Meridian</h3>
                      <p>The Greenwich Meridian is not the first prime meridian. Long before Europe, Indian astronomers had their own reference line for timekeeping and space!</p>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                        <button 
                          onClick={() => setShowAncient(!showAncient)}
                          style={{ background: showAncient ? 'var(--blue)' : 'var(--navy)', color: '#fff', border: 'none', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                          <span><strong>Travel Back 1,500 Years</strong></span>
                          {showAncient && <CheckCircle2 size={20} />}
                        </button>
                        {showAncient && (
                          <div style={{ padding: '0 12px', fontSize: '14px', color: 'var(--text)', lineHeight: 1.5 }}>
                            The <strong>Madhya Rekha</strong> (middle line) passed through <strong>Ujjayini</strong> (modern Ujjain) at 75.8°E. Famous astronomers like Varahamihira worked here! Ancient cities like Kurukshetra and Kanyakumari lie very close to this sacred meridian.
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TASK 4: FRAME INDIA */}
                {currentStep === 10 && (
                  <motion.div key="task4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="coords-task-container">
                    <div className="coords-hero" style={{ padding: 'clamp(12px, 1.5vw, 20px)' }}>
                      <h3>Frame the Nation</h3>
                      <p>Adjust the sliders to perfectly box in India's latitudes (8°N to 37°N) and longitudes (68°E to 97°E).</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>
                          <span>North Extent: {extN}°N</span>
                          {extN === 37 && <CheckCircle2 size={16} color="#22c55e" />}
                        </div>
                        <input type="range" min="30" max="45" value={extN} onChange={e => setExtN(Number(e.target.value))} style={{ width: '100%', accentColor: extN === 37 ? '#22c55e' : '#ef4444' }} />
                      </div>
                      
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>
                          <span>South Extent: {extS}°N</span>
                          {extS === 8 && <CheckCircle2 size={16} color="#22c55e" />}
                        </div>
                        <input type="range" min="0" max="15" value={extS} onChange={e => setExtS(Number(e.target.value))} style={{ width: '100%', accentColor: extS === 8 ? '#22c55e' : '#ef4444' }} />
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>
                          <span>West Extent: {extW}°E</span>
                          {extW === 68 && <CheckCircle2 size={16} color="#22c55e" />}
                        </div>
                        <input type="range" min="60" max="75" value={extW} onChange={e => setExtW(Number(e.target.value))} style={{ width: '100%', accentColor: extW === 68 ? '#22c55e' : '#3b82f6' }} />
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>
                          <span>East Extent: {extE}°E</span>
                          {extE === 97 && <CheckCircle2 size={16} color="#22c55e" />}
                        </div>
                        <input type="range" min="90" max="105" value={extE} onChange={e => setExtE(Number(e.target.value))} style={{ width: '100%', accentColor: extE === 97 ? '#22c55e' : '#3b82f6' }} />
                      </div>
                    </div>

                    {extN === 37 && extS === 8 && extW === 68 && extE === 97 && (
                      <div style={{ background: '#ecfdf5', border: '2px solid #a7f3d0', padding: '16px', borderRadius: '12px', textAlign: 'center', marginTop: '16px' }}>
                        <h4 style={{ color: 'var(--green)', margin: '0 0 8px 0' }}>Perfect Grid!</h4>
                        <p style={{ color: '#065f46', margin: 0, fontSize: '14px' }}>You successfully boxed India's exact global coordinates.</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ============ BOTTOM NAVIGATION (RESERVED SPACE) ============ */}
        <div className="coords-rfoot">
          <div className="coords-pageind" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Map size={20} color="var(--mut)" />
            {currentStep < 5 ? `Page ${currentStep + 1} of 8` : currentStep >= 8 ? `Page ${currentStep - 2} of 8` : `Step ${currentStep - 4} of 3`}
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            {currentStep > 0 && (
              <button className="coords-next" onClick={() => setCurrentStep(t => t - 1)} style={{ background: 'transparent', color: 'var(--navy)', border: '1px solid var(--cardline)' }}>
                <ArrowLeft size={18} /> Previous
              </button>
            )}

            {currentStep < 4 ? (
              <button className="coords-next" onClick={() => setCurrentStep(t => t + 1)}>
                Next Page <ArrowRight size={18} />
              </button>
            ) : currentStep === 4 ? (
              <button className="coords-next" onClick={() => setCurrentStep(5)} style={{ background: 'var(--green)' }}>
                Now let's practice! <ArrowRight size={18} />
              </button>
            ) : currentStep < 7 ? (
              <button className="coords-next" onClick={() => setCurrentStep(t => t + 1)}>
                Next Concept <ArrowRight size={18} />
              </button>
            ) : currentStep === 7 ? (
              <button 
                className="coords-next" 
                disabled={!quizCompleted}
                onClick={() => setCurrentStep(8)}
                style={{ opacity: quizCompleted ? 1 : 0.5 }}
              >
                Next Topic <ArrowRight size={18} />
              </button>
            ) : currentStep < 10 ? (
              <button className="coords-next" onClick={() => setCurrentStep(t => t + 1)}>
                Next Topic <ArrowRight size={18} />
              </button>
            ) : (
              <button 
                className="coords-next" 
                onClick={onNextActivity}
                disabled={!(extN === 37 && extS === 8 && extW === 68 && extE === 97)} 
                style={{ opacity: (extN === 37 && extS === 8 && extW === 68 && extE === 97) ? 1 : 0.5, background: 'var(--green)' }}
              >
                Complete Chapter <CheckCircle2 size={18} />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Fullscreen Overlay */}
      <AnimatePresence>
        {isFullScreen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#08213a', display: 'flex', flexDirection: 'column' }}
          >
            <button 
              onClick={() => setIsFullScreen(false)}
              style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', zIndex: 10, transition: 'background 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              <X size={28} />
            </button>
            <div style={{ flex: 1, position: 'relative' }}>
              {renderVisual()}
            </div>
            
            {/* Show controls in fullscreen if we are in a task step */}
            {(currentStep === 5 || currentStep === 6 || currentStep === 7) && (
              <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(12px)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', width: '90%', maxWidth: '500px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '16px', color: '#fff' }}>
                {currentStep === 5 && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' }}>
                      <span>Latitude: {latVal}°</span>
                      <span style={{ color: '#a7f3d0' }}>{getHemi(latVal, true)}</span>
                    </div>
                    <input type="range" style={{ width: '100%', accentColor: 'var(--blue)', height: '10px' }} min="-90" max="90" value={latVal} onChange={e => setLatVal(Number(e.target.value))} />
                  </>
                )}
                {currentStep === 6 && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' }}>
                      <span>Longitude: {lonVal}°</span>
                      <span style={{ color: '#c4b5fd' }}>{getHemi(lonVal, false)}</span>
                    </div>
                    <input type="range" style={{ width: '100%', accentColor: 'var(--blue)', height: '10px' }} min="-180" max="180" value={lonVal} onChange={e => setLonVal(Number(e.target.value))} />
                  </>
                )}
                {currentStep === 7 && (
                  <>
                    <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '18px', color: '#93c5fd', marginBottom: '8px' }}>Target: {currentCity.name} ({Math.abs(currentCity.lat)}°{currentCity.lat >= 0 ? 'N' : 'S'}, {Math.abs(currentCity.lon)}°{currentCity.lon >= 0 ? 'E' : 'W'})</div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>Latitude: {gridLat}°</label>
                        <input type="range" style={{ width: '100%', accentColor: '#ef4444', height: '10px' }} min="-90" max="90" value={gridLat} onChange={e => setGridLat(Number(e.target.value))} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>Longitude: {gridLon}°</label>
                        <input type="range" style={{ width: '100%', accentColor: '#fbbf24', height: '10px' }} min="-180" max="180" value={gridLon} onChange={e => setGridLon(Number(e.target.value))} />
                      </div>
                    </div>
                  </>
                )}
                {currentStep === 8 && (
                  <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(12px)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', width: '90%', maxWidth: '500px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '12px', color: '#fff' }}>
                    <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '18px', color: '#93c5fd', marginBottom: '8px' }}>Hemispheres</div>
                    <button 
                      onClick={() => setSplitMode(splitMode === 'equator' ? 'none' : 'equator')}
                      style={{ background: splitMode === 'equator' ? 'var(--blue)' : 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <span>Northern & Southern Split</span>
                      {splitMode === 'equator' && <CheckCircle2 size={20} />}
                    </button>
                    <button 
                      onClick={() => setSplitMode(splitMode === 'prime' ? 'none' : 'prime')}
                      style={{ background: splitMode === 'prime' ? 'var(--green)' : 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <span>Eastern & Western Split</span>
                      {splitMode === 'prime' && <CheckCircle2 size={20} />}
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* QUIZ FEEDBACK MODAL */}
      <AnimatePresence>
        {quizFeedback && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              style={{ background: '#fff', padding: '32px', borderRadius: '16px', maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
            >
              {quizFeedback.type === 'success' ? (
                <div style={{ background: '#dcfce7', width: '64px', height: '64px', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle2 size={32} color="#16a34a" />
                </div>
              ) : (
                <div style={{ background: '#fee2e2', width: '64px', height: '64px', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <X size={32} color="#dc2626" />
                </div>
              )}
              <h3 style={{ margin: '0 0 12px 0', color: '#0f172a', fontSize: '24px', fontFamily: 'var(--serif)' }}>{quizFeedback.title}</h3>
              <p style={{ margin: '0 0 24px 0', color: '#475569', fontSize: '16px', lineHeight: 1.5 }}>{quizFeedback.message}</p>
              <button 
                onClick={() => setQuizFeedback(null)}
                style={{ width: '100%', padding: '12px', background: quizFeedback.type === 'success' ? '#16a34a' : '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {quizFeedback.type === 'success' ? 'Continue' : 'Try Again'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
