import sys

file_path = r'c:\futurax\Futura-Edtech\src\social\class6\locating_places\LocatingPlaces\components\CoordinatesPage.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_col3_content = '''          <div style={{ flex: 1, width: '100%', position: 'relative', minHeight: 0 }}>
            {selectedSegment !== null && (
              <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
                <ambientLight intensity={1.2} />
                <directionalLight position={[0, 8, 2]} intensity={2.0} color="#fff" />
                <directionalLight position={[4, 3, 4]} intensity={0.8} color="#ffe0b2" />
                <RotatingWedge />
                <OrbitControls enableZoom={true} enablePan={false} />
              </Canvas>
            )}
          </div>'''

new_col3_content = '''          <div style={{ flex: 1, width: '100%', position: 'relative', minHeight: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {selectedSegment !== null && (
              <>
                <img 
                  src="/orange_wedge_isolated.jpg" 
                  alt="Selected Orange Wedge" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%', 
                    objectFit: 'contain', 
                    mixBlendMode: 'screen',
                    transform: 'rotate(-10deg)',
                    animation: 'wedgeFloat 4s ease-in-out infinite' 
                  }} 
                />
                <style>{`
                  @keyframes wedgeFloat {
                    0% { transform: translateY(0px) rotate(-10deg); filter: drop-shadow(0 10px 15px rgba(249,115,22,0.3)); }
                    50% { transform: translateY(-15px) rotate(-8deg); filter: drop-shadow(0 25px 15px rgba(249,115,22,0.1)); }
                    100% { transform: translateY(0px) rotate(-10deg); filter: drop-shadow(0 10px 15px rgba(249,115,22,0.3)); }
                  }
                `}</style>
              </>
            )}
          </div>'''

content = content.replace(old_col3_content, new_col3_content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated successfully.')
