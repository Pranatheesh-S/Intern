import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, useTexture, Line, Html, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Play, Pause, ArrowLeft, CheckCircle2 } from 'lucide-react';
import './CoordinatesPageBook.css';
import './CoordinatesPageDark.css';
import worldMapUrl from './world-map.jpg';
import sunMapUrl from './sun-map.jpg';
import flareMapUrl from './lens-flare.jpg';
import TwoFriendsActivity from './TwoFriendsActivity';

const getLatLonPoint = (lat, lon, r) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 90) * (Math.PI / 180);
  return new THREE.Vector3(
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.cos(theta)
  );
};

const darkStepsData = [
  {
    stepNum: 1,
    title: "The Sun and the Spinning Earth",
    paragraphs: [
      <span key="1">The <strong>Sun</strong> stays fixed on the left, while the <strong>Earth spins</strong> on its axis (once in about 24 hours).</span>,
      <span key="2">The half of the Earth facing the Sun has <strong>daytime</strong>; the half turned away is in <strong>night</strong>. Watch a continent move from night into day as the globe turns.</span>
    ],
    keyIdea: <span key="ki">Day and night happen because the Earth spins under a fixed Sun.</span>
  },
  {
    stepNum: 2,
    title: "Why Clocks Differ",
    paragraphs: [
      <span key="1">It is <strong>noon</strong> for a place when the Sun is straight overhead. As the Earth turns, different places face the Sun at different moments — so their <strong>local time</strong> is different.</span>,
      <span key="2">The Earth turns <strong>360° in 24 hours</strong>, which is <strong>15° every hour</strong>. So two places 15° apart in longitude have clocks one hour apart.</span>
    ],
    keyIdea: <span key="ki">The Earth turns <strong>15° of longitude = 1 hour</strong> of time.</span>
  },
];

const TimeZonesGlobe = ({ step }) => {
  const colorMap = useTexture(worldMapUrl);
  const sunMap = useTexture(sunMapUrl);
  const flareMap = useTexture(flareMapUrl);
  const groupRef = useRef();
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      if (step === 1) {
        groupRef.current.rotation.y += delta * 0.2;
      } else if (step === 2) {
         groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 45 * (Math.PI / 180), 0.05);
      }
    }
  });

  return (
    <>
      <color attach="background" args={['#000000']} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[15, 0, 0]} intensity={2.5} color="#FDB813" />
      
      <group position={[12, 0, 0]}>
        <mesh rotation={[0, -Math.PI / 2, 0]}>
          <sphereGeometry args={[2, 32, 32]} />
          <meshBasicMaterial map={sunMap} color="#fef08a" />
        </mesh>
        {/* Cinematic Optical Lens Flare (Stable in World Space) */}
        <group position={[0, 0, 0]}>
          <mesh scale={[24, 24, 1]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial map={flareMap} transparent opacity={1} blending={THREE.AdditiveBlending} depthWrite={false} depthTest={false} side={THREE.DoubleSide} />
          </mesh>
          <mesh scale={[24, 24, 1]} rotation={[Math.PI/2, 0, 0]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial map={flareMap} transparent opacity={1} blending={THREE.AdditiveBlending} depthWrite={false} depthTest={false} side={THREE.DoubleSide} />
          </mesh>
        </group>
      </group>

      <group ref={groupRef}>
        <Sphere args={[2.2, 64, 64]}>
          <meshStandardMaterial map={colorMap} roughness={0.8} />
        </Sphere>
        
        {step >= 3 && Array.from({length: 24}).map((_, i) => {
          let lon = i * 15;
          const points = [];
          for (let lat = 90; lat >= -90; lat -= 5) {
            points.push(getLatLonPoint(lat, lon, 2.205));
          }
          return <Line key={i} points={points} color="rgba(255,255,255,0.15)" lineWidth={1} transparent />;
        })}
      </group>

      {(step === 1 || step === 2) && (
        <group>
          <Line 
             points={Array.from({length: 61}).map((_,i) => {
                const angle = (i/60) * Math.PI * 2;
                return [0, 2.23 * Math.cos(angle), 2.23 * Math.sin(angle)];
             })}
             color="#cbd5e1"
             lineWidth={1}
             transparent opacity={0.3}
          />
          {step === 2 && (
            <>
              <Html position={[0, 2.4, 0]} center zIndexRange={[100,0]}>
                 <div style={{ color: '#cbd5e1', fontSize: '11px', whiteSpace: 'nowrap', fontWeight: 'bold' }}>🌓 day - night line</div>
              </Html>
              <Html position={[2.4, 1.2, 0]} center zIndexRange={[100,0]}>
                 <div style={{ color: '#fef08a', fontSize: '12px', whiteSpace: 'nowrap', fontWeight: 'bold' }}>☀️ 12:00 NOON</div>
              </Html>
              <Html position={[-2.4, 0.8, 0]} center zIndexRange={[100,0]}>
                 <div style={{ color: '#93c5fd', fontSize: '12px', whiteSpace: 'nowrap', fontWeight: 'bold' }}>🌙 MIDNIGHT</div>
              </Html>
              <Html position={[4, 1.5, 0]} center zIndexRange={[100,0]}>
                 <div style={{ color: '#fbbf24', fontSize: '11px', whiteSpace: 'nowrap', fontWeight: 'bold' }}>☀️ sun rays</div>
              </Html>
            </>
          )}
        </group>
      )}
    </>
  );
};


const GlobeContent = ({ istMins, porbMins, tinMins, showDayNight, showGrid, format12, format24 }) => {
  const colorMap = useTexture(worldMapUrl);
  const sunMap = useTexture(sunMapUrl);
  const flareMap = useTexture(flareMapUrl);
  const groupRef = useRef();
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = -172.5 * (Math.PI / 180);
    }
  });

  const sunAngle = (istMins / 60 - 12) * 15 * (Math.PI / 180);

  const isDaytime = (mins) => {
    let m = Math.round(mins);
    while (m < 0) m += 1440;
    m = m % 1440;
    return m >= 360 && m <= 1080; // 6:00 AM to 6:00 PM
  };

  const porbDay = isDaytime(porbMins);
  const tinDay = isDaytime(tinMins);

  return (
    <>
      <color attach="background" args={['#000000']} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.15} />
      <directionalLight 
        position={[-10 * Math.sin(sunAngle), 0, 10 * Math.cos(sunAngle)]} 
        intensity={2.5} 
      />

      <group ref={groupRef}>
        <Sphere args={[2.2, 64, 64]}>
          <meshStandardMaterial map={colorMap} roughness={0.8} />
        </Sphere>
        
        {showGrid && Array.from({length: 24}).map((_, i) => (
          <Line key={i} points={Array.from({length: 37}).map((_,j) => getLatLonPoint(90-j*5, i*15, 2.205))} color="rgba(255,255,255,0.1)" lineWidth={1} transparent />
        ))}
        {showGrid && Array.from({length: 17}).map((_, i) => {
          const lat = 80 - i*10;
          const pts = [];
          for (let lon=0; lon<=360; lon+=5) pts.push(getLatLonPoint(lat, lon, 2.205));
          return <Line key={`lat${i}`} points={pts} color="rgba(255,255,255,0.1)" lineWidth={1} transparent />
        })}

        <Line points={Array.from({length:37}).map((_,i)=>getLatLonPoint(90-i*5, 82.5, 2.21))} color="#10b981" lineWidth={3} />
        <Line points={Array.from({length:37}).map((_,i)=>getLatLonPoint(90-i*5, 69.6, 2.21))} color="#d97706" lineWidth={2} transparent opacity={0.5} />
        <Line points={Array.from({length:37}).map((_,i)=>getLatLonPoint(90-i*5, 95.3, 2.21))} color="#d97706" lineWidth={2} transparent opacity={0.5} />

        <Html position={getLatLonPoint(21.6, 69.6, 2.25)} center zIndexRange={[100,0]}>
          <div style={{ background: '#1e293b', color: '#fff', padding: '8px 12px', borderRadius: '12px', fontSize: '11px', border: '1px solid #475569', display: 'flex', flexDirection: 'column', alignItems: 'center', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
             <div style={{ fontWeight: 'bold' }}>Porbandar</div>
             <div style={{ color: '#94a3b8', fontSize: '9px' }}>Gujarat • west</div>
             <div style={{ marginTop: '6px', fontSize: '14px', fontWeight: 'bold', color: porbDay ? '#fef08a' : '#93c5fd' }}>{porbDay ? '☀️' : '🌙'} {format12(porbMins)}</div>
             <div style={{ background: '#334155', padding: '2px 6px', borderRadius: '8px', fontSize: '9px', marginTop: '4px', fontWeight: 'bold' }}>🕒 IST {format24(istMins)}</div>
          </div>

        </Html>

        <Html position={getLatLonPoint(27.5, 95.3, 2.25)} center zIndexRange={[100,0]}>
          <div style={{ background: '#1e293b', color: '#fff', padding: '8px 12px', borderRadius: '12px', fontSize: '11px', border: '1px solid #475569', display: 'flex', flexDirection: 'column', alignItems: 'center', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
             <div style={{ fontWeight: 'bold' }}>Tinsukia</div>
             <div style={{ color: '#94a3b8', fontSize: '9px' }}>Assam • east</div>
             <div style={{ marginTop: '6px', fontSize: '14px', fontWeight: 'bold', color: tinDay ? '#fef08a' : '#93c5fd' }}>{tinDay ? '☀️' : '🌙'} {format12(tinMins)}</div>
             <div style={{ background: '#334155', padding: '2px 6px', borderRadius: '8px', fontSize: '9px', marginTop: '4px', fontWeight: 'bold' }}>🕒 IST {format24(istMins)}</div>
          </div>

        </Html>
      </group>

    </>
  );
};

const LocalTimeExplorer = ({ onNextActivity, onBack }) => {
  const [timeMins, setTimeMins] = useState(17 * 60 + 42);
  const [showDayNight, setShowDayNight] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [playing, setPlaying] = useState(false);
  
  const istMins = timeMins;
  const porbMins = timeMins - 52;
  const tinMins = timeMins + 51;

  const format24 = (m) => {
    let mt = Math.round(m);
    while(mt < 0) mt += 24*60;
    while(mt >= 24*60) mt -= 24*60;
    const hr = Math.floor(mt / 60);
    const mn = mt % 60;
    return `${hr.toString().padStart(2,'0')}:${mn.toString().padStart(2,'0')}`;
  };

  const format12 = (m) => {
    let mt = Math.round(m);
    while(mt < 0) mt += 24*60;
    while(mt >= 24*60) mt -= 24*60;
    const hr = Math.floor(mt / 60);
    const mn = mt % 60;
    const ap = hr < 12 ? 'a.m.' : 'p.m.';
    let h = hr % 12;
    if (h === 0) h = 12;
    return `${h}:${mn.toString().padStart(2,'0')} ${ap}`;
  };
  
  useEffect(() => {
    let interval;
    if (playing) {
      interval = setInterval(() => setTimeMins(t => t + 5), 50);
    }
    return () => clearInterval(interval);
  }, [playing]);

  return (
    <div className="dark-coords-page" style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: 20, left: 30, zIndex: 10 }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>Local Time vs Standard Time</h2>
        <div style={{ fontSize: '12px', color: '#94a3b8' }}>The same two friends — Porbandar (Gujarat) & Tinsukia (Assam)</div>
      </div>
      


      <div style={{ position: 'absolute', bottom: 30, right: 30, zIndex: 10 }}>
         <button className="dark-nav-btn next" onClick={onNextActivity} style={{ padding: '12px 24px' }}>
            Next <Play size={16} fill="currentColor" style={{ marginLeft: '4px' }} />
         </button>
      </div>

      <div style={{ position: 'absolute', inset: 0 }}>
        <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
           <GlobeContent istMins={istMins} porbMins={porbMins} tinMins={tinMins} showDayNight={showDayNight} showGrid={showGrid} format12={format12} format24={format24} />
           <OrbitControls enableZoom={true} enablePan={false} />
        </Canvas>
      </div>

      <div style={{ position: 'absolute', top: 20, right: 30, width: '260px', background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', padding: '20px', borderRadius: '16px', border: '1px solid #334155', zIndex: 10 }}>
         <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', letterSpacing: '1px', marginBottom: '12px' }}>CONTROLS</div>
         
         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>
               <button onClick={() => setPlaying(!playing)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                 {playing ? <Pause size={16} /> : <Play size={16} />}
               </button>
               Move the Sun
            </div>
            <input type="range" min="0" max="1440" value={timeMins} onChange={e => { setTimeMins(Number(e.target.value)); setPlaying(false); }} style={{ width: '80px', accentColor: '#3b82f6', cursor: 'pointer' }} />
         </div>
      </div>

      <div style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '16px', zIndex: 10 }}>
         <div style={{ background: '#1e293b', border: '1px solid #334155', padding: '12px', borderRadius: '12px', textAlign: 'center', width: '160px', height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>Porbandar • Sun time</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fef08a', margin: '4px 0' }}>{format24(porbMins)}</div>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>≈ 52 min behind IST</div>
         </div>
         <div style={{ color: '#64748b', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>VS</div>
         <div style={{ background: '#78350f', border: '1px solid #d97706', padding: '12px', borderRadius: '12px', textAlign: 'center', width: '160px', height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box' }}>
            <div style={{ fontSize: '11px', color: '#fde68a', fontWeight: 'bold' }}>🕒 IST (82½°E)</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', margin: '4px 0' }}>{format24(istMins)}</div>
            <div style={{ fontSize: '10px', color: '#fde68a' }}>the one shared clock</div>
         </div>
         <div style={{ color: '#64748b', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>VS</div>
         <div style={{ background: '#1e293b', border: '1px solid #334155', padding: '12px', borderRadius: '12px', textAlign: 'center', width: '160px', height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>Tinsukia • Sun time</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#93c5fd', margin: '4px 0' }}>{format24(tinMins)}</div>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>≈ 51 min ahead of IST</div>
         </div>
      </div>
      
      <button 
         className="dark-nav-btn" 
         onClick={onBack}
         style={{ position: 'absolute', bottom: 30, left: 30, background: 'rgba(255,255,255,0.1)', zIndex: 10 }}
      >
         <ArrowLeft size={16} /> Back
      </button>
    </div>
  );
};

export default function TimeZonesPage({ onNextActivity, onBack }) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0); 

  const handleNext = () => setCurrentStepIdx(c => c + 1);
  const handlePrev = () => {
    if (currentStepIdx > 0) setCurrentStepIdx(c => c - 1);
    else if (onBack) onBack();
  };

  if (currentStepIdx === 0) {
    return (
      <div className="coords-page">
        <div className="coords-book">
          <div className="coords-main-content">
            <div className="coords-left">
              <div className="coords-eyebrow">CHAPTER 1 &bull; CLASS 6 SOCIAL SCIENCE</div>
              <h1 className="coords-chtitle">Understanding<br/>Time Zones</h1>
              <div className="coords-illus" style={{ position: 'relative', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', border: '1px solid #334155', boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8)', overflow: 'hidden', padding: 0 }}>
                <img src="/time_zones_illustration.jpg" alt="Time Zones Overview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
            
            <div className="coords-right">
              <div className="coords-rhead" style={{ fontSize: '32px' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                TIME ZONES
              </div>
              <div className="coords-content">
                <div className="coords-task-container" style={{ justifyContent: 'flex-start', paddingTop: '10px' }}>
                  <div className="coords-hero" style={{ padding: '32px' }}>
                    <h3 style={{ marginBottom: '20px', fontSize: '28px' }}>Understanding Time Zones</h3>
                    <p style={{ marginBottom: '20px', fontSize: '18px', lineHeight: '1.7' }}>
                      Let’s make the globe rotate again from west to east — that is how our planet spins around its axis, making a full turn every 24 hours. A full turn is 360°, so this means 15° per hour (15 × 24 = 360).
                    </p>
                    <p style={{ marginBottom: '20px', fontSize: '18px', lineHeight: '1.7' }}>
                      Moving eastward from the Prime Meridian, we get 0°, 15°E, 30°E, 45°E, and so on every 15°. It is the same as adding one hour of <strong>local time</strong> with each 15° meridian.
                    </p>
                    <p style={{ fontSize: '18px', lineHeight: '1.7' }}>
                      But it would not be convenient for a country to use many local times! That is why most countries adopt a <strong>standard time</strong> based on a meridian passing through them.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="coords-rfoot">
            <div className="coords-pageind" style={{ fontSize: '16px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              Page 1 of 4
            </div>
            <button className="coords-next" onClick={handleNext} style={{ fontSize: '16px', padding: '12px 26px' }}>
              Next Page &rarr;
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStepIdx === 3) {
    return <LocalTimeExplorer onNextActivity={() => setCurrentStepIdx(4)} onBack={handlePrev} />;
  }

  if (currentStepIdx >= 4) {
    return <TwoFriendsActivity onNextActivity={onNextActivity} onBack={() => setCurrentStepIdx(3)} />;
  }

  const activeStepIdx = Math.min(currentStepIdx - 1, darkStepsData.length - 1);
  const step = darkStepsData[activeStepIdx];

  return (
    <div className="dark-coords-page">
      <div className="dark-coords-main-content">
        <div className="dark-coords-left">
          <div className="dark-top-title">Time Around the World — Why Clocks Differ</div>
          
          <div className="dark-globe-container">
            <Canvas camera={{ position: [1.5, 0, 7], fov: 45 }}>
              <TimeZonesGlobe step={step.stepNum} />
              <OrbitControls enableZoom={true} enablePan={false} target={[1.5, 0, 0]} />
            </Canvas>
          </div>

          <div className="dark-bottom-nav">
            <button className="dark-nav-btn" onClick={handlePrev}>
              <ArrowLeft size={16} /> Back
            </button>
            <div className="dark-nav-dots">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className={`dark-nav-dot ${i === activeStepIdx ? 'active' : ''}`} />
              ))}
            </div>
            <button className="dark-nav-btn next" onClick={handleNext}>
              Next <Play size={16} fill="currentColor" style={{ marginLeft: '4px' }} />
            </button>
          </div>
        </div>

        <div className="dark-coords-right">
          <div className="dark-step-eyebrow">STEP {activeStepIdx + 1} OF 2</div>
          <h2 className="dark-step-title">{step.title}</h2>
          
          {step.paragraphs.map((p, idx) => (
            <div key={idx} className="dark-step-text">{p}</div>
          ))}

          {step.keyIdea && (
            <div className="dark-key-idea-box">
              <div className="dark-key-idea-title">KEY IDEA</div>
              <div className="dark-key-idea-text">{step.keyIdea}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
