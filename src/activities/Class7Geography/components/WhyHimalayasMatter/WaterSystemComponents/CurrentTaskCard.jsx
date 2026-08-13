import React from 'react';

export default function CurrentTaskCard() {
  return (
    <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
      <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 1rem 0' }}>
        Current Task
      </h3>
      <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem', fontStyle: 'italic' }}>
        Resources will appear here in the next step.
      </p>
    </div>
  );
}
