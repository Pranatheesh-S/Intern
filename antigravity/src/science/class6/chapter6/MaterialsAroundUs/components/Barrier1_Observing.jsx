import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Stage1_Intro from './Stage1_Intro';
import Stage2_Identify from './Stage2_Identify';

export default function Barrier1_Observing({ onComplete, addXp }) {
  const [stage, setStage] = useState(1);

  return (
    <div style={{ width: '100%' }}>
      <AnimatePresence mode="wait">
        {stage === 1 && (
          <motion.div key="stage1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Stage1_Intro onComplete={() => setStage(2)} addXp={addXp} />
          </motion.div>
        )}
        
        {stage === 2 && (
          <motion.div key="stage2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Stage2_Identify onComplete={() => setStage(3)} addXp={addXp} />
          </motion.div>
        )}

        {stage === 3 && (
          <motion.div 
            key="stage3" 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="glass-panel"
            style={{ 
              maxWidth: '600px', 
              margin: '2rem auto', 
              padding: '2.5rem', 
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              alignItems: 'center',
              border: '2px solid var(--success-border)',
              background: 'var(--success-bg)'
            }}
          >
            <CheckCircle size={48} style={{ color: 'var(--success)' }} />
            <div>
              <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--success)', fontSize: '1.5rem' }}>Barrier 1 Complete!</h2>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Excellent work, Detective. We now know that all objects around us are made of one or more materials. 
                But scientists don't stop there. They organize materials to understand them better.
              </p>
            </div>
            <button 
              onClick={onComplete}
              className="primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', fontWeight: 'bold' }}
            >
              Continue to Barrier 2 <ArrowRight size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
