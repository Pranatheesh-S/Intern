import React from 'react';

const facts = [
  {
    "title": "Earth acts like a giant magnet",
    "content": "If you float a magnetized needle on a small piece of cork in water, it will slowly turn and point in the north-south direction. This simple experiment works because Earth acts like a giant magnet!"
  },
  {
    "title": "Ancient Chinese Compasses",
    "content": "More than 1,000 years ago, people in ancient China used magnetic compasses to find directions. These early compasses helped travelers and sailors navigate long journeys even when landmarks were not visible."
  },
  {
    "title": "Reliability of Compasses",
    "content": "Even today, compasses are used by hikers, trekkers, sailors, and rescue teams. Unlike GPS, a compass does not need batteries or internet, making it a reliable tool for finding directions anywhere."
  },
  {
    "title": "Compasses in Space",
    "content": "Scientists use highly sensitive magnetic compasses on spacecraft and satellites to study Earth's magnetic field. This helps researchers understand space weather, which can affect communication systems and GPS signals on Earth."
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
            <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.6', color: '#cbd5e1', paddingLeft: '1.7rem', textAlign: 'justify' }}>
              {fact.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
