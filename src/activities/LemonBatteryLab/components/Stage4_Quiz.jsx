import React, { useState } from 'react';

const QUESTIONS = [
  { id: 1, text: "What acts as the electrolyte in a lemon battery?", options: ["Lemon Juice", "Copper Strip", "Iron Nail", "LED"], correct: 0 },
  { id: 2, text: "Why are multiple lemons connected in series?", options: ["To increase the total voltage", "To decrease the current", "To make it look cool", "To stop short circuits"], correct: 0 },
  { id: 3, text: "Which terminal of the LED should be connected to the positive side?", options: ["Long Lead", "Short Lead", "Doesn't matter"], correct: 0 },
  { id: 4, text: "What happens if the copper strip touches the iron nail inside the same lemon?", options: ["A short circuit occurs", "Voltage doubles", "LED gets brighter", "Nothing happens"], correct: 0 },
  { id: 5, text: "Which of the following can affect the voltage produced?", options: ["Metal pair", "Electrolyte", "Number of cells", "All of the above"], correct: 3 },
];

export default function Stage4_Quiz({ onComplete }) {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const score = Object.values(answers).reduce((a, b) => a + b, 0);

  return (
    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Concept Quiz</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {QUESTIONS.map((q, idx) => (
          <div key={q.id} style={{ padding: '1rem', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <p style={{ margin: '0 0 1rem 0', fontWeight: 'bold' }}>{idx + 1}. {q.text}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {q.options.map((opt, oIdx) => (
                <button
                  key={oIdx}
                  onClick={() => !showResults && setAnswers({ ...answers, [q.id]: oIdx === q.correct ? 1 : 0 })}
                  className="outline"
                  style={{
                    textAlign: 'left',
                    background: showResults 
                      ? (oIdx === q.correct ? 'var(--success-bg)' : answers[q.id] !== undefined && oIdx !== q.correct ? 'var(--danger-bg)' : 'transparent')
                      : answers[q.id] !== undefined ? 'var(--primary-light)' : 'transparent',
                    borderColor: showResults && oIdx === q.correct ? 'var(--success)' : 'var(--border)'
                  }}
                  disabled={showResults}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {!showResults ? (
        <button 
          onClick={() => setShowResults(true)} 
          className="primary" 
          style={{ width: '100%', marginTop: '2rem', padding: '1rem' }}
          disabled={Object.keys(answers).length < QUESTIONS.length}
        >
          Submit Answers
        </button>
      ) : (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <h4 style={{ color: score === QUESTIONS.length ? 'var(--success)' : 'var(--warning)' }}>
            You scored {score} out of {QUESTIONS.length}!
          </h4>
          <button onClick={onComplete} className="outline" style={{ marginTop: '1rem' }}>Return to Dashboard</button>
        </div>
      )}
    </div>
  );
}
