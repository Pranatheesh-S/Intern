import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Search, ArrowRight, CheckCircle } from 'lucide-react';

export default function Stage_SportsBall({ onComplete, addXp }) {
  const [activeBall, setActiveBall] = useState(null);
  const [inspected, setInspected] = useState({});

  const balls = [
    {
      id: 'tennis',
      name: 'Tennis Ball',
      emoji: '🎾',
      material: 'Rubber & Felt',
      hardness: 'Medium (Squeezable)',
      weight: 'Light',
      purpose: 'High bounce, safe for rackets'
    },
    {
      id: 'cricket',
      name: 'Cricket Ball',
      emoji: '🏏',
      material: 'Leather & Cork',
      hardness: 'Very Hard',
      weight: 'Heavy',
      purpose: 'Fast bowling, durable impacts'
    },
    {
      id: 'exercise',
      name: 'Exercise Ball',
      emoji: '🎈', // using balloon as a close representation, or just a custom circle
      material: 'Soft PVC / Rubber',
      hardness: 'Soft & Flexible',
      weight: 'Heavy (but low density)',
      purpose: 'Body support, low impact bounce'
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--accent-border)' }}>
        <h3 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Target size={22} style={{ color: 'var(--accent)' }} /> 
          Investigation: Sports Equipment Properties
        </h3>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
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
                fontSize: '1rem',
                justifyContent: 'flex-start',
                borderRadius: '12px'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{ball.emoji}</span>
              <span style={{ fontWeight: 'bold' }}>{ball.name}</span>
              {inspected[ball.id] && <CheckCircle size={14} style={{ marginLeft: 'auto', color: activeBall === ball.id ? '#fff' : 'var(--success)' }} />}
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
                          <h2 style={{ margin: 0, color: 'var(--text-heading)' }}>{ball.name}</h2>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Scientific Profile</span>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Primary Material</span>
                          <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>{ball.material}</div>
                        </div>
                        <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Hardness Level</span>
                          <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>{ball.hardness}</div>
                        </div>
                        <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Weight</span>
                          <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>{ball.weight}</div>
                        </div>
                        <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Design Purpose</span>
                          <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: 'var(--accent)', marginTop: '0.25rem' }}>{ball.purpose}</div>
                        </div>
                      </div>
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

      {allInspected && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel"
          style={{ background: 'var(--success-bg)', border: '1px solid var(--success-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={18} /> Analysis Complete
            </h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <strong>Conclusion:</strong> We cannot use a soft rubber ball for cricket, nor a hard leather ball for tennis! 
              Different purposes require materials with completely different properties.
            </p>
          </div>
          <button onClick={onComplete} className="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Complete Barrier 2 <ArrowRight size={16} />
          </button>
        </motion.div>
      )}
    </div>
  );
}
