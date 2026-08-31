import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useHybridVoice } from '../../../../hooks/useHybridVoice';

const facts = [
  {
    id: 'earth_magnet',
    title: "Earth acts like a giant magnet",
    shortTitle: "Earth as a Magnet",
    content: "If you suspend a bar magnet freely, it always comes to rest pointing in the North-South direction because Earth acts like a giant magnet!",
    audioUrl: '/audio/earth_magnet.mp3'
  },
  {
    id: 'ancient_compass',
    title: "Ancient Chinese Travelers",
    shortTitle: "Ancient Compasses",
    content: "More than 1,000 years ago, travelers and sailors used magnetic lodestones and suspended magnets to navigate long journeys across land and sea.",
    audioUrl: '/audio/ancient_compass.mp3'
  },
  {
    id: 'emperor_chariot',
    title: "Chariot of Emperor Hoang-Ti",
    shortTitle: "Emperor's Chariot",
    content: "Legend says Emperor Hoang-Ti had a chariot with a wooden statue of a woman holding an extended arm that always pointed towards the South!",
    audioUrl: '/audio/emperor_chariot.mp3'
  },
  {
    id: 'north_seeking',
    title: "North-Seeking Pole",
    shortTitle: "North-Seeking Pole",
    content: "The end of a magnet that points towards the geographic North is called the North-seeking pole, or simply the North Pole.",
    audioUrl: '/audio/north_seeking.mp3'
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
      audioUrl: fact.audioUrl
    });
  };

  const handleMouseLeave = () => {
    setHoveredFact(null);
    stop();
  };

  // Warm amber text with vibrant orange for currently reading word only
  const renderHighlightedContent = (content, title, charIndex) => {
    if (!content) return null;
    if (charIndex === undefined || charIndex === null || charIndex < 0) {
      return <span style={{ color: '#78350F' }}>{content}</span>;
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

      let color = '#78350F';
      let fontWeight = 600;

      if (isCurrentWord) {
        color = '#D97706';
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
      {/* Floating Hover Tooltip Card with White Background & Warm Amber Text */}
      {hoveredFact && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 14px)',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '95%',
          maxWidth: '720px',
          background: '#FFFFFF',
          border: '1.5px solid #FDE68A',
          borderRadius: '22px',
          padding: '1.35rem 1.85rem',
          color: '#064E3B',
          boxShadow: '0 20px 45px rgba(217, 119, 6, 0.16), 0 4px 12px rgba(0, 0, 0, 0.06)',
          zIndex: 100000,
          pointerEvents: 'none',
          backdropFilter: 'blur(16px)',
          transition: 'all 0.25s ease',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '1.75rem' }}>🧠</span>
            <h4 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 900, color: '#064E3B' }}>
              {hoveredFact.title}
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '1.18rem', lineHeight: '1.65', color: '#065F46', fontWeight: 600 }}>
            {renderHighlightedContent(hoveredFact.content, hoveredFact.title, spokenCharIndex)}
          </p>
        </div>
      )}

      {/* Main Bottom Bar */}
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
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  padding: '0.35rem 0.75rem',
                  borderRadius: '12px',
                  backgroundColor: hoveredFact === fact ? 'rgba(254, 243, 199, 0.2)' : 'transparent',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <span style={{ fontSize: '1.25rem', color: hoveredFact === fact ? '#F59E0B' : '#F59E0B' }}>👉</span>
                <span>{fact.shortTitle}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Sparkle Icon */}
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, paddingLeft: '0.5rem', color: '#F59E0B' }}>
          <Sparkles size={22} color="#F59E0B" />
        </div>
      </div>
    </div>
  );
}
