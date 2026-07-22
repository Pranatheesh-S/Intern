import React from 'react';

export default function ProgressCard() {
  return (
    <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{ color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase' }}>Progress</span>
        <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>0 / 6 Tasks Completed</span>
      </div>
      <div style={{ width: '100%', height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: '0%', height: '100%', background: 'var(--accent)' }} />
      </div>
    </div>
  );
}
