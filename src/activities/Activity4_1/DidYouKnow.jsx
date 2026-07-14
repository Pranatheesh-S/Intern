import React from 'react';

const facts = [
  {
    "title": "Magnetic vs Non-Magnetic",
    "content": "Not all metals stick to a magnet. Metals like iron, nickel, and cobalt are magnetic, while materials such as wood, plastic, glass, and rubber are not."
  },
  {
    "title": "Looks Can Be Deceiving",
    "content": "Two objects can look almost the same, but one may stick to a magnet while the other does not. The material an object is made of\u2014not its shape, size, or colour\u2014determines whether a magnet attracts it."
  },
  {
    "title": "A Testing Tool",
    "content": "Scientists often use a magnet as a quick testing tool to find out whether an unknown object is made of a magnetic material like iron or steel."
  }
];

export default function DidYouKnow() {
  return (
    <div className="glass-panel" style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 27, 75, 0.95))',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '16px',
      padding: '1.5rem',
      position: 'sticky',
      top: '2rem',
      color: '#f8fafc'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '1.5rem' }}>🧠</span>
        <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#f8fafc' }}>Did you know?</h3>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {facts.map((fact, idx) => (
          <div key={idx} style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0.5rem',
            paddingBottom: idx !== facts.length - 1 ? '1.5rem' : '0',
            borderBottom: idx !== facts.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>👉</span>
              <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#f8fafc' }}>{fact.title}</h4>
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.6', color: '#cbd5e1', paddingLeft: '1.7rem' }}>
              {fact.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
