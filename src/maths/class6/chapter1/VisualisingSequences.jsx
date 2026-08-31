import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { SEQUENCES } from './NumberSequencesTable';

const SequenceVisualizer = ({ id }) => {
  const renderVisual = () => {
    switch (id) {
      case 1: // All 1's
        return (
          <svg viewBox="0 0 600 100" className="seq-svg">
            <g transform="translate(40, 45)">
              {[...Array(12)].map((_, i) => (
                <rect key={i} x={i * 45} y={0} width="16" height="16" rx="4" fill="#3b82f6" className="anim-pop" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </g>
          </svg>
        );
      case 2: // Counting
        return (
          <svg viewBox="0 0 600 120" className="seq-svg">
            <g transform="translate(40, 100)">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num, i) => (
                <g key={i} transform={`translate(${i * 40}, 0)`}>
                  {[...Array(num)].map((_, j) => (
                    <rect key={j} x={0} y={-(j + 1) * 12} width="10" height="10" rx="2" fill="#22c55e" className="anim-pop" style={{ animationDelay: `${(i * 0.1) + (j * 0.05)}s` }} />
                  ))}
                  <text x="5" y="15" fill="#94a3b8" fontSize="10" textAnchor="middle">{num}</text>
                </g>
              ))}
            </g>
          </svg>
        );
      case 3: { // Odd numbers (L-shapes to squares)
        const colors3 = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#06b6d4'];
        return (
          <svg viewBox="0 0 600 120" className="seq-svg">
            <g transform="translate(100, 10)">
              {[0, 1, 2, 3, 4].map((layer) => (
                <g key={layer}>
                  {[...Array(layer * 2 + 1)].map((_, j) => {
                    const isTop = j <= layer;
                    const x = isTop ? j : layer;
                    const y = isTop ? layer : layer - (j - layer);
                    return (
                      <rect key={j} x={x * 20} y={y * 20} width="16" height="16" rx="4" fill={colors3[layer]} className="anim-pop" style={{ animationDelay: `${layer * 0.3 + j * 0.05}s` }} />
                    );
                  })}
                  <text x={layer * 20 + 8} y={-5} fill={colors3[layer]} fontSize="12" textAnchor="middle" className="anim-fade" style={{ animationDelay: `${layer * 0.3 + 0.5}s` }}>
                    +{layer * 2 + 1}
                  </text>
                </g>
              ))}
              <text x="140" y="55" fill="#f8fafc" fontSize="16" className="anim-fade" style={{ animationDelay: '2s' }}>
                Sum of odds = Perfect Squares
              </text>
            </g>
          </svg>
        );
      }
      case 4: // Even numbers
        return (
          <svg viewBox="0 0 600 100" className="seq-svg">
            <g transform="translate(40, 20)">
              {[1, 2, 3, 4, 5, 6].map((num, i) => (
                <g key={i} transform={`translate(${i * 60}, 0)`}>
                  {[...Array(num)].map((_, j) => (
                    <g key={j} transform={`translate(0, ${j * 12})`}>
                      <rect x={0} y={0} width="10" height="10" rx="2" fill="#8b5cf6" className="anim-pop" style={{ animationDelay: `${(i * 0.2) + (j * 0.1)}s` }} />
                      <rect x={12} y={0} width="10" height="10" rx="2" fill="#8b5cf6" className="anim-pop" style={{ animationDelay: `${(i * 0.2) + (j * 0.1) + 0.05}s` }} />
                    </g>
                  ))}
                  <text x="11" y={num * 12 + 15} fill="#94a3b8" fontSize="10" textAnchor="middle">{num * 2}</text>
                </g>
              ))}
            </g>
          </svg>
        );
      case 5: // Triangular numbers
        return (
          <svg viewBox="0 0 650 120" className="seq-svg">
            <g transform="translate(40, 90)">
              {[1, 2, 3, 4, 5, 6].map((num, i) => {
                // Increase spacing as they get wider to prevent overlap
                const totalOffset = i === 0 ? 0 : 
                                    i === 1 ? 60 : 
                                    i === 2 ? 140 : 
                                    i === 3 ? 240 : 
                                    i === 4 ? 360 : 490;
                let dots = [];
                for (let row = 0; row < num; row++) {
                  for (let col = 0; col <= row; col++) {
                    const x = totalOffset + (col * 14) - (row * 7) + 20;
                    const y = -(num - row - 1) * 12;
                    dots.push(
                      <circle key={`${row}-${col}`} cx={x} cy={y} r="5" fill="#ec4899" className="anim-pop" style={{ animationDelay: `${i * 0.2 + row * 0.1}s` }} />
                    );
                  }
                }
                const totalValue = (num * (num + 1)) / 2;
                dots.push(<text key="t" x={totalOffset + 20} y="20" fill="#94a3b8" fontSize="12" textAnchor="middle">{totalValue}</text>);
                return <g key={i}>{dots}</g>;
              })}
            </g>
          </svg>
        );
      case 6: // Squares
        return (
          <svg viewBox="0 0 600 120" className="seq-svg">
            <g transform="translate(40, 20)">
              {[1, 2, 3, 4, 5].map((num, i) => {
                const xOffset = i === 0 ? 0 :
                                i === 1 ? 52 :
                                i === 2 ? 116 :
                                i === 3 ? 192 : 280;
                return (
                  <g key={i} transform={`translate(${xOffset}, 0)`}>
                    {[...Array(num)].map((_, r) => (
                      <g key={r}>
                        {[...Array(num)].map((_, c) => (
                          <rect key={c} x={c * 12} y={r * 12} width="10" height="10" rx="2" fill="#06b6d4" className="anim-pop" style={{ animationDelay: `${i * 0.2 + (r+c) * 0.05}s` }} />
                        ))}
                      </g>
                    ))}
                    <text x={(num * 12) / 2 - 1} y={num * 12 + 15} fill="#94a3b8" fontSize="12" textAnchor="middle">{num * num}</text>
                  </g>
                );
              })}
            </g>
          </svg>
        );
      case 7: { // Cubes (Isometric 3D)
        const drawIsoCube = (x, y, s) => (
          <g transform={`translate(${x}, ${y})`}>
            <polygon points={`0,0 ${s},${s/2} 0,${s} -${s},${s/2}`} fill="#fbbf24" />
            <polygon points={`0,${s} ${s},${s/2} ${s},${s*1.5} 0,${s*2}`} fill="#d97706" />
            <polygon points={`0,${s} -${s},${s/2} -${s},${s*1.5} 0,${s*2}`} fill="#f59e0b" />
          </g>
        );
        return (
          <svg viewBox="0 0 600 150" className="seq-svg">
            <g transform="translate(80, 50)">
              {[1, 2, 3, 4].map((num, i) => {
                const s = 10;
                const xOffset = i === 0 ? 0 :
                                i === 1 ? 90 :
                                i === 2 ? 200 : 330;
                let blocks = [];
                for(let z = 0; z < num; z++) {
                  for(let y = 0; y < num; y++) {
                    for(let x = 0; x < num; x++) {
                      const isoX = (x - y) * s + xOffset;
                      const isoY = ((x + y) * s / 2) - (z * s);
                      blocks.push(
                        <g key={`${x}-${y}-${z}`} className="anim-pop" style={{ animationDelay: `${i * 0.4 + (x+y+z) * 0.05}s` }}>
                          {drawIsoCube(isoX, isoY, s)}
                        </g>
                      );
                    }
                  }
                }
                const totalValue = num * num * num;
                blocks.push(<text key="t" x={xOffset} y={num * s + 30} fill="#94a3b8" fontSize="12" textAnchor="middle">{totalValue}</text>);
                return <g key={i}>{blocks}</g>;
              })}
            </g>
          </svg>
        );
      }
      case 8: // Virahānka / Fibonacci Spiral
        return (
          <svg viewBox="0 0 600 150" className="seq-svg">
            <g transform="translate(300, 45) scale(1.5)">
              <g className="anim-draw-path" style={{ animationDuration: '4s' }}>
                <rect x="0" y="0" width="10" height="10" fill="rgba(14, 165, 233, 0.2)" stroke="#0ea5e9" strokeWidth="1" />
                <path d="M 10 0 A 10 10 0 0 1 0 10" fill="none" stroke="#f8fafc" strokeWidth="2" />
                
                <rect x="-10" y="0" width="10" height="10" fill="rgba(14, 165, 233, 0.2)" stroke="#0ea5e9" strokeWidth="1" />
                <path d="M 0 10 A 10 10 0 0 1 -10 0" fill="none" stroke="#f8fafc" strokeWidth="2" />
                
                <rect x="-10" y="-20" width="20" height="20" fill="rgba(14, 165, 233, 0.2)" stroke="#0ea5e9" strokeWidth="1" />
                <path d="M -10 0 A 20 20 0 0 1 10 -20" fill="none" stroke="#f8fafc" strokeWidth="2" />
                
                <rect x="10" y="-20" width="30" height="30" fill="rgba(14, 165, 233, 0.2)" stroke="#0ea5e9" strokeWidth="1" />
                <path d="M 10 -20 A 30 30 0 0 1 40 10" fill="none" stroke="#f8fafc" strokeWidth="2" />
                
                <rect x="-10" y="10" width="50" height="50" fill="rgba(14, 165, 233, 0.2)" stroke="#0ea5e9" strokeWidth="1" />
                <path d="M 40 10 A 50 50 0 0 1 -10 60" fill="none" stroke="#f8fafc" strokeWidth="2" />
                
                <rect x="-90" y="-20" width="80" height="80" fill="rgba(14, 165, 233, 0.2)" stroke="#0ea5e9" strokeWidth="1" />
                <path d="M -10 60 A 80 80 0 0 1 -90 -20" fill="none" stroke="#f8fafc" strokeWidth="2" />
              </g>
              <text x="50" y="20" fill="#f8fafc" fontSize="10">1,1,2,3,5,8</text>
            </g>
          </svg>
        );
      case 9: // Powers of 2
        return (
          <svg viewBox="0 0 600 150" className="seq-svg">
            <g transform="translate(300, 20)">
              <g stroke="#334155" strokeWidth="2" className="anim-draw-path">
                <line x1="0" y1="0" x2="-80" y2="30" />
                <line x1="0" y1="0" x2="80" y2="30" />
                
                <line x1="-80" y1="30" x2="-120" y2="60" />
                <line x1="-80" y1="30" x2="-40" y2="60" />
                
                <line x1="80" y1="30" x2="40" y2="60" />
                <line x1="80" y1="30" x2="120" y2="60" />

                <line x1="-120" y1="60" x2="-140" y2="90" />
                <line x1="-120" y1="60" x2="-100" y2="90" />
                <line x1="-40" y1="60" x2="-60" y2="90" />
                <line x1="-40" y1="60" x2="-20" y2="90" />
                <line x1="40" y1="60" x2="20" y2="90" />
                <line x1="40" y1="60" x2="60" y2="90" />
                <line x1="120" y1="60" x2="100" y2="90" />
                <line x1="120" y1="60" x2="140" y2="90" />
              </g>
              <g fill="#10b981">
                <circle cx="0" cy="0" r="10" className="anim-pop" style={{animationDelay: '0s'}} />
                <circle cx="-80" cy="30" r="8" className="anim-pop" style={{animationDelay: '0.4s'}} />
                <circle cx="80" cy="30" r="8" className="anim-pop" style={{animationDelay: '0.4s'}} />
                
                <circle cx="-120" cy="60" r="6" className="anim-pop" style={{animationDelay: '0.8s'}} />
                <circle cx="-40" cy="60" r="6" className="anim-pop" style={{animationDelay: '0.8s'}} />
                <circle cx="40" cy="60" r="6" className="anim-pop" style={{animationDelay: '0.8s'}} />
                <circle cx="120" cy="60" r="6" className="anim-pop" style={{animationDelay: '0.8s'}} />

                {[-140, -100, -60, -20, 20, 60, 100, 140].map((cx, i) => (
                  <circle key={i} cx={cx} cy="90" r="4" className="anim-pop" style={{animationDelay: '1.2s'}} />
                ))}
              </g>
              <text x="30" y="5" fill="#f8fafc" fontSize="12" className="anim-fade" style={{animationDelay: '0.2s'}}>1</text>
              <text x="100" y="35" fill="#f8fafc" fontSize="12" className="anim-fade" style={{animationDelay: '0.6s'}}>2</text>
              <text x="140" y="65" fill="#f8fafc" fontSize="12" className="anim-fade" style={{animationDelay: '1.0s'}}>4</text>
              <text x="160" y="95" fill="#f8fafc" fontSize="12" className="anim-fade" style={{animationDelay: '1.4s'}}>8</text>
            </g>
          </svg>
        );
      case 10: // Powers of 3
        return (
          <svg viewBox="0 0 600 150" className="seq-svg">
            <g transform="translate(300, 20)">
              <g stroke="#334155" strokeWidth="2" className="anim-draw-path">
                <line x1="0" y1="0" x2="-100" y2="40" />
                <line x1="0" y1="0" x2="0" y2="40" />
                <line x1="0" y1="0" x2="100" y2="40" />

                <line x1="-100" y1="40" x2="-130" y2="80" />
                <line x1="-100" y1="40" x2="-100" y2="80" />
                <line x1="-100" y1="40" x2="-70" y2="80" />

                <line x1="0" y1="40" x2="-30" y2="80" />
                <line x1="0" y1="40" x2="0" y2="80" />
                <line x1="0" y1="40" x2="30" y2="80" />

                <line x1="100" y1="40" x2="70" y2="80" />
                <line x1="100" y1="40" x2="100" y2="80" />
                <line x1="100" y1="40" x2="130" y2="80" />
              </g>
              <g fill="#a855f7">
                <circle cx="0" cy="0" r="12" className="anim-pop" style={{animationDelay: '0s'}} />
                
                <circle cx="-100" cy="40" r="8" className="anim-pop" style={{animationDelay: '0.5s'}} />
                <circle cx="0" cy="40" r="8" className="anim-pop" style={{animationDelay: '0.5s'}} />
                <circle cx="100" cy="40" r="8" className="anim-pop" style={{animationDelay: '0.5s'}} />

                <circle cx="-130" cy="80" r="5" className="anim-pop" style={{animationDelay: '1s'}} />
                <circle cx="-100" cy="80" r="5" className="anim-pop" style={{animationDelay: '1s'}} />
                <circle cx="-70" cy="80" r="5" className="anim-pop" style={{animationDelay: '1s'}} />
                
                <circle cx="-30" cy="80" r="5" className="anim-pop" style={{animationDelay: '1s'}} />
                <circle cx="0" cy="80" r="5" className="anim-pop" style={{animationDelay: '1s'}} />
                <circle cx="30" cy="80" r="5" className="anim-pop" style={{animationDelay: '1s'}} />
                
                <circle cx="70" cy="80" r="5" className="anim-pop" style={{animationDelay: '1s'}} />
                <circle cx="100" cy="80" r="5" className="anim-pop" style={{animationDelay: '1s'}} />
                <circle cx="130" cy="80" r="5" className="anim-pop" style={{animationDelay: '1s'}} />
              </g>
              <text x="30" y="5" fill="#f8fafc" fontSize="12" className="anim-fade" style={{animationDelay: '0.2s'}}>1</text>
              <text x="120" y="45" fill="#f8fafc" fontSize="12" className="anim-fade" style={{animationDelay: '0.7s'}}>3</text>
              <text x="150" y="85" fill="#f8fafc" fontSize="12" className="anim-fade" style={{animationDelay: '1.2s'}}>9</text>
            </g>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {renderVisual()}
    </div>
  );
};

export default function VisualisingSequences({ onNext }) {
  const [activeId, setActiveId] = useState(1);
  
  const activeSeq = SEQUENCES.find(s => s.id === activeId);
  const isLast = activeId === SEQUENCES.length;

  const handleNext = () => {
    if (isLast) {
      if (onNext) onNext();
    } else {
      setActiveId(prev => prev + 1);
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#0a0f1d',
      padding: '40px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <style>{`
        .anim-pop {
          animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .anim-fade {
          animation: fadeIn 0.5s ease both;
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(5px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .anim-draw-path {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: drawPath 2s ease-out forwards;
        }
        @keyframes drawPath {
          to { stroke-dashoffset: 0; }
        }
        .seq-svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }
      `}</style>
      
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#f8fafc', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
          Visualising Sequences
          <span style={{ fontSize: '14px', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '4px 12px', borderRadius: '12px' }}>
            Pattern {activeId} of {SEQUENCES.length}
          </span>
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '16px', margin: 0 }}>
          <strong style={{ color: '#f8fafc' }}>{activeSeq.rule}</strong> • {activeSeq.seq}
        </p>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '20px', minHeight: 0 }}>
        {/* Visualizer Area */}
        <div style={{ flex: 1, background: '#111827', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden' }}>
          <SequenceVisualizer key={activeId} id={activeId} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
        <button
          onClick={handleNext}
          style={{
            background: isLast ? '#22c55e' : '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '16px 32px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s'
          }}
        >
          {isLast ? 'Next Section' : 'Next Pattern'} <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
