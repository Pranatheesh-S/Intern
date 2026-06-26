import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Trophy, Home } from 'lucide-react';
import { TEST_MATERIALS } from './MaterialObjects';

export default function Stage3_Conclusion({ results, onComplete }) {
  // state for user selections in the table
  const [conclusions, setConclusions] = useState({}); // { itemId: 'Conductor' | 'Insulator' }
  const [showCelebration, setShowCelebration] = useState(false);

  const handleSelect = (itemId, value) => {
    setConclusions(prev => ({ ...prev, [itemId]: value }));
  };

  // Check if all conclusions match the correct answer
  const isComplete = TEST_MATERIALS.every(item => {
    const expected = item.isConductor ? 'Conductor' : 'Insulator';
    return conclusions[item.id] === expected;
  });

  useEffect(() => {
    if (isComplete) {
      setShowCelebration(true);
    }
  }, [isComplete]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <h3 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0', color: 'var(--text-heading)' }}>
          Record Observations
        </h3>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          Based on your experiment, fill in Table 3.3 by classifying each material as a Conductor or an Insulator.
        </p>
      </div>

      <div style={{ 
        background: 'var(--bg-color)', 
        borderRadius: '12px', 
        padding: '2rem', 
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem'
      }}>
        
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: 'var(--surface)' }}>
            <thead>
              <tr style={{ background: 'var(--surface-hover)', borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '1rem' }}>S.No.</th>
                <th style={{ padding: '1rem' }}>Object</th>
                <th style={{ padding: '1rem' }}>Material it is made of</th>
                <th style={{ padding: '1rem' }}>Lamp glows (Yes/No)</th>
                <th style={{ padding: '1rem' }}>Conclusion</th>
              </tr>
            </thead>
            <tbody>
              {TEST_MATERIALS.map((item, index) => {
                const glowed = results[item.id];
                const expected = item.isConductor ? 'Conductor' : 'Insulator';
                const currentSel = conclusions[item.id];
                const isCorrect = currentSel === expected;
                
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{index + 1}</td>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                      <span style={{ marginRight: '0.5rem' }}>{item.icon}</span> {item.name}
                    </td>
                    <td style={{ padding: '1rem' }}>{item.material}</td>
                    <td style={{ padding: '1rem' }}>
                      {glowed !== undefined ? (
                        <span style={{ color: glowed ? 'var(--warning)' : 'var(--text-secondary)', fontWeight: 'bold' }}>
                          {glowed ? 'Yes' : 'No'}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>-</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <select 
                        value={currentSel || ''}
                        onChange={(e) => handleSelect(item.id, e.target.value)}
                        style={{
                          background: 'var(--canvas-bg)',
                          color: 'var(--text-primary)',
                          border: `1px solid ${currentSel ? (isCorrect ? 'var(--success)' : 'var(--destructive)') : 'var(--border)'}`,
                          padding: '0.5rem',
                          borderRadius: '4px',
                          outline: 'none',
                          cursor: 'pointer',
                          width: '120px'
                        }}
                      >
                        <option value="" disabled>Select...</option>
                        <option value="Conductor">Conductor</option>
                        <option value="Insulator">Insulator</option>
                      </select>
                      {currentSel && !isCorrect && (
                        <span style={{ color: 'var(--destructive)', fontSize: '0.75rem', marginLeft: '0.5rem' }}>
                          Try again
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {showCelebration && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid var(--success-border)',
              borderRadius: '8px',
              padding: '1.5rem',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              textAlign: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--success)' }}>
              <Trophy size={28} />
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Excellent Work!</h3>
            </div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: '1.5' }}>
              You have successfully tested and classified all the materials! You now know that metals and graphite are <strong>conductors</strong>, while wood, plastic, rubber, glass, and paper are <strong>insulators</strong>.
            </p>
            <button 
              className="primary" 
              onClick={onComplete}
              style={{ marginTop: '0.5rem', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Home size={18} /> Return to Dashboard
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
}
