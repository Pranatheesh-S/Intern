import sys
import re

file_path = r'c:\futurax\Futura-Edtech\src\social\class6\locating_places\LocatingPlaces\components\CoordinatesPage.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

img_block_regex = r'<img\s+src="/single_orange_wedge\.png"[^>]*>\s*'

if re.search(img_block_regex, content):
    replacement = '''<Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
                <ambientLight intensity={1.2} />
                <directionalLight position={[0, 8, 2]} intensity={2.0} color="#fff" />
                <directionalLight position={[4, 3, 4]} intensity={0.8} color="#ffe0b2" />
                <RotatingWedge />
                <OrbitControls enableZoom={true} enablePan={false} />
              </Canvas>'''
    content = re.sub(img_block_regex, replacement, content)
    
    content = re.sub(r'<style>\{`\s*@keyframes wedgeFloat.*?`\}</style>\s*', '', content, flags=re.DOTALL)
    
    content = content.replace('<>\n                <Canvas', '<Canvas')
    content = content.replace('</Canvas>\n              </>', '</Canvas>')
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('Restored 3D Wedge Canvas successfully.')
else:
    print('Img tag not found')
