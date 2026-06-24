import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Table as TableIcon, Award, RefreshCcw } from 'lucide-react';

const ITEMS = [
  { id: 'copper', name: 'Piece of copper', correctLustre: 'lustrous', correctHardness: 'hard', correctHammer: 'flattens' },
  { id: 'aluminium', name: 'Piece of aluminium', correctLustre: 'lustrous', correctHardness: 'hard', correctHammer: 'flattens' },
  { id: 'iron_nail', name: 'Iron nail', correctLustre: 'lustrous', correctHardness: 'hard', correctHammer: 'flattens' },
  { id: 'coal', name: 'Piece of coal', correctLustre: 'non-lustrous', correctHardness: 'hard', correctHammer: 'breaks' },
  { id: 'sulfur', name: 'Lump of sulfur', correctLustre: 'non-lustrous', correctHardness: 'soft', correctHammer: 'breaks' },
  { id: 'wood', name: 'Block of wood', correctLustre: 'non-lustrous', correctHardness: 'hard', correctHammer: 'breaks' }
];

export default function QuizPanel({ observations }) {
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const initialAnswers = {};
    ITEMS.forEach(item => {
      initialAnswers[item.id] = {
        lustre: observations?.observe?.[item.id]?.lustre || '',
        hardness: observations?.observe?.[item.id]?.hardness || '',
        hammer: observations?.hammer?.[item.id] || ''
      };
    });
    setAnswers(initialAnswers);
  }, [observations]);

  const handleSelect = (itemId, field, value) => {
    if (isSubmitted) return;
    setAnswers(prev => ({
      ...prev,
      [itemId]: {
        ...(prev[itemId] || {}),
        [field]: value
      }
    }));
  };

  const checkAnswers = () => {
    let currentScore = 0;
    ITEMS.forEach(item => {
      const ans = answers[item.id] || {};
      if (ans.lustre === item.correctLustre) currentScore++;
      if (ans.hardness === item.correctHardness) currentScore++;
      if (ans.hammer === item.correctHammer) currentScore++;
    });
    setScore(currentScore);
    setIsSubmitted(true);
  };

  const totalPossible = ITEMS.length * 3;
  const allAnswered = ITEMS.every(item => {
    const ans = answers[item.id];
    return ans && ans.lustre && ans.hardness && ans.hammer;
  });

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1.5rem' }}>
          <TableIcon style={{ color: '#8b5cf6' }} />
          Table 4.1 Checkout
        </h3>
        <p style={{ color: '#94a3b8', margin: 0 }}>
          Based on your observations, fill in Table 4.1 to classify the materials.
        </p>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '1rem', color: '#f8fafc' }}>Object / Material</th>
              <th style={{ padding: '1rem', color: '#f8fafc' }}>Appearance</th>
              <th style={{ padding: '1rem', color: '#f8fafc' }}>Hardness</th>
              <th style={{ padding: '1rem', color: '#f8fafc' }}>Effect of Hammering</th>
            </tr>
          </thead>
          <tbody>
            {ITEMS.map((item, index) => {
              const ans = answers[item.id] || {};
              const isCorrectLustre = ans.lustre === item.correctLustre;
              const isCorrectHardness = ans.hardness === item.correctHardness;
              const isCorrectHammer = ans.hammer === item.correctHammer;

              return (
                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem', color: '#cbd5e1' }}>
                    {index + 1}. {item.name}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <select
                      value={ans.lustre || ''}
                      onChange={(e) => handleSelect(item.id, 'lustre', e.target.value)}
                      disabled={isSubmitted}
                      style={{
                        padding: '0.5rem',
                        background: 'rgba(0,0,0,0.3)',
                        color: '#fff',
                        border: isSubmitted ? (isCorrectLustre ? '1px solid #10b981' : '1px solid #ef4444') : '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '4px',
                        width: '100%'
                      }}
                    >
                      <option value="" disabled>Select...</option>
                      <option value="lustrous">Lustrous</option>
                      <option value="non-lustrous">Non-lustrous</option>
                    </select>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <select
                      value={ans.hardness || ''}
                      onChange={(e) => handleSelect(item.id, 'hardness', e.target.value)}
                      disabled={isSubmitted}
                      style={{
                        padding: '0.5rem',
                        background: 'rgba(0,0,0,0.3)',
                        color: '#fff',
                        border: isSubmitted ? (isCorrectHardness ? '1px solid #10b981' : '1px solid #ef4444') : '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '4px',
                        width: '100%'
                      }}
                    >
                      <option value="" disabled>Select...</option>
                      <option value="hard">Hard</option>
                      <option value="soft">Soft</option>
                    </select>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <select
                      value={ans.hammer || ''}
                      onChange={(e) => handleSelect(item.id, 'hammer', e.target.value)}
                      disabled={isSubmitted}
                      style={{
                        padding: '0.5rem',
                        background: 'rgba(0,0,0,0.3)',
                        color: '#fff',
                        border: isSubmitted ? (isCorrectHammer ? '1px solid #10b981' : '1px solid #ef4444') : '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '4px',
                        width: '100%'
                      }}
                    >
                      <option value="" disabled>Select...</option>
                      <option value="flattens">Flattens into pieces</option>
                      <option value="breaks">Breaks into pieces</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '1rem' }}>
        {!isSubmitted ? (
          <button
            onClick={checkAnswers}
            disabled={!allAnswered}
            className="primary"
            style={{ padding: '0.75rem 2rem', fontSize: '1.1rem', opacity: allAnswered ? 1 : 0.5, cursor: allAnswered ? 'pointer' : 'not-allowed' }}
          >
            Submit Table for Checking
          </button>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel"
            style={{ padding: '1.5rem', textAlign: 'center', background: score === totalPossible ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', border: score === totalPossible ? '1px solid #10b981' : '1px solid #f59e0b' }}
          >
            <h4 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: score === totalPossible ? '#10b981' : '#f59e0b' }}>
              <Award size={24} />
              {score === totalPossible ? 'Perfect Observation!' : 'Good effort!'}
            </h4>
            <p style={{ color: '#e2e8f0', margin: '0 0 1rem 0' }}>
              You got {score} out of {totalPossible} correct.
            </p>
            {score < totalPossible && (
              <button onClick={() => { setIsSubmitted(false); setAnswers({}); }} className="outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <RefreshCcw size={16} /> Try Again
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
