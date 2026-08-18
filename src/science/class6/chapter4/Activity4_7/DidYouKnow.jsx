import React, { useState } from 'react';

const facts = [
  {
    "title": "Earth's Magnetic Shield",
    "content": "Earth's magnetic field acts like a gigantic invisible shield, deflecting harmful solar radiation and space particles away from our planet!"
  },
  {
    "title": "Animals & Navigation",
    "content": "Migratory birds, sea turtles, and honeybees have built-in biological compasses that allow them to sense Earth's magnetic field to travel thousands of miles without getting lost."
  }
];

export default function DidYouKnow() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

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
          <div 
            key={idx} 
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.5rem',
              paddingBottom: idx !== facts.length - 1 ? '1.5rem' : '0',
              borderBottom: idx !== facts.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>👉</span>
              <h4 style={{ margin: 0, fontSize: '1.05rem', color: hoveredIdx === idx ? '#ff7700' : '#f8fafc', transition: 'color 0.2s ease' }}>{fact.title}</h4>
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.6', color: hoveredIdx === idx ? '#ff7700' : '#cbd5e1', paddingLeft: '1.7rem', textAlign: 'justify', transition: 'color 0.2s ease' }}>
              {fact.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
