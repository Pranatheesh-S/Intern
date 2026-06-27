import React, { useState } from 'react';

const QUESTIONS = [
  { id: 1, text: "What acts as the electrolyte in a lemon battery?", options: ["Lemon Juice", "Copper Strip", "Iron Nail", "LED"], correct: 0, explanation: "The acidic lemon juice contains ions that allow electricity to flow, acting as the electrolyte." },
  { id: 2, text: "Why are multiple lemons connected in series?", options: ["To increase the total voltage", "To decrease the current", "To make it look cool", "To stop short circuits"], correct: 0, explanation: "Connecting cells in series adds their voltages together, providing enough power to light the LED." },
  { id: 3, text: "Which terminal of the LED should be connected to the positive side?", options: ["Long Lead", "Short Lead", "Doesn't matter"], correct: 0, explanation: "The longer lead of an LED is the anode (positive terminal) and must connect to the positive side of the battery." },
  { id: 4, text: "What happens if the copper strip touches the iron nail inside the same lemon?", options: ["A short circuit occurs", "Voltage doubles", "LED gets brighter", "Nothing happens"], correct: 0, explanation: "If the metals touch inside the lemon, the electrons flow directly between them instead of through the wires, creating a short circuit." },
  { id: 5, text: "Which of the following can affect the voltage produced?", options: ["Metal pair", "Electrolyte", "Number of cells", "All of the above"], correct: 3, explanation: "Voltage is determined by the types of metals, the conductivity of the electrolyte, and how many cells are linked together!" },
];

export default function Stage4_Quiz({ onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState({});
  const [showResults, setShowResults] = useState(false);

  const q = QUESTIONS[currentIdx];
  const isLastQuestion = currentIdx === QUESTIONS.length - 1;

  const handleSelect = (oIdx) => {
    if (showResults || selected[q.id] !== undefined) return;
    setSelected({ ...selected, [q.id]: oIdx });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResults(true);
    } else {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const score = QUESTIONS.reduce((total, question) => {
    return total + (selected[question.id] === question.correct ? 1 : 0);
  }, 0);

  return (
    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: 'var(--text-heading)' }}>Concept Quiz</h3>
        {!showResults && (
          <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)', background: 'var(--surface)', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
            {currentIdx + 1} / {QUESTIONS.length}
          </span>
        )}
      </div>
      
      {!showResults ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
          <div style={{ padding: '1.5rem', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <h4 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', lineHeight: '1.4', color: 'var(--text-primary)' }}>
              {currentIdx + 1}. {q.text}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {q.options.map((opt, oIdx) => {
                const hasAnswered = selected[q.id] !== undefined;
                const isSelected = selected[q.id] === oIdx;
                const isCorrect = oIdx === q.correct;
                
                let bg = 'transparent';
                let border = 'var(--border)';
                let color = 'inherit';

                if (hasAnswered) {
                  if (isCorrect) {
                    bg = 'var(--success-bg)';
                    border = 'var(--success)';
                    color = 'var(--success)';
                  } else if (isSelected) {
                    bg = 'var(--danger-bg)';
                    border = 'var(--danger)';
                    color = 'var(--danger)';
                  }
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelect(oIdx)}
                    className="outline"
                    disabled={hasAnswered}
                    style={{
                      textAlign: 'left',
                      padding: '1rem',
                      background: bg,
                      borderColor: border,
                      color: color,
                      transition: 'all 0.2s ease',
                      fontWeight: isSelected || (hasAnswered && isCorrect) ? '600' : '400',
                      cursor: hasAnswered ? 'default' : 'pointer'
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {selected[q.id] !== undefined && (
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: selected[q.id] === q.correct ? 'var(--success-bg)' : 'var(--danger-bg)', borderRadius: '8px', borderLeft: `4px solid ${selected[q.id] === q.correct ? 'var(--success)' : 'var(--danger)'}` }}>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-heading)', lineHeight: '1.5' }}>
                  <strong style={{ color: selected[q.id] === q.correct ? 'var(--success)' : 'var(--danger)' }}>
                    {selected[q.id] === q.correct ? 'Correct! ' : 'Not quite. '}
                  </strong>
                  {q.explanation}
                </p>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
            <button 
              onClick={handleNext} 
              className="primary" 
              disabled={selected[q.id] === undefined}
              style={{ padding: '0.75rem 2rem' }}
            >
              {isLastQuestion ? 'Submit Quiz' : 'Next Question'}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            {score === QUESTIONS.length ? '🏆' : '👍'}
          </div>
          <h3 style={{ color: score === QUESTIONS.length ? 'var(--success)' : 'var(--primary)', marginBottom: '0.5rem' }}>
            Quiz Complete!
          </h3>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            You scored <strong>{score}</strong> out of <strong>{QUESTIONS.length}</strong>.
          </p>
          <button onClick={onComplete} className="primary" style={{ padding: '0.75rem 2rem' }}>
            Return to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
