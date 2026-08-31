import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useHybridVoice } from '../../../../hooks/useHybridVoice';

const facts = [
  {
    id: 'metal_magnetic',
    title: "Not every metal is magnetic",
    shortTitle: "Not every metal is magnetic",
    content: "A magnet does not attract every metal. Iron, nickel, and cobalt stick to magnets, but metals like aluminium, copper, silver, and gold do not. That is why some metal objects are magnetic while others are not!",
    audioUrl: '/audio/not_every_metal.mp3'
  },
  {
    id: 'electricity_magnetism',
    title: "Electricity and magnetism",
    shortTitle: "Electricity and magnetism",
    content: "More than 200 years ago, scientist Hans Christian Ørsted noticed that a compass needle moved near an electric wire. This discovery showed that electricity and magnetism are connected.",
    audioUrl: '/audio/electricity_magnetism.mp3'
  },
  {
    id: 'recycling_magnets',
    title: "Magnets in recycling",
    shortTitle: "Magnets in recycling",
    content: "Magnets are used in recycling centres to separate iron and steel from other waste. This helps recycle metals faster and keeps the environment cleaner.",
    audioUrl: '/audio/recycling_magnets.mp3'
  },
  {
    id: 'data_storage',
    title: "Data storage",
    shortTitle: "Data storage",
    content: "Many modern devices, such as computers and data storage systems, use tiny magnets to store information. These magnets help keep your photos, videos, and files safe.",
    audioUrl: '/audio/data_storage.mp3'
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
      {/* Floating Hover Tooltip Card with Warm Amber Border & Dark Green Text */}
      {hoveredFact && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 14px)',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '95%',
          maxWidth: '750px',
          background: 'linear-gradient(145deg, #FFFFFF 0%, #FFFBEB 50%, #FEF3C7 100%)',
          border: '1.5px solid #FDE68A',
          borderRadius: '24px',
          padding: '1.45rem 2rem',
          color: '#064E3B',
          boxShadow: '0 20px 45px rgba(217, 119, 6, 0.16), 0 4px 14px rgba(0, 0, 0, 0.06)',
          zIndex: 100000,
          pointerEvents: 'none',
          backdropFilter: 'blur(16px)',
          transition: 'all 0.25s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.55rem' }}>
            <span style={{ fontSize: '1.75rem' }}>🧠</span>
            <h4 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 900, color: '#064E3B' }}>
              {hoveredFact.title}
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '1.18rem', lineHeight: '1.7', color: '#065F46', fontWeight: 700 }}>
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
        padding: '0.5rem 1.4rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        boxSizing: 'border-box',
        height: '56px',
        minHeight: '56px'
      }}>
        {/* Brain Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexShrink: 0, paddingRight: '0.85rem' }}>
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
                  fontSize: '1.06rem',
                  fontWeight: 800,
                  padding: '0.4rem 0.8rem',
                  borderRadius: '12px',
                  backgroundColor: hoveredFact === fact ? 'rgba(254, 243, 199, 0.22)' : 'transparent',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <span style={{ fontSize: '1.15rem', color: hoveredFact === fact ? '#FEF3C7' : '#FFFFFF' }}>👉</span>
                <span>{fact.shortTitle}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Sparkle Icon */}
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, paddingLeft: '0.5rem', color: '#FDE047' }}>
          <Sparkles size={18} color="#FDE047" />
        </div>
      </div>
    </div>
  );
}
