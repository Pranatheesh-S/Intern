import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, useTexture, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Play, Pause, ArrowLeft, CheckCircle2 } from 'lucide-react';
import './CoordinatesPageBook.css';
import './CoordinatesPageDark.css';
import worldMapUrl from './world-map.jpg';

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
  {
    stepNum: 3,
    title: "Meridians — Lines of Longitude",
    paragraphs: [
      <span key="1">The blue lines running from the <strong>North Pole to the South Pole</strong> are <strong>meridians</strong> — the lines of longitude.</span>,
      <span key="2">To measure longitude we pick one meridian as the <strong>starting line</strong>, called a <strong>prime meridian</strong> (0°). Every other place is measured east or west from it.</span>
    ],
    keyIdea: <span key="ki">A <strong>prime meridian</strong> is the chosen <strong>0°</strong> line from which longitude is measured.</span>
  },
  {
    stepNum: 4,
    title: "India's Own Prime Meridian",
    paragraphs: [
      <span key="1">Long before Greenwich, <strong>India had a prime meridian of its own</strong> — the <em>madhya rekhā</em> ("middle line"), shown here in <strong>orange</strong> at about <strong>75.8°E</strong>.</span>,
      <span key="2">It passed through <strong>Ujjayinī</strong> (today <strong>Ujjain</strong>), a great centre of astronomy. The astronomer <strong>Varāhamihira</strong> worked there around <strong>1,500 years ago</strong>.</span>
    ],
    keyIdea: <span key="ki">India's ancient prime meridian ran through <strong>Ujjayinī (Ujjain)</strong>, ~75.8°E.</span>
  },
  {
    stepNum: 5,
    title: "Cities on the Ujjayinī Meridian",
    paragraphs: [
      <span key="1">Several ancient cities lie on or near this meridian — <strong>Kurukṣetra, Rohtak, Ujjain, Maheshwar</strong> and <strong>Kanyakumari</strong>.</span>,
      <span key="2"><strong>Gold circles</strong> mark cities named in old astronomical texts (modern name after the slash); <strong>squares</strong> are familiar modern cities. Some sit a little off the line, because measuring longitude needed very accurate clocks.</span>
    ],
    keyIdea: <span key="ki">Old texts placed cities like <strong>Ujjain</strong> and <strong>Kanyakumari</strong> on the Ujjayinī meridian.</span>
  },
  {
    stepNum: 6,
    title: "Compare with Greenwich",
    paragraphs: [
      <span key="1">Today the world measures longitude from the <strong>Greenwich Meridian</strong> (0°), agreed as the international standard in <strong>1884</strong>. It is shown here in blue.</span>,
      <span key="2">Both the orange Ujjayinī line and the blue Greenwich line are <strong>prime meridians</strong> — chosen 0° references. India simply chose its own, many centuries earlier.</span>
    ],
    keyIdea: <span key="ki">A prime meridian is a <strong>chosen</strong> reference line — Greenwich (0°) is just the modern one.</span>
  }
];

const TimeZonesGlobe = ({ step }) => {
  const colorMap = useTexture(worldMapUrl);
  const groupRef = useRef();
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      if (step === 1) {
        groupRef.current.rotation.y -= delta * 0.2;
      } else if (step === 2 || step === 3) {
         groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, -45 * (Math.PI / 180), 0.05);
      } else if (step >= 4) {
         groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, -75.8 * (Math.PI / 180), 0.05);
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight position={[15, 0, 0]} intensity={2.5} color="#FDB813" />
      
      <group position={[12, 0, 0]}>
        <mesh><sphereGeometry args={[2, 32, 32]} /><meshBasicMaterial color="#fcd34d" /></mesh>
        <mesh><sphereGeometry args={[2.5, 32, 32]} /><meshBasicMaterial color="#fbbf24" transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
        <mesh><sphereGeometry args={[3.5, 32, 32]} /><meshBasicMaterial color="#ea580c" transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
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

        {step >= 4 && (
          <group>
            <Line 
              points={Array.from({length: 37}).map((_,i) => getLatLonPoint(90 - i*5, 75.8, 2.21))}
              color="#ea580c"
              lineWidth={3}
              dashed
            />
            {step === 4 && (
              <Html position={getLatLonPoint(35, 75.8, 2.25)} center zIndexRange={[100,0]}>
                <div style={{ background: '#9a3412', color: '#fff', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Ujjayinī Meridian • 75.8°E</div>
              </Html>
            )}
            
            {step === 5 && (
              <group>
                <Html position={getLatLonPoint(40, 75.8, 2.25)} center zIndexRange={[100,0]}>
                  <div style={{ background: '#9a3412', color: '#fff', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Ujjayinī Meridian • 75.8°E</div>
                </Html>
                
                {[
                  { lat: 29.97, lon: 76.88, name: "Kurukṣetra", old: true },
                  { lat: 28.90, lon: 76.58, name: "Rohtak", old: true },
                  { lat: 23.18, lon: 75.77, name: "Ujjayinī / Ujjain", old: true },
                  { lat: 22.18, lon: 75.58, name: "Mahiṣmatī / Maheshwar", old: true },
                  { lat: 8.08, lon: 77.55, name: "Kumārī / Kanyakumari", old: true },
                  { lat: 28.6, lon: 77.2, name: "Delhi", old: false },
                  { lat: 19.0, lon: 72.8, name: "Mumbai", old: false },
                  { lat: 12.9, lon: 77.5, name: "Bengaluru", old: false },
                  { lat: 22.5, lon: 88.3, name: "Kolkata", old: false }
                ].map((city, i) => (
                  <group key={i}>
                    <mesh position={getLatLonPoint(city.lat, city.lon, 2.22)}>
                      {city.old ? <sphereGeometry args={[0.03, 16, 16]} /> : <boxGeometry args={[0.04, 0.04, 0.04]} />}
                      <meshBasicMaterial color={city.old ? "#fbbf24" : "#e2e8f0"} />
                    </mesh>
                    <Html position={getLatLonPoint(city.lat, city.lon, 2.22)} center zIndexRange={[100,0]}>
                      <div style={{ color: city.old ? '#fbbf24' : '#e2e8f0', fontSize: '10px', fontWeight: 'bold', textShadow: '0 1px 3px rgba(0,0,0,0.8)', marginLeft: '14px', whiteSpace: 'nowrap' }}>{city.name}</div>
                    </Html>
                  </group>
                ))}
              </group>
            )}
            
            {step === 6 && (
              <group>
                <Line 
                  points={Array.from({length: 37}).map((_,i) => getLatLonPoint(90 - i*5, 0, 2.21))}
                  color="#3b82f6"
                  lineWidth={3}
                />
                <Html position={getLatLonPoint(35, 0, 2.25)} center zIndexRange={[100,0]}>
                  <div style={{ background: '#1e3a8a', color: '#fff', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Greenwich Meridian • 0°</div>
                </Html>
                <Html position={getLatLonPoint(30, 75.8, 2.25)} center zIndexRange={[100,0]}>
                  <div style={{ background: '#9a3412', color: '#fff', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Ujjayinī Meridian • 75.8°E</div>
                </Html>
              </group>
            )}
          </group>
        )}
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
        </group>
      )}
    </>
  );
};


const GlobeContent = ({ istMins, porbMins, tinMins, showDayNight, showGrid, format12, format24 }) => {
  const colorMap = useTexture(worldMapUrl);
  const groupRef = useRef();
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = -82.5 * (Math.PI / 180);
    }
  });

  const sunAngle = (istMins / 60 - 12) * 15 * (Math.PI / 180);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10 * Math.sin(sunAngle), 0, 10 * Math.cos(sunAngle)]} 
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
             <div style={{ marginTop: '6px', fontSize: '14px', fontWeight: 'bold', color: '#fef08a' }}>☀️ {format12(porbMins)}</div>
             <div style={{ background: '#334155', padding: '2px 6px', borderRadius: '8px', fontSize: '9px', marginTop: '4px', fontWeight: 'bold' }}>🕒 IST {format24(istMins)}</div>
          </div>
          {istMins === 17*60 + 42 && (
            <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translate(-50%, -10px)', background: '#fef3c7', color: '#92400E', padding: '10px', borderRadius: '12px 12px 0 12px', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'pre-wrap', width: '160px', textAlign: 'center', border: '1px solid #fde68a', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
              "My watch also says 17:42 — yet the Sun here shows only 4:50 p.m.."
            </div>
          )}
        </Html>

        <Html position={getLatLonPoint(27.5, 95.3, 2.25)} center zIndexRange={[100,0]}>
          <div style={{ background: '#1e293b', color: '#fff', padding: '8px 12px', borderRadius: '12px', fontSize: '11px', border: '1px solid #475569', display: 'flex', flexDirection: 'column', alignItems: 'center', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
             <div style={{ fontWeight: 'bold' }}>Tinsukia</div>
             <div style={{ color: '#94a3b8', fontSize: '9px' }}>Assam • east</div>
             <div style={{ marginTop: '6px', fontSize: '14px', fontWeight: 'bold', color: '#93c5fd' }}>🌙 {format12(tinMins)}</div>
             <div style={{ background: '#334155', padding: '2px 6px', borderRadius: '8px', fontSize: '9px', marginTop: '4px', fontWeight: 'bold' }}>🕒 IST {format24(istMins)}</div>
          </div>
          {istMins === 17*60 + 42 && (
            <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translate(-50%, -10px)', background: '#1e3a8a', color: '#bfdbfe', padding: '10px', borderRadius: '12px 12px 12px 0', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'pre-wrap', width: '160px', textAlign: 'center', border: '1px solid #3b82f6', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
              "My watch says 17:42 — but by the Sun it's already 6:33 p.m.!"
            </div>
          )}
        </Html>
      </group>

      {showDayNight && (
         <mesh rotation-y={sunAngle + Math.PI/2}>
           <sphereGeometry args={[2.23, 64, 64, 0, Math.PI]} />
           <meshBasicMaterial color="#000" transparent opacity={0.65} depthWrite={false} />
         </mesh>
      )}
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
      
      <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', zIndex: 10 }}>
         <div style={{ background: '#1e293b', border: '1px solid #334155', padding: '8px 16px', borderRadius: '100px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
           ☀️ <div><strong>Local (Sun) time</strong><div style={{ color: '#94a3b8', fontSize: '10px' }}>follows the Sun — different at each place</div></div>
         </div>
         <div style={{ background: '#1e293b', border: '1px solid #334155', padding: '8px 16px', borderRadius: '100px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
           🕒 <div><strong>Standard time: IST {format24(istMins)}</strong><div style={{ color: '#94a3b8', fontSize: '10px' }}>one shared clock (GMT +5:30, from 82½°E)</div></div>
         </div>
      </div>

      <div style={{ position: 'absolute', top: 20, right: 30, zIndex: 10 }}>
         <button className="dark-nav-btn next" onClick={onNextActivity} style={{ background: 'var(--green)', padding: '12px 24px' }}>
            Finish <CheckCircle2 size={16} />
         </button>
      </div>

      <div style={{ position: 'absolute', inset: 0 }}>
        <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
           <GlobeContent istMins={istMins} porbMins={porbMins} tinMins={tinMins} showDayNight={showDayNight} showGrid={showGrid} format12={format12} format24={format24} />
           <OrbitControls enableZoom={true} enablePan={false} />
        </Canvas>
      </div>

      <div style={{ position: 'absolute', bottom: 30, left: 30, width: '260px', background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', padding: '20px', borderRadius: '16px', border: '1px solid #334155', zIndex: 10 }}>
         <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', letterSpacing: '1px', marginBottom: '12px' }}>CONTROLS</div>
         
         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>
               <button onClick={() => setPlaying(!playing)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                 {playing ? <Pause size={16} /> : <Play size={16} />}
               </button>
               Move the Sun
            </div>
            <input type="range" min="0" max="1440" value={timeMins} onChange={e => { setTimeMins(Number(e.target.value)); setPlaying(false); }} style={{ width: '80px', accentColor: '#3b82f6', cursor: 'pointer' }} />
         </div>

         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>
            <span>Day / night line</span>
            <input type="checkbox" checked={showDayNight} onChange={e => setShowDayNight(e.target.checked)} style={{ accentColor: '#10b981', width: '16px', height: '16px', cursor: 'pointer' }} />
         </div>
         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>
            <span>Grid & meridians</span>
            <input type="checkbox" checked={showGrid} onChange={e => setShowGrid(e.target.checked)} style={{ accentColor: '#10b981', width: '16px', height: '16px', cursor: 'pointer' }} />
         </div>
      </div>

      <div style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '16px', zIndex: 10 }}>
         <div style={{ background: '#1e293b', border: '1px solid #334155', padding: '16px', borderRadius: '12px', textAlign: 'center', width: '160px' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>Porbandar • Sun time</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fef08a', margin: '4px 0' }}>{format24(porbMins)}</div>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>≈ 52 min behind IST</div>
         </div>
         <div style={{ color: '#64748b', fontSize: '14px', fontWeight: 'bold' }}>VS</div>
         <div style={{ background: '#78350f', border: '1px solid #d97706', padding: '16px', borderRadius: '12px', textAlign: 'center', width: '180px' }}>
            <div style={{ fontSize: '11px', color: '#fde68a', fontWeight: 'bold' }}>🕒 IST • standard (82½°E)</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff', margin: '4px 0' }}>{format24(istMins)}</div>
            <div style={{ fontSize: '10px', color: '#fde68a' }}>the one shared clock</div>
         </div>
         <div style={{ color: '#64748b', fontSize: '14px', fontWeight: 'bold' }}>VS</div>
         <div style={{ background: '#1e293b', border: '1px solid #334155', padding: '16px', borderRadius: '12px', textAlign: 'center', width: '160px' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>Tinsukia • Sun time</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#93c5fd', margin: '4px 0' }}>{format24(tinMins)}</div>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>≈ 51 min ahead of IST</div>
         </div>
      </div>
      
      <button 
         className="dark-nav-btn" 
         onClick={onBack}
         style={{ position: 'absolute', bottom: 30, right: 30, background: 'rgba(255,255,255,0.1)', zIndex: 10 }}
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
              <div className="coords-illus" style={{ background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', border: '1px solid #cbd5e1', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)' }}>
                <svg width="240" height="240" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5">
                   <circle cx="12" cy="12" r="10"></circle>
                   <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <div style={{ marginTop: '20px', fontWeight: '800', color: '#1e293b', fontSize: '15px' }}>Local & Standard Time</div>
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
              Page 1 of 8
            </div>
            <button className="coords-next" onClick={handleNext} style={{ fontSize: '16px', padding: '12px 26px' }}>
              Next Page &rarr;
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStepIdx === 7) {
    return <LocalTimeExplorer onNextActivity={onNextActivity} onBack={handlePrev} />;
  }

  const activeStepIdx = currentStepIdx - 1;
  const step = darkStepsData[activeStepIdx];

  return (
    <div className="dark-coords-page">
      <div className="dark-coords-main-content">
        <div className="dark-coords-left">
          <div className="dark-top-title">Time Around the World — Why Clocks Differ</div>
          
          <div className="dark-globe-container">
            <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
              <TimeZonesGlobe step={step.stepNum} />
              <OrbitControls enableZoom={true} enablePan={false} />
            </Canvas>
          </div>

          <div className="dark-bottom-nav">
            <button className="dark-nav-btn" onClick={handlePrev}>
              <ArrowLeft size={16} /> Back
            </button>
            <div className="dark-nav-dots">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className={`dark-nav-dot ${i === activeStepIdx ? 'active' : ''}`} />
              ))}
            </div>
            <button className="dark-nav-btn next" onClick={handleNext}>
              Next <Play size={16} fill="currentColor" style={{ marginLeft: '4px' }} />
            </button>
          </div>
        </div>

        <div className="dark-coords-right">
          <div className="dark-step-eyebrow">STEP {activeStepIdx + 1} OF 7</div>
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
