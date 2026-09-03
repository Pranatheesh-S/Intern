import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Search, ArrowRight, CheckCircle } from 'lucide-react';

import imgBallTennis from '../images/b2_ball_tennis.png';
import imgBallCricket from '../images/b2_ball_cricket.png';
import imgBallSponge from '../images/b2_ball_sponge.png';

export default function Stage_SportsBall({ onComplete, addXp }) {
  const [activeBall, setActiveBall] = useState('tennis');
  const [inspected, setInspected] = useState({ tennis: true });
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
        <h3 style={{ margin: 0, fontSize: '2.2rem', color: 'var(--heading-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Target size={26} style={{ color: 'var(--lesson-accent)' }} /> 
          Investigation: Sports Equipment Properties
        </h3>
        <p style={{ margin: 0, fontSize: '1.4rem', color: 'var(--heading-sub)' }}>
          Why aren't all balls made of the same material? Click each ball to analyze its properties and discover how its material matches its purpose.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '40% 60%', gap: '1rem', flex: 1, minHeight: 0 }}>
        
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
                {inspected[ball.id] && <CheckCircle size={18} style={{ color: activeBall === ball.id ? 'white' : 'var(--lesson-success)' }} />}
              </button>
            ))}
          </div>

          {/* Analysis Panel */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, justifyContent: 'center', padding: '0.5rem' }}>
            <AnimatePresence mode="wait">
              {activeBall && (
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
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', flex: 1 }}>
                          <div style={{ background: 'var(--lesson-surface)', padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid var(--lesson-border)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <span style={{ fontSize: '1.6rem', color: 'var(--lesson-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Primary Material</span>
                            <div style={{ fontWeight: 'bold', fontSize: '1.4rem', color: 'var(--lesson-text)', marginTop: '0.15rem', lineHeight: '1.2' }}>{ball.material}</div>
                          </div>
                          <div style={{ background: 'var(--lesson-surface)', padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid var(--lesson-border)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <span style={{ fontSize: '1.6rem', color: 'var(--lesson-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Hardness Level</span>
                            <div style={{ fontWeight: 'bold', fontSize: '1.4rem', color: 'var(--lesson-text)', marginTop: '0.15rem', lineHeight: '1.2' }}>{ball.hardness}</div>
                          </div>
                          <div style={{ background: 'var(--lesson-surface)', padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid var(--lesson-border)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <span style={{ fontSize: '1.6rem', color: 'var(--lesson-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Weight</span>
                            <div style={{ fontWeight: 'bold', fontSize: '1.4rem', color: 'var(--lesson-text)', marginTop: '0.15rem', lineHeight: '1.2' }}>{ball.weight}</div>
                          </div>
                          <div style={{ background: 'var(--lesson-surface)', padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid var(--lesson-border)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <span style={{ fontSize: '1.6rem', color: 'var(--lesson-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Design Purpose</span>
                            <div style={{ fontWeight: 'bold', fontSize: '1.4rem', color: 'var(--lesson-accent)', marginTop: '0.15rem', lineHeight: '1.2' }}>{ball.purpose}</div>
                          </div>
                        </div>

                      </>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT: Drop Test Panel */}
        <div className="glass-panel" style={{ background: 'var(--neutral-bg)', border: '1px solid var(--lesson-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', flex: 1, minHeight: 0, justifyContent: 'center' }}>
          <h4 style={{ margin: 0, color: 'var(--heading-section)', fontSize: '2rem' }}>Drop Test: Bounce Comparison</h4>
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

          <svg width="100%" style={{ maxWidth: '600px', flex: 1, minHeight: 0 }} viewBox="0 0 450 180" preserveAspectRatio="xMidYMid meet">
            {/* Ground */}
            <line x1="20" y1="150" x2="430" y2="150" stroke="var(--lesson-border)" strokeWidth="4" strokeLinecap="round" />
            
            {/* Tennis Ball */}
            <g>
              <motion.g 
                animate={dropState === 'dropping' ? { y: [0, 90, 20, 90, 45, 90, 65, 90, 80, 90, 85, 90, 90] } : { y: 0 }} 
                transition={dropState === 'dropping' ? { duration: 3.5, ease: "easeInOut" } : { duration: 0 }}
              >
                <image href={imgBallTennis} x="45" y="0" width="60" height="60" style={{ mixBlendMode: 'multiply' }} />
              </motion.g>
            </g>

            {/* Cricket Ball */}
            <g>
              <motion.g 
                animate={dropState === 'dropping' ? { y: [0, 90, 80, 90, 85, 90, 90, 90, 90, 90, 90, 90, 90] } : { y: 0 }} 
                transition={dropState === 'dropping' ? { duration: 3.5, ease: "easeInOut" } : { duration: 0 }}
              >
                <image href={imgBallCricket} x="195" y="0" width="60" height="60" style={{ mixBlendMode: 'multiply' }} />
              </motion.g>
            </g>

            {/* Sponge Ball */}
            <g>
              <motion.g 
                animate={dropState === 'dropping' ? { y: [0, 90, 60, 90, 75, 90, 80, 90, 85, 90, 90, 90, 90] } : { y: 0 }} 
                transition={dropState === 'dropping' ? { duration: 3.5, ease: "easeInOut" } : { duration: 0 }}
              >
                <image href={imgBallSponge} x="345" y="0" width="60" height="60" style={{ mixBlendMode: 'multiply' }} />
              </motion.g>
            </g>
          </svg>

          {/* HTML Labels below the SVG */}
          <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', maxWidth: '600px', padding: '0 1rem', marginTop: '-0.5rem' }}>
            <div style={{ background: 'var(--lesson-surface)', padding: '0.4rem 1rem', borderRadius: '6px', border: '1px solid var(--lesson-border)', fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--lesson-primary)' }}>Tennis Ball</div>
            <div style={{ background: 'var(--lesson-surface)', padding: '0.4rem 1rem', borderRadius: '6px', border: '1px solid var(--lesson-border)', fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--lesson-primary)' }}>Cricket Ball</div>
            <div style={{ background: 'var(--lesson-surface)', padding: '0.4rem 1rem', borderRadius: '6px', border: '1px solid var(--lesson-border)', fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--lesson-primary)' }}>Sponge Ball</div>
          </div>
        </div>
      </div>
    </div>
  );
}
