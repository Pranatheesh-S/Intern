import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Search, ArrowRight, CheckCircle } from 'lucide-react';

import imgBallTennis from '../images/b2_ball_tennis.png';
import imgBallCricket from '../images/b2_ball_cricket.png';
import imgBallSponge from '../images/b2_ball_sponge.png';

export default function Stage_SportsBall({ onComplete, addXp }) {
  const [activeBall, setActiveBall] = useState(null);
  const [inspected, setInspected] = useState({});
  const [dropState, setDropState] = useState('reset'); // 'reset' or 'dropping'

  const balls = [
    {
      id: 'tennis',
      name: 'Tennis Ball',
      icon: imgBallTennis,
      material: 'Rubber & Felt',
      hardness: 'Medium (Squeezable)',
      weight: 'Light',
      purpose: 'High bounce, safe for rackets'
    },
    {
      id: 'cricket',
      name: 'Cricket Ball',
      icon: imgBallCricket,
      material: 'Leather & Cork',
      hardness: 'Very Hard',
      weight: 'Heavy',
      purpose: 'Fast bowling, durable impacts'
    },
    {
      id: 'exercise',
      name: 'Sponge Ball',
      icon: imgBallSponge,
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', flex: 1, minHeight: 0 }}>
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--lesson-accent-border)' }}>
        <h3 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--lesson-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Target size={26} style={{ color: '#A64B27' }} /> 
          Investigation: Sports Equipment Properties
        </h3>
        <p style={{ margin: 0, fontSize: '1.15rem', color: 'var(--lesson-secondary)' }}>
          Why aren't all balls made of the same material? Click each ball to analyze its properties and discover how its material matches its purpose.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', flex: 1, minHeight: 0 }}>
        
        {/* LEFT: Ball selection and Analysis */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, minHeight: 0 }}>
          {/* Horizontal Ball selector */}
          <div className="glass-panel" style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem' }}>
            {balls.map(ball => (
              <button
                key={ball.id}
                onClick={() => handleInspect(ball.id)}
                className={activeBall === ball.id ? 'primary' : 'outline'}
                style={{
                  flex: 1,
                  padding: '0.8rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  fontSize: '1.2rem',
                  borderRadius: '8px'
                }}
              >
                <img src={ball.icon} alt={ball.name} style={{ width: '30px', height: '30px', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                <span style={{ fontWeight: 'bold' }}>{ball.name}</span>
                {inspected[ball.id] && <CheckCircle size={18} style={{ color: activeBall === ball.id ? 'white' : '#A64B27' }} />}
              </button>
            ))}
          </div>

          {/* Analysis Panel */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, justifyContent: 'center', padding: '0.5rem' }}>
            <AnimatePresence mode="wait">
              {activeBall ? (
                <motion.div
                  key={activeBall}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}
                >
                  {(() => {
                    const ball = balls.find(b => b.id === activeBall);
                    return (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--lesson-border)', paddingBottom: '0.75rem' }}>
                          <img src={ball.icon} alt={ball.name} style={{ width: '64px', height: '64px', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                          <div>
                            <h2 style={{ margin: 0, color: 'var(--lesson-primary)', fontSize: '1.5rem' }}>{ball.name}</h2>
                            <span style={{ color: 'var(--lesson-muted)', fontSize: '0.95rem' }}>Scientific Profile</span>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', flex: 1 }}>
                          <div style={{ background: '#FFFFFF', padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid var(--lesson-border)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <span style={{ fontSize: '1.4rem', color: 'var(--lesson-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Primary Material</span>
                            <div style={{ fontWeight: 'bold', fontSize: '1.8rem', color: 'var(--lesson-text)', marginTop: '0.15rem', lineHeight: '1.2' }}>{ball.material}</div>
                          </div>
                          <div style={{ background: '#FFFFFF', padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid var(--lesson-border)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <span style={{ fontSize: '1.4rem', color: 'var(--lesson-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Hardness Level</span>
                            <div style={{ fontWeight: 'bold', fontSize: '1.8rem', color: 'var(--lesson-text)', marginTop: '0.15rem', lineHeight: '1.2' }}>{ball.hardness}</div>
                          </div>
                          <div style={{ background: '#FFFFFF', padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid var(--lesson-border)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <span style={{ fontSize: '1.4rem', color: 'var(--lesson-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Weight</span>
                            <div style={{ fontWeight: 'bold', fontSize: '1.8rem', color: 'var(--lesson-text)', marginTop: '0.15rem', lineHeight: '1.2' }}>{ball.weight}</div>
                          </div>
                          <div style={{ background: '#FFFFFF', padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid var(--lesson-border)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <span style={{ fontSize: '1.4rem', color: 'var(--lesson-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Design Purpose</span>
                            <div style={{ fontWeight: 'bold', fontSize: '1.8rem', color: '#A64B27', marginTop: '0.15rem', lineHeight: '1.2' }}>{ball.purpose}</div>
                          </div>
                        </div>

                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px dashed #A64B27', borderRadius: '8px', color: '#A64B27', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem', lineHeight: '1.4' }}
                        >
                          <span style={{ fontSize: '1.5rem' }}>👉</span> 
                          <span><strong>Detective Task:</strong> Observe the <strong>Drop Test</strong> on the right to see how this material's hardness affects its bounce!</span>
                        </motion.div>
                      </>
                    );
                  })()}
                </motion.div>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--lesson-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', justifyContent: 'center', height: '100%' }}>
                  <Search size={48} style={{ opacity: 0.5 }} />
                  <p>Select a sports ball from the top to analyze its material properties.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT: Drop Test Panel */}
        <div className="glass-panel" style={{ background: 'var(--neutral-bg)', border: '1px solid var(--lesson-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', flex: 1, minHeight: 0, justifyContent: 'center' }}>
          <h4 style={{ margin: 0, color: 'var(--lesson-primary)', fontSize: '2rem' }}>Drop Test: Bounce Comparison</h4>
          <p style={{ margin: 0, fontSize: '1.6rem', color: 'var(--lesson-secondary)', textAlign: 'center', lineHeight: '1.3' }}>Observe how the material's hardness affects its bounce height when dropped from the same level.</p>
          
          <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', marginBottom: '1rem' }}>
            <button 
              onClick={() => setDropState('dropping')} 
              disabled={dropState === 'dropping'}
              className="primary" 
              style={{ padding: '1rem 2.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}
            >
              Drop Balls
            </button>
            <button 
              onClick={() => setDropState('reset')} 
              disabled={dropState === 'reset'}
              className="outline" 
              style={{ padding: '1rem 2.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}
            >
              Reset
            </button>
          </div>

          <svg width="100%" style={{ maxWidth: '400px', flex: 1, minHeight: 0 }} viewBox="0 0 300 180" preserveAspectRatio="xMidYMid meet">
            {/* Ground */}
            <line x1="20" y1="150" x2="280" y2="150" stroke="var(--lesson-border)" strokeWidth="4" strokeLinecap="round" />
            
            {/* Tennis Ball */}
            <g>
              <text x="60" y="170" fontSize="14" fill="var(--lesson-muted)" textAnchor="middle">Tennis Ball</text>
              <motion.g 
                animate={dropState === 'dropping' ? { y: [0, 120, 30, 120, 60, 120, 90, 120, 105, 120, 115, 120, 120] } : { y: 0 }} 
                transition={dropState === 'dropping' ? { duration: 3.5, ease: "easeInOut" } : { duration: 0 }}
              >
                <image href={imgBallTennis} x="45" y="0" width="30" height="30" style={{ mixBlendMode: 'multiply' }} />
              </motion.g>
            </g>

            {/* Cricket Ball */}
            <g>
              <text x="150" y="170" fontSize="14" fill="var(--lesson-muted)" textAnchor="middle">Cricket Ball</text>
              <motion.g 
                animate={dropState === 'dropping' ? { y: [0, 120, 110, 120, 115, 120, 120, 120, 120, 120, 120, 120, 120] } : { y: 0 }} 
                transition={dropState === 'dropping' ? { duration: 3.5, ease: "easeInOut" } : { duration: 0 }}
              >
                <image href={imgBallCricket} x="135" y="0" width="30" height="30" style={{ mixBlendMode: 'multiply' }} />
              </motion.g>
            </g>

            {/* Sponge Ball */}
            <g>
              <text x="240" y="170" fontSize="14" fill="var(--lesson-muted)" textAnchor="middle">Sponge Ball</text>
              <motion.g 
                animate={dropState === 'dropping' ? { y: [0, 120, 80, 120, 100, 120, 110, 120, 115, 120, 120, 120, 120] } : { y: 0 }} 
                transition={dropState === 'dropping' ? { duration: 3.5, ease: "easeInOut" } : { duration: 0 }}
              >
                <image href={imgBallSponge} x="225" y="0" width="30" height="30" style={{ mixBlendMode: 'multiply' }} />
              </motion.g>
            </g>
          </svg>
        </div>
      </div>

      {allInspected && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel"
          style={{ background: 'var(--lesson-success-bg)', border: '1px solid var(--lesson-success-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.25rem' }}
        >
          <div>
            <h4 style={{ margin: '0 0 0.25rem 0', color: '#A64B27', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.4rem' }}>
              <CheckCircle size={24} /> Analysis Complete
            </h4>
            <p style={{ margin: 0, fontSize: '1.2rem', color: 'var(--lesson-secondary)', lineHeight: '1.4' }}>
              <strong>Conclusion:</strong> We cannot use a soft rubber ball for cricket, nor a hard leather ball for tennis!<br/>
              Different purposes require materials with completely different properties.
            </p>
          </div>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--lesson-text)', margin: 0, paddingLeft: '1rem' }}>
            Click "Proceed to next"!
          </p>
        </motion.div>
      )}
    </div>
  );
}
