import React from 'react';

const facts = [
  {
    "title": "Not Every Metal is Magnetic",
    "content": "A magnet does not attract every metal. Iron, nickel, and cobalt stick to magnets, but metals like aluminium, copper, silver, and gold do not. That is why some metal objects are magnetic while others are not!"
  },
  {
    "title": "Electricity and Magnetism",
    "content": "More than 200 years ago, scientist Hans Christian Ørsted noticed that a compass needle moved near an electric wire. This discovery showed that electricity and magnetism are connected."
  },
  {
    "title": "Magnets in Recycling",
    "content": "Magnets are used in recycling centres to separate iron and steel from other waste. This helps recycle metals faster and keeps the environment cleaner."
  },
  {
    "title": "Data Storage",
    "content": "Many modern devices, such as computers and data storage systems, use tiny magnets to store information. These magnets help keep your photos, videos, and files safe."
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
