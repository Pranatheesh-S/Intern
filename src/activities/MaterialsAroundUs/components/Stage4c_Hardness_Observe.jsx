import React, { useState, useEffect } from 'react';
import { Hand, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Stage4c_Hardness_Observe({ onComplete, addXp }) {
  const [tests, setTests] = useState({ stone: false, sponge: false });
  const [activeAnim, setActiveAnim] = useState(null);
  
  const handlePress = (obj) => {
    setActiveAnim(obj);
    setTimeout(() => {
      setTests(prev => ({ ...prev, [obj]: true }));
      setActiveAnim(null);
      addXp(20);
    }, 600);
  };

  useEffect(() => {
    if (tests.stone && tests.sponge) {
      setTimeout(() => onComplete(), 1500);
    }
  }, [tests, onComplete]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--accent-border)' }}>
        <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Hand size={22} style={{ color: 'var(--accent)' }} /> Observe Hardness: Press Test
        </h3>
        <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          Before we perform advanced scratch tests, detectives test materials by simply pressing them. Click to press each object with your hand and observe what happens.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Stone */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '2rem' }}>
          <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>River Stone</h4>
          
          <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
              animate={activeAnim === 'stone' ? { x: [-2, 2, -2, 2, 0] } : {}}
              transition={{ duration: 0.5 }}
              style={{
                width: '100px', height: '80px', background: '#64748b', borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
                boxShadow: 'inset -10px -10px 20px rgba(0,0,0,0.5), 5px 5px 15px rgba(0,0,0,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            />
            {activeAnim === 'stone' && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'absolute', top: -10, left: 20 }}>
                <Hand size={40} color="#fbbf24" fill="#fcd34d" style={{ transform: 'rotate(-20deg)' }} />
              </motion.div>
            )}
          </div>

          <button 
            onClick={() => handlePress('stone')} 
            className={tests.stone ? 'outline' : 'primary'}
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
          >
            {tests.stone ? 'Tested' : 'Press Stone'}
          </button>

          {tests.stone && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.95rem' }}>
              <strong>Observation:</strong> The stone did not change shape. It is difficult to compress.
            </motion.div>
          )}
        </div>

        {/* Sponge */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '2rem' }}>
          <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Washing Sponge</h4>
          
          <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
              animate={activeAnim === 'sponge' ? { scaleY: 0.4, scaleX: 1.1, y: 30 } : { scaleY: 1, scaleX: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                width: '100px', height: '80px', background: '#fcd34d', borderRadius: '8px', border: '2px solid #f59e0b',
                boxShadow: 'inset -5px -5px 10px rgba(217, 119, 6, 0.5), 5px 5px 15px rgba(0,0,0,0.2)',
                backgroundImage: 'radial-gradient(#d97706 20%, transparent 20%), radial-gradient(#d97706 20%, transparent 20%)',
                backgroundSize: '15px 15px', backgroundPosition: '0 0, 7px 7px'
              }}
            />
            {activeAnim === 'sponge' && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 20 }} style={{ position: 'absolute', top: -10, left: 30, zIndex: 10 }}>
                <Hand size={40} color="#fbbf24" fill="#fcd34d" />
              </motion.div>
            )}
          </div>

          <button 
            onClick={() => handlePress('sponge')} 
            className={tests.sponge ? 'outline' : 'primary'}
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
          >
            {tests.sponge ? 'Tested' : 'Press Sponge'}
          </button>

          {tests.sponge && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.95rem' }}>
              <strong>Observation:</strong> The sponge easily squished down. It is easy to compress.
            </motion.div>
          )}
        </div>
      </div>

      {tests.stone && tests.sponge && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'var(--success-bg)', border: '1px solid var(--success-border)', padding: '1rem', borderRadius: '8px', color: 'var(--success)', textAlign: 'center', fontWeight: 'bold' }}>
          <CheckCircle size={20} style={{ display: 'inline', marginBottom: '-4px', marginRight: '5px' }} />
          Excellent observations! Let's proceed to the advanced scratch investigation.
        </motion.div>
      )}
    </div>
  );
}
