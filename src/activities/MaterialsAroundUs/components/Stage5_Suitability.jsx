import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Droplet, Shield, Award } from 'lucide-react';

export default function Stage5_Suitability({ onComplete, addXp }) {
  // Water tumbler experiment state
  const [tumblerMaterial, setTumblerMaterial] = useState(null);
  const [waterState, setWaterState] = useState('empty'); // 'empty', 'pouring', 'leaking', 'collapsing', 'stable'

  // Cooking pot experiment state
  const [potMaterial, setPotMaterial] = useState(null);
  const [heatState, setHeatState] = useState('idle'); // 'idle', 'heating', 'burning', 'cooked'

  const handlePourWater = () => {
    if (!tumblerMaterial) return;
    setWaterState('pouring');

    setTimeout(() => {
      if (tumblerMaterial === 'cloth') {
        setWaterState('leaking');
        addXp(10);
      } else if (tumblerMaterial === 'paper') {
        setWaterState('collapsing');
        addXp(10);
      } else {
        setWaterState('stable');
        addXp(15);
      }
    }, 1500);
  };

  const handleTurnOnStove = () => {
    if (!potMaterial) return;
    setHeatState('heating');

    setTimeout(() => {
      if (potMaterial === 'paper') {
        setHeatState('burning');
        addXp(10);
      } else {
        setHeatState('cooked');
        addXp(15);
      }
    }, 1500);
  };

  const resetTumbler = () => {
    setTumblerMaterial(null);
    setWaterState('empty');
  };

  const resetPot = () => {
    setPotMaterial(null);
    setHeatState('idle');
  };

  const isCompleted = (waterState === 'stable' || waterState === 'leaking' || waterState === 'collapsing') && 
                      (heatState === 'cooked' || heatState === 'burning');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Intro */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--accent-border)' }}>
        <h3 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={22} style={{ color: 'var(--accent)' }} /> Activity 6.3: Let Us Think (Material Suitability)
        </h3>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Why is a window made of glass and not wood? Why is a cooking pot made of metal and not paper? 
          We choose materials based on their <strong>properties</strong> and the <strong>purpose</strong> of the object.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Tumbler Designer */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border)' }}>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>1. Storing Water: The Tumbler Test</span>
            <button onClick={resetTumbler} className="outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}>Reset</button>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            {['cloth', 'paper', 'glass', 'metal'].map((mat) => (
              <button
                key={mat}
                onClick={() => { setTumblerMaterial(mat); setWaterState('empty'); }}
                className={tumblerMaterial === mat ? 'outline active' : 'outline'}
                style={{ textTransform: 'capitalize', padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
              >
                {mat}
              </button>
            ))}
          </div>

          {/* Tumbler simulation canvas */}
          <div 
            style={{ 
              height: '160px', 
              background: '#0f172a', 
              borderRadius: '12px', 
              position: 'relative', 
              overflow: 'hidden', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            {tumblerMaterial ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', width: '100%', height: '100%' }}>
                {/* SVG Water Tumbler */}
                <svg width="80" height="100" viewBox="0 0 80 100" style={{ marginTop: '20px', zIndex: 2 }}>
                  {/* Glass / Metal Tumbler outline */}
                  <polygon 
                    points="15,10 65,10 55,90 25,90" 
                    fill="none" 
                    stroke={tumblerMaterial === 'glass' ? 'rgba(255,255,255,0.6)' : tumblerMaterial === 'metal' ? '#94a3b8' : tumblerMaterial === 'paper' ? '#d1d5db' : '#78716c'} 
                    strokeWidth="4" 
                    strokeDasharray={tumblerMaterial === 'cloth' ? '3,3' : 'none'}
                  />
                  {/* Water inside */}
                  {(waterState === 'pouring' || waterState === 'stable' || waterState === 'leaking') && (
                    <polygon 
                      points="18,30 62,30 55,90 25,90" 
                      fill="rgba(56, 189, 248, 0.6)"
                      style={{ transition: 'opacity 0.5s' }}
                    />
                  )}
                </svg>

                {/* Leaking water drip particles */}
                {waterState === 'leaking' && (
                  <div style={{ position: 'absolute', bottom: '10px', display: 'flex', gap: '8px', zIndex: 10 }}>
                    <motion.div animate={{ y: [0, 40], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.6 }}><Droplet size={14} color="#38bdf8" /></motion.div>
                    <motion.div animate={{ y: [0, 40], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}><Droplet size={14} color="#38bdf8" /></motion.div>
                    <motion.div animate={{ y: [0, 40], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.7, delay: 0.4 }}><Droplet size={14} color="#38bdf8" /></motion.div>
                  </div>
                )}

                {/* Collapsing paper cup animation */}
                {waterState === 'collapsing' && (
                  <motion.span 
                    animate={{ rotate: [0, 15, -15, 0], scaleY: [1, 0.4] }} 
                    style={{ position: 'absolute', bottom: '10px', color: '#f87171', fontSize: '0.8rem', fontWeight: 'bold', zIndex: 5 }}
                  >
                    💥 Cup Collapsed!
                  </motion.span>
                )}

                {waterState === 'empty' && (
                  <button 
                    onClick={handlePourWater} 
                    className="primary" 
                    style={{ position: 'absolute', bottom: '10px', padding: '0.25rem 0.75rem', fontSize: '0.7rem' }}
                  >
                    Pour Water
                  </button>
                )}
              </div>
            ) : (
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Select a tumbler material</span>
            )}
          </div>

          {/* Feedback */}
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4', minHeight: '40px' }}>
            {waterState === 'leaking' && (
              <span style={{ color: 'var(--danger)' }}>
                <strong>Leakage!</strong> Cloth possesses porous holes. Water slips through instantly, making cloth unsuitable for making tumblers.
              </span>
            )}
            {waterState === 'collapsing' && (
              <span style={{ color: 'var(--danger)' }}>
                <strong>Wet collapse!</strong> Paper absorbs water, loses its structural strength, and melts/collapses.
              </span>
            )}
            {waterState === 'stable' && (
              <span style={{ color: 'var(--success)' }}>
                <strong>Perfect!</strong> Glass and Metal are non-porous and rigid, which successfully holds liquids.
              </span>
            )}
          </div>
        </div>

        {/* Stove Cooking pot */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border)' }}>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>2. Direct Flame: The Cooking Pot</span>
            <button onClick={resetPot} className="outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}>Reset</button>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            {['paper', 'metal'].map((mat) => (
              <button
                key={mat}
                onClick={() => { setPotMaterial(mat); setHeatState('idle'); }}
                className={potMaterial === mat ? 'outline active' : 'outline'}
                style={{ textTransform: 'capitalize', padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
              >
                {mat === 'paper' ? 'Paper Pot' : 'Stainless Steel Pot'}
              </button>
            ))}
          </div>

          {/* Cooking Simulation */}
          <div 
            style={{ 
              height: '160px', 
              background: '#0f172a', 
              borderRadius: '12px', 
              position: 'relative', 
              overflow: 'hidden', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            {potMaterial ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', width: '100%', height: '100%' }}>
                {/* SVG Cooking Stove pot */}
                <div style={{ marginTop: '20px', position: 'relative', zIndex: 2 }}>
                  <svg width="70" height="60" viewBox="0 0 70 60">
                    <rect 
                      x="10" y="10" width="50" height="40" rx="5" 
                      fill={heatState === 'burning' ? '#ef4444' : potMaterial === 'paper' ? '#e2e8f0' : '#475569'}
                      stroke="#1e293b" 
                      strokeWidth="2"
                    />
                    <line x1="5" y1="20" x2="10" y2="20" stroke="#1e293b" strokeWidth="4" />
                    <line x1="60" y1="20" x2="65" y2="20" stroke="#1e293b" strokeWidth="4" />
                  </svg>
                </div>

                {/* Stove Fire flames */}
                {(heatState === 'heating' || heatState === 'burning' || heatState === 'cooked') && (
                  <div style={{ position: 'absolute', bottom: '30px', display: 'flex', gap: '4px' }}>
                    <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.4 }}><Flame size={16} color="#f97316" fill="#f97316" /></motion.div>
                    <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }}><Flame size={20} color="#ef4444" fill="#ef4444" /></motion.div>
                    <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.4, delay: 0.2 }}><Flame size={16} color="#f97316" fill="#f97316" /></motion.div>
                  </div>
                )}

                {heatState === 'idle' && (
                  <button 
                    onClick={handleTurnOnStove} 
                    className="primary" 
                    style={{ position: 'absolute', bottom: '10px', padding: '0.25rem 0.75rem', fontSize: '0.7rem' }}
                  >
                    Turn On Stove
                  </button>
                )}

                {heatState === 'burning' && (
                  <span style={{ position: 'absolute', bottom: '10px', color: '#f87171', fontSize: '0.8rem', fontWeight: 'bold' }}>🔥 Pot Burned Up!</span>
                )}
                {heatState === 'cooked' && (
                  <span style={{ position: 'absolute', bottom: '10px', color: '#34d399', fontSize: '0.8rem', fontWeight: 'bold' }}>🍲 Food cooked safely!</span>
                )}
              </div>
            ) : (
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Select a pot material</span>
            )}
          </div>

          {/* pot feedback */}
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4', minHeight: '40px' }}>
            {heatState === 'burning' && (
              <span style={{ color: 'var(--danger)' }}>
                <strong>Danger!</strong> Paper is combustible and has a low ignition point. It catches fire, making it dangerous for cooking.
              </span>
            )}
            {heatState === 'cooked' && (
              <span style={{ color: 'var(--success)' }}>
                <strong>Safe!</strong> Stainless steel is fire-resistant, conducts heat, and has a high melting point, making it perfect for cooking utensils.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button
          disabled={!isCompleted}
          onClick={onComplete}
          className="primary"
          style={{ padding: '0.75rem 2rem' }}
        >
          Proceed to Transparency
        </button>
      </div>
    </div>
  );
}
