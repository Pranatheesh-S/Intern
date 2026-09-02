import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Stage7_SolubilityMatter from './Stage7_SolubilityMatter';

export default function Barrier4_Matter({ onComplete, addXp }) {
  const [stage, setStage] = useState(1);

  return (
    <div style={{ width: '100%' }}>
      <AnimatePresence mode="wait">
        {stage === 1 && (
          <motion.div key="stage1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Stage7_SolubilityMatter mode="matter" onComplete={() => setStage(2)} addXp={addXp} />
          </motion.div>
        )}

        {stage === 2 && (
          <motion.div 
            key="stage2" 
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
              border: '2px solid var(--lesson-success-border)',
              background: 'var(--lesson-success-bg)'
            }}
          >
            <CheckCircle size={48} style={{ color: 'var(--lesson-success)' }} />
            <div>
              <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--lesson-success)', fontSize: '1.5rem' }}>Barrier 4 Complete!</h2>
              <p style={{ margin: 0, color: 'var(--lesson-secondary)', lineHeight: '1.6' }}>
                You have successfully identified what matter is! All objects we observed in the classroom have mass and occupy space, which means everything is made of matter.
                Your core investigations are complete. Let's summarize the case!
              </p>
            </div>
            <button 
              onClick={onComplete}
              className="primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', fontWeight: 'bold' }}
            >
              Continue to Chapter Summary <ArrowRight size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
