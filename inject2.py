import sys

code = """
const LabHexagonal = () => {
  const [stage, setStage] = useState('BUILD');
  const [substep, setSubstep] = useState(0); 
  const [buildSize, setBuildSize] = useState(1);

  const handleAction = (action) => {
    if (action === 'BUILD') {
      if (stage !== 'BUILD') { setStage('BUILD'); setBuildSize(1); setSubstep(0); }
      else { setBuildSize(s => Math.min(3, s + 1)); setSubstep(0); }
    } else {
      setStage(action); setBuildSize(3); setSubstep(0);
    }
  };

  useEffect(() => {
    let timer;
    if (stage === 'BUILD') {
      if (substep === 0 && buildSize > 1) timer = setTimeout(() => setSubstep(1), 1000); 
    } else if (stage === 'PEEL') {
      if (substep === 0) timer = setTimeout(() => setSubstep(1), 1200); 
      if (substep === 1) timer = setTimeout(() => setSubstep(2), 1500); 
      if (substep === 2) timer = setTimeout(() => setSubstep(3), 1500); 
    } else if (stage === 'SQUASH') {
      if (substep === 0) timer = setTimeout(() => setSubstep(1), 1200);
      if (substep === 1) timer = setTimeout(() => setSubstep(2), 1500); // Morphing
      if (substep === 2) timer = setTimeout(() => setSubstep(3), 1200); // Ring 0
      if (substep === 3) timer = setTimeout(() => setSubstep(4), 1200); // Ring 1
      if (substep === 4) timer = setTimeout(() => setSubstep(5), 1200); // Ring 2
      if (substep === 5) timer = setTimeout(() => setSubstep(6), 1200); // Total
    } else if (stage === 'REVEAL') {
      if (substep === 0) timer = setTimeout(() => setSubstep(1), 1200); 
      if (substep === 1) timer = setTimeout(() => setSubstep(2), 1200); 
      if (substep === 2) timer = setTimeout(() => setSubstep(3), 1200); 
    }
    return () => clearTimeout(timer);
  }, [stage, substep, buildSize]);

  // INCREASED SCALE MASSIVELY
  const s = 110; 
  
  const blocks = [];
  for (let z = 0; z < 3; z++) {
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        const shell = Math.max(x, y, z) + 1;
        blocks.push({x, y, z, shell});
      }
    }
  }
  blocks.sort((a, b) => (a.x + a.y + a.z) - (b.x + b.y + b.z));

  const hexCoords = [
    {q:0,r:0, ring: 0},
    {q:1,r:0, ring: 1}, {q:1,r:-1, ring: 1}, {q:0,r:-1, ring: 1}, {q:-1,r:0, ring: 1}, {q:-1,r:1, ring: 1}, {q:0,r:1, ring: 1},
    {q:2,r:0, ring: 2}, {q:2,r:-1, ring: 2}, {q:2,r:-2, ring: 2}, {q:1,r:-2, ring: 2}, {q:0,r:-2, ring: 2}, {q:-1,r:-1, ring: 2}, {q:-2,r:0, ring: 2}, {q:-2,r:1, ring: 2}, {q:-2,r:2, ring: 2}, {q:-1,r:2, ring: 2}, {q:0,r:2, ring: 2}, {q:1,r:1, ring: 2}
  ];
  const shell3Blocks = blocks.filter(b => b.shell === 3);
  const hexMap = new Map();
  shell3Blocks.forEach((b, i) => hexMap.set(`${b.x}-${b.y}-${b.z}`, hexCoords[i]));

  const colors = {
    1: { top: '#2563eb', left: '#1d4ed8', right: '#1e40af', dot: '#60a5fa' },
    2: { top: '#8b5cf6', left: '#7c3aed', right: '#6d28d9', dot: '#c084fc' },
    3: { top: '#d946ef', left: '#c026d3', right: '#a21caf', dot: '#f472b6' },
  };

  const isSquashed = stage === 'SQUASH' || stage === 'REVEAL';
  const cameraTransform = isSquashed ? 'rotateX(0deg) rotateZ(0deg)' : 'rotateX(12deg) rotateZ(-6deg)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px 32px', boxSizing: 'border-box' }}>
      
      {/* Visual Canvas containing 3 Zones */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <svg viewBox="0 0 2000 1000" style={{ width: '100%', height: '100%', overflow: 'visible', fontFamily: 'system-ui, sans-serif' }}>
          
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="16" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="drop-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="16" stdDeviation="12" floodColor="#000" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* ZONE 1: LEFT TEXT */}
          <g style={{ opacity: stage !== 'REVEAL' ? 1 : 0, transition: 'opacity 0.8s' }}>
            {/* Top Text Centered over Left Zone (cx=400) */}
            <text x="400" y="150" fill="#fff" fontSize="48" fontWeight="bold" textAnchor="middle">
              {stage === 'BUILD' ? 'BUILDING THE CUBE' : (stage === 'PEEL' ? 'EXPLODED VIEW' : '19 SHELL BLOCKS')}
            </text>
            
            {stage === 'BUILD' && (
              <g style={{ opacity: 1, transition: 'opacity 0.5s' }}>
                <text x="400" y="850" fill="#94a3b8" fontSize="40" fontWeight="bold" textAnchor="middle">
                  {buildSize} × {buildSize} × {buildSize}
                </text>
                <text x="400" y="910" fill="#fff" fontSize="48" fontWeight="bold" textAnchor="middle">
                  {buildSize === 1 ? '1³ = 1 BLOCK' : `${buildSize}³ = ${buildSize*buildSize*buildSize} BLOCKS`}
                </text>
                
                <g style={{ opacity: substep >= 1 ? 1 : 0, transition: 'opacity 0.8s' }}>
                  <text x="400" y="980" fill={buildSize === 2 ? '#c084fc' : '#f472b6'} fontSize="40" fontWeight="bold" textAnchor="middle">
                    +{buildSize === 2 ? 7 : (buildSize === 3 ? 19 : 0)} NEW SHELL BLOCKS
                  </text>
                </g>
              </g>
            )}

            {stage === 'PEEL' && (
              <g style={{ opacity: 1, transition: 'opacity 0.5s' }}>
                <text x="400" y="800" fill="#94a3b8" fontSize="40" fontWeight="bold" textAnchor="middle" opacity={substep >= 0 ? 1 : 0.3} style={{transition: 'opacity 0.5s'}}>27 TOTAL BLOCKS</text>
                <text x="400" y="860" fill="#60a5fa" fontSize="40" fontWeight="bold" textAnchor="middle" opacity={substep >= 1 ? 1 : 0.3} style={{transition: 'opacity 0.5s'}}>− 8 CORE BLOCKS</text>
                <path d="M 200 900 L 600 900" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
                <text x="400" y="960" fill="#f472b6" fontSize="48" fontWeight="bold" textAnchor="middle" opacity={substep >= 2 ? 1 : 0.3} style={{transition: 'opacity 0.5s'}}>19 SHELL BLOCKS</text>
              </g>
            )}

            {stage === 'SQUASH' && (
              <g style={{ opacity: 1, transition: 'opacity 0.5s' }}>
                <text x="400" y="850" fill="#94a3b8" fontSize="40" fontWeight="bold" textAnchor="middle">Rearrange the shell's blocks</text>
                <text x="400" y="910" fill="#94a3b8" fontSize="40" fontWeight="bold" textAnchor="middle">into a centered hexagonal pattern.</text>
              </g>
            )}
          </g>

          {/* ZONE 2: CENTER TEXT (TRANSFORMATION) */}
          <g style={{ opacity: stage === 'SQUASH' ? 1 : 0, transition: 'opacity 0.8s' }}>
            <text x="1000" y="150" fill="#fff" fontSize="48" fontWeight="bold" textAnchor="middle">TRANSFORMATION</text>
            <path d="M 600 450 L 1300 450" stroke="#f472b6" strokeWidth="4" strokeDasharray="16 16" opacity="0.4" style={{pointerEvents: 'none'}} />
            <polygon points="1280,430 1320,450 1280,470" fill="#f472b6" opacity="0.4" />
          </g>

          {/* ZONE 3: RIGHT TEXT (Hexagon Lattice details) */}
          <g style={{ opacity: stage === 'SQUASH' ? 1 : 0, transition: 'opacity 0.8s' }}>
            <text x="1600" y="150" fill="#fff" fontSize="48" fontWeight="bold" textAnchor="middle">MATHEMATICAL LATTICE</text>
            <g style={{ opacity: substep >= 3 ? 1 : 0, transition: 'opacity 0.8s' }}>
              <text x="1600" y="780" fill="#60a5fa" fontSize="40" fontWeight="bold" textAnchor="middle">CENTER = 1</text>
            </g>
            <g style={{ opacity: substep >= 4 ? 1 : 0, transition: 'opacity 0.8s' }}>
              <text x="1600" y="840" fill="#c084fc" fontSize="40" fontWeight="bold" textAnchor="middle">+ FIRST RING = 6</text>
            </g>
            <g style={{ opacity: substep >= 5 ? 1 : 0, transition: 'opacity 0.8s' }}>
              <text x="1600" y="900" fill="#f472b6" fontSize="40" fontWeight="bold" textAnchor="middle">+ SECOND RING = 12</text>
            </g>
            <g style={{ opacity: substep >= 6 ? 1 : 0, transition: 'opacity 0.8s' }}>
              <path d="M 1400 930 L 1800 930" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
              <text x="1600" y="990" fill="#10b981" fontSize="48" fontWeight="bold" textAnchor="middle">TOTAL = 19 POINTS</text>
            </g>
          </g>

          {/* MAIN 3D / 2D GEOMETRY CANVAS */}
          {/* Base perspective wrap */}
          <g style={{ transformStyle: 'preserve-3d', transform: cameraTransform, transition: 'transform 1.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
            
            {blocks.map((b) => {
              let isVisible = true;
              let is2D = false;
              let hide3D = false;
              
              // Isometric 3D Base
              let isoX = (b.x - b.y) * s;
              let isoY = ((b.x + b.y) * s / 2) - (b.z * s);
              
              // BASE POSITIONS: Left Zone (400), Center Zone (1000), Right Zone (1600)
              let cx = 400; 
              let cy = 500;

              let blockOpacity = 1;
              let dotOpacity = 0;
              let dotColor = colors[b.shell].dot;

              if (stage === 'BUILD') {
                if (b.shell > buildSize) {
                  isVisible = false;
                  isoX += isoX * 0.5;
                  isoY -= 600;
                }
              }
              else if (stage === 'PEEL') {
                if (b.shell === 3 && substep >= 1) {
                  // Radially explode the shell outward
                  isoX += isoX * 1.6;
                  isoY += isoY * 1.6;
                }
                if (substep >= 2 && b.shell < 3) blockOpacity = 0.15; // Dim core
              }
              else if (stage === 'SQUASH') {
                is2D = true;
                if (b.shell < 3) {
                  isVisible = false; // Core vanishes
                } else {
                  // Move from Left Zone (400) to Right Zone (1600)
                  cx = substep >= 1 ? 1600 : 400; // Move to right zone
                  cy = substep >= 1 ? 450 : 500; // Center vertically
                  
                  if (substep >= 1) {
                    hide3D = true;
                    dotOpacity = 1;
                    
                    // Hex coordinate mapping
                    const hc = hexMap.get(`${b.x}-${b.y}-${b.z}`);
                    const D = 70; // Spacing for massive 2D dots
                    // Axial to pixel
                    isoX = D * Math.sqrt(3) * (hc.q + hc.r/2);
                    isoY = D * 3/2 * hc.r;
                    
                    // Sequential illumination
                    if (hc.ring > substep - 3) {
                      dotOpacity = 0.15;
                      dotColor = '#475569';
                    }
                  } else {
                    // Still 3D exploded
                    isoX += isoX * 1.6;
                    isoY += isoY * 1.6;
                  }
                }
              }
              else if (stage === 'REVEAL') {
                if (b.shell === 3) isVisible = false; // We draw dedicated 2D shells for REVEAL instead of reusing blocks for clarity
                else {
                  cx = 400; 
                  cy = 400; // Cube sits exactly on the left
                }
              }

              if (!isVisible) blockOpacity = 0;

              return (
                <g key={`${b.x}-${b.y}-${b.z}`} style={{ 
                  opacity: blockOpacity,
                  transform: `translate(${cx + isoX}px, ${cy + isoY}px)`, 
                  transition: `all 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${isVisible ? b.shell * 0.05 : 0}s`,
                  filter: (!is2D && isVisible) ? 'url(#drop-shadow)' : 'none'
                }}>
                  <g style={{ 
                    transformOrigin: `0px ${s}px`, 
                    transform: hide3D ? 'scale(0)' : 'scale(1)', 
                    opacity: hide3D ? 0 : 1, 
                    transition: 'all 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)' 
                  }}>
                    <polygon points={`0,0 ${s},${s/2} 0,${s} -${s},${s/2}`} fill={colors[b.shell].top} stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinejoin="round" />
                    <polygon points={`0,${s} ${s},${s/2} ${s},${s*1.5} 0,${s*2}`} fill={colors[b.shell].right} stroke="rgba(0,0,0,0.4)" strokeWidth="2" strokeLinejoin="round" />
                    <polygon points={`0,${s} -${s},${s/2} -${s},${s*1.5} 0,${s*2}`} fill={colors[b.shell].left} stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeLinejoin="round" />
                  </g>
                  
                  <circle 
                    cx="0" cy={s} r="28" 
                    fill={dotColor} 
                    filter={dotOpacity > 0.5 ? "url(#glow)" : "none"}
                    style={{ 
                      transformOrigin: `0px ${s}px`,
                      transform: hide3D ? 'scale(1)' : 'scale(0)',
                      opacity: dotOpacity, 
                      transition: 'all 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)' 
                    }} 
                  />
                </g>
              );
            })}
            
            {/* Hexagon Outline inside the 3D perspective wrap so it stays flat in SQUASH */}
            <g transform={`translate(1600, 560)`} style={{ opacity: (stage === 'SQUASH' && substep >= 6) ? 1 : 0, transition: 'opacity 1.2s ease', pointerEvents: 'none' }}>
              <path d="M 0 -210 L 180 -105 L 180 105 L 0 210 L -180 105 L -180 -105 Z" fill="none" stroke="#f472b6" strokeWidth="6" strokeDasharray="16 16" opacity="0.6" />
            </g>
          </g>

          {/* STAGE 4: REVEAL FINAL AHA LAYOUT */}
          {stage === 'REVEAL' && (
            <g style={{ opacity: 1, animation: 'fadeIn 1s ease forwards' }}>
              {/* CUBE MATH ON LEFT */}
              <text x="400" y="750" fill="#fff" fontSize="48" fontWeight="bold" textAnchor="middle">3 × 3 × 3 CUBE</text>
              <text x="400" y="820" fill="#38bdf8" fontSize="48" fontWeight="bold" textAnchor="middle">27 BLOCKS = 3³</text>
              
              {/* THE 3 HEXAGONS ON RIGHT (x=1000, 1350, 1700) */}
              <text x="1350" y="150" fill="#fff" fontSize="48" fontWeight="bold" textAnchor="middle">CENTERED HEXAGONAL SHELLS</text>
              
              {/* Shell 1 */}
              <g transform="translate(1000, 450)">
                <circle cx="0" cy="0" r="24" fill="#60a5fa" filter="url(#glow)" />
                <text x="0" y="220" fill="#60a5fa" fontSize="40" fontWeight="bold" textAnchor="middle">1 POINT</text>
                <g style={{opacity: substep >= 1 ? 1 : 0, transition: 'opacity 0.8s'}}>
                  <text x="0" y="280" fill="#94a3b8" fontSize="40" textAnchor="middle">↓</text>
                  <text x="0" y="340" fill="#fff" fontSize="48" fontWeight="bold" textAnchor="middle">1³</text>
                </g>
              </g>

              {/* + Signs */}
              <g style={{opacity: substep >= 2 ? 1 : 0, transition: 'opacity 0.8s'}}>
                <text x="1175" y="450" fill="#94a3b8" fontSize="80" fontWeight="bold" textAnchor="middle">+</text>
                <text x="1525" y="450" fill="#94a3b8" fontSize="80" fontWeight="bold" textAnchor="middle">+</text>
              </g>

              {/* Shell 2 */}
              <g transform="translate(1350, 450)">
                <circle cx="0" cy="0" r="24" fill="#c084fc" filter="url(#glow)" />
                {[...Array(6)].map((_, i) => {
                   const a = i * Math.PI / 3;
                   return <circle key={i} cx={Math.cos(a)*60} cy={Math.sin(a)*60} r="24" fill="#c084fc" filter="url(#glow)" />
                })}
                <text x="0" y="220" fill="#c084fc" fontSize="40" fontWeight="bold" textAnchor="middle">7 POINTS</text>
                <g style={{opacity: substep >= 1 ? 1 : 0, transition: 'opacity 0.8s'}}>
                  <text x="0" y="280" fill="#94a3b8" fontSize="40" textAnchor="middle">↓</text>
                  <text x="0" y="340" fill="#fff" fontSize="48" fontWeight="bold" textAnchor="middle">2³</text>
                </g>
              </g>

              {/* Shell 3 */}
              <g transform="translate(1700, 450)">
                <circle cx="0" cy="0" r="24" fill="#f472b6" filter="url(#glow)" />
                {[...Array(6)].map((_, i) => {
                   const a = i * Math.PI / 3;
                   return <circle key={i} cx={Math.cos(a)*60} cy={Math.sin(a)*60} r="24" fill="#f472b6" filter="url(#glow)" />
                })}
                {[...Array(12)].map((_, i) => {
                   const a1 = i * Math.PI / 6;
                   const r = i % 2 === 0 ? 120 : 120 * Math.sqrt(3)/2; 
                   return <circle key={i} cx={Math.cos(a1)*r} cy={Math.sin(a1)*r} r="24" fill="#f472b6" filter="url(#glow)" />
                })}
                <text x="0" y="220" fill="#f472b6" fontSize="40" fontWeight="bold" textAnchor="middle">19 POINTS</text>
                <g style={{opacity: substep >= 1 ? 1 : 0, transition: 'opacity 0.8s'}}>
                  <text x="0" y="280" fill="#94a3b8" fontSize="40" textAnchor="middle">↓</text>
                  <text x="0" y="340" fill="#fff" fontSize="48" fontWeight="bold" textAnchor="middle">3³</text>
                </g>
              </g>
              
              {/* FINAL EQUATION */}
              <g style={{opacity: substep >= 2 ? 1 : 0, transition: 'opacity 1s'}}>
                <rect x="850" y="800" width="1000" height="150" rx="30" fill="rgba(16, 185, 129, 0.1)" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="4" />
                <text x="1350" y="900" fill="#10b981" fontSize="80" fontWeight="bold" textAnchor="middle">1 + 7 + 19 = 27 = 3³</text>
              </g>
            </g>
          )}
        </svg>

        {/* REVEAL FORMULA PANEL */}
        {stage === 'REVEAL' && (
          <div style={{ position: 'absolute', bottom: '40px', left: 0, width: '100%', display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 20 }}>
            <div style={{ padding: '24px 48px', background: 'rgba(16, 185, 129, 0.15)', border: '2px solid rgba(16, 185, 129, 0.4)', borderRadius: '24px', backdropFilter: 'blur(12px)', opacity: substep >= 3 ? 1 : 0, transition: 'all 1.5s ease', transform: substep >= 3 ? 'translateY(0)' : 'translateY(30px)' }}>
              <div style={{ color: '#10b981', fontSize: '24px', marginBottom: '8px', fontWeight: 'bold', letterSpacing: '2px', textAlign: 'center' }}>CENTERED HEXAGONAL NUMBERS</div>
              <div style={{ color: '#fff', fontSize: '42px', fontFamily: 'monospace', fontWeight: 'bold', textAlign: 'center' }}>
                n³ − (n−1)³ = <span style={{ color: '#10b981' }}>3n² − 3n + 1</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Strict Bottom Navigation Buttons */}
      <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', marginTop: '32px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 100 }}>
        <button onClick={() => handleAction('BUILD')} style={{ padding: '20px 40px', background: stage === 'BUILD' ? '#3b82f6' : 'rgba(255,255,255,0.05)', color: stage === 'BUILD' ? '#fff' : '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s', fontSize: '20px' }}>
          ① BUILD CUBE
        </button>
        <button onClick={() => handleAction('PEEL')} style={{ padding: '20px 40px', background: stage === 'PEEL' ? '#ec4899' : 'rgba(255,255,255,0.05)', color: stage === 'PEEL' ? '#fff' : '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s', fontSize: '20px' }}>
          ② EXPLODE SHELL
        </button>
        <button onClick={() => handleAction('SQUASH')} style={{ padding: '20px 40px', background: stage === 'SQUASH' ? '#a855f7' : 'rgba(255,255,255,0.05)', color: stage === 'SQUASH' ? '#fff' : '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s', fontSize: '20px' }}>
          ③ SHELL → HEXAGON
        </button>
        <button onClick={() => handleAction('REVEAL')} style={{ padding: '20px 40px', background: stage === 'REVEAL' ? '#10b981' : 'rgba(255,255,255,0.05)', color: stage === 'REVEAL' ? '#fff' : '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s', fontSize: '20px' }}>
          ④ REVEAL PATTERN
        </button>
      </div>
    </div>
  );
};
"""

import sys
with open(r"c:\\futurax\\Futura-Edtech\\src\\maths\\class6\\chapter1\\RelationsAmongSequences.jsx", "r", encoding="utf-8") as f:
    content = f.read()

start_idx = content.find("const LabHexagonal = () => {")
end_idx = content.find("const LabBasicSequences = () => {")

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + code + "\n" + content[end_idx:]
    with open(r"c:\\futurax\\Futura-Edtech\\src\\maths\\class6\\chapter1\\RelationsAmongSequences.jsx", "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Replaced LabHexagonal successfully.")
else:
    print("Failed to find bounds.")
    sys.exit(1)
