import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

// --- Step 1: Adding Odd Numbers ---
const AddingOddNumbers = () => {
  const [currentLevel, setCurrentLevel] = useState(0); // 0 to 5
  const maxLevels = 5;

  const equations = [
    { text: "1", result: "1", color: "#ef4444" },
    { text: "1 + 3", result: "4", color: "#f97316" },
    { text: "1 + 3 + 5", result: "9", color: "#f59e0b" },
    { text: "1 + 3 + 5 + 7", result: "16", color: "#84cc16" },
    { text: "1 + 3 + 5 + 7 + 9", result: "25", color: "#06b6d4" },
    { text: "1 + 3 + 5 + 7 + 9 + 11", result: "36", color: "#3b82f6" }
  ];

  const handleNext = () => {
    if (currentLevel < maxLevels) setCurrentLevel(prev => prev + 1);
  };

  const handleReset = () => {
    setCurrentLevel(0);
  };

  return (
    <div style={{ display: 'flex', gap: '40px', height: '100%' }}>
      {/* Left Panel: Math */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h3 style={{ fontSize: '24px', color: '#f8fafc', marginBottom: '16px' }}>Adding up Odd Numbers</h3>
        <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: 1.6, marginBottom: '32px' }}>
          What happens when we start adding up consecutive odd numbers? Let&apos;s build the sequence step-by-step.
        </p>

        <table style={{ borderCollapse: 'collapse', borderSpacing: 0, minHeight: '300px', width: '100%' }}>
          <tbody>
            {equations.map((eq, i) => (
              <tr key={i} style={{
                opacity: i <= currentLevel ? 1 : 0.2,
                transform: i <= currentLevel ? 'translateX(0)' : 'translateX(-20px)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: '20px',
                fontFamily: 'monospace',
                fontWeight: 'bold',
              }}>
                <td style={{ color: '#cbd5e1', textAlign: 'left', whiteSpace: 'nowrap', width: '250px', padding: '8px 0' }}>{eq.text}</td>
                <td style={{ color: '#94a3b8', textAlign: 'center', width: '30px', padding: '8px 0' }}>=</td>
                <td style={{ color: eq.color, fontSize: '28px', textAlign: 'left', width: '50px', padding: '8px 0' }}>{eq.result}</td>
                <td style={{ color: '#64748b', fontSize: '16px', textAlign: 'left', width: '60px', padding: '8px 0' }}>
                  {i <= currentLevel && <span className="anim-fade">({i + 1}²)</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', gap: '16px', marginTop: 'auto' }}>
          <button
            onClick={handleReset}
            disabled={currentLevel === 0}
            style={{
              padding: '12px 24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)',
              background: 'transparent', color: '#f8fafc', cursor: currentLevel === 0 ? 'not-allowed' : 'pointer',
              fontWeight: 'bold', opacity: currentLevel === 0 ? 0.5 : 1
            }}
          >
            Reset
          </button>
          <button
            onClick={handleNext}
            disabled={currentLevel === maxLevels}
            style={{
              padding: '12px 24px', borderRadius: '12px', border: 'none',
              background: currentLevel === maxLevels ? 'rgba(34, 197, 94, 0.5)' : '#3b82f6', 
              color: '#fff', cursor: currentLevel === maxLevels ? 'default' : 'pointer',
              fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px',
              transition: 'all 0.3s'
            }}
          >
            {currentLevel === maxLevels ? 'Sequence Complete' : 'Add Next Odd Number'}
          </button>
        </div>
      </div>

      {/* Right Panel: Visualization */}
      <div style={{ flex: 1, background: '#111827', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
        <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%', maxHeight: '400px' }}>
          <g transform="translate(82, 82)">
            {[0, 1, 2, 3, 4, 5].map((layer) => (
              <g key={layer} style={{ opacity: layer <= currentLevel ? 1 : 0, transition: 'opacity 0.3s' }}>
                {[...Array(layer * 2 + 1)].map((_, j) => {
                  const isTop = j <= layer;
                  const x = isTop ? j : layer;
                  const y = isTop ? layer : layer - (j - layer);
                  return (
                    <rect 
                      key={j} 
                      x={x * 40} 
                      y={y * 40} 
                      width="36" 
                      height="36" 
                      rx="8" 
                      fill={equations[layer].color} 
                      style={{ 
                        transform: layer <= currentLevel ? 'scale(1)' : 'scale(0)',
                        transformOrigin: `${x * 40 + 18}px ${y * 40 + 18}px`,
                        transition: `transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${j * 0.05}s`
                      }} 
                    />
                  );
                })}
              </g>
            ))}
          </g>
        </svg>

        {currentLevel === maxLevels && (
          <div className="anim-fade" style={{ position: 'absolute', bottom: '30px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '12px 24px', borderRadius: '12px', color: '#4ade80', fontWeight: 'bold' }}>
            Adding odd numbers forms perfect squares!
          </div>
        )}
      </div>
    </div>
  );
};

// --- Step 2: Adding Up and Down ---
const AddingUpAndDown = () => {
  const [currentLevel, setCurrentLevel] = useState(0); // 0 to 5
  const maxLevels = 5;

  const equations = [
    { text: "1", result: "1", activeDots: [0] },
    { text: "1 + 2 + 1", result: "4", activeDots: [0, 1, 2, 3] },
    { text: "1 + 2 + 3 + 2 + 1", result: "9", activeDots: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
    { text: "1 + 2 + 3 + 4 + 3 + 2 + 1", result: "16", activeDots: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] },
    { text: "1 + 2 + 3 + 4 + 5 + 4 + 3 + 2 + 1", result: "25", activeDots: [...Array(25).keys()] },
    { text: "1 + 2 + 3 + 4 + 5 + 6 + 5 + 4 + 3 + 2 + 1", result: "36", activeDots: [...Array(36).keys()] }
  ];

  const handleNext = () => { if (currentLevel < maxLevels) setCurrentLevel(prev => prev + 1); };
  const handleReset = () => { setCurrentLevel(0); };

  return (
    <div style={{ display: 'flex', gap: '40px', height: '100%' }}>
      {/* Left Panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h3 style={{ fontSize: '24px', color: '#f8fafc', marginBottom: '16px' }}>Adding Up and Down</h3>
        <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: 1.6, marginBottom: '32px' }}>
          What if we add counting numbers up, and then down? Notice how they magically form square numbers too!
        </p>

        <table style={{ borderCollapse: 'collapse', borderSpacing: 0, minHeight: '300px', width: '100%' }}>
          <tbody>
            {equations.map((eq, i) => (
              <tr key={i} style={{
                opacity: i <= currentLevel ? 1 : 0.2,
                transform: i <= currentLevel ? 'translateX(0)' : 'translateX(-20px)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: '18px',
                fontFamily: 'monospace',
                fontWeight: 'bold',
              }}>
                <td style={{ color: '#cbd5e1', textAlign: 'center', whiteSpace: 'nowrap', width: '400px', padding: '8px 0' }}>{eq.text}</td>
                <td style={{ color: '#94a3b8', textAlign: 'center', width: '30px', padding: '8px 0' }}>=</td>
                <td style={{ color: '#a855f7', fontSize: '24px', textAlign: 'left', padding: '8px 0' }}>{eq.result}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', gap: '16px', marginTop: 'auto' }}>
          <button
            onClick={handleReset}
            disabled={currentLevel === 0}
            style={{
              padding: '12px 24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)',
              background: 'transparent', color: '#f8fafc', cursor: currentLevel === 0 ? 'not-allowed' : 'pointer',
              fontWeight: 'bold', opacity: currentLevel === 0 ? 0.5 : 1
            }}
          >
            Reset
          </button>
          <button
            onClick={handleNext}
            disabled={currentLevel === maxLevels}
            style={{
              padding: '12px 24px', borderRadius: '12px', border: 'none',
              background: currentLevel === maxLevels ? 'rgba(168, 85, 247, 0.5)' : '#a855f7', 
              color: '#fff', cursor: currentLevel === maxLevels ? 'default' : 'pointer',
              fontWeight: 'bold', transition: 'all 0.3s'
            }}
          >
            {currentLevel === maxLevels ? 'Sequence Complete' : 'Next Step'}
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, background: '#111827', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
        <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%', maxHeight: '400px' }}>
          <g transform="translate(60, 60)">
            {/* Draw a 6x6 grid of dots, slice diagonally */}
            {[...Array(6)].map((_, row) => (
              <g key={row}>
                {[...Array(6)].map((_, col) => {
                  // Diagonals group dots where row+col = constant
                  const diagIndex = row + col; 
                  // For a grid up to currentLevel, max row/col is currentLevel
                  const isActive = row <= currentLevel && col <= currentLevel;
                  
                  // Color gradient across diagonals
                  const colors = ['#f87171', '#fb923c', '#fbbf24', '#a3e635', '#2dd4bf', '#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#e11d48', '#be123c'];
                  const color = colors[diagIndex % colors.length];

                  return (
                    <circle 
                      key={`${row}-${col}`} 
                      cx={col * 45} 
                      cy={row * 45} 
                      r={isActive ? "16" : "6"} 
                      fill={isActive ? color : "rgba(255,255,255,0.05)"} 
                      style={{ 
                        transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                      }} 
                    />
                  );
                })}
              </g>
            ))}
          </g>
        </svg>

        {currentLevel === maxLevels && (
          <div className="anim-fade" style={{ position: 'absolute', bottom: '30px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '12px 24px', borderRadius: '12px', color: '#c084fc', fontWeight: 'bold' }}>
            Slicing a square diagonally counts 1, 2, 3... and back down!
          </div>
        )}
      </div>
    </div>
  );
};

// --- Step 3: Figure It Out ---
const FigureItOut = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { title: "1. Triangular to Square", color: "#ec4899" },
    { title: "2. Powers of 2", color: "#10b981" },
    { title: "3. Hexagonal to Cube", color: "#fbbf24" }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '20px' }}>
      <h3 style={{ fontSize: '24px', color: '#f8fafc', margin: 0 }}>Figure it Out: Interactive Labs</h3>
      
      <div style={{ display: 'flex', gap: '12px' }}>
        {tabs.map((t, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            style={{
              padding: '12px 24px', borderRadius: '12px', border: `1px solid ${activeTab === i ? t.color : 'rgba(255,255,255,0.1)'}`,
              background: activeTab === i ? `${t.color}20` : 'rgba(255,255,255,0.02)', 
              color: activeTab === i ? t.color : '#94a3b8',
              fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            {t.title}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, background: '#111827', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.05)', position: 'relative', overflow: 'hidden' }}>
        {activeTab === 0 && <LabTriangular />}
        {activeTab === 1 && <LabPowers />}
        {activeTab === 2 && <LabHexagonal />}
      </div>
    </div>
  );
};

// --- Mini Labs ---

const LabTriangular = () => {
  const [merged, setMerged] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px', boxSizing: 'border-box' }}>
      <p style={{ color: '#f8fafc', fontSize: '18px' }}>What happens when you add two consecutive triangular numbers? (e.g. 6 + 10)</p>
      
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
        <svg viewBox="0 0 400 200" style={{ width: '100%', maxHeight: '300px' }}>
          <g transform="translate(100, 150)">
            {/* Triangle 1 (size 4, 10 dots) */}
            <g style={{ transform: merged ? 'translate(45px, -30px)' : 'translate(0, 0)', transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
              {[0, 1, 2, 3].map(row => (
                <g key={`t1-${row}`}>
                  {[...Array(row + 1)].map((_, col) => (
                    <circle key={col} cx={col * 30 - (row * 15)} cy={-row * 30} r="10" fill="#3b82f6" />
                  ))}
                </g>
              ))}
            </g>

            {/* Triangle 2 (size 3, 6 dots, inverted) */}
            <g style={{ transform: merged ? 'translate(45px, -30px)' : 'translate(120px, 0)', transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
              {[0, 1, 2].map(row => (
                <g key={`t2-${row}`}>
                  {[...Array(3 - row)].map((_, col) => (
                    <circle key={col} cx={col * 30 - ((2 - row) * 15) + 15} cy={-row * 30 - 30} r="10" fill="#ec4899" />
                  ))}
                </g>
              ))}
            </g>
          </g>
        </svg>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <button onClick={() => setMerged(!merged)} style={{ padding: '12px 32px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
          {merged ? 'Separate' : 'Combine Triangles'}
        </button>
      </div>
    </div>
  );
};

const LabPowers = () => {
  const [level, setLevel] = useState(0);
  const powers = [1, 2, 4, 8, 16];
  const currentSum = powers.slice(0, level + 1).reduce((a, b) => a + b, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px', boxSizing: 'border-box' }}>
      <p style={{ color: '#f8fafc', fontSize: '18px' }}>What happens when you add up powers of 2? (1 + 2 + 4 + ...)</p>
      
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '20px', minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
          {powers.map((p, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
              <div style={{ 
                width: '40px', 
                height: `${p * 15}px`, 
                background: i <= level ? '#10b981' : 'rgba(255,255,255,0.05)',
                borderRadius: '4px 4px 0 0',
                transition: 'all 0.5s'
              }} />
              <div style={{ color: i <= level ? '#10b981' : '#64748b', fontWeight: 'bold' }}>{p}</div>
            </div>
          ))}
          
          <div style={{ width: '40px', display: 'flex', justifyContent: 'center', fontSize: '24px', color: '#64748b', margin: '0 20px', paddingBottom: '26px' }}>=</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
            <div style={{ 
              width: '40px', 
              height: `${currentSum * 15}px`, 
              background: '#f59e0b',
              borderRadius: '4px 4px 0 0',
              transition: 'all 0.5s',
              position: 'relative'
            }}>
              {level < 4 && (
                <div style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', textAlign: 'center', color: '#f87171', fontSize: '12px', fontWeight: 'bold' }}>
                  (-1) from next
                </div>
              )}
            </div>
            <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>{currentSum}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button onClick={() => setLevel(prev => (prev + 1) % 5)} style={{ padding: '12px 32px', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
          Add Next Power
        </button>
      </div>
    </div>
  );
};


const LabHexagonal = () => {
  const [stage, setStage] = useState('BUILD');
  const [substep, setSubstep] = useState(0); 
  const [buildSize, setBuildSize] = useState(1);

  const handleAction = (action) => {
    if (action === 'BUILD') {
      if (stage !== 'BUILD') { setStage('BUILD'); setBuildSize(1); setSubstep(0); }
      else { setBuildSize(sz => Math.min(3, sz + 1)); setSubstep(0); }
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
      // Step-by-step choreography
      if (substep === 0) timer = setTimeout(() => setSubstep(1), 1200); // Isolate shell
      if (substep === 1) timer = setTimeout(() => setSubstep(2), 1500); // Flatten to plane
      if (substep === 2) timer = setTimeout(() => setSubstep(3), 1500); // Morph to dots
      if (substep === 3) timer = setTimeout(() => setSubstep(4), 1800); // Rearrange to hex on right
      if (substep === 4) timer = setTimeout(() => setSubstep(5), 1000); // Center ring
      if (substep === 5) timer = setTimeout(() => setSubstep(6), 1000); // Ring 1
      if (substep === 6) timer = setTimeout(() => setSubstep(7), 1000); // Ring 2 + Total
    } else if (stage === 'REVEAL') {
      if (substep === 0) timer = setTimeout(() => setSubstep(1), 1500); 
      if (substep === 1) timer = setTimeout(() => setSubstep(2), 1500); 
      if (substep === 2) timer = setTimeout(() => setSubstep(3), 1500); 
    }
    return () => clearTimeout(timer);
  }, [stage, substep, buildSize]);

  // INCREASED SCALE MASSIVELY
  const s = 110; 
  const gap = 12; // Gap for visible seams
  const effS = s + gap;
  
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
            <filter id="ao-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="30" result="blur" />
              <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.6 0"/>
            </filter>

            {/* PREMIUM 3D MATERIALS */}
            {/* CORE BLOCKS (Blue) */}
            <linearGradient id="core-top" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="core-left" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="core-right" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>

            {/* SHELL BLOCKS (Magenta) */}
            <linearGradient id="shell-top" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="shell-left" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#db2777" />
            </linearGradient>
            <linearGradient id="shell-right" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#be185d" />
              <stop offset="100%" stopColor="#9f1239" />
            </linearGradient>

            {/* VOLUMETRIC DOTS */}
            <radialGradient id="dot-core" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#2563eb" />
            </radialGradient>
            <radialGradient id="dot-shell" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fbcfe8" />
              <stop offset="50%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#be185d" />
            </radialGradient>
            <radialGradient id="dot-off" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1e293b" />
            </radialGradient>
          </defs>

          {/* ZONE 1: LEFT TEXT */}
          <g style={{ opacity: stage !== 'REVEAL' ? 1 : 0, transition: 'opacity 0.8s' }}>
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
                  <text x="400" y="980" fill="#f472b6" fontSize="40" fontWeight="bold" textAnchor="middle">
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
            <g style={{ opacity: substep >= 4 ? 1 : 0, transition: 'opacity 0.8s' }}>
              <text x="1600" y="780" fill="#60a5fa" fontSize="40" fontWeight="bold" textAnchor="middle">CENTER = 1</text>
            </g>
            <g style={{ opacity: substep >= 5 ? 1 : 0, transition: 'opacity 0.8s' }}>
              <text x="1600" y="840" fill="#c084fc" fontSize="40" fontWeight="bold" textAnchor="middle">+ FIRST RING = 6</text>
            </g>
            <g style={{ opacity: substep >= 6 ? 1 : 0, transition: 'opacity 0.8s' }}>
              <text x="1600" y="900" fill="#f472b6" fontSize="40" fontWeight="bold" textAnchor="middle">+ SECOND RING = 12</text>
            </g>
            <g style={{ opacity: substep >= 7 ? 1 : 0, transition: 'opacity 0.8s' }}>
              <path d="M 1400 930 L 1800 930" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
              <text x="1600" y="990" fill="#10b981" fontSize="48" fontWeight="bold" textAnchor="middle">TOTAL = 19 POINTS</text>
            </g>
          </g>

          {/* MAIN 3D / 2D GEOMETRY CANVAS */}
          <g style={{ transformStyle: 'preserve-3d', transform: cameraTransform, transition: 'transform 1.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
            
            {/* Soft Ambient Occlusion Ground Shadow */}
            <g style={{ opacity: stage === 'SQUASH' && substep >= 2 ? 0 : 0.8, transition: 'opacity 1s', transform: 'translate(400px, 680px)' }}>
               <ellipse cx="0" cy="0" rx="300" ry="120" fill="rgba(0,0,0,0.4)" filter="url(#ao-shadow)" />
            </g>

            {blocks.map((b) => {
              let isVisible = true;
              let is2D = false;
              let hide3D = false;
              
              // Isometric 3D Base (With Gaps)
              let isoX = (b.x - b.y) * effS;
              let isoY = ((b.x + b.y) * effS / 2) - (b.z * effS);
              
              let cx = 400; 
              let cy = 500;

              let blockOpacity = 1;
              let dotOpacity = 0;
              let dotColor = 'url(#dot-shell)';
              let materialPrefix = b.shell < 3 ? 'core' : 'shell';
              
              // Easing function adjustments for choreography
              let customTransition = 'all 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)';

              if (stage === 'BUILD') {
                if (b.shell > buildSize) {
                  isVisible = false;
                  isoX += isoX * 0.5;
                  isoY -= 600;
                }
              }
              else if (stage === 'PEEL') {
                if (b.shell === 3 && substep >= 1) {
                  // Radially explode the shell outward physically further
                  isoX += isoX * 1.6;
                  isoY += isoY * 1.6;
                }
                if (substep >= 2 && b.shell < 3) blockOpacity = 0.1; // Core is removed/dimmed highly
              }
              else if (stage === 'SQUASH') {
                is2D = true;
                if (b.shell < 3) {
                  isVisible = false; // Core vanishes completely
                } else {
                  // SQUASH CHOREOGRAPHY
                  // substep 0: 19 blocks in 3D (exploded)
                  isoX += isoX * 1.6;
                  isoY += isoY * 1.6;

                  if (substep >= 1) {
                    // Flatten to plane (move to center zone, remove vertical depth)
                    cx = 1000;
                    cy = 450;
                    // Reset isoY to remove 3D height, making them flat on the floor
                    isoY = ((b.x + b.y) * effS / 2);
                  }
                  
                  if (substep >= 2) {
                    // Morph 3D block to 2D dot
                    hide3D = true;
                    dotOpacity = 1;
                    // Hex coordinate mapping calculates perfect positions
                    const hc = hexMap.get(`${b.x}-${b.y}-${b.z}`);
                    const D = 75; // Even larger dots (300px dia)
                    // Axial to pixel for accurate hexagon
                    isoX = D * Math.sqrt(3) * (hc.q + hc.r/2);
                    isoY = D * 3/2 * hc.r;
                    
                    // Keep them unlit
                    dotOpacity = 0.3;
                    dotColor = 'url(#dot-off)';
                  }
                  
                  if (substep >= 3) {
                    // Move to Right Zone perfectly rearranged
                    cx = 1600;
                  }

                  // Sequence Illuminations
                  if (substep >= 4) {
                    const hc = hexMap.get(`${b.x}-${b.y}-${b.z}`);
                    if (hc.ring <= substep - 4) {
                      dotOpacity = 1;
                      dotColor = 'url(#dot-shell)';
                    }
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
                  {/* PREMIUM 3D BLOCK RENDERING */}
                  <g style={{ 
                    transformOrigin: `0px ${s}px`, 
                    transform: hide3D ? 'scale(0)' : 'scale(1)', 
                    opacity: hide3D ? 0 : 1, 
                    transition: customTransition 
                  }}>
                    {/* Top Face with White Bevel Highlight */}
                    <polygon points={`0,0 ${s},${s/2} 0,${s} -${s},${s/2}`} fill={`url(#${materialPrefix}-top)`} stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinejoin="round" />
                    {/* Right Face (Shadow Side) */}
                    <polygon points={`0,${s} ${s},${s/2} ${s},${s*1.5} 0,${s*2}`} fill={`url(#${materialPrefix}-right)`} stroke="rgba(0,0,0,0.5)" strokeWidth="2" strokeLinejoin="round" />
                    {/* Left Face */}
                    <polygon points={`0,${s} -${s},${s/2} -${s},${s*1.5} 0,${s*2}`} fill={`url(#${materialPrefix}-left)`} stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinejoin="round" />
                  </g>
                  
                  {/* PREMIUM VOLUMETRIC DOT RENDERING */}
                  <circle 
                    cx="0" cy={s} r="32" 
                    fill={dotColor} 
                    filter={dotOpacity > 0.5 ? "url(#glow)" : "none"}
                    stroke={dotOpacity > 0.5 ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.2)"}
                    strokeWidth="3"
                    style={{ 
                      transformOrigin: `0px ${s}px`,
                      transform: hide3D ? 'scale(1)' : 'scale(0)',
                      opacity: hide3D ? dotOpacity : 0, 
                      transition: customTransition 
                    }} 
                  />
                </g>
              );
            })}
            
            {/* Hexagon Outline */}
            <g transform={`translate(1600, 560)`} style={{ opacity: (stage === 'SQUASH' && substep >= 7) ? 1 : 0, transition: 'opacity 1.2s ease', pointerEvents: 'none' }}>
              <path d="M 0 -225 L 195 -112 L 195 112 L 0 225 L -195 112 L -195 -112 Z" fill="none" stroke="#f472b6" strokeWidth="6" strokeDasharray="16 16" opacity="0.6" />
            </g>
          </g>

          {/* STAGE 4: REVEAL FINAL AHA LAYOUT */}
          {stage === 'REVEAL' && (
            <g style={{ opacity: 1, animation: 'fadeIn 1s ease forwards' }}>
              <text x="400" y="750" fill="#fff" fontSize="48" fontWeight="bold" textAnchor="middle">3 × 3 × 3 CUBE</text>
              <text x="400" y="820" fill="#38bdf8" fontSize="48" fontWeight="bold" textAnchor="middle">27 BLOCKS = 3³</text>
              
              <text x="1350" y="150" fill="#fff" fontSize="48" fontWeight="bold" textAnchor="middle">CENTERED HEXAGONAL SHELLS</text>
              
              {/* Shell 1 */}
              <g transform="translate(1000, 450)">
                <circle cx="0" cy="0" r="28" fill="url(#dot-core)" filter="url(#glow)" stroke="rgba(255,255,255,0.8)" strokeWidth="3" />
                <text x="0" y="240" fill="#60a5fa" fontSize="40" fontWeight="bold" textAnchor="middle">1 POINT</text>
                <g style={{opacity: substep >= 1 ? 1 : 0, transition: 'opacity 0.8s'}}>
                  <text x="0" y="300" fill="#94a3b8" fontSize="40" textAnchor="middle">↓</text>
                  <text x="0" y="360" fill="#fff" fontSize="48" fontWeight="bold" textAnchor="middle">1³</text>
                </g>
              </g>

              {/* + Signs */}
              <g style={{opacity: substep >= 2 ? 1 : 0, transition: 'opacity 0.8s'}}>
                <text x="1175" y="450" fill="#94a3b8" fontSize="80" fontWeight="bold" textAnchor="middle">+</text>
                <text x="1525" y="450" fill="#94a3b8" fontSize="80" fontWeight="bold" textAnchor="middle">+</text>
              </g>

              {/* Shell 2 */}
              <g transform="translate(1350, 450)">
                <circle cx="0" cy="0" r="28" fill="url(#dot-shell)" filter="url(#glow)" stroke="rgba(255,255,255,0.8)" strokeWidth="3" />
                {[...Array(6)].map((_, i) => {
                   const a = i * Math.PI / 3;
                   return <circle key={i} cx={Math.cos(a)*70} cy={Math.sin(a)*70} r="28" fill="url(#dot-shell)" filter="url(#glow)" stroke="rgba(255,255,255,0.8)" strokeWidth="3" />
                })}
                <text x="0" y="240" fill="#f472b6" fontSize="40" fontWeight="bold" textAnchor="middle">7 POINTS</text>
                <g style={{opacity: substep >= 1 ? 1 : 0, transition: 'opacity 0.8s'}}>
                  <text x="0" y="300" fill="#94a3b8" fontSize="40" textAnchor="middle">↓</text>
                  <text x="0" y="360" fill="#fff" fontSize="48" fontWeight="bold" textAnchor="middle">2³</text>
                </g>
              </g>

              {/* Shell 3 */}
              <g transform="translate(1700, 450)">
                <circle cx="0" cy="0" r="28" fill="url(#dot-shell)" filter="url(#glow)" stroke="rgba(255,255,255,0.8)" strokeWidth="3" />
                {[...Array(6)].map((_, i) => {
                   const a = i * Math.PI / 3;
                   return <circle key={i} cx={Math.cos(a)*70} cy={Math.sin(a)*70} r="28" fill="url(#dot-shell)" filter="url(#glow)" stroke="rgba(255,255,255,0.8)" strokeWidth="3" />
                })}
                {[...Array(12)].map((_, i) => {
                   const a1 = i * Math.PI / 6;
                   const r = i % 2 === 0 ? 140 : 140 * Math.sqrt(3)/2; 
                   return <circle key={i} cx={Math.cos(a1)*r} cy={Math.sin(a1)*r} r="28" fill="url(#dot-shell)" filter="url(#glow)" stroke="rgba(255,255,255,0.8)" strokeWidth="3" />
                })}
                <text x="0" y="240" fill="#f472b6" fontSize="40" fontWeight="bold" textAnchor="middle">19 POINTS</text>
                <g style={{opacity: substep >= 1 ? 1 : 0, transition: 'opacity 0.8s'}}>
                  <text x="0" y="300" fill="#94a3b8" fontSize="40" textAnchor="middle">↓</text>
                  <text x="0" y="360" fill="#fff" fontSize="48" fontWeight="bold" textAnchor="middle">3³</text>
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

const LabBasicSequences = () => {
  const [level, setLevel] = useState(0);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px', boxSizing: 'border-box' }}>
      <p style={{ color: '#f8fafc', fontSize: '18px', textAlign: 'center', margin: '0 0 16px 0' }}>

const LabTriangularToHexagonal = () => {
  const [step, setStep] = useState(0); // 0: 1 Triangle, 1: 6 Triangles, 2: Add Center
  const n = 3; // T_3 = 6
  
  // Base triangle dots in axial hex coordinates (q, r)
  const baseDots = [];
  for (let q = 1; q <= n; q++) {
    for (let r = -(q - 1); r <= 0; r++) {
      baseDots.push({q, r});
    }
  }

  // Rotate a hex point (q, r) by 60 degrees k times
  const rot = (q, r, k) => {
    let cq = q, cr = r;
    for (let i = 0; i < k; i++) {
      const nq = -cr;
      const nr = cq + cr;
      cq = nq; cr = nr;
    }
    return {q: cq, r: cr};
  };

  const D = 28;
  const toXY = (q, r) => ({
    x: D * (q + r / 2),
    y: D * Math.sqrt(3) / 2 * r
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px', boxSizing: 'border-box' }}>
      <p style={{ color: '#f8fafc', fontSize: '18px', textAlign: 'center', margin: '0 0 16px 0' }}>
        Multiply a <strong>Triangular Number</strong> by 6, then add 1. What shape do you get?
      </p>
      
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
        <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%', maxHeight: '350px' }}>
          <g transform="translate(200, 200)">
            {/* Center dot (added in step 2) */}
            <circle 
              cx="0" cy="0" r="10" 
              fill="#fbbf24" 
              style={{ transform: step >= 2 ? 'scale(1)' : 'scale(0)', transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)', opacity: step >= 2 ? 1 : 0 }} 
            />
            {step >= 2 && <circle cx="0" cy="0" r="16" fill="none" stroke="#fbbf24" strokeWidth="2" className="anim-ping" />}

            {/* 6 Triangles */}
            {[0, 1, 2, 3, 4, 5].map(k => (
              <g key={`tri-${k}`} style={{ 
                opacity: (k === 0 || step >= 1) ? 1 : 0, 
                transform: (k === 0 || step >= 1) ? 'scale(1) rotate(0deg)' : `scale(0.5) rotate(${-k*60}deg)`,
                transition: `all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${k * 0.1}s` 
              }}>
                {baseDots.map((dot, i) => {
                  const rotated = rot(dot.q, dot.r, k);
                  const {x, y} = toXY(rotated.q, rotated.r);
                  const colors = ['#c084fc', '#a855f7', '#9333ea', '#7e22ce', '#6b21a8', '#581c87'];
                  return (
                    <circle key={i} cx={x} cy={y} r="10" fill={colors[k]} />
                  );
                })}
              </g>
            ))}
          </g>
        </svg>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
        <button onClick={() => setStep(0)} style={{ padding: '12px 24px', background: 'transparent', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Reset</button>
        <button onClick={() => setStep(1)} style={{ padding: '12px 24px', background: step >= 1 ? 'rgba(192, 132, 252, 0.5)' : '#c084fc', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' }}>Multiply by 6</button>
        <button onClick={() => setStep(2)} disabled={step < 1} style={{ padding: '12px 24px', background: step >= 2 ? 'rgba(251, 191, 36, 0.5)' : (step < 1 ? 'rgba(255,255,255,0.1)' : '#fbbf24'), color: step < 1 ? 'rgba(255,255,255,0.3)' : '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: step < 1 ? 'not-allowed' : 'pointer', transition: 'all 0.3s' }}>Add 1</button>
      </div>
    </div>
  );
};

export default function RelationsAmongSequences({ onNext }) {
  const [step, setStep] = useState(1); // 1: Odd, 2: Up/Down, 3-7: Interactive Labs
  const maxSteps = 7;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#0a0f1d',
      padding: 'clamp(20px, 4vh, 40px)',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <style>{`
        .anim-fade {
          animation: fadeIn 0.5s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#f8fafc', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            1.4 Relations among Number Sequences
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '16px', margin: 0 }}>
            Sometimes, number sequences can be related to each other in surprising ways.
          </p>
        </div>
        
        {/* Step Indicators */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[1, 2, 3, 4, 5, 6, 7].map(s => (
            <div 
              key={s} 
              style={{
                width: '40px', height: '6px', borderRadius: '3px',
                background: s === step ? '#3b82f6' : (s < step ? '#10b981' : 'rgba(255,255,255,0.1)'),
                transition: 'background 0.3s'
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        {step === 1 && <AddingOddNumbers />}
        {step === 2 && <AddingUpAndDown />}
        {step === 3 && <div style={{height: '100%'}}><LabBasicSequences /></div>}
        {step === 4 && <div style={{height: '100%'}}><LabTriangularToHexagonal /></div>}
        {step === 5 && <div style={{height: '100%'}}><LabTriangular /></div>}
        {step === 6 && <div style={{height: '100%'}}><LabPowers /></div>}
        {step === 7 && <div style={{height: '100%'}}><LabHexagonal /></div>}
      </div>

      {/* Footer Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
        <button
          onClick={() => setStep(prev => prev - 1)}
          disabled={step === 1}
          style={{
            padding: '16px 32px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)',
            background: 'transparent', color: '#f8fafc', cursor: step === 1 ? 'not-allowed' : 'pointer',
            fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', opacity: step === 1 ? 0 : 1,
            pointerEvents: step === 1 ? 'none' : 'auto'
          }}
        >
          <ChevronLeft size={20} /> Previous
        </button>

        <button
          onClick={() => {
            if (step < maxSteps) setStep(prev => prev + 1);
            else if (onNext) onNext();
          }}
          style={{
            padding: '16px 32px', borderRadius: '12px', border: 'none',
            background: step === maxSteps ? '#22c55e' : '#3b82f6', 
            color: '#fff', cursor: 'pointer',
            fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px',
            transition: 'all 0.3s'
          }}
        >
          {step === maxSteps ? 'Next Section' : 'Next Topic'} <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
