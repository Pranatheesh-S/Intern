import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Stage4_LustreHardness from './Stage4_LustreHardness';
import Stage6_Transparency from './Stage6_Transparency';
import Stage7_SolubilityMatter from './Stage7_SolubilityMatter';

export default function Barrier3_Properties({ onComplete, addXp }) {
  const [stage, setStage] = useState(1);

  return (
    <div style={{ width: '100%' }}>
      <AnimatePresence mode="wait">
        {stage === 1 && (
          <motion.div key="stage1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Stage4_LustreHardness onComplete={() => setStage(2)} addXp={addXp} />
          </motion.div>
        )}
        
        {stage === 2 && (
          <motion.div key="stage2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Stage6_Transparency onComplete={() => setStage(3)} addXp={addXp} />
          </motion.div>
        )}

        {stage === 3 && (
          <motion.div key="stage3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Stage7_SolubilityMatter mode="solubility" onComplete={() => setStage(4)} addXp={addXp} />
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
              <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--lesson-success)', fontSize: '1.5rem' }}>Barrier 3 Complete!</h2>
              <p style={{ margin: 0, color: 'var(--lesson-secondary)', lineHeight: '1.6' }}>
                You have successfully tested Lustre, Hardness, Transparency, and Solubility. 
                All these properties help us decide what materials to use for what objects! 
                Now, there is one final question to answer...
              </p>
            </div>
            <button 
              onClick={onComplete}
              className="primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', fontWeight: 'bold' }}
            >
              Continue to Barrier 4 <ArrowRight size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
