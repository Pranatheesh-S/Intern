import React from 'react';

export default function Stage2_Test({ onComplete }) {
  return (
    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
      <h3>Stage 2: Predict and Test</h3>
      <p>Under construction. In this stage, students will test if one lemon is enough, and connect more lemons to see the voltage rise.</p>
      <button onClick={onComplete} className="primary" style={{ marginTop: '1rem' }}>Complete Stage 2</button>
    </div>
  );
}
