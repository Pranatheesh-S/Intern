import React from 'react';
import { BookMarked, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EvidenceSummary({ data, onComplete, addXp }) {
  const handleContinue = () => {
    onComplete();
  };

  return (
    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '700px', display: 'flex', flexDirection: 'column', gap: '1.5rem', borderLeft: '4px solid var(--lesson-success)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--lesson-border)', paddingBottom: '1rem' }}>
          <BookMarked size={32} color="var(--lesson-success)" />
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--lesson-primary)' }}>{data.title || "Evidence Logged"}</h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--lesson-secondary)' }}>{data.dialogue}</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--lesson-text)' }}>Today's Discoveries:</h3>
          {data.discoveries.map((discovery, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              style={{
                display: 'flex', gap: '1rem', alignItems: 'flex-start',
                background: 'var(--lesson-surface)', padding: '1rem', borderRadius: '8px',
                borderLeft: '4px solid var(--lesson-success)'
              }}
            >
              <CheckCircle size={20} color="var(--lesson-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ fontSize: '1rem', color: 'var(--lesson-text)', lineHeight: '1.5' }}>{discovery}</span>
            </motion.div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button className="success" onClick={handleContinue}>
            Proceed <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
