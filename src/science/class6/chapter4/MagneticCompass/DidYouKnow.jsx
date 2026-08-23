import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useHybridVoice } from '../../../../hooks/useHybridVoice';

const facts = [
  {
    id: 'temporary_magnets',
    title: "Temporary Magnets",
    shortTitle: "Temporary Magnets",
    content: "A paper clip, nail, or needle can become a temporary magnet when rubbed with a magnet many times. This happens because tiny magnetic regions inside the metal line up in the same direction, making the object behave like a magnet.",
    audioUrl: '/audio/temporary_magnets.mp3'
  },
  {
    id: 'first_electromagnet',
    title: "The First Electromagnet",
    shortTitle: "First Electromagnet",
    content: "English scientist William Sturgeon built the first practical electromagnet in 1825. His invention showed that ordinary iron could become strongly magnetic and helped lead to many modern electrical devices.",
    audioUrl: '/audio/first_electromagnet.mp3'
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

  // Color-only text karaoke highlighting
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

      let color = '#334155';
      let fontWeight = 600;

      if (isCurrentWord) {
        color = '#D97706'; // Active spoken word
        fontWeight = 800;
      } else if (isPastWord) {
        color = '#064E3B'; // Read word
        fontWeight = 700;
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
          bottom: 'calc(100% + 12px)',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '95%',
          maxWidth: '700px',
          background: '#FFFFFF',
          border: '1.5px solid #A7F3D0',
          borderRadius: '20px',
          padding: '1.15rem 1.6rem',
          color: '#064E3B',
          boxShadow: '0 15px 35px rgba(6, 78, 59, 0.12)',
          zIndex: 100000,
          pointerEvents: 'none',
          backdropFilter: 'blur(12px)',
          transition: 'all 0.25s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '1.4rem' }}>🧠</span>
            <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#064E3B' }}>
              {hoveredFact.title}
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '0.98rem', lineHeight: '1.6', color: '#334155', fontWeight: 600 }}>
            {renderHighlightedContent(hoveredFact.content, hoveredFact.title, spokenCharIndex)}
          </p>
        </div>
      )}

      {/* Main Bottom Bar - Rich Brown Theme matching previous modules */}
      <div style={{
        background: 'linear-gradient(135deg, #78350F 0%, #451A03 100%)',
        border: '1.5px solid #B45309',
        boxShadow: '0 4px 18px rgba(69, 26, 3, 0.4)',
        borderRadius: '20px',
        padding: '0.5rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        boxSizing: 'border-box',
        height: '52px',
        minHeight: '52px'
      }}>
        {/* Brain Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, paddingRight: '0.75rem' }}>
          <span style={{ fontSize: '1.35rem' }}>🧠</span>
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
                  gap: '0.45rem',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  padding: '0.35rem 0.65rem',
                  borderRadius: '10px',
                  backgroundColor: hoveredFact === fact ? 'rgba(254, 243, 199, 0.2)' : 'transparent',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <span style={{ fontSize: '0.95rem', color: hoveredFact === fact ? '#F59E0B' : '#F59E0B' }}>👉</span>
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
