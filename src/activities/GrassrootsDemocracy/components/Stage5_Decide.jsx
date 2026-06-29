import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Stage5_Decide({ onComplete, addXp }) {
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const scenarios = [
    { id: 'q1', text: 'Where should a new village well be dug?', correct: 'Gram Panchayat' },
    { id: 'q2', text: 'Which villages need connecting roads in the block?', correct: 'Panchayat Samiti' },
    { id: 'q3', text: 'How to distribute state funds to all blocks in the district?', correct: 'Zila Parishad' }
  ];

  const options = ['Gram Panchayat', 'Panchayat Samiti', 'Zila Parishad'];

  const handleSelect = (qId, option) => {
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const checkAnswers = () => {
    let score = 0;
    scenarios.forEach(s => {
      if (answers[s.id] === s.correct) score++;
    });
    addXp(score * 10);
    setShowResult(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '20px', height: '2px', background: 'var(--accent-text)' }} />
          Decide · Test Yourself
        </div>
        <h2 style={{ margin: 0, fontSize: '2rem', color: 'var(--text-heading)' }}>
          The Three Tier Challenge
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {scenarios.map(s => (
          <div key={s.id} className="glass-panel" style={{ padding: '1.5rem', background: 'var(--card-bg)' }}>
            <p style={{ margin: '0 0 1rem 0', fontWeight: 'bold', color: 'var(--text-primary)' }}>{s.text}</p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {options.map(opt => (
                <button
                  key={opt}
                  onClick={() => handleSelect(s.id, opt)}
                  disabled={showResult}
                  style={{
                    padding: '0.5rem 1rem', borderRadius: '20px',
                    background: answers[s.id] === opt 
                      ? (showResult ? (opt === s.correct ? '#10b981' : '#ef4444') : 'var(--accent)') 
                      : 'var(--neutral-bg)',
                    color: answers[s.id] === opt ? 'white' : 'var(--text-secondary)',
                    border: 'none', cursor: showResult ? 'default' : 'pointer'
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
            {showResult && answers[s.id] && (
              <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: answers[s.id] === s.correct ? '#10b981' : '#ef4444' }}>
                {answers[s.id] === s.correct ? 'Correct!' : `Incorrect. The right answer is ${s.correct}`}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Step 5 of 7</span>
        {!showResult ? (
          <button 
            onClick={checkAnswers} 
            disabled={Object.keys(answers).length !== scenarios.length}
            className="primary" style={{ padding: '0.8rem 1.5rem', gap: '0.5rem', borderRadius: '8px' }}
          >
            Submit Answers
          </button>
        ) : (
          <button onClick={onComplete} className="primary" style={{ padding: '0.8rem 1.5rem', gap: '0.5rem', borderRadius: '8px' }}>
            Continue <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
