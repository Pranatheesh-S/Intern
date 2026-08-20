import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Search, ArrowRight, CheckCircle } from 'lucide-react';

export default function Stage_SportsBall({ onComplete, addXp }) {
  const [activeBall, setActiveBall] = useState(null);
  const [inspected, setInspected] = useState({});
  const [dropState, setDropState] = useState('reset'); // 'reset' or 'dropping'

  const balls = [
    {
      id: 'tennis',
      name: 'Tennis Ball',
      emoji: '🥎',
      material: 'Rubber & Felt',
      hardness: 'Medium (Squeezable)',
      weight: 'Light',
      purpose: 'High bounce, safe for rackets'
    },
    {
      id: 'cricket',
      name: 'Cricket Ball',
      emoji: '🔴',
      material: 'Leather & Cork',
      hardness: 'Very Hard',
      weight: 'Heavy',
      purpose: 'Fast bowling, durable impacts'
    },
    {
      id: 'exercise',
      name: 'Exercise Ball',
      emoji: '🟡',
      material: 'Soft Sponge / Foam',
      hardness: 'Very Soft & Flexible',
      weight: 'Light (low density)',
      purpose: 'Hand exercise, stress relief'
    }
  ];

  const handleInspect = (id) => {
    setActiveBall(id);
    if (!inspected[id]) {
      setInspected(prev => {
        const next = { ...prev, [id]: true };
        if (Object.keys(next).length === balls.length) {
          addXp(20);
        }
        return next;
      });
    }
  };

  const allInspected = Object.keys(inspected).length === balls.length;

  useEffect(() => {
    if (allInspected) {
      onComplete();
    }
  }, [allInspected, onComplete]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--accent-border)' }}>
        <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Target size={22} style={{ color: 'var(--accent)' }} /> 
          Investigation: Sports Equipment Properties
        </h3>
        <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-secondary)' }}>
          Why aren't all balls made of the same material? Click each ball to analyze its properties and discover how its material matches its purpose.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '1.5rem', minHeight: '400px' }}>
        {/* Left: Ball selector */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {balls.map(ball => (
            <button
              key={ball.id}
              onClick={() => handleInspect(ball.id)}
              className={activeBall === ball.id ? 'primary' : 'outline'}
              style={{
                width: '100%',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '1.15rem',
                justifyContent: 'flex-start',
                borderRadius: '12px'
              }}
            >
              <span style={{ fontSize: '1.75rem' }}>{ball.emoji}</span>
              <span style={{ fontWeight: 'bold' }}>{ball.name}</span>
              {inspected[ball.id] && <CheckCircle size={18} style={{ marginLeft: 'auto', color: activeBall === ball.id ? '#fff' : 'var(--success)' }} />}
            </button>
          ))}
        </div>

        {/* Right: Analysis Panel */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <AnimatePresence mode="wait">
            {activeBall ? (
              <motion.div
                key={activeBall}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
              >
                {(() => {
                  const ball = balls.find(b => b.id === activeBall);
                  return (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                        <span style={{ fontSize: '4rem' }}>{ball.emoji}</span>
                        <div>
                          <h2 style={{ margin: 0, color: 'var(--text-heading)', fontSize: '1.75rem' }}>{ball.name}</h2>
                          <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Scientific Profile</span>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Primary Material</span>
                          <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>{ball.material}</div>
                        </div>
                        <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Hardness Level</span>
                          <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>{ball.hardness}</div>
                        </div>
                        <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Weight</span>
                          <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>{ball.weight}</div>
                        </div>
                        <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Design Purpose</span>
                          <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--accent)', marginTop: '0.25rem' }}>{ball.purpose}</div>
                        </div>
                      </div>

                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        style={{ marginTop: '0.5rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px dashed var(--accent)', borderRadius: '8px', color: 'var(--accent)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                      >
                        <span style={{ fontSize: '1.3rem' }}>👇</span> 
                        <span><strong>Detective Task:</strong> Scroll down to the <strong>Drop Test</strong> below to observe how this material's hardness physically affects its bounce!</span>
                      </motion.div>
                    </>
                  );
                })()}
              </motion.div>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <Search size={48} style={{ opacity: 0.5 }} />
                <p>Select a sports ball from the left to analyze its material properties.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bounce Comparison Animation */}
      <div className="glass-panel" style={{ background: 'var(--neutral-bg)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
        <h4 style={{ margin: 0, color: 'var(--text-heading)', fontSize: '1.2rem' }}>Drop Test: Bounce Comparison</h4>
        <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-secondary)' }}>Observe how the material's hardness affects its bounce height when dropped from the same level.</p>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
          <button 
            onClick={() => setDropState('dropping')} 
            disabled={dropState === 'dropping'}
            className="primary" 
            style={{ padding: '0.6rem 1.75rem', fontSize: '1rem' }}
          >
            Drop Balls
          </button>
          <button 
            onClick={() => setDropState('reset')} 
            disabled={dropState === 'reset'}
            className="outline" 
            style={{ padding: '0.6rem 1.75rem', fontSize: '1rem' }}
          >
            Reset
          </button>
        </div>

        <svg width="100%" style={{ maxWidth: '500px' }} height="180px" viewBox="0 0 300 180">
          {/* Ground */}
          <line x1="20" y1="150" x2="280" y2="150" stroke="var(--border)" strokeWidth="4" strokeLinecap="round" />
          
          {/* Tennis Ball */}
          <g>
            <text x="60" y="170" fontSize="14" fill="var(--text-muted)" textAnchor="middle">Tennis Ball</text>
            <motion.g 
              animate={dropState === 'dropping' ? { y: [0, 120, 30, 120, 60, 120, 90, 120, 105, 120, 115, 120, 120] } : { y: 0 }} 
              transition={dropState === 'dropping' ? { duration: 3.5, ease: "easeInOut" } : { duration: 0 }}
            >
              <circle cx="60" cy="15" r="15" fill="#a3e635" />
              <path d="M 48,8 Q 55,15 48,22 M 72,8 Q 65,15 72,22" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.7" />
            </motion.g>
          </g>

          {/* Cricket Ball */}
          <g>
            <text x="150" y="170" fontSize="14" fill="var(--text-muted)" textAnchor="middle">Cricket Ball</text>
            <motion.g 
              animate={dropState === 'dropping' ? { y: [0, 120, 110, 120, 115, 120, 120, 120, 120, 120, 120, 120, 120] } : { y: 0 }} 
              transition={dropState === 'dropping' ? { duration: 3.5, ease: "easeInOut" } : { duration: 0 }}
            >
              <circle cx="150" cy="15" r="15" fill="#dc2626" />
              <line x1="150" y1="0" x2="150" y2="30" stroke="#fff" strokeWidth="2" strokeDasharray="3,2" opacity="0.8" />
            </motion.g>
          </g>

          {/* Sponge Ball */}
          <g>
            <text x="240" y="170" fontSize="14" fill="var(--text-muted)" textAnchor="middle">Sponge Ball</text>
            <motion.g 
              animate={dropState === 'dropping' ? { y: [0, 120, 80, 120, 100, 120, 110, 120, 115, 120, 120, 120, 120] } : { y: 0 }} 
              transition={dropState === 'dropping' ? { duration: 3.5, ease: "easeInOut" } : { duration: 0 }}
            >
              <circle cx="240" cy="15" r="15" fill="#fbbf24" />
            </motion.g>
          </g>
        </svg>
      </div>

      {allInspected && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel"
          style={{ background: 'var(--success-bg)', border: '1px solid var(--success-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem' }}>
              <CheckCircle size={22} /> Analysis Complete
            </h4>
            <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              <strong>Conclusion:</strong> We cannot use a soft rubber ball for cricket, nor a hard leather ball for tennis! 
              Different purposes require materials with completely different properties.
            </p>
          </div>
          <p style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>
            Click "Proceed to next" in the bottom right corner!
          </p>
        </motion.div>
      )}
    </div>
  );
}
