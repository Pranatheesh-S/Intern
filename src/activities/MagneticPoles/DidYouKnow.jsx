import React from 'react';

const facts = [
  {
    "title": "Earth is a Giant Magnet",
    "content": "Earth acts like a giant magnet! It has its own magnetic field, which helps a compass point north. This invisible magnetic shield also protects our planet from harmful particles coming from the Sun."
  },
  {
    "title": "William Gilbert's Discovery",
    "content": "In 1600, English scientist William Gilbert studied magnets carefully and discovered that Earth behaves like a giant magnet. His work helped scientists understand why compass needles always point in a particular direction."
  },
  {
    "title": "Magnets in Medicine",
    "content": "Hospitals use powerful magnets in MRI machines to take detailed pictures of organs and bones inside the human body. Doctors can see what is happening inside without performing surgery."
  },
  {
    "title": "Electric Cars",
    "content": "Many electric cars use strong magnets inside their motors. These magnets help the cars move efficiently while using less energy, making transportation cleaner and more environmentally friendly."
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
