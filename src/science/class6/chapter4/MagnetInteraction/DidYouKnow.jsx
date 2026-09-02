import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useHybridVoice } from '../../../../hooks/useHybridVoice';

const facts = [
  {
    id: 'magnetic_fields',
    title: "Magnetic Fields",
    shortTitle: "Magnetic Fields",
    content: "Magnets have an invisible force around them called a magnetic field. Even when two magnets are not touching, this field can make them attract or repel each other!",
    audioUrl: '/audio/magnetic_fields.mp3'
  },
  {
    id: 'electric_currents',
    title: "Electric Currents",
    shortTitle: "Electric Currents",
    content: "French scientist André-Marie Ampère discovered that magnetic forces are related to tiny electric currents inside materials. His work helped explain why magnets attract and repel each other.",
    audioUrl: '/audio/electric_currents.mp3'
  },
  {
    id: 'everyday_uses',
    title: "Everyday Uses",
    shortTitle: "Everyday Uses",
    content: "Magnetic door locks, refrigerator magnets, and some toys work because magnets attract each other and hold objects in place without glue or tape.",
    audioUrl: '/audio/everyday_uses.mp3'
  },
  {
    id: 'maglev_trains',
    title: "Maglev Trains",
    shortTitle: "Maglev Trains",
    content: "Scientists use magnetic forces in maglev trains. These trains float slightly above the tracks and move very fast because there is very little friction.",
    audioUrl: '/audio/maglev_trains.mp3'
  }
];

export default function DidYouKnow() {
  const [hoveredFact, setHoveredFact] = useState(null);
  const { speak, stop, spokenCharIndex } = useHybridVoice();

  const handleMouseEnter = (fact) => {
    setHoveredFact(fact);
    const fullText = `${fact.title}. ${fact.content}`;
    speak({
      text: fullText,
      role: 'teacher',
      audioUrl: fact.audioUrl
    });
  };

  const handleMouseLeave = () => {
    setHoveredFact(null);
    stop();
  };

  // Dark green text with vibrant orange for currently reading word only
  const renderHighlightedContent = (content, title, charIndex) => {
    if (!content) return null;
    if (charIndex === undefined || charIndex === null || charIndex < 0) {
      return <span style={{ color: '#064E3B' }}>{content}</span>;
    }

    const titleOffset = title ? title.length + 2 : 0;
    const adjustedIndex = charIndex - titleOffset;

    const words = content.split(' ');
    let currentPos = 0;

    return words.map((word, i) => {
      const startPos = currentPos;
      const endPos = currentPos + word.length;
      currentPos = endPos + 1;

      const isCurrentWord = adjustedIndex >= startPos && adjustedIndex <= endPos + 2;

      let color = '#064E3B'; // Dark green
      let fontWeight = 600;

      if (isCurrentWord) {
        color = '#EA580C'; // Orange for reading word only
        fontWeight = 800;
      }

      return (
        <span
          key={i}
          style={{
            color,
            fontWeight,
            transition: 'color 0.12s ease',
            display: 'inline-block',
            marginRight: '0.28rem'
          }}
        >
          {word}
        </span>
      );
    });
  };

  return (
    <div style={{ position: 'relative', width: '100%', fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Floating Hover Tooltip Card with White Background & Dark Green Text */}
      {hoveredFact && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 14px)',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '95%',
          maxWidth: '750px',
          background: '#FFFFFF',
          border: '1.5px solid #FDE68A',
          borderRadius: '24px',
          padding: '1.45rem 2rem',
          color: '#064E3B',
          boxShadow: '0 20px 45px rgba(69, 26, 3, 0.18), 0 4px 12px rgba(0, 0, 0, 0.08)',
          zIndex: 100000,
          pointerEvents: 'none',
          backdropFilter: 'blur(16px)',
          transition: 'all 0.25s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '1.75rem' }}>🧠</span>
            <h4 style={{ margin: 0, fontSize: '1.55rem', fontWeight: 900, color: '#064E3B', letterSpacing: '-0.01em', lineHeight: 1.25 }}>
              {hoveredFact.title}
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '1.18rem', lineHeight: '1.7', color: '#065F46', fontWeight: 600 }}>
            {renderHighlightedContent(hoveredFact.content, hoveredFact.title, spokenCharIndex)}
          </p>
        </div>
      )}

      {/* Main Bottom Bar */}
      <div style={{
        background: 'linear-gradient(135deg, #78350F 0%, #451A03 100%)',
        border: '1.5px solid #B45309',
        boxShadow: '0 4px 18px rgba(69, 26, 3, 0.35)',
        borderRadius: '20px',
        padding: '0.45rem 1.35rem',
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
          <span style={{ fontSize: '1.6rem' }}>🧠</span>
        </div>

        {/* Fact items horizontally */}
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'space-around', height: '100%' }}>
          {facts.map((fact, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <div style={{ width: '1.5px', height: '55%', backgroundColor: '#92400E' }} />
              )}
              <div
                onMouseEnter={() => handleMouseEnter(fact)}
                onMouseLeave={handleMouseLeave}
                style={{
                  color: hoveredFact === fact ? '#FEF3C7' : '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '1.12rem',
                  fontWeight: 900,
                  padding: '0.35rem 0.75rem',
                  borderRadius: '12px',
                  backgroundColor: hoveredFact === fact ? 'rgba(254, 243, 199, 0.2)' : 'transparent',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <span style={{ fontSize: '1.18rem', color: hoveredFact === fact ? '#F59E0B' : '#FAFAFA' }}>👉</span>
                <span>{fact.shortTitle}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Sparkle Icon */}
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, paddingLeft: '0.5rem', color: '#F59E0B' }}>
          <Sparkles size={20} color="#F59E0B" />
        </div>
      </div>
    </div>
  );
}
