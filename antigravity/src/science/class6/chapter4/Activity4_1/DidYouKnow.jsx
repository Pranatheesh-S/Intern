import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

const facts = [
  {
    title: "Not every metal is magnetic",
    shortTitle: "Not every metal is magnetic",
    content: "A magnet does not attract every metal. Iron, nickel, and cobalt stick to magnets, but metals like aluminium, copper, silver, and gold do not. That is why some metal objects are magnetic while others are not!"
  },
  {
    title: "Electricity and magnetism",
    shortTitle: "Electricity and magnetism",
    content: "More than 200 years ago, scientist Hans Christian Ørsted noticed that a compass needle moved near an electric wire. This discovery showed that electricity and magnetism are connected."
  },
  {
    title: "Magnets in recycling",
    shortTitle: "Magnets in recycling",
    content: "Magnets are used in recycling centres to separate iron and steel from other waste. This helps recycle metals faster and keeps the environment cleaner."
  },
  {
    title: "Data storage",
    shortTitle: "Data storage (not)",
    content: "Many modern devices, such as computers and data storage systems, use tiny magnets to store information. These magnets help keep your photos, videos, and files safe."
  }
];

export default function DidYouKnow() {
  const [hoveredFact, setHoveredFact] = useState(null);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Floating Hover Tooltip Card */}
      {hoveredFact && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 12px)',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '520px',
          backgroundColor: '#0f172a',
          border: '1px solid rgba(139, 92, 246, 0.6)',
          borderRadius: '16px',
          padding: '1rem 1.25rem',
          color: '#f8fafc',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6), 0 0 20px rgba(139, 92, 246, 0.25)',
          zIndex: 100,
          pointerEvents: 'none'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🧠</span>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#a78bfa' }}>
              {hoveredFact.title}
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.5', color: '#cbd5e1' }}>
            {hoveredFact.content}
          </p>
        </div>
      )}

      {/* Main Bottom Bar */}
      <div style={{
        background: 'rgba(10, 15, 36, 0.85)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(59, 130, 246, 0.4)',
        boxShadow: '0 0 20px rgba(59, 130, 246, 0.15)',
        borderRadius: '24px',
        padding: '0.6rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        boxSizing: 'border-box',
        height: '56px',
        minHeight: '56px'
      }}>
        {/* Brain Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, paddingRight: '0.75rem' }}>
          <span style={{ fontSize: '1.4rem' }}>🧠</span>
        </div>

        {/* Fact items horizontally */}
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'space-around', height: '100%' }}>
          {facts.map((fact, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <div style={{ width: '1px', height: '60%', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
              )}
              <div
                onMouseEnter={() => setHoveredFact(fact)}
                onMouseLeave={() => setHoveredFact(null)}
                style={{
                  color: hoveredFact === fact ? '#60a5fa' : '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  padding: '0.4rem 0.6rem',
                  borderRadius: '8px',
                  backgroundColor: hoveredFact === fact ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <span style={{ fontSize: '1rem' }}>👉</span>
                <span>{fact.shortTitle}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Sparkle on far right */}
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, paddingLeft: '0.5rem', color: '#60a5fa' }}>
          <Sparkles size={18} />
        </div>
      </div>
    </div>
  );
}


