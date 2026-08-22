import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ArrowRight } from 'lucide-react';

export default function Stage5_Suitability({ onComplete, addXp }) {
  // Tumbler state
  const [tumblerMaterial, setTumblerMaterial] = useState(null);
  const [tumblerTested, setTumblerTested] = useState(false);
  const [tumblerSuccess, setTumblerSuccess] = useState(false);

  // Pot state
  const [potMaterial, setPotMaterial] = useState(null);
  const [potTested, setPotTested] = useState(false);
  const [potSuccess, setPotSuccess] = useState(false);

  const handleTumblerTest = (mat) => {
    setTumblerMaterial(mat);
    setTumblerTested(true);
    if (mat === 'glass' || mat === 'metal') {
      if (!tumblerSuccess) {
        setTumblerSuccess(true);
        addXp(15);
      }
    }
  };

  const handlePotTest = (mat) => {
    setPotMaterial(mat);
    setPotTested(true);
    if (mat === 'metal') {
      if (!potSuccess) {
        setPotSuccess(true);
        addXp(15);
      }
    }
  };

  const renderTumblerAnimation = () => {
    if (tumblerMaterial === 'cloth') {
      return (
        <svg width="180" height="180" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
          <g transform="translate(-15, -5)">
            <motion.g animate={{ rotate: [0, -35, -35, 0], x: [0, 5, 5, 0] }} transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.25, 0.75, 1], ease: "easeInOut" }} style={{ transformOrigin: "68px 18px" }}>
              <path d="M 68,10 L 84,10 L 80,25 L 68,25 Z" fill="rgba(255,255,255,0.8)" stroke="#475569" strokeWidth="1.5" />
              <path d="M 69,15 L 82,15 L 79,24 L 69,24 Z" fill="#3b82f6" opacity="0.8" />
            </motion.g>
          </g>
          <motion.path d="M 51,13 L 51,32" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" animate={{ scaleY: [0, 1, 1, 0], originY: 0 }} transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.2, 0.8, 1] }} />
          <path d="M 32,30 L 68,30 L 58,80 L 42,80 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
          <path d="M 32,30 L 68,30 L 58,80 L 42,80 Z" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="34" y1="40" x2="66" y2="40" stroke="#cbd5e1" strokeWidth="0.5" />
          <line x1="36" y1="50" x2="64" y2="50" stroke="#cbd5e1" strokeWidth="0.5" />
          <line x1="38" y1="60" x2="62" y2="60" stroke="#cbd5e1" strokeWidth="0.5" />
          <line x1="40" y1="70" x2="60" y2="70" stroke="#cbd5e1" strokeWidth="0.5" />
          <motion.path d="M 42,80 L 58,80 L 59,74 L 41,74 Z" fill="#3b82f6" opacity="0.5" animate={{ opacity: [0, 0.6, 0.6, 0] }} transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.25, 0.75, 1] }} />
          <motion.g animate={{ opacity: [0, 1, 1, 0] }} transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.25, 0.8, 1] }}>
            <motion.path d="M 45,80 L 45,95" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3,3" animate={{ strokeDashoffset: [0, -10] }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} />
            <motion.path d="M 50,80 L 50,95" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3,3" animate={{ strokeDashoffset: [0, -10] }} transition={{ repeat: Infinity, duration: 0.6, ease: "linear", delay: 0.15 }} />
            <motion.path d="M 55,80 L 55,95" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3,3" animate={{ strokeDashoffset: [0, -10] }} transition={{ repeat: Infinity, duration: 0.7, ease: "linear", delay: 0.3 }} />
            <motion.circle cx="36" cy="50" r="1.2" fill="#3b82f6" animate={{ x: [-2, -8], y: [0, 15], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} />
            <motion.circle cx="64" cy="50" r="1.2" fill="#3b82f6" animate={{ x: [2, 8], y: [0, 15], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} />
          </motion.g>
          <motion.ellipse cx="50" cy="95" rx="22" ry="3" fill="#3b82f6" opacity="0.8" animate={{ scale: [0, 1, 1, 0] }} transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.25, 0.8, 1] }} />
        </svg>
      );
    } else if (tumblerMaterial === 'paper') {
      return (
        <svg width="180" height="180" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
          <g transform="translate(-15, -5)">
            <motion.g animate={{ rotate: [0, -35, -35, 0], x: [0, 5, 5, 0] }} transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.25, 0.75, 1], ease: "easeInOut" }} style={{ transformOrigin: "68px 18px" }}>
              <path d="M 68,10 L 84,10 L 80,25 L 68,25 Z" fill="rgba(255,255,255,0.8)" stroke="#475569" strokeWidth="1.5" />
              <path d="M 69,15 L 82,15 L 79,24 L 69,24 Z" fill="#3b82f6" opacity="0.8" />
            </motion.g>
          </g>
          <motion.path d="M 51,13 L 51,32" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" animate={{ scaleY: [0, 1, 1, 0], originY: 0, opacity: [1, 1, 0, 0] }} transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.2, 0.6, 1] }} />
          <motion.path d="M 32,30 L 68,30 L 58,80 L 42,80 Z" stroke="#b45309" strokeWidth="2" animate={{ d: ["M 32,30 L 68,30 L 58,80 L 42,80 Z", "M 32,30 L 68,30 L 58,80 L 42,80 Z", "M 34,48 Q 50,58 66,48 L 56,80 Q 50,72 44,80 Z"], fill: ["#fdfbf7", "#e5dcd3", "#a78b71"] }} transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.35, 0.75] }} />
          <motion.path d="M 42,80 L 58,80 L 60,65 L 40,65 Z" fill="#3b82f6" opacity="0.85" animate={{ d: ["M 42,80 L 58,80 L 58,80 L 42,80 Z", "M 42,80 L 58,80 L 60,65 L 40,65 Z", "M 44,80 Q 50,72 56,80 L 66,48 Q 50,58 34,48 Z"], opacity: [0, 0.85, 0.85, 0] }} transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.35, 0.7, 1] }} />
          <motion.g animate={{ opacity: [0, 0, 1, 0] }} transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.45, 0.65, 1] }}>
            <ellipse cx="50" cy="85" rx="20" ry="3" fill="#3b82f6" />
            <motion.circle cx="34" cy="48" r="1.5" fill="#3b82f6" animate={{ x: [-10, -25], y: [-5, 15] }} transition={{ repeat: Infinity, duration: 3.5 }} />
            <motion.circle cx="66" cy="48" r="1.5" fill="#3b82f6" animate={{ x: [10, 25], y: [-5, 15] }} transition={{ repeat: Infinity, duration: 3.5 }} />
          </motion.g>
        </svg>
      );
    } else {
      // Glass/Metal Tumbler
      return (
        <svg width="180" height="180" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
          <g transform="translate(-15, -5)">
            <motion.g animate={{ rotate: [0, -35, -35, 0], x: [0, 5, 5, 0] }} transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.25, 0.75, 1], ease: "easeInOut" }} style={{ transformOrigin: "68px 18px" }}>
              <path d="M 68,10 L 84,10 L 80,25 L 68,25 Z" fill="rgba(255,255,255,0.8)" stroke="#475569" strokeWidth="1.5" />
              <path d="M 69,15 L 82,15 L 79,24 L 69,24 Z" fill="#3b82f6" opacity="0.8" />
            </motion.g>
          </g>
          <motion.path d="M 51,13 L 51,80" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" animate={{ scaleY: [0, 1, 1, 0], originY: 0, opacity: [1, 1, 1, 0] }} transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.15, 0.7, 1] }} />
          <path d="M 32,30 L 68,30 L 58,80 L 42,80 Z" fill={tumblerMaterial === 'glass' ? "rgba(186, 230, 253, 0.2)" : "rgba(148, 163, 184, 0.6)"} stroke={tumblerMaterial === 'glass' ? "#0ea5e9" : "#64748b"} strokeWidth="2.5" />
          <path d="M 36,35 L 42,75" stroke="white" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
          <motion.path d="M 42,80 L 58,80 L 58,80 L 42,80 Z" fill="#3b82f6" opacity="0.85" animate={{ d: ["M 42,80 L 58,80 L 58,80 L 42,80 Z", "M 42,80 L 58,80 L 61,60 L 39,60 Z", "M 42,80 L 58,80 L 66,35 L 34,35 Z", "M 42,80 L 58,80 L 66,35 L 34,35 Z"], opacity: [0, 0.85, 0.85, 0] }} transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.15, 0.75, 1] }} />
        </svg>
      );
    }
  };

  const renderPotAnimation = () => {
    if (potMaterial === 'paper') {
      return (
        <svg width="180" height="180" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
          <rect x="10" y="88" width="80" height="4" fill="#1e293b" rx="1" />
          <rect x="35" y="80" width="30" height="8" fill="#475569" rx="2" />
          <ellipse cx="50" cy="80" rx="12" ry="2.5" fill="#0f172a" />
          <path d="M 28,74 L 38,84 M 72,74 L 62,84" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          <motion.g animate={{ opacity: [0.8, 1, 0.9, 1, 0.8] }} transition={{ repeat: Infinity, duration: 0.2 }}>
            <path d="M 38,80 Q 42,60 45,80 Q 47,58 50,80 Q 53,58 55,80 Q 58,60 62,80 Z" fill="#2563eb" opacity="0.6" />
            <path d="M 40,80 Q 42,65 44,80 Q 47,62 50,80 Q 53,62 56,80 Q 58,65 60,80 Z" fill="#67e8f9" opacity="0.9" />
          </motion.g>
          
          <defs>
            <radialGradient id="woodFireGrad" cx="50%" cy="80%" r="50%" fx="50%" fy="80%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="35%" stopColor="#f97316" />
              <stop offset="70%" stopColor="#ef4444" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#b91c1c" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Paper Pot burning */}
          <motion.path
            d="M 28,44 L 72,44 L 72,74 L 28,74 Z"
            strokeWidth="2"
            animate={{
              d: ["M 28,44 L 72,44 L 72,74 L 28,74 Z", "M 28,48 Q 50,45 72,48 L 70,74 L 30,74 Z", "M 34,66 Q 50,56 66,66 L 60,78 Q 50,75 40,78 Z"],
              fill: ["#e2e8f0", "#94a3b8", "#1e293b"],
              stroke: ["#64748b", "#334155", "#0f172a"]
            }}
            transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.4, 0.85] }}
          />

          <motion.g animate={{ scaleY: [0.3, 1.2, 1.2, 0.2], scaleX: [0.5, 1.1, 1.1, 0.4], y: [18, 0, 0, 22] }} transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.35, 0.75, 1], ease: "easeInOut" }} style={{ transformOrigin: "50px 74px" }}>
            <motion.path d="M 24,74 C 28,60 35,40 40,48 C 45,25 48,15 52,25 C 56,15 59,25 64,48 C 69,40 72,60 76,74 Z" fill="url(#woodFireGrad)" animate={{ d: ["M 24,74 C 28,60 35,40 40,48 C 45,25 48,15 52,25 C 56,15 59,25 64,48 C 69,40 72,60 76,74 Z", "M 24,74 C 29,58 33,43 38,50 C 43,28 47,18 51,28 C 55,18 58,28 63,50 C 68,43 71,58 76,74 Z", "M 24,74 C 27,62 36,38 42,46 C 47,22 49,12 53,22 C 57,12 60,22 65,46 C 70,38 73,62 76,74 Z"] }} transition={{ repeat: Infinity, duration: 0.4, ease: "linear" }} />
          </motion.g>
          
          <g>
            <motion.circle cx="40" cy="35" r="5" fill="#475569" opacity="0.6" animate={{ y: [-10, -42], x: [-5, -15], scale: [1, 2.2], opacity: [0.6, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }} />
            <motion.circle cx="60" cy="35" r="6" fill="#475569" opacity="0.5" animate={{ y: [-15, -47], x: [5, 15], scale: [1, 2.5], opacity: [0.5, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeOut", delay: 0.5 }} />
          </g>
        </svg>
      );
    } else {
      // Metal Pot
      return (
        <svg width="180" height="180" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="30%" stopColor="#e2e8f0" />
              <stop offset="55%" stopColor="#94a3b8" />
              <stop offset="85%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>
          <rect x="10" y="88" width="80" height="4" fill="#1e293b" rx="1" />
          <rect x="35" y="80" width="30" height="8" fill="#475569" rx="2" />
          <ellipse cx="50" cy="80" rx="12" ry="2.5" fill="#0f172a" />
          <path d="M 28,74 L 38,84 M 72,74 L 62,84" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          <motion.g animate={{ opacity: [0.85, 1, 0.9, 1, 0.85] }} transition={{ repeat: Infinity, duration: 0.15 }}>
            <path d="M 34,80 Q 42,55 45,80 Q 47,52 50,80 Q 53,52 55,80 Q 58,55 66,80 Z" fill="#3b82f6" opacity="0.4" />
            <path d="M 37,80 Q 40,62 43,80 Q 45,58 48,80 Q 50,56 52,80 Q 55,58 57,80 Q 60,62 63,80 Z" fill="#67e8f9" opacity="0.9" />
          </motion.g>
          
          <g>
            <path d="M 28,52 C 23,52 23,62 28,62" stroke="#475569" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 72,52 C 77,52 77,62 72,62" stroke="#475569" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <rect x="28" y="44" width="44" height="30" rx="3" fill="url(#metalGrad)" stroke="#475569" strokeWidth="2" />
          </g>

          <motion.g animate={{ y: [0, -1, 0, -1.5, 0] }} transition={{ repeat: Infinity, duration: 0.15 }}>
            <ellipse cx="50" cy="44" rx="23" ry="2.5" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
            <path d="M 44,41 C 44,37 56,37 56,41" stroke="#475569" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </motion.g>

          <g>
            <motion.circle cx="34" cy="40" r="2" fill="#f1f5f9" opacity="0.6" animate={{ y: [-5, -25], x: [-5, -15], scale: [1, 2], opacity: [0.6, 0] }} transition={{ repeat: Infinity, duration: 1.2 }} />
            <motion.circle cx="66" cy="40" r="2" fill="#f1f5f9" opacity="0.6" animate={{ y: [-5, -25], x: [5, 15], scale: [1, 2], opacity: [0.6, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} />
          </g>
        </svg>
      );
    }
  };

  const isCompleted = tumblerSuccess && potSuccess;

  useEffect(() => {
    if (isCompleted) {
      onComplete();
    }
  }, [isCompleted, onComplete]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Intro */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--accent-border)' }}>
        <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={22} style={{ color: 'var(--accent)' }} /> Activity 6.3: Let Us Think (Material Suitability)
        </h3>
        <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          Why is a window made of glass and not wood? Why is a cooking pot made of metal and not paper? 
          We choose materials based on their <strong>properties</strong> and the <strong>purpose</strong> of the object.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Tumbler Designer */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border)' }}>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.15rem' }}>1. Storing Water: The Tumbler Test</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            {['cloth', 'paper', 'glass', 'metal'].map((mat) => (
              <button
                key={mat}
                onClick={() => handleTumblerTest(mat)}
                className={tumblerMaterial === mat ? 'outline active' : 'outline'}
                style={{ textTransform: 'capitalize', padding: '0.5rem 0.8rem', fontSize: '1rem' }}
              >
                {mat}
              </button>
            ))}
          </div>

          <div style={{ height: '200px', background: 'var(--neutral-bg)', border: '1px solid var(--border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {tumblerMaterial ? renderTumblerAnimation() : <span style={{ fontSize: '1rem', color: '#64748b' }}>Select a tumbler material</span>}
          </div>

          <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.5', minHeight: '60px' }}>
            {tumblerMaterial === 'cloth' && <span style={{ color: 'var(--danger)' }}><strong>Leakage!</strong> Cloth has porous holes. Water slips through instantly.</span>}
            {tumblerMaterial === 'paper' && <span style={{ color: 'var(--danger)' }}><strong>Collapse!</strong> Paper absorbs water and loses structural strength.</span>}
            {(tumblerMaterial === 'glass' || tumblerMaterial === 'metal') && <span style={{ color: 'var(--success)' }}><strong>Perfect!</strong> Glass and Metal are non-porous and hold liquids perfectly.</span>}
          </div>
        </div>

        {/* Stove Cooking pot */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border)' }}>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.15rem' }}>2. Direct Flame: The Cooking Pot</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            {['paper', 'metal'].map((mat) => (
              <button
                key={mat}
                onClick={() => handlePotTest(mat)}
                className={potMaterial === mat ? 'outline active' : 'outline'}
                style={{ textTransform: 'capitalize', padding: '0.5rem 0.8rem', fontSize: '1rem' }}
              >
                {mat === 'paper' ? 'Paper Pot' : 'Stainless Steel Pot'}
              </button>
            ))}
          </div>

          <div style={{ height: '200px', background: 'var(--neutral-bg)', border: '1px solid var(--border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {potMaterial ? renderPotAnimation() : <span style={{ fontSize: '1rem', color: '#64748b' }}>Select a pot material</span>}
          </div>

          <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.5', minHeight: '60px' }}>
            {potMaterial === 'paper' && <span style={{ color: 'var(--danger)' }}><strong>Danger!</strong> Paper is combustible and catches fire easily.</span>}
            {potMaterial === 'metal' && <span style={{ color: 'var(--success)' }}><strong>Safe!</strong> Stainless steel is fire-resistant and conducts heat perfectly.</span>}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', minHeight: '60px' }}>
        <AnimatePresence>
          {isCompleted && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              style={{ background: 'var(--success-bg)', border: '1px solid var(--success-border)', padding: '1rem 2rem', borderRadius: '8px', color: 'var(--success)', fontWeight: 'bold', fontSize: '1rem' }}
            >
              Tests Complete! Click "Proceed to next" in the bottom right corner.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

