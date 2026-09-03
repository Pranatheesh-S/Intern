import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Stage3_Classification from './Stage3_Classification';
import Stage5_Suitability from './Stage5_Suitability';
import Stage_SportsBall from './Stage_SportsBall';

export default function Barrier2_Grouping({ onComplete, addXp }) {
  const [stage, setStage] = useState(1);

  return (
    <div style={{ width: '100%' }}>
      <AnimatePresence mode="wait">
        {stage === 1 && (
          <motion.div key="stage1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Stage3_Classification onComplete={() => setStage(2)} addXp={addXp} />
          </motion.div>
        )}
        
        {stage === 2 && (
          <motion.div key="stage2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Stage5_Suitability onComplete={() => setStage(3)} addXp={addXp} />
          </motion.div>
        )}

        {stage === 3 && (
          <motion.div key="stage3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Stage_SportsBall onComplete={() => setStage(4)} addXp={addXp} />
          </motion.div>
        )}

        {stage === 4 && (
          <motion.div 
            key="stage4" 
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
              <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--lesson-success)', fontSize: '1.5rem' }}>Barrier 2 Complete!</h2>
              <p style={{ margin: 0, color: 'var(--lesson-secondary)', lineHeight: '1.6' }}>
                Classification is not fixed! Scientists choose different properties depending on what they want to study. 
                Next, let's investigate the specific properties of materials like lustre, hardness, and transparency.
              </p>
            </div>
            <button 
              onClick={onComplete}
              className="primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', fontWeight: 'bold' }}
            >
              Continue to Barrier 3 <ArrowRight size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
