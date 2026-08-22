import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, useTexture, Html, Cylinder, Stars, Edges } from '@react-three/drei';
import * as THREE from 'three';
import worldMapUrl from './world-map.jpg';

const Comet = ({ currentTask }) => {
  const cometRef = useRef();
  
  useFrame((state) => {
    if (currentTask !== 0 || !cometRef.current) return;
    
    // Cycle every 8 seconds
    const time = state.clock.getElapsedTime();
    const t = (time % 8) / 8;
    
    // Move from top-right-far to bottom-left-far
    const startX = 35; const startY = 20; const startZ = -15;
    const endX = -35; const endY = -20; const endZ = -5;
    
    cometRef.current.position.x = THREE.MathUtils.lerp(startX, endX, t);
    cometRef.current.position.y = THREE.MathUtils.lerp(startY, endY, t);
    cometRef.current.position.z = THREE.MathUtils.lerp(startZ, endZ, t);
    
    // Face the direction of motion
    cometRef.current.lookAt(endX, endY, endZ);
  });

  if (currentTask !== 0) return null;

  return (
    <group ref={cometRef}>
      {/* Comet Core */}
      <Sphere args={[0.15, 16, 16]}>
        <meshBasicMaterial color="#ffffff" />
      </Sphere>
      
      {/* Inner Tail (Brightest) */}
      <mesh position={[0, 0, -2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.0, 4, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      
      {/* Mid Tail */}
      <mesh position={[0, 0, -4]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.0, 8, 16]} />
        <meshBasicMaterial color="#88ccff" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      
      {/* Outer Tail (Widest, Faintest) */}
      <mesh position={[0, 0, -6]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.0, 12, 16]} />
        <meshBasicMaterial color="#2266ff" transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
};

const Globe = ({ currentTask, latVal, lonVal, gridLat, gridLon }) => {
  const globeRef = useRef();
  
  const colorMap = useTexture(worldMapUrl);
  
  useEffect(() => {
    if (colorMap) {
      colorMap.wrapS = THREE.RepeatWrapping;
      colorMap.needsUpdate = true;
    }
  }, [colorMap]);

  useFrame((state, delta) => {
    if (globeRef.current) {
      if (currentTask >= 11 && currentTask <= 14) {
        // Lock rotation exactly so the cuts align perfectly with the camera
        globeRef.current.rotation.set(0, Math.PI, 0);
      } else {
        // Gentle, slow auto-rotation
        globeRef.current.rotation.y += delta * 0.08;
      }
    }
  });

  const radius = 2.2;
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

  const getPosFromLatLng = (lat, lon) => {
    const radLat = lat * Math.PI / 180;
    const radLon = (lon + 90) * Math.PI / 180;
    const x = radius * 1.02 * Math.cos(radLat) * Math.sin(radLon);
    const y = radius * 1.02 * Math.sin(radLat);
    const z = radius * 1.02 * Math.cos(radLat) * Math.cos(radLon);
    return new THREE.Vector3(x, y, z);
  };
  
  const parallels = [-60, -30, 30, 60].map(createLatitudeLine);
  const meridians = [-150, -120, -90, -60, -30, 30, 60, 90, 120, 150].map(createLongitudeLine);

  const getCircleOutline = (r, segments, thetaStart = 0, thetaLength = Math.PI * 2) => {
    const pts = [];
    for (let i = 0; i <= segments; i++) {
      const theta = thetaStart + (i / segments) * thetaLength;
      pts.push(new THREE.Vector3(r * Math.cos(theta), r * Math.sin(theta), 0));
    }
    if (thetaLength < Math.PI * 2 * 0.99) {
      pts.push(new THREE.Vector3(0, 0, 0));
      pts.push(new THREE.Vector3(r * Math.cos(thetaStart), r * Math.sin(thetaStart), 0));
    }
    return pts;
  };

  return (
    <group ref={globeRef} rotation={[0, Math.PI, 0]}>
      {/* Base Globe */}
      {(currentTask < 11 || currentTask === 16) && (
        <Sphere args={[radius, 64, 64]}>
          <meshStandardMaterial map={colorMap} roughness={0.6} metalness={0.1} />
        </Sphere>
      )}

      {/* Graticule - Parallels */}
      {(currentTask === 3 || currentTask === 5 || currentTask === 6 || currentTask === 7 || currentTask === 8 || currentTask === 10 || currentTask === 16) && parallels.map((points, idx) => (
        <Line key={`lat-${idx}`} points={points} color="#ffffff" lineWidth={2.5} transparent opacity={0.7} />
      ))}
      
      {/* Graticule - Meridians */}
      {(currentTask === 3 || currentTask === 6 || currentTask === 10 || currentTask === 16) && meridians.map((points, idx) => (
        <Line key={`lon-${idx}`} points={points} color="#ffffff" lineWidth={2.5} transparent opacity={0.7} />
      ))}

      {/* Equator */}
      {(currentTask >= 1 && currentTask <= 8 && currentTask !== 4 && currentTask !== 2) || currentTask === 10 ? (
        <Line points={createLatitudeLine(0)} color="#fbbf24" lineWidth={7.5} />
      ) : null}

      {/* Prime Meridian */}
      {(currentTask === 2 || currentTask === 3 || currentTask === 6 || currentTask === 10 || currentTask === 16) && (
        <Line points={createLongitudeLine(0)} color="#fbbf24" lineWidth={7.5} />
      )}

      {/* 180 Degree Line */}
      {(currentTask === 3 || currentTask === 6 || currentTask === 10 || currentTask === 16) && (
        <Line points={createLongitudeLine(180)} color="#60a5fa" lineWidth={6} transparent opacity={0.7} />
      )}

      {/* Task 4: Axis and Poles */}
      {currentTask === 4 && (
        <group>
          <Cylinder args={[0.02, 0.02, radius * 2.6, 16]} position={[0, 0, 0]}>
            <meshBasicMaterial color="#fbbf24" />
          </Cylinder>
          <mesh position={[0, radius, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
          <mesh position={[0, -radius, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
          <Html position={[0, radius * 1.15, 0]} center style={{ pointerEvents: 'none' }}>
            <div style={{ background: 'rgba(30,41,59,0.9)', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
              North Pole (90&deg;N)
            </div>
          </Html>
          <Html position={[0, -radius * 1.15, 0]} center style={{ pointerEvents: 'none' }}>
            <div style={{ background: 'rgba(30,41,59,0.9)', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
              South Pole (90&deg;S)
            </div>
          </Html>
        </group>
      )}

      {/* Task 7: Latitude Degree Labels */}
      {currentTask === 7 && (
        <group>
          {[{lat: 90, label: "90°N"}, {lat: 60, label: "60°N"}, {lat: 30, label: "30°N"}, 
            {lat: 0, label: "0°"}, 
            {lat: -30, label: "30°S"}, {lat: -60, label: "60°S"}, {lat: -90, label: "90°S"}].map((item, idx) => (
            <Html key={`deg-${idx}`} position={getPosFromLatLng(item.lat, -90)} center style={{ pointerEvents: 'none' }}>
              <div style={{ background: 'rgba(30,41,59,0.9)', color: '#fbbf24', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                {item.label}
              </div>
            </Html>
          ))}
        </group>
      )}

      {/* Task 6: Orange Pins (NY, Delhi, Tokyo) */}
      {currentTask === 6 && (
        <group>
          <mesh position={getPosFromLatLng(40.7, -74)}><sphereGeometry args={[0.05, 16, 16]} /><meshBasicMaterial color="#f97316" /></mesh>
          <Html position={getPosFromLatLng(40.7, -74)} center style={{ pointerEvents: 'none' }}>
            <div style={{ background: 'rgba(30,41,59,0.9)', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', border: '1px solid #f97316', transform: 'translateY(-15px)', whiteSpace: 'nowrap' }}>New York (74°W)</div>
          </Html>

          <mesh position={getPosFromLatLng(28.6, 77.2)}><sphereGeometry args={[0.05, 16, 16]} /><meshBasicMaterial color="#f97316" /></mesh>
          <Html position={getPosFromLatLng(28.6, 77.2)} center style={{ pointerEvents: 'none' }}>
            <div style={{ background: 'rgba(30,41,59,0.9)', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', border: '1px solid #f97316', transform: 'translateY(-15px)', whiteSpace: 'nowrap' }}>Delhi (77°E)</div>
          </Html>

          <mesh position={getPosFromLatLng(35.6, 139.6)}><sphereGeometry args={[0.05, 16, 16]} /><meshBasicMaterial color="#f97316" /></mesh>
          <Html position={getPosFromLatLng(35.6, 139.6)} center style={{ pointerEvents: 'none' }}>
            <div style={{ background: 'rgba(30,41,59,0.9)', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', border: '1px solid #f97316', transform: 'translateY(-15px)', whiteSpace: 'nowrap' }}>Tokyo (140°E)</div>
          </Html>
        </group>
      )}

      {/* Task 8: Climate Belts */}
      {currentTask === 8 && (
        <group>
          <mesh><sphereGeometry args={[radius * 1.005, 64, 64, 0, Math.PI * 2, (90 - 23.5) * Math.PI / 180, 47 * Math.PI / 180]} /><meshBasicMaterial color="#f97316" transparent opacity={0.35} side={THREE.DoubleSide} /></mesh>
          <mesh><sphereGeometry args={[radius * 1.005, 64, 64, 0, Math.PI * 2, (90 - 66.5) * Math.PI / 180, 43 * Math.PI / 180]} /><meshBasicMaterial color="#22c55e" transparent opacity={0.35} side={THREE.DoubleSide} /></mesh>
          <mesh><sphereGeometry args={[radius * 1.005, 64, 64, 0, Math.PI * 2, (90 + 23.5) * Math.PI / 180, 43 * Math.PI / 180]} /><meshBasicMaterial color="#22c55e" transparent opacity={0.35} side={THREE.DoubleSide} /></mesh>
          <mesh><sphereGeometry args={[radius * 1.005, 64, 64, 0, Math.PI * 2, 0, 23.5 * Math.PI / 180]} /><meshBasicMaterial color="#3b82f6" transparent opacity={0.35} side={THREE.DoubleSide} /></mesh>
          <mesh><sphereGeometry args={[radius * 1.005, 64, 64, 0, Math.PI * 2, (90 + 66.5) * Math.PI / 180, 23.5 * Math.PI / 180]} /><meshBasicMaterial color="#3b82f6" transparent opacity={0.35} side={THREE.DoubleSide} /></mesh>
        </group>
      )}

      {/* Task 9: India's Ancient Prime Meridian (Ujjain) */}
      {currentTask === 9 && (
        <group>
          {/* Reference: Modern Prime Meridian (Faded) */}
          <Line points={createLongitudeLine(0)} color="#ffffff" lineWidth={3} transparent opacity={0.4} />
          {/* Ancient Prime Meridian */}
          <Line points={createLongitudeLine(75.8)} color="#fbbf24" lineWidth={7.5} />
          {/* Ujjain City Pin */}
          <mesh position={getPosFromLatLng(23.2, 75.8)}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>
      )}
      
      {/* Target Point (Tasks that provide gridLat and gridLon) */}
      {(gridLat !== 0 || gridLon !== 0) && currentTask < 11 && (
        <group>
          <mesh position={getPosFromLatLng(gridLat, gridLon)}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#22c55e" />
          </mesh>
          {currentTask === 10 && (
            <Html position={getPosFromLatLng(gridLat, gridLon)} center style={{ pointerEvents: 'none' }}>
              <div style={{ background: 'rgba(30,41,59,0.9)', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', border: '1px solid #22c55e', transform: 'translateY(-15px)', whiteSpace: 'nowrap' }}>
                New Delhi (28.6°N, 77.2°E)
              </div>
            </Html>
          )}
        </group>
      )}

      {/* Task 16: Longitude and Time (Day/Night Shadow) */}
      {currentTask === 16 && (
        <mesh rotation-y={Math.PI / 2}>
          <sphereGeometry args={[radius * 1.015, 64, 64, 0, Math.PI]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.65} depthWrite={false} />
        </mesh>
      )}

      {/* Task 11: Western & Eastern Hemispheres */}
      {currentTask === 11 && (() => {
        const offset = 0.4;
        const westPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), -offset);
        const eastPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), -offset);
        
        return (
          <group>
            <group position={[offset, 0, 0]}>
              <Sphere args={[radius, 64, 64]}>
                <meshStandardMaterial map={colorMap} color="#ffffff" emissive="#0f172a" roughness={0.6} metalness={0.1} transparent={true} opacity={0.92} side={THREE.FrontSide} clippingPlanes={[westPlane]} />
              </Sphere>
              <mesh rotation={[0, Math.PI / 2, 0]}>
                <circleGeometry args={[radius, 64]} />
                <meshBasicMaterial color="#0f172a" side={THREE.DoubleSide} polygonOffset={true} polygonOffsetFactor={1} polygonOffsetUnits={1} />
                <Line points={getCircleOutline(radius, 64)} color="white" lineWidth={3} />
              </mesh>
            </group>

            <group position={[-offset, 0, 0]}>
              <Sphere args={[radius, 64, 64]}>
                <meshStandardMaterial map={colorMap} color="#ffffff" emissive="#0f172a" roughness={0.6} metalness={0.1} transparent={true} opacity={0.92} side={THREE.FrontSide} clippingPlanes={[eastPlane]} />
              </Sphere>
              <mesh rotation={[0, Math.PI / 2, 0]}>
                <circleGeometry args={[radius, 64]} />
                <meshBasicMaterial color="#0f172a" side={THREE.DoubleSide} polygonOffset={true} polygonOffsetFactor={1} polygonOffsetUnits={1} />
                <Line points={getCircleOutline(radius, 64)} color="white" lineWidth={3} />
              </mesh>
            </group>
          </group>
        );
      })()}

      {/* Task 12: Northern & Southern Hemispheres */}
      {currentTask === 12 && (() => {
        const offset = 0.4;
        const northPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -offset);
        const southPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), -offset);
        
        return (
          <group>
            <group position={[0, offset, 0]}>
              <Sphere args={[radius, 64, 64]}>
                <meshStandardMaterial map={colorMap} color="#ffffff" emissive="#0f172a" roughness={0.6} metalness={0.1} transparent={true} opacity={0.92} side={THREE.FrontSide} clippingPlanes={[northPlane]} />
              </Sphere>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <circleGeometry args={[radius, 64]} />
                <meshBasicMaterial color="#0f172a" side={THREE.DoubleSide} polygonOffset={true} polygonOffsetFactor={1} polygonOffsetUnits={1} />
                <Line points={getCircleOutline(radius, 64)} color="white" lineWidth={3} />
              </mesh>
            </group>

            <group position={[0, -offset, 0]}>
              <Sphere args={[radius, 64, 64]}>
                <meshStandardMaterial map={colorMap} color="#ffffff" emissive="#0f172a" roughness={0.6} metalness={0.1} transparent={true} opacity={0.92} side={THREE.FrontSide} clippingPlanes={[southPlane]} />
              </Sphere>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <circleGeometry args={[radius, 64]} />
                <meshBasicMaterial color="#0f172a" side={THREE.DoubleSide} polygonOffset={true} polygonOffsetFactor={1} polygonOffsetUnits={1} />
                <Line points={getCircleOutline(radius, 64)} color="white" lineWidth={3} />
              </mesh>
            </group>
          </group>
        );
      })()}

      {/* Task 13: The Four Quarters */}
      {currentTask === 13 && (() => {
        const offset = 0.25;
        const planeLeft = new THREE.Plane(new THREE.Vector3(-1, 0, 0), -offset);
        const planeRight = new THREE.Plane(new THREE.Vector3(1, 0, 0), -offset);
        const planeTop = new THREE.Plane(new THREE.Vector3(0, 1, 0), -offset);
        const planeBottom = new THREE.Plane(new THREE.Vector3(0, -1, 0), -offset);

        return (
          <group>
            <group position={[offset, offset, 0]}>
              <Sphere args={[radius, 64, 64]}>
                <meshStandardMaterial map={colorMap} color="#ffffff" emissive="#0f172a" roughness={0.6} metalness={0.1} transparent={true} opacity={0.92} side={THREE.FrontSide} clippingPlanes={[planeLeft, planeTop]} />
              </Sphere>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[radius, 32, -Math.PI / 2, Math.PI]} />
                <meshBasicMaterial color="#0f172a" side={THREE.DoubleSide} polygonOffset={true} polygonOffsetFactor={1} polygonOffsetUnits={1} />
                <Line points={getCircleOutline(radius, 32, -Math.PI / 2, Math.PI)} color="white" lineWidth={3} />
              </mesh>
              <mesh rotation={[0, Math.PI / 2, 0]}>
                <circleGeometry args={[radius, 32, 0, Math.PI]} />
                <meshBasicMaterial color="#0f172a" side={THREE.DoubleSide} polygonOffset={true} polygonOffsetFactor={1} polygonOffsetUnits={1} />
                <Line points={getCircleOutline(radius, 32, 0, Math.PI)} color="white" lineWidth={3} />
              </mesh>
            </group>
            
            <group position={[-offset, offset, 0]}>
              <Sphere args={[radius, 64, 64]}>
                <meshStandardMaterial map={colorMap} color="#ffffff" emissive="#0f172a" roughness={0.6} metalness={0.1} transparent={true} opacity={0.92} side={THREE.FrontSide} clippingPlanes={[planeRight, planeTop]} />
              </Sphere>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[radius, 32, Math.PI / 2, Math.PI]} />
                <meshBasicMaterial color="#0f172a" side={THREE.DoubleSide} polygonOffset={true} polygonOffsetFactor={1} polygonOffsetUnits={1} />
                <Line points={getCircleOutline(radius, 32, Math.PI / 2, Math.PI)} color="white" lineWidth={3} />
              </mesh>
              <mesh rotation={[0, Math.PI / 2, 0]}>
                <circleGeometry args={[radius, 32, 0, Math.PI]} />
                <meshBasicMaterial color="#0f172a" side={THREE.DoubleSide} polygonOffset={true} polygonOffsetFactor={1} polygonOffsetUnits={1} />
                <Line points={getCircleOutline(radius, 32, 0, Math.PI)} color="white" lineWidth={3} />
              </mesh>
            </group>

            <group position={[offset, -offset, 0]}>
              <Sphere args={[radius, 64, 64]}>
                <meshStandardMaterial map={colorMap} color="#ffffff" emissive="#0f172a" roughness={0.6} metalness={0.1} transparent={true} opacity={0.92} side={THREE.FrontSide} clippingPlanes={[planeLeft, planeBottom]} />
              </Sphere>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[radius, 32, -Math.PI / 2, Math.PI]} />
                <meshBasicMaterial color="#0f172a" side={THREE.DoubleSide} polygonOffset={true} polygonOffsetFactor={1} polygonOffsetUnits={1} />
                <Line points={getCircleOutline(radius, 32, -Math.PI / 2, Math.PI)} color="white" lineWidth={3} />
              </mesh>
              <mesh rotation={[0, Math.PI / 2, 0]}>
                <circleGeometry args={[radius, 32, Math.PI, Math.PI]} />
                <meshBasicMaterial color="#0f172a" side={THREE.DoubleSide} polygonOffset={true} polygonOffsetFactor={1} polygonOffsetUnits={1} />
                <Line points={getCircleOutline(radius, 32, Math.PI, Math.PI)} color="white" lineWidth={3} />
              </mesh>
            </group>

            <group position={[-offset, -offset, 0]}>
              <Sphere args={[radius, 64, 64]}>
                <meshStandardMaterial map={colorMap} color="#ffffff" emissive="#0f172a" roughness={0.6} metalness={0.1} transparent={true} opacity={0.92} side={THREE.FrontSide} clippingPlanes={[planeRight, planeBottom]} />
              </Sphere>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[radius, 32, Math.PI / 2, Math.PI]} />
                <meshBasicMaterial color="#0f172a" side={THREE.DoubleSide} polygonOffset={true} polygonOffsetFactor={1} polygonOffsetUnits={1} />
                <Line points={getCircleOutline(radius, 32, Math.PI / 2, Math.PI)} color="white" lineWidth={3} />
              </mesh>
              <mesh rotation={[0, Math.PI / 2, 0]}>
                <circleGeometry args={[radius, 32, Math.PI, Math.PI]} />
                <meshBasicMaterial color="#0f172a" side={THREE.DoubleSide} polygonOffset={true} polygonOffsetFactor={1} polygonOffsetUnits={1} />
                <Line points={getCircleOutline(radius, 32, Math.PI, Math.PI)} color="white" lineWidth={3} />
              </mesh>
            </group>

            <Html position={[radius * 1.2, radius * 0.6, 0]} center style={{ pointerEvents: 'none' }}>
              <div style={{ background: 'rgba(30,41,59,0.9)', color: '#fff', padding: '6px 14px', borderRadius: '16px', fontSize: '14px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                Northern + Western
              </div>
            </Html>
            <Html position={[-radius * 1.2, radius * 0.6, 0]} center style={{ pointerEvents: 'none' }}>
              <div style={{ background: 'rgba(30,41,59,0.9)', color: '#fff', padding: '6px 14px', borderRadius: '16px', fontSize: '14px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                Northern + Eastern
              </div>
            </Html>
            <Html position={[radius * 1.2, -radius * 0.6, 0]} center style={{ pointerEvents: 'none' }}>
              <div style={{ background: 'rgba(30,41,59,0.9)', color: '#fff', padding: '6px 14px', borderRadius: '16px', fontSize: '14px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                Southern + Western
              </div>
            </Html>
            <Html position={[-radius * 1.2, -radius * 0.6, 0]} center style={{ pointerEvents: 'none' }}>
              <div style={{ background: 'rgba(30,41,59,0.9)', color: '#fff', padding: '6px 14px', borderRadius: '16px', fontSize: '14px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                Southern + Eastern
              </div>
            </Html>
          </group>
        );
      })()}
    </group>
  );
};

const CameraResetter = ({ currentTask }) => {
  const { camera, controls } = useThree();
  useEffect(() => {
    if (controls) {
      controls.reset();
    }
    camera.position.set(0, 1.5, 6);
    camera.lookAt(0, 0, 0);
    camera.zoom = 1;
    camera.updateProjectionMatrix();
  }, [currentTask, camera, controls]);
  return null;
};

export default function Globe3D({ currentTask, latVal, lonVal, gridLat, gridLon }) {
  return (
    <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }} style={{ width: '100%', height: '100%', cursor: 'grab', background: 'black' }} gl={{ localClippingEnabled: true }}>
      <color attach="background" args={['black']} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 15, 10]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={1.0} color="#3b82f6" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <Globe 
        currentTask={currentTask} 
        latVal={latVal} 
        lonVal={lonVal} 
        gridLat={gridLat} 
        gridLon={gridLon} 
      />
      
      <Comet currentTask={currentTask} />
      
      <OrbitControls 
        makeDefault
        enableZoom={true} 
        enablePan={false} 
        autoRotate={false} 
        minDistance={3}
        maxDistance={10}
      />
      <CameraResetter currentTask={currentTask} />
    </Canvas>
  );
}
