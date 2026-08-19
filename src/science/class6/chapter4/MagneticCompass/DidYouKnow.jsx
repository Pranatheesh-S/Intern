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
          maxWidth: '700px',
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

      {/* Main Bottom Bar */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 27, 75, 0.95))',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(139, 92, 246, 0.4)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.25), 0 0 20px rgba(139, 92, 246, 0.15)',
        borderRadius: '24px',
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
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#a78bfa' }}>Did You Know?</span>
        </div>

        {/* Fact items horizontally */}
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'space-around', height: '100%' }}>
          {facts.map((fact, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <div style={{ width: '1px', height: '60%', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
              )}
              <div
                onMouseEnter={() => handleMouseEnter(fact)}
                onMouseLeave={handleMouseLeave}
                style={{
                  color: hoveredFact === fact ? '#ff7700' : '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  padding: '0.4rem 0.6rem',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  transition: 'color 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <span style={{ fontSize: '1rem' }}>👉</span>
                <span>{fact.shortTitle}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Sparkle Icon */}
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, paddingLeft: '0.5rem', color: '#60a5fa' }}>
          <Sparkles size={18} />
        </div>
      </div>
    </div>
  );
}
