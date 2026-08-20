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

  // Color-only text karaoke highlighting in Fruit Orange
  const renderHighlightedContent = (content, title, charIndex) => {
    if (!content) return null;
    if (charIndex === undefined || charIndex === null || charIndex < 0) {
      return <span>{content}</span>;
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
      const isPastWord = adjustedIndex > endPos + 2;

      let color = '#cbd5e1';
      let fontWeight = 500;

      if (isCurrentWord) {
        color = '#ff7700'; // Bright Fruit Orange active spoken word
        fontWeight = 700;
      } else if (isPastWord) {
        color = '#f1f5f9'; // Read word
      }

      return (
        <span
          key={i}
          style={{
            color,
            fontWeight,
            transition: 'color 0.15s ease',
            display: 'inline-block',
            marginRight: '0.25rem'
          }}
        >
          {word}
        </span>
      );
    });
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Floating Hover Tooltip Card */}
      {hoveredFact && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 14px)',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '95%',
          maxWidth: '750px',
          background: 'linear-gradient(135deg, #F0FDF9 0%, #E6F7F5 100%)',
          border: '1.5px solid #CCECE7',
          borderRadius: '22px',
          padding: '1.25rem 1.75rem',
          color: '#134E4A',
          boxShadow: '0 25px 50px rgba(15, 118, 110, 0.15)',
          zIndex: 100000,
          pointerEvents: 'none',
          backdropFilter: 'blur(16px)',
          transition: 'all 0.25s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span>
            <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#134E4A' }}>
              {hoveredFact.title}
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '1.02rem', lineHeight: '1.65', color: '#115E59' }}>
            {renderHighlightedContent(hoveredFact.content, hoveredFact.title, spokenCharIndex)}
          </p>
        </div>
      )}

      {/* Main Bottom Bar - Rich Brown Theme matching Activity 4.3 */}
      <div style={{
        background: 'linear-gradient(135deg, #78350F 0%, #451A03 100%)',
        border: '1.5px solid #B45309',
        boxShadow: '0 4px 16px rgba(69, 26, 3, 0.4)',
        borderRadius: '18px',
        padding: '0.6rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        boxSizing: 'border-box',
        height: '54px',
        minHeight: '54px'
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
                <div style={{ width: '1px', height: '60%', backgroundColor: '#B45309' }} />
              )}
              <div
                onMouseEnter={() => handleMouseEnter(fact)}
                onMouseLeave={handleMouseLeave}
                style={{
                  color: hoveredFact === fact ? '#F59E0B' : '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  padding: '0.4rem 0.6rem',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <span style={{ fontSize: '1rem', color: hoveredFact === fact ? '#F59E0B' : '#F59E0B' }}>👉</span>
                <span>{fact.shortTitle}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Sparkle Icon */}
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, paddingLeft: '0.5rem', color: '#F59E0B' }}>
          <Sparkles size={18} color="#F59E0B" />
        </div>
      </div>
    </div>
  );
}
