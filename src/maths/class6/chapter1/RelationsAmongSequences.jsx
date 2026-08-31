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
  const [size, setSize] = useState(1);
  const [isFlat, setIsFlat] = useState(false);

  const handleGrow = () => {
    if (size < 4) {
      setSize(s => s + 1);
      setIsFlat(false);
    } else {
      setSize(1);
      setIsFlat(false);
    }
  };

  const visibleCount = size * size * size - (size - 1) * (size - 1) * (size - 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px', boxSizing: 'border-box' }}>
      <p style={{ color: '#f8fafc', fontSize: '18px', textAlign: 'center', margin: '0 0 16px 0' }}>
        <strong>The Cube Illusion:</strong> Look at a 3D cube from the corner, and the visible blocks perfectly form a 2D Hexagon!
      </p>
      
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
        <svg viewBox="0 0 400 240" style={{ width: '100%', height: '100%', maxHeight: '300px' }}>
          <g transform="translate(200, 160)">
            {/* Draw blocks */}
            {(() => {
              const blocks = [];
              const s = 18;
              for (let z = 0; z < size; z++) {
                for (let y = 0; y < size; y++) {
                  for (let x = 0; x < size; x++) {
                    const isVisible = (x === size - 1 || y === size - 1 || z === size - 1);
                    if (isFlat && !isVisible) continue;

                    const isoX = (x - y) * s;
                    const isoY = ((x + y) * s / 2) - (z * s);
                    
                    const cTop = '#3b82f6';
                    const cRight = '#1d4ed8';
                    const cLeft = '#2563eb';
                    
                    const flatColor = '#a855f7';

                    const fillTop = isFlat ? flatColor : cTop;
                    const fillRight = isFlat ? flatColor : cRight;
                    const fillLeft = isFlat ? flatColor : cLeft;
                    const strokeCol = isFlat ? '#e9d5ff' : 'rgba(0,0,0,0.3)';

                    blocks.push(
                      <g key={`${x}-${y}-${z}`} style={{ transform: `translate(${isoX}px, ${isoY}px)`, transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                        <polygon points={`0,0 ${s},${s/2} 0,${s} -${s},${s/2}`} fill={fillTop} stroke={strokeCol} strokeWidth={isFlat ? "1" : "0.5"} style={{ transition: 'all 0.8s' }} />
                        <polygon points={`0,${s} ${s},${s/2} ${s},${s*1.5} 0,${s*2}`} fill={fillRight} stroke={strokeCol} strokeWidth={isFlat ? "1" : "0.5"} style={{ transition: 'all 0.8s' }} />
                        <polygon points={`0,${s} -${s},${s/2} -${s},${s*1.5} 0,${s*2}`} fill={fillLeft} stroke={strokeCol} strokeWidth={isFlat ? "1" : "0.5"} style={{ transition: 'all 0.8s' }} />
                      </g>
                    );
                  }
                }
              }
              return blocks;
            })()}
          </g>
        </svg>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f8fafc' }}>
          Visible Blocks: <span style={{ color: '#a855f7', fontSize: '28px' }}>{visibleCount}</span>
        </div>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <button
            onClick={handleGrow}
            style={{
              padding: '12px 24px', borderRadius: '12px', border: 'none',
              background: '#3b82f6', color: '#fff', cursor: 'pointer',
              fontWeight: 'bold', transition: 'all 0.3s'
            }}
          >
            {size < 4 ? `Grow Cube (${size + 1}x${size + 1}x${size + 1})` : 'Reset to 1x1x1'}
          </button>
          
          <button
            onClick={() => setIsFlat(!isFlat)}
            style={{
              padding: '12px 24px', borderRadius: '12px', border: 'none',
              background: isFlat ? '#fbbf24' : '#a855f7', color: '#fff', cursor: 'pointer',
              fontWeight: 'bold', transition: 'all 0.3s'
            }}
          >
            {isFlat ? 'Return to 3D' : 'Squash to 2D Hexagon'}
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Main Component ---
export default function RelationsAmongSequences({ onNext }) {
  const [step, setStep] = useState(1); // 1: Odd, 2: Up/Down, 3: Figure it out
  const maxSteps = 3;

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
          {[1, 2, 3].map(s => (
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
        {step === 3 && <FigureItOut />}
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
