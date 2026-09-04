import sys
import re

file_path = r'c:\futurax\Futura-Edtech\src\social\class6\locating_places\LocatingPlaces\components\CoordinatesPage.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip_until = -1

replacement_code = """
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
      points.push(new THREE.Vector3(x - 0.6, curveY + wobbleY, z));
    }
    lines.push(<Line key={i} points={points} color="#ffedd5" lineWidth={1.5 + (i%2)*0.5} transparent opacity={0.6} />);
  }
  return <>{lines}</>;
};

const RealisticWedge3D = () => {
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
    geo.translate(-0.6, 0, -0.275); 
    
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);
      
      let nx = Math.max(0, Math.min(1, (x + 0.6) / 1.15));
      let scale = 0.1 + 0.9 * Math.pow(nx, 1.2); 
      
      let noise = Math.sin((x + 0.6) * 20) * Math.cos(y * 20) * 0.01;
      
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
    geo.translate(-0.6, 0, -0.285);
    
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);
      let nx = Math.max(0, Math.min(1, (x + 0.6) / 1.15));
      let ny = Math.abs(y / 0.45); 
      let bulge = (1 - Math.pow(nx - 0.6, 2)) * (1 - Math.pow(ny, 2)) * 0.25;
      z += Math.sign(z) * bulge; 
      pos.setXYZ(i, x, y, z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group>
      <mesh geometry={customGeo} rotation={[-Math.PI/2, 0, 0]}>
        <meshStandardMaterial attach="material-0" color="#ff8c00" roughness={0.5} />
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

const RotatingWedge = () => {
  const ref = React.useRef();
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5;
    }
  });
  return (
    <group ref={ref} rotation={[0.4, 0, 0.2]} scale={[1.8, 1.8, 1.8]}>
      <RealisticWedge3D />
    </group>
  );
};

const RealisticPeeledOrange = ({ selectedSegment, onSelect }) => {
  const peeledMap = useLoader(THREE.TextureLoader, '/src/assets/peeled_orange.jpg');
  const groupRef = React.useRef();
  const [hovered, setHovered] = React.useState(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  const radius = 1.3;
  const numSlices = 12;

  const sliceGeometries = React.useMemo(() => {
    const geos = [];
    for (let i = 0; i < numSlices; i++) {
      const geo = new THREE.SphereGeometry(radius, 32, 64, i * (Math.PI * 2) / numSlices, (Math.PI * 2) / numSlices);
      const uvs = geo.attributes.uv;
      for (let j = 0; j < uvs.count; j++) {
        const u = uvs.getX(j);
        uvs.setX(j, (u + i) / numSlices);
      }
      geos.push(geo);
    }
    return geos;
  }, [radius]);

  const createLatitudeLine = (lat) => {
    const segments = 64;
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
    let color = lon === 0 || lon === 180 ? "#ffffff" : lon > 0 ? "#fef08a" : "#bae6fd";
    let shadow = "0 2px 8px rgba(0,0,0,1), 0 0 4px rgba(0,0,0,0.8)";
    labels.push(
      <FadingLabel key={`lbl-${idx}`} pos={getPosFromLatLng(0, lon, 1.15)} color={color} text={labelText} textShadow={shadow} />
    );
  });

  return (
    <group ref={groupRef} rotation={[0, -Math.PI / 2, 0]}>
      {sliceGeometries.map((geo, i) => (
        <mesh 
          key={i} 
          geometry={geo}
          onClick={(e) => { e.stopPropagation(); onSelect(selectedSegment === i ? null : i); }}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(i); document.body.style.cursor = 'pointer'; }}
          onPointerOut={(e) => { e.stopPropagation(); setHovered(null); document.body.style.cursor = 'auto'; }}
        >
          <meshStandardMaterial 
            map={peeledMap} 
            roughness={0.7} 
            side={THREE.DoubleSide} 
            emissive="#ffffff"
            emissiveIntensity={hovered === i || selectedSegment === i ? 0.2 : 0}
          />
        </mesh>
      ))}

      <mesh position={[0, radius + 0.04, 0]}>
        <cylinderGeometry args={[0.02, 0.04, 0.15, 8]} />
        <meshStandardMaterial color="#4a2e15" roughness={0.9} />
      </mesh>

      {parallelsPts.map((points, idx) => (
        <Line key={`lat-${idx}`} points={points} color="#ffffff" lineWidth={2.5} transparent opacity={0.7} />
      ))}
      {meridiansPts.map((points, idx) => (
        <Line key={`lon-${idx}`} points={points} color="#ffffff" lineWidth={2.5} transparent opacity={0.7} />
      ))}
      <Line points={createLatitudeLine(0)} color="#fbbf24" lineWidth={7.5} />
      <Line points={createLongitudeLine(0)} color="#fbbf24" lineWidth={7.5} />
      <Line points={createLongitudeLine(180)} color="#60a5fa" lineWidth={6} transparent opacity={0.7} />
      {labels}
    </group>
  );
};
"""

for i, line in enumerate(lines):
    if skip_until > i:
        continue
    
    # We replace from CentralOrange up to OrangeModel (exclusive)
    if "const CentralOrange =" in line:
        new_lines.append(replacement_code + "\n")
        skip_until = i + 421 # line 40 to 460
        continue
        
    if "const InfographicStep =" in line:
        new_lines.append("const InfographicStep = ({ handleNext, handlePrev }) => {\n  const [selectedSegment, setSelectedSegment] = React.useState(null);\n")
        skip_until = i + 1
        continue
        
    if "<RealisticPeeledOrange />" in line:
        new_lines.append("              <RealisticPeeledOrange selectedSegment={selectedSegment} onSelect={setSelectedSegment} />\n")
        continue

    if "{/* COL 3: ORANGE SEGMENTS TOP-DOWN */}" in line:
        col3 = """
        {/* COL 3: SELECTED WEDGE VIEW */}
        <div style={{ flex: 0.85, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <div style={{ height: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ color: '#f97316', fontSize: '15px', fontWeight: '900', textAlign: 'center', marginBottom: '2px', letterSpacing: '0.5px' }}>Selected Longitude</div>
            <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 'bold', textAlign: 'center', minHeight: '32px' }}>
              {selectedSegment !== null ? "View inside the Orange" : "Click a slice on the globe"}
            </div>
          </div>
          <div style={{ flex: 1, width: '100%', position: 'relative', minHeight: 0 }}>
            {selectedSegment !== null && (
              <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
                <ambientLight intensity={1.2} />
                <directionalLight position={[0, 8, 2]} intensity={2.0} color="#fff" />
                <directionalLight position={[4, 3, 4]} intensity={0.8} color="#ffe0b2" />
                <RotatingWedge />
                <OrbitControls enableZoom={true} enablePan={false} />
              </Canvas>
            )}
          </div>
          <div style={{ height: '90px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', marginTop: '8px' }}>
            {selectedSegment !== null && (
              <div style={{ color: '#fbbf24', fontSize: '20px', fontWeight: '900', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                {(() => {
                  if (selectedSegment === 0) return '0° (Prime Meridian)';
                  if (selectedSegment < 6) return `${selectedSegment * 30}°E`;
                  if (selectedSegment === 6) return '180°';
                  return `${(12 - selectedSegment) * 30}°W`;
                })()}
              </div>
            )}
          </div>
        </div>
"""
        new_lines.append(col3)
        skip_until = i + 17
        continue
        
    new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print('File updated successfully.')
