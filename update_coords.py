import sys
import re

file_path = r'c:\futurax\Futura-Edtech\src\social\class6\locating_places\LocatingPlaces\components\CoordinatesPage.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip_until = -1

realistic_wedge_code = """
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
"""

for i, line in enumerate(lines):
    if skip_until > i:
        continue
    
    # Remove CentralOrange
    if "const CentralOrange =" in line:
        skip_until = i + 98
        continue
        
    # Replace OrangeSlice to EdibleOrangeWedge
    if "const OrangeSlice =" in line:
        new_lines.append(realistic_wedge_code + "\n")
        skip_until = i + 261
        continue
        
    # Remove 3rd Column
    if "{/* COL 3: ORANGE SEGMENTS TOP-DOWN */}" in line:
        skip_until = i + 17
        continue
        
    if "<EdibleOrangeWedge i={selectedSegment} radius={radius} peeledMap={peeledMap} />" in line:
        new_lines.append("      <group rotation={[0, -Math.PI / 2 + Math.PI / 12, 0]}>\n        <RealisticWedge3D />\n      </group>\n")
        continue
        
    new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print('File updated successfully.')
