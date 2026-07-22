import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Flame, ArrowRight, CheckCircle, Info } from 'lucide-react';

export default function Stage2_Lab({ onComplete }) {
  const [temperature, setTemperature] = useState(20);
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    "Take 50 mL of water.",
    "Measure temperature.",
    "Add baking soda.",
    "Stir continuously.",
    "Observe undissolved particles.",
    "Heat to 50°C.",
    "Observe dissolution.",
    "Heat to 70°C.",
    "Observe complete dissolution."
  ];

  const getStatusMessage = () => {
    if (temperature < 40) return "The solution is saturated.";
    if (temperature < 65) return "More baking soda dissolves.";
    return "Water can dissolve even more baking soda.";
  };

  const getObservation = () => {
    if (temperature < 40) return "Only limited baking soda dissolves.";
    if (temperature < 65) return "More baking soda dissolves.";
    return "Maximum amount dissolves.";
  };

  // derived values for animation
  const particleCount = Math.max(0, 50 - (temperature - 20)); 
  const bubbleSpeed = temperature > 30 ? (80 - temperature) / 20 : 0; // faster bubbles at high temp
  
  // Create an array of particles
  const particles = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    x: 40 + Math.random() * 120, // inside beaker width
    y: 160 + Math.random() * 30, // bottom of beaker
  }));

  // Create an array of dissolved moving particles
  const dissolvedCount = 50 - particleCount;
  const dissolvedParticles = Array.from({ length: dissolvedCount }).map((_, i) => ({
    id: `d_${i}`,
    startX: 40 + Math.random() * 120,
    startY: 60 + Math.random() * 100,
  }));

  const handleNextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        
        {/* Left Column: Interactive Lab */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: 0, color: 'var(--text-heading)' }}>Interactive Simulation</h3>
          
          {/* Beaker Canvas Area */}
          <div style={{ 
            height: '300px', 
            position: 'relative', 
            background: 'var(--bg-color)', 
            borderRadius: '12px',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            {/* The SVG Lab */}
            <svg width="200" height="250" viewBox="0 0 200 250">
              {/* Heat Waves (only visible if temp > 30) */}
              {temperature > 30 && (
                <motion.path 
                  d="M70,230 Q80,210 70,190 T70,150" 
                  fill="transparent" 
                  stroke="rgba(255,100,0,0.5)" 
                  strokeWidth="2"
                  animate={{ y: [0, -20], opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
              )}
              {temperature > 50 && (
                <motion.path 
                  d="M130,230 Q120,210 130,190 T130,150" 
                  fill="transparent" 
                  stroke="rgba(255,100,0,0.5)" 
                  strokeWidth="2"
                  animate={{ y: [0, -20], opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear", delay: 0.4 }}
                />
              )}

              {/* Tripod & Wire Gauze */}
              <path d="M40,200 L160,200 L170,250 M40,200 L30,250 M100,200 L100,250" stroke="#555" strokeWidth="4" fill="none" />
              <line x1="30" y1="200" x2="170" y2="200" stroke="#888" strokeWidth="2" strokeDasharray="4" />

              {/* Spirit Lamp */}
              {temperature > 20 && (
                <g transform="translate(85, 215)">
                  <rect x="0" y="10" width="30" height="25" fill="rgba(100,100,200,0.5)" rx="5" />
                  <path d="M10,10 L20,10 L15,0 Z" fill="#444" />
                  <motion.path 
                    d="M15,-10 Q20,-5 15,0 Q10,-5 15,-10" 
                    fill="orange"
                    animate={{ scale: [1, 1.2, 1], rotate: [-5, 5, -5] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                  />
                </g>
              )}

              {/* Beaker */}
              <path d="M40,50 L40,190 Q40,200 50,200 L150,200 Q160,200 160,190 L160,50" fill="rgba(255,255,255,0.1)" stroke="#ccc" strokeWidth="3" />
              <ellipse cx="100" cy="50" rx="60" ry="10" fill="transparent" stroke="#ccc" strokeWidth="3" />

              {/* Water Level */}
              <motion.path 
                d="M42,90 Q100,85 158,90 L158,190 Q158,198 150,198 L50,198 Q42,198 42,190 Z" 
                fill={temperature > 60 ? "rgba(100, 200, 255, 0.4)" : "rgba(100, 200, 255, 0.6)"}
                animate={{ d: [
                  "M42,90 Q100,85 158,90 L158,190 Q158,198 150,198 L50,198 Q42,198 42,190 Z",
                  "M42,90 Q100,95 158,90 L158,190 Q158,198 150,198 L50,198 Q42,198 42,190 Z"
                ]}}
                transition={{ repeat: Infinity, duration: bubbleSpeed > 0 ? bubbleSpeed * 2 : 4, ease: "easeInOut" }}
              />

              {/* Thermometer */}
              <rect x="135" y="20" width="8" height="150" fill="rgba(200,200,200,0.8)" rx="4" />
              <circle cx="139" cy="170" r="8" fill="red" />
              {/* Thermometer Mercury */}
              <rect 
                x="137" 
                y={170 - (temperature * 1.5)} 
                width="4" 
                height={temperature * 1.5} 
                fill="red" 
                style={{ transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
              />
              <text x="145" y="40" fontSize="12" fill="var(--text-color)">{temperature}°C</text>

              {/* Undissolved Particles (settled at bottom) */}
              {particles.slice(0, particleCount).map((p) => (
                <circle key={p.id} cx={p.x} cy={p.y} r="2" fill="white" />
              ))}

              {/* Dissolving/Moving Particles in Water */}
              {dissolvedParticles.map(p => (
                <motion.circle 
                  key={p.id} 
                  cx={p.startX} 
                  cy={p.startY} 
                  r="1.5" 
                  fill="rgba(255,255,255,0.7)"
                  animate={{ 
                    y: [p.startY, p.startY - 20, p.startY + 10, p.startY],
                    x: [p.startX, p.startX + 10, p.startX - 5, p.startX] 
                  }}
                  transition={{ repeat: Infinity, duration: 3 + Math.random() * 2 }}
                />
              ))}

              {/* Rising Bubbles */}
              {temperature > 40 && Array.from({ length: 10 }).map((_, i) => (
                <motion.circle 
                  key={`b_${i}`}
                  cx={60 + Math.random() * 80}
                  r={2 + Math.random() * 3}
                  fill="rgba(255,255,255,0.4)"
                  initial={{ cy: 190, opacity: 0 }}
                  animate={{ cy: 90, opacity: [0, 1, 0] }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1 + Math.random() * 1.5, 
                    delay: Math.random() * 2 
                  }}
                />
              ))}
            </svg>
          </div>

          <div style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--accent-color)' }}>
            {getStatusMessage()}
          </div>

          {/* Controls */}
          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <span>Temperature</span>
              <span style={{ fontWeight: 'bold' }}>{temperature}°C</span>
            </label>
            <input 
              type="range" 
              min="20" 
              max="70" 
              value={temperature}
              onChange={(e) => setTemperature(parseInt(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>20°C</span>
              <span>70°C</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <button onClick={() => setTemperature(20)} className="outline" style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem' }}>Heat to 20°C</button>
            <button onClick={() => setTemperature(50)} className="outline" style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem' }}>Heat to 50°C</button>
            <button onClick={() => setTemperature(70)} className="outline" style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem' }}>Heat to 70°C</button>
            <button onClick={() => setTemperature(20)} className="outline" style={{ flex: '1 1 100%', fontSize: '0.8rem', padding: '0.5rem', display: 'flex', gap: '0.3rem', justifyContent: 'center', borderColor: 'var(--danger-border)', color: 'var(--danger-text)' }}>
              <RotateCcw size={14} /> Reset Experiment
            </button>
          </div>
        </div>

        {/* Right Column: Procedure & Observation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ margin: 0, marginBottom: '1rem', color: 'var(--text-heading)' }}>Step-by-Step Procedure</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '250px', overflowY: 'auto' }}>
              {steps.map((step, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: idx <= activeStep ? 1 : 0.3, x: 0 }}
                  style={{ 
                    padding: '0.75rem', 
                    borderRadius: '8px', 
                    background: idx === activeStep ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                    border: idx === activeStep ? '1px solid var(--accent-border)' : '1px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    transition: 'all 0.3s'
                  }}
                >
                  <div style={{ 
                    width: '24px', height: '24px', borderRadius: '50%', 
                    background: idx < activeStep ? 'var(--success)' : (idx === activeStep ? 'var(--accent-color)' : 'var(--bg-modifier-active)'),
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold'
                  }}>
                    {idx < activeStep ? <CheckCircle size={14} /> : idx + 1}
                  </div>
                  <span style={{ fontSize: '0.9rem', color: idx <= activeStep ? 'var(--text-color)' : 'var(--text-muted)' }}>{step}</span>
                </motion.div>
              ))}
            </div>
            
            {activeStep < steps.length - 1 ? (
              <button onClick={handleNextStep} style={{ width: '100%', marginTop: '1rem', padding: '0.6rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center', background: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                Next Step <ArrowRight size={16} />
              </button>
            ) : (
              <button onClick={onComplete} style={{ width: '100%', marginTop: '1rem', padding: '0.6rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center', background: 'var(--success)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                Complete Lab <CheckCircle size={16} />
              </button>
            )}
          </div>

          {/* Observation Table */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ margin: 0, marginBottom: '1rem', color: 'var(--text-heading)' }}>Observation Table</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Temperature</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Observation</th>
                </tr>
              </thead>
              <tbody>
                {[20, 50, 70].map(t => {
                  let obs = "";
                  if (t === 20) obs = "Only limited baking soda dissolves.";
                  if (t === 50) obs = "More baking soda dissolves.";
                  if (t === 70) obs = "Maximum amount dissolves.";
                  
                  const isCurrent = Math.abs(temperature - t) <= 10;
                  
                  return (
                    <tr key={t} style={{ 
                      background: isCurrent ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                      transition: 'background 0.3s'
                    }}>
                      <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--border)' }}>{t}°C</td>
                      <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>{obs}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

        </div>
      </div>
      
      {/* Explanation & Graph Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ margin: 0, marginBottom: '1rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info size={18} style={{ color: 'var(--info)' }}/> Why Does This Happen?
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            At <strong>20°C</strong>, water molecules move slowly. They can only collide with and dissolve a limited amount of baking soda particles.
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            As temperature increases to <strong>50°C</strong> and <strong>70°C</strong>, water molecules gain kinetic energy and move much faster. These faster-moving molecules collide with the baking soda more vigorously, breaking it apart and allowing more of it to dissolve in the spaces between the water molecules.
          </p>
          
          {/* Animated Explanation */}
          <div style={{ height: '80px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px', marginTop: '1rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 5, left: 10, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Molecule Speed at {temperature}°C</div>
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div 
                key={i}
                style={{
                  width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-color)', position: 'absolute'
                }}
                animate={{
                  x: [Math.random() * 300, Math.random() * 300, Math.random() * 300],
                  y: [20 + Math.random() * 50, 20 + Math.random() * 50, 20 + Math.random() * 50]
                }}
                transition={{
                  repeat: Infinity,
                  duration: temperature < 40 ? 4 : (temperature < 60 ? 2 : 0.8), // Faster at higher temp
                  ease: "linear"
                }}
              />
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ margin: 0, marginBottom: '1rem', color: 'var(--text-heading)' }}>Solubility Graph</h3>
          
          <div style={{ position: 'relative', height: '200px', borderLeft: '2px solid var(--border)', borderBottom: '2px solid var(--border)', padding: '10px' }}>
            <span style={{ position: 'absolute', top: '-15px', left: '-10px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Solubility</span>
            <span style={{ position: 'absolute', bottom: '-20px', right: '0', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Temperature (°C)</span>
            
            <svg width="100%" height="100%" viewBox="0 0 300 180" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="0" y1="45" x2="300" y2="45" stroke="var(--border)" strokeWidth="1" strokeDasharray="4"/>
              <line x1="0" y1="90" x2="300" y2="90" stroke="var(--border)" strokeWidth="1" strokeDasharray="4"/>
              <line x1="0" y1="135" x2="300" y2="135" stroke="var(--border)" strokeWidth="1" strokeDasharray="4"/>
              
              {/* The Line */}
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                d="M 20,150 L 150,90 L 280,30" 
                fill="none" 
                stroke="var(--accent-color)" 
                strokeWidth="3" 
              />
              
              {/* Points */}
              <circle cx="20" cy="150" r="5" fill="var(--bg-color)" stroke="var(--accent-color)" strokeWidth="2" />
              <text x="20" y="170" fontSize="10" fill="var(--text-muted)" textAnchor="middle">20°C</text>
              
              <circle cx="150" cy="90" r="5" fill="var(--bg-color)" stroke="var(--accent-color)" strokeWidth="2" />
              <text x="150" y="110" fontSize="10" fill="var(--text-muted)" textAnchor="middle">50°C</text>
              
              <circle cx="280" cy="30" r="5" fill="var(--bg-color)" stroke="var(--accent-color)" strokeWidth="2" />
              <text x="280" y="50" fontSize="10" fill="var(--text-muted)" textAnchor="middle">70°C</text>

              {/* Current Temperature Indicator */}
              <motion.circle 
                cx={20 + ((temperature - 20) / 50) * 260}
                cy={150 - ((temperature - 20) / 50) * 120}
                r="7"
                fill="var(--warning)"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
            </svg>
          </div>
        </div>

      </div>

    </div>
  );
}
