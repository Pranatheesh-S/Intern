import sys

file_path = r'c:\futurax\Futura-Edtech\src\social\class6\locating_places\LocatingPlaces\components\CoordinatesPage.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_func_start = 'const RealisticWedge3D = () => {'
new_func_start = '''const RealisticWedge3D = () => {
  const fleshTex = useLoader(THREE.TextureLoader, '/orange_flesh.jpg');
  React.useMemo(() => {
    fleshTex.wrapS = THREE.RepeatWrapping;
    fleshTex.wrapT = THREE.RepeatWrapping;
    fleshTex.repeat.set(1.2, 1.2);
  }, [fleshTex]);
'''
content = content.replace(old_func_start, new_func_start)

old_mat = '<meshStandardMaterial attach="material-0" color="#ff8c00" roughness={0.5} />'
new_mat = '<meshPhysicalMaterial attach="material-0" map={fleshTex} color="#ffb347" roughness={0.2} metalness={0.1} clearcoat={1.0} clearcoatRoughness={0.1} transmission={0.2} thickness={0.5} />'
content = content.replace(old_mat, new_mat)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated successfully.')
