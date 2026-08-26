import React, { useState } from 'react';
import Globe3D from './Globe3D';
import CoordinatesMinigame from './CoordinatesMinigame';
import './CoordinatesPageBook.css';
import './CoordinatesPageDark.css';

import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Sphere, Line, Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const FadingLabel = ({ pos, color, text, textShadow = '0 2px 6px rgba(0,0,0,1)' }) => {
  const groupRef = React.useRef();
  const divRef = React.useRef();
  
  useFrame((state) => {
    if (groupRef.current && divRef.current) {
      const worldPos = new THREE.Vector3();
      groupRef.current.getWorldPosition(worldPos);
      const cameraDir = state.camera.position.clone().normalize();
      const labelNormal = worldPos.clone().normalize();
      const dot = labelNormal.dot(cameraDir);
      
      let opacity = (dot - 0.3) / 0.4;
      opacity = Math.max(0, Math.min(1, opacity));
      
      divRef.current.style.opacity = opacity;
    }
  });

  return (
    <group ref={groupRef} position={pos}>
      <Html center style={{ pointerEvents: 'none' }}>
        <div ref={divRef} style={{ color, fontSize: '14px', fontWeight: '900', textShadow: textShadow, letterSpacing: '0.5px', whiteSpace: 'nowrap', transition: 'opacity 0.1s' }}>
          {text}
        </div>
      </Html>
    </group>
  );
};

const CentralOrange = () => {
  const organicSections = React.useMemo(() => {
    const sections = [];
    const numSections = 9; 
    for (let i = 0; i < numSections; i++) {
      const angle = (i * Math.PI * 2) / numSections;
      const nextAngle = ((i + 1) * Math.PI * 2) / numSections;
      const s = new THREE.Shape();
      
      const rInner = 0.05;
      const rOuter = 0.38;
      
      s.moveTo(Math.cos(angle + 0.05) * rInner, Math.sin(angle + 0.05) * rInner);
      
      // Wavy left boundary (NO straight lines!)
      for(let k=1; k<=5; k++) {
         let r = rInner + (rOuter-rInner)*(k/5);
         let a = angle + 0.05 + Math.sin(r*25 + i)*0.03;
         s.lineTo(Math.cos(a)*r, Math.sin(a)*r);
      }
      
      // Organic outer boundary
      for (let a = angle + 0.05; a <= nextAngle - 0.05; a += 0.05) {
        const radius = 0.38 + Math.sin(a * 15) * 0.015 + Math.cos(a * 8) * 0.015 + Math.random() * 0.01;
        s.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
      }
      
      // Wavy right boundary back to center
      for(let k=4; k>=0; k--) {
         let r = rInner + (rOuter-rInner)*(k/5);
         let a = nextAngle - 0.05 + Math.sin(r*25 + i)*0.03;
         s.lineTo(Math.cos(a)*r, Math.sin(a)*r);
      }
      
      const extrudeSettings = { depth: 0.06, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 3 };
      const geo = new THREE.ExtrudeGeometry(s, extrudeSettings);
      geo.translate(0, 0, 0);
      geo.computeVertexNormals();
      
      const tint = i % 2 === 0 ? "#ff8c00" : "#ff7f00";
      sections.push(
        <mesh key={`sec_${i}`} position={[0, 0.07, 0]} rotation={[-Math.PI/2, 0, 0]} geometry={geo}>
          <meshStandardMaterial color={tint} roughness={0.6} />
        </mesh>
      );
    }
    return sections;
  }, []);

  const vesicles = React.useMemo(() => {
    const v = [];
    for(let i=0; i<100; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.1 + Math.random() * 0.35;
      v.push(
        <mesh key={`v${i}`} position={[Math.cos(a)*r, 0.125 + Math.random()*0.005, Math.sin(a)*r]} rotation={[-Math.PI/2, 0, 0]}>
          <circleGeometry args={[0.01 + Math.random()*0.015, 6]} />
          <meshBasicMaterial color="#ffa500" opacity={0.7} transparent />
        </mesh>
      );
    }
    return v;
  }, []);

  const coreGeo = React.useMemo(() => {
    const geo = new THREE.CircleGeometry(0.08, 16);
    const pos = geo.attributes.position;
    for(let i=1; i<pos.count; i++) {
      let x = pos.getX(i); let y = pos.getY(i);
      let a = Math.atan2(y, x);
      let r = Math.sqrt(x*x + y*y);
      r += Math.sin(a * 7) * 0.015;
      pos.setXYZ(i, Math.cos(a)*r, Math.sin(a)*r, 0);
    }
    return geo;
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* 3D Rind Hemisphere */}
      <mesh position={[0, 0.05, 0]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[0.45, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#b34700" roughness={0.9} />
      </mesh>
      {/* Pale inner pith */}
      <mesh position={[0, 0.07, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <circleGeometry args={[0.43, 32]} />
        <meshStandardMaterial color="#fffbeb" roughness={0.9} />
      </mesh>
      {organicSections}
      {vesicles}
      <mesh position={[0, 0.13, 0]} rotation={[-Math.PI/2, 0, 0]} geometry={coreGeo}>
        <meshStandardMaterial color="#fffbeb" roughness={1.0} />
      </mesh>
    </group>
  );
};

const CitrusDetails = () => {
  const lines = [];
  const numLines = 8;
  for (let i = 0; i < numLines; i++) {
    const points = [];
    const angleSpread = THREE.MathUtils.lerp(-0.35, 0.35, i / (numLines - 1));
    for (let j = 0; j <= 20; j++) {
      const t = j / 20;
      const x = 0.05 + t * 1.0; 
      
      const curveY = Math.sin(t * Math.PI / 2) * angleSpread + (Math.sin(t * Math.PI) * 0.02 * (i % 2 === 0 ? 1 : -1)); 
      
      const nx = x / 1.15;
      const scale = 0.1 + 0.9 * Math.pow(nx, 1.2);
      
      let ny = Math.abs(curveY / 0.45);
      let bulge = (1 - Math.pow(nx - 0.6, 2)) * (1 - Math.pow(ny, 2)) * 0.25;
      
      let z = (0.275 + 0.05) * scale + (bulge * nx) + 0.01; 
      
      const wobbleY = (Math.sin(t * 30 + i) * 0.01);
      points.push(new THREE.Vector3(x, curveY + wobbleY, z));
    }
    lines.push(<Line key={i} points={points} color="#ffedd5" lineWidth={1.5 + (i%2)*0.5} transparent opacity={0.6} />);
  }
  return <>{lines}</>;
};

const OrangeSlice = ({ index, rotY, isSelected, isHovered, onHover, onClick }) => {
  const groupRef = React.useRef();
  const fleshMatRef = React.useRef();
  const basePull = 1.2;
  const targetPull = isSelected ? 1.45 : basePull;
  const targetScale = isHovered ? 1.05 : 1.0;
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, 0, delta * 5);
      const currentPull = groupRef.current.position.length();
      const newPull = THREE.MathUtils.lerp(currentPull || basePull, targetPull, delta * 8);
      groupRef.current.position.set(Math.cos(rotY) * newPull, 0, -Math.sin(rotY) * newPull);
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, delta * 8));
      
      if (fleshMatRef.current) {
        fleshMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(fleshMatRef.current.emissiveIntensity, isHovered ? 0.2 : 0, 10 * delta);
      }
    }
  });

  const customGeo = React.useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.06);
    s.bezierCurveTo(0.05, 0.12,  0.1, 0.15,  0.2, 0.18);
    s.bezierCurveTo(0.5, 0.3,  0.7, 0.45,  0.9, 0.45);
    s.bezierCurveTo(1.1, 0.45,  1.15, 0.2,  1.15, 0);
    s.bezierCurveTo(1.15, -0.2,  1.1, -0.45,  0.9, -0.45);
    s.bezierCurveTo(0.7, -0.45,  0.5, -0.3,  0.2, -0.18);
    s.bezierCurveTo(0.1, -0.15,  0.05, -0.12,  0, -0.06);
    s.bezierCurveTo(-0.04, -0.03,  -0.04, 0.03,  0, 0.06);
    
    const extrudeSettings = { 
      depth: 0.55, 
      bevelEnabled: true, 
      bevelThickness: 0.05, 
      bevelSize: 0.04, 
      bevelSegments: 8,
      curveSegments: 64
    };
    
    const geo = new THREE.ExtrudeGeometry(s, extrudeSettings);
    geo.translate(0, 0, -0.275); 
    
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);
      
      let nx = Math.max(0, Math.min(1, x / 1.15));
      let scale = 0.1 + 0.9 * Math.pow(nx, 1.2); 
      
      let noise = Math.sin(x * 20) * Math.cos(y * 20) * 0.01;
      
      z = (z * scale) + noise;
      
      let ny = Math.abs(y / 0.45); 
      let bulge = (1 - Math.pow(nx - 0.6, 2)) * (1 - Math.pow(ny, 2)) * 0.25; 
      z += Math.sign(z) * bulge; 
      
      pos.setXYZ(i, x, y, z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  const rindGeo = React.useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0.8, 0.45); 
    s.bezierCurveTo(1.1, 0.45,  1.15, 0.2,  1.15, 0);
    s.bezierCurveTo(1.15, -0.2,  1.1, -0.45,  0.8, -0.45);
    s.bezierCurveTo(0.9, -0.5,  1.2, -0.2,  1.2, 0);
    s.bezierCurveTo(1.2, 0.2,  0.9, 0.5,  0.8, 0.45);
    
    const geo = new THREE.ExtrudeGeometry(s, { depth: 0.57, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.01, curveSegments: 32 });
    geo.translate(0, 0, -0.285);
    
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);
      let nx = Math.max(0, Math.min(1, x / 1.15));
      let ny = Math.abs(y / 0.45); 
      let bulge = (1 - Math.pow(nx - 0.6, 2)) * (1 - Math.pow(ny, 2)) * 0.25;
      z += Math.sign(z) * bulge; 
      pos.setXYZ(i, x, y, z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group 
      ref={groupRef} 
      rotation={[0, rotY, 0]}
      onPointerOver={(e) => { e.stopPropagation(); onHover(index); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { e.stopPropagation(); onHover(null); document.body.style.cursor = 'auto'; }}
      onClick={(e) => { e.stopPropagation(); onClick(index); }}
    >
      <mesh geometry={customGeo} rotation={[-Math.PI/2, 0, 0]}>
        <meshStandardMaterial attach="material-0" ref={fleshMatRef} color="#ff8c00" roughness={0.5} emissive="#ffaa00" emissiveIntensity={0} />
        <meshStandardMaterial attach="material-1" color="#e65c00" roughness={0.7} />
      </mesh>
      <mesh geometry={rindGeo} rotation={[-Math.PI/2, 0, 0]}>
        <meshStandardMaterial color="#cc5500" roughness={0.9} />
      </mesh>
      <group rotation={[-Math.PI/2, 0, 0]}>
        <CitrusDetails />
      </group>
    </group>
  );
};

const LongitudeLabels = ({ segmentsData }) => {
  return (
    <group>
      {segmentsData.map((seg, i) => {
        const labelPull = 3.5;
        const posX = seg.lx * labelPull;
        const posZ = seg.lz * labelPull;
        const arrowStart = [seg.lx * (labelPull - 0.5), 0.2, seg.lz * (labelPull - 0.5)];
        const arrowEnd = [seg.lx * 2.5, 0.2, seg.lz * 2.5];
        return (
          <group key={i}>
            <Html position={[posX, 0.2, posZ]} center style={{ pointerEvents: 'none', textAlign: 'center', whiteSpace: 'nowrap' }}>
              <div style={{ color: seg.color, fontWeight: 'bold', fontSize: '15px', textShadow: '0 2px 6px rgba(0,0,0,0.9)' }}>
                {seg.label}
                {seg.subLabel && <div style={{ fontSize: '11px', fontWeight: 'normal', marginTop: '4px' }}>{seg.subLabel}</div>}
              </div>
            </Html>
            <Line points={[arrowStart, arrowEnd]} color={seg.color} lineWidth={2} transparent opacity={0.7} />
          </group>
        );
      })}
    </group>
  );
};

const OrangeLongitudeModel = () => {
  const [hoveredSlice, setHoveredSlice] = React.useState(null);
  const [selectedSlice, setSelectedSlice] = React.useState(null);

  const segmentsData = [];
  for (let i = 0; i < 12; i++) {
    const screenAngleDeg = i * 30; 
    const screenAngleRad = screenAngleDeg * (Math.PI / 180);
    
    const lx = Math.sin(screenAngleRad);
    const lz = -Math.cos(screenAngleRad);
    
    const rotY = Math.atan2(-lz, lx);

    let label = ''; let subLabel = ''; let color = '#ffffff'; let info = '';
    
    if (i === 0) { label = '0°'; subLabel = '(Prime Meridian)'; color = '#ffffff'; info = '0° — The Prime Meridian'; }
    else if (i < 6) { label = `${i * 30}°E`; color = '#f97316'; info = `${i * 30}°E — ${i * 30} degrees east of the Prime Meridian`; }
    else if (i === 6) { label = '180°'; color = '#ffffff'; info = '180° — The International Date Line'; }
    else { label = `${(12 - i) * 30}°W`; color = '#60a5fa'; info = `${(12 - i) * 30}°W — ${(12 - i) * 30} degrees west of the Prime Meridian`; }
    
    segmentsData.push({ index: i, rotY, lx, lz, label, color, info, subLabel });
  }

  return (
    <group position={[0, -0.15, 0]}>
      <CentralOrange />
      
      {segmentsData.map((seg) => (
        <OrangeSlice 
          key={seg.index} index={seg.index} rotY={seg.rotY} label={seg.label}
          isSelected={selectedSlice === seg.index}
          isHovered={hoveredSlice === seg.index}
          onHover={setHoveredSlice}
          onClick={(idx) => setSelectedSlice(prev => prev === idx ? null : idx)}
        />
      ))}

      <LongitudeLabels segmentsData={segmentsData} />

      <Line points={[[0, -1.0, -4.5], [0, -1.0, 4.5]]} color="#ffffff" lineWidth={2} dashed={true} dashScale={5} dashSize={0.2} gapSize={0.2} transparent opacity={0.6} />

      {selectedSlice !== null && (
        <Html position={[0, 3.5, 0]} center>
          <div style={{
            background: 'rgba(15, 23, 42, 0.95)', border: `1px solid ${segmentsData[selectedSlice].color}`,
            padding: '12px 24px', borderRadius: '12px', color: '#fff', whiteSpace: 'nowrap',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)', fontSize: '15px', fontWeight: 'bold'
          }}>
            {segmentsData[selectedSlice].info}
          </div>
        </Html>
      )}
    </group>
  );
};

const RealisticPeeledOrange = () => {
  const peeledMap = useLoader(THREE.TextureLoader, '/src/assets/peeled_orange.jpg');
  const groupRef = React.useRef();
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  const radius = 1.3;
  const segments = 64;

  const createLatitudeLine = (lat) => {
    const points = [];
    const radLat = (lat * Math.PI) / 180;
    const y = radius * 1.01 * Math.sin(radLat);
    const r = radius * 1.01 * Math.cos(radLat);
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(r * Math.sin(theta), y, r * Math.cos(theta)));
    }
    return points;
  };

  const createLongitudeLine = (lon) => {
    const points = [];
    for (let lat = -90; lat <= 90; lat += 2) {
      const radLat = lat * Math.PI / 180;
      const radLon = (lon + 90) * Math.PI / 180;
      const x = radius * 1.01 * Math.cos(radLat) * Math.sin(radLon);
      const y = radius * 1.01 * Math.sin(radLat);
      const z = radius * 1.01 * Math.cos(radLat) * Math.cos(radLon);
      points.push(new THREE.Vector3(x, y, z));
    }
    return points;
  };

  const getPosFromLatLng = (lat, lon, rMult = 1.02) => {
    const radLat = lat * Math.PI / 180;
    const radLon = (lon + 90) * Math.PI / 180;
    const x = radius * rMult * Math.cos(radLat) * Math.sin(radLon);
    const y = radius * rMult * Math.sin(radLat);
    const z = radius * rMult * Math.cos(radLat) * Math.cos(radLon);
    return new THREE.Vector3(x, y, z);
  };

  const parallelsPts = [-60, -30, 30, 60].map(createLatitudeLine);
  const meridiansPts = [-150, -120, -90, -60, -30, 30, 60, 90, 120, 150].map(createLongitudeLine);

  const labels = [];
  [0, 30, 60, 90, 120, 150, 180, -150, -120, -90, -60, -30].forEach((lon, idx) => {
    let labelText = lon === 0 ? "0°" : lon === 180 ? "180°" : lon > 0 ? `${lon}°E` : `${Math.abs(lon)}°W`;
    
    // High-contrast colors for the orange model: bright yellow for East, pale blue for West
    let color = lon === 0 || lon === 180 ? "#ffffff" : lon > 0 ? "#fef08a" : "#bae6fd";
    
    // Extra strong text shadow to pop against the orange texture
    let shadow = "0 2px 8px rgba(0,0,0,1), 0 0 4px rgba(0,0,0,0.8)";

    labels.push(
      <FadingLabel key={`lbl-${idx}`} pos={getPosFromLatLng(0, lon, 1.15)} color={color} text={labelText} textShadow={shadow} />
    );
  });

  return (
    <group ref={groupRef} rotation={[0, -Math.PI / 2, 0]}>
      <Sphere args={[radius, 64, 64]}>
        <meshStandardMaterial map={peeledMap} roughness={0.7} />
      </Sphere>
      <mesh position={[0, radius + 0.04, 0]}>
        <cylinderGeometry args={[0.02, 0.04, 0.15, 8]} />
        <meshStandardMaterial color="#4a2e15" roughness={0.9} />
      </mesh>
      
      {/* Graticule - Parallels */}
      {parallelsPts.map((points, idx) => (
        <Line key={`lat-${idx}`} points={points} color="#ffffff" lineWidth={2.5} transparent opacity={0.7} />
      ))}
      
      {/* Graticule - Meridians */}
      {meridiansPts.map((points, idx) => (
        <Line key={`lon-${idx}`} points={points} color="#ffffff" lineWidth={2.5} transparent opacity={0.7} />
      ))}

      {/* Equator */}
      <Line points={createLatitudeLine(0)} color="#fbbf24" lineWidth={7.5} />

      {/* Prime Meridian */}
      <Line points={createLongitudeLine(0)} color="#fbbf24" lineWidth={7.5} />

      {/* 180 Degree Line */}
      <Line points={createLongitudeLine(180)} color="#60a5fa" lineWidth={6} transparent opacity={0.7} />

      {labels}
    </group>
  );
};

const OrangeModel = () => {
  const orangeRef = React.useRef();
  useFrame(() => {
    if (orangeRef.current) {
      orangeRef.current.rotation.y = 0.5;
      orangeRef.current.rotation.x = 0.2;
    }
  });
  const meridians = [];
  const radius = 1;
  for (let i = 0; i < 12; i++) {
    const lon = i * 30;
    const points = [];
    for (let lat = 90; lat >= -90; lat -= 5) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon) * (Math.PI / 180);
      points.push(new THREE.Vector3(
        radius * 1.01 * Math.sin(phi) * Math.sin(theta),
        radius * 1.01 * Math.cos(phi),
        radius * 1.01 * Math.sin(phi) * Math.cos(theta)
      ));
    }
    meridians.push(<Line key={i} points={points} color="#ffed4a" lineWidth={2} transparent opacity={0.6} />);
  }
  return (
    <group ref={orangeRef}>
      <Sphere args={[radius, 32, 32]}><meshStandardMaterial color="#f97316" roughness={0.8} /></Sphere>
      <mesh position={[0, radius + 0.04, 0]}><cylinderGeometry args={[0.02, 0.04, 0.15, 8]} /><meshStandardMaterial color="#4a2e15" roughness={0.9} /></mesh>
      <mesh position={[0.22, radius + 0.08, 0.1]} rotation={[0.2, -0.4, 0.3]} scale={[0.3, 0.03, 0.15]}><sphereGeometry args={[1, 16, 16]} /><meshStandardMaterial color="#16a34a" roughness={0.5} /></mesh>
      {meridians}
    </group>
  );
};

const Orange3D = () => (
  <div style={{ width: '100%', height: '180px', margin: '20px 0', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
    <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#fff" />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#fff" />
      <OrangeModel />
    </Canvas>
  </div>
);

const DegLabel = ({ text, color, style }) => (
  <span style={{ position: 'absolute', color: color, fontSize: '14px', fontWeight: '900', textShadow: '0 2px 6px rgba(0,0,0,1)', letterSpacing: '0.5px', ...style }}>
    {text}
  </span>
);

const InfographicStep = ({ handleNext, handlePrev }) => {
  return (
    <div className="infographic-layout" style={{ overflow: 'hidden', height: '100vh', padding: '16px 24px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <button className="dark-nav-btn" onClick={handlePrev}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          Back
        </button>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ color: '#fbbf24', fontSize: '32px', margin: 0, fontWeight: 900, fontFamily: '"Arial Black", "Segoe UI Black", Impact, sans-serif', letterSpacing: '-0.5px' }}>Longitudes on Earth</h1>
          <h2 style={{ color: '#cbd5e1', fontSize: '16px', margin: '4px 0 0', fontWeight: 'normal', fontStyle: 'italic' }}>Like the Segments of a Peeled Orange</h2>
        </div>
        <button className="dark-nav-btn next" onClick={handleNext}>
          Next
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>

      {/* THREE COLUMNS */}
      <div style={{ display: 'flex', flex: 1, gap: '12px', minHeight: 0 }}>
        {/* COL 1: EARTH GLOBE */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <div style={{ height: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: '900', textAlign: 'center', marginBottom: '2px', letterSpacing: '0.5px' }}>NORTH POLE<br/>90° N</div>
            <div style={{ color: '#f97316', fontSize: '16px', fontWeight: '900' }}>0°</div>
          </div>
          <div style={{ flex: 1, width: '100%', position: 'relative', minHeight: 0 }}>

            <Globe3D currentTask={3} gridLat={0} gridLon={0} transparentBg={true} disableMoon={true} />
          </div>
          <div style={{ height: '90px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', marginTop: '8px' }}>
            <div style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: '900' }}>180°</div>
            <div style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: '900', textAlign: 'center', letterSpacing: '0.5px' }}>SOUTH POLE<br/>90° S</div>

          </div>
        </div>

        {/* COL 2: PEELED ORANGE MODEL */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <div style={{ height: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: '900', textAlign: 'center', marginBottom: '2px', letterSpacing: '0.5px' }}>NORTH POLE<br/>(90° N)</div>
            <div style={{ color: '#f97316', fontSize: '16px', fontWeight: '900' }}>0°</div>
          </div>
          <div style={{ flex: 1, width: '100%', position: 'relative', minHeight: 0 }}>

            <Canvas camera={{ position: [0, 0, 4.2], fov: 45 }} style={{ cursor: 'grab' }}>
              <ambientLight intensity={0.7} />
              <directionalLight position={[5, 5, 5]} intensity={1.5} color="#fff" />
              <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#fff" />
              <RealisticPeeledOrange />
              <OrbitControls enableZoom={true} enablePan={false} minDistance={2} maxDistance={6} />
            </Canvas>
          </div>
          <div style={{ height: '90px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', marginTop: '8px' }}>
            <div style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: '900' }}>180°</div>
            <div style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: '900', textAlign: 'center', letterSpacing: '0.5px' }}>SOUTH POLE<br/>(90° S)</div>
          </div>
        </div>

        {/* COL 3: ORANGE SEGMENTS TOP-DOWN */}
        <div style={{ flex: 0.85, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <div style={{ height: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ color: '#f97316', fontSize: '15px', fontWeight: '900', textAlign: 'center', marginBottom: '2px', letterSpacing: '0.5px' }}>Order of Longitudes</div>
            <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 'bold', textAlign: 'center' }}>Measured Eastward from 0°<br/>and Westward from 0°</div>
          </div>
          <div style={{ flex: 1, width: '100%', position: 'relative', minHeight: 0 }}>
            <Canvas camera={{ position: [0, 9.5, 0.1], fov: 45 }}>
              <ambientLight intensity={1.2} />
              <directionalLight position={[0, 8, 2]} intensity={2.0} color="#fff" />
              <directionalLight position={[4, 3, 4]} intensity={0.8} color="#ffe0b2" />
              <OrangeLongitudeModel />
              <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={0} maxPolarAngle={Math.PI / 2.2} />
            </Canvas>
          </div>
          <div style={{ height: '90px' }}></div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', marginTop: '8px' }}>
        <h4 style={{ color: '#fff', textAlign: 'center', margin: '0 0 8px', fontSize: '13px', letterSpacing: '1.5px' }}>3 BEST SUGGESTIONS TO REMEMBER LONGITUDES</h4>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="sugg-box" style={{ padding: '10px 14px' }}>
            <div className="sugg-num" style={{ width: '26px', height: '26px', fontSize: '13px' }}>1</div>
            <div className="sugg-text">
              <strong style={{ color: '#fbbf24', fontWeight: '900', fontSize: '15px' }}>Imagine Orange Segments</strong>
              <p style={{ fontWeight: '600', fontSize: '13px' }}>Think of Earth longitudes as the natural lines on an orange. They run from Pole to Pole and split the Earth.</p>
            </div>
          </div>
          <div className="sugg-box" style={{ padding: '10px 14px' }}>
            <div className="sugg-num" style={{ width: '26px', height: '26px', fontSize: '13px' }}>2</div>
            <div className="sugg-text">
              <strong style={{ color: '#fbbf24', fontWeight: '900', fontSize: '15px' }}>Use the 0° – 180° Rule</strong>
              <p style={{ fontWeight: '600', fontSize: '13px' }}>0° at Greenwich.<br/>Count up to 180° East (E).<br/>Count up to 180° West (W).<br/>180° is the International Date Line.</p>
            </div>
          </div>
          <div className="sugg-box" style={{ padding: '10px 14px' }}>
            <div className="sugg-num" style={{ width: '26px', height: '26px', fontSize: '13px' }}>3</div>
            <div className="sugg-text">
              <strong style={{ color: '#fbbf24', fontWeight: '900', fontSize: '15px' }}>East is Positive, West is Negative</strong>
              <p style={{ fontWeight: '600', fontSize: '13px' }}>Longitudes to the East of 0° are positive (+).<br/>Longitudes to the West of 0° are negative (−).</p>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 14px', minWidth: '150px', fontSize: '12px', lineHeight: '1.8' }}>
            <span style={{ color: '#f97316', fontWeight: 'bold' }}>E</span> <span style={{ color: '#94a3b8' }}>= East (Positive)</span><br/>
            <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>W</span> <span style={{ color: '#94a3b8' }}>= West (Negative)</span><br/>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>0°</span> <span style={{ color: '#94a3b8' }}>= Prime Meridian</span><br/>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>180°</span> <span style={{ color: '#94a3b8' }}>= Intl. Date Line</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const stepsData = [
  {
    stepNum: 1,
    title: "Return to the Globe",
    paragraphs: [
      "Let us look closely at a globe — a small model of our round Earth. Because a ball has no corners or edges, we cannot simply say a place is \"in the corner\".",
      "To pinpoint any place exactly, mapmakers imagine a network of lines drawn across the globe. Over the next steps we will draw those lines one by one."
    ],
    keyIdea: "The lines on a globe are imaginary — we only picture them to help locate places.",
    task: 0, lat: 0
  },
  {
    stepNum: 2,
    title: "The North & South Poles",
    paragraphs: [
      "Rotate the globe and two points stay fixed — one at the very top and one at the very bottom. These are the North Pole and the South Pole.",
      "The Earth spins around an imaginary rod that joins them, called its axis (shown in gold). The poles are our starting references for every other line."
    ],
    keyIdea: "The North Pole and South Pole are the two fixed ends of Earth's axis.",
    task: 4, lat: 0
  },
  {
    stepNum: 3,
    title: "The Equator",
    paragraphs: [
      "Exactly halfway between the two poles is a circle that runs right around the middle of the Earth. This is the Equator.",
      "It is the largest circle on the globe and divides the Earth into a Northern half and a Southern half. Its value is 0°."
    ],
    keyIdea: "The Equator is the halfway circle between the poles — latitude 0°.",
    task: 1, lat: 0
  },
  {
    stepNum: 4,
    title: "What is Latitude?",
    paragraphs: [
      "Imagine you stand on the Equator and travel towards one of the poles. Your distance from the Equator keeps increasing.",
      "Latitude is exactly this — a measure of how far north or south of the Equator a place is."
    ],
    keyIdea: "Latitude measures your distance north or south of the Equator.",
    task: 1, lat: 0
  },
  {
    stepNum: 5,
    title: "Parallels of Latitude",
    paragraphs: [
      "At any point on that journey you can draw an imaginary line running east-west, parallel to the Equator. Such a line is called a parallel of latitude, and it forms a circle around the Earth.",
      "The Equator is the largest of these circles; the parallels grow smaller as we move towards either pole."
    ],
    keyIdea: "A parallel of latitude runs east-west and makes a circle; the circles shrink towards the poles.",
    task: 5, lat: 0 
  },
  {
    stepNum: 6,
    title: "Latitude in Degrees",
    paragraphs: [
      <span key="1">Latitudes are written in <strong>degrees</strong>. By convention, the Equator is latitude <strong>0°</strong>.</span>,
      <span key="2">The two poles are the highest latitudes — <strong>90° North</strong> and <strong>90° South</strong>, written <strong>90°N</strong> and <strong>90°S</strong>. So latitude runs from 0° up to 90° on each side.</span>
    ],
    keyIdea: <span key="ki6">Equator = <strong>0°</strong> · North Pole = <strong>90°N</strong> · South Pole = <strong>90°S</strong>.</span>,
    task: 7, lat: 0 
  },
  {
    stepNum: 7,
    title: "Latitude and Climate",
    paragraphs: [
      <span key="1">Latitude is linked to <strong>climate</strong>. The coloured belts on the globe show the three zones. Near the Equator it is generally <strong>hot</strong> — the <strong>torrid</strong> zone (orange), bounded by the <strong>Tropic of Cancer</strong> (23½°N) and <strong>Tropic of Capricorn</strong> (23½°S).</span>,
      <div key="2" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '12px 0' }}>
        <span style={{ background: '#f97316', color: '#fff', padding: '4px 12px', borderRadius: '16px', fontSize: '13px', fontWeight: 'bold' }}>Torrid - hot</span>
        <span style={{ background: '#22c55e', color: '#fff', padding: '4px 12px', borderRadius: '16px', fontSize: '13px', fontWeight: 'bold' }}>Temperate - mild</span>
        <span style={{ background: '#3b82f6', color: '#fff', padding: '4px 12px', borderRadius: '16px', fontSize: '13px', fontWeight: 'bold' }}>Frigid - cold</span>
      </div>,
      <span key="3">Moving away from the Equator the climate becomes <strong>temperate</strong> (green, mild); beyond the <strong>Arctic Circle</strong> (66½°N) and <strong>Antarctic Circle</strong> (66½°S) it is <strong>frigid</strong> (blue, very cold). Latitude also helps explain the <strong>seasons</strong>.</span>
    ],
    keyIdea: <span key="ki7">Torrid (hot) near the Equator → Temperate (mild) → Frigid (cold) near the poles.</span>,
    task: 8, lat: 0 
  },
  {
    stepNum: 8,
    title: "The Prime Meridian",
    paragraphs: [
      <span key="1">Longitude needs a <strong>starting line</strong>, just as latitude has the Equator. That line is the <strong>Prime Meridian</strong>.</span>,
      <span key="2">In <strong>1884</strong>, nations agreed that the meridian passing through <strong>Greenwich</strong>, in London, would be the international standard — so it is also called the <strong>Greenwich Meridian</strong>. It is marked <strong>0° longitude</strong>.</span>
    ],
    keyIdea: <span key="ki8">The <strong>Prime Meridian</strong> (through Greenwich, London) is the <strong>0°</strong> starting line for longitude.</span>,
    task: 2, lon: 0 
  },
  {
    stepNum: 9,
    title: "What is Longitude?",
    paragraphs: [
      <span key="1">Now imagine standing on the Prime Meridian and travelling <strong>east or west</strong> along the Equator. Your <strong>distance</strong> from the Prime Meridian keeps increasing.</span>,
      <span key="2"><strong>Longitude</strong> is exactly this — a measure of how far <strong>east or west</strong> of the Prime Meridian a place is.<br/><br/><span style={{opacity: 0.8}}>(Latitude measured distance <strong>north–south</strong>; longitude measures it <strong>east–west</strong>.)</span></span>
    ],
    keyIdea: <span key="ki9">Longitude measures your distance <strong>east or west</strong> of the Prime Meridian.</span>,
    task: 21, lon: 0 
  },
  {
    stepNum: 10,
    title: "Meridians of Longitude",
    paragraphs: [
      <span key="1">Travel from the <strong>North Pole to the South Pole</strong> by the shortest line. Whether you pass through Europe and Africa or through Asia, the distance is the <strong>same</strong>. These pole-to-pole lines are the <strong>meridians of longitude</strong> — all <strong>half-circles</strong> that meet at the two poles.</span>,
      <Orange3D key="2" />,
      <span key="3">An orange 🍊 — its segment lines run pole to pole, just like meridians.</span>
    ],
    keyIdea: <span key="ki10">Meridians of longitude are half-circles from pole to pole — like the segment lines of an <strong>orange</strong>.</span>,
    task: 3, gridLat: 0, gridLon: 0
  },
  {
    stepNum: 11,
    title: "Longitude in Degrees",
    paragraphs: [
      <span key="1">Longitude is measured in <strong>degrees</strong>, from <strong>0° to 180°</strong>, adding <strong>E</strong> for east or <strong>W</strong> for west of the Prime Meridian.</span>,
      <span key="2">For example, <strong>New York</strong> is <strong>74°W</strong>, <strong>Delhi</strong> is <strong>77°E</strong>, and <strong>Tokyo</strong> is <strong>140°E</strong> — shown by the <strong style={{color: '#f97316'}}>orange pins</strong> on the globe.</span>
    ],
    keyIdea: <span key="ki11">Longitude runs <strong>0° to 180°</strong>, East or West — e.g. Delhi <strong>77°E</strong>, New York <strong>74°W</strong>, Tokyo <strong>140°E</strong>.</span>,
    task: 6, lon: 77 
  },
  {
    stepNum: 12,
    title: "Longitude and Time",
    paragraphs: [
      <span key="1">The Earth spins on its axis. Picture a lamp as the <strong>Sun</strong> lighting one side of the globe. As the Earth turns <strong>eastward</strong>, it is morning for some places, midday for others, and night for the rest.</span>,
      <span key="2">So when it is breakfast time in one country, it is lunchtime in another and people are asleep in a third. That is why a place’s <strong>longitude</strong> also tells us its <strong>time</strong>.</span>
    ],
    keyIdea: <span key="ki12">Because the Earth spins, <strong>longitude is closely linked to the time</strong> of day.</span>,
    task: 16, gridLat: 0, gridLon: 0
  },
  {
    stepNum: 13,
    title: "Finding Any Place",
    paragraphs: [
      <span key="1">Put the parallels and the meridians together and they form a complete net — the <strong>global grid</strong>, or <strong>graticule</strong>. Every place now sits where one line of latitude <strong>crosses</strong> one line of longitude.</span>,
      <span key="2">We give its <strong>latitude first</strong>, then its <strong>longitude</strong>. For example, <strong>New Delhi</strong> is <strong>28.6°N, 77.2°E</strong> — a single, exact address.</span>
    ],
    keyIdea: <span key="ki13">Any place = (<strong>latitude, longitude</strong>) — latitude always written first.</span>,
    task: 10, gridLat: 28.6, gridLon: 77.2 
  },
  {
    stepNum: 14,
    title: "India's Ancient Prime Meridian",
    paragraphs: [
      <span key="1">Travel back more than <strong>1,500 years</strong>! Long before Greenwich was chosen as the global standard, ancient Indian astronomers needed a central reference line to map the stars and calculate time.</span>,
      <span key="2">They established their own Prime Meridian running through the ancient city of <strong>Ujjayini</strong> (modern-day Ujjain). Great scholars like <strong>Aryabhata</strong> and <strong>Varahamihira</strong> used this central meridian for all their brilliant astronomical calculations.</span>
    ],
    keyIdea: <span key="ki14"><strong>Ujjayini</strong> served as the Prime Meridian of ancient India over 1,500 years ago.</span>,
    task: 9
  },
  {
    stepNum: 15,
    title: "Western & Eastern Hemispheres",
    paragraphs: [
      <span key="1">Cut the globe along the <strong>Prime Meridian (0&deg;)</strong> and the <strong>180&deg;</strong> line, and it falls into two halves that we can see <strong>fully</strong>.</span>,
      <span key="2">The left half (blue) is the <strong>Western Hemisphere</strong> (0&deg;&ndash;180&deg; West); the right half (orange) is the <strong>Eastern Hemisphere</strong> (0&deg;&ndash;180&deg; East). India lies in the Eastern Hemisphere.</span>
    ],
    keyIdea: <span key="ki15">The <strong>Prime Meridian</strong> splits Earth into the <strong>Western</strong> and <strong>Eastern</strong> hemispheres.</span>,
    task: 11
  },
  {
    stepNum: 16,
    title: "Northern & Southern Hemispheres",
    paragraphs: [
      <span key="1">Now cut the globe along the <strong>Equator (0&deg;)</strong> instead. Again it opens into two halves shown <strong>fully</strong>.</span>,
      <span key="2">The top half (green) is the <strong>Northern Hemisphere</strong>; the bottom half (purple) is the <strong>Southern Hemisphere</strong>. India lies in the Northern Hemisphere.</span>
    ],
    keyIdea: <span key="ki16">The <strong>Equator</strong> splits Earth into the <strong>Northern</strong> and <strong>Southern</strong> hemispheres.</span>,
    task: 12
  },
  {
    stepNum: 17,
    title: "The Four Quarters",
    paragraphs: [
      <span key="1">Use <strong>both</strong> dividing lines at once and the globe splits into <strong>four quarters</strong>: Northern-Eastern, Northern-Western, Southern-Eastern and Southern-Western.</span>,
      <span key="2">Every place on Earth sits in exactly <strong>one</strong> of these quarters.</span>
    ],
    keyIdea: <span key="ki17">The Equator and the Prime Meridian together divide Earth into <strong>four</strong> quarters.</span>,
    task: 13
  }
];

export default function CoordinatesPage({ onNextActivity, onBack }) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const totalGlobeSteps = 17;
  const totalPages = totalGlobeSteps + 2; // 1 (intro) + 1 (minigame) + 17 (globe) = 19

  const handleNext = () => {
    if (currentStepIdx < totalPages - 1) {
      setCurrentStepIdx(c => c + 1);
    } else {
      if (onNextActivity) onNextActivity();
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(c => c - 1);
    } else {
      if (onBack) onBack();
    }
  };

  if (currentStepIdx === 0) {
    return (
      <div className="coords-page">
        <div className="coords-book">
          <div className="coords-main-content">
            {/* Left Page */}
            <div className="coords-left">
              <div className="coords-eyebrow">CHAPTER 1 &bull; CLASS 6 SOCIAL SCIENCE</div>
              <h1 className="coords-chtitle">Locating Places<br/>on the Earth</h1>
              <div className="coords-illus" style={{ position: 'relative', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', border: '1px solid #334155', boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8)', overflow: 'hidden', padding: 0 }}>
                <img src="/coordinate_grid_globe_wide.jpg" alt="Grid Coordinate System Globe" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
            
            {/* Right Page */}
            <div className="coords-right">
              <div className="coords-rhead" style={{ fontSize: '32px' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                UNDERSTANDING COORDINATES
              </div>
              <div className="coords-content">
                <div className="coords-task-container" style={{ justifyContent: 'flex-start', paddingTop: '80px' }}>
                  <div className="coords-hero" style={{ padding: '32px' }}>
                    <h3 style={{ marginBottom: '20px', fontSize: '28px' }}>Finding the Exact Spot</h3>
                    <p style={{ marginBottom: '20px', fontSize: '18px', lineHeight: '1.7', textAlign: 'justify' }}>
                      Imagine a big market with neat rows of shops. If you tell a friend, "Meet me at the 7th shop in the 5th row," they can find you instantly.
                    </p>
                    <p style={{ marginBottom: '20px', fontSize: '18px', lineHeight: '1.7', textAlign: 'justify' }}>
                      Similarly, in a game of chess, players record their moves using letters (a-h) and numbers (1-8). By saying "d4", they pinpoint one exact square on the board.
                    </p>
                    <p style={{ fontSize: '18px', lineHeight: '1.7', textAlign: 'justify' }}>
                      To locate a place precisely, we always need <strong>two pieces of information</strong> to form a coordinate.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="coords-rfoot">
            <div className="coords-pageind" style={{ fontSize: '16px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              Page 1 of {totalPages}
            </div>
            <button className="coords-next" onClick={handleNext} style={{ fontSize: '16px', padding: '12px 26px' }}>
              Next Page &rarr;
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStepIdx === 1) {
    return (
      <CoordinatesMinigame 
        onComplete={handleNext}
        onBack={handlePrev}
      />
    );
  }

  const activeGlobeIdx = currentStepIdx - 2;

  if (activeGlobeIdx === 9) {
    return <InfographicStep handleNext={handleNext} handlePrev={handlePrev} />;
  }

  const step = stepsData[activeGlobeIdx] || stepsData[stepsData.length - 1];

  const getTopTitle = () => {
    if (activeGlobeIdx >= 14) return "Hemispheres — How the Earth is Divided";
    return "The Global Grid — Latitude & Longitude";
  };

  return (
    <div className="dark-coords-page">
      <div className="dark-coords-main-content">
        <div className="dark-coords-left">
          <div className="dark-top-title">{getTopTitle()}</div>
          
          <div className="dark-globe-container">
            <Globe3D 
              currentTask={step.task} 
              latVal={step.lat} 
              lonVal={step.lon || 0} 
              gridLat={step.gridLat || 0} 
              gridLon={step.gridLon || 0} 
            />
          </div>

          <div className="dark-bottom-nav">
            <button className="dark-nav-btn" onClick={handlePrev}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Back
            </button>
            <div className="dark-nav-dots">
              {Array.from({ length: totalGlobeSteps }).map((_, i) => (
                <div key={i} className={`dark-nav-dot ${i === activeGlobeIdx ? 'active' : ''}`} />
              ))}
            </div>
            <button className="dark-nav-btn next" onClick={handleNext}>
              {activeGlobeIdx === totalGlobeSteps - 1 ? 'Finish' : 'Next'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="dark-coords-right">
          <div className="dark-step-eyebrow">STEP {activeGlobeIdx + 1} OF {totalGlobeSteps}</div>
          <h2 className="dark-step-title">{step.title}</h2>
          
          {step.paragraphs.map((p, idx) => (
            <div key={idx} className="dark-step-text">{p}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
