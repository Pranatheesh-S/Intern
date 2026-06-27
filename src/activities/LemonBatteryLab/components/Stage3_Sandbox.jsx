import React from 'react';

export default function Stage3_Sandbox({ onComplete }) {
  return (
    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
      <h3>Stage 3: Sandbox Explore</h3>
      <p>Under construction. In this stage, students can freely experiment with metal pairs, electrolytes, and the number of cells.</p>
      <button onClick={onComplete} className="primary" style={{ marginTop: '1rem' }}>Complete Stage 3</button>
    </div>
  );
}
