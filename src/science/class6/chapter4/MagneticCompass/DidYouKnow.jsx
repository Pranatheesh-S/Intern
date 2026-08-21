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

  // Color-only text karaoke highlighting in Fruit Orange / Golden Yellow
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

      let color = '#475569';
      let fontWeight = 500;

      if (isCurrentWord) {
        color = '#E11D48'; // Bright Rose/Crimson active spoken word
        fontWeight = 800;
      } else if (isPastWord) {
        color = '#1E293B'; // Read word
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
          maxWidth: '700px',
          background: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)',
          border: '1.5px solid #FECDD3',
          borderRadius: '22px',
          padding: '1.25rem 1.75rem',
          color: '#881337',
          boxShadow: '0 25px 50px rgba(225, 29, 72, 0.18)',
          zIndex: 100000,
          pointerEvents: 'none',
          backdropFilter: 'blur(16px)',
          transition: 'all 0.25s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span>
            <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#9F1239' }}>
              {hoveredFact.title}
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '1.02rem', lineHeight: '1.65', color: '#4C0519' }}>
            {renderHighlightedContent(hoveredFact.content, hoveredFact.title, spokenCharIndex)}
          </p>
        </div>
      )}

      {/* Main Bottom Bar - Matching Finish Story Rose/Crimson Theme */}
      <div style={{
        background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
        border: '1.5px solid #FB7185',
        boxShadow: '0 6px 20px rgba(225, 29, 72, 0.35)',
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
                <div style={{ width: '1.5px', height: '55%', backgroundColor: 'rgba(255, 255, 255, 0.35)' }} />
              )}
              <div
                onMouseEnter={() => handleMouseEnter(fact)}
                onMouseLeave={handleMouseLeave}
                style={{
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  cursor: 'pointer',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  padding: '0.35rem 0.75rem',
                  borderRadius: '12px',
                  backgroundColor: hoveredFact === fact ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <span style={{ fontSize: '1rem', color: hoveredFact === fact ? '#FFE4E6' : '#FFFFFF' }}>👉</span>
                <span>{fact.shortTitle}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Sparkle Icon */}
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, paddingLeft: '0.5rem', color: '#FFE4E6' }}>
          <Sparkles size={18} color="#FFE4E6" />
        </div>
      </div>
    </div>
  );
}
